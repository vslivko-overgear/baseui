# Calendar

A month grid for picking a date or a date range.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `ISODateString \| { start: ISODateString \| null; end: ISODateString \| null } \| null` | — | Selected date (`YYYY-MM-DD`), or the range when `mode="range"` (controlled) |
| `defaultValue` | `ISODateString \| { start, end } \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when the selection changes; a range is complete when `end` is set |
| `mode` | `'single' \| 'range'` | `'single'` | One date or a range of two |
| `focusDate` | `ISODateString` | — | Visible month (controlled). Unset, the calendar opens on the selection, else today clamped into min/max |
| `onFocusDateChange` | `(focusDate: ISODateString) => void` | — | Called when the visible month changes |
| `min` | `ISODateString` | — | Earliest selectable date |
| `max` | `ISODateString` | — | Latest selectable date |
| `dateConstraints` | `Array<(date: Date) => boolean>` | — | Custom rules: a date is selectable when every function returns true (for example weekdays only) |
| `minRangeSpan` | `number` | `1` | Range mode: fewest days a range may span, both ends counted (2 forbids a one-day range) |
| `maxRangeSpan` | `number` | — | Range mode: most days a range may span, both ends counted (7 is a 7-day window) |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 'sun' \| 'mon' \| …` | `0` | First day of the week: 0 or `sun` is Sunday, 1 or `mon` is Monday |
| `numberOfMonths` | `1 \| 2` | `1` | Months shown side by side |
| `hasOutsideDays` | `boolean` | `true` | Show days from adjacent months |
| `hasVariableRowCount` | `boolean` | `false` | Rows as needed instead of a fixed 6-row grid |
| `hasWeekNumbers` | `boolean` | `false` | Show ISO week numbers |
| `locale` | `string` | — | BCP 47 locale for month, weekday and number names (browser default) |
| `fluid` | `boolean` | `false` | Fill the container width; the days stretch (used in the dialog) |
| `handleRef` | `Ref<{ navigateTo(date) }>` | — | Imperative handle: `navigateTo(date)` shows that month |

## Examples

- Constraints
- Locale
- Range
- Range Span
- Single
- Two Months
- Week Numbers

Live page: http://localhost:8765/#/components/calendar
