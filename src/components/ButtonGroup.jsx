import { cx } from '../react.js';
import { describe } from '../doc.js';
import { ControlSizeContext } from '../control-size.js';

const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };

/**
 * A group of buttons that are one decision: Save and Cancel, Buy now and Add to cart. The group owns the layout, the buttons do not know about it.
 * Horizontal: a row that wraps when it runs out of room. Vertical: a column in which every button fills the width of the group.
 * With `size` the group gives its buttons one tier (the same height and text size, like a ControlRow); a button with a `size` of its own keeps it.
 */
export function ButtonGroup({ orientation = 'horizontal', stackOnMobile = false, size, gap = 3, justify, as = 'div', label, className, style, children, ...rest }) {
  const Tag = as;
  const group = (
    <Tag
      role="group"
      aria-label={label}
      data-slot="button-group"
      data-orientation={orientation}
      data-stack={stackOnMobile ? 'mobile' : undefined}
      className={cx('bui-button-group', className)}
      style={{ gap: `var(--bui-spacing-${gap})`, justifyContent: orientation === 'horizontal' && justify ? JUSTIFY[justify] : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
  return size ? <ControlSizeContext.Provider value={size}>{group}</ControlSizeContext.Provider> : group;
}
describe(
  ButtonGroup,
  'Lays out the buttons of one decision: a row that wraps (horizontal) or a column in which every button fills the width (vertical). The layout is the group’s, so a button needs no width of its own',
  {
    orientation: ["'horizontal' | 'vertical'", "'horizontal'", 'Horizontal is a row; vertical is a column and the buttons take the full width of the group'],
    stackOnMobile: ['boolean', 'false', 'A horizontal group becomes vertical below 768px (the mobile breakpoint), so the buttons of a dialog or a card are full width on a phone'],
    size: ["'xsm' | 'sm' | 'md' | 'lg'", null, 'One tier for the buttons of the group: the same height, text size and icon size. A button with its own size keeps it'],
    gap: ['number', '3', 'Gap between the buttons in steps of 4px'],
    justify: ["'start' | 'center' | 'end' | 'between'", null, 'Horizontal only: where the buttons stand in the row'],
    label: ['string', null, 'The name of the group for a screen reader (aria-label), when the buttons alone do not say what they are for'],
    as: ['ElementType', "'div'", 'The element of the group'],
    children: ['ReactNode', null, 'Buttons, icon buttons and links that look like buttons'],
  },
);
