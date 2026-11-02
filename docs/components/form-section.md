# Form Section

A group of fields, with a heading or without one, inside a Form. The fields keep the gap of the form; when a form has sections, everything in it is in a section, so the distances stay one set

A titled group of fields

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | The heading of the group; without it the section is only a group of fields |
| `titleAs` | `ElementType` | `'h2'` | The heading element: h2 under the h1 of the page, h3 inside a section that has an h2 |
| `as` | `ElementType` | `'fieldset'` | The element of the group |
| `children` | `ReactNode` | — | Fields and rows |

Live page: https://baseuikit.vercel.app/#/components/form-section
