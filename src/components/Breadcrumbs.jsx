import { cx, Fragment, useRef, useEffect } from '../react.js';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { describe } from '../doc.js';

export function Breadcrumbs({ items: all, showCurrent = true, label = 'Breadcrumbs', className, ...rest }) {
  // without the current page the trail ends at its parent, which stays a link
  const items = showCurrent ? all : all.slice(0, -1);
  const nav = useRef(null);
  // a trail that is longer than its room does not wrap: it is one line that scrolls sideways, and it starts at its end, where the place is
  useEffect(() => { if (nav.current) nav.current.scrollLeft = nav.current.scrollWidth; }, [items.length]);
  return (
    <nav ref={nav} aria-label={label} data-slot="breadcrumbs" className={cx('bui-breadcrumbs', className)} {...rest}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const current = showCurrent && last;
          const content =
            current || (!item.href && !item.onClick) ? (
              <span data-slot="breadcrumbs-current" className="bui-breadcrumbs__current" aria-current={current ? 'page' : undefined}>
                {item.label}
              </span>
            ) : item.href ? (
              <a data-slot="breadcrumbs-link" className="bui-breadcrumbs__link" href={item.href} onClick={item.onClick}>
                {item.label}
              </a>
            ) : (
              <button type="button" data-slot="breadcrumbs-link" className="bui-breadcrumbs__link" onClick={item.onClick}>
                {item.label}
              </button>
            );
          return (
            <Fragment key={i}>
              <li>{content}</li>
              {!last && (
                <li aria-hidden="true" data-slot="breadcrumbs-sep" className="bui-breadcrumbs__sep">
                  <BuiltinIcon name="chevronRight" size={16} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

describe(Breadcrumbs, 'Links that show where the user is in a hierarchy. A trail longer than its room stays on one line and scrolls sideways, starting at its end', {
  items: ['Array<{ label: ReactNode; href?: string; onClick?: () => void }>', null, 'Breadcrumb items in order'],
  showCurrent: ['boolean', 'true', 'Show the current page, the last item. Off, the trail ends at its parent'],
  label: ['string', "'Breadcrumbs'", 'Accessible name'],
});
