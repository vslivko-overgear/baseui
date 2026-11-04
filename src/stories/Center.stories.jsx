import { Center } from '../components/Layout.jsx';
import { meta, playground, Box } from './_helpers.jsx';

export default meta({ title: 'Components/Center', component: Center, args: {} });
export const Playground = {
  ...playground({ source: `<Center style={{ height: 160 }}>…</Center>` }),
  render: (args) => (
    <Center {...args} style={{ height: 160, background: 'var(--bui-background-secondary)', borderRadius: 'var(--bui-radius-2xl)' }}>
      <Box style={{ background: 'var(--bui-extensions-background-surface)' }}>Centered</Box>
    </Center>
  ),
};
export const __namedExportsOrder = ['Playground'];
