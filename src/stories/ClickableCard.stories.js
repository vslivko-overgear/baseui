import { h } from '../react.js';
import { ClickableCard } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { meta, playground, example } from './_helpers.js';

export default meta({ title: 'Components/Clickable Card', component: ClickableCard, args: { outline: 'theme', label: 'Open project', isDisabled: false, variant: 'default', padding: 16, elevation: 'none' }, argTypes: { outline: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } }, variant: { control: 'select', options: ['default', 'transparent', 'muted', 'blue', 'green', 'orange', 'pink', 'red'] }, padding: { control: 'inline-radio', options: [8, 12, 16, 24, 32] }, elevation: { control: 'inline-radio', options: ['none', 'low', 'med', 'high'] }, isDisabled: { control: 'boolean' } } });
export const Playground = { ...playground({ source: `<ClickableCard label="Open project" onClick={open}>Project Atlas</ClickableCard>` }), render: (args) => h('div', { style: { width: 320 } }, h(ClickableCard, { onClick: () => {}, ...args }, 'Project Atlas')) };
export const NestedAction = example({
  name: 'Nested Action', render: () => h('div', { style: { width: 320 } }, h(ClickableCard, { label: 'Open project', onClick: () => {} }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' } }, 'Project Atlas', h(Button, { label: 'Share', size: 'sm', onClick: () => {} })))),
  source: `<ClickableCard label="Open project" onClick={open}>\n  Project Atlas\n  <Button label="Share" />\n</ClickableCard>`,
});
export const __namedExportsOrder = ['Playground', 'NestedAction'];
