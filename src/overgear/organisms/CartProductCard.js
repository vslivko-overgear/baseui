import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Skeleton } from '../../components/Skeleton.js';
import { Button } from '../../components/Button.js';
import { ClockIcon } from '../molecules/CountdownTimer.js';
import { TrashIcon, SpinnerIcon, InfoIcon, UserIcon, AlarmIcon, formatAmountWithCurrency, formatQuantity } from './_shared.js';

export const ProductType = { Currency: 'currency', Service: 'service' };

/** "Hero {{name}}" -> "Hero": removes template placeholders left in option texts. */
export const removeTemplateValue = (text) => String(text ?? '').replace(/\{\{[^}]*\}\}/g, '').replace(/\s{2,}/g, ' ').trim();

export const DEFAULT_TEXTS = {
  productInfo: { additionalInfo: 'Additional info:', soldBy: 'Sold by:', deliveryStart: 'Start:', deliveryTime: 'Delivery time:' },
  quantity: { amount: 'Amount:', quantity: 'Quantity:', bonusIncluded: undefined },
  priceChanged: 'The <b>price has changed</b> since you added this item.',
  outOfStock: 'This item is out of stock',
  discountInfo: 'This bundle has no discount',
  invalidCreation: { notAvailable: 'This item is <b>not available</b> with the chosen options.', notAvailableReplace: 'Replace' },
};

export function CartProductImage({ imageUrl, link, onClick, onLinkClick, className }) {
  const image = imageUrl ? h('img', { className: 'og-cart__img', onClick, alt: 'product', loading: 'lazy', src: imageUrl }) : h('span', { className: 'og-cart__img og-cart__img--empty', 'aria-hidden': 'true' });
  return h('div', { 'data-slot': 'cart-image', className: cx('og-cart__image', className) }, link ? h('a', { href: link, onClick: onLinkClick }, image) : image);
}
describe(CartProductImage, 'The square product picture of a cart row, optionally a link.', {
  imageUrl: ['string', null, 'Picture; a neutral tile is drawn when missing'],
  link: ['string', null, 'Makes the picture a link'],
  onClick: ['(event) => void', null, 'Click on the picture'],
  onLinkClick: ['(event) => void', null, 'Click on the link'],
});

export function ProductTitle({ title, productUrl, onProductLinkClick, variant = 'cart', className }) {
  const body = h('span', { className: cx('og-cart__title', variant === 'checkout' && 'og-cart__title--lg', className), dangerouslySetInnerHTML: { __html: title ?? '' } });
  return variant === 'checkout' ? h('div', null, body) : h('a', { href: productUrl, onClick: onProductLinkClick, className: 'og-cart__title-link' }, body);
}
describe(ProductTitle, 'The title of a cart row: a link in the cart, plain larger text at checkout.', {
  title: ['string', null, 'Title as HTML (sanitized upstream)'],
  productUrl: ['string', null, 'Link target'],
  onProductLinkClick: ['(event) => void', null, 'Click on the link'],
  variant: ["'cart' | 'checkout'", "'cart'", 'Where the row is shown'],
});

const InfoRow = ({ icon, label, value, strong }) => h('div', { className: 'og-cart__row' },
  h('span', { className: 'og-cart__row-icon' }, icon),
  h('span', null, h('b', { className: 'og-cart__label' }, `${label} `), h('span', { className: cx('og-cart__value', strong && 'og-cart__value--strong') }, value)));

export function ProductInfo({ deliveryTime, startTime, seller, additionalInfo, texts = DEFAULT_TEXTS.productInfo, options = [], variant = 'cart', hideSellerAndDelivery = false, className }) {
  return h('div', { 'data-slot': 'cart-info', className: cx('og-cart__info', className) },
    options.some(Boolean) && h('div', { className: 'og-cart__options' }, options.map((o, i) => o && h('span', { key: i }, i !== 0 && ' • ', h('span', { className: o.highlighted ? 'og-cart__option--hot' : undefined }, removeTemplateValue(o.text))))),
    additionalInfo && InfoRow({ icon: h(InfoIcon), label: texts.additionalInfo, value: additionalInfo }),
    !hideSellerAndDelivery && seller && InfoRow({ icon: h(UserIcon), label: texts.soldBy, value: seller, strong: variant === 'checkout' }),
    !hideSellerAndDelivery && !!startTime && InfoRow({ icon: h(AlarmIcon), label: texts.deliveryStart, value: startTime }),
    !hideSellerAndDelivery && deliveryTime && InfoRow({ icon: h(ClockIcon, { size: 16 }), label: texts.deliveryTime, value: deliveryTime }));
}
describe(ProductInfo, 'The details under a cart row title: options, extra info, seller and delivery rows.', {
  options: ['Array<{ text: string; highlighted?: boolean } | null>', '[]', 'Options joined with a bullet; a highlighted one is orange'],
  additionalInfo: ['string | null', null, 'Extra information row'],
  seller: ['string | null', null, 'Seller name'],
  startTime: ['string', null, 'When the delivery starts'],
  deliveryTime: ['string', null, 'How long the delivery takes'],
  texts: ['{ additionalInfo, soldBy, deliveryStart, deliveryTime }', 'English', 'Row labels'],
  variant: ["'cart' | 'checkout'", "'cart'", 'At checkout the seller is bold'],
  hideSellerAndDelivery: ['boolean', 'false', 'Drops the seller and delivery rows for a compact summary'],
});

