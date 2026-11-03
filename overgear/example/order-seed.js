// The orders that a browser starts with: a few of every status, so every state of the real service can be seen on the list and on the page of an order. Made from the offers of the example, relative to now.
import { OFFERS, SELLERS } from './data.js';
import { ORDER_STATUS as S, stateOfStatus, etaSeconds } from './order-core.js';

const HOUR = 36e5;
const DAY = 24 * HOUR;

/** What a seller needs from the buyer to deliver: for a service the character, the realm and the password (deleted when the order is completed), for currency the character and the realm. */
export const deliveryFor = (productType) => (productType === 'currency'
  ? [{ key: 'character', label: 'Character name', required: true }, { key: 'realm', label: 'Realm', required: true }]
  : [{ key: 'character', label: 'Character name', required: true }, { key: 'realm', label: 'Realm', required: true }, { key: 'password', label: 'Account password', required: true, secret: true, note: 'Will be deleted after order completion' }]);

const GOLD = { id: 'wow-gold-500k', title: 'WoW Gold, 500K', price: 24.5, eta: '15 minutes', productType: 'currency' };
const pick = (id) => OFFERS.find((o) => o.id === id) || OFFERS[0];

// [offer, status, hours ago it was placed, extras]: the order of the list is the newest first
const PLAN = [
  ['venomous-abyss-heroic', S.NEW, 0.2, { og: true }],
  ['tidebound-grotto', S.NEW, 0.4, {}],
  ['mythic-plus-bundle', S.SELLER_RECEIVED, 2, {}],
  ['power-leveling', S.IN_PROGRESS, 5, { og: true, started: 1, filled: true }],
  ['kithix', S.IN_PROGRESS, 30, { started: 29, late: true }],
  ['character-boost', S.CONFIRM_DELIVERY, 26, { og: true, started: 25, delivered: 2, filled: true }],
  [GOLD, S.WAIT_SCREENSHOTS, 6, { og: true, started: 5.8, filled: true }],
  ['arena-2400', S.UNDER_REVIEW, 50, { started: 49, delivered: 30, ticket: 'The rating is 2200, not 2400' }],
  ['hallows-end', S.COMPLETED, 3 * 24, { og: true, filled: true, started: 70, delivered: 60, completed: 58, review: { rate: 5, text: 'Done in a day, very polite booster' } }],
  ['tidebound-grotto', S.COMPLETED, 4 * 24, { started: 95, delivered: 94.5, completed: 94 }],
  [GOLD, S.COMPLETED, 6 * 24, { og: true, filled: true, started: 143, delivered: 142.5, completed: 142 }],
  ['ulatek', S.RESOLVED, 8 * 24, { started: 190, delivered: 170, completed: 150, ticket: 'The mount did not drop' }],
  ['mount-collector', S.REFUNDED, 9 * 24, { started: 214, ticket: 'Nobody started the order for three days' }],
  ['rated-bg', S.CANCELLED, 10 * 24, {}],
  ['reputation', S.REJECTED, 11 * 24, {}],
  ['abyss-kithix-grotto', S.KYC_WATCH, 12, { started: 11, frozen: 8 }],
  ['mythic-10-timed', S.ORDER_PAUSED_NEW, 1, {}],
  ['venomous-abyss-heroic', S.AWAITING_AUTHORIZATION, 0.5, {}],
  ['power-leveling', S.ERROR, 14 * 24, {}],
  ['kithix', S.UNPAID, 15 * 24, {}],
  ['hallows-end', S.COMPLETED, 16 * 24, { og: true, started: 380, delivered: 378, completed: 377 }],
  ['tidebound-grotto', S.COMPLETED, 18 * 24, {}],
  ['ulatek', S.COMPLETED, 20 * 24, { og: true }],
  ['reputation', S.COMPLETED, 22 * 24, {}],
  ['rated-bg', S.COMPLETED, 25 * 24, {}],
  ['mythic-10-timed', S.COMPLETED, 28 * 24, { og: true }],
  ['character-boost', S.COMPLETED, 31 * 24, {}],
];

/** The starting orders, for the moment `now`. */
export const seedOrders = (now) => PLAN.map(([ref, status, ago, x], i) => {
  const offer = typeof ref === 'string' ? pick(ref) : ref;
  const productType = offer.productType || 'service';
  const createdAt = now - ago * HOUR;
  const at = (h) => (h == null ? null : now - h * HOUR);
  const fields = deliveryFor(productType);
  const filled = !!x.filled || ![S.NEW, S.SELLER_RECEIVED, S.AWAITING_AUTHORIZATION, S.ORDER_PAUSED_NEW].includes(status);
  const values = filled ? { character: 'Thrall', realm: 'Draenor', ...(productType === 'currency' ? {} : { password: 'secret' }) } : {};
  const n = 171000 + i * 37;
  const duration = etaSeconds(offer.eta);
  const started = x.started != null ? at(x.started) : ([S.IN_PROGRESS, S.CONFIRM_DELIVERY, S.WAIT_SCREENSHOTS, S.UNDER_REVIEW, S.COMPLETED, S.RESOLVED, S.KYC_WATCH].includes(status) ? createdAt + 0.5 * HOUR : null);
  return {
    link: `${1201 + (i % 5)}_${n}`,
    id: String(n),
    title: offer.title,
    sub: '',
    offerId: offer.id !== GOLD.id ? offer.id : undefined,
    game: 'wow',
    productType,
    og: !!x.og,
    qty: 1,
    price: offer.price,
    currency: 'USD',
    image: offer.image,
    status,
    state: stateOfStatus(status),
    createdAt,
    statusAt: createdAt,
    acceptedAt: started,
    deliveredAt: at(x.delivered),
    completedAt: at(x.completed),
    frozenAt: at(x.frozen),
    resumedAt: null,
    duration,
    boosterAssigned: !!started,
    method: ['card', 'apple', 'paypal', 'google'][i % 4],
    email: '',
    userId: 'me',
    seller: x.og ? { id: 'overgear', name: 'Overgear', online: true } : { id: SELLERS[i % SELLERS.length].id, name: SELLERS[i % SELLERS.length].name, online: SELLERS[i % SELLERS.length].online },
    region: 'EU',
    delivery: x.og ? { fields, values, filled } : null,
    files: x.delivered != null ? ['proof-1', 'proof-2'] : [],
    review: x.review ? { ...x.review, at: createdAt + 2 * DAY } : null,
    tip: null,
    ticket: x.ticket ? { text: x.ticket, at: createdAt + DAY } : null,
    messages: [],
  };
});
