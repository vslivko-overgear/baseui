import { h, cx } from '../react.js';
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
    className: cx('bui-card', `bui-card--${variant}`, className, extra),
    style: { padding: `var(--baseui-spacing-${padding})`, boxShadow: SHADOW[elevation], width: px(width), height: px(height), maxWidth: px(maxWidth), minHeight: px(minHeight), ...style },
  };
}

export function Card({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }), ...rest }, children);
}
describe(Card, 'A container that groups related content.', CARD_DOC);

export function ClickableCard({ label, onClick, href, target, isDisabled = false, variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  const Hit = href ? 'a' : 'button';
  const hit = h(Hit, {
    className: 'bui-card__hit', 'aria-label': label,
    ...(href ? { href: isDisabled ? undefined : href, target, role: isDisabled ? 'link' : undefined, 'aria-disabled': isDisabled || undefined, tabIndex: isDisabled ? -1 : undefined } : { type: 'button', disabled: isDisabled }),
    onClick: isDisabled ? (e) => e.preventDefault() : onClick,
  });
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }, cx('bui-card--clickable', isDisabled && 'bui-card--disabled')), ...rest }, hit, h('div', { className: 'bui-card__content' }, children));
}
describe(ClickableCard, 'A card that acts as one link or button.', {
  label: ['string', null, 'Accessible name'],
  onClick: ['(event) => void', null, 'Click handler'],
  href: ['string', null, 'Renders a link'],
  isDisabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});

export function SelectableCard({ label, isSelected, onChange, isDisabled = false, variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  return h('div', { ...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style }, cx('bui-card--selectable', isSelected && 'bui-card--selected', isDisabled && 'bui-card--disabled')), ...rest },
    h('input', { type: 'checkbox', className: 'bui-card__hit', 'aria-label': label, checked: isSelected, disabled: isDisabled, onChange: () => onChange(!isSelected) }),
    h('div', { className: 'bui-card__content' }, children));
}
describe(SelectableCard, 'A card that can be selected.', {
  label: ['string', null, 'Accessible name'],
  isSelected: ['boolean', null, 'Selection state'],
  onChange: ['(isSelected: boolean) => void', null, 'Called with the next state'],
  isDisabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});