export function Quantity({ quantity, productType, texts = DEFAULT_TEXTS.quantity, className }) {
  if (!quantity || quantity <= 1) return null;
  return h('div', { 'data-slot': 'cart-quantity', className: cx('og-cart__qty', className) },
    h('b', { className: 'og-cart__label' }, `${productType === ProductType.Currency ? texts.amount : texts.quantity} `),
    h('span', { className: 'og-cart__qty-value' }, formatQuantity(quantity)),
    texts.bonusIncluded && h('span', { className: 'og-cart__bonus' }, texts.bonusIncluded));
}
describe(Quantity, 'The amount or quantity of a cart row; nothing is shown for a single unit.', {
  quantity: ['number | null', null, 'Units; hidden when 1 or less'],
  productType: ["'currency' | 'service'", null, 'Currency rows say "Amount", others "Quantity"'],
  texts: ['{ amount, quantity, bonusIncluded? }', 'English', 'Labels; `bonusIncluded` adds a green note'],
});

export function CartPrice({ priceBeforeDiscount, currency, totalPrice, previousPrice, hidePrices = false, formatPrice = formatAmountWithCurrency, className }) {
  if (hidePrices || !currency || typeof priceBeforeDiscount !== 'number' || typeof totalPrice !== 'number') {
    return h('span', { 'data-slot': 'cart-price', 'aria-busy': 'true', className: cx('og-cart__price', className) }, h(Skeleton, { variant: 'text', width: 56, height: 24 }));
  }
  const changed = typeof previousPrice === 'number' && previousPrice !== totalPrice;
  const struck = changed ? previousPrice : priceBeforeDiscount;
  return h('span', { 'data-slot': 'cart-price', className: cx('og-cart__price', className) },
    h('span', { className: cx('og-cart__total', struck > totalPrice && 'og-cart__total--sale'), 'data-id': 'cart-item-price' }, formatPrice(totalPrice, currency)),
    (changed || priceBeforeDiscount > totalPrice) && h('s', { className: 'og-cart__old' }, formatPrice(struck, currency)));
}
describe(CartPrice, 'The price of a cart row: the total, with the old price struck through when there is a discount or the price was re-quoted. A skeleton shows while it is unknown.', {
  totalPrice: ['number', null, 'Price to pay; green when it is below the struck one'],
  priceBeforeDiscount: ['number', null, 'Price before the discount'],
  previousPrice: ['number | null', null, 'Price before a re-quote; replaces the discount strike whichever way the price moved'],
  currency: ['string', null, 'Currency code, e.g. "USD"'],
  hidePrices: ['boolean', 'false', 'Show the skeleton'],
  formatPrice: ['(amount, currency) => string', 'en-US Intl', 'Price formatter'],
});

export function RemoveButton({ isRemoving = false, onRemoveProduct, id = '', boxed = false, label = 'Remove item', className }) {
  return h('button', {
    type: 'button', 'data-slot': 'cart-remove', 'data-boxed': boxed || undefined, className: cx('og-cart__remove', boxed && 'og-cart__remove--boxed', className),
    'aria-label': label, 'aria-disabled': isRemoving || undefined, disabled: isRemoving, onClick: () => onRemoveProduct && onRemoveProduct(id),
  }, isRemoving ? h(SpinnerIcon, { size: 18 }) : h(TrashIcon, { size: 18 }));
}
describe(RemoveButton, 'The trash button of a cart row; it turns into a spinner while the removal runs.', {
  isRemoving: ['boolean', 'false', 'Removal in progress: shows a spinner and disables the button'],
  onRemoveProduct: ['(id: string) => void', null, 'Called with `id` on click'],
  id: ['string', "''", 'Passed to `onRemoveProduct`'],
  boxed: ['boolean', 'false', 'A framed square on every width, not only on narrow cards'],
  label: ['string', "'Remove item'", 'Accessible name'],
});

