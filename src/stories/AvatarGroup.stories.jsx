import { Avatar, AvatarGroup } from '../components/Avatar.jsx';
import { meta, playground, example } from './_helpers.jsx';

const people = ['Anna Petrova', 'Mark Lee', 'Sofia Rossi', 'John Smith', 'Eva Novak', 'Li Wei'];
export default meta({
  title: 'Components/Avatar Group',
  component: AvatarGroup,
  args: { size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'rounded', 'square'] },
  },
});
export const Playground = {
  ...playground({
    source: `<AvatarGroup size="md">
  {people.slice(0, 4).map((name) => <Avatar key={name} name={name} />)}
  <AvatarGroupOverflow count={people.length - 4} />
</AvatarGroup>`,
  }),
  render: (args) => (
    <AvatarGroup key={args.size + args.shape} {...args}>
      {people.slice(0, 4).map((n) => (
        <Avatar key={n} name={n} />
      ))}
      <OverflowItem />
    </AvatarGroup>
  ),
};
import { AvatarGroupOverflow } from '../components/Avatar.jsx';
const OverflowItem = () => <AvatarGroupOverflow count={people.length - 4} />;
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {['sm', 'md', 'lg'].map((s) => (
        <AvatarGroup key={s} size={s}>
          {people.slice(0, 3).map((n) => (
            <Avatar key={n} name={n} />
          ))}
          <AvatarGroupOverflow count={3} />
        </AvatarGroup>
      ))}
    </div>
  ),
  source: `<AvatarGroup size="lg">…</AvatarGroup>`,
});
export const __namedExportsOrder = ['Playground', 'Sizes'];
