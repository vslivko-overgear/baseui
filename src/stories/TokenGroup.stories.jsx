import { TokenGroup } from '../components/TokenGroup.jsx';
import { Token } from '../components/Token.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Heart } from './_ui.jsx';
import { meta, playground, example } from './_helpers.jsx';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code' },
  { value: 'research', label: 'Research' },
  { value: 'ops', label: 'Operations', disabled: true },
];
export default meta({
  title: 'Components/TokenGroup',
  component: TokenGroup,
  args: { title: 'Topics', options, multiple: true, defaultValue: ['design'], size: 'md', caption: '', error: '' },
  argTypes: {
    title: { control: 'text' },
    multiple: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    caption: { control: 'text' },
    error: { control: 'text' },
  },
});
const story = (name, text, args, source) => ({ name, args, parameters: { docs: { description: { story: text }, source: { originalSource: source } } } });
export const Playground = playground({ source: '{}' });
export const Single = story(
  'Single',
  'Single selection: `multiple` is off',
  { multiple: false, defaultValue: ['design'] },
  `<TokenGroup options={options} defaultValue={['design']} />`,
);
export const CaptionAndError = story(
  'Caption and Error',
  'A caption, or an error that replaces it',
  { caption: 'Pick the topics you follow', error: '' },
  `<TokenGroup options={options} error="Pick at least one topic" />`,
);
export const Small = story('Small', 'Size `sm`', { size: 'sm' }, `<TokenGroup size="sm" options={options} />`);
export const WithIcons = story(
  'With Icons',
  'Options with icons',
  { options: options.map((o) => ({ ...o, icon: <Heart /> })) },
  `<TokenGroup options={[{ value: 'a', label: 'A', icon: <Heart /> }]} />`,
);
export const WithAvatars = story(
  'With Avatars',
  'Options with avatars, for example a filter by people',
  { options: ['Maya Chen', 'Leo Fischer', 'Nora Haddad'].map((n) => ({ value: n, label: n, avatar: <Avatar name={n} size="sm" tooltip={false} /> })) },
  `<TokenGroup options={people} />`,
);
export const FreeLayout = example({
  name: 'Free Layout',
  description: 'A free layout through `children`: you control the chips',
  render: () => (
    <TokenGroup title="Tags">
      <Token action actionLabel="Remove design" onAction={() => {}}>
        Design
      </Token>
      <Token action actionLabel="Remove code" onAction={() => {}}>
        Code
      </Token>
      <Token action="press">Add</Token>
    </TokenGroup>
  ),
  source: `<TokenGroup title="Tags"><Token action onAction={remove}>Design</Token></TokenGroup>`,
});
export const __namedExportsOrder = ['Playground', 'Single', 'CaptionAndError', 'Small', 'WithIcons', 'WithAvatars', 'FreeLayout'];
