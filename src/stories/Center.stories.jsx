import { Center } from '../components/Layout.jsx';
import { meta, playground, Box } from './_helpers.jsx';

export default meta({ title: 'Components/Center', component: Center, args: {} });
export const Playground = {
  ...playground({ source: `<Center style={{ height: 160 }}>…</Center>` }),
  render: (args) => (
    <Center {...args} style={{ height: 160, background: 'var(--baseui-background-secondary)', borderRadius: 'var(--baseui-radius-2xl)' }}>
      <Box style={{ background: 'var(--baseui-extensions-background-surface)' }}>Centered</Box>
    </Center>
  ),
};
export const __namedExportsOrder = ['Playground'];
