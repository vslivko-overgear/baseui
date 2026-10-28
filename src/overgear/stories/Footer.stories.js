import { h } from '../../react.js';
import { Footer } from '../organisms/Footer.js';
import { meta, playground, example, Stack, W } from '../../stories/_helpers.js';

const columns = [
  { title: 'Company', items: [{ label: 'About us', href: '#about' }, { label: 'Careers', href: '#careers' }, { label: 'Blog', href: '#blog' }, { label: 'Press', href: '#press' }] },
  { title: 'Support', items: [{ label: 'Help center', href: '#help' }, { label: 'Contact us', href: '#contact' }, { label: 'Order status', href: '#orders' }] },
  { title: 'Legal', items: [{ label: 'Terms of service', href: '#terms' }, { label: 'Privacy policy', href: '#privacy' }, { label: 'Cookie settings', button: true }] },
  { title: 'Community', items: [{ label: 'Discord', href: 'https://example.com/discord', isExternal: true }, { label: 'Partners', href: '#partners' }] },
];
const socials = [{ platform: 'facebook', href: 'https://example.com/fb' }, { platform: 'instagram', href: 'https://example.com/ig' }, { platform: 'youtube', href: 'https://example.com/yt' }, { platform: 'x', href: 'https://example.com/x' }];
const games = ['Realm Quest', 'Star Arena', 'Dragon Forge', 'Pixel Racers', 'Skyline Tactics', 'Iron Legion', 'Moon Harvest', 'Shadow Keep'].map((label) => ({ label, href: '#' + label.toLowerCase().replace(/ /g, '-') }));
const base = {
  socials, menuColumns: columns,
  disclaimerText: 'All product names, logos and brands are property of their respective owners. This is sample text for a design system preview and does not describe a real service.',
  addressText: 'Example Company Ltd., 1 Sample Street, Sampletown, 00000.',
  securityBadges: [{ label: 'SSL secured' }, { label: 'PCI DSS' }],
};
export default meta({
  title: 'Overgear/Organisms/Footer', component: Footer,
  args: { ...base, otherGamesTitle: 'Other games', otherGames: games, showPaymentMethods: true },
  argTypes: { showPaymentMethods: { control: 'boolean' }, otherGamesTitle: { control: 'text' }, disclaimerText: { control: 'text' }, addressText: { control: 'text' }, socials: { control: false }, menuColumns: { control: false }, otherGames: { control: false }, securityBadges: { control: false } },
});
export const Playground = { ...playground({ source: `<Footer socials={socials} menuColumns={columns} disclaimerText="…" addressText="…" securityBadges={badges} />` }), render: (args) => h(Footer, args) };
export const Minimal = example({
  name: 'Without Payments And Games', render: () => h(Footer, { ...base, showPaymentMethods: false }),
  source: `<Footer {...props} showPaymentMethods={false} />`,
});
export const WithGames = example({
  name: 'With Other Games', render: () => h(Footer, { ...base, menuColumns: columns.slice(0, 3), otherGamesTitle: 'Other games', otherGames: games }),
  source: `<Footer {...props} otherGamesTitle="Other games" otherGames={games} />`,
});
export const Mobile = example({
  name: 'Mobile', description: 'The columns follow the width of the footer: a 360px container gets a single column.',
  render: () => W(360, h(Footer, { ...base, menuColumns: columns.slice(0, 3), otherGamesTitle: 'Other games', otherGames: games.slice(0, 4) })),
  source: `<div style={{ width: 360 }}><Footer {...props} /></div>`,
});
export const __namedExportsOrder = ['Playground', 'Minimal', 'WithGames', 'Mobile'];
