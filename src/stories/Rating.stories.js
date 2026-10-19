import { h } from '../react.js';
import { Rating } from '../components/Rating.js';
import { meta, playground, example, Row } from './_helpers.js';

export default meta({
  title: 'Components/Rating', component: Rating, args: { size: 'md', max: 5, label: 'Rate this product', caption: 'Click a star to rate', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, max: { control: 'inline-radio', options: [3, 5, 10] },
    label: { control: 'text' }, caption: { control: 'text' }, disabled: { control: 'boolean' },
  },
});
export const Playground = { ...playground({ source: `<Rating label="Rate this product" value={value} onValueChange={setValue} />` }), render: (args) => h(Rating, { key: args.max, ...args }) };
export const Sizes = example({
  name: 'Sizes', render: () => h(Row, null, ['sm', 'md', 'lg'].map((s) => h(Rating, { key: s, size: s, defaultValue: 3, 'aria-label': s }))),
  source: `<Rating size="lg" defaultValue={3} />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes'];
