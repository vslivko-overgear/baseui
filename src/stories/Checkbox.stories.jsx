import { Checkbox } from '../components/Checkbox.jsx';
import { meta, playground, example, Row, Stack } from './_helpers.jsx';

export default meta({
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Label', size: 'md', motion: 'theme', defaultChecked: false, disabled: false, indeterminate: false, error: '' },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    error: { control: 'text' },
  },
});
export const Playground = playground({ source: '{}' });
export const States = example({
  name: 'States',
  description: 'Box states: unchecked, checked, indeterminate, disabled, disabled and checked',
  render: () => (
    <Stack>
      {['md', 'sm'].map((s) => (
        <Row key={s}>
          <Checkbox size={s} aria-label="unchecked" />
          <Checkbox size={s} defaultChecked aria-label="checked" />
          <Checkbox size={s} indeterminate aria-label="indeterminate" />
          <Checkbox size={s} disabled aria-label="disabled" />
          <Checkbox size={s} disabled defaultChecked aria-label="disabled and checked" />
        </Row>
      ))}
    </Stack>
  ),
  source: `<Checkbox aria-label="Accept" defaultChecked />`,
});
export const WithLabel = example({
  name: 'With Label',
  description: 'With and without a label. For a group of checkboxes see Checkbox Group',
  render: () => (
    <Stack gap="var(--bui-spacing-3)">
      <Checkbox label="With a label" defaultChecked />
      <Checkbox aria-label="no label" />
    </Stack>
  ),
  source: `<Checkbox label="I agree to the terms" />`,
});
export const WithError = example({
  name: 'With Error',
  description: 'The error is text under the field; the box has no outline',
  render: () => <Checkbox label="I agree to the terms" error="Required field" />,
  source: `<Checkbox label="I agree to the terms" error="Required field" />`,
});
export const __namedExportsOrder = ['Playground', 'States', 'WithLabel', 'WithError'];
