import { h } from '../react.js';
import { Card } from '../components/Card.js';
import { meta, playground, example, Row } from './_helpers.js';

const VARIANTS = ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'];
export default meta({
  title: 'Components/Card', component: Card, args: { variant: 'default', padding: 16, elevation: 'none', children: 'Card content' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    padding: { control: 'inline-radio', options: [8, 12, 16, 24, 32] },
    elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] },
    children: { control: 'text' },
  },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => h('div', { style: { width: 360, maxWidth: '100%' } }, h(Card, args)) };
export const Variants = example({
  name: 'Variants', render: () => h(Row, { align: 'stretch' }, VARIANTS.map((v) => h(Card, { key: v, variant: v, width: 120 }, v))),
  source: `<Card variant="blue">Card content</Card>`,
});
export const Elevation = example({
  name: 'Elevation', render: () => h(Row, { align: 'stretch' }, ['none', 'low', 'med', 'high'].map((e) => h(Card, { key: e, variant: 'transparent', elevation: e, width: 120 }, e))),
  source: `<Card elevation="med">Card content</Card>`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Elevation'];
