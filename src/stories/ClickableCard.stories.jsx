import { ClickableCard } from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Clickable Card',
  component: ClickableCard,
  args: { label: 'Open project', disabled: false, variant: 'default', padding: 4, elevation: 'none' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'] },
    padding: { control: 'inline-radio', options: [2, 3, 4, 6, 8] },
    elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] },
    disabled: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<ClickableCard label="Open project" onClick={open}>Project Atlas</ClickableCard>` }),
  render: (args) => (
    <div style={{ width: 320 }}>
      <ClickableCard onClick={() => {}} {...args}>
        Project Atlas
      </ClickableCard>
    </div>
  ),
};
export const NestedAction = example({
  name: 'Nested Action',
  render: () => (
    <div style={{ width: 320 }}>
      <ClickableCard label="Open project" onClick={() => {}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          Project Atlas
          <Button label="Share" size="sm" onClick={() => {}} />
        </div>
      </ClickableCard>
    </div>
  ),
  source: `<ClickableCard label="Open project" onClick={open}>\n  Project Atlas\n  <Button label="Share" />\n</ClickableCard>`,
});
export const __namedExportsOrder = ['Playground', 'NestedAction'];
