import { h, cx, useControllable } from '../react.js';
import { BaseRating } from '../base.js';
import { describe } from '../doc.js';

/** Stars the user picks: whole values only. */
export function Rating({ value, defaultValue = 0, onValueChange, max = 5, size = 'md', label, caption, disabled = false, className, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  return h(BaseRating, { value: v, onChange: setV, max, size, label, caption, disabled, precision: 1, round: false, className: cx('bui-rating', `bui-rating--${size}`, className), 'aria-label': label ? undefined : 'Rating', ...rest });
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
  return h(BaseRating, { value, max, size, color, round, label, caption, readOnly: true, className: cx('bui-rating', `bui-rating--${size}`, className), 'aria-label': label ? undefined : `${value} out of ${max}`, ...rest });
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
