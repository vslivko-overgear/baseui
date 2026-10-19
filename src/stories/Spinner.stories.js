import { h } from '../react.js';
import { Spinner } from '../components/Spinner.js';
import { meta, playground, example, Row } from './_helpers.js';

export default meta({
  title: 'Components/Spinner', component: Spinner, args: { size: 'md', color: undefined, label: 'Loading' },
  argTypes: { size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] }, color: { control: 'token', description: 'A color token name, or any CSS color' }, label: { control: 'text' } },
});
export const Playground = playground({ source: '{}' });
export const Sizes = example({ name: 'Sizes', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, ['xsm', 'sm', 'md', 'lg'].map((z) => h(Spinner, { key: z, size: z })), h(Spinner, { size: 72 })), source: `<Spinner size="xsm" /> <Spinner size={72} />` });
export const Colors = example({
  name: 'Colors', render: () => h(Row, { gap: 'var(--baseui-spacing-24)' }, h(Spinner, { color: 'Text-and-Icon-Accent' }), h(Spinner, { color: 'Extensions-Text-and-Icon-Error' }), h(Spinner, { color: 'Text-and-Icon-Secondary' })),
  source: `<Spinner color="Text-and-Icon-Accent" />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Colors'];
