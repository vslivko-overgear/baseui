import { Navbar } from '../components/MobileNavigation.jsx';
import { Share01, DotsHorizontal, SearchLg } from './_ui.jsx';
import { meta, playground, example, Phone } from './_helpers.jsx';

const actions = {
  none: [],
  one: [{ icon: <Share01 size={24} />, label: 'Share' }],
  two: [
    { icon: <SearchLg size={24} />, label: 'Search' },
    { icon: <DotsHorizontal size={24} />, label: 'More' },
  ],
};
export default meta({
  title: 'Components/Navbar',
  component: Navbar,
  args: { glass: 'theme', title: 'Project Atlas', subtitle: 'Updated today', showBack: true, floating: false, actions: 'two' },
  argTypes: {
    glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    showBack: { control: 'boolean' },
    floating: { control: 'boolean' },
    actions: { control: 'inline-radio', options: ['none', 'one', 'two'], mapping: actions, description: 'How many icon buttons on the right' },
  },
});
export const Playground = {
  ...playground({
    source: `<Navbar
  title="Project Atlas"
  subtitle="Updated today"
  onBack={goBack}
  actions={[{ icon: <SearchLgIcon />, label: 'Search' }, { icon: <DotsHorizontalIcon />, label: 'More' }]}
/>`,
  }),
  render: (args) => (
    <Phone overlay top={<Navbar {...args} />} height={240}>
      Screen content
    </Phone>
  ),
};
export const Variants = example({
  name: 'Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Phone height={90} top={<Navbar title="Settings" />} />
      <Phone height={90} top={<Navbar title="Project Atlas" subtitle="Updated today" actions={actions.one} />} />
      <Phone height={90} top={<Navbar title="A very long title that does not fit on one line" showBack={false} actions={actions.two} />} />
    </div>
  ),
  source: `<Navbar title="Settings" />
<Navbar title="Project Atlas" subtitle="Updated today" actions={[share]} />
<Navbar title="Inbox" showBack={false} actions={[search, more]} />`,
});
export const __namedExportsOrder = ['Playground', 'Variants'];
