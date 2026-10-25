import { h, cx, useState } from '../react.js';
import { Button as Base } from '../base.js';
import { Tooltip } from './Tooltip.js';
import { Spinner } from './Spinner.js';
import { describe } from '../doc.js';

// The spinner of a loading button follows its size.
const SPINNER_PX = { xsm: 16, sm: 20, md: 24, lg: 24 };
// The variants of the design system on the variants of the compiled button: ghost is its text button, destructive a custom one.
const VARIANT = {
  ghost: { variant: 'text' },
  destructive: { variant: 'custom', customBackground: 'var(--baseui-Extensions-Background-Error)', customColor: 'var(--baseui-Extensions-Text-and-Icon-AlwaysDark)' },
};

export function Button({
  label, children, variant = 'secondary', size = 'md', disabled = false, loading = false, icon, endContent, iconOnly: isIconOnly = false, shape = 'rounded',
  width, tooltip, href, target, rel, type = 'button', onClick, clickAction, className, style, ref, ...rest
}) {
  const [pending, setPending] = useState(false);
  const sz = size;
  const common = { 'data-slot': isIconOnly ? 'icon-button' : 'button', 'data-variant': variant, 'data-size': sz, size: sz, loading: loading || pending, disabled, className: cx(isIconOnly && `bui-btn-icon bui-btn-icon--${sz}`, shape === 'circle' && 'bui-shape-circle', className), style: { width, ...(variant === 'destructive' && { '--baseui-button-custom-hover': 'var(--baseui-Extensions-Background-Error-Hover)' }), ...style } };
  const variantProps = VARIANT[variant] || { variant };
  const click = async (e) => {
    onClick && onClick(e);
    if (clickAction) { setPending(true); try { await clickAction(e); } finally { setPending(false); } }
  };
  const busy = loading || pending;
  // the loading indicator is the Spinner of the design system; the compiled one is hidden in CSS
  const spinner = busy && h(Spinner, { key: 's', size: 'custom', customSize: SPINNER_PX[sz], color: 'inherit', className: 'bui-btn__spinner', role: 'presentation', 'aria-label': undefined, 'aria-hidden': 'true' });
  const node = h(Base, {
    ref, ...common, ...variantProps, type: href ? undefined : type, 'aria-label': isIconOnly ? label : undefined, onClick: click,
    startIcon: isIconOnly ? undefined : icon, endIcon: isIconOnly ? undefined : endContent,
    ...(href && { render: h('a', { href, target, rel }) }), ...rest,
  }, isIconOnly ? [icon, spinner] : [h('span', { key: 'l', 'data-slot': 'btn-label', className: 'bui-btn__label' }, children ?? label), spinner]);
  const tip = tooltip === false ? undefined : tooltip || (isIconOnly ? label : undefined);
  return tip ? h(Tooltip, { content: tip }, node) : node;
}
describe(Button, 'Triggers an action or navigates. A label that does not fit in the width of the button is cut with an ellipsis, never wrapped.', {
  label: ['string', null, 'Visible text and accessible name'],
  children: ['ReactNode', null, 'Visible content in place of `label`'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  disabled: ['boolean', 'false', 'Disables the button'],
  loading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  icon: ['ReactNode', null, 'Icon before the label'],
  endContent: ['ReactNode', null, 'Content after the label, e.g. a chevron'],
  shape: ["'rounded' | 'circle'", "'rounded'", 'circle makes a pill (a circle for an icon button); rounded follows the theme radius. `data-shape="circle"` on a parent does it for all buttons inside'],
  width: ['number | string', null, 'Number is px; `"100%"` fills the container'],
  tooltip: ['string | false', null, 'Hover text; false turns the tooltip off (an icon-only button shows its label by default)'],
  href: ['string', null, 'Renders a link'],
  onClick: ['(event) => void', null, 'Click handler'],
  clickAction: ['(event) => void | Promise<void>', null, 'Async action; shows loading while pending'],
});

export function IconButton({ icon, ...props }) {
  return h(Button, { ...props, icon, iconOnly: true });
}
describe(IconButton, 'A button with only an icon.', {
  icon: ['ReactNode', null, 'Icon element'],
  label: ['string', null, 'Accessible name and tooltip'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  disabled: ['boolean', 'false', 'Disables the button'],
  loading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  tooltip: ['string | false', null, 'Hover text; the label by default, false turns it off'],
});
