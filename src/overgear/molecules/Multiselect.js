import { h, cx, useState, useRef, useEffect, useMemo, useId, useControllable, Fragment } from '../../react.js';
import { Popover } from '../../components/Popover.js';
import { Checkbox } from '../../components/Checkbox.js';
import { Chip } from '../../components/Chip.js';
import { Spinner } from '../../components/Spinner.js';
import { ChoiceSheet } from '../../components/ChoiceSheet.js';
import { SHEET_QUERY } from '../../components/Select.js';
import { Icon } from '../../icons.js';
import { useMediaQuery } from '../../theme-flags.js';
import { Hint } from './Hint.js';
import { describe } from '../../doc.js';

const SearchIcon = () => h('svg', { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', className: 'og-multiselect__icon' }, h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'm21 21-4.3-4.3' }));

/** The text of an option for filtering and for chips: `textLabel`, else the label when it is a string, else the value. */
export const getItemText = (item) => item.textLabel ?? (typeof item.label === 'string' ? item.label : String(item.value));
/** Default search: the option text contains the query, ignoring case. */
export const defaultFilter = (item, query) => getItemText(item).toLowerCase().includes(query.toLowerCase());
/** The text of a trigger without chips: nothing, the one label, "All selected" or "N selected". */
export const getSelectedText = (items, total) => (items.length === 0 ? '' : items.length === total ? 'All selected' : items.length === 1 ? getItemText(items[0]) : `${items.length} selected`);

/** Search, selection and select-all logic of the list. */
function useSelection({ options, values, filter }) {
  const [search, setSearch] = useState('');
  const shown = useMemo(() => (search ? options.filter((o) => filter(o, search)) : options), [options, search, filter]);
  const selectable = shown.filter((o) => !o.disabled);
  const all = selectable.length > 0 && selectable.every((o) => values.includes(o.value));
  const toggle = (o) => (o.disabled ? values : values.includes(o.value) ? values.filter((v) => v !== o.value) : [...values, o.value]);
  const toggleAll = () => (all ? values.filter((v) => !shown.some((o) => o.value === v && !o.disabled)) : [...values, ...selectable.map((o) => o.value).filter((v) => !values.includes(v))]);
  return { search, setSearch, shown, all, toggle, toggleAll };
}

/**
 * A field that picks several options from a list. The control shows the selection as removable chips or as text ("3 selected"), and
 * opens a panel with an optional search, a select-all row, the checkbox options, an empty state and a footer. Up to 1200px the panel
 * becomes a bottom sheet with an Apply button. The value is the array of the selected option values.
 */
export function Multiselect({
  options = [], value, defaultValue = [], onValueChange, label, placeholder = 'Select options...', searchPlaceholder = 'Search...', emptyText = 'No results found', size = 'md',
  disabled = false, error = false, errorText, startIcon, hintText, hintPlacement = 'top-center', hintPosition = 'right', withClear = false, withChips = false, removeChipLabel = 'Remove',
  clearLabel = 'Clear selection', withSelectAll = true, selectAllLabel = 'Select all', withSearch = false, loading = false, loadingText = 'Loading...', maxHeight = 240, footer,
  getButtonLabel, getOptionLabel, filterFunction = defaultFilter, mobileTitle, open, defaultOpen = false, onOpenChange, id, name, className, ...rest
}) {
  const [values, setValues] = useControllable(value, defaultValue, onValueChange);
  const [isOpen, setOpenRaw] = useControllable(open, defaultOpen, onOpenChange);
  const sheet = useMediaQuery(SHEET_QUERY);
  const autoId = useId();
  const fieldId = id ?? autoId;
  const listId = `${fieldId}-list`;
  const inputRef = useRef(null);
  const sel = useSelection({ options, values, filter: filterFunction });
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const chosen = values.map((v) => byValue.get(v)).filter(Boolean);
  const setOpen = (next) => { if (disabled) return; setOpenRaw(next); if (!next) sel.setSearch(''); };
  const searching = isOpen && withSearch && !sheet;
  const showChips = withChips && chosen.length > 0;
  const showClear = withClear && values.length > 0 && !disabled;
  const text = chosen.length > 0 && !showChips ? (getButtonLabel ? getButtonLabel(chosen) : getSelectedText(chosen, options.length)) : null;

  useEffect(() => { if (searching) inputRef.current?.focus(); }, [searching]);

  const remove = (o) => setValues(values.filter((v) => v !== o.value));
  const clear = (e) => { e.stopPropagation(); e.preventDefault(); setValues([]); sel.setSearch(''); setOpen(false); };
  const focusList = (first) => { const boxes = [...document.querySelectorAll(`#${CSS.escape(listId)} [role="checkbox"]:not([data-disabled])`)]; (first ? boxes[0] : boxes[boxes.length - 1])?.focus(); };
  const searchKeys = (e) => {
    if (e.key === 'Backspace' && showChips && !sel.search) { const last = [...chosen].reverse().find((o) => !o.disabled); if (last) remove(last); }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };
  const controlKeys = (e) => {
    if (disabled || e.target !== e.currentTarget && e.target !== inputRef.current) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen) setOpen(true); setTimeout(() => focusList(true), 30); }
    else if ((e.key === 'Enter' || e.key === ' ') && !searching) { e.preventDefault(); setOpen(!isOpen); }
  };
  const listKeys = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const boxes = [...e.currentTarget.querySelectorAll('[role="checkbox"]:not([data-disabled])')];
    const i = boxes.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
    if (next < 0) (inputRef.current ?? document.getElementById(fieldId))?.focus(); else boxes[Math.min(next, boxes.length - 1)]?.focus();
  };

  const input = h('input', { ref: inputRef, name, type: 'text', className: cx('og-multiselect__search', showChips && 'og-multiselect__search--chips'), value: sel.search, placeholder: searchPlaceholder, 'aria-label': searchPlaceholder, autoComplete: 'off', disabled, onChange: (e) => sel.setSearch(e.currentTarget.value), onKeyDown: searchKeys });
  const labelNode = (o) => (getOptionLabel ? getOptionLabel(o) : o.label);

  const chips = showChips && h('span', { className: 'og-multiselect__chips' },
    chosen.map((o) => h(Chip, { key: String(o.value), size: 'sm', action: !disabled && !o.disabled, disabled: disabled || undefined, actionLabel: `${removeChipLabel} ${getItemText(o)}`, onAction: () => remove(o), onClick: (e) => e.stopPropagation() }, labelNode(o))),
    searching && input);

  const control = (props) => h('div', {
    ...props, id: fieldId, role: 'combobox', 'aria-controls': isOpen && !sheet ? listId : undefined, 'aria-label': label ? undefined : placeholder, 'aria-labelledby': label ? `${fieldId}-label` : undefined, 'aria-invalid': error || undefined, 'aria-disabled': disabled || undefined,
    'data-slot': 'multiselect-control', 'data-open': isOpen || undefined, 'data-error': error || undefined, 'data-disabled': disabled || undefined, 'data-chips': showChips || undefined, tabIndex: disabled ? -1 : 0,
    className: cx('og-multiselect__control', `og-multiselect__control--${size}`), onKeyDown: controlKeys,
    onClick: () => { if (disabled) return; if (!isOpen || sheet) setOpen(true); else if (!withSearch) setOpen(false); else inputRef.current?.focus(); },
  },
  h('span', { className: 'og-multiselect__lead' },
    (withSearch && !sheet) ? h(SearchIcon) : startIcon && h('span', { className: 'og-multiselect__icon' }, startIcon),
    chips || h('span', { className: cx('og-multiselect__value', !text && 'og-multiselect__value--placeholder') }, searching ? input : (text ?? placeholder))),
  h('span', { className: 'og-multiselect__tail' },
    loading && h(Spinner, { size: 'xsm', color: 'secondary' }),
    showClear && h('button', { type: 'button', className: 'og-multiselect__clear', 'aria-label': clearLabel, onClick: clear }, h(Icon, { name: 'close', size: 20 })),
    h(Icon, { name: 'chevronDown', size: 20, className: 'og-multiselect__chevron' })));

  const hint = hintText && h(Hint, { text: hintText, placement: hintPlacement });
  const head = label && h('div', { className: 'og-multiselect__head' }, hintPosition === 'left' && hint, h('label', { id: `${fieldId}-label`, htmlFor: fieldId, className: 'og-multiselect__label' }, label), hintPosition === 'right' && hint);

  const body = h('div', { className: 'og-multiselect__body' },
    h('div', { id: listId, role: 'group', 'aria-label': label ?? placeholder, 'aria-busy': loading || undefined, className: 'og-multiselect__list', style: { maxHeight }, onKeyDown: listKeys },
      loading && h('div', { className: 'og-multiselect__status', role: 'status' }, h(Spinner, { size: 'xsm', color: 'secondary' }), loadingText),
      !loading && withSelectAll && sel.shown.length > 0 && h(Checkbox, { size: 'sm', className: 'og-multiselect__option', checked: sel.all, indeterminate: values.length > 0 && !sel.all, onCheckedChange: () => setValues(sel.toggleAll()), label: selectAllLabel }),
      !loading && sel.shown.length === 0 && h('div', { className: 'og-multiselect__status og-multiselect__empty', role: 'status' }, emptyText),
      !loading && sel.shown.map((o) => h(Checkbox, { key: String(o.value), size: 'sm', className: 'og-multiselect__option', checked: values.includes(o.value), disabled: o.disabled, onCheckedChange: () => setValues(sel.toggle(o)), label: labelNode(o) }))),
    footer && h('div', { className: 'og-multiselect__footer' }, footer));

  const sheetOptions = useMemo(() => options.map((o) => ({ value: o.value, label: getOptionLabel ? getOptionLabel(o) : o.label, disabled: o.disabled })), [options, getOptionLabel]);
  return h('div', { 'data-slot': 'multiselect', className: cx('og-multiselect', className), ...rest },
    head,
    sheet
      ? h(Fragment, null, control({ 'aria-haspopup': 'dialog', 'aria-expanded': isOpen }),
        h(ChoiceSheet, { open: isOpen, title: mobileTitle ?? label ?? placeholder, options: sheetOptions, value: values, multiple: true, searchable: withSearch, emptyText, searchPlaceholder, action: 'apply', onCommit: (next) => { setValues(next); setOpen(false); }, onOpenChange: (o) => setOpen(o)}))
      : h(Popover, { open: isOpen, onOpenChange: setOpen, matchWidth: true, label: label ?? placeholder, className: 'og-multiselect__popover', panelClassName: 'og-multiselect__panel', trigger: control }, body),
    error && errorText && h('p', { className: 'og-multiselect__error', role: 'alert' }, errorText));
}
describe(Multiselect, 'A field that picks several options from a list. The selection shows as removable chips or as text, the panel has a search, a select-all row, checkbox options, an empty state, a loading state and a footer; up to 1200px the panel is a bottom sheet with an Apply button. The value is the array of selected option values.', {
  options: ['Array<{ value: string | number; label: ReactNode; disabled?: boolean; textLabel?: string }>', '[]', 'Options; `textLabel` is the text used for search and chips when `label` is not a string'],
  value: ['Array<string | number>', null, 'Selected values (controlled)'],
  defaultValue: ['Array<string | number>', '[]', 'Initially selected values (uncontrolled)'],
  onValueChange: ['(values: Array<string | number>) => void', null, 'Called with the new array of selected values'],
  label: ['string', null, 'Label above the field'],
  placeholder: ['string', "'Select options...'", 'Shown while nothing is selected'],
  searchPlaceholder: ['string', "'Search...'", 'Placeholder and accessible name of the search input'],
  emptyText: ['string', "'No results found'", 'Shown when no option matches the search'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Height of the control'],
  disabled: ['boolean', 'false', 'Disabled state'],
  error: ['boolean', 'false', 'Error state'],
  errorText: ['string', null, 'Error text under the field (shown with `error`)'],
  startIcon: ['ReactNode', null, 'Icon on the left of the control (replaced by the search icon with `withSearch`)'],
  hintText: ['string', null, 'Text of a Hint next to the label'],
  hintPlacement: ['HintPlacement', "'top-center'", 'Placement of the hint card'],
  hintPosition: ["'left' | 'right'", "'right'", 'Side of the label the hint icon sits on'],
  withClear: ['boolean', 'false', 'Show a button that clears the selection'],
  withChips: ['boolean', 'false', 'Show the selection as removable chips; the control grows as they wrap'],
  removeChipLabel: ['string', "'Remove'", 'Prefix of the accessible name of a chip remove button'],
  clearLabel: ['string', "'Clear selection'", 'Accessible name of the clear button'],
  withSelectAll: ['boolean', 'true', 'Show the select-all row (it works on the options that match the search)'],
  selectAllLabel: ['string', "'Select all'", 'Label of the select-all row'],
  withSearch: ['boolean', 'false', 'Turn the control into a search input while open'],
  loading: ['boolean', 'false', 'Options are loading: a spinner in the control, and a loading row instead of the options'],
  loadingText: ['string', "'Loading...'", 'Text of the loading row'],
  maxHeight: ['number', '240', 'Maximum height of the option list, px'],
  footer: ['ReactNode', null, 'Static area under the scrolling list'],
  getButtonLabel: ['(items) => ReactNode', null, 'Custom text of the control (ignored with `withChips`)'],
  getOptionLabel: ['(item) => ReactNode', null, 'Custom render of an option label'],
  filterFunction: ['(item, query: string) => boolean', null, 'Custom search'],
  mobileTitle: ['string', null, 'Title of the bottom sheet (the label or the placeholder by default)'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open (uncontrolled)'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when the panel opens or closes'],
  id: ['string', null, 'Id of the control'],
  name: ['string', null, 'Name of the search input'],
  className: ['string', null, 'Extra class of the root'],
});
