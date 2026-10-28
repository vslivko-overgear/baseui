import { h } from '../../react.js';
import { ProductCard, ProductCardPrice, SaveBadge } from '../organisms/ProductCard.js';
import { IconButton } from '../../components/Button.js';
import { Heart } from '../../stories/_ui.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';
import { keyArt } from './_art.js';

const DAY = 86400000;
const wish = h(IconButton, { icon: h(Heart, { size: 20 }), label: 'Add to favorites', variant: 'ghost', size: 'sm' });
const DESC = '<ul><li>Pro players, any rank</li><li>Start in 15 minutes</li><li>Full money-back guarantee</li></ul>';
const base = {
  url: '#', titleHtml: 'Mythic Raid Boosting', titleText: 'Mythic Raid Boosting', descriptionHtml: DESC, imageSrc: keyArt(250), wishlistSlot: wish,
  priceProps: { priceText: 'From', price: '$49.90' }, onClick: (e) => e.preventDefault(),
};
const box = (w, c) => h('div', { style: { width: w, maxWidth: '100%' } }, c);

export default meta({
  title: 'Overgear/Organisms/ProductCard', component: ProductCard,
  args: { titleHtml: 'Mythic Raid Boosting', descriptionHtml: DESC, compact: false, badgeType: '', timerOn: false, price: '$49.90', discountedPrice: '', saleBadge: '' },
  argTypes: {
    titleHtml: { control: 'text' }, descriptionHtml: { control: 'text' }, compact: { control: 'boolean' },
    badgeType: { control: 'inline-radio', options: ['', 'OutOfStock', 'TimerOffer'] },
    // Story settings for `priceProps` and the timer.
    timerOn: { control: 'boolean', docs: false }, price: { control: 'text', docs: false }, discountedPrice: { control: 'text', docs: false }, saleBadge: { control: 'text', docs: false },
    url: { control: false }, imageSrc: { control: false }, wishlistSlot: { control: false }, priceProps: { control: false }, calendarSlotsProps: { control: false }, badgeObject: { control: false }, priceFooterSlot: { control: false },
  },
});
export const Playground = {
  ...playground({ source: `<ProductCard url="/boost" titleHtml="Mythic Raid Boosting" titleText="Mythic Raid Boosting" imageSrc={art} priceProps={{ priceText: 'From', price: '$49.90' }} onClick={go} />` }),
  render: ({ timerOn, price, discountedPrice, saleBadge, ...args }) => box(320, h(ProductCard, {
    ...base, ...args, titleText: args.titleHtml, badgeType: args.badgeType || undefined, remainingMs: timerOn ? 2 * DAY + 3 * 3600000 : undefined,
    badgeObject: undefined, presetBadgeText: args.badgeType === 'TimerOffer' ? 'Limited offer' : undefined,
    priceProps: { priceText: 'From', price, discountedPrice: discountedPrice || undefined, badgeText: saleBadge || null },
  })),
};
export const Default = example({
  name: 'Default', render: () => box(340, h(ProductCard, base)),
  source: `<ProductCard url="/boost" titleHtml="Mythic Raid Boosting" titleText="Mythic Raid Boosting" descriptionHtml={html} imageSrc={art} wishlistSlot={<Wishlist />} priceProps={{ priceText: 'From', price: '$49.90' }} onClick={go} />`,
});
export const Sale = example({
  name: 'Sale', description: 'With a discount the new price is green and the old one is struck through; the save badge sits above.',
  render: () => box(340, h(ProductCard, { ...base, titleHtml: 'Gold Farming Pack', titleText: 'Gold Farming Pack', imageSrc: keyArt(150), timerDate: undefined, remainingMs: 2 * DAY + 5 * 3600000, badgeType: 'TimerOffer', presetBadgeText: 'Limited offer', priceProps: { priceText: 'From', price: '$39.90', discountedPrice: '$29.90', badgeText: 'Save 25%' } })),
  source: `<ProductCard badgeType="TimerOffer" timerDate={endsAt} priceProps={{ priceText: 'From', price: '$39.90', discountedPrice: '$29.90', badgeText: 'Save 25%' }} ... />`,
});
export const SoldOut = example({
  name: 'Sold Out', description: 'The OutOfStock preset badge; pass presetBadgeText to translate it.',
  render: () => box(340, h(ProductCard, { ...base, titleHtml: 'Arena Rating Boost', titleText: 'Arena Rating Boost', imageSrc: keyArt(10), badgeType: 'OutOfStock', priceProps: { priceText: 'From', price: '$19.00' } })),
  source: `<ProductCard badgeType="OutOfStock" ... />`,
});
export const AdminBadge = example({
  name: 'Admin Badge', description: 'A badgeObject has its own colors and takes precedence over badgeType.',
  render: () => box(340, h(ProductCard, { ...base, imageSrc: keyArt(300), badgeObject: { text: 'Hot', bg: 'hsl(350 85% 55%)', accent: 'white' } })),
  source: `<ProductCard badgeObject={{ text: 'Hot', bg: '#e8334f', accent: '#fff' }} ... />`,
});
export const NextRaid = example({
  name: 'Next Raid', description: 'With calendarSlotsProps the raid badge sits between the title and the description and the timer badge is hidden.',
  render: () => box(340, h(ProductCard, { ...base, imageSrc: keyArt(200), titleHtml: 'Weekly Raid Group', titleText: 'Weekly Raid Group', timerDate: undefined, remainingMs: DAY, calendarSlotsProps: { isTimer: true, remainingMs: 5 * 3600000 + 12 * 60000, labelText: 'Next raid in:' }, priceProps: { priceText: 'From', price: '$9.90' } })),
  source: `<ProductCard calendarSlotsProps={{ isTimer: true, timerTargetDate: next, labelText: 'Next raid in:' }} ... />`,
});
export const Compact = example({
  name: 'Compact', description: 'Smaller fonts and no card background, as on the main page.',
  render: () => h(Row, { align: 'stretch', gap: 'var(--baseui-spacing-16)' }, [250, 120, 330].map((hue, i) => box(240, h(ProductCard, { key: hue, ...base, compact: true, imageSrc: keyArt(hue), titleHtml: ['Dungeon Carry', 'Currency Top-up', 'Coaching Hour'][i], titleText: 'Product', descriptionHtml: '<p>Fast and safe delivery by verified players.</p>', priceProps: { priceText: 'From', price: ['$12.00', '$5.00', '$20.00'][i] } })))),
  source: `<ProductCard compact ... />`,
});
export const Loading = example({
  name: 'Loading Price', description: 'While the currency is hydrating the price row is a skeleton.',
  render: () => box(340, h(ProductCard, { ...base, priceProps: { priceText: 'From', price: '', isLoading: true } })),
  source: `<ProductCard priceProps={{ priceText: 'From', price: '', isLoading: true }} ... />`,
});
export const Mobile = example({
  name: 'Mobile', description: 'At 320 px and narrower the price switches to the smaller sizes.',
  render: () => box(300, h(ProductCard, { ...base, priceProps: { priceText: 'From', price: '$39.90', discountedPrice: '$29.90', badgeText: 'Save 25%' } })),
  source: `<div style={{ width: 300 }}><ProductCard ... /></div>`,
});
export const PriceRow = example({
  name: 'Price Row', description: 'ProductCardPrice and SaveBadge on their own, on a dark tile.',
  render: () => h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--baseui-spacing-24)', padding: 'var(--baseui-spacing-16)', borderRadius: 'var(--baseui-radius-12)', background: 'var(--baseui-Extensions-Background-AlwaysDark)' } },
    h(ProductCardPrice, { priceText: 'From', price: '$49.90' }),
    h(ProductCardPrice, { priceText: 'From', price: '$49.90', discountedPrice: '$39.90', badgeText: 'Save 20%' }),
    h(ProductCardPrice, { priceText: 'From', price: '$49.90', compact: true }),
    h(ProductCardPrice, { isLoading: true }),
    h(SaveBadge, { text: 'Save 20%' }), h(SaveBadge, { text: 'Save 20%', size: 's' })),
  source: `<ProductCardPrice priceText="From" price="$49.90" discountedPrice="$39.90" badgeText="Save 20%" />`,
});
export const __namedExportsOrder = ['Playground', 'Default', 'Sale', 'SoldOut', 'AdminBadge', 'NextRaid', 'Compact', 'Loading', 'Mobile', 'PriceRow'];
