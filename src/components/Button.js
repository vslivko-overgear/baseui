import { h, cx, useState } from '../react.js';
import { Button as Base } from '../base.js';
import { Tooltip } from './Tooltip.js';
import { describe } from '../doc.js';

export function Button({
  label, children, variant = 'secondary', size, isDisabled, isLoading = false, icon, endContent, isIconOnly = false, shape = 'rounded', motion,
  width, tooltip, href, target, rel, type = 'button', onClick, clickAction, className, style, ref, ...rest
}) {
  const [pending, setPending] = useState(false);
  const sz = size || 'md';
  const disabled = isDisabled ?? false;
  const common = { size: sz, loading: isLoading || pending, disabled, className: cx(isIconOnly && `bui-btn-icon bui-btn-icon--${sz}`, shape === 'circle' && 'bui-shape-circle', className), style: { width, ...(variant === 'destructive' && { '--baseui-button-custom-hover': 'var(--baseui-Extensions-Background-Error-Hover)' }), ...style } };
  const variantProps = variant === 'ghost' ? { variant: 'text' }
    : variant === 'destructive' ? { variant: 'custom', customBackground: 'var(--baseui-Extensions-Background-Error)', customColor: 'var(--baseui-Extensions-Text-and-Icon-AlwaysDark)' }
      : { variant };
  const click = async (e) => {
    onClick && onClick(e);
    if (clickAction) { setPending(true); try { await clickAction(e); } finally { setPending(false); } }
  };
  const node = h(Base, {
    ref, 'data-motion': motion, ...common, ...variantProps, type: href ? undefined : type, 'aria-label': isIconOnly ? label : undefined, onClick: click,
    startIcon: isIconOnly ? undefined : icon, endIcon: isIconOnly ? undefined : endContent,
    ...(href && { render: h('a', { href, target, rel }) }), ...rest,
  }, isIconOnly ? icon : children ?? label);
  const tip = tooltip === false ? undefined : tooltip || (isIconOnly ? label : undefined);
  return tip ? h(Tooltip, { content: tip }, node) : node;
}
describe(Button, 'Triggers an action or navigates.', {
  label: ['string', null, 'Visible text and accessible name'],
  children: ['ReactNode', null, 'Visible content in place of `label`'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
  isDisabled: ['boolean', 'false', 'Disables the button'],
  isLoading: ['boolean', 'false', 'Shows a spinner and blocks interaction'],
  icon: ['ReactNode', null, 'Icon before the label'],
  endContent: ['ReactNode', null, 'Content after the label, e.g. a chevron'],
  shape: ["'rounded' | 'circle'", "'rounded'", 'circle makes a pill (a circle for an icon button); rounded follows the theme radius. `data-shape="circle"` on a parent does it for all buttons inside'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animations of this button: off, basic, or enhanced (it is pressed in); by default the Animations setting of the theme'],
  isIconOnly: ['boolean', 'false', 'Square icon-only button; `label` becomes `aria-label`'],
  width: ['number | string', null, 'Number is px; `"100%"` fills the container'],
  tooltip: ['string | false', null, 'Hover text; false turns the tooltip off (an icon-only button shows its label by default)'],
  href: ['string', null, 'Renders a link'],
  onClick: ['(event) => void', null, 'Click handler'],
  clickAction: ['(event) => void | Promise<void>', null, 'Async action; shows loading while pending'],
});

export function IconButton({ icon, ...props }) {
  return h(Button, { ...props, icon, isIconOnly: true });
}
describe(IconButton, 'A button with only an icon.', {
  icon: ['ReactNode', null, 'Icon element'],
  label: ['string', null, 'Accessible name and tooltip'],
  variant: ["'primary' | 'secondary' | 'ghost' | 'destructive'", "'secondary'", 'Visual style'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Height: 32 / 40 / 48 / 56 px'],
});
