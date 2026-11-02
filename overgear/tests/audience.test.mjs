// The audiences of the store: the order of the tiles and of the offers for who the home page is made for, and the setting that holds it.
import { describe, expect, test } from 'vitest';
import { AUDIENCES, AUDIENCE_DEFAULT, AUDIENCE_GROUP, TILE_GAP, gameNameOf, audienceOf, tileRows, tileLayout, levelRows, splitOffers, gameTabs } from '../audience.js';
import { GAMES, OFFERS, TILE_ROWS, gameOf } from '../example/data.js';

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
