import { Hint } from '../components/Hint.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Hint',
  component: Hint,
  args: { content: 'Cashback is credited to your balance in OG Coins after the order is completed', label: 'More information', closeLabel: 'Close' },
  argTypes: { content: { control: 'text' }, label: { control: 'text' }, closeLabel: { control: 'text' } },
});
export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => (
    <div style={{ padding: '48px 96px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Cashback you will receive <Hint {...args} /></span>
    </div>
  ),
};
export const NextToALabel = example({
  name: 'Next to a label',
  render: () => (
    <div style={{ padding: '48px 96px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Payment fee <Hint content="The fee of the payment method, added to the amount" /></span>
    </div>
  ),
});
