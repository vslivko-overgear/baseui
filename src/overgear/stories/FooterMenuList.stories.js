import { h } from '../../react.js';
import { FooterMenuList } from '../molecules/FooterMenuList.js';
import { meta, playground, example } from '../../stories/_helpers.js';

const Column = ({ title = 'Company', external = false, button = true }) => h(FooterMenuList.List, { title: h(FooterMenuList.Title, null, title) },
  h(FooterMenuList.Element, { link: '#about' }, 'About us'),
  h(FooterMenuList.Element, { link: '#blog' }, 'Blog'),
  h(FooterMenuList.Element, { link: 'https://example.com/partners', isExternal: external }, 'Partners'),
  button && h(FooterMenuList.Button, null, 'Cookie settings'));
const Frame = ({ children }) => h('div', { style: { padding: 'var(--baseui-spacing-24)', borderRadius: 'var(--baseui-radius-16)', background: 'var(--baseui-Background-Secondary)', boxSizing: 'border-box' } }, children);

export default meta({
  title: 'Overgear/Molecules/FooterMenuList', component: FooterMenuList.List,
  args: { title: 'Company', external: false, button: true },
  argTypes: { title: { control: 'text', docs: false }, external: { control: 'boolean', docs: false }, button: { control: 'boolean', docs: false } },
});
export const Playground = {
  ...playground({ source: `<FooterMenuList.List title={<FooterMenuList.Title>Company</FooterMenuList.Title>}>
  <FooterMenuList.Element link="/about">About us</FooterMenuList.Element>
  <FooterMenuList.Button>Cookie settings</FooterMenuList.Button>
</FooterMenuList.List>` }),
  render: (args) => h(Frame, null, h(Column, args)),
};
export const Columns = example({
  name: 'Footer Columns', render: () => h(Frame, null, h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--baseui-spacing-32) var(--baseui-spacing-24)' } },
    h(Column, { title: 'Company' }), h(Column, { title: 'Support', button: false }), h(Column, { title: 'Legal', external: true, button: false }))),
  source: `<FooterMenuList.List title={<FooterMenuList.Title>Support</FooterMenuList.Title>}>
  <FooterMenuList.Element link="/help">Help center</FooterMenuList.Element>
</FooterMenuList.List>`,
});
export const ExternalLink = example({
  name: 'External Link', description: 'isExternal opens the link in a new tab.',
  render: () => h(Frame, null, h(Column, { title: 'Community', external: true, button: false })),
  source: `<FooterMenuList.Element link="https://example.com" isExternal>Partners</FooterMenuList.Element>`,
});
export const DialogButton = example({
  name: 'Dialog Button', description: 'FooterMenuList.Button looks like a link but is a button that opens a dialog.',
  render: () => h(Frame, null, h(FooterMenuList.List, { title: h(FooterMenuList.Title, null, 'Privacy') }, h(FooterMenuList.Button, { onClick: () => {} }, 'Cookie settings'), h(FooterMenuList.Button, { onClick: () => {} }, 'Do not sell my data'))),
  source: `<FooterMenuList.Button onClick={openCookieDialog}>Cookie settings</FooterMenuList.Button>`,
});
export const __namedExportsOrder = ['Playground', 'Columns', 'ExternalLink', 'DialogButton'];
