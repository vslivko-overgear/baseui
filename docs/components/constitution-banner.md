# Constitution Banner

A strip across the top of a prototype that warns it breaks the design constitution: which rules, where, and what each one asks for. It is not dismissible

The strip across the top of a prototype that warns it breaks the design constitution

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `violations` | `Array<string \| { id: string; note?: string }>` | `[]` | The broken rules by id (`H2`), each with an optional note on where it is broken. With none (and no audit) nothing renders |
| `audit` | `boolean` | `false` | Also run auditConstitution() on the page and add what it finds; repeats when the page changes |
| `rules` | `Array<{ id: string; title: string; level: 'must' \| 'should'; do: string; dont: string }>` | `baseui rules` | Definitions used to resolve violations; a product supplies its shared and local rules together |
| `href` | `string` | `the Constitution page` | Where "Read the constitution" leads |
| `defaultOpen` | `boolean` | `false` | Show the details of every rule at first |
| `sticky` | `boolean` | `true` | Stay at the top of the screen while the page scrolls |
| `className` | `string` | — | Extra class |

## Examples

- Open

Live page: https://baseuikit.vercel.app/#/components/constitution-banner
