import { useState } from 'react';
import { Form, FormRow } from '../components/Form.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Selector } from '../components/Selector.jsx';
import { Button } from '../components/Button.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { CheckboxGroup } from '../components/CheckboxGroup.jsx';
import { RadioGroup } from '../components/RadioGroup.jsx';
import { Switch } from '../components/Switch.jsx';
import { FormSection } from '../components/Form.jsx';
import { useFieldErrors } from '../use-field-errors.js';
import { meta, playground, example } from './_helpers.jsx';

const countries = ['Germany', 'Japan', 'Spain', 'United States'].map((v) => ({ value: v, label: v }));

export default meta({
  title: 'Components/Form',
  component: Form,
});
const frame = (children) => <div style={{ width: 480, maxWidth: '100%' }}>{children}</div>;
export const Playground = {
  ...playground({
    source: `<Form>
  <TextInput label="Full name" />
  <TextInput label="Address" />
  <FormRow><TextInput label="City" /><Selector label="Country" options={countries} /></FormRow>
  <FormRow columns={[2, 1]}><TextInput label="Card number" /><TextInput label="CVC" /></FormRow>
  <Button variant="primary" label="Pay now" width="100%" />
</Form>`,
  }),
  render: (args) =>
    frame(
      <Form {...args} as="div">
        <TextInput label="Full name" />
        <TextInput label="Address" />
        <FormRow><TextInput label="City" /><Selector label="Country" options={countries} /></FormRow>
        <FormRow columns={[2, 1]}><TextInput label="Card number" /><TextInput label="CVC" /></FormRow>
        <Button variant="primary" label="Pay now" width="100%" />
      </Form>,
    ),
};
export const OneGap = example({
  name: 'One gap',
  description: 'The distance between two rows and between two columns is the same gap of the form: it cannot differ',
  render: () => frame(<Form as="div"><FormRow><TextInput label="First name" /><TextInput label="Last name" /></FormRow><TextInput label="Email" /></Form>),
  source: `<Form>…</Form>`,
});

function ErrorsDemo() {
  const [v, setV] = useState({ name: '', email: '' });
  const errors = { name: v.name ? '' : 'Enter your name', email: /.+@.+/.test(v.email) ? '' : 'Enter a valid email' };
  const errs = useFieldErrors(errors);
  return frame(
    <Form onSubmit={(e) => { e.preventDefault(); if (Object.values(errors).some(Boolean)) errs.reveal(); else errs.reset(); }}>
      <TextInput label="Name" value={v.name} {...errs.field('name', { onChange: (e) => setV({ ...v, name: e.target.value }) })} />
      <TextInput label="Email" value={v.email} {...errs.field('email', { onChange: (e) => setV({ ...v, email: e.target.value }) })} />
      <Button type="submit" variant="primary" label="Send" width="100%" />
    </Form>,
  );
}
export const Errors = example({
  name: 'Errors on submit',
  description: '`useFieldErrors(errors)` keeps the errors quiet until `reveal()` (on submit): then they show and the first wrong field gets focus. An error goes away at the first typed character',
  render: () => <ErrorsDemo />,
  source: `const errs = useFieldErrors({ name: name ? '' : 'Enter your name' });
<Form onSubmit={(e) => { e.preventDefault(); errs.reveal(); }}>
  <TextInput label="Name" value={name} {...errs.field('name', { onChange: (e) => setName(e.target.value) })} />
</Form>`,
});

const choices = ['Email', 'SMS', 'Push'].map((v) => ({ value: v, label: v }));
export const Combinations = example({
  name: 'Combinations',
  description: 'Inputs, a selector, choices and a button in one form: one gap in both directions, whatever the mix',
  render: () => (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Form as="div">
        <FormSection title="Account">
          <FormRow><TextInput label="First name" /><TextInput label="Last name" /></FormRow>
          <TextInput label="Email" type="email" />
          <FormRow columns={[2, 1]}><TextInput label="Company" /><Selector label="Size" options={['1–10', '11–50', '51+'].map((v) => ({ value: v, label: v }))} /></FormRow>
          <Checkbox label="Remember this device" />
        </FormSection>
        <FormSection title="Notifications">
          <Switch label="Send me product news" />
          <Switch label="Weekly summary" defaultChecked />
          <CheckboxGroup title="Channels" options={choices} defaultValue={['Email']} />
          <RadioGroup title="Frequency" defaultValue="daily" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
        </FormSection>
        <FormSection>
          <FormRow><TextInput label="Promo code" /><Button variant="secondary" label="Apply" /></FormRow>
          <FormRow columns={[2, 1]} align="center"><TextInput label="Nickname" /><Switch label="Public" defaultChecked /></FormRow>
          <TextInput label="Message" multiline minRows={3} />
          <Button variant="primary" label="Save" width="100%" />
        </FormSection>
      </Form>
    </div>
  ),
  source: `<Form>…</Form>`,
});
