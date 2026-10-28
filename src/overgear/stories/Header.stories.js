import { h } from '../../react.js';
import { ResponsiveHeader, Header, HeaderMobile, HeaderLogo, HeaderIconButton, HEADER_ICONS } from '../organisms/Header.js';
import { meta, playground, example, Stack, W } from '../../stories/_helpers.js';

const user = { name: 'Alex Morgan' };
export default meta({
  title: 'Overgear/Organisms/Header', component: ResponsiveHeader,
  args: { signedIn: false, cartCount: 2, notificationCount: 5, language: 'EN / USD', searchPlaceholder: 'Search products' },
  argTypes: {
    signedIn: { control: 'boolean', docs: false },
    cartCount: { control: { type: 'number', min: 0, max: 120 } }, notificationCount: { control: { type: 'number', min: 0, max: 120 } },
    language: { control: 'text' }, searchPlaceholder: { control: 'text' },
  },
});
export const Playground = {
  ...playground({ source: `<ResponsiveHeader user={user} cartCount={2} notificationCount={5} />` }),
  render: ({ signedIn, ...args }) => h(ResponsiveHeader, { ...args, user: signedIn ? user : null }),
};
export const LoggedOut = example({
  name: 'Logged Out', render: () => h(ResponsiveHeader, { cartCount: 0 }),
  source: `<ResponsiveHeader />`,
});
export const LoggedIn = example({
  name: 'Logged In', render: () => h(ResponsiveHeader, { user, cartCount: 3, notificationCount: 120 }),
  source: `<ResponsiveHeader user={{ name: 'Alex Morgan' }} cartCount={3} notificationCount={120} />`,
});
export const Mobile = example({
  name: 'Mobile', description: 'The same component in a 375px container shows the mobile bar.',
  render: () => h(Stack, { width: 375 }, h(ResponsiveHeader, { cartCount: 2 }), h(ResponsiveHeader, { user, cartCount: 0 })),
  source: `<div style={{ width: 375 }}><ResponsiveHeader user={user} /></div>`,
});
export const Slots = example({
  name: 'Custom Slots', description: 'Header and HeaderMobile are layout shells: compose any content into their slots.',
  render: () => h(Stack, null,
    h(Header, { leftSlot: h(HeaderLogo, null), rightSlot: h(HeaderIconButton, { icon: HEADER_ICONS.bell(), label: 'Notifications', badge: 7 }) }),
    W(375, h(HeaderMobile, { leftSlot: h(HeaderLogo, { variant: 'icon' }), rightSlot: h(HeaderIconButton, { icon: HEADER_ICONS.cart(), label: 'Cart', badge: 1 }) }))),
  source: `<Header leftSlot={<HeaderLogo />} rightSlot={<HeaderIconButton icon={<BellIcon />} label="Notifications" badge={7} />} />
<HeaderMobile leftSlot={<HeaderLogo variant="icon" />} rightSlot={…} />`,
});
export const __namedExportsOrder = ['Playground', 'LoggedOut', 'LoggedIn', 'Mobile', 'Slots'];
