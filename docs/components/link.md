# Link

A hyperlink in the color of the text, underlined by default

## Usage

**Do**

- Write link text that says where it goes
- Use it for navigation, inside text or on its own
- Keep the default: the color of the text and an underline

**Don't**

- Use a link for an action that does not navigate: use Button
- Write "click here" or "read more"
- Recolor a link in text or take its underline away

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | Destination |
| `external` | `boolean` | `false` | Open in a new tab |
| `underline` | `'hover' \| 'always' \| 'none'` | `'always'` | When to underline: always by default, so a link is never told from text by color alone |

Live page: https://baseuikit.vercel.app/#/components/link
