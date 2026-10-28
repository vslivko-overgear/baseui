import { h, cx, useState, useRef, useEffect, useMemo, useCallback, useId } from '../react.js';
import { Combobox } from '@base-ui/react/combobox';
import { FieldShell } from './FieldShell.js';
import { ChoiceSheet } from './ChoiceSheet.js';
import { DropdownList, isOption, optionLabel } from './dropdown-parts.js';
import { SHEET_QUERY, useChoiceBlur, useSheetTrigger, selectAllRow } from './Select.js';
import { Icon } from '../icons.js';
import { useMediaQuery } from '../theme-flags.js';
import { describe } from '../doc.js';

const PARTS = { Portal: Combobox.Portal, Positioner: Combobox.Positioner, Popup: Combobox.Popup, List: Combobox.List, Item: Combobox.Item, Indicator: Combobox.ItemIndicator, Empty: Combobox.Empty };
const text = (node) => (typeof node === 'string' || typeof node === 'number' ? String(node) : undefined);
const Clear = () => h(Icon, { name: 'close', size: 24, 'aria-hidden': 'true' });

function inputProps({ inputId, inputRef, placeholder, ariaLabel, ariaLabelledBy, describedBy, hasError, readOnly, expanded, testId, onClick, onPointerDown, onPointerUp }) {
  return { id: inputId, ref: inputRef, className: 'bui-autocomplete__input', placeholder, ...(ariaLabel ? { 'aria-label': ariaLabel } : {}), ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}), 'aria-describedby': describedBy || undefined, 'aria-invalid': hasError || undefined, 'aria-expanded': expanded, 'data-testid': testId, readOnly, onClick, onPointerDown, onPointerUp };
}

/** The control of a multiple field: the selected values as chips (or one counter chip) and the search input. */
function MultipleControl({ display, optionByValue, ...input }) {
  return h(Combobox.Chips, { className: 'bui-autocomplete__chips' },
    h(Combobox.Value, null, (values) => (display === 'counter' && values.length > 0
      ? h(Combobox.Clear, { className: 'bui-autocomplete__counter-chip', 'aria-label': 'Clear selected values' }, h('span', null, 'Items'), h('span', { className: 'bui-autocomplete__counter-count' }, values.length), h('span', { className: 'bui-autocomplete__counter-remove', 'aria-hidden': 'true' }, h(Clear)))
      : values.map((v) => {
        const o = optionByValue.get(v);
        return h(Combobox.Chip, { key: v, 'data-slot': 'autocomplete-chip', className: 'bui-autocomplete__chip' },
          h('span', { className: 'bui-autocomplete__chip-text' }, o?.label ?? v),
          h(Combobox.ChipRemove, { className: 'bui-autocomplete__chip-remove', 'aria-label': `Remove ${optionLabel(o, v)}` }, h(Clear)));
      }))),
    h(Combobox.Input, inputProps(input)));
}
/** The control of a single field: the search input, a prefix, a suffix and a clear button. */
function SingleControl({ prefix, suffix, ...input }) {
  return h('div', { style: { display: 'contents' } },
    prefix && h('span', { className: 'bui-autocomplete__affix' }, prefix),
    h(Combobox.Input, inputProps(input)),
    suffix && h('span', { className: 'bui-autocomplete__affix' }, suffix),
    h(Combobox.Clear, { className: 'bui-autocomplete__clear', 'aria-label': 'Clear field' }, h(Clear)));
}

/**
 * A typeahead: a text field that suggests options as you type. The Base UI Combobox in the shared field shell (the shell sits outside the root
 * so that the filled state reaches the Field). The text you type and the selected value are separate states. Up to 1200px the list is a bottom sheet with a search.
 */
