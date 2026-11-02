import { FormRow } from '../components/Form.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Form Row',
  component: FormRow,
  args: { columns: undefined, stack: 'narrow' },
  argTypes: {
    columns: { control: 'inline-radio', options: ['auto', '2', '3', '2:1', '1:2', '3:1'], mapping: { auto: undefined, 2: 2, 3: 3, '2:1': [2, 1], '1:2': [1, 2], '3:1': [3, 1] } },
    stack: { control: 'inline-radio', options: ['narrow', 'never'] },
  },
});
export const Playground = {
  ...playground({ source: `<FormRow columns={[2, 1]}><TextInput label="Card number" /><TextInput label="CVC" /></FormRow>` }),
  render: (args) => (
    <div style={{ width: 480, maxWidth: '100%' }}>
      <FormRow {...args}><TextInput label="Card number" /><TextInput label="CVC" /></FormRow>
    </div>
  ),
};
export const Combinations = example({
  name: 'Combinations',
  description: 'The usual rows: two equal, three equal, and the ratios of a name and a short field',
  render: () => (
    <div style={{ width: 520, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormRow><TextInput label="First name" /><TextInput label="Last name" /></FormRow>
      <FormRow><TextInput label="City" /><TextInput label="State" /><TextInput label="ZIP" /></FormRow>
      <FormRow columns={[2, 1]}><TextInput label="Street" /><TextInput label="Apt" /></FormRow>
      <FormRow columns={[1, 1, 1, 1]}><TextInput label="A" /><TextInput label="B" /><TextInput label="C" /><TextInput label="D" /></FormRow>
    </div>
  ),
  source: `<FormRow />                      // equal columns, by the number of fields
<FormRow columns={[2, 1]} />     // a ratio`,
});
