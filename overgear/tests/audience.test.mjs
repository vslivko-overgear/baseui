// The audiences of the store: the order of the tiles and of the offers for who the home page is made for, and the setting that holds it.
import { describe, expect, test } from 'vitest';
import { AUDIENCES, AUDIENCE_DEFAULT, AUDIENCE_FAMILY, audienceOf, tileRows, tileLayout, splitOffers } from '../audience.js';
import { GAMES, OFFERS, TILE_ROWS, gameOf } from '../example/data.js';

describe('audiences', () => {
  test('every audience but the default is a game of the example with a tile and a name that matches', () => {
    const tiles = TILE_ROWS.flat().map(([slug]) => slug);
    for (const [slug, name] of AUDIENCES.filter(([s]) => s !== AUDIENCE_DEFAULT)) {
      expect(tiles, `${slug} has no tile`).toContain(slug);
      if (GAMES.some((g) => g.slug === slug)) expect(gameOf(slug).name, slug).toBe(name);
    }
    expect(AUDIENCES[0][0]).toBe(AUDIENCE_DEFAULT);
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

  test('the game of an audience takes the first tile, every tile keeps its width and the rows keep their size', () => {
    const rows = tileRows(TILE_ROWS, 'diablo-4');
    expect(rows[0][0]).toEqual(['diablo-4', 140]);
    expect(rows.map((r) => r.length)).toEqual(TILE_ROWS.map((r) => r.length));
    const width = Object.fromEntries(TILE_ROWS.flat());
    for (const [slug, w] of rows.flat()) expect(w, slug).toBe(width[slug]);
    expect(rows.flat().map(([s]) => s).sort()).toEqual(TILE_ROWS.flat().map(([s]) => s).sort());
    // the others follow in their order
    expect(rows[0][1][0]).toBe('wow');
    expect(rows[1].map(([s]) => s)).toEqual(TILE_ROWS[1].map(([s]) => s));
  });

  test('World of Warcraft stands with its versions as a group of four, and the rest stays in its rows', () => {
    const { group, rows } = tileLayout(TILE_ROWS, 'wow');
    expect(group.map(([s]) => s)).toEqual(['wow', 'wow-forever', 'wow-20th-anniversary', 'wow-classic-era']);
    for (const slug of AUDIENCE_FAMILY.wow) expect(gameOf(slug)?.cover, `${slug} has a cover`).toBeTruthy();
    const left = rows.flat().map(([s]) => s);
    for (const [slug] of group) expect(left).not.toContain(slug);
    // every other tile is still there, in its row and order
    expect(rows[0].map(([s]) => s)).toEqual(TILE_ROWS[0].map(([s]) => s).filter((s) => s !== 'wow'));
    expect(rows[1]).toEqual(TILE_ROWS[1]);
    expect(group.length + left.length).toBe(TILE_ROWS.flat().length + AUDIENCE_FAMILY.wow.length);
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

  test('the offers of the audience are split from the rest, in their order', () => {
    const [own, rest] = splitOffers(OFFERS, 'diablo-4');
    expect(own.length).toBeGreaterThan(0);
    expect(own.every((o) => o.game === 'diablo-4')).toBe(true);
    expect(rest.some((o) => o.game === 'diablo-4')).toBe(false);
    expect(own.length + rest.length).toBe(OFFERS.length);
  });
});
