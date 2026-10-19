import { h } from '../react.js';
import { Popover } from '../components/Popover.js';
import { Button } from './_ui.js';
import { meta, playground } from './_helpers.js';

export default meta({
  title: 'Components/Popover', component: Popover, args: { glass: 'theme', placement: 'bottom-start', label: 'Share' },
  argTypes: { glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } }, placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] } },
});
export const Playground = {
  ...playground({ source: `<Popover trigger={(p) => <Button {...p}>Share</Button>}>…</Popover>` }),
  render: (args) => h('div', { style: { minHeight: 200 } }, h(Popover, { ...args, trigger: (p) => h(Button, { variant: 'secondary', ...p }, 'Share') },
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-8)' } }, h('strong', null, 'Share this page'), h('span', { style: { color: 'var(--baseui-Text-and-Icon-Secondary)' } }, 'Anyone with the link can view.')))),
};
export const __namedExportsOrder = ['Playground'];
