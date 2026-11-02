# Skeleton

A placeholder shown while content loads

## Usage

**Do**

- Match the size and shape of the content that is loading

**Don't**

- Use it when the size of the content is unknown: use Spinner
- Use it together with a Spinner on the same area
- Show it for ever: after a while show an error or an empty state

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'rect' \| 'circle'` | `'text'` | Placeholder shape |
| `width` | `number \| string` | — | Width |
| `height` | `number \| string` | — | Height (rect and circle) |
| `lines` | `number` | `1` | Number of text lines |

## Examples

- Card Loading

Live page: https://baseuikit.vercel.app/#/components/skeleton
