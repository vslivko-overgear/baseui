import { h, cx, useId, useState, useRef, useControllable } from '../react.js';
import { Button } from '@base-ui/react/button';
import { describe } from '../doc.js';

// the solid star of the catalog
const STAR_PATH = 'M12.646 1.776a1.5 1.5 0 0 0-1.292 0c-.353.168-.547.46-.645.62a7.735 7.735 0 0 0-.307.583L8.245 7.346l-4.822.705c-.227.033-.46.067-.65.113-.182.044-.52.139-.789.423a1.5 1.5 0 0 0-.398 1.228c.051.387.27.663.391.805.127.148.295.312.46.472l3.488 3.397-.823 4.799a7.752 7.752 0 0 0-.095.652c-.014.187-.029.538.158.882a1.5 1.5 0 0 0 1.045.759c.384.071.714-.051.887-.123.18-.075.388-.184.591-.291L12 18.9l4.31 2.267c.204.107.412.216.592.29.174.073.503.195.887.124a1.5 1.5 0 0 0 1.045-.76c.187-.343.172-.694.158-.881a7.757 7.757 0 0 0-.095-.652l-.822-4.799 3.487-3.397c.165-.16.333-.324.46-.472.122-.142.34-.418.39-.805a1.5 1.5 0 0 0-.397-1.228c-.27-.284-.607-.38-.79-.423-.189-.046-.422-.08-.649-.113l-4.822-.705L13.6 2.98a7.736 7.736 0 0 0-.308-.582c-.098-.16-.292-.453-.645-.621Z';
const StarShape = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 24, height: 24, 'aria-hidden': 'true' }, h('path', { d: STAR_PATH, fill: 'currentColor' }));
const SIZE_CLASS = { sm: 'small', md: 'medium', lg: 'large' };
const clamp = (v, max) => Math.min(Math.max(v, 0), max);
/** The value as it is shown: with `round` down to the nearest half star. */
const shown = (value, max, round) => { const v = clamp(value, max); return round ? (v === max ? max : Math.floor(v * 2) / 2) : v; };
/** How much of the star number `index` (1-based) is filled, from 0 to 1. */
const fillOf = (value, index, max, round) => Math.min(Math.max(shown(value, max, round) - (index - 1), 0), 1);
const starsLabel = (n) => (n === 1 ? '1 star' : `${n} stars`);
/** A pointer over the left half of a star means half of it, when the precision allows it. */
const valueAt = (index, clientX, star, precision) => {
  if (precision === 1) return index;
  const { left, width } = star.getBoundingClientRect();
  return clientX - left < width / 2 ? Math.max(index - 0.5, 0.5) : index;
};

function Star({ fill }) {
  return h('span', { className: 'bui-rating__star', 'aria-hidden': 'true' },
    h(StarShape),
    fill > 0 && h('span', { className: 'bui-rating__star-fill', style: fill < 1 ? { clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` } : undefined }, h(StarShape)));
}

/** The stars of Rating and RatingDisplay: a radiogroup of star buttons when it can change, an image when it cannot. */
function Stars({ value = 0, max = 5, size = 'lg', color = 'accent', disabled = false, readOnly = false, label, caption, precision = 1, round = true, onChange, className, name, 'aria-label': ariaLabel, ref }) {
  const labelId = useId();
  const [hover, setHover] = useState(null);
  const byPointer = useRef(false);
  const interactive = !disabled && !readOnly && !!onChange;
  const current = hover ?? value;
  const stars = h('div', { 'data-slot': 'rating-stars', className: 'bui-rating__stars', style: { '--baseui-rating-max': max } },
    Array.from({ length: max }, (_, i) => {
      const index = i + 1;
      const star = h(Star, { fill: fillOf(current, index, max, round) });
      return interactive
        ? h(Button, {
          key: index, type: 'button', name, disabled, className: 'bui-rating__star-button', 'aria-label': starsLabel(index), 'aria-pressed': value >= index,
          onMouseEnter: (e) => setHover(valueAt(index, e.clientX, e.currentTarget, precision)), onMouseMove: (e) => setHover(valueAt(index, e.clientX, e.currentTarget, precision)),
          onPointerDown: () => { byPointer.current = true; }, onFocus: () => { if (!byPointer.current) setHover(index); byPointer.current = false; },
          onClick: (e) => onChange(valueAt(index, e.clientX, e.currentTarget, precision)),
        }, star)
        : h('span', { key: index, className: 'bui-rating__star-slot' }, star);
    }));
  const clear = () => setHover(null);
  return h('div', {
    ref, 'data-slot': 'rating', 'data-size': size, className: cx('bui-rating', `bui-rating__${SIZE_CLASS[size]}`, `bui-rating__${color}`, `bui-rating--${size}`, className),
    role: interactive ? 'radiogroup' : 'img', 'aria-label': ariaLabel, 'aria-labelledby': label ? labelId : undefined, 'data-disabled': disabled || undefined,
    ...(interactive && { onMouseLeave: clear, onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) clear(); } }),
  },
  label && h('span', { id: labelId, 'data-slot': 'rating-label', className: 'bui-rating__label' }, label),
  stars,
  caption && h('span', { 'data-slot': 'rating-caption', className: 'bui-rating__caption' }, caption));
}

/** Stars the user picks: whole values only. */
export function Rating({ value, defaultValue = 0, onValueChange, max = 5, size = 'md', label, caption, disabled = false, className, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  return h(Stars, { value: v, onChange: setV, max, size, label, caption, disabled, precision: 1, round: false, className, 'aria-label': label ? undefined : 'Rating', ...rest });
}
describe(Rating, 'Collects a rating as stars. Only whole values can be chosen.', {
  value: ['number', null, 'Selected stars (controlled)'],
  defaultValue: ['number', '0', 'Initially selected stars (uncontrolled)'],
  onValueChange: ['(value: number) => void', null, 'Called when a star is chosen'],
  max: ['number', '5', 'Number of stars'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Star size'],
  label: ['string', null, 'Label above the stars; also the accessible name'],
  caption: ['string', null, 'Hint under the stars'],
  disabled: ['boolean', 'false', 'Stars cannot be chosen'],
});

/** Stars that show a rating, such as an average score. */
export function RatingDisplay({ value = 0, max = 5, size = 'md', color = 'accent', round = true, label, caption, className, ...rest }) {
  return h(Stars, { value, max, size, color, round, label, caption, readOnly: true, className, 'aria-label': label ? undefined : `${value} out of ${max}`, ...rest });
}
describe(RatingDisplay, 'Shows a rating as stars, for example an average score. It cannot be changed.', {
  value: ['number', '0', 'The rating, from 0 to `max`'],
  max: ['number', '5', 'Number of stars'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Star size'],
  color: ["'accent' | 'warning'", "'accent'", 'Star color'],
  round: ['boolean', 'true', 'Round the value down to the nearest half star; off shows the exact fill'],
  label: ['string', null, 'Label above the stars'],
  caption: ['string', null, 'Text under the stars'],
});
