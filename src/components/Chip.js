import { h, cx } from '../react.js';
import { Toggle } from '@base-ui/react/toggle';
import { Button } from '@base-ui/react/button';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

/**
 * A chip (a token): a small element for selection or indication. It is a Base UI Toggle (`pressed`, `defaultPressed`,
 * `onPressedChange`, or the value of a ChipGroup), or with `action` a button: a removable chip or a plain one.
 * A chip is always a `<button>`; without visible text give it `aria-label`.
 */
export function Chip({
  size = 'md', status, icon, avatar, counter, action = false, onAction, actionLabel, disabled, pressed, defaultPressed, onPressedChange, value, onClick, children, className, ref, ...rest
}) {
  const cls = cx('bui-chip', 'bui-chip__filled', `bui-chip__${size === 'sm' ? 'small' : 'medium'}`, status && `bui-chip__${status}`, avatar != null && 'bui-chip__has-avatar', className);
  const content = [
    avatar != null && h('span', { key: 'a', 'data-slot': 'chip-avatar', className: 'bui-chip__avatar' }, avatar),
    icon != null && h('span', { key: 'i', 'data-slot': 'chip-icon', className: 'bui-chip__icon' }, icon),
    children != null && h('span', { key: 'l', 'data-slot': 'chip-label', className: 'bui-chip__label' }, children),
    counter != null && h('span', { key: 'c', 'data-slot': 'chip-counter', className: 'bui-chip__counter' }, counter),
    action === true && h('span', { key: 'x', 'data-slot': 'chip-action', className: 'bui-chip__action', 'aria-hidden': 'true' }, h(Icon, { name: 'close', size: 24 })),
  ];
  if (action) return h(Button, { ref, disabled, 'aria-label': actionLabel, className: cls, onClick: (e) => { onClick?.(e); onAction?.(); }, 'data-slot': 'chip', ...rest }, content);
  return h(Toggle, { ref, disabled, pressed, defaultPressed, onPressedChange, value, onClick, className: cls, 'data-slot': 'chip', ...rest }, content);
}
describe(Chip, 'A chip for selection or indication: a Base UI Toggle with a size, a status and slots. With `action` it is a button, removable or plain.', {
  size: ["'md' | 'sm'", "'md'", 'Size'],
  status: ["'success' | 'error'", null, 'Semantic status: colors the fill'],
  icon: ['ReactNode', null, 'Leading icon; it follows the text color'],
  avatar: ['ReactNode', null, 'Leading avatar instead of the icon: reduces the left padding. The Avatar must fit the box of the chip: `sm` with `md`, `xsm` with `sm`'],
  counter: ['ReactNode', null, 'Counter to the right of the label'],
  action: ["boolean | 'press'", 'false', 'Not a toggle. `true`: a removable chip with a cross, a click calls `onAction`. `press`: a plain button, a click calls `onClick`'],
  onAction: ['() => void', null, 'Called when a removable chip is pressed'],
  actionLabel: ['string', null, 'Accessible name of an `action` chip without visible text'],
  pressed: ['boolean', null, 'Selected state (controlled)'],
  defaultPressed: ['boolean', 'false', 'Initially selected (uncontrolled)'],
  onPressedChange: ['(pressed: boolean) => void', null, 'Called when the selected state changes'],
  value: ['string', null, 'The value of the chip in a ChipGroup'],
  disabled: ['boolean', 'false', 'Disabled state'],
  children: ['ReactNode', null, 'Label'],
  className: ['string', null, 'Extra class (merged)'],
  ref: ['Ref<HTMLButtonElement>', null, 'Ref to the button'],
});
