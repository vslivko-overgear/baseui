import { IconButton } from '../components/Button.jsx';
import { Heart, Settings02 } from './_ui.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

export default meta({
  title: 'Components/Icon Button',
  component: IconButton,
  args: { label: 'Like', variant: 'secondary', size: 'md' },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] },
  },
});
export const Playground = {
  ...playground({ source: `<IconButton icon={<HeartIcon />} label="Like" />` }),
  render: (args) => <IconButton {...args} icon={<Heart size={20} />} />,
};
export const Variants = example({
  name: 'Variants',
  render: () => (
    <Row>
      {['primary', 'secondary', 'ghost', 'destructive'].map((v) => (
        <IconButton key={v} variant={v} label={v} icon={<Settings02 size={20} />} />
      ))}
    </Row>
  ),
  source: `<IconButton variant="ghost" icon={<SettingsIcon />} label="Settings" />`,
});
export const __namedExportsOrder = ['Playground', 'Variants'];
