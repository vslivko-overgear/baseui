import { h } from '../react.js';
import { Dropdown } from '../components/Dropdown.js';
import { Heart, Star01, Bell01 } from './_ui.js';
import { demoImage } from './_helpers.js';
import { meta, playground, example } from './_helpers.js';

const OPTIONS = [
  { value: 'design', label: 'Design', details: 'Core' },
  { value: 'engineering', label: 'Engineering', details: 'Core' },
  { value: 'marketing', label: 'Marketing', details: 'Growth' },
  { value: 'sales', label: 'Sales', details: 'Growth', disabled: true },
];
const PLAIN = OPTIONS.map(({ details, ...o }) => o);
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
  { type: 'group', label: 'Core' },
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { type: 'divider' },
  { type: 'group', label: 'Growth' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'content', label: 'Content', subitem: true },
];
const box = (n, ...c) => h('div', { style: { minHeight: n } }, ...c);

export default meta({
  title: 'Components/Dropdown', component: Dropdown,
  args: { size: 'md', glass: 'theme', motion: 'theme', multiple: false, selectAll: false, icons: 'off', showDetails: false, placement: 'bottom-start' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'], description: 'Item size; match it to the field or button the menu opens from' }, motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } }, glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    icons: { control: 'inline-radio', options: ['off', 'icon', 'avatar'], description: 'A leading icon or avatar on every item' },
    showDetails: { control: 'boolean', description: 'Details on the right of every item' },
    multiple: { control: 'boolean' }, selectAll: { control: 'boolean', if: { arg: 'multiple', eq: true } },
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
});
const LEADING = { icon: [h(Heart), h(Star01), h(Bell01), h(Heart)], avatar: ['A', 'I', 'L', 'G'].map((l, i) => demoImage(l, 40 + i * 70)) };
const playgroundOptions = ({ icons, showDetails }) => OPTIONS.map((o, i) => ({
  ...o, ...(icons === 'icon' && { icon: LEADING.icon[i] }), ...(icons === 'avatar' && { avatar: LEADING.avatar[i] }), ...(!showDetails && { details: undefined }),
}));
export const Playground = {
  ...playground({ source: `<Dropdown options={options} defaultValue="design" onValueChange={setTeam} />` }),
  render: (args) => box(360, h(Dropdown, { key: String(args.multiple), ...args, options: playgroundOptions(args), defaultValue: args.multiple ? ['design'] : 'design' })),
};
export const Icons = example({
  name: 'Icons and Avatars', render: () => box(260, h('div', { style: { display: 'flex', gap: 16 } }, h(Dropdown, { options: WITH_ICONS, defaultValue: 'fav' }), h(Dropdown, { options: WITH_AVATARS, defaultValue: 'ana' }))),
  source: `<Dropdown options={[{ value: 'fav', label: 'Favorites', icon: <Heart /> }, { value: 'ana', label: 'Ana', avatar: '/ana.png' }]} />`,
});
export const Groups = example({
  name: 'Groups and Dividers', render: () => box(400, h(Dropdown, { options: GROUPED, defaultValue: 'design' })),
  source: `<Dropdown options={[{ type: 'group', label: 'Core' }, { value: 'design', label: 'Design' }, { type: 'divider' }, { value: 'content', label: 'Content', subitem: true }]} />`,
});
export const Multiple = example({
  name: 'Select All', render: () => box(400, h(Dropdown, { multiple: true, selectAll: true, options: PLAIN, defaultValue: ['design'] })),
  source: `<Dropdown multiple selectAll options={options} />`,
});
export const __namedExportsOrder = ['Playground', 'Icons', 'Groups', 'Multiple'];
