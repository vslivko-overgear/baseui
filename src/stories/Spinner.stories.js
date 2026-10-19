import { h } from '../react.js';
import { Spinner } from '../components/Spinner.js';
import { meta, playground, example, Row } from './_helpers.js';

const COLORS = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'on-color'];
export default meta({
  title: 'Components/Spinner', component: Spinner, args: { size: 'md', color: 'primary', label: 'Loading' },
  argTypes: { size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] }, color: { control: 'select', options: COLORS }, label: { control: 'text' } },
});
export const Playground = playground({ source: '{}' });
export const Sizes = example({ name: 'Sizes', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, ['xsm', 'sm', 'md', 'lg'].map((z) => h(Spinner, { key: z, size: z })), h(Spinner, { size: 72 })), source: `<Spinner size="xsm" /> <Spinner size={72} />` });
export const Colors = example({
  name: 'Colors', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, COLORS.filter((c) => c !== 'on-color').map((c) => h(Spinner, { key: c, color: c })), h('span', { style: { display: 'inline-flex', padding: 12, borderRadius: 'var(--baseui-radius-12)', background: 'var(--baseui-Background-Accent)' } }, h(Spinner, { color: 'on-color' }))),
  source: `<Spinner color="accent" />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Colors'];
