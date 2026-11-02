import { cx, useState, useEffect, useMemo, useRef, useId } from '../react.js';
import { Dialog } from './Dialog.jsx';
import { TextInput } from './TextInput.jsx';
import { Button } from './Button.jsx';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { optionLabel } from './dropdown-parts.jsx';

const matches = (option, query) => optionLabel(option, option.value).toLocaleLowerCase().includes(query);

/**
 * The mobile list of a Selector or a Typeahead: a bottom sheet with the options (and a search for a Typeahead), which picks the value
 * at once (`commitOnSelect`) or on Apply. It is a Dialog; the options are plain buttons, so the page keeps its own scroll and keyboard.
 */
export function ChoiceSheet({
  open,
  title,
  options,
  value,
  multiple,
  searchable = false,
  emptyText = 'Nothing found',
  searchPlaceholder = 'Type',
  searchLabel = 'Search',
  action,
  commitOnSelect = false,
  dialogProps,
  dialogRef,
  onCommit,
  onOpenChange,
}) {
  const [picked, setPicked] = useState(value);
  const [query, setQuery] = useState('');
  const idBase = useId();
  const search = useRef(null);
  useEffect(() => {
    if (open) {
      setPicked(value);
      setQuery('');
    }
  }, [open, value]);
  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? options.filter((o) => matches(o, q)) : options;
  }, [options, query]);
  const isOn = (v) => (Array.isArray(picked) ? picked.includes(v) : picked === v);
  const choose = (v) => {
    const next = multiple ? (isOn(v) ? picked.filter((x) => x !== v) : [...picked, v]) : v;
    setPicked(next);
    // a single choice is made and the sheet closes by itself; a multiple one waits for Apply
    if (commitOnSelect) {
      onCommit(next);
      onOpenChange?.(false, { reason: 'item-press' });
    }
  };
  const button = (
    <Button
      width="100%"
      data-testid="choice-field-mobile-action"
      data-dialog-close
      variant={action === 'close' ? 'secondary' : 'primary'}
      size="md"
      onClick={action === 'apply' ? () => onCommit(picked) : undefined}
    >
      {action === 'close' ? 'Close' : 'Apply'}
    </Button>
  );
  const heading = dialogProps?.title === undefined ? title : dialogProps.title;
  return (
    <Dialog
      {...dialogProps}
      ref={dialogRef}
      open={open}
      title={heading}
      header={dialogProps?.header ?? (heading ? 'close' : false)}
      closeLabel={dialogProps?.closeLabel ?? (searchable ? 'Close' : 'Close the sheet')}
      contentClassName={dialogProps?.contentClassName}
      initialFocus={dialogProps?.initialFocus ?? (searchable ? search : false)}
      finalFocus={dialogProps?.finalFocus ?? false}
      primaryAction={action === 'apply' ? button : undefined}
      secondaryAction={action === 'close' ? button : undefined}
      onOpenChange={onOpenChange}
    >
      <div className="bui-choice-sheet__body" data-testid="choice-field-mobile-dialog-body">
        {searchable && (
          <TextInput
            ref={search}
            className="bui-choice-sheet__search"
            size="sm"
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            data-testid="choice-field-mobile-search-input"
            autoComplete="off"
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        )}
        {shown.length > 0 ? (
          <div
            className={cx('bui-choice-popup__list', 'bui-choice-sheet__list')}
            role="listbox"
            data-testid="choice-field-mobile-list"
            aria-multiselectable={multiple || undefined}
          >
            {shown.map((o, i) => {
              const on = isOn(o.value),
                labelId = `${idBase}-${i}-label`,
                detailsId = `${idBase}-${i}-details`;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  className={cx('bui-choice-popup__item', 'bui-choice-sheet__option')}
                  aria-selected={on}
                  aria-labelledby={labelId}
                  aria-describedby={o.details ? detailsId : undefined}
                  disabled={o.disabled}
                  data-testid={`choice-field-mobile-option-${o.value}`}
                  data-disabled={o.disabled || undefined}
                  data-selected={on || undefined}
                  onClick={() => choose(o.value)}
                >
                  <span id={labelId} className="bui-choice-popup__item-text">
                    {o.label}
                  </span>
                  {o.details && (
                    <span id={detailsId} className="bui-choice-popup__details">
                      {o.details}
                    </span>
                  )}
                  <span className="bui-choice-popup__indicator" aria-hidden="true">
                    {on && <BuiltinIcon name="check" size={24} />}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bui-choice-popup__empty" role="status">
            {emptyText}
          </div>
        )}
      </div>
    </Dialog>
  );
}
