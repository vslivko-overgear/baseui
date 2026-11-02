// The audiences of the store: the order of the tiles and of the offers for who the home page is made for, and the setting that holds it.
import { describe, expect, test } from 'vitest';
import { AUDIENCES, AUDIENCE_DEFAULT, AUDIENCE_TILES, audienceOf, tileRows, splitOffers } from '../audience.js';
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

  test('World of Warcraft brings its versions: they follow its tile, and the first row is longer by them', () => {
    const rows = tileRows(TILE_ROWS, 'wow');
    expect(rows[0].slice(0, 4).map(([s]) => s)).toEqual(['wow', 'wow-forever', 'wow-20th-anniversary', 'wow-classic-era']);
    expect(rows[0].length).toBe(TILE_ROWS[0].length + AUDIENCE_TILES.wow.length);
    expect(rows[1].length).toBe(TILE_ROWS[1].length);
    expect(rows[0][0][1]).toBe(200);
    for (const [slug] of AUDIENCE_TILES.wow) expect(gameOf(slug)?.cover, `${slug} has a cover`).toBeTruthy();
    const all = rows.flat().map(([s]) => s);
    expect(new Set(all).size).toBe(all.length);
    for (const [slug] of TILE_ROWS.flat()) expect(all).toContain(slug);
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
