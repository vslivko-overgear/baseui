# Form Row

Fields side by side with the gap of the form. Equal columns, or a ratio such as [2, 1]; one column when the form is narrower than 360px

Fields side by side, equal or in a ratio

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `number \| number[]` | `the number of fields` | How many equal columns (1 to 4), or the shares of each column: `[2, 1]` is two thirds and one third |
| `align` | `'start' \| 'center'` | `'start'` | Across the row: fields start at the top; `center` centers a choice control (a switch, a checkbox) beside a field |
| `stack` | `'narrow' \| 'never'` | `'narrow'` | Below 360px of form width the fields stack; `never` keeps them side by side (a card expiry and its code) |
| `children` | `ReactNode` | — | The fields of the row |

## Examples

- Combinations

Live page: https://baseuikit.vercel.app/#/components/form-row
