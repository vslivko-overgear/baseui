import { useState } from '../react.js';
import { SelectableCard } from '../components/Card.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

export default meta({
  title: 'Components/Selectable Card',
  component: SelectableCard,
  args: { label: 'Pro plan', disabled: false, variant: 'default', padding: 4, elevation: 'none' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'] },
    padding: { control: 'inline-radio', options: [2, 3, 4, 6, 8] },
    elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] },
    disabled: { control: 'boolean' },
  },
});
function Demo(args) {
  const [on, setOn] = useState(false);
  return (
    <div style={{ width: 280 }}>
      <SelectableCard {...args} checked={on} onCheckedChange={setOn}>
        Pro plan · $12 / month
      </SelectableCard>
    </div>
  );
}
export const Playground = {
  ...playground({ source: `<SelectableCard label="Pro plan" checked={on} onCheckedChange={setOn}>Pro plan</SelectableCard>` }),
  render: (args) => <Demo {...args} />,
};
function Plans() {
  const [v, setV] = useState('pro');
  return (
    <Row align="stretch">
      {['free', 'pro', 'team'].map((p) => (
        <div key={p} style={{ width: 140 }}>
          <SelectableCard label={p} checked={v === p} onCheckedChange={() => setV(p)}>
            {p}
          </SelectableCard>
        </div>
      ))}
    </Row>
  );
}
export const Group = example({
  name: 'Group',
  render: () => <Plans />,
  source: `<SelectableCard label="Pro" checked={plan === 'pro'} onCheckedChange={() => setPlan('pro')}>Pro</SelectableCard>`,
});
export const __namedExportsOrder = ['Playground', 'Group'];
