import { h, cx } from '../react.js';
import { describe } from '../doc.js';

export function Skeleton({ variant = 'text', width, height, lines = 1, className, style, ...rest }) {
  if (variant === 'text' && lines > 1) {
    return h('div', { 'data-slot': 'skeleton-lines', className: cx('bui-skeleton-lines', className), 'aria-hidden': 'true', style, ...rest },
      Array.from({ length: lines }, (_, i) => h('span', {
        key: i, className: 'bui-skeleton bui-skeleton--text', style: { width: i === lines - 1 ? '60%' : width },
      })));
  }
  return h('span', {
    'aria-hidden': 'true', 'data-slot': 'skeleton', className: cx('bui-skeleton', `bui-skeleton--${variant}`, className),
    style: { width, height, ...style }, ...rest,
  });
}

describe(Skeleton, 'A placeholder shown while content loads.', {
  variant: ["'text' | 'rect' | 'circle'", "'text'", 'Placeholder shape'],
  width: ['number | string', null, 'Width'],
  height: ['number | string', null, 'Height (rect and circle)'],
  lines: ['number', '1', 'Number of text lines'],
});
