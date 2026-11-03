import { describe, it, expect } from 'vitest';
import { GRADES, spentLastYear, gradeFor, progressTo, rankHistory, rankLine } from '../example/rank-core.js';

const DAY = 864e5;
const now = Date.UTC(2026, 5, 1);
const done = (price, daysAgo) => ({ status: 'status/COMPLETED', price, createdAt: now - daysAgo * DAY });

describe('rank-core', () => {
  it('counts only completed orders of the last 365 days', () => {
    const orders = [done(100, 10), done(200, 400), { status: 'status/PAID', price: 50, createdAt: now - DAY }];
    expect(spentLastYear(orders, now)).toBe(100);
  });
  it('picks the highest reached rank', () => {
    expect(gradeFor(0).code).toBe('shield');
    expect(gradeFor(250).code).toBe('knight');
    expect(gradeFor(99999).code).toBe('legend');
  });
  it('shows the way to the next rank', () => {
    const p = progressTo(125, GRADES[0]);
    expect(p.left).toBe(125);
    expect(p.percentage).toBe(50);
    expect(progressTo(20000, GRADES[4]).isMax).toBe(true);
  });
  it('builds the history, newest first, with a fall back when old orders leave the year', () => {
    const h = rankHistory([done(300, 300)], now);
    expect(h.map((e) => e.grade.code)).toEqual(['shield', 'knight']);
  });
  it('writes the line of the account', () => {
    expect(rankLine(GRADES[1])).toBe('Rank: Knight');
  });
});
