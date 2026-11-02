import { Avatar, AvatarGroup, AvatarGroupOverflow } from '../components/Avatar.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Avatar Group Overflow',
  component: AvatarGroupOverflow,
  args: { count: 3 },
  argTypes: { count: { control: { type: 'range', min: 0, max: 120, step: 1 } } },
});
export const Playground = {
  ...playground({ source: `<AvatarGroup><Avatar name="Anna Petrova" /><AvatarGroupOverflow count={3} /></AvatarGroup>` }),
  render: (args) => (
    <AvatarGroup>
      <Avatar name="Anna Petrova" />
      <Avatar name="Mark Lee" />
      <AvatarGroupOverflow {...args} />
    </AvatarGroup>
  ),
};
export const Interactive = example({
  name: 'Interactive',
  render: () => (
    <AvatarGroup>
      <Avatar name="Anna Petrova" />
      <Avatar name="Mark Lee" />
      <AvatarGroupOverflow count={12} onClick={() => {}} />
    </AvatarGroup>
  ),
  source: `<AvatarGroupOverflow count={12} onClick={showAll} />`,
});
export const __namedExportsOrder = ['Playground', 'Interactive'];
