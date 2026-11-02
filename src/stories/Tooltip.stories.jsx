import { Tooltip } from '../components/Tooltip.jsx';
import { Button } from './_ui.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

export default meta({
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { content: 'Save changes', placement: 'top', delay: 300 },
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    delay: { control: { type: 'range', min: 0, max: 1000, step: 100 } },
  },
});
export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => (
    <div style={{ padding: '48px 96px' }}>
      <Tooltip {...args}>
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
    </div>
  ),
};
export const Placements = example({
  name: 'Placements',
  render: () => (
    <div style={{ padding: '48px 96px' }}>
      <Row>
        {['top', 'bottom', 'left', 'right'].map((p) => (
          <Tooltip key={p} content={p} placement={p} delay={0}>
            <Button variant="secondary" size="sm">
              {p}
            </Button>
          </Tooltip>
        ))}
      </Row>
    </div>
  ),
  source: `<Tooltip content="top" placement="top"><Button>top</Button></Tooltip>`,
});
export const __namedExportsOrder = ['Playground', 'Placements'];
