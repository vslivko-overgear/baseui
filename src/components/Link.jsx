import { cx } from '../react.js';
import { describe } from '../doc.js';

export function Link({ href, external = false, underline = 'always', className, children, ...rest }) {
  return (
    <a
      href={href}
      data-slot="link"
      className={cx('bui-link', `bui-link--${underline}`, className)}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </a>
  );
}
describe(Link, 'A hyperlink in the color of the text, underlined by default', {
  href: ['string', null, 'Destination'],
  external: ['boolean', 'false', 'Open in a new tab'],
  underline: ["'hover' | 'always' | 'none'", "'always'", 'When to underline: always by default, so a link is never told from text by color alone'],
});
