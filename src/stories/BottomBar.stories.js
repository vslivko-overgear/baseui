import { h } from '../react.js';
import { BottomBar } from '../components/MobileNavigation.js';
import { Home01, SearchLg, Heart, User01, Filled } from './_ui.js';
import { meta, playground, example, Phone } from './_helpers.js';

const items = (extra = {}) => [
  { value: 'home', label: 'Home', icon: h(Home01), activeIcon: h(Filled.Home01) },
  { value: 'search', label: 'Search', icon: h(SearchLg), activeIcon: h(Filled.Search) },
  { value: 'saved', label: 'Saved', icon: h(Heart), activeIcon: h(Filled.Heart), badge: extra.badge },
  { value: 'profile', label: 'Profile', icon: h(User01), activeIcon: h(Filled.User01) },
];
export default meta({
  title: 'Components/Bottom Bar', component: BottomBar,
  args: { showLabels: true, badge: 'none' },
  argTypes: {
    showLabels: { control: 'boolean' },
    badge: { control: 'inline-radio', options: ['none', 'dot', 'count'], description: 'A badge on the Saved item (a story setting)' },
  },
});
const badgeOf = (b) => (b === 'dot' ? true : b === 'count' ? 3 : undefined);
export const Playground = {
  ...playground({ source: `<BottomBar
  value={tab}
  onValueChange={setTab}
  items={[
    { value: 'home', label: 'Home', icon: <HomeIcon />, activeIcon: <HomeFilledIcon /> },
    { value: 'saved', label: 'Saved', icon: <HeartIcon />, badge: 3 },
    …
  ]}
/>` }),
  render: ({ badge, ...args }) => h(Phone, { height: 200, bottom: h(BottomBar, { items: items({ badge: badgeOf(badge) }), ...args }) }, 'Screen content'),
};
export const WithoutLabels = example({
  name: 'Without Labels', render: () => h(Phone, { height: 160, bottom: h(BottomBar, { items: items({ badge: true }), showLabels: false }) }, 'Screen content'),
  source: `<BottomBar items={items} showLabels={false} />`,
});
export const __namedExportsOrder = ['Playground', 'WithoutLabels'];
