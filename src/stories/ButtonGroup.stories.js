import { h } from '../react.js';
import { Button, ButtonGroup } from '../components/Button.js';
import { meta, playground, example } from './_helpers.js';

export default meta({
  title: 'Components/Button Group', component: ButtonGroup, args: { label: 'Alignment', orientation: 'horizontal', size: 'md', isDisabled: false },
  argTypes: { isDisabled: { control: 'boolean' }, orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] }, size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] } },
});
const items = ['Left', 'Center', 'Right'].map((l) => h(Button, { key: l, label: l }));
export const Playground = { ...playground({ source: `<ButtonGroup label="Alignment">\n  <Button label="Left" />\n  <Button label="Center" />\n  <Button label="Right" />\n</ButtonGroup>` }), render: (args) => h(ButtonGroup, args, items) };
export const Disabled = example({ name: 'Disabled', render: () => h(ButtonGroup, { label: 'Alignment', isDisabled: true }, items), source: `<ButtonGroup label="Alignment" isDisabled>…</ButtonGroup>` });
export const __namedExportsOrder = ['Playground', 'Disabled'];
