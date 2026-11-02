// The kinds of offers, the second level of tabs of the listing on the home page: every offer has a label for its kind, and a game's kinds come in a known order.
import { describe, expect, test } from 'vitest';
import { OFFERS, SERVICES, kindLabel, kindsOf } from '../example/data.js';

describe('kinds of offers', () => {
  test('every offer of the example has a label for its kind', () => {
    for (const o of OFFERS) expect(kindLabel(o.service), `${o.id}: ${o.service}`).toBeTruthy();
  });

  test('the labels of the kinds of one game are different', () => {
    for (const game of new Set(OFFERS.map((o) => o.game))) {
      const labels = kindsOf(OFFERS.filter((o) => o.game === game)).map((k) => k.label);
      expect(new Set(labels).size, game).toBe(labels.length);
    }
  });

  test('the kinds of World of Warcraft come in the order of its services, once each', () => {
    const kinds = kindsOf(OFFERS.filter((o) => o.game === 'wow')).map((k) => k.id);
    expect(kinds.length).toBeGreaterThan(1);
    expect(new Set(kinds).size).toBe(kinds.length);
    const order = SERVICES.map((s) => s.id);
    expect(kinds).toEqual([...kinds].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  });

  test('the kinds of other games follow as they come, and a list without offers has none', () => {
    expect(kindsOf([{ service: 'rank' }, { service: 'coaching' }, { service: 'rank' }]).map((k) => k.id)).toEqual(['rank', 'coaching']);
    expect(kindsOf([])).toEqual([]);
  });
});
