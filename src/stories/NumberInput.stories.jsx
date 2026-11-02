import { NumberInput } from '../components/NumberInput.jsx';
import { meta, playground, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Number Input',
  component: NumberInput,
  args: { label: 'Quantity', defaultValue: 1, min: 0, max: 10, step: 1 },
  argTypes: { label: { control: 'text' }, min: { control: 'number' }, max: { control: 'number' }, step: { control: 'number' } },
});
export const Playground = {
  ...playground({ source: `<NumberInput label="Quantity" defaultValue={1} min={0} max={10} />` }),
  render: (args) => W(240, <NumberInput {...args} />),
};
export const __namedExportsOrder = ['Playground'];
