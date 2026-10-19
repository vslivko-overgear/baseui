import { h } from '../react.js';
import { Avatar, AvatarGroup } from '../components/Avatar.js';
import { meta, playground, example } from './_helpers.js';

const people = ['Anna Petrova', 'Mark Lee', 'Sofia Rossi', 'John Smith', 'Eva Novak', 'Li Wei'];
export default meta({
  title: 'Components/Avatar Group', component: AvatarGroup, args: { size: 'md', shape: 'circle' },
  argTypes: { size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xl'] }, shape: { control: 'inline-radio', options: ['circle', 'rounded', 'square'] } },
});
export const Playground = {
  ...playground({ source: `<AvatarGroup size="md">
  {people.slice(0, 4).map((name) => <Avatar key={name} name={name} />)}
  <AvatarGroupOverflow count={people.length - 4} />
</AvatarGroup>` }),
  render: (args) => h(AvatarGroup, { key: args.size + args.shape, ...args }, people.slice(0, 4).map((n) => h(Avatar, { key: n, name: n })), h(OverflowItem)),
};
import { AvatarGroupOverflow } from '../components/Avatar.js';
const OverflowItem = () => h(AvatarGroupOverflow, { count: people.length - 4 });
export const Sizes = example({
  name: 'Sizes', render: () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, ['sm', 'md', 'lg'].map((s) => h(AvatarGroup, { key: s, size: s }, people.slice(0, 3).map((n) => h(Avatar, { key: n, name: n })), h(AvatarGroupOverflow, { count: 3 })))),
  source: `<AvatarGroup size="lg">…</AvatarGroup>`,
});
export const __namedExportsOrder = ['Playground', 'Sizes'];
