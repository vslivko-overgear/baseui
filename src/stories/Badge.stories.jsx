import { Badge } from '../components/Badge.jsx';
import { Heart } from './_ui.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

const VARIANTS = ['primary', 'secondary', 'accent', 'success', 'warning', 'critical'];
const COLORS = ['accent', 'success', 'warning', 'critical'];
export default meta({
  title: 'Components/Badge',
  component: Badge,
  args: { type: 'label', label: 'Badge', count: 7, variant: 'secondary', size: 'md', disabled: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['label', 'counter', 'dot'] },
    label: { control: 'text', if: { arg: 'type', eq: 'label' } },
    // A counter takes a number instead of the label; the field is a story setting for the `label` prop.
    count: { control: 'number', docs: false, if: { arg: 'type', eq: 'counter' } },
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<Badge variant="success" label="Active" />` }),
  render: ({ count, ...args }) => <Badge {...args} label={args.type === 'counter' ? (count ?? 0) : args.type === 'dot' ? 'New' : args.label} />,
};
export const Variants = example({
  name: 'Variants',
  render: () => (
    <Row>
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v} label={v} />
      ))}
      {COLORS.map((v) => (
        <Badge key={`${v}-light`} variant={v} light label={`${v} light`} />
      ))}
    </Row>
  ),
  source: `<Badge variant="accent" label="accent" />
<Badge variant="accent" light label="accent light" />`,
});
export const Light = example({
  name: 'Light',
  description: 'The light version of a color: a tint with the main text, for a list or a table where bright tags would shout',
  render: () => (
    <Row>
      {COLORS.map((v) => (
        <Badge key={v} variant={v} light label={v} />
      ))}
    </Row>
  ),
  source: `<Badge variant="success" light label="Completed" />`,
});
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row>
      {['sm', 'md', 'lg'].map((z) => (
        <Badge key={z} size={z} variant="primary" label={z} />
      ))}
    </Row>
  ),
  source: `<Badge size="lg" variant="primary" label="lg" />`,
});
export const Disabled = example({
  name: 'Disabled',
  render: () => (
    <Row>
      {['primary', 'secondary', 'accent', 'critical'].map((v) => (
        <Badge key={v} variant={v} disabled label={v} />
      ))}
    </Row>
  ),
  source: `<Badge variant="critical" disabled label="critical" />`,
});
export const Types = example({
  name: 'Types',
  render: () => (
    <Row>
      <Badge variant="critical" label="New" />
      <Badge type="counter" variant="critical" label={3} />
      <Badge type="counter" variant="critical" label={120} />
      <Badge type="dot" variant="critical" label="New" />
    </Row>
  ),
  source: `<Badge variant="critical" label="New" />
<Badge type="counter" variant="critical" label={3} />
<Badge type="dot" variant="critical" label="New" />`,
});
export const WithIcon = example({
  name: 'With Icon',
  render: () => (
    <Row>
      <Badge variant="accent" label="Favorite" icon={<Heart size={12} />} />
    </Row>
  ),
  source: `<Badge label="Favorite" icon={<HeartIcon />} />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Sizes', 'Disabled', 'Types', 'WithIcon'];
