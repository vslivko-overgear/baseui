import { cx } from '../react.js';
import { describe } from '../doc.js';
import { ControlSizeContext } from '../control-size.js';

/**
 * A form: its fields, in rows, at one distance from each other. The form owns the space (one gap, `--bui-form-gap`), the fields own nothing:
 * the distance between two rows is the distance between two columns, because both are the same gap, so a form cannot have a 12px here and a 20px there.
 * The form gives its controls the tier of its fields (56px), so a button beside a field, or a button that closes the form, is as high as the fields (rule D15).
 */
export function Form({ as = 'form', className, style, children, ...rest }) {
  const Tag = as;
  return (
    <ControlSizeContext.Provider value="lg">
      <Tag data-slot="form" className={cx('bui-form', className)} style={style} {...rest}>
        {children}
      </Tag>
    </ControlSizeContext.Provider>
  );
}
describe(Form, 'The layout of a form: fields in rows with one gap in both directions, rows of one to four columns, and sections with a heading', {
  as: ['ElementType', "'form'", 'The element: a form, or a div when the form is only a part of a bigger one'],
  children: ['ReactNode', null, 'Fields (a field alone takes a whole row), `FormRow` for fields side by side, `FormSection` for a titled group'],
});

/** A row of fields side by side: equal columns by default, or a ratio. The row is one column when the form is narrower than 360px. */
export function FormRow({ columns, stack = 'narrow', align = 'start', className, style, children, ...rest }) {
  const count = columns == null ? Math.min(4, Math.max(1, [].concat(children).filter(Boolean).length)) : Array.isArray(columns) ? columns.length : columns;
  const template = Array.isArray(columns) ? columns.map((n) => `minmax(0, ${n}fr)`).join(' ') : `repeat(${count}, minmax(0, 1fr))`;
  return (
    <div data-slot="form-row" data-stack={stack === 'never' ? 'never' : undefined} className={cx('bui-form__row', className)} style={{ gridTemplateColumns: template, alignItems: align === 'center' ? 'center' : undefined, ...style }} {...rest}>
      {children}
    </div>
  );
}
describe(FormRow, 'Fields side by side with the gap of the form. Equal columns, or a ratio such as [2, 1]; one column when the form is narrower than 360px', {
  columns: ['number | number[]', 'the number of fields', 'How many equal columns (1 to 4), or the shares of each column: `[2, 1]` is two thirds and one third'],
  align: ["'start' | 'center'", "'start'", 'Across the row: fields start at the top; `center` centers a choice control (a switch, a checkbox) beside a field'],
  stack: ["'narrow' | 'never'", "'narrow'", 'Below 360px of form width the fields stack; `never` keeps them side by side (a card expiry and its code)'],
  children: ['ReactNode', null, 'The fields of the row'],
});

/** A titled group of fields: the heading stands close to its fields, and the sections of a form stand apart from each other. */
export function FormSection({ title, titleAs: Title = 'h2', as = 'fieldset', className, children, ...rest }) {
  const Tag = as;
  return (
    <Tag data-slot="form-section" className={cx('bui-form__section', className)} {...rest}>
      {title != null && <Title className="bui-form__title">{title}</Title>}
      <div className="bui-form__fields">{children}</div>
    </Tag>
  );
}
describe(FormSection, 'A group of fields, with a heading or without one, inside a Form. The fields keep the gap of the form; when a form has sections, everything in it is in a section, so the distances stay one set', {
  title: ['ReactNode', null, 'The heading of the group; without it the section is only a group of fields'],
  titleAs: ['ElementType', "'h2'", 'The heading element: h2 under the h1 of the page, h3 inside a section that has an h2'],
  as: ['ElementType', "'fieldset'", 'The element of the group'],
  children: ['ReactNode', null, 'Fields and rows'],
});
