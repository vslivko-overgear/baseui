# Collapsible

A section that expands and collapses

## Usage

**Do**

- Give the trigger a name that says what it opens
- Start it open when the content is needed on the first view

**Don't**

- Hide required or critical content in it
- Nest collapsibles more than two levels
- Use one for a single short paragraph: show the text

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Heading that toggles the content |
| `open` | `boolean` | — | Open state |
| `defaultOpen` | `boolean` | `false` | Initial state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when toggled |
| `disabled` | `boolean` | `false` | Prevent toggling |
| `children` | `ReactNode` | — | Collapsible content |

Live page: https://baseuikit.vercel.app/#/components/collapsible
