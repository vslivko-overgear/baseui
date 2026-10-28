import { h, cx } from '../react.js';
import { Field } from '@base-ui/react/field';

/**
 * The shared shell of the fields (Text Input, Selector, Typeahead): a box (filled or standard, medium or small), a floating label,
 * slots for an icon and an action, and a caption or an error. The label, the control and the caption are wired by the Base UI Field
 * (`aria-describedby`, `aria-invalid`, the data attributes of the states). The control itself is passed as `children`.
 * An internal component: it is not part of the public API.
 */
export function FieldShell({
  variant = 'filled', size = 'md', control = 'text', label, labelId, floatingLabel = true, caption, captionId, status, disabled = false, loading = false,
  multiline = false, multiple = false, startIcon, trailing, focusRef, cellRef, children, onBlur, className,
}) {
  const hasCaption = !loading && !!caption;
  return h(Field.Root, {
    'data-slot': 'textfield', 'data-variant': variant, 'data-size': size,
    className: cx('bui-field', `bui-field__${variant}`, `bui-field__${size === 'sm' ? 'small' : 'medium'}`, multiline && 'bui-field__multiline', disabled && 'bui-field__disabled', loading && 'bui-field__loading', className),
    'data-control': control, 'data-float': label ? (floatingLabel ? 'floating' : 'placeholder') : 'none', 'data-multiple': multiple || undefined, 'data-status': status,
    disabled: disabled || loading, invalid: status === 'error', 'aria-busy': loading || undefined,
  },
  h('span', {
    ref: cellRef, 'data-slot': 'textfield-cell', className: 'bui-field__cell', onBlur,
    // a click anywhere in the box focuses the control, except on a button inside it
    onMouseDown: focusRef ? (e) => { const el = focusRef.current; if (e.target === el || e.target.closest('button')) return; e.preventDefault(); el?.focus(); } : undefined,
    onClick: focusRef ? (e) => { if (!e.target.closest('button')) focusRef.current?.focus(); } : undefined,
  },
  startIcon && h('span', { 'data-slot': 'textfield-icon', className: 'bui-field__icon' }, startIcon),
  h('span', { 'data-slot': 'textfield-inner', className: 'bui-field__inner' },
    label && h(Field.Label, { id: labelId, 'data-slot': 'textfield-label', className: 'bui-field__label' }, label),
    children),
  trailing && h('span', { 'data-slot': 'textfield-action', className: 'bui-field__action' }, trailing)),
  hasCaption && h(Field.Description, { id: captionId, 'data-slot': 'textfield-caption', className: 'bui-field__caption', 'data-test': status === 'error' ? 'inputError' : undefined }, caption));
}
