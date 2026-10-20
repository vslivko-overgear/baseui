import { h, cx, useEffect, useRef, useState } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

/**
 * The items of the control: the first and the last page, the current one with `siblings` on each side and a gap on each side.
 * The number of items is always the same (2 * siblings + 5), so nothing jumps when the page changes; a gap stands in for the hidden pages.
 */
function range(page, total, siblings) {
  const slots = 2 * siblings + 5;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const edge = 2 * siblings + 3;
  if (page <= siblings + 2) return [...Array.from({ length: edge }, (_, i) => i + 1), '…', total];
  if (page >= total - siblings - 1) return [1, '…', ...Array.from({ length: edge }, (_, i) => total - edge + 1 + i)];
  return [1, '…', ...Array.from({ length: 2 * siblings + 1 }, (_, i) => page - siblings + i), '…', total];
}

export function Pagination({ page, total, onPageChange, siblings = 1, autoScroll = false, autoScrollInterval = 3000, loop = true, label = 'Pagination', className, ...rest }) {
  const go = (p) => p >= 1 && p <= total && p !== page && onPageChange(p);
  const [paused, setPaused] = useState(false);
  const latest = useRef({ page, total, onPageChange, loop });
  latest.current = { page, total, onPageChange, loop };
  // auto scroll: the next page loads every interval; it waits while the pointer or the focus is on the control or the tab is hidden
  useEffect(() => {
    if (!autoScroll || paused || total < 2) return undefined;
    const t = setInterval(() => {
      if (document.hidden) return;
      const c = latest.current;
      if (c.page < c.total) c.onPageChange(c.page + 1);
      else if (c.loop) c.onPageChange(1);
    }, Math.max(300, autoScrollInterval));
    return () => clearInterval(t);
  }, [autoScroll, autoScrollInterval, paused, total, page]);
  const items = range(page, total, siblings);
  const atEnd = autoScroll && !loop && page >= total;
  return h('nav', {
    'aria-label': label, className: cx('bui-pagination', className), 'data-auto-scroll': autoScroll && !atEnd ? '' : undefined,
    onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: () => setPaused(false), ...rest,
  },
    h('button', { type: 'button', className: 'bui-page', 'aria-label': 'Previous page', disabled: page <= 1, onClick: () => go(page - 1) }, h(Icon, { name: 'chevronDown', size: 18, style: { transform: 'rotate(90deg)' } })),
    items.map((p, i) => {
      if (p !== '…') return h('button', { key: p, type: 'button', className: 'bui-page', 'aria-current': p === page ? 'page' : undefined, 'aria-label': `Page ${p}`, onClick: () => go(p) }, p);
      // a gap is a button too: it jumps to the middle of the pages it hides
      const target = Math.round((items[i - 1] + items[i + 1]) / 2);
      return h('button', { key: 'e' + i, type: 'button', className: 'bui-page bui-page--gap', 'aria-label': `Jump to page ${target}`, onClick: () => go(target) }, '…');
    }),
    h('button', { type: 'button', className: 'bui-page', 'aria-label': 'Next page', disabled: page >= total, onClick: () => go(page + 1) }, h(Icon, { name: 'chevronRight', size: 18 })));
}
describe(Pagination, 'Navigation between pages. The number of items is always the same (the first and the last page, the current one with its neighbours, and a gap on each side), so nothing jumps; a gap is a button that jumps to the middle of the pages it hides, when the page changes; the arrows stay and are disabled at the ends. It can also move through the pages by itself.', {
  page: ['number', null, 'Current page (1-based)'],
  total: ['number', null, 'Number of pages'],
  onPageChange: ['(page: number) => void', null, 'Called with the new page'],
  siblings: ['number', '1', 'Pages shown on each side of the current one'],
  autoScroll: ['boolean', 'false', 'Loads the next page by itself every `autoScrollInterval`; it waits while the pointer or the focus is on the control and while the tab is hidden'],
  autoScrollInterval: ['number', '3000', 'Auto scroll: milliseconds between pages (at least 300)'],
  loop: ['boolean', 'true', 'Auto scroll: after the last page go back to the first; off stops on the last page'],
  label: ['string', "'Pagination'", 'Accessible name'],
});
