import { h } from '../../react.js';
import { ProductBadge, BadgeWithTimer, HourglassIcon } from '../molecules/ProductBadge.js';
import { Heart } from '../../stories/_ui.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';

const DAY = 86400000;
const HOUR = 3600000;
export default meta({
  title: 'Overgear/Molecules/ProductBadge', component: ProductBadge,
  args: { type: 'OutOfStock', text: '', isNewBadgeType: false, compact: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['OutOfStock', 'TimerOffer'] },
    // A story setting for `options.text`.
    text: { control: 'text', docs: false },
    isNewBadgeType: { control: 'boolean' }, compact: { control: 'boolean' },
    options: { control: false }, badgeObject: { control: false },
  },
});
export const Playground = {
  ...playground({ source: `<ProductBadge type="OutOfStock" />` }),
  render: ({ text, ...args }) => h(ProductBadge, { ...args, options: text || args.type === 'TimerOffer' ? { text: text || '2 days left' } : undefined }),
};
export const Presets = example({
  name: 'Presets', description: 'Frontend presets. The timer preset has no text of its own, so pass one.',
  render: () => h(Row, null, h(ProductBadge, { type: 'OutOfStock' }), h(ProductBadge, { type: 'TimerOffer', options: { text: 'Limited offer' } })),
  source: `<ProductBadge type="OutOfStock" />
<ProductBadge type="TimerOffer" options={{ text: 'Limited offer' }} />`,
});
export const NewLook = example({
  name: 'New Look', description: 'isNewBadgeType rounds the corners more; with compact it also drops the icon.',
  render: () => h(Row, null, h(ProductBadge, { type: 'OutOfStock', isNewBadgeType: true }), h(ProductBadge, { type: 'OutOfStock', isNewBadgeType: true, compact: true }), h(ProductBadge, { type: 'TimerOffer', isNewBadgeType: true, compact: true, options: { text: 'Hot' } })),
  source: `<ProductBadge type="OutOfStock" isNewBadgeType />
<ProductBadge type="OutOfStock" isNewBadgeType compact />`,
});
export const Overrides = example({
  name: 'Overrides', render: () => h(Row, null,
    h(ProductBadge, { type: 'OutOfStock', options: { text: 'Out of stock' } }),
    h(ProductBadge, { type: 'OutOfStock', options: { icon: null } }),
    h(ProductBadge, { type: 'OutOfStock', options: { icon: h(Heart, { size: 16 }), variant: 'pink', text: 'Favorite' } })),
  source: `<ProductBadge type="OutOfStock" options={{ icon: null }} />`,
});
export const AdminBadge = example({
  name: 'Admin Badge', description: 'An admin-managed badge brings its own colors (any CSS color) and an optional icon on a round backdrop.',
  render: () => h(Row, null,
    h(ProductBadge, { badgeObject: { text: 'Bestseller', bg: 'var(--baseui-Accent-Colors-Pink)', accent: 'var(--baseui-Extensions-Text-and-Icon-AlwaysLight)', roundIcon: false } }),
    h(ProductBadge, { badgeObject: { text: 'Top rated', bg: 'var(--baseui-Accent-Colors-Blue)', accent: 'var(--baseui-Extensions-Text-and-Icon-OnColor)', roundIcon: true, icon: h(Heart, { size: 14 }) } }),
    h(ProductBadge, { badgeObject: { text: 'New', bg: 'var(--baseui-Accent-Colors-Green-Light)', accent: 'var(--baseui-Extensions-Text-and-Icon-AlwaysDark)', roundIcon: false, icon: h(HourglassIcon) }, isNewBadgeType: true })),
  source: `<ProductBadge badgeObject={{ text: 'Bestseller', bg: '#...', accent: '#...', roundIcon: false }} />`,
});
export const WithTimer = example({
  name: 'Badge With Timer', description: 'BadgeWithTimer shows days left for a day or more, and a HH:MM:SS countdown below that.',
  render: () => h(Row, null, h(BadgeWithTimer, { timer: new Date(Date.now() + 3 * DAY + HOUR) }), h(BadgeWithTimer, { timer: new Date(Date.now() + 5 * HOUR + 12 * 60000) }), h(BadgeWithTimer, { remainingMs: 1 * DAY + 5000, daysLeftLabel: 'day left' })),
  source: `<BadgeWithTimer timer={expiresAt} />
<BadgeWithTimer timer={expiresAt} daysLeftLabel="days left" />`,
});
export const OnCard = example({
  name: 'On A Product Card', render: () => h('div', { style: { position: 'relative', width: 280, maxWidth: '100%', height: 140, borderRadius: 'var(--baseui-radius-16)', background: 'var(--baseui-Background-Secondary)', padding: 'var(--baseui-spacing-12)', boxSizing: 'border-box' } },
    h(ProductBadge, { type: 'OutOfStock' }),
    h('div', { style: { position: 'absolute', left: 12, bottom: 12, font: 'var(--baseui-Typography-Text-16-Semi-Bold)' } }, 'Dark Moon Gear Set')),
  source: `<ProductBadge type="OutOfStock" />`,
});
export const __namedExportsOrder = ['Playground', 'Presets', 'NewLook', 'Overrides', 'AdminBadge', 'WithTimer', 'OnCard'];
