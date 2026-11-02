import { Rating } from '../components/Rating.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

export default meta({
  title: 'Components/Rating',
  component: Rating,
  args: { size: 'md', max: 5, label: 'Rate this product', caption: 'Click a star to rate', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    max: { control: 'inline-radio', options: [3, 5, 10] },
    label: { control: 'text' },
    caption: { control: 'text' },
    disabled: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<Rating label="Rate this product" value={value} onValueChange={setValue} />` }),
  render: (args) => <Rating key={args.max} {...args} />,
};
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row>
      {['sm', 'md', 'lg'].map((s) => (
        <Rating key={s} size={s} defaultValue={3} aria-label={s} />
      ))}
    </Row>
  ),
  source: `<Rating size="lg" defaultValue={3} />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes'];
