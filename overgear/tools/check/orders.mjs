#!/usr/bin/env node
// The orders after the purchase, in a real browser, against the rules of the real service (example/order-core.js):
//  - the list: 20 cards at a time with an endless scroll (on a desktop and on a phone), the filter by the state and the sort, and the states of the list (loading, an error with a retry, empty, a guest account);
//  - the page of an order: for each status the words, the tint, the steps and the buttons of the buyer are the ones the rules give; the flows: confirm a delivery (with the warning), cancel, a dispute, the delivery details,
//    the review (and Trustpilot after the top rate), the tips, the Discord panel, and what happens next;
//  - the way there: a payment makes an order for each line; one opens its own page, several open the result page; a declined payment, a payment that is verified, a guest buyer; and "View My orders".
//
//   node overgear/tools/check/orders.mjs http://localhost:8000
import { launch, ready } from '../../../tools/lib/sweep.mjs';
import { ORDER_STATUS as S, buyerActions, orderTimeline, panelTone, statusText, STATE_FILTERS, PAGE_SIZE, filterOrders, sortOrders, statusLabel } from '../../example/order-core.js';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const APP = `${base}/overgear/example/index.html`;
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const expectThat = (ok, what) => { if (!ok) problems.push(what); };

/** A buyer who is signed in (or a guest, or nobody): the app starts, then its stored state is made from the seed of the orders and what the test asks for. */
const open = async (width, patch = {}) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 500, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  await page.goto(`${APP}#/`);
  await ready(page, 0);
  await page.evaluate(async (patch) => {
    const { seedOrders } = await import('/overgear/example/order-seed.js');
    const { WALLET_START } = await import('/overgear/example/wallet-core.js');
    const state = { cart: [], wishlist: [], orders: seedOrders(Date.now()), user: { name: 'Dana', email: 'dana@example.com' }, temp: null, discord: false, pending: null, promo: '', wallet: WALLET_START, ...patch };
    localStorage.setItem('baseui-overgear', JSON.stringify(state));
  }, patch);
  return page;
};
const visit = async (page, hash) => { await page.goto(`${APP}#${hash}`); await page.reload(); await ready(page, 100); };
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('baseui-overgear')));
const hashOf = (page) => page.evaluate(() => location.hash);
const line = (key, title, price, eta = '3 hours') => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta });
const text = (page, id) => page.locator(`[data-test-id="${id}"]`).first().textContent().then((t) => t.trim()).catch(() => null);
const choose = async (page, index, option) => { await page.getByRole('combobox').nth(index).click(); await page.waitForTimeout(250); await page.getByRole('option', { name: option, exact: true }).first().click(); await page.waitForTimeout(350); };

