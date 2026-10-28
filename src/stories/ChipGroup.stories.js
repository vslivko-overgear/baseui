import { h } from '../react.js';
import { ChipGroup } from '../components/ChipGroup.js';
import { Chip } from '../components/Chip.js';
import { Avatar } from '../components/Avatar.js';
import { Heart } from './_ui.js';
import { meta, playground, example } from './_helpers.js';

const options = [{ value: 'design', label: 'Design' }, { value: 'code', label: 'Code' }, { value: 'research', label: 'Research' }, { value: 'ops', label: 'Operations', disabled: true }];
export default meta({
  title: 'Components/TokenGroup', component: ChipGroup, args: { title: 'Topics', options, multiple: true, defaultValue: ['design'], size: 'md', caption: '', error: '' },
  argTypes: { title: { control: 'text' }, multiple: { control: 'boolean' }, size: { control: 'inline-radio', options: ['md', 'sm'] }, caption: { control: 'text' }, error: { control: 'text' } },
});
const story = (name, text, args, source) => ({ name, args, parameters: { docs: { description: { story: text }, source: { originalSource: source } } } });
export const Playground = playground({ source: '{}' });
export const Single = story('Single', 'Single selection: `multiple` is off.', { multiple: false, defaultValue: ['design'] }, `<ChipGroup options={options} defaultValue={['design']} />`);
export const CaptionAndError = story('Caption and Error', 'A caption, or an error that replaces it.', { caption: 'Pick the topics you follow', error: '' }, `<ChipGroup options={options} error="Pick at least one topic" />`);
export const Small = story('Small', 'Size `sm`.', { size: 'sm' }, `<ChipGroup size="sm" options={options} />`);
export const WithIcons = story('With Icons', 'Options with icons.', { options: options.map((o) => ({ ...o, icon: h(Heart) })) }, `<ChipGroup options={[{ value: 'a', label: 'A', icon: <Heart /> }]} />`);
export const WithAvatars = story('With Avatars', 'Options with avatars, for example a filter by people.', { options: ['Maya Chen', 'Leo Fischer', 'Nora Haddad'].map((n) => ({ value: n, label: n, avatar: h(Avatar, { name: n, size: 'sm', tooltip: false }) })) }, `<ChipGroup options={people} />`);
export const FreeLayout = example({ name: 'Free Layout', description: 'A free layout through `children`: you control the chips.',
  render: () => h(ChipGroup, { title: 'Tags' }, h(Chip, { action: true, actionLabel: 'Remove design', onAction: () => {} }, 'Design'), h(Chip, { action: true, actionLabel: 'Remove code', onAction: () => {} }, 'Code'), h(Chip, { action: 'press' }, 'Add')),
  source: `<ChipGroup title="Tags"><Chip action onAction={remove}>Design</Chip></ChipGroup>` });
export const __namedExportsOrder = ['Playground', 'Single', 'CaptionAndError', 'Small', 'WithIcons', 'WithAvatars', 'FreeLayout'];
