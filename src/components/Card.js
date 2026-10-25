import { h, cx, useControllable } from '../react.js';
import { describe } from '../doc.js';

const px = (v) => (typeof v === 'number' ? `${v}px` : v);
const SHADOW = { none: 'none', low: 'var(--baseui-shadow-low)', med: 'var(--baseui-shadow-med)', high: 'var(--baseui-shadow-high)' };
const CARD_DOC = {
  variant: ["'default' | 'transparent' | 'muted' | 'blue' | 'green' | 'orange' | 'pink' | 'red'", "'default'", 'Background'],
  padding: ['number', '16', 'Inner padding in px (spacing token)'],
  elevation: ["'none' | 'low' | 'med' | 'high'", "'none'", 'Shadow depth'],
  width: ['number | string', null, 'Number is px'],
  height: ['number | string', null, 'Number is px'],
  maxWidth: ['number | string', null, 'Number is px'],
  children: ['ReactNode', null, 'Card content'],
};

function cardProps({ variant = 'default', padding = 16, elevation = 'none', width, height, maxWidth, minHeight, className, style }, extra) {
  return {
    'data-slot': 'card', 'data-variant': variant,
    className: cx('bui-card', `bui-card--${variant}`, className, extra),
    style: { padding: `var(--baseui-spacing-${padding})`, boxShadow: SHADOW[elevation], width: px(width), height: px(height), maxWidth: px(maxWidth), minHeight: px(minHeight), ...style },
  };
}

export function Card({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }), ...rest }, children);
}
describe(Card, 'A container that groups related content.', CARD_DOC);

export function ClickableCard({ label, onClick, href, target, disabled = false, variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  const Hit = href ? 'a' : 'button';
  const hit = h(Hit, {
    'data-slot': 'card-hit', className: 'bui-card__hit', 'aria-label': label,
    ...(href ? { href: disabled ? undefined : href, target, role: disabled ? 'link' : undefined, 'aria-disabled': disabled || undefined, tabIndex: disabled ? -1 : undefined } : { type: 'button', disabled }),
    onClick: disabled ? (e) => e.preventDefault() : onClick,
  });
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }, cx('bui-card--clickable', disabled && 'bui-card--disabled')), ...rest }, hit, h('div', { 'data-slot': 'card-content', className: 'bui-card__content' }, children));
}
describe(ClickableCard, 'A card that acts as one link or button.', {
  label: ['string', null, 'Accessible name'],
  onClick: ['(event) => void', null, 'Click handler'],
  href: ['string', null, 'Renders a link'],
  disabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});

export function SelectableCard({ label, checked, defaultChecked = false, onCheckedChange, disabled = false, variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  const [selected, setSelected] = useControllable(checked, defaultChecked, onCheckedChange);
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }, cx('bui-card--selectable', selected && 'bui-card--selected', disabled && 'bui-card--disabled')), 'data-checked': selected || undefined, ...rest },
    h('input', { type: 'checkbox', 'data-slot': 'card-hit', className: 'bui-card__hit', 'aria-label': label, checked: !!selected, disabled, onChange: () => setSelected(!selected) }),
    h('div', { 'data-slot': 'card-content', className: 'bui-card__content' }, children));
}
describe(SelectableCard, 'A card that can be selected, like a checkbox.', {
  label: ['string', null, 'Accessible name'],
  checked: ['boolean', null, 'Selected (controlled)'],
  defaultChecked: ['boolean', 'false', 'Initially selected (uncontrolled)'],
  onCheckedChange: ['(checked: boolean) => void', null, 'Called with the next state'],
  disabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});
