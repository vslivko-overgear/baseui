import { describe, it, expect } from 'vitest';
import { orderTimeline, applyEvent, confirmDelivery, ORDER_STATUS as S } from '../example/order-core.js';
import { seedOrders } from '../example/order-seed.js';

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
  it('reaches "confirmation" after the delivery, and ends in one green bar when the buyer confirms', () => {
    const o = applyEvent(applyEvent(applyEvent(fresh(), 'view', now), 'accept', now), 'deliver', now + 1000);
    expect(names(orderTimeline(o, now + 2000)).at(-1)).toBe('confirmation');
    expect(orderTimeline(confirmDelivery(o, now + 3000), now + 4000)).toEqual({ kind: 'bar', tone: 'success' });
  });
  it('has the step "Completed" after the steps, not reached', () => {
    const last = orderTimeline(fresh(), now).steps.at(-1);
    expect(last).toMatchObject({ name: 'completed', value: 0, active: false });
  });
});
