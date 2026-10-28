import { h } from '../../react.js';
import { CartProductCard, CartProductCardFailed, ProductType, DEFAULT_TEXTS } from '../organisms/CartProductCard.js';
import { TextField } from '../../stories/_ui.js';
import { meta, playground, example, Stack } from '../../stories/_helpers.js';
import { itemArt } from './_art.js';

const noop = () => {};
const texts = { ...DEFAULT_TEXTS, quantity: { ...DEFAULT_TEXTS.quantity, bonusIncluded: '+5% bonus included' } };
const base = {
  id: 'li-1', imageUrl: itemArt('M', 250), productUrl: '#', title: 'Mythic Raid Boosting', options: [{ text: 'EU West' }, { text: 'Tank', highlighted: true }, { text: '8/8 bosses' }],
  seller: 'DarkMoonBoost', startTime: '4 hours', deliveryTime: '1 day 4 hours', productType: ProductType.Service, quantity: 1, currency: 'USD', totalPrice: 49.9, priceBeforeDiscount: 49.9,
  isRemoving: false, texts, onRemoveProduct: noop, onProductLinkClick: (e) => e.preventDefault(), handleInvalidCreationRemove: noop,
};
const box = (c, w = 720) => h('div', { style: { width: w, maxWidth: '100%' } }, c);

