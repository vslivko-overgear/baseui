import { Avatar, AvatarStatusDot } from '../components/Avatar.jsx';
import { meta, playground, example, Row, demoImage } from './_helpers.jsx';

export default meta({
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Anna Petrova', size: 'md', shape: 'circle' },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'rounded', 'square'] },
  },
});
export const Playground = playground({ source: '{}' });
export const Image = example({
  name: 'Image',
  render: () => (
    <Row>
      <Avatar name="Anna Petrova" src={demoImage('A')} />
      <Avatar name="Mark Lee" src="broken.png" fallbackSrc={demoImage('M', 300)} />
      <Avatar name="Sofia Rossi" src="broken.png" />
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" src={url} />
<Avatar name="Mark Lee" src={url} fallbackSrc={backup} />`,
});
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row>
      {['xsm', 'sm', 'md', 'lg', 'xl'].map((s) => (
        <Avatar key={s} name="Anna Petrova" size={s} />
      ))}
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" size="lg" />`,
});
export const Shapes = example({
  name: 'Shapes',
  render: () => (
    <Row>
      {['circle', 'rounded', 'square'].map((s) => (
        <Avatar key={s} name="Anna Petrova" size="lg" shape={s} />
      ))}
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" shape="rounded" />`,
});
export const Status = example({
  name: 'Status',
  render: () => (
    <Row>
      <Avatar name="Anna Petrova" size="lg" status={<AvatarStatusDot variant="success" label="Online" />} />
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" status={<AvatarStatusDot variant="success" label="Online" />} />`,
});
export const Interactive = example({
  name: 'Interactive',
  render: () => (
    <Row>
      <Avatar name="Anna Petrova" href="#" tooltip="Open profile" />
      <Avatar name="Mark Lee" onClick={() => {}} />
    </Row>
  ),
  source: `<Avatar name="Anna Petrova" href="/profile" />
<Avatar name="Mark Lee" onClick={open} />`,
});
export const __namedExportsOrder = ['Playground', 'Image', 'Sizes', 'Shapes', 'Status', 'Interactive'];
