// What the search of the header suggests: the order, the limits, the empty state, the recent searches, and that the suggestions and the page of results agree.
import { describe, expect, test } from 'vitest';
import { LIMITS, matchGames, matchOffers, popularGames, suggest, withRecent } from '../example/suggest.js';
import { GAMES, OFFERS, TILE_ROWS } from '../example/data.js';

describe('matching', () => {
  test('a name that starts with the text comes first, then one with a word that starts with it, then one that has it inside', () => {
    const games = [{ name: 'Cab' }, { name: 'Road Abc' }, { name: 'Abacus' }, { name: 'Zzz' }];
    expect(matchGames('ab', games).map((g) => g.name)).toEqual(['Abacus', 'Road Abc', 'Cab']);
    expect(matchGames('dia')[0].name).toMatch(/^Diablo/);
  });

  test('the case and the spaces round the text do not matter, and an empty text matches everything', () => {
    expect(matchGames('  DIABLO ').map((g) => g.slug)).toEqual(matchGames('diablo').map((g) => g.slug));
    expect(matchGames('')).toHaveLength(GAMES.length);
    expect(matchOffers('')).toHaveLength(OFFERS.length);
  });

  test('offers with the text in their title come before those that have it only in their lines', () => {
    const offers = [
      { title: 'Gear set', bullets: ['a raid pack'] },
      { title: 'Raid carry', bullets: ['x'] },
      { title: 'Mythic', bullets: ['y'] },
    ];
    expect(matchOffers('raid', offers).map((o) => o.title)).toEqual(['Raid carry', 'Gear set']);
  });

  test('nothing matches a text that is nowhere', () => {
    expect(matchGames('zzzzqq')).toEqual([]);
    expect(matchOffers('zzzzqq')).toEqual([]);
  });
});

describe('suggestions', () => {
  const names = (s) => s.items.map((it) => (it.type === 'game' ? it.game.name : it.offer.title));

  test('one list of games and offers together, never more than the limit', () => {
    const s = suggest('a');
    expect(s.empty).toBe(false);
    expect(s.items.length).toBeLessThanOrEqual(LIMITS.total);
    for (const it of s.items) expect(['game', 'offer']).toContain(it.type);
  });

  test('they are ranked by relevance whatever the kind: a title that starts with the text comes before a game that only has it inside', () => {
    const s = suggest('arena');
    const kinds = s.items.map((it) => it.type);
    expect(names(s)[0].toLowerCase().startsWith('arena')).toBe(true);
    expect(kinds).toContain('offer');
    // a game that starts with the text comes before an offer that has it only in its lines
    const d = suggest('dia');
    expect(d.items[0].type).toBe('game');
    expect(names(d)[0]).toMatch(/^Diablo/);
  });

  test('of equal closeness a game comes before an offer, and a match in the lines only comes last', () => {
    const items = suggest('dia').items;
    const first = items.findIndex((it) => it.type === 'offer');
    expect(first).toBeGreaterThan(0);
    // no game after the first offer that is farther than it: here every game starts with "dia", so they all come first
    for (const it of items.slice(0, first)) expect(it.type).toBe('game');
  });

  test('the kinds mix in one list by closeness, they are not kept in groups', () => {
    // for "raid": an offer that starts with it, then a game with a word that starts with it, then offers again
    const kinds = suggest('raid').items.map((it) => it.type).join(',');
    expect(kinds).toMatch(/offer,game,offer/);
  });

  test('nothing typed: the recent searches and the popular games', () => {
    const s = suggest('  ', ['wow gold', 'diablo']);
    expect(s.empty).toBe(true);
    expect(s.recent).toEqual(['wow gold', 'diablo']);
    expect(s.popular.length).toBe(LIMITS.popular);
  });

  test('the popular games are games with offers, in the order of the tiles of the home page', () => {
    const popular = popularGames().map((g) => g.slug);
    const order = TILE_ROWS.flat().map(([slug]) => slug);
    const has = new Set(OFFERS.map((o) => o.game));
    for (const slug of popular) expect(has.has(slug), slug).toBe(true);
    expect(popular).toEqual([...popular].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  });
});

describe('recent searches', () => {
  test('a new one goes on top, without a repeat (whatever the case), and five are kept', () => {
    let list = [];
    for (const q of ['a', 'b', 'c', 'd', 'e', 'f']) list = withRecent(list, q);
    expect(list).toEqual(['f', 'e', 'd', 'c', 'b']);
    expect(withRecent(list, 'C')).toEqual(['C', 'f', 'e', 'd', 'b']);
  });

  test('a text of spaces is not kept, and the text is trimmed', () => {
    expect(withRecent(['x'], '   ')).toEqual(['x']);
    expect(withRecent([], '  gold ')).toEqual(['gold']);
  });
});
