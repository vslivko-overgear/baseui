import { h } from '../react.js';
import { Chip } from '../components/Chip.js';
import { Avatar } from '../components/Avatar.js';
import { Heart } from './_ui.js';
import { meta, playground, example, Row, Stack } from './_helpers.js';

export default meta({
  title: 'Components/Token', component: Chip, args: { children: 'Label', size: 'md', status: 'none', action: false, disabled: false },
  argTypes: { children: { control: 'text' }, size: { control: 'inline-radio', options: ['md', 'sm'] }, status: { control: 'inline-radio', options: ['none', 'error', 'success'], mapping: { none: undefined } }, action: { control: 'inline-radio', options: [false, true, 'press'] }, disabled: { control: 'boolean' } },
});
export const Playground = playground({ source: '{}' });
export const States = example({ name: 'States', description: 'Enabled, selected, disabled, disabled and selected.',
  render: () => h(Row, null, h(Chip, null, 'Enabled'), h(Chip, { defaultPressed: true }, 'Selected'), h(Chip, { disabled: true }, 'Disabled'), h(Chip, { disabled: true, defaultPressed: true }, 'Disabled selected')),
  source: `<Chip defaultPressed>Selected</Chip>` });
export const Status = example({ name: 'Status', description: 'Success and error colour the fill.',
  render: () => h(Row, null, h(Chip, { status: 'success' }, 'Success'), h(Chip, { status: 'error' }, 'Error')),
  source: `<Chip status="success">Success</Chip>` });
export const Slots = example({ name: 'Slots', description: 'An icon, an avatar, a counter, or no label (needs `aria-label`).',
  render: () => h(Stack, { gap: 'var(--baseui-spacing-12)' },
    h(Row, null, h(Chip, null, 'Label'), h(Chip, { icon: h(Heart) }, 'Label'), h(Chip, { avatar: h(Avatar, { name: 'Maya Chen', size: 'sm', tooltip: false }) }, 'Label'), h(Chip, { counter: 6 }, 'Label'), h(Chip, { icon: h(Heart), 'aria-label': 'Add to favorites' })),
    h(Row, null, h(Chip, { size: 'sm', icon: h(Heart) }, 'Label'), h(Chip, { size: 'sm', icon: h(Heart), defaultPressed: true }, 'Label'), h(Chip, { size: 'sm', avatar: h(Avatar, { name: 'Maya Chen', size: 'xsm', tooltip: false }) }, 'Label'))),
  source: `<Chip icon={<Heart />} counter={6}>Label</Chip>` });
export const Removable = example({ name: 'Removable', description: '`action`: a click anywhere on the chip removes it; the cross is decorative.',
  render: () => h(Row, null, h(Chip, { action: true, actionLabel: 'Remove design', onAction: () => {} }, 'Design'), h(Chip, { action: 'press', onClick: () => {} }, 'Press')),
  source: `<Chip action onAction={remove}>Design</Chip>` });
export const __namedExportsOrder = ['Playground', 'States', 'Status', 'Slots', 'Removable'];