export const CartNote = ({ tone = 'warning', html, children, className }) => h('div', { 'data-slot': 'cart-note', 'data-tone': tone, role: tone === 'error' ? 'alert' : 'status', className: cx('og-note', `og-note--${tone}`, className) },
  html != null ? h('span', { dangerouslySetInnerHTML: { __html: html } }) : children);
describe(CartNote, 'A message under a cart row: red for an error, orange for a warning. Used for out of stock, changed price and similar.', {
  tone: ["'error' | 'warning'", "'warning'", 'Color'],
  html: ['string', null, 'Message as HTML (a <b> is bold)'],
  children: ['ReactNode', null, 'Message when `html` is not used'],
});

export function CartProductCard({
  id, productUrl, imageUrl, title, additionalInfo, options = [], deliveryTime, startTime, seller, productType, quantity, currency, totalPrice, parentPrice, priceBeforeDiscount, previousPrice,
  isRemoving = false, outOfStock = false, invalidCreationParams = false, onProductLinkClick, onRemoveProduct, handleInvalidCreationRemove, warningMessage, texts = DEFAULT_TEXTS, isCustomBundle = false,
  isHideRemoveButton = false, hidePrices = false, isInvalid = false, bundleWithoutDiscount = false, discountSlot, variant = 'cart', hideSellerAndDelivery = false, formatPrice, className, ...rest
}) {
  const invalid = outOfStock || invalidCreationParams || isInvalid;
  const checkoutRemovable = variant === 'checkout' && !isHideRemoveButton;
  const panel = !checkoutRemovable;
  const priceProps = { priceBeforeDiscount, previousPrice, currency, totalPrice, hidePrices, formatPrice };
  const qty = { quantity, productType, texts: texts.quantity };
  const priceChanged = totalPrice && parentPrice && totalPrice !== parentPrice;
  return h('div', {
    'data-slot': 'cart-product-card', 'data-variant': variant, 'data-invalid': invalid || undefined, 'data-removing': isRemoving || undefined, 'data-test-id': 'mini-cart-item',
    className: cx('og-cart', invalid && 'og-cart--invalid', !invalid && isCustomBundle && 'og-cart--bundle', panel && 'og-cart--panel', className), ...rest,
  },
  h('div', { className: 'og-cart__main' },
    h(CartProductImage, { imageUrl, link: productUrl, onLinkClick: onProductLinkClick }),
    h('div', { className: 'og-cart__body' },
      h('div', { className: 'og-cart__top' },
        h('div', { className: 'og-cart__text' },
          h(ProductTitle, { title, productUrl, onProductLinkClick, variant }),
          variant === 'checkout' && h(Quantity, { ...qty, className: 'og-cart__qty--body' }),
          h(ProductInfo, { additionalInfo, options, deliveryTime, startTime, seller, texts: texts.productInfo, variant, hideSellerAndDelivery }),
          variant !== 'checkout' && h(Quantity, { ...qty, className: 'og-cart__qty--body' })),
        h('div', { className: 'og-cart__right' },
          h(CartPrice, priceProps),
          !(isHideRemoveButton || checkoutRemovable) && h(RemoveButton, { id, isRemoving, onRemoveProduct }))),
      discountSlot && h('div', { className: 'og-cart__discount' }, discountSlot))),
  panel && h('div', { className: 'og-cart__panel' },
    h('div', { className: 'og-cart__panel-left' }, !isHideRemoveButton && h(RemoveButton, { id, isRemoving, onRemoveProduct }), h(Quantity, qty)),
    h(CartPrice, priceProps)),
  checkoutRemovable && h('div', { className: 'og-cart__boxed' }, h(RemoveButton, { id, isRemoving, onRemoveProduct, boxed: true })),
  !isCustomBundle && invalidCreationParams && !outOfStock && h(CartNote, { tone: 'error' },
    h('div', { className: 'og-note__error' },
      h('span', { dangerouslySetInnerHTML: { __html: texts.invalidCreation.notAvailable } }),
      !isRemoving && !(isHideRemoveButton || variant === 'checkout') && h(Button, { variant: 'secondary', size: 'sm', label: texts.invalidCreation.notAvailableReplace, onClick: handleInvalidCreationRemove }))),
  bundleWithoutDiscount && h(CartNote, { tone: 'warning', html: texts.discountInfo }),
  priceChanged ? h(CartNote, { tone: 'warning', html: texts.priceChanged }) : null,
  outOfStock && h(CartNote, { tone: 'error', html: texts.outOfStock }),
  warningMessage && h(CartNote, { tone: 'warning', html: warningMessage }));
}
describe(CartProductCard, 'A product row of the cart or checkout: picture, title, options and seller/delivery details, quantity, price and a remove button, plus notes for an out-of-stock item, a changed price or invalid options. On a narrow container the price, remove button and quantity move to a bottom bar; the layout follows the width of the card itself, not the screen.', {
  productUrl: ['string', null, 'Link of the picture and the title (cart)'],
  imageUrl: ['string', null, 'Product picture'],
  title: ['string', null, 'Title as HTML'],
  additionalInfo: ['string | null', null, 'Extra information row'],
  options: ['Array<{ text: string; highlighted?: boolean } | null>', '[]', 'Options joined with a bullet'],
  deliveryTime: ['string', null, 'Delivery duration'],
  startTime: ['string', null, 'Delivery start'],
  seller: ['string | null', null, 'Seller name'],
  productType: ["'currency' | 'service'", null, 'Currency rows label the quantity "Amount"'],
  quantity: ['number | null', null, 'Units; shown above 1'],
  currency: ['string | null', null, 'Currency code'],
  totalPrice: ['number | null', null, 'Price to pay'],
  parentPrice: ['number | null', null, 'Price the bundle was added at; a different total shows the price changed note'],
  priceBeforeDiscount: ['number | null', null, 'Price before the discount'],
  previousPrice: ['number | null', null, 'Price before a re-quote, struck through when it differs from the total'],
  id: ['string', null, 'Passed to `onRemoveProduct`'],
  isRemoving: ['boolean', 'false', 'Removal in progress'],
  outOfStock: ['boolean', 'false', 'Red card and an out of stock note'],
  invalidCreationParams: ['boolean', 'false', 'Red card with a "not available" note and a Replace button'],
  isInvalid: ['boolean', 'false', 'Red card without a note'],
  isCustomBundle: ['boolean', 'false', 'A custom bundle: slightly different background and no invalid-options note'],
  bundleWithoutDiscount: ['boolean', 'false', 'Shows the "no discount" warning'],
  warningMessage: ['string', null, 'An extra warning note'],
  hidePrices: ['boolean', 'false', 'Skeleton instead of the price'],
  isHideRemoveButton: ['boolean', 'false', 'No remove button'],
  discountSlot: ['ReactNode', null, 'A discount code field under the details'],
  variant: ["'cart' | 'checkout'", "'cart'", 'At checkout the title is larger, the price stays at the top and the remove button is a framed square below'],
  hideSellerAndDelivery: ['boolean', 'false', 'Drops the seller and delivery rows'],
  texts: ['IProductCardTexts', 'English', 'All labels and notes'],
  formatPrice: ['(amount, currency) => string', 'en-US Intl', 'Price formatter'],
  onRemoveProduct: ['(id: string) => void', null, 'Remove button'],
  onProductLinkClick: ['(event) => void', null, 'Click on the title or the picture'],
  handleInvalidCreationRemove: ['() => void', null, 'Replace button of the invalid-options note'],
});

