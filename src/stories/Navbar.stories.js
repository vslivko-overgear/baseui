import { h } from '../react.js';
import { Navbar } from '../components/MobileNavigation.js';
import { Share01, DotsHorizontal, SearchLg } from './_ui.js';
import { meta, playground, example, Phone } from './_helpers.js';

const actions = { none: [], one: [{ icon: h(Share01, { size: 24 }), label: 'Share' }], two: [{ icon: h(SearchLg, { size: 24 }), label: 'Search' }, { icon: h(DotsHorizontal, { size: 24 }), label: 'More' }] };
export default meta({
  title: 'Components/Navbar', component: Navbar,
  args: { glass: 'theme', title: 'Project Atlas', subtitle: 'Updated today', showBack: true, floating: false, actions: 'two' },
  argTypes: { glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    title: { control: 'text' }, subtitle: { control: 'text' }, showBack: { control: 'boolean' }, floating: { control: 'boolean' },
    actions: { control: 'inline-radio', options: ['none', 'one', 'two'], mapping: actions, description: 'How many icon buttons on the right' },
  },
});
export const Playground = {
  ...playground({ source: `<Navbar
  title="Project Atlas"
  subtitle="Updated today"
  onBack={goBack}
  actions={[{ icon: <SearchLgIcon />, label: 'Search' }, { icon: <DotsHorizontalIcon />, label: 'More' }]}
/>` }),
  render: (args) => h(Phone, { overlay: true, top: h(Navbar, args), height: 240 }, 'Screen content'),
};
export const Variants = example({
  name: 'Variants', render: () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    h(Phone, { height: 90, top: h(Navbar, { title: 'Settings' }) }),
    h(Phone, { height: 90, top: h(Navbar, { title: 'Project Atlas', subtitle: 'Updated today', actions: actions.one }) }),
    h(Phone, { height: 90, top: h(Navbar, { title: 'A very long title that does not fit on one line', showBack: false, actions: actions.two }) })),
  source: `<Navbar title="Settings" />
<Navbar title="Project Atlas" subtitle="Updated today" actions={[share]} />
<Navbar title="Inbox" showBack={false} actions={[search, more]} />`,
});
export const __namedExportsOrder = ['Playground', 'Variants'];
