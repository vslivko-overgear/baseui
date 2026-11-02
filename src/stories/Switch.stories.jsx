import { Switch } from '../components/Switch.jsx';
import { meta, playground, example, Row, Stack } from './_helpers.jsx';

export default meta({
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Label', size: 'md', shape: 'circle', defaultChecked: false, disabled: false, error: '' },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
});
export const Playground = playground({ source: '{}' });
export const States = example({
  name: 'States',
  render: () => (
    <Stack>
      <Row>
        {['md', 'sm', 'lg'].map((s) => (
          <Row key={s}>
            <Switch size={s} aria-label={`${s} off`} />
            <Switch size={s} defaultChecked aria-label={`${s} on`} />
            <Switch size={s} disabled aria-label={`${s} disabled`} />
            <Switch size={s} disabled defaultChecked aria-label={`${s} disabled on`} />
          </Row>
        ))}
      </Row>
    </Stack>
  ),
  source: `<Switch aria-label="Notifications" defaultChecked />`,
});
export const WithLabel = example({
  name: 'With Label',
  render: () => (
    <Stack gap="var(--baseui-spacing-3)">
      <Switch label="Small label" size="sm" defaultChecked />
      <Switch label="Medium label" defaultChecked />
      <Switch label="Large label" size="lg" defaultChecked />
    </Stack>
  ),
  source: `<Switch label="Notifications" />`,
});
export const WithError = example({
  name: 'With Error',
  render: () => <Switch label="I accept the terms" error="Accept the terms to continue" />,
  source: `<Switch label="I accept the terms" error="Accept the terms to continue" />`,
});
export const __namedExportsOrder = ['Playground', 'States', 'WithLabel', 'WithError'];
