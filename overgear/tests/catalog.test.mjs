import { describe, expect, test } from 'vitest';
import { OFFERS, SERVICES, kindLabel, kindsOf, GAMES, TILE_ROWS, gameOf } from '../example/data.js';
import { LIMITS, matchGames, matchOffers, popularGames, suggest, withRecent } from '../example/suggest.js';
import { AUDIENCES, AUDIENCE_DEFAULT, AUDIENCE_GROUP, TILE_GAP, gameNameOf, audienceOf, tileRows, tileLayout, fitTiles, levelRows, splitOffers, gameTabs } from '../audience.js';

describe('kinds', () => {
  // The kinds of offers, the second level of tabs of the listing on the home page: every offer has a label for its kind, and a game's kinds come in a known order.
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
});

describe('suggest', () => {
  // What the search of the header suggests: the order, the limits, the empty state, the recent searches, and that the suggestions and the page of results agree.
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
});

describe('audience', () => {
  // The audiences of the store: the order of the tiles and of the offers for who the home page is made for, and the setting that holds it.
  describe('audiences', () => {
    test('every audience but the default is a game of the example with a tile and a name that matches', () => {
      const tiles = TILE_ROWS.flat().map(([slug]) => slug);
      for (const [slug, name] of AUDIENCES.filter(([s]) => s !== AUDIENCE_DEFAULT)) {
        expect(tiles, `${slug} has no tile`).toContain(slug);
        if (GAMES.some((g) => g.slug === slug)) expect(gameOf(slug).name, slug).toBe(gameNameOf(name));
      }
      expect(AUDIENCES.filter(([s]) => s === AUDIENCE_DEFAULT)).toHaveLength(1);
    });

    test('the audiences are World of Warcraft, all players under it, and the three other games with the most offers, each marked as an example', () => {
      expect(AUDIENCES.map(([s]) => s).slice(0, 2)).toEqual(['wow', AUDIENCE_DEFAULT]);
      expect(AUDIENCES[1][1]).toBe('All players');
      expect(AUDIENCES).toHaveLength(5);
      for (const [slug, name] of AUDIENCES.slice(2)) expect(name, slug).toBe(`${gameNameOf(name)} · Example`);
      // "the most content now": the games with the most offers after World of Warcraft; in a tie, the one that comes first on the tiles
      const count = (slug) => OFFERS.filter((o) => o.game === slug).length;
      const tiles = TILE_ROWS.flat().map(([slug]) => slug);
      const top = tiles.filter((s) => s !== 'wow').sort((a, b) => count(b) - count(a) || tiles.indexOf(a) - tiles.indexOf(b)).slice(0, 3);
      expect(AUDIENCES.slice(2).map(([s]) => s), 'the offers changed: update the games of AUDIENCES').toEqual(top);
    });

    test('a theme without a known audience is for all players', () => {
      expect(audienceOf({})).toBe('all');
      expect(audienceOf({ audience: 'nonsense' })).toBe('all');
      expect(audienceOf({ audience: 'diablo-4' })).toBe('diablo-4');
    });

    test('all players keep the tiles and the offers as they are', () => {
      expect(tileRows(TILE_ROWS, 'all')).toBe(TILE_ROWS);
      expect(splitOffers(OFFERS, 'all')).toEqual([[], OFFERS]);
    });

    test('the game of an audience takes the first tile and the others follow', () => {
      const rows = tileRows(TILE_ROWS, 'diablo-4');
      expect(rows[0][0][0]).toBe('diablo-4');
      expect(rows[0][1][0]).toBe('wow');
      expect(rows.flat().map(([s]) => s).sort()).toEqual(TILE_ROWS.flat().map(([s]) => s).sort());
    });

    test('World of Warcraft stands with its versions as a group of its own, in two rows of different widths', () => {
      const { group, rows } = tileLayout(TILE_ROWS, 'wow');
      expect(group.flat().map(([s]) => s)).toEqual(['wow', 'wow-forever', 'wow-20th-anniversary', 'wow-classic-era']);
      expect(new Set(group.flat().map(([, w]) => w)).size, 'the widths are not all equal').toBeGreaterThan(2);
      for (const [slug] of group.flat()) expect(gameOf(slug)?.cover, `${slug} has a cover`).toBeTruthy();
      const left = rows.flat().map(([s]) => s);
      for (const [slug] of group.flat()) expect(left).not.toContain(slug);
      expect(left.sort()).toEqual(TILE_ROWS.flat().map(([s]) => s).filter((s) => s !== 'wow').sort());
    });

    test('an audience without a family has no group; all players keep the rows', () => {
      expect(tileLayout(TILE_ROWS, 'diablo-4').group).toEqual([]);
      expect(tileLayout(TILE_ROWS, 'diablo-4').rows).toEqual(tileRows(TILE_ROWS, 'diablo-4'));
      expect(tileLayout(TILE_ROWS, 'all')).toEqual({ group: [], rows: TILE_ROWS });
    });

    test('an audience from the second row comes to the front of the first, and a game without a tile changes nothing', () => {
      expect(tileRows(TILE_ROWS, 'valorant')[0][0][0]).toBe('valorant');
      expect(tileRows(TILE_ROWS, 'no-such-game')).toBe(TILE_ROWS);
    });

    // The tiles end in a rectangle: the first and the second level are of equal length, whatever the audience (a row is its widths and its gaps)
    describe('the tiles end in a rectangle', () => {
      const length = (row) => row.reduce((n, [, w]) => n + w, 0) + (row.length - 1) * TILE_GAP;
      const base = Object.fromEntries(TILE_ROWS.flat());
      const sets = (audience) => { const { group, rows } = tileLayout(TILE_ROWS, audience); return group.length ? [group, rows] : [rows]; };

      test.each(AUDIENCES.map(([slug]) => [slug]))('%s: both levels are as long as each other, in the group and in the rest', (audience) => {
        for (const levels of sets(audience)) {
          expect(levels).toHaveLength(2);
          expect(Math.abs(length(levels[0]) - length(levels[1])), `${audience}: ${levels.map(length)}`).toBeLessThan(0.5);
        }
      });

      test.each(AUDIENCES.map(([slug]) => [slug]))('%s: no tile is stretched or squeezed by more than 8%%, and none is lost or doubled', (audience) => {
        const { group, rows } = tileLayout(TILE_ROWS, audience);
        for (const [slug, w] of rows.flat()) expect(w / base[slug], slug).toBeGreaterThan(0.92);
        for (const [slug, w] of rows.flat()) expect(w / base[slug], slug).toBeLessThan(1.08);
        const all = [...group.flat(), ...rows.flat()].map(([s]) => s);
        expect(new Set(all).size).toBe(all.length);
        expect(all.sort()).toEqual([...TILE_ROWS.flat().map(([s]) => s), ...(AUDIENCE_GROUP[audience] || []).flat().map(([s]) => s).filter((s) => !(s in base))].sort());
      });

      test('levelRows moves a tile to the shorter row when that helps, keeps the tile it is told to keep, and ends both rows at one place', () => {
        const rows = levelRows([[['a', 200], ['b', 200], ['c', 200]], [['d', 100]]], 'a');
        expect(Math.abs(length(rows[0]) - length(rows[1]))).toBeLessThan(0.5);
        expect(rows[0][0][0]).toBe('a');
      });
    });

    test('the offers of the audience are split from the rest, in their order', () => {
      const [own, rest] = splitOffers(OFFERS, 'diablo-4');
      expect(own.length).toBeGreaterThan(0);
      expect(own.every((o) => o.game === 'diablo-4')).toBe(true);
      expect(rest.some((o) => o.game === 'diablo-4')).toBe(false);
      expect(own.length + rest.length).toBe(OFFERS.length);
    });

    describe('the tabs of the listing', () => {
      const order = TILE_ROWS.flat().map(([slug]) => slug);
      const available = [...new Set(OFFERS.map((o) => o.game))];
      const tabs = (audience) => gameTabs(audience, order, available);

      test('World of Warcraft is the first game tab (the second tab of the row) for all players and for its own audience', () => {
        expect(tabs('all')[0]).toBe('wow');
        expect(tabs('wow')[0]).toBe('wow');
      });

      test('for the audience of another game that game is the first and World of Warcraft the second (the third tab of the row)', () => {
        for (const slug of ['diablo-4', 'poe-2', 'valorant']) expect(tabs(slug).slice(0, 2), slug).toEqual([slug, 'wow']);
      });

      test('every game with offers is a tab once, and a game without offers is not', () => {
        for (const [slug] of AUDIENCES) {
          const list = tabs(slug);
          expect(new Set(list).size).toBe(list.length);
          expect([...list].sort(), slug).toEqual([...available].sort());
        }
        expect(tabs('fortnite')).not.toContain('fortnite');
        expect(tabs('fortnite')[0]).toBe('wow');
      });

      test('the rest follow in the order of the tiles', () => {
        const rest = tabs('diablo-4').slice(2).filter((s) => order.includes(s));
        expect(rest).toEqual(order.filter((s) => rest.includes(s)));
      });
    });
  });
});

