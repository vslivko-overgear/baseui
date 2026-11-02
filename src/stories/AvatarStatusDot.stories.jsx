import { Avatar, AvatarStatusDot } from '../components/Avatar.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

export default meta({
  title: 'Components/Avatar Status Dot',
  component: AvatarStatusDot,
  args: { variant: 'success', label: 'Online' },
  argTypes: { variant: { control: 'inline-radio', options: ['success', 'neutral', 'error'] }, label: { control: 'text' } },
});
export const Playground = {
  ...playground({ source: `<Avatar name="Anna Petrova" size="lg" status={<AvatarStatusDot variant="success" label="Online" />} />` }),
  render: (args) => <Avatar name="Anna Petrova" size="lg" status={<AvatarStatusDot {...args} />} />,
};
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row gap={24}>
      {[24, 36, 48, 96].map((s) => (
        <Avatar key={s} name="Anna Petrova" size={s} status={<AvatarStatusDot variant="success" label="Online" />} />
      ))}
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" size={96} status={<AvatarStatusDot variant="success" label="Online" />} />`,
});
export const Variants = example({
  name: 'Variants',
  render: () => (
    <Row gap={24}>
      {[
        ['success', 'Online'],
        ['neutral', 'Away'],
        ['error', 'Busy'],
      ].map(([v, l]) => (
        <Avatar key={v} name="Anna Petrova" size="lg" status={<AvatarStatusDot variant={v} label={l} />} />
      ))}
    </Row>
  ),
  source: `<AvatarStatusDot variant="neutral" label="Away" />`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Variants'];
