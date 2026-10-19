import { h } from '../react.js';
import { Badge } from '../components/Badge.js';
import { Heart } from './_ui.js';
import { meta, playground, example, Row } from './_helpers.js';

const VARIANTS = ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'blue', 'blue-light', 'green', 'green-light', 'orange', 'pink', 'red'];
export default meta({
  title: 'Components/Badge', component: Badge, args: { type: 'label', label: 'Badge', count: 7, variant: 'secondary', size: 'md', disabled: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['label', 'counter', 'dot'] },
    label: { control: 'text', if: { arg: 'type', eq: 'label' } },
    // A counter takes a number instead of the label; the field is a story setting for the `label` prop.
    count: { control: 'number', docs: false, if: { arg: 'type', eq: 'counter' } },
    variant: { control: 'select', options: VARIANTS }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, disabled: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<Badge variant="success" label="Active" />` }),
  render: ({ count, ...args }) => h(Badge, { ...args, label: args.type === 'counter' ? count ?? 0 : args.type === 'dot' ? 'New' : args.label }),
};
export const Variants = example({
  name: 'Variants', render: () => h(Row, null, VARIANTS.map((v) => h(Badge, { key: v, variant: v, label: v }))),
  source: `<Badge variant="info" label="info" />`,
});
export const Sizes = example({
  name: 'Sizes', render: () => h(Row, null, ['sm', 'md', 'lg'].map((z) => h(Badge, { key: z, size: z, variant: 'primary', label: z }))),
  source: `<Badge size="lg" variant="primary" label="lg" />`,
});
export const Disabled = example({
  name: 'Disabled', render: () => h(Row, null, ['primary', 'secondary', 'info', 'red'].map((v) => h(Badge, { key: v, variant: v, disabled: true, label: v }))),
  source: `<Badge variant="red" disabled label="red" />`,
});
export const Types = example({
  name: 'Types', render: () => h(Row, null, h(Badge, { variant: 'red', label: 'New' }), h(Badge, { type: 'counter', variant: 'red', label: 3 }), h(Badge, { type: 'counter', variant: 'red', label: 120 }), h(Badge, { type: 'dot', variant: 'red', label: 'New' })),
  source: `<Badge variant="red" label="New" />
<Badge type="counter" variant="red" label={3} />
<Badge type="dot" variant="red" label="New" />`,
});
export const WithIcon = example({
  name: 'With Icon', render: () => h(Row, null, h(Badge, { variant: 'pink', label: 'Favorite', icon: h(Heart, { size: 12 }) })),
  source: `<Badge label="Favorite" icon={<HeartIcon />} />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Sizes', 'Disabled', 'Types', 'WithIcon'];
