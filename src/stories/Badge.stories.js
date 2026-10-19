import { h } from '../react.js';
import { Badge } from '../components/Badge.js';
import { Heart } from './_ui.js';
import { meta, playground, example, Row } from './_helpers.js';

const VARIANTS = ['neutral', 'info', 'success', 'warning', 'error', 'blue', 'blue-light', 'green', 'green-light', 'orange', 'pink', 'red', 'inverse'];
export default meta({
  title: 'Components/Badge', component: Badge, args: { variant: 'neutral', size: 'md', disabled: false, label: 'Badge' },
  argTypes: { variant: { control: 'select', options: VARIANTS }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, disabled: { control: 'boolean' }, label: { control: 'text' } },
});
export const Playground = playground({ source: `<Badge variant="success" label="Active" />` });
export const Variants = example({
  name: 'Variants', render: () => h(Row, null, VARIANTS.map((v) => h(Badge, { key: v, variant: v, label: v }))),
  source: `<Badge variant="info" label="info" />`,
});
export const Sizes = example({
  name: 'Sizes', render: () => h(Row, null, ['sm', 'md', 'lg'].map((z) => h(Badge, { key: z, size: z, variant: 'inverse', label: z }))),
  source: `<Badge size="lg" variant="inverse" label="lg" />`,
});
export const Disabled = example({
  name: 'Disabled', render: () => h(Row, null, ['info', 'red', 'inverse'].map((v) => h(Badge, { key: v, variant: v, disabled: true, label: v }))),
  source: `<Badge variant="red" disabled label="red" />`,
});
export const WithIcon = example({
  name: 'With Icon', render: () => h(Row, null, h(Badge, { variant: 'pink', label: 'Favorite', icon: h(Heart, { size: 12 }) })),
  source: `<Badge label="Favorite" icon={<HeartIcon />} />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Sizes', 'Disabled', 'WithIcon'];
