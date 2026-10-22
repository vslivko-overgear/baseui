import { h, cx, Fragment } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

export function Breadcrumbs({ items, label = 'Breadcrumbs', className, ...rest }) {
  return h('nav', { 'aria-label': label, 'data-slot': 'breadcrumbs', className: cx('bui-breadcrumbs', className), ...rest },
    h('ol', null, items.map((item, i) => {
      const last = i === items.length - 1;
      const content = last || (!item.href && !item.onClick)
        ? h('span', { 'data-slot': 'breadcrumbs-current', className: 'bui-breadcrumbs__current', 'aria-current': last ? 'page' : undefined }, item.label)
        : item.href
          ? h('a', { 'data-slot': 'breadcrumbs-link', className: 'bui-breadcrumbs__link', href: item.href, onClick: item.onClick }, item.label)
          : h('button', { type: 'button', 'data-slot': 'breadcrumbs-link', className: 'bui-breadcrumbs__link', onClick: item.onClick }, item.label);
      return h(Fragment, { key: i },
        h('li', null, content),
        !last && h('li', { 'aria-hidden': 'true', 'data-slot': 'breadcrumbs-sep', className: 'bui-breadcrumbs__sep' }, h(Icon, { name: 'chevronRight', size: 16 })));
    })));
}

describe(Breadcrumbs, 'Links that show where the user is in a hierarchy.', {
  items: ['Array<{ label: ReactNode; href?: string; onClick?: () => void }>', null, 'Breadcrumb items in order'],
  label: ['string', "'Breadcrumbs'", 'Accessible name'],
});
