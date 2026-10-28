import { h, Fragment } from '../../react.js';
import { HoverCard } from '../molecules/HoverCard.js';
import { Avatar } from '../../components/Avatar.js';
import { Button } from '../../components/Button.js';
import { meta, playground, example } from '../../stories/_helpers.js';

const Profile = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-8)', width: 240 } },
  h('strong', { style: { font: 'var(--baseui-Typography-Text-16-Semi-Bold)' } }, 'NightFox'),
  h('span', { style: { color: 'var(--baseui-Text-and-Icon-Secondary)' } }, 'Top seller on Albion Online. 1,240 deals, 99% positive feedback.'),
  h('span', { style: { color: 'var(--baseui-Text-and-Icon-Secondary)' } }, 'Replies within 5 minutes'));
const link = (text) => h('a', { href: '#', onClick: (e) => e.preventDefault(), style: { color: 'var(--baseui-Text-and-Icon-Accent)', font: 'var(--baseui-Typography-Text-14-Semi-Bold)' } }, text);
const pad = (node, top = 160) => h('div', { style: { padding: `${top}px 0 ${top / 2}px`, display: 'flex', justifyContent: 'center' } }, node);

export default meta({
  title: 'Overgear/Molecules/HoverCard', component: HoverCard,
  args: { side: 'bottom', align: 'center', openDelay: 200, closeDelay: 200, arrow: false },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] }, align: { control: 'inline-radio', options: ['start', 'center', 'end'] }, openDelay: { control: 'number' }, closeDelay: { control: 'number' }, arrow: { control: 'boolean' }, trigger: { control: false }, children: { control: false } },
});
export const Playground = { ...playground({ source: `<HoverCard trigger={<a href="#">@NightFox</a>} side="bottom"><Profile /></HoverCard>` }), render: (args) => pad(h(HoverCard, { ...args, trigger: link('@NightFox') }, h(Profile))) };
export const Open = example({ name: 'Open', description: 'Forced open to show the surface.', render: () => pad(h(HoverCard, { defaultOpen: true, trigger: link('@NightFox') }, h(Profile))), source: `<HoverCard defaultOpen trigger={…}><Profile /></HoverCard>` });
export const WithArrow = example({ name: 'With Arrow', description: 'An arrow points at the trigger.', render: () => pad(h(HoverCard, { defaultOpen: true, arrow: true, side: 'top', trigger: link('@NightFox') }, h(Profile)), 200), source: `<HoverCard arrow side="top" …>` });
export const Sides = example({ name: 'Sides', description: 'Each side of the trigger, aligned to start.', render: () => h('div', { style: { display: 'flex', gap: 'var(--baseui-spacing-64)', flexWrap: 'wrap', padding: 'var(--baseui-spacing-24)' } },
  ['top', 'right', 'bottom', 'left'].map((side) => h(HoverCard, { key: side, side, align: 'start', openDelay: 100, trigger: h(Button, { variant: 'secondary', size: 'sm' }, side) }, h('span', null, `Opens on the ${side}`)))), source: `<HoverCard side="right" …>` });
export const RichTrigger = example({ name: 'Rich Trigger', description: 'An avatar as the trigger, hover or focus it.', render: () => pad(h(HoverCard, { openDelay: 100, triggerAs: 'button', triggerProps: { type: 'button', 'aria-label': 'NightFox profile', style: { all: 'unset', cursor: 'pointer', borderRadius: '50%' } }, trigger: h(Avatar, { name: 'Night Fox', size: 'md', tooltip: false }) }, h(Profile)), 120), source: `<HoverCard triggerAs="button" trigger={<Avatar />}>…</HoverCard>` });
export const __namedExportsOrder = ['Playground', 'Open', 'WithArrow', 'Sides', 'RichTrigger'];
