import { h, cx, createContext, useContext, useState, useRef } from '../react.js';
import { Button as Base } from '../base.js';
import { Tooltip } from './Tooltip.js';
import { describe } from '../doc.js';

const GroupContext = createContext(null);
const ToggleGroupContext = createContext(null);

export function Button({
  label, children, variant = 'secondary', size, isDisabled, isLoading = false, icon, endContent, isIconOnly = false,
  width, tooltip, href, target, rel, type = 'button', onClick, clickAction, className, style, ref, ...rest
}) {
  const group = useContext(GroupContext);
  const [pending, setPending] = useState(false);
  const sz = size || (group && group.size) || 'md';
  const disabled = isDisabled ?? (group && group.isDisabled) ?? false;
  const common = { size: sz, loading: isLoading || pending, disabled, className: cx(isIconOnly && `bui-btn-icon bui-btn-icon--${sz}`, className), style: { width, ...(variant === 'destructive' && { '--baseui-button-custom-hover': 'var(--baseui-Extensions-Background-Error-Hover)' }), ...style } };
  const variantProps = variant === 'ghost' ? { variant: 'text' }
    : variant === 'destructive' ? { variant: 'custom', customBackground: 'var(--baseui-Extensions-Background-Error)', customColor: 'var(--baseui-Extensions-Text-and-Icon-AlwaysDark)' }
      : { variant };
  const click = async (e) => {
    onClick && onClick(e);
    if (clickAction) { setPending(true); try { await clickAction(e); } finally { setPending(false); } }
  };
  const node = h(Base, {
    ref, ...common, ...variantProps, type: href ? undefined : type, 'aria-label': isIconOnly ? label : undefined, onClick: click,
    startIcon: isIconOnly ? undefined : icon, endIcon: isIconOnly ? undefined : endContent,
    ...(href && { render: h('a', { href, target, rel }) }), ...rest,
  }, isIconOnly ? icon : children ?? label);
  const tip = tooltip === false ? undefined : tooltip || (isIconOnly ? label : undefined);
  return tip ? h(Tooltip, { content: tip }, node) : node;
}
describe(Button, 'Triggers an action or navigates.', {
  label: ['string', null, 'Visible text and accessible name'],
  children: ['ReactNode', null, 'Visible content in place of `label`'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  isDisabled: ['boolean', 'false', 'Disables the button'],
  isLoading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  icon: ['ReactNode', null, 'Icon before the label'],
  endContent: ['ReactNode', null, 'Content after the label, e.g. a chevron'],
  isIconOnly: ['boolean', 'false', 'Square icon-only button; `label` becomes `aria-label`'],
  width: ['number | string', null, 'Number is px; `"100%"` fills the container'],
  tooltip: ['string | false', null, 'Hover text; false turns the tooltip off (an icon-only button shows its label by default)'],
  href: ['string', null, 'Renders a link'],
  onClick: ['(event) => void', null, 'Click handler'],
  clickAction: ['(event) => void | Promise<void>', null, 'Async action; shows loading while pending'],
});

export function IconButton({ icon, ...props }) {
  return h(Button, { ...props, icon, isIconOnly: true });
}
describe(IconButton, 'A button with only an icon.', {
  icon: ['ReactNode', null, 'Icon element'],
  label: ['string', null, 'Accessible name and tooltip'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
});

export function ButtonGroup({ label, orientation = 'horizontal', size = 'md', isDisabled = false, children, className, ...rest }) {
  const ref = useRef(null);
  const onKeyDown = (e) => {
    const keys = orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (!keys.includes(e.key)) return;
    const items = [...ref.current.querySelectorAll('button:not(:disabled), a[href]')];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    items[(i + (e.key === keys[1] ? 1 : -1) + items.length) % items.length].focus();
  };
  return h(GroupContext.Provider, { value: { size, isDisabled } },
    h('div', { ref, role: 'group', 'aria-label': label, 'aria-disabled': isDisabled || undefined, onKeyDown, className: cx('bui-btn-group', `bui-btn-group--${orientation}`, `bui-btn-group--${size}`, className), ...rest }, children));
}
describe(ButtonGroup, 'Connects related buttons into one control.', {
  label: ['string', null, 'Accessible name of the group'],
  orientation: ["'horizontal' | 'vertical'", "'horizontal'", 'Layout direction'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Default size of the buttons'],
  isDisabled: ['boolean', 'false', 'Disables every button'],
  children: ['ReactNode', null, '`Button` or `IconButton` elements'],
});

export function ToggleButton({ label, isPressed = false, onPressedChange, icon, pressedIcon, value, size, isDisabled, children, ...rest }) {
  const group = useContext(ToggleGroupContext);
  const pressed = group && value !== undefined ? group.selected.has(value) : isPressed;
  const toggle = (e) => {
    if (group && value !== undefined) group.toggle(value);
    else onPressedChange && onPressedChange(!pressed, e);
  };
  return h(Button, { variant: pressed ? 'secondary' : 'ghost', label, size: size || (group && group.size), isDisabled: isDisabled ?? (group && group.isDisabled), icon: pressed && pressedIcon ? pressedIcon : icon, 'aria-pressed': pressed, onClick: toggle, className: cx('bui-toggle', pressed && 'bui-toggle--pressed'), ...rest }, children);
}
describe(ToggleButton, 'A button that stays pressed.', {
  label: ['string', null, 'Visible text and accessible name'],
  isPressed: ['boolean', 'false', 'Pressed state; ignored inside a group'],
  onPressedChange: ['(isPressed, event) => void', null, 'Called with the next state'],
  icon: ['ReactNode', null, 'Icon before the label'],
  pressedIcon: ['ReactNode', null, 'Icon while pressed'],
  value: ['string', null, 'Identifier inside a group'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  isDisabled: ['boolean', 'false', 'Disables the button'],
});

export function ToggleButtonGroup({ label, type = 'single', value, onChange, orientation = 'horizontal', size = 'md', isDisabled = false, children, className, ...rest }) {
  const selected = new Set(type === 'multiple' ? value : value == null ? [] : [value]);
  const toggle = (v) => {
    if (type === 'multiple') onChange(selected.has(v) ? value.filter((x) => x !== v) : [...value, v]);
    else onChange(selected.has(v) ? null : v);
  };
  return h(ToggleGroupContext.Provider, { value: { selected, toggle, size, isDisabled } },
    h('div', { role: 'group', 'aria-label': label, className: cx('bui-btn-group', `bui-btn-group--${orientation}`, `bui-btn-group--${size}`, className), ...rest }, children));
}
describe(ToggleButtonGroup, 'A group of toggle buttons with single or multiple selection.', {
  label: ['string', null, 'Accessible name of the group'],
  type: ["'single' | 'multiple'", "'single'", 'Selection mode'],
  value: ['string | string[] | null', null, 'Selected value(s)'],
  onChange: ['(value) => void', null, 'Called with the new selection'],
  orientation: ["'horizontal' | 'vertical'", "'horizontal'", 'Layout direction'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Default size of the buttons'],
  isDisabled: ['boolean', 'false', 'Disables every button'],
});
