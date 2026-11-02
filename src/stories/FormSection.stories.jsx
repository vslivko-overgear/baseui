import { Form, FormSection, FormRow } from '../components/Form.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { meta, playground } from './_helpers.jsx';

export default meta({ title: 'Components/Form Section', component: FormSection, args: { title: 'Shipping' }, argTypes: { title: { control: 'text' } } });
export const Playground = {
  ...playground({ source: `<Form as="div">\n  <FormSection title="Shipping">…</FormSection>\n  <FormSection title="Payment">…</FormSection>\n</Form>` }),
  render: (args) => (
    <div style={{ width: 480, maxWidth: '100%' }}>
      <Form as="div">
        <FormSection {...args}><TextInput label="Address" /><FormRow><TextInput label="City" /><TextInput label="ZIP" /></FormRow></FormSection>
        <FormSection title="Payment"><TextInput label="Card number" /><FormRow><TextInput label="Expiry" /><TextInput label="CVC" /></FormRow></FormSection>
      </Form>
    </div>
  ),
};