// ---------------------------------------------------------------- the list
// the parts below are independent (each opens its own context), so they run at the same time
const blocks = [];
blocks.push(async () => {
  const page = await open(1440);
  const orders = (await stored(page)).orders;
  await visit(page, '/orders');
  const cards = () => page.locator('[data-test-id="order-card"]').count();
  expectThat((await page.locator('[data-test-id="orders-count"]').textContent()) === String(orders.length), `the title does not say how many orders there are (${orders.length})`);
  expectThat((await cards()) === PAGE_SIZE, `desktop: the first page has ${await cards()} cards, not ${PAGE_SIZE}`);
  const first = await page.evaluate(() => ({ title: document.querySelector('[data-test-id="order-card-title"]').textContent, status: document.querySelector('[data-test-id="order-card-status"]').textContent, href: document.querySelector('[data-test-id="order-card"] a, a[data-test-id="order-card"]')?.getAttribute('href') || document.querySelector('[data-test-id="order-card"]').querySelector('a')?.getAttribute('href') }));
  const newest = sortOrders(orders, 'new')[0];
  expectThat(first.title === newest.title && first.status === statusLabel(newest.status), `the first card is not the newest order (${first.title} / ${first.status})`);
  expectThat(!!first.href && first.href.includes(newest.link), `the card does not open its order (${first.href})`);
  expectThat((await page.getByRole('navigation', { name: 'Pagination' }).count()) === 0, 'desktop: there are numbered pages (the list scrolls without end instead)');
  await page.locator('[data-test-id="orders-end"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  expectThat((await cards()) === orders.length, `desktop: the scroll shows ${await cards()} cards, not all ${orders.length}`);
  expectThat((await page.locator('[data-test-id="orders-end"]').count()) === 0, 'desktop: the end of the list is still watched when every order is shown');
  // the filters: a game, a state and a status, which work together
  await visit(page, '/orders');
  const idx = { game: 1, state: 2, status: 3, sort: 4 };
  const shown = () => page.evaluate(() => [...document.querySelectorAll('[data-test-id="order-card"]')].map((c) => ({ game: c.querySelector('[data-test-id="order-card-game"] span').textContent, status: c.querySelector('[data-test-id="order-card-status"]').textContent })));
  await choose(page, idx.game, 'Diablo 4');
  const d4 = orders.filter((o) => o.game === 'diablo-4');
  expectThat((await cards()) === Math.min(d4.length, PAGE_SIZE) && (await shown()).every((c) => c.game === 'Diablo 4'), `the filter by the game "Diablo 4" shows ${await cards()} cards, not the ${d4.length} orders of the game`);
  expectThat((await page.locator('[data-test-id="orders-count"]').textContent()) === String(d4.length), 'the count does not follow the filter by the game');
  await choose(page, idx.state, 'Cancelled');
  const d4c = filterOrders(orders, { game: 'diablo-4', state: STATE_FILTERS.find((f) => f.label === 'Cancelled').value });
  expectThat((await cards()) === d4c.length, `a game and a state together show ${await cards()} cards, not ${d4c.length}`);
  await choose(page, idx.status, 'Refunded');
  const d4r = filterOrders(orders, { game: 'diablo-4', state: STATE_FILTERS.find((f) => f.label === 'Cancelled').value, status: S.REFUNDED });
  expectThat((await cards()) === d4r.length && (await shown()).every((c) => c.status === 'Refunded'), `a game, a state and a status together show ${await cards()} cards, not ${d4r.length}`);
  await choose(page, idx.game, 'Torchlight: Infinite');
  expectThat((await page.locator('[data-test-id="orders-empty"]').count()) === 1 && (await page.getByText('No orders found').count()) === 1, 'filters that no order passes do not show "No orders found"');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.waitForTimeout(400);
  expectThat((await cards()) === PAGE_SIZE, 'Reset filters does not bring the list back');
  await choose(page, idx.state, 'Completed');
  const done = filterOrders(orders, STATE_FILTERS.find((f) => f.label === 'Completed').value).length;
  expectThat((await cards()) === Math.min(done, PAGE_SIZE), `the filter "Completed" shows ${await cards()} cards, not ${Math.min(done, PAGE_SIZE)}`);
  expectThat(await page.evaluate(() => [...document.querySelectorAll('[data-test-id="order-card-status"]')].every((b) => /Completed|Resolved/.test(b.textContent))), 'the filter "Completed" lets another status in');
  await choose(page, idx.sort, 'Price: high to low');
  const prices = await page.evaluate(() => [...document.querySelectorAll('[data-test-id="order-card-price"] strong')].map((s) => +s.textContent.replace('$', '')));
  expectThat(prices.every((p, i) => i === 0 || prices[i - 1] >= p), 'the sort "Price: high to low" does not sort by price');
  // the card has the picture of the order on the left, and Reorder is a secondary button
  await visit(page, '/orders');
  const card = await page.evaluate(() => { const c = document.querySelector('[data-test-id="order-card"]'); const pic = c.querySelector('.og-ocard__pic'); const title = c.querySelector('[data-test-id="order-card-title"]'); const re = c.querySelector('[data-test-id="order-card-reorder"]'); const pr = pic.getBoundingClientRect(); return { img: !!pic.querySelector('img'), square: Math.abs(pr.width - pr.height) < 1, left: pr.right <= title.getBoundingClientRect().left, variant: re.dataset.variant }; });
  expectThat(card.img && card.square && card.left, `the card has no square picture at the left of the info (${JSON.stringify(card)})`);
  expectThat(card.variant === 'secondary', `Reorder is not a secondary button (${card.variant})`);
  // the states of the list
  for (const [demo, id, label] of [['loading', 'orders-list-skeleton', 'loading'], ['error', 'orders-error', 'an error'], ['empty', 'orders-empty', 'empty'], ['temporary', 'orders-temporary', 'a guest account']]) {
    await visit(page, `/orders?demo=${demo}`);
    expectThat((await page.locator(`[data-test-id="${id}"]`).count()) === 1, `the list in the state "${label}" does not show it`);
  }
  await visit(page, '/orders?demo=error');
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.waitForTimeout(900);
  expectThat((await hashOf(page)) === '#/orders' && (await cards()) > 0, 'the retry of the list does not bring the list back');
  expectThat(!page.errors.length, `the list: errors ${page.errors.join('; ')}`);
  await page.context().close();
});
blocks.push(async () => {
  const page = await open(390);
  const total = (await stored(page)).orders.length;
  await visit(page, '/orders');
  const cards = () => page.locator('[data-test-id="order-card"]').count();
  expectThat((await cards()) === PAGE_SIZE && (await page.getByRole('navigation', { name: 'Pagination' }).count()) === 0, 'phone: the list does not start with a page of 20 cards or has numbered pages');
  await page.locator('[data-test-id="orders-end"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  expectThat((await cards()) === total, `phone: the scroll shows ${await cards()} cards, not all ${total}`);
  expectThat((await page.getByRole('button', { name: 'Show More' }).count()) === 0, 'phone: there is a Show More button');
  await page.context().close();
});
// a buyer who is not signed in, and a guest
blocks.push(async () => {
  const page = await open(1440, { user: null });
  await visit(page, '/orders');
  expectThat((await page.getByText('Sign in to see your orders').count()) === 1, 'a visitor who is not signed in does not get the sign-in prompt on the list');
  await page.context().close();
  const guest = await open(1440, { user: null, temp: { email: 'g@x.com' } });
  await visit(guest, '/orders');
  expectThat((await guest.getByText('Orders are not available for a temporary account').count()) === 1, 'a guest account does not read that it has no history');
  await guest.context().close();
});

// ---------------------------------------------------------------- the page of an order, status by status
blocks.push(async () => {
  const page = await open(1440);
  const orders = (await stored(page)).orders;
  const seen = new Set();
  for (const o of orders) {
    if (seen.has(o.status)) continue;
    seen.add(o.status);
    await visit(page, `/order/${o.link}`);
    const now = Date.now();
    const where = `${statusLabel(o.status)}`;
    const want = statusText(o, now);
    expectThat((await text(page, 'order-status-title')) === want.title, `${where}: the title of the status is "${await text(page, 'order-status-title')}", not "${want.title}"`);
    const tone = await page.locator('[data-test-id="order-status"]').getAttribute('data-tone');
    expectThat(tone === panelTone(o, now), `${where}: the tint is ${tone}, not ${panelTone(o, now)}`);
    const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="order-action-"]')].map((b) => b.getAttribute('data-test-id').replace('order-action-', '')));
    const wantIds = buyerActions(o, now).map((a) => a.id);
    expectThat(JSON.stringify(ids) === JSON.stringify(wantIds), `${where}: the buttons are ${ids.join(', ') || 'none'}, not ${wantIds.join(', ') || 'none'}`);
    const steps = await page.locator('[data-test-id^="order-step-"]').count();
    const line = orderTimeline(o, now);
    const wantSteps = line?.kind === 'steps' ? line.steps.length : 0;   // a completed order has none, a failed or cancelled one is one bar
    expectThat(steps === wantSteps, `${where}: ${steps} steps, not ${wantSteps}`);
    const bars = await page.evaluate(() => [...document.querySelectorAll('.og-osteps .bui-progress__track')].every((b) => b.getBoundingClientRect().width > 20));
    expectThat(bars, `${where}: the bars of the steps are not drawn`);
  }
  expectThat(seen.size >= 14, `the seed shows ${seen.size} statuses, not at least 14`);
  expectThat(!page.errors.length, `the page of an order: errors ${page.errors.join('; ')}`);
  await visit(page, '/order/none');
  expectThat((await page.getByText('Order not found').count()) === 1, 'an order that does not exist is not "Order not found"');
  await page.context().close();
});

// ---------------------------------------------------------------- the flows of the buyer
const find = (orders, status, og) => orders.find((o) => o.status === status && (og === undefined || !!o.og === og));
blocks.push(async () => {
  const page = await open(1440);
  const orders = (await stored(page)).orders;
  const click = async (id) => { await page.locator(`[data-test-id="${id}"]`).first().click(); await page.waitForTimeout(400); };
  const status = async (link) => (await stored(page)).orders.find((o) => o.link === link).status;

  // cancel: an order of a seller that has not started
  const sellerNew = find(orders, S.NEW, false);
  await visit(page, `/order/${sellerNew.link}`);
  await click('order-action-cancel');
  await click('order-cancel-yes');
  expectThat((await status(sellerNew.link)) === S.CANCELLED, 'cancel: the order is not cancelled');
  expectThat((await text(page, 'order-status-title')) === 'Order Canceled', 'cancel: the status does not read "Order Canceled"');
  expectThat((await page.locator('[data-test-id="order-action-similar"]').count()) === 1, 'cancel: no "View similar offers" after it');

  // the seller moves an order on: received, accepted, delivered; the buyer confirms, with the warning
  const moving = find(orders, S.SELLER_RECEIVED, false);
  await visit(page, `/order/${moving.link}`);
  for (const [event, label, title] of [['accept', 'In progress', 'In Progress'], ['deliver', 'Confirm delivery', 'Delivery Confirmation']]) {
    if (event === 'view') continue;   // the order of this flow was opened by the seller already
    await click(`order-event-${event}`);
    expectThat((await text(page, 'order-status-title')) === title, `the seller ${event}: the status does not read "${title}" (${await text(page, 'order-status-title')})`);
  }
  expectThat(!!(await text(page, 'order-auto-complete'))?.includes('72 hours'), 'a delivery that waits for the buyer does not say that it closes by itself in 72 hours');
  await click('order-action-confirm');
  expectThat(await page.locator('[data-test-id="order-confirm-yes"]').isDisabled(), 'confirm: the button is on before the warning is read');
  await page.getByRole('checkbox', { name: /I have read the warning/ }).check();
  await click('order-confirm-yes');
  expectThat((await status(moving.link)) === S.COMPLETED, 'confirm: the order is not completed');
  expectThat((await text(page, 'order-status-title')) === 'Order Completed', 'confirm: the status does not read "Order Completed"');
  // the review: a short text is refused, the top rate asks for Trustpilot, the review is shown and can be updated
  expectThat((await page.locator('[data-test-id="order-tips"]').count()) === 1 && (await page.locator('[data-test-id="order-tip"]').isEnabled()), 'the tips are not open after the completion');
  await click('order-rate');
  await page.getByRole('group', { name: 'Your rate' }).getByRole('button').nth(4).click();
  await page.locator('[data-test-id="order-review-text"] textarea, textarea[data-test-id="order-review-text"]').first().fill('abc');
  expectThat(await page.locator('[data-test-id="order-review-submit"]').isDisabled(), 'the review: a text of 3 characters is let through');
  await page.locator('[data-test-id="order-review-text"] textarea, textarea[data-test-id="order-review-text"]').first().fill('Fast and polite');
  expectThat(await page.locator('[data-test-id="order-review-submit"]').isEnabled(), 'the review: a right text does not enable the button');
  await click('order-review-submit');
  expectThat((await page.getByText('Rate us on Trustpilot').count()) === 1, 'the review: the top rate does not ask for Trustpilot');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  expectThat((await text(page, 'order-review-shown')) === 'Fast and polite', 'the review is not shown after it was sent');
  await click('order-tip');
  await click('order-tip-send');
  expectThat((await stored(page)).orders.find((o) => o.link === moving.link).tip > 0, 'the tips are not sent');

  // a dispute: "I need help", then the ticket
  const delivering = find(orders, S.CONFIRM_DELIVERY);
  await visit(page, `/order/${delivering.link}`);
  await click('order-action-help');
  await page.getByRole('textbox', { name: /What happened/ }).fill('The character is not the one I ordered');
  await click('order-help-submit');
  expectThat((await status(delivering.link)) === S.UNDER_REVIEW, 'the dispute: the order is not under review');
  expectThat((await text(page, 'order-status-title')) === 'Open Dispute', 'the dispute: the status does not read "Open Dispute"');
  await click('order-action-ticket');
  expectThat((await page.getByText('The character is not the one I ordered').count()) >= 1, 'the dispute: the ticket does not show what the buyer wrote');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await click('order-event-refund');
  expectThat((await text(page, 'order-status-title')) === 'Order Refunded', 'the dispute: the decision for the buyer does not read "Order Refunded"');

  // the delivery details: refused empty, saved when filled, the steps follow
  const unfilled = find(orders, S.NEW, true);
  await visit(page, `/order/${unfilled.link}`);
  await click('order-delivery-submit');
  expectThat((await page.getByText('Fill in the field').count()) >= 2, 'the delivery details: empty fields are let through');
  await page.getByRole('textbox', { name: 'Character name' }).fill('Thrall');
  await page.getByRole('textbox', { name: 'Realm' }).fill('Draenor');
  await page.locator('input[type="password"]').fill('secret');
  await click('order-delivery-submit');
  expectThat((await page.locator('[data-test-id="order-delivery-details"]').count()) === 1 && (await page.locator('[data-test-id="order-delivery-form"]').count()) === 0, 'the delivery details: the form stays after the details are sent');

  // the Discord panel: shown to a buyer who has not joined, gone when they join
  expectThat((await page.locator('[data-test-id="order-join"]').count()) === 1, 'the Discord panel is not shown to a buyer who has not joined');
  await click('order-join-button');
  expectThat((await page.locator('[data-test-id="order-join"]').count()) === 0 && (await stored(page)).discord === true, 'the Discord panel stays after the buyer joined');
  expectThat(!page.errors.length, `the flows: errors ${page.errors.join('; ')}`);
  await page.context().close();
});
// the steps and the tabs of a phone
blocks.push(async () => {
  const page = await open(390);
  const o = find((await stored(page)).orders, S.IN_PROGRESS, true);
  await visit(page, `/order/${o.link}`);
  expectThat((await page.getByRole('radio', { name: 'Chat' }).count()) + (await page.getByRole('tab', { name: 'Chat' }).count()) >= 1, 'phone: the page of an order has no Status and Chat tabs');
  const chatShown = async () => (await page.locator('[data-test-id="order-chat"]').count()) === 1;
  expectThat(!(await chatShown()), 'phone: the chat is shown on the Status tab');
  await page.getByText('Chat', { exact: true }).first().click();
  await page.waitForTimeout(300);
  expectThat(await chatShown(), 'phone: the Chat tab does not show the chat');
  expectThat(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'phone: the page of an order scrolls sideways');
  await page.context().close();
});

// ---------------------------------------------------------------- the way there: a payment
const pay = async (page, method) => {
  await visit(page, '/checkout');
  if (method && method !== 'card') await page.getByRole('radio', { name: new RegExp(method, 'i') }).first().check({ force: true }).catch(async () => { await page.getByText(new RegExp(`^${method}$`, 'i')).first().click(); });
  await page.waitForTimeout(200);
  await page.locator('.og-sticky .bui-button[data-variant="primary"]').first().click();
};
blocks.push(async () => {
  // one line: one order, which opens its own page
  const page = await open(1440, { cart: [line('a', 'Venomous Abyss Heroic', 89)] });
  const before = (await stored(page)).orders.length;
  await pay(page, 'card');
  await page.waitForTimeout(1500);
  const after = await stored(page);
  expectThat(after.orders.length === before + 1 && after.cart.length === 0, `a payment of one line makes ${after.orders.length - before} orders and leaves ${after.cart.length} lines in the cart`);
  expectThat(/^#\/order\/\d+_\d+/.test(await hashOf(page)), `a payment of one line does not open its order (${await hashOf(page)})`);
  expectThat(after.orders[0].status === S.NEW && after.orders[0].delivery && !after.orders[0].delivery.filled, 'the new order is not "New", waiting for the delivery details');
  await page.context().close();
});
blocks.push(async () => {
  // two lines: two orders and the result page, which leads to the list
  const page = await open(1440, { cart: [line('a', 'Venomous Abyss Heroic', 89), line('b', 'Mythic+ Bundle', 149)] });
  const before = (await stored(page)).orders.length;
  await pay(page, 'card');
  await page.waitForTimeout(1200);
  expectThat((await hashOf(page)).startsWith('#/checkout/result/success') && !(await hashOf(page)).includes('orderLink'), `a payment of two lines does not open the result page (${await hashOf(page)})`);
  expectThat((await text(page, 'checkout-result-title')) === null && !!(await page.locator('[data-test-id="checkout-result"]').textContent()).includes('Thank you for your order'), 'the result page of a buyer who has not joined Discord is not the Discord version');
  expectThat((await stored(page)).orders.length === before + 2, 'a payment of two lines does not make two orders');
  await page.getByRole('button', { name: 'View "My orders"' }).click();
  await page.waitForTimeout(1400);
  expectThat((await hashOf(page)) === '#/orders', 'the button of the result page does not open the list');
  const top = await page.evaluate(() => [...document.querySelectorAll('[data-test-id="order-card-status"]')].slice(0, 2).map((s) => s.textContent));
  expectThat(top.join() === 'New,New', `the new orders are not the first two cards of the list (${top.join()})`);
  await page.context().close();
});
blocks.push(async () => {
  // a declined payment: the error page, Try Again, and the cart is still full
  const page = await open(1440, { cart: [line('a', 'Venomous Abyss Heroic', 89)] });
  await pay(page, 'neteller');
  await page.waitForTimeout(1000);
  expectThat((await hashOf(page)) === '#/checkout/result/error', `a declined payment does not open the error page (${await hashOf(page)})`);
  expectThat((await page.locator('[data-test-id="checkout-result"]').textContent()).includes('Something went wrong'), 'the error page does not say that something went wrong');
  await page.getByRole('button', { name: 'Try Again' }).click();
  await page.waitForTimeout(800);
  expectThat((await hashOf(page)) === '#/checkout' && (await stored(page)).cart.length === 1, 'Try Again does not lead back to the checkout with the cart');
  await page.context().close();
});
blocks.push(async () => {
  // a payment that the provider verifies: the page waits, then goes on to the order
  const page = await open(1440, { cart: [line('a', 'Venomous Abyss Heroic', 89)] });
  const before = (await stored(page)).orders.length;
  await pay(page, 'paypal');
  await page.waitForTimeout(1200);
  expectThat((await hashOf(page)).startsWith('#/checkout/result/check'), `a payment to be verified does not open the waiting page (${await hashOf(page)})`);
  expectThat((await stored(page)).orders.length === before, 'the orders are made before the payment has settled');
  await page.waitForFunction(() => /#\/order\//.test(location.hash), null, { timeout: 15000 }).catch(() => {});
  expectThat(/#\/order\//.test(await hashOf(page)) && (await stored(page)).orders.length === before + 1, `the waiting page does not settle into an order (${await hashOf(page)})`);
  await page.context().close();
});
blocks.push(async () => {
  // a guest buyer: the order has its page, but the account has no history
  const page = await open(1440, { user: null, cart: [line('a', 'Venomous Abyss Heroic', 89)] });
  await visit(page, '/checkout');
  await page.getByRole('textbox', { name: 'Email' }).fill('guest@example.com');
  await page.locator('.og-sticky .bui-button[data-variant="primary"]').first().click();
  await page.waitForTimeout(1600);
  expectThat(/#\/order\//.test(await hashOf(page)), `a guest buyer's order does not open (${await hashOf(page)})`);
  await visit(page, '/orders');
  expectThat((await page.getByText('Orders are not available for a temporary account').count()) === 1, 'a guest buyer sees a history');
  await page.context().close();
});
blocks.push(async () => {
  // the result pages: the Discord version asks to join, and joining changes the page; the waiting page and the failure have no buttons of success
  const page = await open(1440);
  await visit(page, '/checkout/result/success');
  expectThat((await page.getByRole('button', { name: 'Join Discord' }).count()) === 1, 'the result page does not ask a buyer who has not joined to join Discord');
  await page.getByRole('button', { name: 'Join Discord' }).click();
  await page.waitForTimeout(500);
  expectThat((await page.getByRole('button', { name: 'Join Discord' }).count()) === 0 && (await page.getByText('Orders are Placed').count()) >= 1, 'the result page stays the Discord version after the buyer joined');
  await visit(page, '/checkout/result/check');
  expectThat((await page.getByRole('button').filter({ hasText: /View|Try Again/ }).count()) === 0, 'the waiting page has buttons');
  await visit(page, '/checkout/result/warning');
  expectThat((await page.getByText('Something went wrong').count()) >= 1, 'the failure page does not say that something went wrong');
  await page.context().close();
});

await Promise.all(blocks.map((b) => b()));
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nOrders: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Orders: the list, the page of an order for every status, the flows of the buyer and the way from the payment work as the real service has them.');
