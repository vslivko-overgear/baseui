import { cx } from '../react.js';
import { Toggle } from '@base-ui/react/toggle';
import { Button } from '@base-ui/react/button';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { describe } from '../doc.js';

/**
 * A chip (a token): a small element for selection or indication. It is a Base UI Toggle (`pressed`, `defaultPressed`,
 * `onPressedChange`, or the value of a TokenGroup), or with `action` a button: a removable chip or a plain one.
 * A chip is always a `<button>`; without visible text give it `aria-label`.
 */
export function Token({
  size = 'md',
  status,
  icon,
  avatar,
  counter,
  endIcon,
  action = false,
  onAction,
  actionLabel,
  disabled,
  pressed,
  defaultPressed,
  onPressedChange,
  value,
  onClick,
  children,
  className,
  ref,
  ...rest
}) {
  const cls = cx(
    'bui-token',
    'bui-token__filled',
    `bui-token__${size === 'sm' ? 'small' : 'medium'}`,
    status && `bui-token__${status}`,
    avatar != null && 'bui-token__has-avatar',
    className,
  );
  const content = [
    avatar != null && (
      <span key="a" data-slot="token-avatar" className="bui-token__avatar">
        {avatar}
      </span>
    ),
    icon != null && (
      <span key="i" data-slot="token-icon" className="bui-token__icon">
        {icon}
      </span>
    ),
    children != null && (
      <span key="l" data-slot="token-label" className="bui-token__label">
        {children}
      </span>
    ),
    counter != null && (
      <span key="c" data-slot="token-counter" className="bui-token__counter">
        {counter}
      </span>
    ),
    endIcon != null && (
      <span key="e" data-slot="token-end-icon" className="bui-token__end-icon" aria-hidden="true">
        {endIcon}
      </span>
    ),
    action === true && (
      <span key="x" data-slot="token-action" className="bui-token__action" aria-hidden="true">
        <BuiltinIcon name="close" size={24} />
      </span>
    ),
  ];
  if (action)
    return (
      <Button
        ref={ref}
        disabled={disabled}
        aria-label={actionLabel}
        className={cls}
        onClick={(e) => {
          onClick?.(e);
          onAction?.();
        }}
        data-slot="token"
        {...rest}
      >
        {content}
      </Button>
    );
  return (
    <Toggle
      ref={ref}
      disabled={disabled}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      value={value}
      onClick={onClick}
      className={cls}
      data-slot="token"
      {...rest}
    >
      {content}
    </Toggle>
  );
}
describe(Token, 'A chip for selection or indication: a Base UI Toggle with a size, a status and slots. With `action` it is a button, removable or plain', {
  size: ["'md' | 'sm'", "'md'", 'Size'],
  status: ["'success' | 'error'", null, 'Semantic status: colors the fill'],
  icon: ['ReactNode', null, 'Leading icon; it follows the text color'],
  avatar: [
    'ReactNode',
    null,
    'Leading avatar instead of the icon: reduces the left padding. The Avatar must fit the box of the chip: `sm` with `md`, `xsm` with `sm`',
  ],
  counter: ['ReactNode', null, 'Counter to the right of the label'],
  endIcon: ['ReactNode', null, 'Any icon at the right end of the chip (a chevron for a chip that opens a menu); it follows the text color'],
  action: [
    "boolean | 'press'",
    'false',
    'Not a toggle. `true`: a removable chip with a cross, a click calls `onAction`. `press`: a plain button, a click calls `onClick`',
  ],
  onAction: ['() => void', null, 'Called when a removable chip is pressed'],
  actionLabel: ['string', null, 'Accessible name of an `action` chip without visible text'],
  pressed: ['boolean', null, 'Selected state (controlled)'],
  defaultPressed: ['boolean', 'false', 'Initially selected (uncontrolled)'],
  onPressedChange: ['(pressed: boolean) => void', null, 'Called when the selected state changes'],
  value: ['string', null, 'The value of the chip in a TokenGroup'],
  disabled: ['boolean', 'false', 'Disabled state'],
  children: ['ReactNode', null, 'Label'],
  className: ['string', null, 'Extra class (merged)'],
  ref: ['Ref<HTMLButtonElement>', null, 'Ref to the button'],
});
