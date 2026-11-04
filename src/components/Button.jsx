import { cx, useState } from '../react.js';
import { Button as BaseButton } from '@base-ui/react/button';
import { Tooltip } from './Tooltip.jsx';
import { Spinner } from './Spinner.jsx';
import { describe } from '../doc.js';
import { useControlSize } from '../control-size.js';

// The spinner of a loading button follows its size.
const SPINNER_PX = { xsm: 16, sm: 20, md: 24, lg: 24 };

// The text sizes a button of each size can have (px); the first is the default of the size
export const BUTTON_TEXT = { xsm: [12], sm: [14, 12], md: [16, 14], lg: [16, 20] };
const textOf = (size, text) => (BUTTON_TEXT[size] || BUTTON_TEXT.md).includes(Number(text)) ? Number(text) : (BUTTON_TEXT[size] || BUTTON_TEXT.md)[0];

/**
 * A button on top of the Base UI Button, which brings the keyboard, focus and the disabled state (a loading button stays focusable).
 * The height is fixed by `size`; only the width is flexible. With `href` it renders a link; with `iconOnly` (see IconButton) a square.
 */
export function Button({
  label,
  children,
  variant = 'secondary',
  size: sizeProp,
  textSize,
  disabled = false,
  loading = false,
  icon,
  endContent,
  iconOnly = false,
  shape = 'rounded',
  width,
  tooltip,
  href,
  target,
  rel,
  type = 'button',
  onClick,
  clickAction,
  className,
  style,
  ref,
  ...rest
}) {
  const row = useControlSize();
  const size = sizeProp ?? row ?? 'md';
  const [pending, setPending] = useState(false);
  const busy = loading || pending;
  const click = async (e) => {
    onClick && onClick(e);
    if (clickAction) {
      setPending(true);
      try {
        await clickAction(e);
      } finally {
        setPending(false);
      }
    }
  };
  const node = (
    <BaseButton
      ref={ref}
      data-slot={iconOnly ? 'icon-button' : 'button'}
      data-variant={variant}
      data-size={size}
      data-text={textOf(size, textSize)}
      data-hug-icon={width == null && !iconOnly && icon != null ? '' : undefined}
      className={cx('bui-button', shape === 'circle' && 'bui-shape-circle', className)}
      style={{ width, ...style }}
      disabled={disabled || busy}
      focusableWhenDisabled={busy}
      nativeButton={!href}
      type={href ? undefined : type}
      aria-label={iconOnly ? label : undefined}
      aria-busy={busy || undefined}
      data-loading={busy || undefined}
      data-loading-disabled={(disabled && busy) || undefined}
      onClick={click}
      {...(href && { render: <a href={href} target={target} rel={rel} /> })}
      {...rest}
    >
      <span data-slot="button-content" data-hidden={busy || undefined} className="bui-button__content">
        {!iconOnly && icon != null && (
          <span data-slot="button-icon" className="bui-button__icon">
            {icon}
          </span>
        )}
        {iconOnly ? (
          icon
        ) : (
          <span data-slot="btn-label" className="bui-button__label">
            {children ?? label}
          </span>
        )}
        {!iconOnly && endContent != null && (
          <span data-slot="button-icon" className="bui-button__icon">
            {endContent}
          </span>
        )}
      </span>
      {busy && (
        <Spinner
          size="custom"
          customSize={SPINNER_PX[size]}
          color="inherit"
          className="bui-button__spinner"
          role="presentation"
          aria-label={undefined}
          aria-hidden="true"
        />
      )}
    </BaseButton>
  );
  const tip = tooltip === false ? undefined : tooltip || (iconOnly ? label : undefined);
  return tip ? <Tooltip content={tip}>{node}</Tooltip> : node;
}
describe(Button, 'Triggers an action or navigates. A label that does not fit in the width of the button is cut with an ellipsis, never wrapped', {
  label: ['string', null, 'Visible text and accessible name'],
  children: ['ReactNode', null, 'Visible content in place of `label`'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height and padding: 32 / 40 / 48 / 56 px'],
  textSize: ["12 | 14 | 16 | 20", 'the first of the size', 'Text size inside the size: xsm 12; sm 14 or 12; md 16 or 14; lg 16 or 20. Another value falls back to the default of the size. A button in a row with an input takes the input text size and height'],
  disabled: ['boolean', 'false', 'Disables the button'],
  loading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  iconOnly: ['boolean', 'false', 'A square button with only the icon; `label` becomes its accessible name (IconButton sets it)'],
  rel: ['string', null, 'The rel of the link when `href` is set'],
  icon: ['ReactNode', null, 'Icon before the label'],
  endContent: ['ReactNode', null, 'Content after the label, e.g. a chevron'],
  shape: [
    "'rounded' | 'circle'",
    "'rounded'",
    'circle makes a pill (a circle for an icon button); rounded follows the theme radius. `data-shape="circle"` on a parent does it for all buttons inside',
  ],
  width: ['number | string', null, 'Number is px; `"100%"` fills the container'],
  tooltip: ['string | false', null, 'Hover text; false turns the tooltip off (an icon-only button shows its label by default)'],
  href: ['string', null, 'Renders a link'],
  onClick: ['(event) => void', null, 'Click handler'],
  clickAction: ['(event) => void | Promise<void>', null, 'Async action; shows loading while pending'],
});

export function IconButton({ icon, ...props }) {
  return <Button {...props} icon={icon} iconOnly />;
}
describe(IconButton, 'A button with only an icon', {
  icon: ['ReactNode', null, 'Icon element'],
  label: ['string', null, 'Accessible name and tooltip'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  disabled: ['boolean', 'false', 'Disables the button'],
  loading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  tooltip: ['string | false', null, 'Hover text; the label by default, false turns it off'],
});
