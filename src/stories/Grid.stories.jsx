import { Grid } from '../components/Layout.jsx';
import { meta, playground, Box } from './_helpers.jsx';

export default meta({
  title: 'Components/Grid',
  component: Grid,
  args: { columns: 3, gap: 3 },
  argTypes: { columns: { control: 'inline-radio', options: [1, 2, 3, 4] }, gap: { control: 'inline-radio', options: [0, 1, 2, 3, 4, 6] } },
});
export const Playground = {
  ...playground({ source: `<Grid columns={3} gap={3}>…</Grid>` }),
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i}>{i + 1}</Box>
      ))}
    </Grid>
  ),
};
export const __namedExportsOrder = ['Playground'];
