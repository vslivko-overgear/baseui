import { describe, expect, test, it } from 'vitest';
import { AUTO_COMPLETE, CONFIRM_LOCK, ORDER_STATE, ORDER_STATUS as S, PAGE_SIZE, applyEvent, askTrustpilot, autoCompleteAt, buyerActions, cancelOrder, confirmDelivery, confirmLockLeft, durationPart, filterOrders, gameFilters, STATUS_FILTERS, isDelayed, isPaused, listState, nextEvents, normalizeOrder, openDispute, orderSteps, ordersFromCart, outcomeOf, pageOf, panelTone, progressTone, resultView, reviewError, reviewReady, showJoinPanel, sortOrders, stateOfStatus, statusBadge, statusText, tipsOpen, orderTimeline, stepLooks } from '../example/order-core.js';
import { seedOrders } from '../example/order-seed.js';

describe('order-core', () => {
  // The orders after the purchase: the rules of the real service, as the example has them (see example/order-core.js).
  const NOW = 1_700_000_000_000;
  const base = (over = {}) => ({ link: '1201_171172', status: S.NEW, state: ORDER_STATE.NEW, createdAt: NOW - 3_600_000, acceptedAt: null, duration: 7200, og: false, productType: 'service', price: 40, files: [], delivery: null, ...over });

  describe('the status of an order', () => {
    test('has the colors of the real service: blue, grey, green, orange, red', () => {
      expect([S.NEW, S.SELLER_RECEIVED, S.REFUNDED].map(statusBadge)).toEqual(['accent-light', 'accent-light', 'accent-light']);
      expect([S.CANCELLED, S.REJECTED].map(statusBadge)).toEqual(['secondary', 'secondary']);
      expect([S.COMPLETED, S.RESOLVED].map(statusBadge)).toEqual(['success-light', 'success-light']);
      expect([S.IN_PROGRESS, S.WAIT_SCREENSHOTS, S.CONFIRM_DELIVERY].map(statusBadge)).toEqual(['warning-light', 'warning-light', 'warning-light']);
      expect([S.ERROR, S.UNPAID, S.UNDER_REVIEW, S.KYC_LOCK].map(statusBadge)).toEqual(['critical-light', 'critical-light', 'critical-light', 'critical-light']);
    });
    test('belongs to a state, and the filter finds it with or without the prefix', () => {
      expect(stateOfStatus(S.CONFIRM_DELIVERY)).toBe(ORDER_STATE.IN_PROGRESS);
      expect(stateOfStatus(S.UNDER_REVIEW)).toBe(ORDER_STATE.ARBITRAGE);
      expect(stateOfStatus(S.REFUNDED)).toBe(ORDER_STATE.CANCELLED);
      const orders = [base({ state: 'COMPLETED' }), base({ state: ORDER_STATE.COMPLETED }), base({ state: ORDER_STATE.NEW })];
      expect(filterOrders(orders, ORDER_STATE.COMPLETED)).toHaveLength(2);
      expect(filterOrders(orders, 'all')).toHaveLength(3);
    });
    test('is paused on a hold, but not when a held order is in arbitration', () => {
      expect(isPaused(S.KYC_WATCH, ORDER_STATE.IN_PROGRESS)).toBe(true);
      expect(isPaused(S.KYC_LOCK, ORDER_STATE.ARBITRAGE)).toBe(false);
      expect(isPaused(S.IN_PROGRESS, ORDER_STATE.IN_PROGRESS)).toBe(false);
    });
  });

  describe('the clock of an order', () => {
    test('counts the time of the order with the time of a pause taken out', () => {
      const startedAt = NOW - 3_600_000;
      expect(durationPart({ startedAt, duration: 7200 }, NOW)).toBeCloseTo(0.5);
      // paused for the last 30 minutes: only 30 of the 60 minutes count
      expect(durationPart({ startedAt, duration: 7200, frozenAt: NOW - 1_800_000 }, NOW)).toBeCloseTo(0.25);
      expect(durationPart({ startedAt, duration: 7200, frozenAt: NOW - 1_800_000, resumedAt: NOW - 900_000 }, NOW)).toBeCloseTo(0.375);
      expect(durationPart({ startedAt: NOW - 99_999_999, duration: 7200 }, NOW)).toBe(1);
      expect(durationPart({ duration: 7200 }, NOW)).toBeNaN();
    });
    test('is late only when it is in progress and the time is over', () => {
      expect(isDelayed(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 8000_000 }), NOW)).toBe(true);
      expect(isDelayed(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 1000_000 }), NOW)).toBe(false);
      expect(isDelayed(base({ status: S.CONFIRM_DELIVERY, acceptedAt: NOW - 8000_000 }), NOW)).toBe(false);
    });
    test('locks the confirmation for 30 minutes and closes an unconfirmed delivery after 72 hours', () => {
      expect(confirmLockLeft(NOW - 10 * 60_000, NOW)).toBe(CONFIRM_LOCK - 10 * 60_000);
      expect(confirmLockLeft(NOW - 31 * 60_000, NOW)).toBe(0);
      expect(autoCompleteAt({ deliveredAt: NOW })).toBe(NOW + AUTO_COMPLETE);
      expect(tipsOpen({ status: S.COMPLETED, completedAt: NOW - 71 * 3_600_000 }, NOW)).toBe(true);
      expect(tipsOpen({ status: S.COMPLETED, completedAt: NOW - 73 * 3_600_000 }, NOW)).toBe(false);
    });
  });

  describe('what the buyer reads', () => {
    test('is the text of the status, and a delayed order reads "Delivery delayed"', () => {
      expect(statusText(base(), NOW).title).toBe('Order Placed');
      const shop = { og: true, productType: 'service', delivery: { filled: false, fields: [{ key: 'name', required: true }], values: {} } };
      expect(statusText(base(shop), NOW).title, 'the details are not filled').toBe('Add delivery details');
      expect(statusText(base({ ...shop, delivery: { filled: true, fields: [{ key: 'name', required: true }], values: { name: 'x' } } }), NOW).title, 'a booster is searched for').toBe('Searching for a booster');
      expect(statusText(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 1000_000 }), NOW).title).toBe('In Progress');
      expect(statusText(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 8000_000 }), NOW).title).toBe('Delivery delayed');
    });
    test('reads a wait for screenshots as completed, for the buyer', () => {
      expect(statusText(base({ status: S.WAIT_SCREENSHOTS }), NOW).title).toBe('Order Completed');
    });
    test('has a tint: green, orange, red, none', () => {
      expect(panelTone(base(), NOW)).toBe('success');
      expect(panelTone(base({ status: S.UNDER_REVIEW }), NOW)).toBe('warning');
      expect(panelTone(base({ status: S.CANCELLED }), NOW)).toBe('error');
      expect(panelTone(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 1000_000 }), NOW)).toBe('none');
      expect(panelTone(base({ status: S.IN_PROGRESS, acceptedAt: NOW - 8000_000 }), NOW)).toBe('warning');
    });
  });

  describe('the steps of an order', () => {
    test('of a seller of the marketplace are placed, in progress, confirmation', () => {
      const { steps, current } = orderSteps(base({ status: S.IN_PROGRESS, state: ORDER_STATE.IN_PROGRESS, acceptedAt: NOW - 3_600_000 }), NOW);
      expect(steps.map((s) => s.name)).toEqual(['placed', 'inProgress', 'confirmation']);
      expect(current).toBe('inProgress');
      expect(steps[1].value).toBeCloseTo(0.5);
    });
    test('of a shop of Overgear start with the delivery details and a service searches for a booster', () => {
      const order = base({ og: true, delivery: { fields: [{ key: 'a', required: true }, { key: 'b', required: true }], values: { a: 'x' }, filled: false } });
      const { steps } = orderSteps(order, NOW);
      expect(steps.map((s) => s.name)).toEqual(['addDeliveryDetails', 'inProgress', 'confirmation'].slice(0, 0).concat(['addDeliveryDetails', 'searchingForBooster', 'inProgress', 'confirmation']));
      expect(steps[0].value).toBe(0.5);
      const currency = orderSteps({ ...order, productType: 'currency' }, NOW).steps.map((s) => s.name);
      expect(currency).toEqual(['addDeliveryDetails', 'inProgress', 'confirmation']);
    });
    test('never has a hole: a step after a done one is done', () => {
      const order = base({ status: S.CONFIRM_DELIVERY, state: ORDER_STATE.IN_PROGRESS, acceptedAt: NOW - 1000_000 });
      const { steps, current } = orderSteps(order, NOW);
      expect(steps.every((s) => s.value === 1 && s.active)).toBe(true);
      expect(current).toBe('confirmation');
    });
    test('is red for an order that failed, orange for one that waits, green otherwise', () => {
      expect(progressTone(base({ state: ORDER_STATE.CANCELLED }), NOW)).toBe('error');
      expect(progressTone(base({ state: ORDER_STATE.ARBITRAGE, status: S.UNDER_REVIEW }), NOW)).toBe('warning');
      expect(progressTone(base(), NOW)).toBe('success');
    });
  });

  describe('the buttons of the buyer', () => {
    const ids = (o) => buyerActions(o, NOW).map((a) => a.id);
    test('follow the status, the first is the main one', () => {
      expect(ids(base({ status: S.NEW }))).toEqual(['cancel']);
      expect(ids(base({ status: S.NEW, og: true }))).toEqual([]);
      expect(ids(base({ status: S.CONFIRM_DELIVERY }))).toEqual(['confirm', 'help']);
      expect(ids(base({ status: S.COMPLETED }))).toEqual(['repeat']);
      expect(ids(base({ status: S.RESOLVED }))).toEqual(['ticket', 'repeat']);
      expect(ids(base({ status: S.UNDER_REVIEW }))).toEqual(['ticket']);
      expect(ids(base({ status: S.CANCELLED }))).toEqual(['similar']);
      expect(buyerActions(base({ status: S.CONFIRM_DELIVERY }), NOW).map((a) => a.variant)).toEqual(['primary', 'secondary']);
    });
    test('have none for an order on a KYC watch', () => {
      expect(ids(base({ status: S.KYC_WATCH }))).toEqual([]);
    });
    test('lock the confirmation of an order in progress for 30 minutes', () => {
      const early = buyerActions(base({ status: S.IN_PROGRESS, createdAt: NOW - 10 * 60_000 }), NOW)[0];
      expect(early.disabled).toBe(true);
      expect(early.hint).toMatch(/30 minutes/);
      expect(buyerActions(base({ status: S.IN_PROGRESS, createdAt: NOW - 40 * 60_000 }), NOW)[0].disabled).toBe(false);
      expect(buyerActions(base({ status: S.CONFIRM_DELIVERY, createdAt: NOW - 10 * 60_000 }), NOW)[0].disabled).toBe(false);
    });
  });

  describe('the result page of a payment', () => {
    test('has a title, a text and the buttons of its result', () => {
      expect(resultView('success', { single: false }).title).toBe('Orders are Placed');
      expect(resultView('success', { single: true }).title).toBe('Order is placed');
      expect(resultView('success').buttons.map((b) => b.label)).toEqual(['View "My orders"']);
      expect(resultView('success', { single: true }).buttons.map((b) => b.label)).toEqual(['View the order']);
      expect(resultView('error').buttons.map((b) => b.id)).toEqual(['again', 'home']);
      expect(resultView('check').buttons).toEqual([]);
      expect(resultView('warning').title).toBe('Something went wrong');
      expect(resultView('nonsense')).toBe(null);
    });
    test('asks to join the Discord server on a payment of a buyer who has not', () => {
      const v = resultView('success', { joinedDiscord: false });
      expect(v.title).toBe('Thank you for your order!');
      expect(v.buttons.map((b) => b.id)).toEqual(['discord', 'view']);
      expect(v.note).toMatch(/secret deals/);
      expect(resultView('error', { joinedDiscord: false }).buttons.map((b) => b.id)).toEqual(['again', 'home']);
    });
    test('depends on the payment method in the example', () => {
      expect(outcomeOf('card')).toBe('success');
      expect(outcomeOf('neteller')).toBe('error');
      expect(outcomeOf('paypal')).toBe('check');
    });
  });

  describe('the filters of the list', () => {
    const orders = [
      base({ link: 'a', game: 'wow', state: ORDER_STATE.COMPLETED, status: S.COMPLETED }),
      base({ link: 'b', game: 'wow', state: ORDER_STATE.IN_PROGRESS, status: S.IN_PROGRESS }),
      base({ link: 'c', game: 'diablo-4', state: ORDER_STATE.COMPLETED, status: S.COMPLETED }),
      base({ link: 'd', game: 'diablo-4', state: ORDER_STATE.CANCELLED, status: S.REFUNDED }),
      base({ link: 'e', game: 'diablo-4', state: ORDER_STATE.CANCELLED, status: S.CANCELLED }),
    ];
    const links = (f) => filterOrders(orders, f).map((o) => o.link).join('');
    test('are a game, a state and a status, each one or none', () => {
      expect(links({})).toBe('abcde');
      expect(links({ game: 'diablo-4' })).toBe('cde');
      expect(links({ state: ORDER_STATE.COMPLETED })).toBe('ac');
      expect(links({ status: S.REFUNDED })).toBe('d');
      expect(links({ game: 'all', state: 'all', status: 'all' })).toBe('abcde');
    });
    test('work together: an order has to pass all three', () => {
      expect(links({ game: 'diablo-4', state: ORDER_STATE.CANCELLED })).toBe('de');
      expect(links({ game: 'diablo-4', state: ORDER_STATE.CANCELLED, status: S.CANCELLED })).toBe('e');
      expect(links({ game: 'wow', state: ORDER_STATE.CANCELLED })).toBe('');
    });
    test('offer the games of the orders, the one with more orders first, and every status', () => {
      expect(gameFilters(orders, (g) => g.toUpperCase()).map((o) => o.value)).toEqual(['all', 'diablo-4', 'wow']);
      expect(STATUS_FILTERS).toHaveLength(Object.keys(S).length + 1);
      expect(new Set(STATUS_FILTERS.map((f) => f.label)).size).toBe(STATUS_FILTERS.length);
    });
  });

  describe('the list of orders', () => {
    const many = Array.from({ length: 45 }, (_, i) => base({ link: `l${i}`, createdAt: NOW - i * 1000, price: i }));
    test('sorts by the date, the price and the time', () => {
      expect(sortOrders(many, 'new')[0].link).toBe('l0');
      expect(sortOrders(many, 'old')[0].link).toBe('l44');
      expect(sortOrders(many, 'price-high')[0].price).toBe(44);
      expect(sortOrders(many, 'price-low')[0].price).toBe(0);
    });
    test('has pages of 20: one page on a desktop, everything up to it on a phone', () => {
      expect(PAGE_SIZE).toBe(20);
      expect(pageOf(many, 2, false)).toMatchObject({ page: 2, totalPages: 3, total: 45 });
      expect(pageOf(many, 2, false).nodes[0].link).toBe('l20');
      expect(pageOf(many, 2, true).nodes).toHaveLength(40);
      expect(pageOf(many, 99, false).page).toBe(3);
    });
    test('shows what the state is: temporary account, error, loading, empty or the list', () => {
      expect(listState({ temporary: true, loading: true, count: 5 })).toBe('temporary');
      expect(listState({ error: true, count: 5 })).toBe('error');
      expect(listState({ loading: true, count: 0 })).toBe('loading');
      expect(listState({ count: 0 })).toBe('empty');
      expect(listState({ count: 3 })).toBe('list');
    });
  });

  describe('the orders of a payment', () => {
    const cart = [{ id: 'a', title: 'A', price: 50, qty: 2, eta: '3 hours' }, { id: 'b', title: 'B', price: 20, qty: 1, eta: '1 day' }];
    test('are one for each line, and the discount and the fee are shared out', () => {
      const orders = ordersFromCart(cart, { now: NOW, seed: 5, fee: 1.47, discountRate: 0.1 });
      expect(orders).toHaveLength(2);
      expect(orders[0].price).toBeCloseTo(90 + 1.47);
      expect(orders[1].price).toBeCloseTo(18);
      expect(orders.every((o) => o.status === S.NEW && o.state === ORDER_STATE.NEW)).toBe(true);
      expect(orders[0].duration).toBe(3 * 3600);
      expect(orders[1].duration).toBe(86400);
      expect(new Set(orders.map((o) => o.link)).size).toBe(2);
    });
  });

  describe('what happens to an order', () => {
    test('moves on with the work of the seller, and ends in a status of its own', () => {
      let o = base({ og: false });
      const step = (id) => { o = applyEvent(o, id, NOW); return o; };
      expect(nextEvents(o, NOW).map((e) => e.id)).toEqual(['view', 'reject', 'error']);
      expect(step('view').status).toBe(S.SELLER_RECEIVED);
      expect(step('accept')).toMatchObject({ status: S.IN_PROGRESS, acceptedAt: NOW, boosterAssigned: true });
      expect(step('pause').status).toBe(S.KYC_WATCH);
      expect(nextEvents(o, NOW).map((e) => e.id)).toEqual(['resume']);
      expect(step('resume').status).toBe(S.IN_PROGRESS);
      expect(step('deliver')).toMatchObject({ status: S.CONFIRM_DELIVERY, deliveredAt: NOW });
      expect(step('auto')).toMatchObject({ status: S.COMPLETED, state: ORDER_STATE.COMPLETED });
      expect(nextEvents(o, NOW)).toEqual([]);
    });
    test('can be late: its time runs out', () => {
      const o = applyEvent(applyEvent(base(), 'accept', NOW), 'late', NOW);
      expect(isDelayed(o, NOW)).toBe(true);
    });
    test('goes through a dispute to a decision', () => {
      const disputed = openDispute(applyEvent(applyEvent(base(), 'accept', NOW), 'deliver', NOW), NOW, ' not as described ');
      expect(disputed).toMatchObject({ status: S.UNDER_REVIEW, state: ORDER_STATE.ARBITRAGE });
      expect(disputed.ticket.text).toBe('not as described');
      expect(applyEvent(disputed, 'seller-wins', NOW).status).toBe(S.RESOLVED);
      expect(applyEvent(disputed, 'refund', NOW).status).toBe(S.REFUNDED);
    });
    test('is closed by the buyer or cancelled', () => {
      expect(confirmDelivery(base({ status: S.CONFIRM_DELIVERY }), NOW).status).toBe(S.COMPLETED);
      expect(cancelOrder(base(), NOW)).toMatchObject({ status: S.CANCELLED, state: ORDER_STATE.CANCELLED });
    });
    test('of an older shape in a browser becomes an order of this shape', () => {
      const o = normalizeOrder({ id: 'OG-1', date: NOW, status: 'Completed', items: [{ title: 'Gold', qty: 2, price: 12 }], total: 24 }, 3);
      expect(o).toMatchObject({ status: S.COMPLETED, state: ORDER_STATE.COMPLETED, title: 'Gold', qty: 2, price: 24 });
      expect(normalizeOrder(o)).toBe(o);
    });
  });

  describe('the Discord panel', () => {
    test('is for a buyer who has not joined, on an order that is not closed', () => {
      expect(showJoinPanel(false, base({ status: S.IN_PROGRESS }))).toBe(true);
      expect(showJoinPanel(true, base({ status: S.IN_PROGRESS }))).toBe(false);
      expect(showJoinPanel(false, base({ status: S.COMPLETED }))).toBe(false);
      expect(showJoinPanel(false, base({ status: S.RESOLVED }))).toBe(false);
    });
  });

  describe('the review', () => {
    test('is a rate and a text of 5 to 255 characters, or a rate alone', () => {
      expect(reviewError('')).toBe('');
      expect(reviewError('abc')).toMatch(/at least 5/);
      expect(reviewError('x'.repeat(256))).toMatch(/255/);
      expect(reviewReady(0, '')).toBe(false);
      expect(reviewReady(4, '')).toBe(true);
      expect(reviewReady(4, 'abc')).toBe(false);
    });
    test('asks for Trustpilot only after the top rate', () => {
      expect(askTrustpilot(5)).toBe(true);
      expect(askTrustpilot(4)).toBe(false);
    });
  });
});

