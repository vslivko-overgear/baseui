import { h, cx, isValidElement, useState, useRef, useEffect, useMemo, useId } from '../react.js';
import { Select as BaseSelect } from '@base-ui/react/select';
import { FieldShell } from './FieldShell.js';
import { ChoiceSheet } from './ChoiceSheet.js';
import { DropdownList, isOption } from './dropdown-parts.js';
import { Icon } from '../icons.js';
import { useMediaQuery } from '../theme-flags.js';
import { describe } from '../doc.js';

/** Up to this width a Selector and a Typeahead open a bottom sheet instead of a dropdown. */
export const SHEET_QUERY = '(max-width: 1200px)';

/** Focus leaving the field for its own list (the popup or the sheet) is not a blur: the host gets `onBlur` only when the focus really goes elsewhere. */
export function useChoiceBlur(onBlur) {
  const positionerRef = useRef(null);
  const modalRef = useRef(null);
  return {
    positionerRef, modalRef,
    handleBlur: (e) => {
      const next = e.relatedTarget;
      if ((next instanceof Node && e.currentTarget.contains(next)) || (next instanceof Node && positionerRef.current?.contains(next)) || (next instanceof Node && modalRef.current?.contains(next))) return;
      onBlur?.(e);
    },
  };
}

/** The press events of the field on a phone: they open the sheet (the Base UI popup stays closed), a touch waits for the end of the gesture. */
export function useSheetTrigger(setOpen, reason) {
  const pointerType = useRef(null);
  const open = (event, trigger) => {
    let canceled = false, propagation = false;
    setOpen(true, { reason, event, trigger, cancel: () => { canceled = true; }, allowPropagation: () => { propagation = true; }, get isCanceled() { return canceled; }, get isPropagationAllowed() { return propagation; } });
  };
  return {
    onPointerDown: (e) => { if (e.button !== 0 || e.ctrlKey) return; pointerType.current = e.pointerType; e.preventDefault(); },
    onPointerUp: (e) => { if (e.button !== 0 || e.ctrlKey || e.pointerType !== 'touch') return; const native = e.nativeEvent, el = e.currentTarget; window.setTimeout(() => open(native, el), 0); },
    onClick: (e) => { const type = pointerType.current; pointerType.current = null; if (type !== 'touch' || e.detail === 0) open(e.nativeEvent, e.currentTarget); },
  };
}

/** The "Select all" row of a multiple field: its label and what it does. */
export function selectAllRow(selectAll, options, value, change) {
  if (!selectAll) return null;
  const values = options.filter((o) => isOption(o) && !o.disabled).map((o) => o.value);
  const all = values.length > 0 && values.every((v) => (value || []).includes(v));
  return { label: typeof selectAll === 'string' ? selectAll : all ? 'Remove all' : 'Select all', onClick: () => change(all ? [] : values) };
}

const PARTS = { Portal: BaseSelect.Portal, Positioner: BaseSelect.Positioner, Popup: BaseSelect.Popup, List: BaseSelect.List, Item: BaseSelect.Item, ItemText: BaseSelect.ItemText, Indicator: BaseSelect.ItemIndicator };

/**
 * A selector: a field, or any element, that opens a list of options. The Base UI Select inside the shared field shell (the shell sits outside
 * Select.Root so that the filled state reaches the Field). Single and multiple selection. Up to 1200px the list is a bottom sheet.
 * For searching the options use the Typeahead.
 */
