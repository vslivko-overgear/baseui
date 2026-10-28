import { h, cx, useState } from '../react.js';
import { Button as BaseButton } from '@base-ui/react/button';
import { Tooltip } from './Tooltip.js';
import { Spinner } from './Spinner.js';
import { describe } from '../doc.js';

// The spinner of a loading button follows its size.
const SPINNER_PX = { xsm: 16, sm: 20, md: 24, lg: 24 };

/**
 * A button on top of the Base UI Button, which brings the keyboard, focus and the disabled state (a loading button stays focusable).
 * The height is fixed by `size`; only the width is flexible. With `href` it renders a link; with `iconOnly` (see IconButton) a square.
 */
export function Button({
  label, children, variant = 'secondary', size = 'md', disabled = false, loading = false, icon, endContent, iconOnly = false, shape = 'rounded',
  width, tooltip, href, target, rel, type = 'button', onClick, clickAction, className, style, ref, ...rest
}) {
  const [pending, setPending] = useState(false);
  const busy = loading || pending;
  const click = async (e) => {
    onClick && onClick(e);
    if (clickAction) { setPending(true); try { await clickAction(e); } finally { setPending(false); } }
  };
  const node = h(BaseButton, {
    ref, 'data-slot': iconOnly ? 'icon-button' : 'button', 'data-variant': variant, 'data-size': size, className: cx('bui-button', shape === 'circle' && 'bui-shape-circle', className), style: { width, ...style },
    disabled: disabled || busy, focusableWhenDisabled: busy, nativeButton: !href, type: href ? undefined : type, 'aria-label': iconOnly ? label : undefined, 'aria-busy': busy || undefined,
    'data-loading': busy || undefined, 'data-loading-disabled': (disabled && busy) || undefined, onClick: click, ...(href && { render: h('a', { href, target, rel }) }), ...rest,
  },
  h('span', { 'data-slot': 'button-content', 'data-hidden': busy || undefined, className: 'bui-button__content' },
    !iconOnly && icon != null && h('span', { 'data-slot': 'button-icon', className: 'bui-button__icon' }, icon),
    iconOnly ? icon : h('span', { 'data-slot': 'btn-label', className: 'bui-button__label' }, children ?? label),
    !iconOnly && endContent != null && h('span', { 'data-slot': 'button-icon', className: 'bui-button__icon' }, endContent)),
  busy && h(Spinner, { size: 'custom', customSize: SPINNER_PX[size], color: 'inherit', className: 'bui-button__spinner', role: 'presentation', 'aria-label': undefined, 'aria-hidden': 'true' }));
  const tip = tooltip === false ? undefined : tooltip || (iconOnly ? label : undefined);
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
