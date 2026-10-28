import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';

function AlertIcon() {
  return h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' },
    h('circle', { cx: 12, cy: 12, r: 10 }), h('path', { d: 'M12 8v4M12 16h.01' }));
}

/** A full-width strip with a message and one action; shows the mobile texts in a narrow container. */
export function WarningBanner({ icon, message, mobileMessage, actionText, mobileActionText, actionHref, onAction, variant = 'error', className, ...rest }) {
  const button = (text, cls) => h(actionHref ? 'a' : 'button', {
    ...(actionHref ? { href: actionHref } : { type: 'button' }), 'data-slot': 'warning-banner-action', className: cx('og-warning__action', cls), onClick: onAction,
  }, text);
  return h('div', { role: 'alert', 'aria-live': 'polite', 'data-slot': 'warning-banner', 'data-variant': variant, className: cx('og-warning', `og-warning--${variant}`, className), ...rest },
    h('div', { className: 'og-warning__inner' },
      h('span', { 'data-slot': 'warning-banner-icon', className: 'og-warning__icon' }, icon ?? h(AlertIcon)),
      h('span', { 'data-slot': 'warning-banner-message', className: cx('og-warning__message', mobileMessage && 'og-warning__message--wide') }, message),
      mobileMessage && h('span', { 'data-slot': 'warning-banner-message', className: 'og-warning__message og-warning__message--narrow' }, mobileMessage),
      button(actionText, mobileActionText && 'og-warning__action--wide'),
      mobileActionText && button(mobileActionText, 'og-warning__action--narrow')));
}
describe(WarningBanner, 'A full-width strip for an important warning or error with a single action button. In a narrow container it switches to the shorter mobile texts.', {
  message: ['string', null, 'Message (desktop; also mobile when `mobileMessage` is not set)'],
  mobileMessage: ['string', null, 'Shorter message for a narrow container'],
  actionText: ['string', null, 'Action button text'],
  mobileActionText: ['string', null, 'Action button text for a narrow container'],
  actionHref: ['string', null, 'Makes the action a link'],
  onAction: ['() => void', null, 'Called when the action is pressed'],
  variant: ["'error' | 'warning'", "'error'", 'Color of the strip'],
  icon: ['ReactNode', null, 'Custom icon (an alert icon by default)'],
});
