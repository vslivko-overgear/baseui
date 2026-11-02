import { cx } from '../react.js';
import { describe } from '../doc.js';
import { ControlSizeContext } from '../control-size.js';

// a step of the spacing scale in gaps (1 gap = 4px): 4 is 16px
const sp = (n) => (n === undefined ? undefined : `var(--baseui-spacing-${n})`);
const ALIGN = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' };
const JUSTIFY = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around' };

/** The levels of relation between blocks (rule H3): a gap is chosen by how closely the blocks belong together, not by a number. */
const RELATION = { tight: 'var(--bui-rel-tight)', related: 'var(--bui-rel-related)', group: 'var(--bui-rel-group)', section: 'var(--bui-rel-section)' };

export function Stack({ direction = 'column', gap = 4, relation, align, justify, wrap = false, as = 'div', className, style, children, ...rest }) {
  const Tag = as;
  return (
    <Tag
      data-slot="stack"
      className={cx('bui-stack', className)}
      style={{
        flexDirection: direction,
        gap: relation ? RELATION[relation] : sp(gap),
        alignItems: ALIGN[align],
        justifyContent: JUSTIFY[justify],
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
export const HStack = (props) => <Stack direction="row" align="center" {...props} />;
export const VStack = (props) => <Stack direction="column" {...props} />;

export function Center({ as = 'div', className, children, ...rest }) {
  const Tag = as;
  return (
    <Tag data-slot="center" className={cx('bui-center', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Grid({ columns = 2, gap = 4, as = 'div', className, style, children, ...rest }) {
  const template = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  const Tag = as;
  return (
    <Tag data-slot="grid" className={cx('bui-grid', className)} style={{ gridTemplateColumns: template, gap: sp(gap), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function Section({ as = 'section', padding = 6, maxWidth, className, style, children, ...rest }) {
  const Tag = as;
  return (
    <Tag data-slot="section" className={cx('bui-section', className)} style={{ padding: sp(padding), maxWidth, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** A block with its heading: the heading belongs to the content under it, so it sits close to it (8px), and the block takes its distance from the neighbours from the Stack around it. Put the content in one block (a Stack, a list, a grid): every child is `titleGap` from the one before. */
export function Group({ title, titleAs: Title = 'h2', titleGap = 'tight', as = 'section', className, children, ...rest }) {
  const Tag = as;
  return (
    <Tag data-slot="group" className={cx('bui-group', className)} style={{ gap: RELATION[titleGap] }} {...rest}>
      {title != null && <Title className="bui-group__title">{title}</Title>}
      {children}
    </Tag>
  );
}

/**
 * A row of controls (rule D15): buttons, icon buttons, fields, a search. The row gives them one tier, and every control without a `size` of its own takes it:
 * the same height, the same text size and the same icon size, so the row reads as one line. A field has the sizes 48 and 56 only, so a row with a field is `md` or `lg`;
 * a row of buttons and chips can also be `sm` or `xsm`.
 */
export function ControlRow({ size = 'md', gap = 2, align = 'center', as = 'div', className, style, children, ...rest }) {
  const Tag = as;
  return (
    <ControlSizeContext.Provider value={size}>
      <Tag data-slot="control-row" data-control-row={size} className={cx('bui-control-row', className)} style={{ gap: sp(gap), alignItems: ALIGN[align], ...style }} {...rest}>
        {children}
      </Tag>
    </ControlSizeContext.Provider>
  );
}
describe(ControlRow, 'A row of controls with one height, one text size and one icon size: the controls take the size of the row unless they have their own', {
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'The tier of the row: 32 / 40 / 48 / 56 px. A field has 48 and 56 only, so with a field use md or lg'],
  gap: ['number', '2', 'Gap between the controls in steps of 4px'],
  align: ["'start' | 'center' | 'end' | 'stretch'", "'center'", 'Alignment across the row'],
  children: ['ReactNode', null, 'Buttons, icon buttons, fields, chips'],
});

/** A block that runs out to the edges of the screen: past the padding of the page, with the same padding inside, so its first item still stands on the edge of the text. With `outset` it is the container that reaches out, and the content keeps the edge. */
export function Bleed({ scroll = false, outset, as = 'div', className, style, children, ...rest }) {
  const Tag = as;
  return (
    <Tag
      data-slot="bleed"
      data-scroll={scroll || undefined}
      className={cx('bui-bleed', className)}
      style={outset === undefined ? style : { '--bui-bleed': sp(outset), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

describe(Stack, 'A flex container with a consistent gap', {
  direction: ["'row' | 'column'", "'column'", 'Main axis'],
  gap: ['number', '4', 'Gap in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px'],
  relation: ["'tight' | 'related' | 'group' | 'section'", null, 'The gap by how closely the blocks belong together (8 / 16 / 24 / 40px); it replaces `gap`'],
  align: ["'start' | 'center' | 'end' | 'stretch' | 'baseline'", null, 'Cross-axis alignment'],
  justify: ["'start' | 'center' | 'end' | 'between' | 'around'", null, 'Main-axis distribution'],
  wrap: ['boolean', 'false', 'Allow items to wrap'],
  as: ['ElementType', "'div'", 'HTML tag'],
});
describe(HStack, 'A horizontal Stack', { gap: ['number', '4', 'Gap in gaps (1 gap = 4px), a step of the spacing scale'] });
describe(VStack, 'A vertical Stack', { gap: ['number', '4', 'Gap in gaps (1 gap = 4px), a step of the spacing scale'] });
describe(Center, 'Centers its content', { as: ['ElementType', "'div'", 'HTML tag'] });
describe(Grid, 'A CSS grid with equal columns', {
  columns: ['number | string', '2', 'Number of columns or a template string'],
  gap: ['number', '4', 'Gap in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px'],
});
describe(Section, 'A padded block with an optional maximum width', {
  padding: ['number', '6', 'Padding in gaps (1 gap = 4px), a step of the spacing scale: 6 is 24px'],
  maxWidth: ['number | string', null, 'Maximum width'],
});
describe(Group, 'A block with its heading: the heading sits close to the content, the group takes its distance from the Stack around it', {
  title: ['ReactNode', null, 'Heading of the group'],
  titleAs: ['ElementType', "'h2'", 'Heading tag'],
  titleGap: ["'tight' | 'related'", "'tight'", 'The distance between the heading and the content: 8px (tight) or 16px (related)'],
  as: ['ElementType', "'section'", 'HTML tag'],
});
describe(Bleed, 'A block that runs out to the edges of the screen with the padding of the page kept inside: a row of tags, a scroller or a listing', {
  scroll: ['boolean', 'false', 'Scrolls sideways, without a scrollbar'],
  outset: ['number', null, 'In gaps: instead of reaching the screen edge, reach out by this much (a card background that goes past the picture)'],
  as: ['ElementType', "'div'", 'HTML tag'],
});
