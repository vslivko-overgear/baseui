import { h } from '../react.js';
import { Spinner } from '../components/Spinner.js';
import { meta, playground, example, Row } from './_helpers.js';

const COLORS = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'on-color', 'inherit'];
export default meta({
  title: 'Components/Spinner', component: Spinner, args: { size: 'md', customSize: 32, color: 'primary' },
  argTypes: { size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'custom'] }, customSize: { control: 'number', if: { arg: 'size', eq: 'custom' }, description: 'Any size in px' }, color: { control: 'select', options: COLORS } },
});
export const Playground = playground({ source: '{}' });
export const Sizes = example({ name: 'Sizes', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, ['xsm', 'sm', 'md', 'lg'].map((z) => h(Spinner, { key: z, size: z })), h(Spinner, { size: 'custom', customSize: 72 }), h(Spinner, { size: 'custom', customSize: '2.5rem' })), source: `<Spinner size="xsm" /> <Spinner size="custom" customSize={72} /> <Spinner size="custom" customSize="2.5rem" />` });
export const Colors = example({
  name: 'Colors', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, COLORS.filter((c) => c !== 'on-color').map((c) => h(Spinner, { key: c, color: c })), h('span', { style: { display: 'inline-flex', padding: 12, borderRadius: 'var(--baseui-radius-12)', background: 'var(--baseui-Background-Accent)' } }, h(Spinner, { color: 'on-color' }))),
  source: `<Spinner color="accent" />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Colors'];
