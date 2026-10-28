import { h, cx, useState, useRef, useEffect } from '../../react.js';
import { describe } from '../../doc.js';
import { Popover } from '../../components/Popover.js';

function Pill({ item, last }) {
  const [open, setOpen] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const canHover = () => typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches;
  const hover = (on) => () => { if (!canHover()) return; clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(on), on ? 0 : 120); };
  const pill = h('span', { className: 'og-usp__pill' }, h('span', { className: 'og-usp__pill-inner' },
    item.iconImage && h('img', { src: item.iconImage, alt: '', 'aria-hidden': 'true', width: 20, height: 20, className: 'og-usp__icon' }),
    h('span', { className: 'og-usp__title' }, item.title)));
  if (!item.text) return h('div', { 'data-slot': 'selling-point', className: 'og-usp__item' }, pill);
  return h('div', { 'data-slot': 'selling-point', className: 'og-usp__item og-usp__item--tip', onMouseEnter: hover(true), onMouseLeave: hover(false) },
    h(Popover, {
      open, onOpenChange: setOpen, placement: last ? 'bottom-end' : 'bottom-start', label: item.title, panelClassName: 'og-usp__panel',
      trigger: (props) => h('button', { type: 'button', ...props, 'aria-label': item.title, className: 'og-usp__button', onClick: (e) => { props.onClick(e); e.currentTarget.scrollIntoView?.({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } }, pill),
    }, h('div', { className: 'og-usp__text', dangerouslySetInnerHTML: { __html: item.text } })));
}

export function OfferSellingPoints({ sellingPoints, className, ...rest }) {
  const items = sellingPoints.filter((p) => p.title);
  return h('div', { 'data-slot': 'offer-selling-points', className: cx('og-usp', className), ...rest },
    h('div', { className: 'og-usp__row' }, items.map((item, i) => h(Pill, { key: item.id, item, last: i === items.length - 1 }))));
}
describe(OfferSellingPoints, 'A row of selling-point pills with a gradient outline. It wraps when there is room and scrolls sideways when there is not. A pill with `text` opens a tooltip-like panel on hover or tap; the panel is drawn over the page, so the scrolling row never clips it.', {
  sellingPoints: ['Array<{ id: string; title?: string; text?: string; iconImage?: string }>', null, 'Pills; `text` is HTML (sanitized upstream) shown in the panel, items without `title` are skipped'],
});
