import { Card } from '../components/Card.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

const VARIANTS = ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'];
export default meta({
  title: 'Components/Card',
  component: Card,
  args: { variant: 'default', padding: 4, elevation: 'none', children: 'Card content' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    padding: { control: 'inline-radio', options: [2, 3, 4, 6, 8] },
    elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] },
    children: { control: 'text' },
  },
});
export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => (
    <div style={{ width: 360, maxWidth: '100%' }}>
      <Card {...args} />
    </div>
  ),
};
export const Variants = example({
  name: 'Variants',
  render: () => (
    <Row align="stretch">
      {VARIANTS.map((v) => (
        <Card key={v} variant={v} width={120}>
          {v}
        </Card>
      ))}
    </Row>
  ),
  source: `<Card variant="blue">Card content</Card>`,
});
export const Elevation = example({
  name: 'Elevation',
  render: () => (
    <Row align="stretch">
      {['none', 'low', 'med', 'high'].map((e) => (
        <Card key={e} variant="transparent" elevation={e} width={120}>
          {e}
        </Card>
      ))}
    </Row>
  ),
  source: `<Card elevation="med">Card content</Card>`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Elevation'];
