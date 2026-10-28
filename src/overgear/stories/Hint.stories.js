import { h, Fragment } from '../../react.js';
import { Hint, HintWithDrawer } from '../molecules/Hint.js';
import { Button } from '../../components/Button.js';
import { meta, playground, example } from '../../stories/_helpers.js';

const TEXT = 'Funds are held until the buyer confirms delivery, usually within 24 hours.';
const pad = (node, top = 96) => h('div', { style: { padding: `${top}px var(--baseui-spacing-24) var(--baseui-spacing-24)`, display: 'flex', justifyContent: 'center' } }, node);
const grid = (cells) => h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '96px var(--baseui-spacing-16)', padding: '96px var(--baseui-spacing-16) 24px' } }, cells);
const cell = (name, node) => h('div', { key: name, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--baseui-spacing-8)', font: 'var(--baseui-Typography-Text-12-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, node, name);
const VARIANTS = ['default', 'primary', 'gradient', 'blue', 'surface'];

export default meta({
  title: 'Overgear/Molecules/Hint', component: Hint,
  args: { text: TEXT, placement: 'top-center', variant: 'default', maxWidth: 280, withCross: false, isChildrenWithDefaultIcon: false },
  argTypes: {
    text: { control: 'text' }, placement: { control: 'select', options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'left', 'right'] },
    variant: { control: 'inline-radio', options: VARIANTS }, maxWidth: { control: 'number' }, withCross: { control: 'boolean' }, isChildrenWithDefaultIcon: { control: 'boolean' }, content: { control: false }, children: { control: false }, onClose: { control: false },
  },
});
export const Playground = { ...playground({ source: `<Hint text="Funds are held until the buyer confirms delivery." placement="top-center" />` }), render: (args) => pad(h(Hint, args)) };
export const Closed = example({ name: 'Closed and Open Icon', description: 'The trigger icon fills while the hint is open.', render: () => h('div', { style: { display: 'flex', gap: 'var(--baseui-spacing-24)', padding: '96px 24px 24px' } }, h(Hint, { text: TEXT }), h(Hint, { text: TEXT, defaultOpen: true, maxWidth: 240 })), source: `<Hint text="…" defaultOpen />` });
export const Variants = example({ name: 'Variants', description: 'default, primary, gradient, blue and surface, open for comparison.', render: () => grid(VARIANTS.map((v) => cell(v, h(Hint, { variant: v, text: 'Winners are announced on Friday.', defaultOpen: true, maxWidth: 160, placement: 'top-center' })))), source: `<Hint variant="gradient" text="…" />` });
export const Placements = example({ name: 'Placements', description: 'Side and alignment: top, bottom, left and right.', render: () => h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '110px 16px', padding: '110px 16px 110px' } },
  ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right'].map((p) => cell(p, h(Hint, { placement: p, text: 'Placed ' + p, defaultOpen: true, maxWidth: 140 })))), source: `<Hint placement="bottom-right" … />` });
export const WithChildren = example({ name: 'Custom Trigger', description: 'Your own trigger, optionally with the default icon next to it.', render: () => pad(h('div', { style: { display: 'flex', gap: 'var(--baseui-spacing-24)', alignItems: 'center' } },
  h(Hint, { text: 'Opens on hover or focus.', placement: 'top-center' }, h(Button, { variant: 'secondary', size: 'sm' }, 'Withdraw')),
  h(Hint, { text: 'Commission is 3% of the deal.', isChildrenWithDefaultIcon: true, placement: 'top-center' }, h('span', { style: { font: 'var(--baseui-Typography-Text-14-Semi-Bold)' } }, 'Service fee')))), source: `<Hint isChildrenWithDefaultIcon text="…">Service fee</Hint>` });
export const CustomContent = example({ name: 'Custom Content and Cross', description: 'Rich content and a cross; controlled by `open` and `onClose`.', render: () => pad(h(Hint, { variant: 'surface', withCross: true, defaultOpen: true, maxWidth: 260, placement: 'top-center', content: h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-4)' } }, h('strong', null, 'Delivery guarantee'), h('span', { style: { color: 'var(--baseui-Text-and-Icon-Secondary)' } }, 'If the seller does not deliver Elden Ring Runes in 30 minutes, the order is refunded automatically.')) }), 130), source: `<Hint withCross content={…} />` });
export const LongText = example({ name: 'Long Text', description: 'The card wraps at `maxWidth` and never exceeds the viewport.', render: () => pad(h(Hint, { defaultOpen: true, maxWidth: 400, placement: 'top-center', text: 'Prices on this page are shown for the selected server and update every few minutes. Rare items such as Mythic Dragon Mounts can differ from the average by a large margin, so always compare several offers before you pay.' }), 140), source: `<Hint maxWidth={400} text="…" />` });
export const Drawer = example({ name: 'Hint With Drawer', description: 'On a wide screen the gradient card; up to 1200px a tap opens a bottom sheet with a title and a confirm button. Resize the window to see both.', render: () => pad(h('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--baseui-spacing-8)' } }, h('span', null, 'Buyer protection'), h(HintWithDrawer, { title: 'Buyer protection', content: 'Your payment is held by Overgear until you confirm that the order was delivered.', confirmLabel: 'Got it' })), 80), source: `<HintWithDrawer title="Buyer protection" content="…" confirmLabel="Got it" />` });
export const __namedExportsOrder = ['Playground', 'Closed', 'Variants', 'Placements', 'WithChildren', 'CustomContent', 'LongText', 'Drawer'];