export function CartProductCardFailed({ isRemoving = false, onRemoveProduct, hideRemoveButton = false, isCustomBundle = false, texts, className, ...rest }) {
  return h('div', { 'data-slot': 'cart-product-card-failed', className: cx('og-cart', 'og-cart--invalid', 'og-cart--failed', className), ...rest },
    h('div', { className: 'og-cart__main' },
      h('span', { className: 'og-cart__image og-cart__ph', 'aria-hidden': 'true' }),
      h('div', { className: 'og-cart__body og-cart__failed-lines', 'aria-hidden': 'true' }, h('span', { className: 'og-cart__ph og-cart__ph--title' }), h('span', { className: 'og-cart__ph og-cart__ph--sub' })),
      !hideRemoveButton && h('div', { className: 'og-cart__right og-cart__right--failed' }, h('span', { className: 'og-cart__ph og-cart__ph--price', 'aria-hidden': 'true' }), h(RemoveButton, { isRemoving, onRemoveProduct }))),
    !isCustomBundle && texts?.outOfStock && h(CartNote, { tone: 'error', html: texts.outOfStock }));
}
describe(CartProductCardFailed, 'A cart row whose product could not be loaded: grey placeholder lines on a red tint, a remove button and an out of stock note.', {
  isRemoving: ['boolean', 'false', 'Removal in progress'],
  onRemoveProduct: ['(id: string) => void', null, 'Remove button'],
  hideRemoveButton: ['boolean', 'false', 'No remove button'],
  isCustomBundle: ['boolean', 'false', 'A custom bundle shows no note'],
  texts: ['{ outOfStock: string }', null, 'Text of the note; no note without it'],
});
