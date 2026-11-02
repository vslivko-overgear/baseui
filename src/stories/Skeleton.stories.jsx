import { Skeleton } from '../components/Skeleton.jsx';
import { Card } from '../components/Card.jsx';
import { meta, playground, example, Stack, Row, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { variant: 'text', lines: 3 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    lines: { control: { type: 'range', min: 1, max: 6, step: 1 }, if: { arg: 'variant', eq: 'text' } },
  },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(360, <Skeleton {...args} />) };
export const CardLoading = example({
  name: 'Card Loading',
  render: () => (
    <Card variant="surface" aria-busy="true" aria-label="Loading card" width={360} maxWidth="100%">
      <Stack>
        <Row>
          <Skeleton variant="circle" />
          <div style={{ flex: 1 }}>
            <Skeleton width="50%" />
          </div>
        </Row>
        <Skeleton variant="rect" />
        <Skeleton lines={2} />
      </Stack>
    </Card>
  ),
  source: `<Card aria-busy="true">
  <Skeleton variant="circle" />
  <Skeleton variant="rect" />
  <Skeleton lines={2} />
</Card>`,
});
export const __namedExportsOrder = ['Playground', 'CardLoading'];