export default meta({
  title: 'Overgear/Organisms/CartProductCard', component: CartProductCard,
  args: { variant: 'cart', quantity: 1, totalPrice: 49.9, priceBeforeDiscount: 49.9, isRemoving: false, outOfStock: false, invalidCreationParams: false, isHideRemoveButton: false, hidePrices: false, hideSellerAndDelivery: false, isCustomBundle: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['cart', 'checkout'] }, quantity: { control: 'number' }, totalPrice: { control: 'number' }, priceBeforeDiscount: { control: 'number' },
    isRemoving: { control: 'boolean' }, outOfStock: { control: 'boolean' }, invalidCreationParams: { control: 'boolean' }, isHideRemoveButton: { control: 'boolean' }, hidePrices: { control: 'boolean' }, hideSellerAndDelivery: { control: 'boolean' }, isCustomBundle: { control: 'boolean' },
    texts: { control: false }, options: { control: false }, discountSlot: { control: false },
  },
});
export const Playground = { ...playground({ source: `<CartProductCard title="Mythic Raid Boosting" imageUrl={art} productUrl="/boost" currency="USD" totalPrice={49.9} priceBeforeDiscount={49.9} onRemoveProduct={remove} texts={texts} ... />` }), render: (args) => box(h(CartProductCard, { ...base, ...args })) };
export const Default = example({
  name: 'Default', render: () => box(h(CartProductCard, base)),
  source: `<CartProductCard title="Mythic Raid Boosting" options={[{ text: 'EU West' }, { text: 'Tank', highlighted: true }]} seller="DarkMoonBoost" startTime="4 hours" deliveryTime="1 day 4 hours" currency="USD" totalPrice={49.9} priceBeforeDiscount={49.9} ... />`,
});
export const Discount = example({
  name: 'Discount and Quantity', description: 'The old price is struck through and the total is green. Quantity above 1 is shown; a currency row calls it Amount.',
  render: () => box(h(Stack, null,
    h(CartProductCard, { ...base, totalPrice: 39.9, priceBeforeDiscount: 49.9, quantity: 3 }),
    h(CartProductCard, { ...base, title: 'Gold, EU West', imageUrl: itemArt('G', 40), productType: ProductType.Currency, quantity: 25000, totalPrice: 24.9, priceBeforeDiscount: 24.9, options: [], startTime: undefined }))),
  source: `<CartProductCard totalPrice={39.9} priceBeforeDiscount={49.9} quantity={3} ... />`,
});
export const PriceChanged = example({
  name: 'Price Changed', description: 'When the total differs from parentPrice a note appears; previousPrice strikes the old price through whichever way it moved.',
  render: () => box(h(CartProductCard, { ...base, totalPrice: 54.9, priceBeforeDiscount: 54.9, parentPrice: 49.9, previousPrice: 49.9 })),
  source: `<CartProductCard totalPrice={54.9} parentPrice={49.9} previousPrice={49.9} ... />`,
});
export const OutOfStock = example({
  name: 'Out of Stock', render: () => box(h(CartProductCard, { ...base, outOfStock: true })),
  source: `<CartProductCard outOfStock ... />`,
});
export const InvalidOptions = example({
  name: 'Invalid Options', description: 'The options are not available any more: a red note with a Replace button.',
  render: () => box(h(CartProductCard, { ...base, invalidCreationParams: true })),
  source: `<CartProductCard invalidCreationParams handleInvalidCreationRemove={replace} ... />`,
});
export const Warnings = example({
  name: 'Warnings and Bundle', render: () => box(h(Stack, null,
    h(CartProductCard, { ...base, warningMessage: 'The seller is offline, delivery may start later.' }),
    h(CartProductCard, { ...base, isCustomBundle: true, bundleWithoutDiscount: true, title: 'Custom bundle: raid + gold' }))),
  source: `<CartProductCard warningMessage="..." /> <CartProductCard isCustomBundle bundleWithoutDiscount />`,
});
export const Removing = example({
  name: 'Removing and Loading Price', render: () => box(h(Stack, null, h(CartProductCard, { ...base, isRemoving: true }), h(CartProductCard, { ...base, hidePrices: true }))),
  source: `<CartProductCard isRemoving /> <CartProductCard hidePrices />`,
});
export const WithDiscountCode = example({
  name: 'Discount Slot', render: () => box(h(CartProductCard, { ...base, discountSlot: h(TextField, { label: 'Promo code', size: 'sm' }) })),
  source: `<CartProductCard discountSlot={<TextField label="Promo code" />} ... />`,
});
export const Checkout = example({
  name: 'Checkout', description: 'The price stays at the top and the remove button is a framed square under the product. hideSellerAndDelivery gives a compact summary.',
  render: () => box(h(Stack, null, h(CartProductCard, { ...base, variant: 'checkout', quantity: 2 }), h(CartProductCard, { ...base, variant: 'checkout', hideSellerAndDelivery: true, isHideRemoveButton: true }))),
  source: `<CartProductCard variant="checkout" hideSellerAndDelivery ... />`,
});
export const Mobile = example({
  name: 'Mobile', description: 'On a narrow container the price, remove button and quantity move to a bottom bar.',
  render: () => box(h(Stack, null, h(CartProductCard, { ...base, quantity: 3, totalPrice: 39.9, priceBeforeDiscount: 49.9 }), h(CartProductCard, { ...base, variant: 'checkout' })), 340),
  source: `<div style={{ width: 340 }}><CartProductCard ... /></div>`,
});
export const Failed = example({
  name: 'Failed', description: 'CartProductCardFailed: the product could not be loaded.',
  render: () => box(h(Stack, null, h(CartProductCardFailed, { texts: { outOfStock: 'This item is out of stock' }, onRemoveProduct: noop }), h(CartProductCardFailed, { texts: { outOfStock: 'x' }, onRemoveProduct: noop, isRemoving: true, isCustomBundle: true }))),
  source: `<CartProductCardFailed texts={{ outOfStock: 'This item is out of stock' }} onRemoveProduct={remove} />`,
});
export const FailedMobile = example({
  name: 'Failed Mobile', render: () => box(h(CartProductCardFailed, { texts: { outOfStock: 'This item is out of stock' }, onRemoveProduct: noop }), 340),
  source: `<CartProductCardFailed ... />`,
});
export const __namedExportsOrder = ['Playground', 'Default', 'Discount', 'PriceChanged', 'OutOfStock', 'InvalidOptions', 'Warnings', 'Removing', 'WithDiscountCode', 'Checkout', 'Mobile', 'Failed', 'FailedMobile'];
