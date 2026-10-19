import { h } from '../react.js';
import { RatingDisplay } from '../components/Rating.js';
import { meta, playground, example, Row } from './_helpers.js';

export default meta({
  title: 'Components/Rating Display', component: RatingDisplay, args: { value: 3.5, max: 5, size: 'md', color: 'accent', round: true, label: 'Average score', caption: '128 reviews' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } }, max: { control: 'inline-radio', options: [3, 5, 10] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, color: { control: 'inline-radio', options: ['accent', 'warning'] },
    round: { control: 'boolean' }, label: { control: 'text' }, caption: { control: 'text' },
  },
});
export const Playground = playground({ source: `<RatingDisplay value={3.5} label="Average score" caption="128 reviews" />` });
export const Colors = example({
  name: 'Colors', render: () => h(Row, null, ['accent', 'warning'].map((c) => h(RatingDisplay, { key: c, value: 3.5, color: c }))),
  source: `<RatingDisplay value={3.5} color="warning" />`,
});
export const __namedExportsOrder = ['Playground', 'Colors'];