export function Select({
  trigger, options, label, placeholder, floatingLabel = true, caption, status, value, defaultValue, multiple = false, selectAll = false, onValueChange, onBlur, className, ref, disabled = false, loading = false,
  variant, size, startIcon, prefix, suffix, modal = true, mobileModalProps, open, defaultOpen = false, onOpenChange, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, ...rest
}) {
  const sheet = useMediaQuery(SHEET_QUERY);
  const custom = trigger != null;
  const customTrigger = custom ? (isValidElement(trigger) ? trigger : h('button', { type: 'button', className: 'bui-select-trigger' }, trigger)) : null;
  const idBase = useId();
  const captionId = useId();
  const { positionerRef, modalRef, handleBlur } = useChoiceBlur(onBlur);
  const cell = useRef(null);
  const [inner, setInner] = useState(() => defaultValue ?? (multiple ? [] : null));
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const current = value === undefined ? inner : value;
  const isOpen = open ?? innerOpen;
  const wasOpen = useRef(isOpen);
  // the sheet closing is a blur of the field: the host (a form) validates on it
  useEffect(() => {
    if (sheet && wasOpen.current && !isOpen) cell.current?.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    wasOpen.current = isOpen;
  }, [sheet, isOpen]);
  const change = (next) => { if (value === undefined) setInner(next); onValueChange?.(next); };
  const setOpen = (next, details) => { onOpenChange?.(next, details); if (!details.isCanceled && open === undefined) setInnerOpen(next); };
  const rootOpenChange = (next, details) => { if (sheet) { if (next) setOpen(true, details); return; } setOpen(next, details); };
  const press = useSheetTrigger(setOpen, 'trigger-press');
  const items = useMemo(() => options.filter(isOption).map(({ value: v, label: l }) => ({ value: v, label: l })), [options]);
  const invalid = status === 'error';
  const describedBy = [ariaDescribedBy, caption ? captionId : undefined].filter(Boolean).join(' ') || undefined;
  const triggerProps = {
    ref, ...(sheet ? { 'aria-expanded': isOpen, ...press } : {}), ...(ariaLabel ? { 'aria-label': ariaLabel } : {}), ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
  };
  const body = h(BaseSelect.Root, { ...rest, disabled: disabled || loading, modal: !sheet && modal, items, multiple, value: current, open: !sheet && isOpen, onOpenChange: rootOpenChange, onValueChange: (v) => change(v) },
    custom
      ? h(BaseSelect.Trigger, { ...triggerProps, render: customTrigger })
      : h(BaseSelect.Trigger, { ...triggerProps, className: 'bui-select__trigger', 'data-testid': 'select-trigger', 'aria-invalid': invalid || undefined, 'aria-describedby': describedBy },
        prefix && h('span', { className: 'bui-select__affix' }, prefix),
        h(BaseSelect.Value, { className: 'bui-select__value', placeholder: placeholder ?? label }),
        suffix && h('span', { className: 'bui-select__affix' }, suffix),
        h(BaseSelect.Icon, { className: 'bui-select__chevron' }, h(Icon, { name: 'chevronDown', size: 24, 'aria-hidden': 'true' }))),
    !sheet && h(DropdownList, { parts: PARTS, mode: 'select', size, selectAll: selectAllRow(selectAll, options, current, change), positionerRef, anchor: cell, menu: custom, options, idBase, testIdPrefix: 'select-option' }),
    sheet && h(ChoiceSheet, { open: isOpen, title: label, options: options.filter(isOption), value: current, multiple, action: multiple ? 'apply' : 'close', commitOnSelect: !multiple, modalProps: mobileModalProps, modalRef, onCommit: change, onOpenChange: (o, d) => setOpen(o, d) }));
  if (custom) return body;
  return h(FieldShell, { control: 'select', variant, size, label, floatingLabel, caption, captionId, status, disabled, loading, startIcon, multiple, onBlur: handleBlur, cellRef: cell, className: cx(suffix && 'bui-select__has-suffix', className) }, body);
}
describe(Select, 'A field, or any element, that opens a list of options: the Base UI Select in the shared field shell. Single and multiple selection; up to 1200px the list is a bottom sheet.', {
  options: ['Array<{ value: string; label: ReactNode; details?; icon?; avatar?; subitem?; disabled? } | { type: \'group\'; label } | { type: \'divider\' }>', null, 'Options, group titles and dividers'],
  value: ['string | string[] | null', null, 'Selected value, or the values when `multiple` (controlled)'],
  defaultValue: ['string | string[] | null', null, 'Initial selection (uncontrolled)'],
  onValueChange: ['(value) => void', null, 'Called when the selection changes'],
  trigger: ['ReactNode', null, 'Any element that opens the list: a button, an icon button or text. Without it the field itself is the trigger. A string becomes a plain button; an element gets the trigger props and a ref'],
  label: ['ReactNode', null, 'Field label'],
  placeholder: ['string', null, 'Shown when nothing is selected; by default the label'],
  floatingLabel: ['boolean', 'true', 'Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered'],
  variant: ["'filled' | 'standard'", "'filled'", 'Visual variant: `filled` has a background (the main one), `standard` has none'],
  size: ["'md' | 'sm'", "'md'", 'Size: md is 56px with 16px text, sm is 48px with 14px text; the list follows it'],
  caption: ['ReactNode', null, 'The only text under the field: a gray hint, and with `status` a colored message'],
  status: ["'error' | 'warning' | 'success'", null, 'Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green'],
  prefix: ['ReactNode', null, 'Prefix before the value'],
  suffix: ['ReactNode', null, 'Suffix after the value'],
  startIcon: ['ReactNode', null, 'Icon at the start of the field (24px)'],
  multiple: ['boolean', 'false', 'Several options can be selected; on a phone the sheet gets an Apply button'],
  selectAll: ['boolean', 'false', 'Multiple only: a "Select all" / "Remove all" row above the options'],
  disabled: ['boolean', 'false', 'Disabled state'],
  loading: ['boolean', 'false', 'Loading state: a skeleton instead of the content, input is blocked'],
  modal: ['boolean', 'true', 'Block the page behind the open list'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open'],
  onOpenChange: ['(open: boolean, details) => void', null, 'Called when the list opens or closes'],
  mobileModalProps: ['object', null, 'Settings of the Modal used instead of the dropdown up to 1200px inclusive'],
  className: ['string', null, 'Extra class on the outer wrapper (merged)'],
  ref: ['Ref<HTMLButtonElement>', null, 'Ref to the trigger button (`<button role="combobox">`)'],
});
