import { h, cx, useEffect, useRef, useState } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

function range(page, total, siblings) {
  const set = new Set([1, total, page]);
  for (let i = 1; i <= siblings; i++) { set.add(page - i); set.add(page + i); }
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push(n - nums[i - 1] === 2 ? n - 1 : '…'); out.push(n); });
  return out;
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
  const atEnd = autoScroll && !loop && page >= total;
  return h('nav', {
    'aria-label': label, className: cx('bui-pagination', className), 'data-auto-scroll': autoScroll && !atEnd ? '' : undefined,
    onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: () => setPaused(false), ...rest,
  },
    page > 1 && h('button', { type: 'button', className: 'bui-page', 'aria-label': 'Previous page', onClick: () => go(page - 1) }, h(Icon, { name: 'chevronDown', size: 18, style: { transform: 'rotate(90deg)' } })),
    range(page, total, siblings).map((p, i) => p === '…'
      ? h('span', { key: 'e' + i, className: 'bui-page bui-page--gap', 'aria-hidden': 'true' }, '…')
      : h('button', { key: p, type: 'button', className: 'bui-page', 'aria-current': p === page ? 'page' : undefined, 'aria-label': `Page ${p}`, onClick: () => go(p) }, p)),
    page < total && h('button', { type: 'button', className: 'bui-page', 'aria-label': 'Next page', onClick: () => go(page + 1) }, h(Icon, { name: 'chevronRight', size: 18 })));
}
describe(Pagination, 'Navigation between pages. The arrows appear only where there is a page to go to. It can also move through the pages by itself.', {
  page: ['number', null, 'Current page (1-based)'],
  total: ['number', null, 'Number of pages'],
  onPageChange: ['(page: number) => void', null, 'Called with the new page'],
  siblings: ['number', '1', 'Pages shown on each side of the current one'],
  autoScroll: ['boolean', 'false', 'Loads the next page by itself every `autoScrollInterval`; it waits while the pointer or the focus is on the control and while the tab is hidden'],
  autoScrollInterval: ['number', '3000', 'Auto scroll: milliseconds between pages (at least 300)'],
  loop: ['boolean', 'true', 'Auto scroll: after the last page go back to the first; off stops on the last page'],
  label: ['string', "'Pagination'", 'Accessible name'],
});
