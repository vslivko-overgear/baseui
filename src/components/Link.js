import { h, cx } from '../react.js';
import { describe } from '../doc.js';

export function Link({ href, external = false, underline = 'hover', className, children, ...rest }) {
  return h('a', {
    href, 'data-slot': 'link', className: cx('bui-link', `bui-link--${underline}`, className),
    ...(external && { target: '_blank', rel: 'noopener noreferrer' }), ...rest,
  }, children);
}
describe(Link, 'A hyperlink.', {
  href: ['string', null, 'Destination'],
  external: ['boolean', 'false', 'Open in a new tab'],
  underline: ["'hover' | 'always' | 'none'", "'hover'", 'When to underline'],
});
