import { cx, useState, useRef, useEffect, useMemo, useCallback, useId } from '../react.js';
import { Combobox } from '@base-ui/react/combobox';
import { FieldShell } from './FieldShell.jsx';
import { ChoiceSheet } from './ChoiceSheet.jsx';
import { DropdownList, isOption, optionLabel } from './dropdown-parts.jsx';
import { SHEET_QUERY, useChoiceBlur, useSheetTrigger, selectAllRow } from './Selector.jsx';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { useMediaQuery } from '../theme-flags.js';
import { describe } from '../doc.js';

const PARTS = {
  Portal: Combobox.Portal,
  Positioner: Combobox.Positioner,
  Popup: Combobox.Popup,
  List: Combobox.List,
  Item: Combobox.Item,
  Indicator: Combobox.ItemIndicator,
  Empty: Combobox.Empty,
};
const text = (node) => (typeof node === 'string' || typeof node === 'number' ? String(node) : undefined);
const Clear = () => <BuiltinIcon name="close" size={24} aria-hidden="true" />;

function inputProps({
  inputId,
  inputRef,
  placeholder,
  ariaLabel,
  ariaLabelledBy,
  describedBy,
  hasError,
  readOnly,
  expanded,
  testId,
  onClick,
  onPointerDown,
  onPointerUp,
}) {
  return {
    id: inputId,
    ref: inputRef,
    className: 'bui-typeahead__input',
    placeholder,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
    'aria-describedby': describedBy || undefined,
    'aria-invalid': hasError || undefined,
    'aria-expanded': expanded,
    'data-testid': testId,
    readOnly,
    onClick,
    onPointerDown,
    onPointerUp,
  };
}

/** The control of a multiple field: the selected values as tokens (or one counter token) and the search input. */
function MultipleControl({ display, optionByValue, ...input }) {
  return (
    <Combobox.Chips className="bui-typeahead__tokens">
      <Combobox.Value>
        {(values) =>
          display === 'counter' && values.length > 0 ? (
            <Combobox.Clear className="bui-typeahead__counter-token" aria-label="Clear selected values">
              <span>Items</span>
              <span className="bui-typeahead__counter-count">{values.length}</span>
              <span className="bui-typeahead__counter-remove" aria-hidden="true">
                <Clear />
              </span>
            </Combobox.Clear>
          ) : (
            values.map((v) => {
              const o = optionByValue.get(v);
              return (
                <Combobox.Chip key={v} data-slot="typeahead-token" className="bui-typeahead__token">
                  <span className="bui-typeahead__token-text">{o?.label ?? v}</span>
                  <Combobox.ChipRemove className="bui-typeahead__token-remove" aria-label={`Remove ${optionLabel(o, v)}`}>
                    <Clear />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              );
            })
          )
        }
      </Combobox.Value>
      <Combobox.Input {...inputProps(input)} />
    </Combobox.Chips>
  );
}
/** The control of a single field: the search input, a prefix, a suffix and a clear button. */
function SingleControl({ prefix, suffix, ...input }) {
  return (
    <div style={{ display: 'contents' }}>
      {prefix && <span className="bui-typeahead__affix">{prefix}</span>}
      <Combobox.Input {...inputProps(input)} />
      {suffix && <span className="bui-typeahead__affix">{suffix}</span>}
      <Combobox.Clear className="bui-typeahead__clear" aria-label="Clear field">
        <Clear />
      </Combobox.Clear>
    </div>
  );
}

/**
 * A typeahead: a text field that suggests options as you type. The Base UI Combobox in the shared field shell (the shell sits outside the root
 * so that the filled state reaches the Field). The text you type and the selected value are separate states. Below 768px the list is a bottom sheet with a search.
 */
