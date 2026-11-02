// Audiences of the store: who the home page is made for. A player of World of Warcraft has WoW first, a player of Diablo 4 has Diablo first, and the rest
// follows. The audience is a setting of the Theme page (kept with the theme, in one cookie); the example reads it. "All players" is the page as it is.
// The pure functions here take the slugs of the games and return a new order, so they are tested without a browser.

/** The audiences: all players, and one for each game that has a tile on the home page: [slug, name]. */
export const AUDIENCES = [
  ['all', 'All players'], ['wow', 'World of Warcraft'], ['diablo-4', 'Diablo 4'], ['poe-2', 'Path of Exile 2'], ['ffxiv', 'Final Fantasy XIV'], ['lost-ark', 'Lost Ark'],
  ['last-epoch', 'Last Epoch'], ['genshin-impact', 'Genshin Impact'], ['call-of-duty', 'Call of Duty'], ['d2', 'Destiny 2'], ['valorant', 'Valorant'], ['cs2', 'Counter Strike 2'],
  ['fortnite', 'Fortnite'], ['apex', 'Apex Legends'], ['eft', 'Escape from Tarkov'],
];
export const AUDIENCE_DEFAULT = 'all';

/** More tiles an audience gets after its own: the games of the same family (World of Warcraft has its versions). [slug, width] each; the games are those of the example. */
export const AUDIENCE_TILES = { wow: [['wow-forever', 176], ['wow-20th-anniversary', 196], ['wow-classic-era', 176]] };

/** The audience of a theme: a known one, or all players. */
export const audienceOf = (theme) => (AUDIENCES.some(([slug]) => slug === theme?.audience) ? theme.audience : AUDIENCE_DEFAULT);

/**
 * The rows of tiles for an audience: its game moves to the first place of the first row, the tiles of its family (AUDIENCE_TILES) follow it, then the others in their order,
 * each with the width it was drawn for (a tile with a tag or a long name needs its own). The rows keep their number of tiles, the first one grows by the family: a row scrolls sideways.
 * [[slug, width], …] in, the same shape out.
 */
export function tileRows(rows, audience) {
  if (audience === AUDIENCE_DEFAULT || !rows.some((row) => row.some(([slug]) => slug === audience))) return rows;
  const tiles = rows.flat();
  const family = (AUDIENCE_TILES[audience] || []).filter(([slug]) => !tiles.some(([s]) => s === slug));
  const lead = [tiles.find(([slug]) => slug === audience), ...family];
  const ordered = [...lead, ...tiles.filter(([slug]) => slug !== audience)];
  let i = 0;
  return rows.map((row, r) => row.concat(r === 0 ? family : []).map(() => ordered[i++]));
}

/** The offers split for an audience: [those of its game, the rest]. The page lists the first part first and mixes the games of the second. */
export function splitOffers(offers, audience) {
  if (audience === AUDIENCE_DEFAULT) return [[], offers];
  return [offers.filter((o) => o.game === audience), offers.filter((o) => o.game !== audience)];
}
