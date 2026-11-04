import { cx, useState, useRef, useCallback } from '../react.js';
import { Input } from '@base-ui/react/input';
import { FieldShell } from './FieldShell.jsx';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { Icon as CatalogIcon } from './Icon.jsx';
import { describe } from '../doc.js';

/**
 * A text field: the Base UI Input in the shared field shell. The shell gives the box, the floating label, the caption and the wiring of
 * the label, the control and the caption; the field adds the actions (clear, reveal a password, a custom one), a prefix and a suffix,
 * and an auto-sizing multiline mode. Without `label` give the field a name with `aria-label` or `aria-labelledby`.
 */
export function TextInput({
  variant = 'filled',
  size,
  label,
  floatingLabel,
  caption,
  status,
  loading = false,
  clearable,
  onClear,
  startIcon,
  action,
  actionLabel,
  prefix,
  suffix,
  multiline = false,
  minRows = 1,
  maxRows,
  className,
  ref,
  type = 'text',
  value,
  defaultValue,
  onChange,
  disabled = false,
  ...rest
}) {
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = value !== undefined ? value : inner;
  const change = (e) => {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e);
  };
  // a search field is always the same: the label works as a placeholder (it never floats), the icon of the library, a clear button
  const search = type === 'search';
  const named = label != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;
  if (search) {
    label = named ? label : 'Search';
    startIcon = startIcon ?? <CatalogIcon name="SearchSm" size={24} />;
    clearable = true;
    actionLabel = actionLabel ?? 'Clear search';
  }
  // the clear button is the default of a text field: it shows while the field is in focus and has a character, unless another action stands at its end (a password, an `action`), the field is a textarea or it is read-only; `clearable` says it either way
  const canClear = clearable ?? (!action && !multiline && !rest.readOnly);
  const isPassword = type === 'password';
  const [shown, setShown] = useState(false);
  const inputType = isPassword && shown && !disabled ? 'text' : type;
  const control = useRef(null);
  const setRef = useCallback(
    (el) => {
      control.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  const reveal = () => {
    setShown((s) => !s);
    const el = control.current;
    if (el instanceof HTMLInputElement) {
      const { selectionStart: a, selectionEnd: b } = el;
      requestAnimationFrame(() => el.setSelectionRange(a, b));
    }
  };
  // the clear button sets the value the way a user would, so a controlled field and a form see an ordinary input event
  const clear = () => {
    const el = control.current;
    if (el) {
      const proto = multiline ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
    }
    onClear?.();
  };
  const iconButton = (extra, onClick, icon) => (
    <button type="button" className={cx('bui-input__icon-button', extra)} aria-label={extra === 'bui-input__clear-btn' ? (actionLabel ?? 'Clear') : actionLabel} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {icon}
    </button>
  );
  let trailing = null;
  if (isPassword) trailing = !disabled && iconButton('bui-input__revealable', reveal, <BuiltinIcon name={shown ? 'eyeOff' : 'eye'} size={24} />);
  else if (canClear) trailing = !disabled && iconButton('bui-input__clear-btn', clear, <BuiltinIcon name="close" size={24} />);
  else if (action) trailing = action;
  const props = { ...rest, value: current, onChange: change, ref: setRef, className: 'bui-input', disabled: disabled || loading };
  return (
    <FieldShell
      variant={variant}
      size={size}
      control="text"
      label={label}
      floatingLabel={search ? false : (floatingLabel ?? true)}
      caption={caption}
      status={status}
      disabled={disabled}
      loading={loading}
      multiline={multiline}
      startIcon={startIcon}
      trailing={trailing}
      focusRef={control}
      className={cx(suffix && 'bui-input__has-suffix', className)}
    >
      {prefix && <span className="bui-input__affix">{prefix}</span>}
      {multiline ? (
        <Input {...props} render={<textarea rows={minRows} style={{ '--tf-min-rows': minRows, ...(maxRows && { '--tf-max-rows': maxRows }) }} />} />
      ) : (
        <Input {...props} type={inputType} />
      )}
      {suffix && <span className="bui-input__affix">{suffix}</span>}
    </FieldShell>
  );
}
describe(TextInput, 'A single-line or multi-line text field with a floating label, built on the Base UI Input', {
  variant: [
    "'filled' | 'standard'",
    "'filled'",
    'Visual variant: `filled` has a background (the main one), `standard` has none (specific scenarios, for example a chat)',
  ],
  size: ["'md' | 'sm'", "'md'", 'Size: md is 56px with 16px text, sm is 48px with 14px text'],
  label: ['ReactNode', null, 'Field label. An empty field shows it centered like a placeholder; on focus or value it floats up (see floatingLabel)'],
  floatingLabel: [
    'boolean',
    'true (false for type="search")',
    'Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered',
  ],
  caption: ['ReactNode', null, 'The only text under the field: a gray hint, and with `status` a colored message. Swapping “hint → error” is up to the caller'],
  status: [
    "'error' | 'warning' | 'success'",
    null,
    'Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green',
  ],
  loading: ['boolean', 'false', 'Loading state: a skeleton instead of the content, input is blocked'],
  clearable: ['boolean', 'true unless the field has an `action`, a password toggle, several lines or is read-only', 'Clear button (×): shown while the field is in focus and has a character, never out of focus. Set it to false to switch it off, or to true to have it with an action or on several lines'],
  onClear: [
    '() => void',
    null,
    'Called after the field is cleared with the × button. The field clears the value itself (an ordinary onChange with an empty value fires too)',
  ],
  startIcon: ['ReactNode', null, 'Icon at the start of the field (24px)'],
  action: [
    'ReactNode',
    null,
    'A custom action at the end of the field (any icon or button). Not shown where the action slot is taken: the visibility toggle of `type="password"` and the clear button',
  ],
  actionLabel: ['string', null, 'aria-label of the built-in action button (clear or password toggle); set it, or the button has no accessible name'],
  prefix: ['ReactNode', null, 'Prefix before the value (for example a currency); visible on focus or value'],
  suffix: ['ReactNode', null, 'Suffix after the value; visible on focus or value'],
  multiline: ['boolean', 'false', 'Multiline mode: a textarea that auto-sizes to its content'],
  minRows: ['number', '1', 'Minimum number of textarea rows (multiline)'],
  maxRows: ['number', null, 'Maximum number of textarea rows, then it scrolls (multiline)'],
  value: ['string', null, 'Value (controlled)'],
  defaultValue: ['string', null, 'Initial value (uncontrolled)'],
  onChange: ['(event) => void', null, 'Called on every change'],
  type: ['string', "'text'", 'Input type; `password` adds the visibility toggle; `search` makes a search field: the label works as a placeholder and never floats, the icon is SearchSm at 24px, the clear button is on and the label defaults to Search'],
  disabled: ['boolean', 'false', 'Disabled state'],
  className: ['string', null, 'Extra class on the outer wrapper (merged)'],
  ref: ['Ref<HTMLInputElement | HTMLTextAreaElement>', null, 'Ref to the input element itself (input, or textarea with multiline)'],
});