export function Typeahead({
  options,
  label,
  placeholder,
  floatingLabel = true,
  caption,
  status,
  value,
  defaultValue,
  multiple = false,
  selectAll = false,
  onValueChange,
  onBlur,
  className,
  emptyText = 'Nothing found',
  multipleDisplay = 'tokens',
  ref,
  id,
  disabled = false,
  loading = false,
  variant,
  size,
  startIcon,
  prefix,
  suffix,
  modal = true,
  mobileDialogProps,
  mobileSearchPlaceholder = 'Type',
  mobileSearchLabel,
  open,
  defaultOpen = false,
  onOpenChange,
  openOnInputClick = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) {
  const sheet = useMediaQuery(SHEET_QUERY);
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = useId();
  const idBase = useId();
  const captionId = useId();
  const { positionerRef, dialogRef, handleBlur } = useChoiceBlur(onBlur);
  const cell = useRef(null);
  const [inner, setInner] = useState(() => defaultValue ?? (multiple ? [] : null));
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const current = value === undefined ? inner : value;
  const isOpen = open ?? innerOpen;
  const wasOpen = useRef(isOpen);
  useEffect(() => {
    if (sheet && wasOpen.current && !isOpen) cell.current?.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    wasOpen.current = isOpen;
  }, [sheet, isOpen]);
  const change = (next) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const setOpen = (next, details) => {
    onOpenChange?.(next, details);
    if (!details.isCanceled && open === undefined) setInnerOpen(next);
  };
  const rootOpenChange = (next, details) => {
    if (sheet) {
      if (next) setOpen(true, details);
      return;
    }
    setOpen(next, details);
  };
  const press = useSheetTrigger(setOpen, 'input-press');
  const real = useMemo(() => options.filter(isOption), [options]);
  const values = useMemo(() => real.map((o) => o.value), [real]);
  const optionByValue = useMemo(() => new Map(real.map((o) => [o.value, o])), [real]);
  const labelOf = useCallback((v) => optionLabel(optionByValue.get(v), v), [optionByValue]);
  const describedBy = [ariaDescribedBy, caption ? captionId : undefined].filter(Boolean).join(' ') || undefined;
  const plainLabel = text(label);
  const plainPlaceholder = text(multiple ? (placeholder ?? label) : placeholder);
  const labelledBy = ariaLabelledBy ?? (!ariaLabel && !multiple && label ? labelId : undefined);
  const name = ariaLabel ?? (labelledBy ? undefined : plainLabel?.trim() || plainPlaceholder?.trim() || undefined);
  const input = {
    inputId,
    inputRef: ref,
    placeholder: plainPlaceholder,
    ariaLabel: name,
    ariaLabelledBy: labelledBy,
    describedBy,
    hasError: status === 'error',
    readOnly: sheet,
    expanded: sheet ? isOpen : undefined,
    testId: 'autocomplete-input',
    ...(sheet ? { onClick: press.onClick, onPointerDown: press.onPointerDown, onPointerUp: press.onPointerUp } : {}),
  };
  return (
    <FieldShell
      control="autocomplete"
      variant={variant}
      size={size}
      label={multiple ? undefined : label}
      labelId={labelId}
      floatingLabel={floatingLabel}
      caption={caption}
      captionId={captionId}
      status={status}
      disabled={disabled}
      loading={loading}
      startIcon={startIcon}
      multiple={multiple}
      valueKey={JSON.stringify(current ?? null)}
      onBlur={handleBlur}
      cellRef={cell}
      className={cx(suffix && !multiple && 'bui-typeahead__has-suffix', className)}
    >
      <Combobox.Root
        {...rest}
        id={inputId}
        disabled={disabled || loading}
        modal={!sheet && modal}
        openOnInputClick={!sheet && openOnInputClick}
        items={values}
        itemToStringLabel={labelOf}
        itemToStringValue={(v) => v}
        multiple={multiple}
        value={current}
        open={!sheet && isOpen}
        onOpenChange={rootOpenChange}
        onValueChange={(v) => change(v)}
      >
        <Combobox.InputGroup className="bui-typeahead__control">
          {multiple ? (
            <MultipleControl {...input} display={multipleDisplay} optionByValue={optionByValue} />
          ) : (
            <SingleControl {...input} prefix={prefix} suffix={suffix} />
          )}
        </Combobox.InputGroup>
        {!sheet && (
          <DropdownList
            parts={PARTS}
            mode="combobox"
            size={size}
            selectAll={selectAllRow(selectAll, options, current, change)}
            positionerRef={positionerRef}
            anchor={cell}
            options={real}
            idBase={idBase}
            testIdPrefix="autocomplete-option"
            emptyText={emptyText}
          />
        )}
        {sheet && (
          <ChoiceSheet
            open={isOpen}
            title={label ?? placeholder}
            options={real}
            value={current}
            multiple={multiple}
            searchable
            emptyText={emptyText}
            searchPlaceholder={mobileSearchPlaceholder}
            searchLabel={mobileSearchLabel ?? (plainLabel ? `Search: ${plainLabel}` : 'Search')}
            action={multiple ? 'apply' : 'close'}
            commitOnSelect={!multiple}
            dialogProps={mobileDialogProps}
            dialogRef={dialogRef}
            onCommit={change}
            onOpenChange={(o, d) => setOpen(o, d)}
          />
        )}
      </Combobox.Root>
    </FieldShell>
  );
}
describe(
  Typeahead,
  'A text field that suggests options as you type: the Base UI Combobox in the shared field shell. The typed text and the selected value are separate states. Below 768px the list is a bottom sheet with a search',
  {
    options: ['Array<{ value: string; label: ReactNode; details?; icon?; avatar?; subitem?; disabled? }>', null, 'Options'],
    value: ['string | string[] | null', null, 'Selected value, or the values when `multiple` (controlled)'],
    defaultValue: ['string | string[] | null', null, 'Initial selection (uncontrolled)'],
    onValueChange: ['(value) => void', null, 'Called when the selection changes'],
    label: ['ReactNode', null, 'Field label (a single field only; a multiple field shows tokens)'],
    placeholder: ['string', null, 'Placeholder of the search input'],
    floatingLabel: ['boolean', 'true', 'Label behavior on focus/value: true floats it up in small text, false works like a placeholder'],
    variant: ["'filled' | 'standard'", "'filled'", 'Visual variant: `filled` has a background (the main one), `standard` has none'],
    size: ["'md' | 'sm'", "'md'", 'Size: md is 56px with 16px text, sm is 48px with 14px text; the list follows it'],
    caption: ['ReactNode', null, 'The only text under the field: a gray hint, and with `status` a colored message'],
    status: [
      "'error' | 'warning' | 'success'",
      null,
      'Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green',
    ],
    prefix: ['ReactNode', null, 'Prefix before the value (a single field)'],
    suffix: ['ReactNode', null, 'Suffix after the value (a single field)'],
    startIcon: ['ReactNode', null, 'Icon at the start of the field (24px)'],
    multiple: ['boolean', 'false', 'Several options can be selected'],
    multipleDisplay: ["'tokens' | 'counter'", "'tokens'", 'How the selected values are shown in multiple mode'],
    selectAll: ['boolean', 'false', 'Multiple only: a "Select all" / "Remove all" row above the options'],
    emptyText: ['ReactNode', "'Nothing found'", 'Content of the empty state after filtering'],
    disabled: ['boolean', 'false', 'Disabled state'],
    loading: ['boolean', 'false', 'Loading state: a skeleton instead of the content, input is blocked'],
    modal: ['boolean', 'true', 'Block the page behind the open list'],
    open: ['boolean', null, 'Open state (controlled)'],
    defaultOpen: ['boolean', 'false', 'Initially open'],
    onOpenChange: ['(open: boolean, details) => void', null, 'Called when the list opens or closes'],
    openOnInputClick: ['boolean', 'true', 'Open the list when the input is clicked'],
    mobileDialogProps: ['object', null, 'Settings of the Dialog used instead of the dropdown below 768px'],
    mobileSearchPlaceholder: ['string', "'Type'", 'Placeholder of the search input inside the sheet'],
    mobileSearchLabel: ['string', "'Search'", 'Accessible name of the search input inside the sheet'],
    className: ['string', null, 'Extra class on the outer wrapper (merged)'],
    ref: ['Ref<HTMLInputElement>', null, 'Ref to the visible search input'],
  },
);
