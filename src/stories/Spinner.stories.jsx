import { Spinner } from '../components/Spinner.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

const COLORS = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'on-color', 'inherit'];
export default meta({
  title: 'Components/Spinner',
  component: Spinner,
  args: { size: 'md', customSize: 32, color: 'primary' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'custom'] },
    customSize: { control: 'number', if: { arg: 'size', eq: 'custom' }, description: 'Any size in px' },
    color: { control: 'select', options: COLORS },
  },
});
export const Playground = playground({ source: '{}' });
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row gap="var(--bui-spacing-6)">
      {['xsm', 'sm', 'md', 'lg'].map((z) => (
        <Spinner key={z} size={z} />
      ))}
      <Spinner size="custom" customSize={72} />
      <Spinner size="custom" customSize="2.5rem" />
    </Row>
  ),
  source: `<Spinner size="xsm" /> <Spinner size="custom" customSize={72} /> <Spinner size="custom" customSize="2.5rem" />`,
});
export const Colors = example({
  name: 'Colors',
  render: () => (
    <Row gap="var(--bui-spacing-6)">
      {COLORS.filter((c) => c !== 'on-color').map((c) => (
        <Spinner key={c} color={c} />
      ))}
      <span style={{ display: 'inline-flex', padding: 12, borderRadius: 'var(--bui-radius-xl)', background: 'var(--bui-background-accent)' }}>
        <Spinner color="on-color" />
      </span>
    </Row>
  ),
  source: `<Spinner color="accent" />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Colors'];
