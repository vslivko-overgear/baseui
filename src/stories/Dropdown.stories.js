import { h } from '../react.js';
import { Dropdown } from '../components/Dropdown.js';
import { Heart, Star01, Bell01 } from './_ui.js';
import { demoImage } from './_helpers.js';
import { meta, playground, example } from './_helpers.js';

const OPTIONS = [
  { value: 'steam', label: 'Steam', details: 'PC' },
  { value: 'xbox', label: 'Xbox', details: 'Console' },
  { value: 'playstation', label: 'PlayStation', details: 'Console' },
  { value: 'gog', label: 'GOG', details: 'PC', disabled: true },
];
const WITH_ICONS = [
  { value: 'fav', label: 'Favorites', icon: h(Heart) },
  { value: 'star', label: 'Starred', icon: h(Star01) },
  { value: 'bell', label: 'Notifications', icon: h(Bell01), disabled: true },
];
const WITH_AVATARS = [
  { value: 'ana', label: 'Ana', avatar: demoImage('A', 280), details: 'Design' },
  { value: 'ivan', label: 'Ivan', avatar: demoImage('I', 150) },
  { value: 'lee', label: 'Lee', avatar: demoImage('L', 20), disabled: true },
];
const GROUPED = [
  { type: 'group', label: 'Consoles' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'playstation', label: 'PlayStation' },
  { type: 'divider' },
  { type: 'group', label: 'Computers' },
  { value: 'steam', label: 'Steam' },
  { value: 'sub', label: 'Steam Deck', subitem: true },
];
const box = (n, ...c) => h('div', { style: { minHeight: n } }, ...c);

export default meta({
  title: 'Components/Dropdown', component: Dropdown,
  args: { multiple: false, selectAll: false, placement: 'bottom-start' },
  argTypes: {
    multiple: { control: 'boolean' }, selectAll: { control: 'boolean', if: { arg: 'multiple', eq: true } },
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
});
export const Playground = {
  ...playground({ source: `<Dropdown options={options} defaultValue="steam" onValueChange={setPlatform} />` }),
  render: (args) => box(360, h(Dropdown, { key: String(args.multiple), ...args, options: OPTIONS, defaultValue: args.multiple ? ['steam'] : 'steam' })),
};
export const Icons = example({
  name: 'Icons and Avatars', render: () => box(260, h('div', { style: { display: 'flex', gap: 16 } }, h(Dropdown, { options: WITH_ICONS, defaultValue: 'fav' }), h(Dropdown, { options: WITH_AVATARS, defaultValue: 'ana' }))),
  source: `<Dropdown options={[{ value: 'fav', label: 'Favorites', icon: <Heart /> }, { value: 'ana', label: 'Ana', avatar: '/ana.png' }]} />`,
});
export const Groups = example({
  name: 'Groups and Dividers', render: () => box(400, h(Dropdown, { options: GROUPED, defaultValue: 'xbox' })),
  source: `<Dropdown options={[{ type: 'group', label: 'Consoles' }, { value: 'xbox', label: 'Xbox' }, { type: 'divider' }, { value: 'sub', label: 'Steam Deck', subitem: true }]} />`,
});
export const Multiple = example({
  name: 'Select All', render: () => box(400, h(Dropdown, { multiple: true, selectAll: true, options: OPTIONS, defaultValue: ['steam'] })),
  source: `<Dropdown multiple selectAll options={options} />`,
});
export const __namedExportsOrder = ['Playground', 'Icons', 'Groups', 'Multiple'];
