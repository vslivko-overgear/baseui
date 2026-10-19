import { h, useState } from '../react.js';
import { ToggleButton, ToggleButtonGroup } from '../components/Button.js';
import { meta, playground } from './_helpers.js';

export default meta({
  title: 'Components/Toggle Button Group', component: ToggleButtonGroup, args: { label: 'Alignment', type: 'single', size: 'md', isDisabled: false },
  argTypes: { isDisabled: { control: 'boolean' }, type: { control: 'inline-radio', options: ['single', 'multiple'] }, size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] } },
});
function Demo({ type, ...rest }) {
  const [value, setValue] = useState(type === 'multiple' ? ['bold'] : 'left');
  const items = type === 'multiple' ? ['bold', 'italic', 'underline'] : ['left', 'center', 'right'];
  return h(ToggleButtonGroup, { key: type, type, value: type === 'multiple' && !Array.isArray(value) ? [] : value, onChange: setValue, ...rest }, items.map((v) => h(ToggleButton, { key: v, value: v, label: v[0].toUpperCase() + v.slice(1) })));
}
export const Playground = { ...playground({ source: `<ToggleButtonGroup label="Alignment" value={value} onChange={setValue}>\n  <ToggleButton value="left" label="Left" />\n  <ToggleButton value="center" label="Center" />\n</ToggleButtonGroup>` }), render: (args) => h(Demo, args) };
export const __namedExportsOrder = ['Playground'];
