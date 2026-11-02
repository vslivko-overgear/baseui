# Form

The layout of a form: fields in rows with one gap in both directions, rows of one to four columns, and sections with a heading

The layout of a form: fields in rows with one gap in both directions

## Usage

**Do**

- Lay a form out with Form: one gap between rows and between columns, so the distance is the same in both directions
- Put fields that belong together in a FormRow (city and country, expiry and CVC); use a ratio such as [2, 1] for a long field and a short one
- Group a long form in FormSections with a heading; the sections stand at the group distance, and when a form has sections everything in it is in a section (a section without a title is fine)
- Put a switch or a checkbox beside a field in a FormRow with `align="center"`; a button beside a field takes the height of the fields by itself

**Don't**

- Space the fields of one form with different gaps, or give a field a margin (D18)
- Put more than four fields in a row, or fields of very different heights side by side
- Build the rows with a Stack and a Grid of your own: the gaps drift apart

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | `'form'` | The element: a form, or a div when the form is only a part of a bigger one |
| `children` | `ReactNode` | — | Fields (a field alone takes a whole row), `FormRow` for fields side by side, `FormSection` for a titled group |

## Examples

- Combinations
- One Gap

Live page: https://baseuikit.vercel.app/#/components/form
