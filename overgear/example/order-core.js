// The orders of the store after the purchase, with the rules of the real service (og-frontend-4: orders-listing-widget, order-page-widget, checkout-result-widget) as pure functions:
// the statuses and the states, the colors of a status, the texts of a status for the buyer, the steps of an order, the buttons of the buyer, the locks and the timers, the result page of a
// payment, the list (a filter, a sort, a page), the review, and the way a seller's work moves an order on. No React and no browser here: the pages (orders.jsx, order-page.jsx, order-result.jsx) draw them.

/** The statuses of an order as the backend sends them, with the `status/` prefix. */
export const ORDER_STATUS = {
  NEW: 'status/NEW',
  IN_PROGRESS: 'status/IN_PROGRESS',
  SELLER_RECEIVED: 'status/SELLER_RECEIVED',
  WAIT_SCREENSHOTS: 'status/WAIT_SCREENSHOTS',
  CONFIRM_DELIVERY: 'status/CONFIRM_DELIVERY',
  COMPLETED: 'status/COMPLETED',
  UNDER_REVIEW: 'status/UNDER_REVIEW',
  RESOLVED: 'status/RESOLVED',
  REFUNDED: 'status/REFUNDED',
  CANCELLED: 'status/CANCELLED',
  REJECTED: 'status/REJECTED',
  ERROR: 'status/ERROR',
  UNPAID: 'status/UNPAID',
  KYC_LOCK: 'status/KYC_LOCK',
  KYC_WATCH: 'status/KYC_WATCH',
  AWAITING_AUTHORIZATION: 'status/AWAITING_AUTHORIZATION',
  ORDER_PAUSED_NEW: 'status/ORDER_PAUSED_NEW',
  ORDER_PAUSED_IN_PROGRESS: 'status/ORDER_PAUSED_IN_PROGRESS',
};
const S = ORDER_STATUS;

/** The coarse state of an order (`Order.state`); the filter of the list is made of these. */
export const ORDER_STATE = {
  NEW: 'state/NEW',
  PENDING: 'state/PENDING',
  IN_PROGRESS: 'state/IN_PROGRESS',
  ARBITRAGE: 'state/ARBITRAGE',
  COMPLETED: 'state/COMPLETED',
  CANCELLED: 'state/CANCELLED',
  FAILED: 'state/FAILED',
};
const T = ORDER_STATE;

