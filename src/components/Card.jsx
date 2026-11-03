import { cx, useControllable } from '../react.js';
import { describe } from '../doc.js';

const px = (v) => (typeof v === 'number' ? `${v}px` : v);
const SHADOW = { none: 'none', low: 'var(--baseui-shadow-sm)', med: 'var(--baseui-shadow-md)', high: 'var(--baseui-shadow-lg)' };
const CARD_DOC = {
  variant: ["'default' | 'surface' | 'transparent' | 'muted' | 'blue' | 'green' | 'orange' | 'pink' | 'red'", "'default'", 'Background; surface is the Surface color of the theme (a shadow in the light theme, none in the dark one) for a card that holds Secondary elements: fields, avatars, a progress track'],
  padding: ["number | 'list'", '4', 'Inner padding in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px. `list` is for a card that holds a List: 16px above and below and 4px at the sides, because the rows reach 12px out of their box, so the icons stand 16px from the edge and the rows are 4px from it'],
  elevation: ["'none' | 'low' | 'med' | 'high'", "'none'", 'Shadow depth'],
  width: ['number | string', null, 'Number is px'],
  height: ['number | string', null, 'Number is px'],
  maxWidth: ['number | string', null, 'Number is px'],
  children: ['ReactNode', null, 'Card content'],
};

function cardProps({ variant = 'default', padding = 4, elevation, width, height, maxWidth, minHeight, className, style }, extra) {
  return {
    'data-slot': 'card',
    'data-variant': variant,
    className: cx('bui-card', `bui-card--${variant}`, className, extra),
    style: {
      // `list`: the rows of a List reach 12px out of their box (the highlight of a row), so 4px at the sides put the icons 16px from the edge and the rows 4px from it
      ...(String(padding) === 'list' ? { padding: 'var(--baseui-spacing-4) var(--baseui-spacing-1)', '--bui-card-pad': 'var(--baseui-spacing-1)' } : { padding: `var(--baseui-spacing-${padding})`, '--bui-card-pad': `var(--baseui-spacing-${padding})` }),
      boxShadow: elevation ? SHADOW[elevation] : undefined,
      width: px(width),
      height: px(height),
      maxWidth: px(maxWidth),
      minHeight: px(minHeight),
      ...style,
    },
  };
}

export function Card({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style, children, ...rest }) {
  return (
    <div {...cardProps({ variant, padding, elevation, width, height, maxWidth, minHeight, className, style })} {...rest}>
      {children}
    </div>
  );
}
describe(Card, 'A container that groups related content', CARD_DOC);

export function ClickableCard({
  label,
  onClick,
  href,
  target,
  disabled = false,
  variant,
  padding,
  elevation,
  width,
  height,
  maxWidth,
  minHeight,
  className,
  style,
  children,
  ...rest
}) {
  const Hit = href ? 'a' : 'button';
  const hit = (
    <Hit
      data-slot="card-hit"
      className="bui-card__hit"
      aria-label={label}
      {...(href
        ? {
            href: disabled ? undefined : href,
            target,
            role: disabled ? 'link' : undefined,
            'aria-disabled': disabled || undefined,
            tabIndex: disabled ? -1 : undefined,
          }
        : { type: 'button', disabled })}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
    />
  );
  return (
    <div
      {...cardProps(
        { variant, padding, elevation, width, height, maxWidth, minHeight, className, style },
        cx('bui-card--clickable', disabled && 'bui-card--disabled'),
      )}
      {...rest}
    >
      {hit}
      <div data-slot="card-content" className="bui-card__content">
        {children}
      </div>
    </div>
  );
}
describe(ClickableCard, 'A card that acts as one link or button', {
  label: ['string', null, 'Accessible name'],
  onClick: ['(event) => void', null, 'Click handler'],
  href: ['string', null, 'Renders a link'],
  disabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});

export function SelectableCard({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  variant,
  padding,
  elevation,
  width,
  height,
  maxWidth,
  minHeight,
  className,
  style,
  children,
  ...rest
}) {
  const [selected, setSelected] = useControllable(checked, defaultChecked, onCheckedChange);
  return (
    <div
      {...cardProps(
        { variant, padding, elevation, width, height, maxWidth, minHeight, className, style },
        cx('bui-card--selectable', selected && 'bui-card--selected', disabled && 'bui-card--disabled'),
      )}
      data-checked={selected || undefined}
      {...rest}
    >
      <input
        type="checkbox"
        data-slot="card-hit"
        className="bui-card__hit"
        aria-label={label}
        checked={!!selected}
        disabled={disabled}
        onChange={() => setSelected(!selected)}
      />
      <div data-slot="card-content" className="bui-card__content">
        {children}
      </div>
    </div>
  );
}
describe(SelectableCard, 'A card that can be selected, like a checkbox', {
  label: ['string', null, 'Accessible name'],
  checked: ['boolean', null, 'Selected (controlled)'],
  defaultChecked: ['boolean', 'false', 'Initially selected (uncontrolled)'],
  onCheckedChange: ['(checked: boolean) => void', null, 'Called with the next state'],
  disabled: ['boolean', 'false', 'Disables the card'],
  ...CARD_DOC,
});
