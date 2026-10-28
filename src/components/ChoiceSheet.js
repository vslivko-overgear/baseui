import { h, cx, useState, useEffect, useMemo, useRef, useId } from '../react.js';
import { Modal } from './Modal.js';
import { TextField } from './TextField.js';
import { Button } from './Button.js';
import { Icon } from '../icons.js';
import { optionLabel } from './dropdown-parts.js';

const matches = (option, query) => optionLabel(option, option.value).toLocaleLowerCase().includes(query);

/**
 * The mobile list of a Selector or a Typeahead: a bottom sheet with the options (and a search for a Typeahead), which picks the value
 * at once (`commitOnSelect`) or on Apply. It is a Modal; the options are plain buttons, so the page keeps its own scroll and keyboard.
 */
export function ChoiceSheet({
  open, title, options, value, multiple, searchable = false, emptyText = 'Nothing found', searchPlaceholder = 'Type', searchLabel = 'Search', action, commitOnSelect = false, modalProps, modalRef, onCommit, onOpenChange,
}) {
  const [picked, setPicked] = useState(value);
  const [query, setQuery] = useState('');
  const idBase = useId();
  const search = useRef(null);
  useEffect(() => { if (open) { setPicked(value); setQuery(''); } }, [open, value]);
  const shown = useMemo(() => { const q = query.trim().toLocaleLowerCase(); return q ? options.filter((o) => matches(o, q)) : options; }, [options, query]);
  const isOn = (v) => (Array.isArray(picked) ? picked.includes(v) : picked === v);
  const choose = (v) => {
    const next = multiple ? (isOn(v) ? picked.filter((x) => x !== v) : [...picked, v]) : v;
    setPicked(next);
    if (commitOnSelect) onCommit(next);
  };
  const button = h(Button, { width: '100%', 'data-testid': 'choice-field-mobile-action', variant: action === 'close' ? 'secondary' : 'primary', size: 'md', onClick: action === 'apply' ? () => onCommit(picked) : undefined }, action === 'close' ? 'Close' : 'Apply');
  const heading = modalProps?.title === undefined ? title : modalProps.title;
  return h(Modal, {
    ...modalProps, ref: modalRef, open, title: heading, header: modalProps?.header ?? (heading ? 'close' : false), closeLabel: modalProps?.closeLabel ?? (searchable ? 'Close' : 'Close the sheet'),
    contentClassName: modalProps?.contentClassName, initialFocus: modalProps?.initialFocus ?? (searchable ? search : false), finalFocus: modalProps?.finalFocus ?? false,
    primaryAction: action === 'apply' ? button : undefined, secondaryAction: action === 'close' ? button : undefined, onOpenChange,
  },
  h('div', { className: 'bui-choice-sheet__body', 'data-testid': 'choice-field-mobile-modal-body' },
    searchable && h(TextField, { ref: search, className: 'bui-choice-sheet__search', size: 'sm', value: query, placeholder: searchPlaceholder, 'aria-label': searchLabel, 'data-testid': 'choice-field-mobile-search-input', autoComplete: 'off', clearable: true, actionLabel: 'Clear search', onChange: (e) => setQuery(e.currentTarget.value) }),
    shown.length > 0
      ? h('div', { className: cx('bui-choice-popup__list', 'bui-choice-sheet__list'), role: 'listbox', 'data-testid': 'choice-field-mobile-list', 'aria-multiselectable': multiple || undefined },
        shown.map((o, i) => {
          const on = isOn(o.value), labelId = `${idBase}-${i}-label`, detailsId = `${idBase}-${i}-details`;
          return h('button', {
            key: o.value, type: 'button', role: 'option', className: cx('bui-choice-popup__item', 'bui-choice-sheet__option'), 'aria-selected': on, 'aria-labelledby': labelId, 'aria-describedby': o.details ? detailsId : undefined,
            disabled: o.disabled, 'data-testid': `choice-field-mobile-option-${o.value}`, 'data-disabled': o.disabled || undefined, 'data-selected': on || undefined, onClick: () => choose(o.value),
          },
          h('span', { id: labelId, className: 'bui-choice-popup__item-text' }, o.label),
          o.details && h('span', { id: detailsId, className: 'bui-choice-popup__details' }, o.details),
          h('span', { className: 'bui-choice-popup__indicator', 'aria-hidden': 'true' }, on && h(Icon, { name: 'check', size: 24 })));
        }))
      : h('div', { className: 'bui-choice-popup__empty', role: 'status' }, emptyText)));
}
