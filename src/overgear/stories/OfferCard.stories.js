import { h } from '../../react.js';
import { OfferCard } from '../molecules/OfferCard.js';
import { Button, IconButton } from '../../components/Button.js';
import { Badge } from '../../components/Badge.js';
import { Heart, Star01, Settings02, User01 } from '../../stories/_ui.js';
import { demoImage, meta, playground, example, Stack } from '../../stories/_helpers.js';

const ICON = (C) => h(C, { size: 20 });
const ATTRS = [
  { title: 'EU West', description: 'Server', icon: ICON(Star01) },
  { title: 'Tank', description: 'Role', icon: ICON(User01) },
  { title: 'Gold', description: 'Rank', icon: ICON(Settings02), filled: true },
  { title: '2 days', description: 'Delivery', icon: ICON(Star01) },
];
const SELLER = { nick: 'DarkMoonBoost', isOnline: true, avatarUrl: demoImage('D', 260), rating: '4.9', reviewsCount: '1 245' };
const buy = h(Button, { variant: 'primary', label: 'Buy', size: 'md' });
const wish = h(IconButton, { icon: h(Heart, { size: 20 }), label: 'Add to favorites', variant: 'ghost', size: 'sm' });
const wide = (c) => h('div', { style: { width: '100%', maxWidth: 1040 } }, c);
const base = { price: '$24.90', amountPerPrice: '1 000 gold', attributes: ATTRS, user: SELLER, buyButtonSlot: buy, wishlistSlot: wish };

export default meta({
  title: 'Overgear/Molecules/OfferCard', component: OfferCard,
  args: { price: '$24.90', amountPerPrice: '1 000 gold', featured: false, hoverable: true, compact: false, reserveBonusSlot: false },
  argTypes: {
    price: { control: 'text' }, amountPerPrice: { control: 'text' }, featured: { control: 'boolean' }, hoverable: { control: 'boolean' }, compact: { control: 'boolean' }, reserveBonusSlot: { control: 'boolean' },
    attributes: { control: false }, user: { control: false }, wishlistSlot: { control: false }, buyButtonSlot: { control: false }, bonusSlot: { control: false },
  },
});
export const Playground = { ...playground({ source: `<OfferCard price="$24.90" amountPerPrice="1 000 gold" attributes={attributes} user={seller} buyButtonSlot={<Button label="Buy" />} />` }), render: (args) => wide(h(OfferCard, { ...base, ...args })) };
export const Default = example({
  name: 'Default', render: () => wide(h(OfferCard, { ...base })),
  source: `<OfferCard price="$24.90" amountPerPrice="1 000 gold" attributes={attributes} user={seller} buyButtonSlot={<Button variant="primary" label="Buy" />} />`,
});
export const Featured = example({
  name: 'Featured', render: () => wide(h(OfferCard, { ...base, featured: true, hoverable: true })),
  source: `<OfferCard featured hoverable ... />`,
});
export const WithBonus = example({
  name: 'With Bonus', description: 'reserveBonusSlot keeps the bonus column in cards that have no bonus, so the seller column lines up in a list.',
  render: () => wide(h(Stack, { gap: 'var(--baseui-spacing-8)' },
    h(OfferCard, { ...base, bonusSlot: h(Badge, { variant: 'green', label: '+10% bonus from 5 000 gold' }), reserveBonusSlot: true }),
    h(OfferCard, { ...base, price: '$119.00', amountPerPrice: '5 000 gold', reserveBonusSlot: true, user: { ...SELLER, nick: 'Nightwatch', isOnline: false, rating: '4.7', reviewsCount: '312', avatarUrl: undefined } }))),
  source: `<OfferCard bonusSlot={<Badge variant="green" label="+10% bonus" />} reserveBonusSlot ... />`,
});
export const Stacked = example({
  name: 'Stacked (Mobile)', description: 'In a narrow container, or with compact, the card is a stack with the wishlist toggle in the corner.',
  render: () => h('div', { style: { width: 340, maxWidth: '100%' } }, h(OfferCard, { ...base, attributes: ATTRS.slice(0, 3) })),
  source: `<OfferCard compact ... />`,
});
export const Admin = example({
  name: 'Special Sort', description: 'Admins see the special sort index in the corner.',
  render: () => wide(h(OfferCard, { ...base, specialSort: 7, wishlistSlot: undefined })),
  source: `<OfferCard specialSort={7} ... />`,
});
export const __namedExportsOrder = ['Playground', 'Default', 'Featured', 'WithBonus', 'Stacked', 'Admin'];
