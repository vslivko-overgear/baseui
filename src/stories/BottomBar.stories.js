import { h } from '../react.js';
import { BottomBar } from '../components/MobileNavigation.js';
import { Home01, SearchLg, Heart, User01, Bell01, Settings02, Filled } from './_ui.js';
import { meta, playground, example, Phone } from './_helpers.js';

const items = (extra = {}) => [
  { value: 'home', label: 'Home', icon: h(Home01), activeIcon: h(Filled.Home01) },
  { value: 'search', label: 'Search', icon: h(SearchLg), activeIcon: h(Filled.Search) },
  { value: 'saved', label: 'Saved', icon: h(Heart), activeIcon: h(Filled.Heart), badge: extra.badge },
  { value: 'profile', label: 'Profile', icon: h(User01), activeIcon: h(Filled.User01) },
  { value: 'alerts', label: 'Alerts', icon: h(Bell01), activeIcon: h(Filled.Bell01) },
  { value: 'settings', label: 'Settings', icon: h(Settings02), activeIcon: h(Filled.Settings02) },
];
export default meta({
  title: 'Components/Bottom Bar', component: BottomBar,
  args: { tabs: 4, floating: false, showLabels: true, badge: 'none' },
  argTypes: {
    tabs: { control: { type: 'range', min: 2, max: 6, step: 1 }, description: 'How many items the bar has (a story setting)' },
    floating: { control: 'boolean' }, showLabels: { control: 'boolean' },
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
  render: ({ badge, tabs, ...args }) => h(Phone, { height: 220, bottom: h(BottomBar, { key: tabs, items: items({ badge: badgeOf(badge) }).slice(0, tabs), ...args }) }, 'Screen content'),
};
export const Floating = example({
  name: 'Floating', render: () => h(Phone, { height: 220, bottom: h(BottomBar, { items: items({ badge: 3 }).slice(0, 4), floating: true }) }, 'Screen content'),
  source: `<BottomBar items={items} floating />`,
});
export const WithoutLabels = example({
  name: 'Without Labels', render: () => h(Phone, { height: 160, bottom: h(BottomBar, { items: items({ badge: true }), showLabels: false }) }, 'Screen content'),
  source: `<BottomBar items={items} showLabels={false} />`,
});
export const __namedExportsOrder = ['Playground', 'Floating', 'WithoutLabels'];
