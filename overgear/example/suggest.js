// What the search of the header suggests: the games and the offers that match what is typed, in an order that puts the closest first; and the searches a visitor made before.
// Pure functions of the data, so they are tested without a browser. The page of results uses the same matching (matchGames, matchOffers): a suggestion and the result of its search agree.
import { GAMES, OFFERS, TILE_ROWS } from './data.js';

const norm = (s) => s.toLowerCase().trim();
/** How close a text is to what is typed: 0 starts with it, 1 has a word that starts with it, 2 has it somewhere, -1 does not have it. */
const rank = (text, q) => {
  const t = norm(text);
  if (t.startsWith(q)) return 0;
  if (t.split(/[^\p{L}\p{N}]+/u).some((w) => w.startsWith(q))) return 1;
  return t.includes(q) ? 2 : -1;
};

/** The games whose name has the query, the closest first; every game for an empty query. */
export function matchGames(query, games = GAMES) {
  const q = norm(query);
  if (!q) return games;
  return games.map((game) => ({ game, r: rank(game.name, q) })).filter((m) => m.r >= 0).sort((a, b) => a.r - b.r).map((m) => m.game);
}

/** The offers whose title or lines have the query: those with it in the title first, the closest of them first. */
export function matchOffers(query, offers = OFFERS) {
  const q = norm(query);
  if (!q) return offers;
  return offers
    .map((offer) => ({ offer, r: rank(offer.title, q), inBody: norm(offer.bullets.join(' ')).includes(q) }))
    .filter((m) => m.r >= 0 || m.inBody)
    .sort((a, b) => (a.r < 0 ? 3 : a.r) - (b.r < 0 ? 3 : b.r))
    .map((m) => m.offer);
}

export const LIMITS = { games: 4, offers: 5, recent: 5, popular: 6 };

/** The popular games for an empty query: the games of the tiles of the home page that have offers, in the order of the tiles. */
export function popularGames(games = GAMES, offers = OFFERS, tiles = TILE_ROWS) {
  const has = new Set(offers.map((o) => o.game));
  return tiles.flat().map(([slug]) => games.find((g) => g.slug === slug)).filter((g) => g && has.has(g.slug)).slice(0, LIMITS.popular);
}

/** The suggestions for what is typed: { games, offers } (a few of each), and for nothing typed { popular } with the recent searches. */
export function suggest(query, recent = []) {
  const q = norm(query);
  if (!q) return { empty: true, recent: recent.slice(0, LIMITS.recent), popular: popularGames() };
  return { empty: false, games: matchGames(q).slice(0, LIMITS.games), offers: matchOffers(q).slice(0, LIMITS.offers) };
}

/** The list of recent searches with a new one on top: no empty text, no repeats (whatever the case), five at most. */
export function withRecent(list, query) {
  const q = query.trim();
  if (!q) return list;
  return [q, ...list.filter((x) => norm(x) !== norm(q))].slice(0, LIMITS.recent);
}

const KEY = 'baseui-overgear-recent';
export const readRecent = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, LIMITS.recent) : []; } catch { return []; } };
export const keepRecent = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ } };
