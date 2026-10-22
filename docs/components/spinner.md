# Spinner

A loading indicator.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg' \| 'custom' \| number` | `'md'` | Size: 16 / 24 / 40 / 56 px; custom takes the size from `customSize`; a number is px |
| `customSize` | `number \| string` | — | Any size: a number in px or a CSS length (`1.5rem`); used only with `size="custom"` |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'on-color' \| 'inherit'` | `'primary'` | Color preset; on-color is for use on filled backgrounds, inherit takes the color of the surrounding text |

## Examples

- Colors
- Sizes

Live page: http://localhost:8765/#/components/spinner