// The tiles of a desktop: fitted into the width, in blocks of two rows of different widths that end at the same place.
describe('fitTiles', () => {
  const rowLength = (block, i) => block.rows[i].reduce((n, [, w]) => n + w, 0) + (block.rows[i].length - 1) * TILE_GAP;
  const widths = [1232, 1100, 960, 800];

  test.each(AUDIENCES.flatMap(([slug]) => widths.map((w) => [slug, w])))('%s at %ipx: every block is two rows of one length, and the tiles are squeezed by no more than a fifth', (audience, width) => {
    const { blocks, scale } = fitTiles(tileLayout(TILE_ROWS, audience), width);
    expect(scale).toBeGreaterThanOrEqual(0.8);
    for (const b of blocks) {
      expect(b.rows).toHaveLength(2);
      expect(Math.abs(rowLength(b, 0) - rowLength(b, 1)), `${audience}: ${b.rows.map((r) => r.map(([s]) => s))}`).toBeLessThan(0.5);
    }
  });

  test('the tiles of one line are not all of one width', () => {
    for (const [audience] of AUDIENCES) for (const b of fitTiles(tileLayout(TILE_ROWS, audience), 1232).blocks) expect(new Set(b.rows.flat().map(([, w]) => Math.round(w))).size, audience).toBeGreaterThan(1);
  });

  test('World of Warcraft is a block of its four games, and the others are a block of their own, with no game lost or doubled while they fit', () => {
    const { blocks } = fitTiles(tileLayout(TILE_ROWS, 'wow'), 1232);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].rows.flat().map(([s]) => s).sort()).toEqual(['wow', 'wow-classic-era', 'wow-forever', 'wow-20th-anniversary'].sort());
    const all = blocks.flatMap((b) => b.rows.flat().map(([s]) => s));
    expect(new Set(all).size).toBe(all.length);
  });

  test('an audience without a family has one block', () => {
    expect(fitTiles(tileLayout(TILE_ROWS, 'all'), 1232).blocks).toHaveLength(1);
  });

  test('a width that is too narrow leaves tiles out of the rest, and never out of the group', () => {
    const wide = fitTiles(tileLayout(TILE_ROWS, 'wow'), 1232).blocks.flatMap((b) => b.rows.flat()).length;
    const narrow = fitTiles(tileLayout(TILE_ROWS, 'wow'), 700);
    expect(narrow.blocks.flatMap((b) => b.rows.flat()).length).toBeLessThan(wide);
    expect(narrow.blocks[0].rows.flat()).toHaveLength(4);
  });
});