export function Autocomplete({
  options, label, placeholder, floatingLabel = true, caption, status, value, defaultValue, multiple = false, selectAll = false, onValueChange, onBlur, className, emptyText = 'Nothing found', multipleDisplay = 'chips', ref, id,
  disabled = false, loading = false, variant, size, startIcon, prefix, suffix, modal = true, mobileModalProps, mobileSearchPlaceholder = 'Type', mobileSearchLabel, open, defaultOpen = false, onOpenChange, openOnInputClick = true,
  'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, ...rest
}) {
  const sheet = useMediaQuery(SHEET_QUERY);
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = useId();
  const idBase = useId();
  const captionId = useId();
  const { positionerRef, modalRef, handleBlur } = useChoiceBlur(onBlur);
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
  const change = (next) => { if (value === undefined) setInner(next); onValueChange?.(next); };
  const setOpen = (next, details) => { onOpenChange?.(next, details); if (!details.isCanceled && open === undefined) setInnerOpen(next); };
  const rootOpenChange = (next, details) => { if (sheet) { if (next) setOpen(true, details); return; } setOpen(next, details); };
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
    inputId, inputRef: ref, placeholder: plainPlaceholder, ariaLabel: name, ariaLabelledBy: labelledBy, describedBy, hasError: status === 'error', readOnly: sheet, expanded: sheet ? isOpen : undefined, testId: 'autocomplete-input',
    ...(sheet ? { onClick: press.onClick, onPointerDown: press.onPointerDown, onPointerUp: press.onPointerUp } : {}),
  };
  return h(FieldShell, { control: 'autocomplete', variant, size, label: multiple ? undefined : label, labelId, floatingLabel, caption, captionId, status, disabled, loading, startIcon, multiple, onBlur: handleBlur, cellRef: cell, className: cx(suffix && !multiple && 'bui-autocomplete__has-suffix', className) },
    h(Combobox.Root, { ...rest, id: inputId, disabled: disabled || loading, modal: !sheet && modal, openOnInputClick: !sheet && openOnInputClick, items: values, itemToStringLabel: labelOf, itemToStringValue: (v) => v, multiple, value: current, open: !sheet && isOpen, onOpenChange: rootOpenChange, onValueChange: (v) => change(v) },
      h(Combobox.InputGroup, { className: 'bui-autocomplete__control' }, multiple ? h(MultipleControl, { ...input, display: multipleDisplay, optionByValue }) : h(SingleControl, { ...input, prefix, suffix })),
      !sheet && h(DropdownList, { parts: PARTS, mode: 'combobox', size, selectAll: selectAllRow(selectAll, options, current, change), positionerRef, anchor: cell, options: real, idBase, testIdPrefix: 'autocomplete-option', emptyText }),
      sheet && h(ChoiceSheet, { open: isOpen, title: label ?? placeholder, options: real, value: current, multiple, searchable: true, emptyText, searchPlaceholder: mobileSearchPlaceholder, searchLabel: mobileSearchLabel ?? (plainLabel ? `Search: ${plainLabel}` : 'Search'), action: 'apply', modalProps: mobileModalProps, modalRef, onCommit: change, onOpenChange: (o, d) => setOpen(o, d) })));
}
describe(Autocomplete, 'A text field that suggests options as you type: the Base UI Combobox in the shared field shell. The typed text and the selected value are separate states. Up to 1200px the list is a bottom sheet with a search.', {
  options: ['Array<{ value: string; label: ReactNode; details?; icon?; avatar?; subitem?; disabled? }>', null, 'Options'],
  value: ['string | string[] | null', null, 'Selected value, or the values when `multiple` (controlled)'],
  defaultValue: ['string | string[] | null', null, 'Initial selection (uncontrolled)'],
  onValueChange: ['(value) => void', null, 'Called when the selection changes'],
  label: ['ReactNode', null, 'Field label (a single field only; a multiple field shows chips)'],
  placeholder: ['string', null, 'Placeholder of the search input'],
  floatingLabel: ['boolean', 'true', 'Label behavior on focus/value: true floats it up in small text, false works like a placeholder'],
  variant: ["'filled' | 'standard'", "'filled'", 'Visual variant: `filled` has a background (the main one), `standard` has none'],
  size: ["'md' | 'sm'", "'md'", 'Size: md is 56px with 16px text, sm is 48px with 14px text; the list follows it'],
  caption: ['ReactNode', null, 'The only text under the field: a gray hint, and with `status` a colored message'],
  status: ["'error' | 'warning' | 'success'", null, 'Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green'],
  prefix: ['ReactNode', null, 'Prefix before the value (a single field)'],
  suffix: ['ReactNode', null, 'Suffix after the value (a single field)'],
  startIcon: ['ReactNode', null, 'Icon at the start of the field (24px)'],
  multiple: ['boolean', 'false', 'Several options can be selected'],
  multipleDisplay: ["'chips' | 'counter'", "'chips'", 'How the selected values are shown in multiple mode'],
  selectAll: ['boolean', 'false', 'Multiple only: a "Select all" / "Remove all" row above the options'],
  emptyText: ['ReactNode', "'Nothing found'", 'Content of the empty state after filtering'],
  disabled: ['boolean', 'false', 'Disabled state'],
  loading: ['boolean', 'false', 'Loading state: a skeleton instead of the content, input is blocked'],
  modal: ['boolean', 'true', 'Block the page behind the open list'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open'],
  onOpenChange: ['(open: boolean, details) => void', null, 'Called when the list opens or closes'],
  openOnInputClick: ['boolean', 'true', 'Open the list when the input is clicked'],
  mobileModalProps: ['object', null, 'Settings of the Modal used instead of the dropdown up to 1200px inclusive'],
  mobileSearchPlaceholder: ['string', "'Type'", 'Placeholder of the search input inside the sheet'],
  mobileSearchLabel: ['string', "'Search'", 'Accessible name of the search input inside the sheet'],
  className: ['string', null, 'Extra class on the outer wrapper (merged)'],
  ref: ['Ref<HTMLInputElement>', null, 'Ref to the visible search input'],
});
