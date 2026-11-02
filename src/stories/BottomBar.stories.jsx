import { BottomBar } from '../components/MobileNavigation.jsx';
import { Home01, SearchLg, Heart, User01, Bell01, Settings02, Filled } from './_ui.jsx';
import { meta, playground, example, Phone } from './_helpers.jsx';

const items = (extra = {}) => [
  { value: 'home', label: 'Home', icon: <Home01 />, activeIcon: <Filled.Home01 /> },
  { value: 'search', label: 'Search', icon: <SearchLg />, activeIcon: <Filled.Search /> },
  { value: 'saved', label: 'Saved', icon: <Heart />, activeIcon: <Filled.Heart />, badge: extra.badge },
  { value: 'profile', label: 'Profile', icon: <User01 />, activeIcon: <Filled.User01 /> },
  { value: 'alerts', label: 'Alerts', icon: <Bell01 />, activeIcon: <Filled.Bell01 /> },
  { value: 'settings', label: 'Settings', icon: <Settings02 />, activeIcon: <Filled.Settings02 /> },
];
export default meta({
  title: 'Components/Bottom Bar',
  component: BottomBar,
  args: { glass: 'theme', motion: 'theme', tabs: 4, floating: false, showLabels: true, badge: 'none' },
  argTypes: {
    glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    tabs: { control: { type: 'range', min: 2, max: 6, step: 1 }, description: 'How many items the bar has (a story setting)' },
    floating: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    badge: { control: 'inline-radio', options: ['none', 'dot', 'count'], description: 'A badge on the Saved item (a story setting)' },
  },
});
const badgeOf = (b) => (b === 'dot' ? true : b === 'count' ? 3 : undefined);
export const Playground = {
  ...playground({
    source: `<BottomBar
  value={tab}
  onValueChange={setTab}
  items={[
    { value: 'home', label: 'Home', icon: <HomeIcon />, activeIcon: <HomeFilledIcon /> },
    { value: 'saved', label: 'Saved', icon: <HeartIcon />, badge: 3 },
    …
  ]}
/>`,
  }),
  render: ({ badge, tabs, ...args }) => (
    <Phone overlay height={260} bottom={<BottomBar key={tabs} items={items({ badge: badgeOf(badge) }).slice(0, tabs)} {...args} />}>
      Screen content
    </Phone>
  ),
};
export const Floating = example({
  name: 'Floating',
  render: () => (
    <Phone height={220} bottom={<BottomBar items={items({ badge: 3 }).slice(0, 4)} floating />}>
      Screen content
    </Phone>
  ),
  source: `<BottomBar items={items} floating />`,
});
export const WithoutLabels = example({
  name: 'Without Labels',
  render: () => (
    <Phone height={160} bottom={<BottomBar items={items({ badge: true })} showLabels={false} />}>
      Screen content
    </Phone>
  ),
  source: `<BottomBar items={items} showLabels={false} />`,
});
export const __namedExportsOrder = ['Playground', 'Floating', 'WithoutLabels'];
