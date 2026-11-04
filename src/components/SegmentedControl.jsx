import { cx, useControllable, useRef, useId } from '../react.js';
import { useAppear, useReady, themeAttrs } from '../theme-flags.js';
import { useHighlight } from '../highlight.js';
import { describe } from '../doc.js';
import { Badge } from './Badge.jsx';

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth = false,
  showIcon = true,
  showLabel = true,
  showCounter = true,
  showBadge = true,
  shape = 'rounded',
  motion,
  label,
  labelPlacement = 'inside',
  className,
  ...rest
}) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items.find((i) => !i.disabled)?.value, onValueChange);
  const ref = useRef(null);
  const thumbRef = useRef(null);
  const ready = useReady();
  const enabled = items.filter((i) => !i.disabled);
  // Icon-only is just the label switched off; an item with nothing else to show keeps its label.
  const labelShown = (it) => showLabel || !(showIcon && it.icon);
  // An item that shows only its icon is a square of the control's item height, whatever the other items show.
  const iconOnlyItem = (it) => showIcon && !!it.icon && !labelShown(it) && !(showCounter && it.counter != null) && !(showBadge && it.badge != null);

  // The thumb slides to the selected item.
  const [thumb] = useHighlight(ref, (root) => root.querySelector('[aria-checked="true"]'), [
    current,
    items,
    size,
    fullWidth,
    showIcon,
    showLabel,
    showCounter,
    showBadge,
  ]);

  const onKeyDown = (e) => {
    const i = enabled.findIndex((x) => x.value === current);
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? enabled[(i + 1) % enabled.length]
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? enabled[(i - 1 + enabled.length) % enabled.length]
          : null;
    if (!next) return;
    e.preventDefault();
    setCurrent(next.value);
    ref.current.querySelector(`[data-value="${CSS.escape(String(next.value))}"]`)?.focus();
  };
  useAppear(thumbRef, ref, thumb && `${thumb.x}/${thumb.y}/${thumb.w}`);
  const titleId = useId();
  const outside = labelPlacement === 'outside' && !!label;
  const control = (
    <div
      {...themeAttrs({ motion })}
      role="radiogroup"
      aria-label={outside ? undefined : label}
      aria-labelledby={outside ? titleId : undefined}
      ref={ref}
      onKeyDown={onKeyDown}
      data-slot="segmented"
      data-size={size}
      className={cx(
        'bui-segmented',
        `bui-segmented--${size}`,
        fullWidth && 'bui-segmented--full',
        ready && 'bui-segmented--ready',
        shape === 'circle' && 'bui-shape-circle',
        className,
      )}
      {...rest}
    >
      {thumb && (
        <span
          ref={thumbRef}
          data-slot="segmented-thumb"
          className="bui-segmented__thumb"
          aria-hidden="true"
          style={{ width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
        />
      )}
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="radio"
          data-value={it.value}
          aria-checked={it.value === current}
          tabIndex={it.value === current ? 0 : -1}
          disabled={it.disabled}
          title={labelShown(it) ? undefined : it.label}
          aria-label={labelShown(it) ? undefined : it.label}
          data-slot="segmented-item"
          className={cx('bui-segmented__item', iconOnlyItem(it) && 'bui-segmented__item--icon')}
          onClick={() => setCurrent(it.value)}
        >
          {showIcon && it.icon && (
            <span data-slot="segmented-icon" className="bui-segmented__icon" aria-hidden="true">
              {it.icon}
            </span>
          )}
          {labelShown(it) && (
            <span data-slot="segmented-label" className="bui-segmented__label">
              {it.label}
            </span>
          )}
          {showCounter && it.counter != null && (
            <span data-slot="segmented-counter" className="bui-segmented__counter">
              {it.counter}
            </span>
          )}
          {showBadge && it.badge != null && (typeof it.badge === 'object' ? it.badge : <Badge label={it.badge} variant="critical" />)}
        </button>
      ))}
    </div>
  );
  if (!outside) return control;
  return (
    <div className="bui-segmented-field">
      <span id={titleId} className="bui-segmented-field__title">{label}</span>
      {control}
    </div>
  );
}
describe(SegmentedControl, 'A control for switching between a few exclusive options', {
  items: [
    'Array<{ value: string; label: string; icon?: ReactNode; counter?: number | string; badge?: ReactNode | string; disabled?: boolean }>',
    null,
    'Segments',
  ],
  value: ['string', null, 'Selected value'],
  defaultValue: ['string', null, 'Initial value (first enabled)'],
  onValueChange: ['(value: string) => void', null, 'Called when the selection changes'],
  size: ["'sm' | 'md'", "'md'", 'Control height'],
  fullWidth: ['boolean', 'false', 'Fill the container width; segments are equal'],
  showIcon: ['boolean', 'true', 'Show the item icons'],
  showLabel: ['boolean', 'true', 'Show the item labels; with it off the control is icons only and the label becomes the accessible name'],
  showCounter: ['boolean', 'true', 'Show the item counters'],
  showBadge: ['boolean', 'true', 'Show the item badges'],
  motion: [
    "'off' | 'basic' | 'enhanced'",
    'theme',
    'Animations of this control: off, basic, or enhanced (the highlight slides); by default the Animations setting of the theme',
  ],
  shape: ["'rounded' | 'circle'", "'rounded'", 'circle makes the control and its items pills; rounded follows the theme radius'],
  label: ['string', null, 'Accessible name; with `labelPlacement="outside"` also the visible title'],
  labelPlacement: ["'inside' | 'outside'", "'inside'", 'With `outside` the label is a semi-bold title above the control, as the title of a group of radios, checkboxes or tags; `inside` keeps it as the accessible name only'],
});
