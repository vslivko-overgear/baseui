import { Divider } from '../components/Divider.jsx';
import { meta, playground, example, Row, Stack } from './_helpers.jsx';

export default meta({
  title: 'Components/Divider',
  component: Divider,
  args: { orientation: 'horizontal', label: '' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] }, label: { control: 'text' } },
});
export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => (
    <div style={{ height: 80, display: 'flex', alignItems: 'center' }}>
      <Divider {...args} label={args.label || undefined} />
    </div>
  ),
};
export const Vertical = example({
  name: 'Vertical',
  render: () => (
    <Row>
      Profile
      <Divider orientation="vertical" />
      Settings
      <Divider orientation="vertical" />
      Sign out
    </Row>
  ),
  source: `<Row>Profile <Divider orientation="vertical" /> Settings <Divider orientation="vertical" /> Sign out</Row>`,
});
export const WithLabel = example({
  name: 'With Label',
  render: () => (
    <Stack width={360}>
      <Divider label="or" />
    </Stack>
  ),
  source: '<Divider label="or" />',
});
export const __namedExportsOrder = ['Playground', 'Vertical', 'WithLabel'];