/** Orders of a state of the other prefix or none at all are the same state: `Order.state` may come with or without `state/`. */
export const normalizeOrderState = (state) => (state ? String(state).replace(/^state\//, '') : '');

/** The state an order of a status is in (the real one comes from the backend; this is what the example's orders get). */
export const stateOfStatus = (status) => {
  switch (status) {
    case S.NEW: case S.SELLER_RECEIVED: return T.NEW;
    case S.AWAITING_AUTHORIZATION: case S.ORDER_PAUSED_NEW: return T.PENDING;
    case S.IN_PROGRESS: case S.WAIT_SCREENSHOTS: case S.CONFIRM_DELIVERY: case S.ORDER_PAUSED_IN_PROGRESS: case S.KYC_LOCK: case S.KYC_WATCH: return T.IN_PROGRESS;
    case S.UNDER_REVIEW: return T.ARBITRAGE;
    case S.COMPLETED: case S.RESOLVED: return T.COMPLETED;
    case S.CANCELLED: case S.REJECTED: case S.REFUNDED: return T.CANCELLED;
    case S.ERROR: case S.UNPAID: return T.FAILED;
    default: return T.NEW;
  }
};

export const STATUS_LABEL = {
  [S.NEW]: 'New',
  [S.IN_PROGRESS]: 'In progress',
  [S.SELLER_RECEIVED]: 'Received',
  [S.WAIT_SCREENSHOTS]: 'Awaiting screenshots',
  [S.CONFIRM_DELIVERY]: 'Confirm delivery',
  [S.COMPLETED]: 'Completed',
  [S.UNDER_REVIEW]: 'Under review',
  [S.RESOLVED]: 'Resolved',
  [S.REFUNDED]: 'Refunded',
  [S.CANCELLED]: 'Cancelled',
  [S.REJECTED]: 'Rejected',
  [S.ERROR]: 'Error',
  [S.UNPAID]: 'Unpaid',
  [S.KYC_LOCK]: 'KYC lock',
  [S.KYC_WATCH]: 'KYC watch',
  [S.AWAITING_AUTHORIZATION]: 'Awaiting authorization',
  [S.ORDER_PAUSED_NEW]: 'Paused',
  [S.ORDER_PAUSED_IN_PROGRESS]: 'Paused',
};
export const statusLabel = (status) => STATUS_LABEL[status] || 'Unknown';

// The color of a status on a card of the list, by the groups of the real service: blue (new, received, refunded), grey (rejected, cancelled), green (completed, resolved), orange (in progress, screenshots,
// confirmation), red (error, unpaid, under review, KYC lock). The real one colors the text; here it is the light variant of a Badge that has the same meaning (the tags of a list are light, as in the payment history).
const BLUE = [S.NEW, S.SELLER_RECEIVED, S.REFUNDED];
const GREY = [S.REJECTED, S.CANCELLED];
const GREEN = [S.COMPLETED, S.RESOLVED];
const ORANGE = [S.IN_PROGRESS, S.WAIT_SCREENSHOTS, S.CONFIRM_DELIVERY];
const RED = [S.ERROR, S.UNPAID, S.UNDER_REVIEW, S.KYC_LOCK];
export const statusBadge = (status) => (BLUE.includes(status) ? 'accent-light' : GREEN.includes(status) ? 'success-light' : ORANGE.includes(status) ? 'warning-light' : RED.includes(status) ? 'critical-light' : GREY.includes(status) ? 'secondary' : 'secondary');

export const isKYC = (status) => status === S.KYC_LOCK || status === S.KYC_WATCH;
const PAUSED = [S.ORDER_PAUSED_NEW, S.ORDER_PAUSED_IN_PROGRESS, S.KYC_LOCK, S.KYC_WATCH];
/** An order that waits for the buyer's verification or for the end of an investigation: its clock is stopped. A KYC order in arbitration is not paused. */
export const isPaused = (status, state) => normalizeOrderState(state) !== 'ARBITRAGE' && PAUSED.includes(status);
export const isClosed = (status) => status === S.COMPLETED || status === S.RESOLVED;

// ---- the clock ----

export const HOUR = 36e5;
export const MINUTE = 6e4;

/** How much of the time of an order has gone, 0 to 1, with the time of a pause taken out (`calculateDurationPart` of the real service). NaN when the order has not started or has no duration. */
export const durationPart = ({ startedAt, duration, frozenAt, resumedAt }, now) => {
  if (!startedAt || !duration) return NaN;
  const frozen = frozenAt ? Math.max((resumedAt ?? now) - Math.max(frozenAt, startedAt), 0) : 0;
  return Math.min((now - frozen - startedAt) / (duration * 1000), 1);
};

/** An order in progress whose time is over: its title becomes "Delivery delayed". */
export const isDelayed = (order, now) => order.status === S.IN_PROGRESS && durationPart({ startedAt: order.acceptedAt, duration: order.duration, frozenAt: order.frozenAt, resumedAt: order.resumedAt }, now) === 1;

/** How long is left of the time of an order, in ms; 0 when it is over, null when it has not started. */
export const timeLeft = (order, now) => {
  const part = durationPart({ startedAt: order.acceptedAt, duration: order.duration, frozenAt: order.frozenAt, resumedAt: order.resumedAt }, now);
  if (Number.isNaN(part)) return null;
  return Math.max(Math.round((1 - part) * order.duration * 1000), 0);
};

/** "2h 14m", "35m", "under a minute". */
export const leftText = (ms) => {
  if (ms == null) return '';
  const m = Math.ceil(ms / MINUTE);
  if (m < 1) return 'under a minute';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, '0')}m`;
};

/** The buyer confirms the delivery of an order in progress only 30 minutes after it was placed. */
export const CONFIRM_LOCK = 30 * MINUTE;
export const confirmLockLeft = (createdAt, now) => Math.max(CONFIRM_LOCK - (now - createdAt), 0);

/** When a delivery that the buyer does not confirm closes by itself: 72 hours after the seller reported it. */
export const AUTO_COMPLETE = 72 * HOUR;
export const autoCompleteAt = (order) => (order.deliveredAt ?? order.createdAt) + AUTO_COMPLETE;

/** Tips are open for 72 hours after the order is completed. */
export const tipsOpen = (order, now) => order.status === S.COMPLETED && now - (order.completedAt ?? order.createdAt) <= AUTO_COMPLETE;

// ---- what the buyer reads about a status ----

/** The last sentence of a text has no period (rule C6); a question mark, an exclamation mark and an ellipsis stay. The real service keeps the period: the words are its words, this is the one change. */
export const noFinalPeriod = (text) => String(text).replace(/(?<!\.)\.\s*$/, '');

// The texts of a status for the buyer (`order.status.*.buyer`): a title and a description. The status "waiting for screenshots" reads as completed for the buyer: the buyer has confirmed.
const BUYER = {
  [S.NEW]: ['Order Placed', 'We are all set! Your payment has been accepted and the seller will reply as soon as possible.'],
  [S.SELLER_RECEIVED]: ['Waiting for Start', 'The seller is reviewing your order details and will message you shortly. \nPlease use the chat if you have any questions.'],
  [S.IN_PROGRESS]: ['In Progress', 'The seller is currently working on your order. Do not hesitate to ask any questions in the chat window. You can request progress updates and other additional information as well!'],
  PAST_DEADLINE: ['Delivery delayed', 'Sorry, it\'s taking a bit longer to complete your order. It usually happens due to the extremely high demand for the seller\'s services. The seller is doing their best to deliver as soon as possible.\nIf you have any questions, please use the chat.'],
  [S.CONFIRM_DELIVERY]: ['Delivery Confirmation', 'Great news! The seller has reported successful completion of your order. \nIf you agree, please click "Confirm Delivery". \nThe seller will not receive the money until you do!'],
  [S.WAIT_SCREENSHOTS]: ['Waiting for the seller to upload screenshots', 'The customer has confirmed the order but the seller has not uploaded screenshots yet. Check the screenshots after upload to make sure they don\'t upload cat photos.'],
  [S.COMPLETED]: ['Order Completed', 'The order has been completed. We hope that you are satisfied with the quality of our service. \nThank you for using Overgear! ❤️'],
  [S.RESOLVED]: ['Order Completed', 'After a thorough investigation, we have concluded that the seller has successfully completed this order. \nIf you think that something went wrong and you disagree with our decision, please contact our support team!'],
  [S.UNDER_REVIEW]: ['Open Dispute', 'A dispute has been opened for this order. \nPlease help us resolve this case and click the "Arbitrage ticket" button to provide additional information. \nOvergear Team is already reviewing this case and will notify you of our decision as soon as possible.'],
  [S.REFUNDED]: ['Order Refunded', 'The dispute was resolved in your favor, we have returned the funds to your account balance. Please choose an offer from another seller, or contact our support team and we\'ll quickly find a replacement for you!'],
  [S.CANCELLED]: ['Order Canceled', 'You have canceled this order. \nPlease choose an offer from another seller, or contact our support team and we\'ll quickly find a replacement for you!'],
  [S.REJECTED]: ['Seller can\'t take this order', 'Sorry, but the seller is unable to deliver this order.\nPlease choose an offer from another seller, or contact our support team and we\'ll quickly find a replacement for you!'],
  [S.ERROR]: ['Something went wrong', 'We ran into a technical issue with this order. Our team has been notified and will resolve it shortly.'],
  [S.UNPAID]: ['Payment required', 'This order hasn\'t been paid yet. Complete the payment to proceed.'],
  [S.AWAITING_AUTHORIZATION]: ['Waiting for seller', 'We\'re waiting for the seller to authorize this order.'],
  PAUSED: ['Order paused', 'The order is on hold until the verification is complete. The time of the order has stopped and will go on when it is.'],
};
/** The title and the description of the status panel for the buyer. `completedForBuyer`: the buyer's own order that waits for screenshots reads as completed. */
export const statusText = (order, now, completedForBuyer = order.status === S.WAIT_SCREENSHOTS) => {
  const { status, state } = order;
  const key = isPaused(status, state) ? 'PAUSED'
    : completedForBuyer ? S.COMPLETED
    : status === S.IN_PROGRESS && isDelayed(order, now) ? 'PAST_DEADLINE'
    : isKYC(status) ? S.UNDER_REVIEW
    : status;
  const [title, description] = BUYER[key] || ['', ''];
  return { title, description: noFinalPeriod(description) };
};

/** The tint of the status panel: green for a good moment, orange for a wait or a pause, red for an order that did not happen, none for an order in progress. */
export const panelTone = (order, now) => {
  const { status } = order;
  switch (status) {
    case S.NEW: case S.COMPLETED: case S.RESOLVED: case S.CONFIRM_DELIVERY: case S.SELLER_RECEIVED: return 'success';
    case S.UNDER_REVIEW: case S.AWAITING_AUTHORIZATION: case S.ORDER_PAUSED_NEW: case S.KYC_LOCK: case S.KYC_WATCH: case S.ORDER_PAUSED_IN_PROGRESS: return 'warning';
    case S.IN_PROGRESS: return isDelayed(order, now) ? 'warning' : 'none';
    case S.WAIT_SCREENSHOTS: return 'success';   // for the buyer: it reads as completed
    case S.CANCELLED: case S.REJECTED: case S.REFUNDED: case S.ERROR: case S.UNPAID: return 'error';
    default: return 'none';
  }
};

// ---- the steps ----

/**
 * The timeline of an order: the steps of the order of a shop of Overgear (add the delivery details, searching for a booster for a service, in progress, confirmation) or of a seller of the marketplace (placed, in progress,
 * confirmation). A step after a step that is done or active is done too: the timeline has no hole. Returns [{ name, title, value (0 to 1), active }] and the name of the current step.
 */
export const orderSteps = (order, now) => {
  const og = !!order.og;
  const service = order.productType === 'service';
  const currency = order.productType === 'currency';
  const unfilled = !!order.delivery && !order.delivery.filled && order.delivery.fields.some((f) => f.required);
  const fields = order.delivery?.fields.filter((f) => f.required) || [];
  const filledProgress = !fields.length ? 1 : fields.filter((f) => order.delivery.values?.[f.key]).length / fields.length;
  const { status, state } = order;
  const confirmation = state === T.IN_PROGRESS && (status === S.WAIT_SCREENSHOTS || status === S.CONFIRM_DELIVERY);
  const searching = !order.boosterAssigned && !unfilled;
  const inProgress = og ? !unfilled && ((service && !!order.boosterAssigned) || (currency && !unfilled)) : state === T.IN_PROGRESS && (status === S.IN_PROGRESS || isKYC(status));
  const delayed = isDelayed(order, now);
  const part = durationPart({ startedAt: order.acceptedAt, duration: order.duration, frozenAt: order.frozenAt, resumedAt: order.resumedAt }, now);
  const ready = ![S.NEW, S.SELLER_RECEIVED].includes(status);   // the clock of the step only means something once the work has started
  let inProgressValue = Number.isNaN(part) ? 0 : part;
  if (isPaused(status, state) || confirmation || delayed) inProgressValue = 1;
  const all = [
    { name: 'placed', title: 'Placed', value: 1, active: true, visible: !og },
    { name: 'addDeliveryDetails', title: 'Add delivery details', value: filledProgress, active: true, visible: og },
    { name: 'searchingForBooster', title: 'Searching for booster', value: searching ? 1 : 0, active: searching, visible: service && og },
    { name: 'inProgress', title: 'In progress', value: inProgress && ready && ARBITRATABLE.includes(status) ? inProgressValue : 0, active: inProgress, visible: true },
    { name: 'confirmation', title: 'Confirmation', value: confirmation ? 1 : 0, active: confirmation, visible: true },
  ];
  const steps = [];
  for (const step of [...all].reverse()) {
    if (!step.visible) continue;
    const s = { ...step };
    const next = steps[0];
    if (next && (next.value === 1 || next.active)) { s.active = true; s.value = 1; }
    steps.unshift(s);
  }
  const current = [...steps].reverse().find((s) => s.active)?.name ?? '';
  return { steps: steps.map(({ name, title, value, active }) => ({ name, title, value, active })), current };
};
/**
 * What the page draws above the status (the real service, StatePanel): while the order is new or in progress, the steps and after them "Completed" (not reached); a completed order has none; a failed or cancelled one is a
 * red bar; one in arbitration or pending is an orange bar.
 */
export const orderTimeline = (order, now) => {
  const { state } = order;
  if (state === T.NEW || state === T.IN_PROGRESS) {
    const { steps, current } = orderSteps(order, now);
    return { kind: 'steps', steps: [...steps, { name: 'completed', title: 'Completed', value: 0, active: false }], current };
  }
  if (state === T.COMPLETED) return null;   // a completed order has no progress (the real service draws one full bar; the example does not)
  if ([T.FAILED, T.CANCELLED].includes(state)) return { kind: 'bar', tone: 'error' };
  if ([T.ARBITRAGE, T.PENDING].includes(state)) return { kind: 'bar', tone: 'warning' };
  return null;
};
/**
 * How each step of the timeline looks: `done` (passed, a dimmed white bar with a check), `current` (the stage the order is at, green), `run` (the stage where the work goes on, green with a moving light: searching for a booster, in progress), `problem` (the
 * stage the order is stuck at: a pause or a delay, yellow, on that stage only) and `todo` (not reached, empty). Bars (a failed, a cancelled order) and an order with no timeline come out as they are.
 */
export const stepLooks = (order, now) => {
  const line = orderTimeline(order, now);
  if (!line || line.kind !== 'steps') return line;
  const problem = progressTone(order, now) === 'warning';
  const steps = line.steps.map((s) => {
    let look = 'todo';
    if (s.name === line.current) look = problem ? 'problem' : ['searchingForBooster', 'inProgress'].includes(s.name) ? 'run' : 'current';
    else if (s.active) look = 'done';
    return { ...s, look };
  });
  return { ...line, steps };
};
const ARBITRATABLE = [S.IN_PROGRESS, S.WAIT_SCREENSHOTS, S.CONFIRM_DELIVERY, S.KYC_LOCK, S.KYC_WATCH];

/** The color of the timeline: red for an order that failed, orange for one that waits, green for the rest; an order in progress that is late is orange. */
export const progressTone = (order, now) => {
  const state = order.state;
  if ([T.CANCELLED, T.FAILED].includes(state)) return 'error';
  if ([T.PENDING, T.ARBITRAGE].includes(state) || isPaused(order.status, state)) return 'warning';
  if ([T.NEW, T.COMPLETED, T.IN_PROGRESS].includes(state)) return isDelayed(order, now) ? 'warning' : 'success';
  return 'success';
};

// ---- the buttons of the buyer ----

/**
 * The buttons of the buyer under the status, in the order of the real service. The first one is the main one, the others are secondary. A buyer whose order is on a KYC watch has none.
 * `confirm` is locked for 30 minutes after the order was placed (with a hint) while the order is in progress.
 */
export const buyerActions = (order, now) => {
  const { status } = order;
  if (status === S.KYC_WATCH) return [];
  const out = [];
  if (status === S.IN_PROGRESS || status === S.CONFIRM_DELIVERY) {
    const locked = status === S.IN_PROGRESS && confirmLockLeft(order.createdAt, now) > 0;
    out.push({ id: 'confirm', label: 'Confirm Order Completion', disabled: locked, hint: locked ? 'Confirmation is available 30 minutes after placing the order and submitting the delivery details' : undefined });
  }
  if (status === S.UNDER_REVIEW || status === S.RESOLVED || status === S.REFUNDED) out.push({ id: 'ticket', label: 'Arbitrage ticket' });
  if (status === S.COMPLETED || status === S.RESOLVED || status === S.WAIT_SCREENSHOTS) out.push({ id: 'repeat', label: 'Repeat order' });
  if (status === S.IN_PROGRESS || status === S.CONFIRM_DELIVERY) out.push({ id: 'help', label: 'I need help' });
  if (!order.og && (status === S.NEW || status === S.SELLER_RECEIVED)) out.push({ id: 'cancel', label: 'Cancel order' });
  if (status === S.CANCELLED || status === S.REJECTED) out.push({ id: 'similar', label: 'View similar offers' });
  return out.map((a, i) => ({ ...a, variant: i === 0 ? 'primary' : 'secondary' }));
};

/** The blocks under the status that belong to the status: the review and the tips once the order is done, the Discord panel while it is open and the buyer has not joined. */
export const showReview = (order) => order.status === S.COMPLETED || order.status === S.WAIT_SCREENSHOTS;
export const showJoinPanel = (joinedDiscord, order) => !joinedDiscord && !isClosed(order.status);
/** The review and the tips go above the chat once the order is completed. */
export const reviewFirst = (order) => showReview(order);

// ---- the delivery details ----

export const hasUnfilledDelivery = (order) => !!order.delivery && order.delivery.fields.some((f) => f.required && !order.delivery.values?.[f.key]);
export const deliveryErrors = (fields, values) => Object.fromEntries(fields.filter((f) => f.required && !String(values[f.key] ?? '').trim()).map((f) => [f.key, 'Fill in the field']));

// ---- the review ----

export const MIN_REVIEW = 5;
export const MAX_REVIEW = 255;
export const PERFECT_RATE = 5;
export const reviewError = (text) => (text.length > 0 && text.length < MIN_REVIEW ? 'Please write at least 5 characters' : text.length > MAX_REVIEW ? 'Review must be 255 characters or less' : '');
/** A review needs a rate and a text of the right length, or a rate alone (the text is optional). */
export const reviewReady = (rate, text) => rate >= 1 && !reviewError(text);
/** The real service asks for a Trustpilot review only when the buyer gave the top rate. */
export const askTrustpilot = (rate) => rate === PERFECT_RATE;

// ---- the result page of a payment ----

/** The words of the result page by the result (`success`, `error`, `check`, `warning`), for one order or for several. A paid order whose buyer has not joined the Discord server gets the Discord version. */
export const resultView = (result, { single = false, joinedDiscord = true } = {}) => {
  const discord = result === 'success' && !joinedDiscord;
  const R = {
    success: { overline: 'payment completed', title: single ? 'Order is placed' : 'Orders are Placed', text: 'You have successfully placed your order.' },
    error: { overline: 'payment failed', title: 'Something went wrong', text: 'Please try a different payment method.' },
    warning: { overline: 'payment failed', title: 'Something went wrong', text: 'Please try a different payment method.' },
    check: { overline: 'HOLD ON FOR A FEW MOMENTS', title: single ? 'We\'re verifying your payment' : 'Verifying your payment...', text: 'Please allow the payment provider some time to confirm your payment. It usually takes no more than 3 minutes.\n\nIn rare cases, it may take up to 15 min for them to confirm. If you experience a longer delay, please contact Overgear Support.' },
  }[result] || null;
  if (!R) return null;
  const view = { status: result, overline: R.overline, title: R.title, text: noFinalPeriod(R.text), note: '', buttons: [] };
  if (discord) {
    view.title = 'Thank you for your order!';
    view.text = 'Please join our Discord server for faster communication with our team and get access to secret deals available to our Discord members only!';
    view.note = 'Now you can access secret deals on our strictly anonymous server';
    view.buttons = [{ id: 'discord', label: 'Join Discord', variant: 'primary', external: true }, { id: 'view', label: single ? 'View the order' : 'View "My orders"', variant: 'secondary' }];
  } else if (result === 'success') {
    view.buttons = [{ id: 'view', label: single ? 'View the order' : 'View "My orders"', variant: 'primary' }];
    if (single) view.text = 'You have successfully placed your order';
  } else if (result === 'error') {
    view.buttons = [{ id: 'again', label: 'Try Again', variant: 'primary' }, { id: 'home', label: 'Back to Overgear', variant: 'secondary' }];
  }
  return view;
};

/** What a payment method does in the example (the real service asks its payment provider): most pay at once, one is verified by the provider first, one is declined. */
export const PAYMENT_OUTCOME = { card: 'success', apple: 'success', google: 'success', klarna: 'success', neteller: 'error', paypal: 'check', crypto: 'check', balance: 'success' };
export const outcomeOf = (method) => PAYMENT_OUTCOME[method] || 'success';
/** A payment under verification settles after a while (the real page asks the provider every 3 seconds, with no end). */
export const POLL_MS = 3000;

// ---- the list ----

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** The date of a card of the list: "9 Jun, 4:05", no leading zero on the hour and no time zone (as the real service writes it). */
export const cardDate = (ms) => {
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};
/** "12 orders", "1 order". */
export const ordersCount = (n) => `${n} order${n === 1 ? '' : 's'}`;


export const PAGE_SIZE = 20;
export const STATE_FILTERS = [
  { value: 'all', label: 'All states' },
  { value: T.NEW, label: 'New' },
  { value: T.IN_PROGRESS, label: 'In progress' },
  { value: T.PENDING, label: 'Pending' },
  { value: T.ARBITRAGE, label: 'In dispute' },
  { value: T.COMPLETED, label: 'Completed' },
  { value: T.CANCELLED, label: 'Cancelled' },
  { value: T.FAILED, label: 'Failed' },
];
/** The status filter: every status the backend has (the two paused ones are told apart: the list needs two names for two options). */
export const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  ...Object.values(S).map((value) => ({ value, label: value === S.ORDER_PAUSED_NEW ? 'Paused (new)' : value === S.ORDER_PAUSED_IN_PROGRESS ? 'Paused (in progress)' : statusLabel(value) })),
];
/** The game filter: the games the buyer has orders in, the one with more orders first. `nameOf(slug)` gives the title of a game. */
export const gameFilters = (orders, nameOf) => {
  const count = new Map();
  for (const o of orders) count.set(o.game, (count.get(o.game) || 0) + 1);
  const games = [...count.entries()].sort((a, b) => b[1] - a[1] || String(nameOf(a[0])).localeCompare(String(nameOf(b[0])))).map(([value]) => ({ value, label: nameOf(value) || value }));
  return [{ value: 'all', label: 'All games' }, ...games];
};
export const SORTS = [
  { value: 'new', label: 'Newest first' },
  { value: 'old', label: 'Oldest first' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'eta', label: 'Delivery time' },
];
/** The three filters of the list work together: a game, a state and a status, each one or none (`all`). A filter that is not given is not applied; a string is the state (the way it was). */
export const filterOrders = (orders, filters) => {
  const { game, state, status } = typeof filters === 'string' ? { state: filters } : filters || {};
  return orders.filter((o) => (!game || game === 'all' || o.game === game)
    && (!state || state === 'all' || normalizeOrderState(o.state) === normalizeOrderState(state))
    && (!status || status === 'all' || o.status === status));
};
export const sortOrders = (orders, sort) => {
  const by = { new: (a, b) => b.createdAt - a.createdAt, old: (a, b) => a.createdAt - b.createdAt, 'price-high': (a, b) => b.price - a.price, 'price-low': (a, b) => a.price - b.price, eta: (a, b) => (a.duration || 0) - (b.duration || 0) }[sort] || ((a, b) => b.createdAt - a.createdAt);
  return [...orders].sort(by);
};
/** A page of the list: with `cumulative` everything up to the page (an endless scroll asks for the next page as the end comes into view), without it one numbered page. */
export const pageOf = (orders, page, cumulative) => {
  const totalPages = Math.max(Math.ceil(orders.length / PAGE_SIZE), 1);
  const at = Math.min(Math.max(page, 1), totalPages);
  return { nodes: orders.slice(cumulative ? 0 : (at - 1) * PAGE_SIZE, at * PAGE_SIZE), page: at, totalPages, total: orders.length };
};
/** What the list shows: a temporary (guest) account has no history; otherwise loading, an error, an empty list or the list. */
export const listState = ({ temporary, loading, error, count }) => (temporary ? 'temporary' : error ? 'error' : loading ? 'loading' : count === 0 ? 'empty' : 'list');

// ---- the orders of a payment ----

/** The orders a payment makes: one for each line of the cart (the real service makes an order for each product). A single order opens its own page, several open the result page. */
export const ordersFromCart = (cart, { now, seed = 0, method = 'card', fee = 0, discountRate = 0, email = '', userId = 'me', delivery }) =>
  cart.map((line, i) => {
    const n = 170000 + ((seed + i * 7919) % 90000);
    const price = +(line.price * line.qty * (1 - discountRate)).toFixed(2);
    const productType = line.productType || (/gold/i.test(line.title) ? 'currency' : 'service');
    return {
      link: `${1201 + (i % 7)}_${n}`,
      id: `${n}`,
      title: line.title,
      sub: line.sub || '',
      offerId: line.id,
      game: line.game || 'wow',
      productType,
      og: true,
      qty: line.qty,
      price: +(price + (i === 0 ? fee : 0)).toFixed(2),
      currency: 'USD',
      image: line.image,
      status: S.NEW,
      state: T.NEW,
      createdAt: now,
      statusAt: now,
      acceptedAt: null,
      deliveredAt: null,
      completedAt: null,
      duration: etaSeconds(line.eta),
      boosterAssigned: false,
      method,
      email,
      userId,
      seller: { id: 'overgear', name: 'Overgear', online: true },
      region: 'EU',
      delivery: delivery ? { fields: typeof delivery === 'function' ? delivery(line) : delivery, values: {}, filled: false } : null,
      files: [],
      review: null,
      tip: null,
      ticket: null,
      messages: [],
    };
  });

/** "3 hours", "1 day", "15 minutes" to seconds; an offer without a time gets two hours. */
export const etaSeconds = (text) => {
  const m = /(\d+)\s*(minute|hour|day)/i.exec(text || '');
  if (!m) return 2 * 3600;
  return +m[1] * { minute: 60, hour: 3600, day: 86400 }[m[2].toLowerCase()];
};

// ---- the work of a seller (what moves an order on) ----

/**
 * What can happen next to an order that the example lets you play: the seller, the payment, the support. Each event is { id, label, who, to } and `apply` gives the order after it. The buyer's own moves (confirm,
 * cancel, a dispute) are not here: the page makes them.
 */
export const nextEvents = (order, now) => {
  const events = eventsOf(order, now);
  // the seller does not start before the buyer has given the delivery details: until then the order waits (the page tells it)
  return hasUnfilledDelivery(order) ? events.filter((e) => !['view', 'accept'].includes(e.id)) : events;
};
const eventsOf = (order, now) => {
  const { status } = order;
  const e = (id, label, who) => ({ id, label, who });
  switch (status) {
    case S.NEW: return [e('view', 'The seller opens the order', 'seller'), e('reject', 'The seller rejects the order', 'seller'), e('error', 'The order fails', 'system')];
    case S.SELLER_RECEIVED: return [e('accept', 'The seller accepts the order', 'seller'), e('reject', 'The seller rejects the order', 'seller')];
    case S.IN_PROGRESS: return [e('deliver', 'The seller reports the delivery', 'seller'), e('late', isDelayed(order, now) ? 'The time is over (now)' : 'The time of the order runs out', 'time'), e('pause', 'The order is put on a verification watch', 'support')];
    case S.KYC_WATCH: case S.ORDER_PAUSED_IN_PROGRESS: return [e('resume', 'The verification ends, the order goes on', 'support')];
    case S.CONFIRM_DELIVERY: return [e('auto', '72 hours pass with no confirmation', 'time')];
    case S.UNDER_REVIEW: return [e('seller-wins', 'Support decides for the seller', 'support'), e('refund', 'Support decides for the buyer: a refund', 'support')];
    default: return [];
  }
};
const move = (order, status, now, extra = {}) => ({ ...order, status, state: stateOfStatus(status), statusAt: now, ...extra });
/** The order after an event (see nextEvents). */
export const applyEvent = (order, id, now) => {
  switch (id) {
    case 'view': return move(order, S.SELLER_RECEIVED, now);
    case 'reject': return move(order, S.REJECTED, now);
    case 'error': return move(order, S.ERROR, now);
    // the demo shortens the time of the work (at most 2 minutes), so the bar of "In progress" moves while you watch
    case 'accept': return move(order, S.IN_PROGRESS, now, { acceptedAt: now, boosterAssigned: true, duration: Math.min(order.duration, 120) });
    case 'deliver': return move(order, S.CONFIRM_DELIVERY, now, { deliveredAt: now, files: order.files.length ? order.files : ['proof-1', 'proof-2'] });
    case 'late': return { ...order, acceptedAt: now - order.duration * 1000 - 1000, frozenAt: null, resumedAt: null };
    case 'pause': return move(order, S.KYC_WATCH, now, { frozenAt: now, resumedAt: null });
    case 'resume': return move(order, S.IN_PROGRESS, now, { resumedAt: now });
    case 'auto': return move(order, S.COMPLETED, now, { completedAt: now });
    case 'seller-wins': return move(order, S.RESOLVED, now, { completedAt: now });
    case 'refund': return move(order, S.REFUNDED, now);
    default: return order;
  }
};
/** The buyer's own moves. */
export const confirmDelivery = (order, now) => move(order, S.COMPLETED, now, { completedAt: now });
export const cancelOrder = (order, now) => move(order, S.CANCELLED, now);
export const openDispute = (order, now, text) => move(order, S.UNDER_REVIEW, now, { ticket: { text: String(text || '').trim(), at: now } });
export const fillDelivery = (order, values) => ({ ...order, delivery: { ...order.delivery, values, filled: true }, boosterAssigned: order.boosterAssigned });
export const addReview = (order, rate, text, now) => ({ ...order, review: { rate, text: text.trim(), at: now } });
export const addTip = (order, amount) => ({ ...order, tip: amount });

/** An order of a browser that kept the older shape ({ id, date, status: 'Completed', items, total }) becomes an order of this one. */
export const normalizeOrder = (o, seed = 0) => {
  if (o && o.link && o.status && String(o.status).startsWith('status/')) return o;
  const first = (o.items || [])[0] || {};
  const done = o.status === 'Completed';
  const status = done ? S.COMPLETED : S.NEW;
  const n = 170000 + (seed % 90000);
  return {
    link: `1201_${n}`, id: String(n), title: first.title || 'Order', sub: '', offerId: undefined, game: 'wow', productType: 'service', og: true, qty: first.qty || 1,
    price: o.total ?? first.price ?? 0, currency: 'USD', image: undefined, status, state: stateOfStatus(status), createdAt: o.date || 0, statusAt: o.date || 0, acceptedAt: null, deliveredAt: null,
    completedAt: done ? o.date : null, duration: 7200, boosterAssigned: done, method: 'card', email: '', userId: 'me', seller: { id: 'overgear', name: 'Overgear', online: true }, region: 'EU', delivery: null, files: [], review: null, tip: null, ticket: null, messages: [],
  };
};
