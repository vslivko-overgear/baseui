// Audiences of the store: who the home page is made for. A player of World of Warcraft has WoW first, a player of Diablo 4 has Diablo first, and the rest
// follows. The audience is a setting of the Theme page (kept with the theme, in one cookie); the example reads it. "All players" is the page as it is.
// The pure functions here take the slugs of the games and return a new order, so they are tested without a browser.

/**
 * The audiences of the Theme page: World of Warcraft, all players, and the three other games with the most content in the example now (a test keeps the three in step with
 * the offers), each marked as an example: [slug, name]. Any other game still works as an audience (a stored one, or one passed to the functions below); it is just not offered.
 */
export const AUDIENCES = [
  ['wow', 'World of Warcraft'], ['all', 'All players'],
  ['diablo-4', 'Diablo 4 · Example'], ['poe-2', 'Path of Exile 2 · Example'], ['ffxiv', 'Final Fantasy XIV · Example'],
];
/** The name of the game of an audience, without the mark of an example. */
export const gameNameOf = (name) => name.replace(/ · Example$/, '');
export const AUDIENCE_DEFAULT = 'all';

/** The gap between tiles, in px (the 2 step of the spacing scale): the length of a row is its widths and its gaps. */
export const TILE_GAP = 8;

/**
 * The tiles an audience brings with its own: its family (World of Warcraft has its versions). They stand as a group of their own, in two rows, and are not of equal width on purpose:
 * the edges of the rows do not line up. The two rows are of equal length, so the group is a rectangle. [slug, width] each; the games are those of the example.
 */
export const AUDIENCE_GROUP = {
  wow: [[['wow', 170], ['wow-forever', 130]], [['wow-20th-anniversary', 140], ['wow-classic-era', 160]]],
};

/** The audience of a theme: one of those offered, or all players. */
export const audienceOf = (theme) => (AUDIENCES.some(([slug]) => slug === theme?.audience) ? theme.audience : AUDIENCE_DEFAULT);

const lengthOf = (row) => row.reduce((n, [, width]) => n + width, 0) + (row.length - 1) * TILE_GAP;

/**
 * Two rows of tiles of equal length: tiles move from the longer row to the shorter while that brings the lengths closer (the tile of `keep` stays where it is), then the widths of each
 * row are stretched or squeezed by the same share, a few per cent at most, so that both end at the same place. [[slug, width], …] ×2 in, the same shape out.
 */
export function levelRows(rows, keep) {
  const level = rows.map((row) => [...row]);
  for (let step = 0; step < 6; step++) {
    const [a, b] = level.map(lengthOf);
    const from = a > b ? 0 : 1;
    let best = null;
    level[from].forEach(([slug, width], i) => {
      const after = Math.abs(Math.abs(a - b) - 2 * (width + TILE_GAP));
      if (slug !== keep && after < Math.abs(a - b) && (!best || after < best.after)) best = { i, after };
    });
    if (!best) break;
    level[1 - from].push(...level[from].splice(best.i, 1));
  }
  const target = (lengthOf(level[0]) + lengthOf(level[1])) / 2;
  return level.map((row) => {
    const free = target - (row.length - 1) * TILE_GAP;
    const k = free / row.reduce((n, [, width]) => n + width, 0);
    return row.map(([slug, width]) => [slug, +(width * k).toFixed(2)]);
  });
}

/**
 * The rows of tiles for an audience: its game moves to the first place of the first row and the others follow in their order, each with the width it was drawn for
 * (a tile with a tag or a long name needs its own). The two rows end at the same place, whatever the order: see levelRows. [[slug, width], …] in, the same shape out.
 */
export function tileRows(rows, audience) {
  if (audience === AUDIENCE_DEFAULT || !rows.some((row) => row.some(([slug]) => slug === audience))) return rows;
  const tiles = rows.flat();
  const ordered = [tiles.find(([slug]) => slug === audience), ...tiles.filter(([slug]) => slug !== audience)];
  let i = 0;
  return levelRows(rows.map((row) => row.map(() => ordered[i++])), audience);
}

/**
 * What the tiles of the home page show for an audience: `group`, the two rows of the tiles of an audience with a family (the page stands them apart from the rest),
 * and `rows`, the other tiles in two rows, level with each other. An audience without a family has no group and the rows of tileRows.
 */
export function tileLayout(rows, audience) {
  const group = AUDIENCE_GROUP[audience];
  if (!group) return { group: [], rows: tileRows(rows, audience) };
  const taken = new Set(group.flat().map(([slug]) => slug));
  return { group, rows: levelRows(rows.map((row) => row.filter(([slug]) => !taken.has(slug)))) };
}

/**
 * The tiles of the home page on a desktop, fitted into `width` px with no scroll: blocks (the group of the audience, then the rest), each a rectangle of two rows of tiles of different widths,
 * and every row of every block ends at the same place, so the first row is as long as the second. The widths only give the proportions (the page grows the tiles by them); a gap is a gap.
 * When the tiles would be squeezed by more than `1 - min`, the last tile of the longer row of the rest is left out and the rows are levelled again, until they fit. The group is never cut.
 * Returns { blocks: [{ rows, length }], scale }: the rows of each block, the sum of the widths of its row (its share of the line), and the share the widths were squeezed to.
 */
export function fitTiles(layout, width, { min = 0.8 } = {}) {
  let rest = layout.rows;
  const blocksOf = (r) => (layout.group.length ? [layout.group, r] : [r]);
  const scaleOf = (r) => {
    const rows = blocksOf(r);
    const count = rows.reduce((n, b) => n + b[0].length, 0);
    const sum = rows.reduce((n, b) => n + b[0].reduce((m, [, w]) => m + w, 0), 0);
    return (width - (count - 1) * TILE_GAP) / sum;
  };
  while (scaleOf(rest) < min && rest.flat().length > 2) {
    const from = lengthOf(rest[0]) >= lengthOf(rest[1]) ? 0 : 1;
    const cut = rest.map((row, i) => (i === from ? row.slice(0, -1) : row));
    rest = levelRows(cut);
  }
  const blocks = blocksOf(rest).map((rows) => ({ rows, length: rows[0].reduce((n, [, w]) => n + w, 0) + (rows[0].length - 1) * TILE_GAP }));
  return { blocks, scale: scaleOf(rest) };
}

/** The offers split for an audience: [those of its game, the rest]. The page lists the first part first and mixes the games of the second. */
export function splitOffers(offers, audience) {
  if (audience === AUDIENCE_DEFAULT) return [[], offers];
  return [offers.filter((o) => o.game === audience), offers.filter((o) => o.game !== audience)];
}

/**
 * The games of the tabs of the listing, after "All games": World of Warcraft is the second tab for all players and for its own audience; for the audience of another game
 * that game is the second and World of Warcraft the third. The rest follow in the order of `order` (the tiles of the page), then the games `order` does not know.
 * Only games with offers are tabs: a tab of a game with nothing to show would be empty. `available` is the slugs of the games with offers.
 */
export function gameTabs(audience, order, available) {
  const has = new Set(available);
  const lead = [audience === AUDIENCE_DEFAULT ? null : audience, 'wow'].filter((slug, i, all) => slug && has.has(slug) && all.indexOf(slug) === i);
  const rest = [...order.filter((slug) => has.has(slug)), ...available].filter((slug, i, all) => !lead.includes(slug) && all.indexOf(slug) === i);
  return [...lead, ...rest];
}
