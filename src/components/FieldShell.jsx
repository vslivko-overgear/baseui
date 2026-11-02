import { cx } from '../react.js';
import { Field } from '@base-ui/react/field';
import { useControlSize, FIELD_OF_TIER } from '../control-size.js';

/**
 * The shared shell of the fields (Text Input, Selector, Typeahead): a box (filled or standard, medium or small), a floating label,
 * slots for an icon and an action, and a caption or an error. The label, the control and the caption are wired by the Base UI Field
 * (`aria-describedby`, `aria-invalid`, the data attributes of the states). The control itself is passed as `children`.
 * An internal component: it is not part of the public API.
 */
export function FieldShell({
  variant = 'filled',
  size: sizeProp,
  control = 'text',
  label,
  labelId,
  floatingLabel = true,
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
  children,
  onBlur,
  className,
}) {
  const row = useControlSize();
  const size = sizeProp ?? (row ? FIELD_OF_TIER[row] : undefined) ?? 'md';
  const hasCaption = !loading && !!caption;
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
      data-float={label ? (floatingLabel ? 'floating' : 'placeholder') : 'none'}
      data-multiple={multiple || undefined}
      data-status={status}
      disabled={disabled || loading}
      invalid={status === 'error'}
      aria-busy={loading || undefined}
    >
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
          {label && (
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
          data-test={status === 'error' ? 'inputError' : undefined}
        >
          {caption}
        </Field.Description>
      )}
    </Field.Root>
  );
}