describe('order-timeline', () => {
  const now = Date.UTC(2026, 5, 1);
  const fresh = () => {
    const o = seedOrders(now).find((x) => x.og && x.productType === 'service' && x.status === S.NEW);
    return { ...o, delivery: { ...o.delivery, filled: true, values: Object.fromEntries((o.delivery?.fields || []).map((f) => [f.key, 'x'])) } };
  };
  const names = (line) => line.steps.filter((s) => s.active).map((s) => s.name);

  describe('orderTimeline', () => {
    it('waits at "searching for booster" until the seller accepts', () => {
      expect(names(orderTimeline(applyEvent(fresh(), 'view', now), now)).at(-1)).toBe('searchingForBooster');
    });
    it('moves the bar of "in progress" while the work goes (the demo shortens it to 2 minutes)', () => {
      const o = applyEvent(applyEvent(fresh(), 'view', now), 'accept', now);
      const mid = orderTimeline(o, now + 60000).steps.find((s) => s.name === 'inProgress');
      expect(mid.value).toBeCloseTo(0.5, 1);
    });
    it('reaches "confirmation" after the delivery, and has no progress at all when the buyer confirms', () => {
      const o = applyEvent(applyEvent(applyEvent(fresh(), 'view', now), 'accept', now), 'deliver', now + 1000);
      expect(names(orderTimeline(o, now + 2000)).at(-1)).toBe('confirmation');
      expect(orderTimeline(confirmDelivery(o, now + 3000), now + 4000)).toBeNull();
    });
    it('has the step "Completed" after the steps, not reached', () => {
      const last = orderTimeline(fresh(), now).steps.at(-1);
      expect(last).toMatchObject({ name: 'completed', value: 0, active: false });
    });
    it('colors the steps by their state: passed green, current white, working white and moving, a problem yellow on its stage only', () => {
      const looks = (line) => Object.fromEntries(line.steps.map((s) => [s.name, s.look]));
      const searching = applyEvent(fresh(), 'view', now);
      expect(looks(stepLooks(searching, now))).toMatchObject({ addDeliveryDetails: 'done', searchingForBooster: 'run', inProgress: 'todo', completed: 'todo' });
      const working = applyEvent(applyEvent(fresh(), 'view', now), 'accept', now);
      expect(looks(stepLooks(working, now + 1000))).toMatchObject({ searchingForBooster: 'done', inProgress: 'run', confirmation: 'todo' });
      const paused = applyEvent(working, 'pause', now + 2000);
      expect(looks(stepLooks(paused, now + 3000))).toMatchObject({ searchingForBooster: 'done', inProgress: 'problem', confirmation: 'todo' });
      const delivered = applyEvent(working, 'deliver', now + 4000);
      expect(looks(stepLooks(delivered, now + 5000))).toMatchObject({ inProgress: 'done', confirmation: 'current', completed: 'todo' });
    });
  });
});
