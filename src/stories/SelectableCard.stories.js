import { h, useState } from '../react.js';
import { SelectableCard } from '../components/Card.js';
import { meta, playground, example, Row } from './_helpers.js';

export default meta({ title: 'Components/Selectable Card', component: SelectableCard, args: { outline: 'theme', label: 'Pro plan', isDisabled: false, variant: 'default', padding: 16, elevation: 'none' }, argTypes: { outline: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } }, variant: { control: 'select', options: ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'] }, padding: { control: 'inline-radio', options: [8, 12, 16, 24, 32] }, elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] }, isDisabled: { control: 'boolean' } } });
function Demo(args) { const [on, setOn] = useState(false); return h('div', { style: { width: 280 } }, h(SelectableCard, { ...args, isSelected: on, onChange: setOn }, 'Pro plan · $12 / month')); }
export const Playground = { ...playground({ source: `<SelectableCard label="Pro plan" isSelected={on} onChange={setOn}>Pro plan</SelectableCard>` }), render: (args) => h(Demo, args) };
function Plans() { const [v, setV] = useState('pro'); return h(Row, { align: 'stretch' }, ['free', 'pro', 'team'].map((p) => h('div', { key: p, style: { width: 140 } }, h(SelectableCard, { label: p, isSelected: v === p, onChange: () => setV(p) }, p)))); }
export const Group = example({ name: 'Group', render: () => h(Plans), source: `<SelectableCard label="Pro" isSelected={plan === 'pro'} onChange={() => setPlan('pro')}>Pro</SelectableCard>` });
export const __namedExportsOrder = ['Playground', 'Group'];
