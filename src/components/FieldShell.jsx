import { cx, useState, useEffect, useRef } from '../react.js';
import { Field } from '@base-ui/react/field';
import { useControlSize, FIELD_OF_TIER } from '../control-size.js';

/**
 * The shared shell of the fields (Text Input, Selector, Typeahead): a box (filled or standard, medium or small), a floating label,
 * slots for an icon and an action, and a caption or an error. The label, the control and the caption are wired by the Base UI Field
 * (`aria-describedby`, `aria-invalid`, the data attributes of the states). The control itself is passed as `children`.
 * An internal component: it is not part of the public API.
 *
 * An error goes at the first change of the value (`valueKey` is the value as a string or a number): the field stops looking wrong and drops the error text (the caption), whatever the form does.
 * It comes back when the form is submitted again, or when `status` or `caption` change (a new error): the form need not know about it.
 */
export function FieldShell({
  variant = 'filled',
  size: sizeProp,
  control = 'text',
  label,
  labelId,
  floatingLabel = true,
  labelPlacement = 'inside',
  caption,
  captionId,
  status,
  disabled = false,
  loading = false,
  multiline = false,
  multiple = false,
  startIcon,
  trailing,
  focusRef,
  cellRef,
  valueKey,
  children,
  onBlur,
  className,
}) {
  const row = useControlSize();
  const size = sizeProp ?? (row ? FIELD_OF_TIER[row] : undefined) ?? 'md';
  // the error goes at the first change of the value, and comes back with a new error (status or caption change) or with the next submit of the form
  const [seen, setSeen] = useState({ valueKey, status, caption });
  const [dismissed, setDismissed] = useState(false);
  if (seen.valueKey !== valueKey || seen.status !== status || seen.caption !== caption) {
    setSeen({ valueKey, status, caption });
    if (seen.status !== status || seen.caption !== caption) setDismissed(false);
    else if (status === 'error') setDismissed(true);
  }
  const root = useRef(null);
  useEffect(() => {
    const form = root.current?.closest('form');
    if (!form) return undefined;
    const again = () => setDismissed(false);
    form.addEventListener('submit', again);
    return () => form.removeEventListener('submit', again);
  }, []);
  const shownStatus = dismissed ? undefined : status;
  const outside = labelPlacement === 'outside' && !!label;
  const hasCaption = !loading && !!caption && !(dismissed && status === 'error');
  return (
    <Field.Root
      data-slot="textinput"
      data-variant={variant}
      data-size={size}
      className={cx(
        'bui-field',
        `bui-field__${variant}`,
        `bui-field__${size === 'sm' ? 'small' : 'medium'}`,
        multiline && 'bui-field__multiline',
        disabled && 'bui-field__disabled',
        loading && 'bui-field__loading',
        className,
      )}
      data-control={control}
      data-float={label && !outside ? (floatingLabel ? 'floating' : 'placeholder') : 'none'}
      data-label={outside ? 'outside' : undefined}
      data-multiple={multiple || undefined}
      ref={root}
      data-status={shownStatus}
      disabled={disabled || loading}
      invalid={shownStatus === 'error'}
      aria-busy={loading || undefined}
    >
      {outside && (
        <Field.Label id={labelId} data-slot="textinput-title" className="bui-field__title">
          {label}
        </Field.Label>
      )}
      <span
        ref={cellRef}
        data-slot="textinput-cell"
        className="bui-field__cell"
        onBlur={onBlur}
        onMouseDown={
          focusRef
            ? (e) => {
                const el = focusRef.current;
                if (e.target === el || /** @type {Element} */ (e.target).closest('button')) return;
                e.preventDefault();
                el?.focus();
              }
            : undefined
        }
        onClick={
          focusRef
            ? (e) => {
                if (!(/** @type {Element} */ (e.target)).closest('button')) focusRef.current?.focus();
              }
            : undefined
        }
      >
        {startIcon && (
          <span data-slot="textinput-icon" className="bui-field__icon">
            {startIcon}
          </span>
        )}
        <span data-slot="textinput-inner" className="bui-field__inner">
          {label && !outside && (
            <Field.Label id={labelId} data-slot="textinput-label" className="bui-field__label">
              {label}
            </Field.Label>
          )}
          {children}
        </span>
        {trailing && (
          <span data-slot="textinput-action" className="bui-field__action">
            {trailing}
          </span>
        )}
      </span>
      {hasCaption && (
        <Field.Description
          id={captionId}
          data-slot="textinput-caption"
          className="bui-field__caption"
          data-test={shownStatus === 'error' ? 'inputError' : undefined}
        >
          {caption}
        </Field.Description>
      )}
    </Field.Root>
  );
}
