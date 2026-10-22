import { h, cx } from '../react.js';
import { describe } from '../doc.js';

const sp = (n) => (n === undefined ? undefined : `var(--baseui-spacing-${n})`);
const ALIGN = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' };
const JUSTIFY = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around' };

export function Stack({ direction = 'column', gap = 16, align, justify, wrap = false, as = 'div', className, style, children, ...rest }) {
  return h(as, {
    'data-slot': 'stack', className: cx('bui-stack', className),
    style: { flexDirection: direction, gap: sp(gap), alignItems: ALIGN[align], justifyContent: JUSTIFY[justify], flexWrap: wrap ? 'wrap' : undefined, ...style }, ...rest,
  }, children);
}
export const HStack = (props) => h(Stack, { direction: 'row', align: 'center', ...props });
export const VStack = (props) => h(Stack, { direction: 'column', ...props });

export function Center({ as = 'div', className, children, ...rest }) {
  return h(as, { 'data-slot': 'center', className: cx('bui-center', className), ...rest }, children);
}

export function Grid({ columns = 2, gap = 16, as = 'div', className, style, children, ...rest }) {
  const template = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  return h(as, { 'data-slot': 'grid', className: cx('bui-grid', className), style: { gridTemplateColumns: template, gap: sp(gap), ...style }, ...rest }, children);
}

export function Section({ as = 'section', padding = 24, maxWidth, className, style, children, ...rest }) {
  return h(as, { 'data-slot': 'section', className: cx('bui-section', className), style: { padding: sp(padding), maxWidth, ...style }, ...rest }, children);
}

describe(Stack, 'A flex container with a consistent gap.', {
  direction: ["'row' | 'column'", "'column'", 'Main axis'],
  gap: ['number', '16', 'Gap in px, from the spacing scale'],
  align: ["'start' | 'center' | 'end' | 'stretch' | 'baseline'", null, 'Cross-axis alignment'],
  justify: ["'start' | 'center' | 'end' | 'between' | 'around'", null, 'Main-axis distribution'],
  wrap: ['boolean', 'false', 'Allow items to wrap'],
  as: ['ElementType', "'div'", 'HTML tag'],
});
describe(HStack, 'A horizontal Stack.', { gap: ['number', '16', 'Gap in px (spacing token).'] });
describe(VStack, 'A vertical Stack.', { gap: ['number', '16', 'Gap in px (spacing token).'] });
describe(Center, 'Centers its content.', { as: ['ElementType', "'div'", 'HTML tag.'] });
describe(Grid, 'A CSS grid with equal columns.', {
  columns: ['number | string', '2', 'Number of columns or a template string'],
  gap: ['number', '16', 'Gap in px, from the spacing scale'],
});
describe(Section, 'A padded block with an optional maximum width.', {
  padding: ['number', '24', 'Padding in px, from the spacing scale'],
  maxWidth: ['number | string', null, 'Maximum width'],
});
