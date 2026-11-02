// Mock data of the Overgear example: games, offers, sellers, reviews, questions. Nothing here is real: prices, names and numbers are invented.
import { rng, seedOf } from './util.js';

export const CATEGORIES = ['All games', 'World of Warcraft', 'Action RPG', 'MMO', 'Shooters', 'Other'];

// The games, in the order of the home page of the real service. `cover` is the picture of the game on the server of the real service (linked, not copied); a game without one gets a gradient of its tone.
const g = (slug, name, category, tone, cover) => ({ slug, name, category, tone, cover });
export const GAMES = [
  g("wow", "World of Warcraft", "World of Warcraft", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/a1fb530f-c536-44d1-8e96-fffd958f802d"),
  g("wow-forever", "WoW Forever", "World of Warcraft", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/9b3ff720-497c-4e0d-9a6e-a146d3134ecf"),
  g("wow-20th-anniversary", "TBC Anniversary", "World of Warcraft", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/c0090033-b2b3-4acf-93a2-c7bf73fa8600"),
  g("wow-classic-era", "WoW Classic Era", "World of Warcraft", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/0e71f90a-dd30-408d-aeb9-0a548670ff1b"),
  g("torchlight-infinite", "Torchlight: Infinite", "Action RPG", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/0e925bae-553a-4263-b942-95a2d4020f35"),
  g("aion-2", "AION 2", "MMO", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/6cfd0809-2138-48ea-8d6b-de319f03d13d"),
  g("diablo-4", "Diablo 4", "Action RPG", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/ec7b93fd-5557-4660-972f-4d1801149e20"),
  g("call-of-duty", "Call of Duty", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/dad0d39c-958b-4b5d-bbb4-a4464fd1a2ba"),
  g("poe-2", "Path of Exile 2", "Action RPG", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/51ccd395-29c8-4cd9-b6af-83ac1beb705c"),
  g("wow-classic-hardcore", "WoW Classic Hardcore", "World of Warcraft", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/2ab44539-fdb2-4717-97b8-60e0c200b87c"),
  g("season-of-discovery", "WoW Season of Discovery", "World of Warcraft", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/7c32b5b1-6c21-4900-b6ed-5780fc755e0b"),
  g("nba-2k", "NBA 2K27", "Other", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/39436cac-85ae-4ce8-88f8-798ca4015593"),
  g("marathon-the-game", "Marathon", "Shooters", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/4d1ed903-4787-4447-8d96-d7a1cbfba888"),
  g("d2", "Destiny 2", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/f8c47aa1-00e8-476a-af73-0f25622ddb0a"),
  g("wardogs", "WARDOGS", "Shooters", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/d406a3cf-ad3d-4e02-b553-84547ffe4e2a"),
  g("ffxiv", "Final Fantasy XIV", "MMO", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/99577e3b-911f-4859-a904-6e43655d96a3"),
  g("where-winds-meet", "Where Winds Meet", "MMO", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/be8aee28-f6ef-4029-8032-6718222fd7f6"),
  g("poe", "Path of Exile", "Action RPG", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/24de3570-acb7-4f56-a7a2-7de7dbd4dd60"),
  g("ea-sports-fc", "EA Sports FC 27", "Other", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/7dace08b-8bfa-449e-9514-cd8e3925bd70"),
  g("marvel-rivals", "Marvel Rivals", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/575363fa-29fe-482b-9235-87b79b169239"),
  g("arena-breakout-infinite", "Arena Breakout Infinite", "Shooters", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/46e3de52-8761-4ef8-bafd-d2592453cf5b"),
  g("overwatch", "Overwatch", "Shooters", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/3aa6d2d7-b323-4292-84b9-5ba26c0073dd"),
  g("arc-raiders", "ARC Raiders", "Shooters", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/4a7ed4e4-ee0b-447b-853f-93de928e82f3"),
  g("apex", "Apex Legends", "Shooters", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/8be3abf6-f95f-41a9-9245-48d512446778"),
  g("eft", "Escape from Tarkov", "Shooters", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/a5ad5836-8cb3-4965-9397-2889a4fa374f"),
  g("delta-force", "Delta Force", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/3670452e-38ea-4259-b418-9c0e423f6500"),
  g("last-epoch", "Last Epoch", "Action RPG", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/0f38ce8c-7af5-4ed3-a1d9-faf52f7fb251"),
  g("osrs", "Old School RuneScape", "MMO", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/590453b2-df7d-46d0-8e1c-337c14f330e7"),
  g("elder-scrolls-online", "The Elder Scrolls Online", "MMO", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/dd1c244c-973d-4f0c-8674-1df4644ee08e"),
  g("guild-wars-2", "Guild Wars 2", "MMO", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/a9ff421d-d01f-4eb6-b512-dfe412943b3a"),
  g("world-of-tanks", "World of Tanks", "MMO", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/4c812c5a-f950-45d2-a7e8-6ec4a129b478"),
  g("division-2", "The Division 2", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/eed00966-29f5-42e3-9a43-1c0bf885e877"),
  g("fellowship", "Fellowship", "MMO", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/236ca11d-2c6c-49dd-9e06-a4e21c9fe222"),
  g("arknights-endfield", "Arknights: Endfield", "Other", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/c94350ec-3970-4912-864c-f2c111a38b7f"),
  g("diablo-3", "Diablo 3", "Action RPG", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/cd48eaa6-4908-43b7-a081-4da40513dc42"),
  g("diablo-2-resurrected", "Diablo 2 Resurrected", "Action RPG", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/3a4e23a3-4c62-448a-9d8a-97f22e5e78f0"),
  g("sea-of-thieves", "Sea of Thieves", "MMO", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/5e0632ff-784a-4801-92de-e7ba55538e63"),
  g("deadlock", "Deadlock", "Shooters", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/38e520fe-a21b-4e62-b7c6-ce9fdeff9d11"),
  g("valorant", "Valorant", "Shooters", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/ba091f3a-b961-40fe-b62c-4711624855d6"),
  g("cs2", "Counter Strike 2", "Shooters", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/6b3e6821-a145-44dc-9465-58717f8a8be4"),
  g("battlefield-6", "Battlefield 6", "Shooters", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/c9856363-70bc-48c6-9d9b-19c8bdd53345"),
  g("gears-of-war-e-day", "Gears of War: E-Day", "Shooters", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/f6fb234b-6370-4f3c-ae21-0500c5e03a44"),
  g("albion-online", "Albion Online", "MMO", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/6256faca-29d3-4b39-adf1-943c46db08b2"),
  g("monster-hunter-wilds", "Monster Hunter Wilds", "Action RPG", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/a76e8bd7-e340-405a-a1e6-3a2b7130e84e"),
  g("elden-ring", "Elden Ring Nightreign", "Action RPG", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/9b7449ef-6282-4f25-8baf-3008e54e718e"),
  g("the-finals", "The Finals", "Shooters", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/aba82562-1143-4dc6-b5bb-4325f88c003e"),
  g("lost-ark", "Lost Ark", "MMO", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/eef4ac6b-daf3-4e08-90cd-3305f4d8863f"),
  g("genshin-impact", "Genshin Impact", "Other", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/28a57078-c9d1-4f06-8ef9-0ae4d67574ae"),
  g("lol", "League of Legends", "Other", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/f0884829-a274-47da-8dd8-087fa700ba4a"),
  g("pandaria-classic", "WoW Mists of Pandaria", "World of Warcraft", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/9c77c7a8-4c91-41a3-82c0-6dee41538a87"),
  g("helldivers-2", "Helldivers 2", "Shooters", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/9ce66d33-ab49-4ea6-9552-3b78add895b0"),
  g("r6", "Rainbow Six Siege", "Shooters", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/5a92a3e3-d7aa-4462-9c90-2bb8d511a637"),
  g("the-first-descendant", "The First Descendant", "Shooters", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/e86226ba-b847-4dd2-925b-b8934ce00677"),
  g("destiny-rising", "Destiny Rising", "Shooters", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/84238253-5eb7-46f5-af11-683406df2ae0"),
  g("active-matter", "Active Matter", "Shooters", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/adcedc90-11aa-4f0c-a2b1-370a68a7ab4c"),
  g("dota-2", "Dota 2", "Other", "red", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/ad61f7a0-c118-450d-82de-6d8999053f56"),
  g("space-marine-2", "Warhammer 40k Space Marine 2", "Shooters", "orange", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/34ca549d-b555-457a-ace7-27a8a656c636"),
  g("dune-awakening", "Dune Awakening", "MMO", "pink", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/0e20c8bd-c011-47c8-8c9a-e191f7f50ec1"),
  g("diablo-immortal", "Diablo Immortal", "Action RPG", "blue-light", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/67adfed6-b984-47c8-b95b-18476e07f05b"),
  g("warframe", "Warframe", "Action RPG", "green", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/f3b3cd90-760f-48fc-83b4-1efb0ba44ba8"),
  g("fortnite", "Fortnite", "Shooters", "blue", "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/files/8bd44aca-1b4f-47a4-ba38-a2d8325919a7"),
];

// The tiles of the games block on the home page: a 3D object for each game (Microsoft Fluent Emoji, MIT, linked) and the width of the tile.
export const GAME_TILES = {
  "wow": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Dragon/3D/dragon_3d.png",
  "diablo-4": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Smiling%20face%20with%20horns/3D/smiling_face_with_horns_3d.png",
  "poe-2": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Gem%20stone/3D/gem_stone_3d.png",
  "call-of-duty": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Military%20helmet/3D/military_helmet_3d.png",
  "d2": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Ringed%20planet/3D/ringed_planet_3d.png",
  "ffxiv": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Crossed%20swords/3D/crossed_swords_3d.png",
  "valorant": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Bullseye/3D/bullseye_3d.png",
  "cs2": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Bomb/3D/bomb_3d.png",
  "fortnite": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Rocket/3D/rocket_3d.png",
  "lost-ark": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Shield/3D/shield_3d.png",
  "genshin-impact": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Magic%20wand/3D/magic_wand_3d.png",
  "lol": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Crown/3D/crown_3d.png",
  "last-epoch": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Hourglass%20not%20done/3D/hourglass_not_done_3d.png",
  "ea-sports-fc": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Soccer%20ball/3D/soccer_ball_3d.png"
};
// the widths differ from row to row, so the edges of the tiles do not line up: the rows stagger
// a tag at the bottom left of a game tile
// not shown for now (the tiles of the home page have no tags); a tile takes one through its `tag` prop
export const GAME_TAGS = { wow: 'Popular' };
export const TILE_ROWS = [
  [['wow', 200], ['diablo-4', 140], ['poe-2', 190], ['ffxiv', 160], ['lost-ark', 130], ['last-epoch', 180], ['genshin-impact', 160]],
  [['call-of-duty', 150], ['d2', 190], ['valorant', 140], ['cs2', 170], ['fortnite', 210], ['apex', 140], ['eft', 160]],
];
export const EMOJI = (name) => `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${name.replace(/ /g, '%20')}/3D/${name.toLowerCase().replace(/ /g, '_')}_3d.png`;

export const gameOf = (slug) => GAMES.find((x) => x.slug === slug);

export const WOW_VERSIONS = ['Midnight', 'Forever', 'TBC Anniversary', 'Classic Era', 'Season of Discovery', 'MoP Classic'];
export const SERVICES = [
  { id: 'hot', label: 'Hot offers' }, { id: 'gold', label: 'WoW Gold' }, { id: 'raids', label: 'Raids' }, { id: 'mythic', label: 'Mythic+ Dungeons' },
  { id: 'leveling', label: 'Leveling' }, { id: 'boost', label: 'Character Boost' }, { id: 'pvp', label: 'PvP' }, { id: 'delves', label: 'Delves' },
  { id: 'achievements', label: 'Achievements' }, { id: 'collectibles', label: 'Collectibles' },
];

// the labels of the kinds of offers that are not a service of World of Warcraft (SERVICES): what the offers of the other games are filed under
const KIND_LABELS = {
  boss: 'Boss kills', gear: 'Gear', currency: 'Currency', atlas: 'Atlas', raid: 'Raids', crafting: 'Crafting', monolith: 'Monoliths', camo: 'Camos', rank: 'Rank boost',
  exotic: 'Exotics', coaching: 'Coaching', abyss: 'Abyss', topup: 'Top-ups', placement: 'Placement', coins: 'Coins',
};
export const kindLabel = (id) => SERVICES.find((s) => s.id === id)?.label || KIND_LABELS[id];

/** The kinds of offers in a list of offers, as [{ id, label }]: the services of World of Warcraft in their order, then the others as they come. */
export function kindsOf(offers) {
  const ids = [...new Set(offers.map((o) => o.service))];
  const known = SERVICES.map((s) => s.id).filter((id) => ids.includes(id));
  return [...known, ...ids.filter((id) => !known.includes(id))].map((id) => ({ id, label: kindLabel(id) }));
}

/** The catalog of a game: quick links (a row of chips) and the groups of offers, each a heading with the kinds under it. Every link opens the listing of its group. */
const WOW_CATALOG = {
  quick: [{ id: 'hot', label: 'Hot offers', emoji: 'Fire' }, { id: 'gold', label: 'WoW Gold', emoji: 'Coin' }, { id: 'hot', label: 'Season 2', emoji: 'Crescent moon' }],
  groups: [
    { id: 'raids', label: 'Raids', items: ['The Venomous Abyss', 'Venomous Abyss Heroic', 'Venomous Abyss Mythic', 'Unbinding of Kith’ix', 'Ula’tek', 'Single Bosses', 'Tidebound Grotto', 'Season 1 Raids', 'Legacy Raids', 'Timewalking Raids', 'The Worldcore'] },
    { id: 'mythic', label: 'Mythic+ Dungeons', items: ['M+ 3+1 FREE', 'Any Mythic+ Keys', 'Mythic +10', 'Keystone Myth', 'Keystone Legend', 'Keystone Hero', 'Timewalking', 'Mistcrests'] },
    { id: 'leveling', label: 'Leveling', items: ['Power Leveling', 'Renown', 'Campaigns'] },
    { id: 'boost', label: 'Character Boost', items: ['Gearing', 'Mage Tower', 'Professions', 'Reputations', 'Coaching', 'Player Housing', 'Pathfinder Services'] },
    { id: 'pvp', label: 'PvP', items: ['Elite PvP Transmog', 'Gladiator', 'PvP Gear', 'Battleground Blitz', 'Solo Shuffle', 'PvP Coaching'] },
    { id: 'delves', label: 'Delves', items: ['Kindo’jan Challenge', 'The Labyrinth of Kindo’Jan', 'Azta’rec Challenge', 'Delves 3+1 FREE', 'Tiers Unlock', 'Ritual Sites'] },
    { id: 'achievements', label: 'Achievements', items: ['Event Achievements', 'Glory Achievements', 'PvP Achievements', 'Titles'] },
    { id: 'collectibles', label: 'Collectibles', items: ['Midnight Mounts', 'Black Market', 'BlizzCon Products', 'TCG Loot', 'Promo Products', 'Collector’s Editions', 'Raid & Dungeon Mounts', 'Transmog', 'Pets'] },
  ],
};
const GENERIC_CATALOG = {
  quick: [{ id: 'hot', label: 'Hot offers', emoji: 'Fire' }],
  groups: [
    { id: 'currency', label: 'Currency', items: ['Buy currency', 'Bulk packs'] },
    { id: 'items', label: 'Items', items: ['Rare items', 'Sets', 'Bundles'] },
    { id: 'boost', label: 'Boosting', items: ['Rank boost', 'Placement matches', 'Coaching'] },
  ],
};
export const catalogOf = (game) => (game.category === 'World of Warcraft' ? WOW_CATALOG : GENERIC_CATALOG);

const o = (id, service, title, price, eta, bullets, badge, rating = 4.9, reviews = 100) => ({ id, game: 'wow', service, title, price, eta, bullets, badge, rating, reviews });
export const OFFERS = [
  o('venomous-abyss-heroic', 'raids', 'Venomous Abyss Heroic', 89, '3 hours', ['8/8 Heroic with Ahead of the Curve', 'Done in 3 hours', 'Piloted or self-play'], 'Hot Offer', 4.9, 412),
  o('mythic-plus-bundle', 'mythic', 'Mythic+ Bundle', 149, '1 day', ['3+1, 6+2 and 9+3 bundles', 'Up to 311 item level loot', 'Choose your keystone level'], 'Bundle', 4.8, 268),
  o('kithix', 'raids', 'Unbinding of Kith’ix', 24, '15 minutes', ['Cleared in 15 minutes', 'All loot is yours', 'Any difficulty'], 'Hot Offer', 5.0, 180),
  o('power-leveling', 'leveling', 'Power Leveling to 90', 119, '7 hours', ['Full AFK on self-play', '90 in 7 hours, 4 hours with Express', 'Gold and gear kept'], undefined, 4.9, 530),
  o('abyss-kithix-grotto', 'raids', '[10/10] Abyss + Kith’ix + Grotto', 168, '5 hours', ['Three raids in one run', 'A free Tidebound Grotto', 'All bosses, all loot'], 'Bundle', 4.9, 97),
  o('ulatek', 'raids', 'Ula’tek', 59, '2 days', ['Any difficulty', 'Ahead of the Curve', 'Cutting Edge and mount'], undefined, 4.8, 64),
  o('hallows-end', 'achievements', 'Hallow’s End Achievements', 19, '1 day', ['“Hallowed Be Thy Name” done', 'All seasonal achievements', 'No account sharing'], 'Hot Offer', 4.9, 142),
  o('tidebound-grotto', 'delves', 'Tidebound Grotto', 15, '15 minutes', ['Done in 15 minutes', 'Any tier', 'Every reward'], 'Sale', 4.9, 207),
  o('arena-2400', 'pvp', 'Arena 2400 rating', 189, '2 days', ['Played by a Gladiator', '2v2 or 3v3', 'Seasonal rewards'], undefined, 4.7, 88),
  o('rated-bg', 'pvp', 'Rated Battlegrounds 1800', 79, '1 day', ['Up to 1800 rating', 'Honor and conquest', 'Self-play available'], 'Seasonal', 4.8, 56),
  o('character-boost', 'boost', 'Character Boost to 90', 69, '3 hours', ['Gear and gold included', 'Choose class and spec', 'Ready for raids'], 'Save More', 4.9, 301),
  o('mount-collector', 'collectibles', 'Rare Mount Collection', 139, '3 days', ['Five rare mounts', 'Drop chances are ours', 'Your name stays private'], undefined, 4.8, 73),
  o('mythic-10-timed', 'mythic', 'Mythic+10 Timed', 34, '30 minutes', ['Timed with the key you choose', 'Any dungeon', 'Loot goes to you'], 'Sale', 4.9, 410),
  o('reputation', 'achievements', 'Renown and Reputation', 49, '2 days', ['Max renown', 'All factions', 'Safe and slow'], undefined, 4.7, 39),
];
// The pictures of the offers: those of the real service, linked from its server (not copied). An offer without one shows a placeholder.
const IMAGES = {
  "venomous-abyss-heroic": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/46222de8d2f182d866cb93707d678b59.jpeg",
  "mythic-plus-bundle": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/5cd4bf9681c1a847a5e1f788accc6236.jpeg",
  "kithix": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/944f741e733ad12370898f41fcb5606d.jpeg",
  "power-leveling": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/e4b695570b849295e172d4dfea60534b.jpeg",
  "abyss-kithix-grotto": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/746f8daa92df2fb7fe583cd42646f281.jpeg",
  "ulatek": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/05620c3a9d58e1d87f4be24310155de9.jpeg",
  "hallows-end": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/42fa2cbfa95df6b85e1a9a8bd6b0089b.jpeg",
  "tidebound-grotto": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/256a811d8a71de7721da68a2142ed866.jpeg",
  "arena-2400": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/e4de5deaaf70ab7bc912bc0b3b33ad1f.jpeg",
  "rated-bg": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/cebc0d594283cc365dae4603c2ab0378.jpeg",
  "character-boost": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8f9fe67bbffd7609ac02c41332e8885a.jpeg",
  "mount-collector": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/eca02695f45a5b0eb25496b1370c9e00.jpeg",
  "mythic-10-timed": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/88aee90a975e8bb576537a177a49bbe4.jpeg",
  "reputation": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/a8708c128f32fe0f4602163b398078cb.jpeg",
};
// Pictures of the offers of the other games: the cards of the services on the game pages of the real service (linked from its server, not copied).
const EXTRA_IMAGES = {
  "diablo-4-season-leveling-to-60": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8b9be95a4c4a98f34881db3d29f218a2.jpeg",
  "diablo-4-uber-lilith-kill": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8e66cef9c2de4655b5d59f20780e7e1c.jpeg",
  "diablo-4-mythic-gear-farm": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8dbb4b67f81bf4aae74f275dd2737139.jpeg",
  "poe-2-divine-orbs-100": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/33d0016c7932a9ac3ac499bb8d9d5225.jpeg",
  "poe-2-atlas-completion": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/9b33d617e18810ee2814f9e9ec56e7a8.jpeg",
  "poe-2-boss-carry-pack": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/57dc3a2974a56d934e2e30476cc934f2.jpeg",
  "last-epoch-empowered-monolith-push": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8304cdfabcd2af1952a4079399899fd0.jpeg",
  "ffxiv-savage-raid-clear": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/19b869e9c7a79ab9c7f5c87d73843ea8.jpeg",
  "ffxiv-gil-100m": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/1aac0ada60d7f07f4b6e5269e328f95b.jpeg",
  "ffxiv-crafting-levels": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/c3f6a96f3ef3a2114c84493daa8e0b2a.jpeg",
  "lost-ark-gold-100k": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/803ae93600810b201fbf9bcde2d6c253.jpeg",
  "call-of-duty-camo-unlock-pack": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/61ccb25cceae72acafdbe65f5e065c22.jpeg",
  "call-of-duty-rank-boost-to-prestige": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/bd4fd6b501689a5bb36e8aed65f15afb.jpeg",
  "d2-raid-clear-day-one": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/27295a8525c59765e402a35956cdbe34.jpeg",
  "d2-exotic-catalyst-pack": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/7b484f2119e60783ebdcc0fb66905847.jpeg",
  "valorant-rank-boost-to-ascendant": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/d143e293f88cf201ab73a8002673ebf1.jpeg",
  "valorant-coaching-session": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/156c7de946b6d779318486d34e6bc397.jpeg",
  "cs2-premier-rating-boost": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/40271818a6b4b9f2873d1a770ae2a3a9.jpeg",
  "genshin-impact-abyss-36-stars": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/8a98181834b0009a1c6e7b1b121b8648.jpeg",
  "genshin-impact-primogems-top-up": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/afe9a41fc1059c22b75a7c425ca86078.jpeg",
  "lol-duo-queue-boost": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/4b8ba267cbedc7820abffb5c1cbe8b86.jpeg",
  "lol-placement-matches": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/23bafbcccb134fcc7844b76dac791448.jpeg",
  "ea-sports-fc-coins-1m": "https://overgear.com/cdn-cgi/image/width=560,quality=85,format=auto/cdn/uploads/ae43e9f094465108ec7746adaa731e4a.jpeg"
};
OFFERS.forEach((o) => { o.image = IMAGES[o.id]; });

// Offers of the other games. `art` is a 3D object (Microsoft Fluent Emoji, MIT, linked) shown on the color of the game.
const extra = (id, game, service, title, price, eta, bullets, badge, rating, reviews, art) => ({ id, game, service, title, price, eta, bullets, badge, rating, reviews, art });
export const MORE_OFFERS = [
  extra("diablo-4-season-leveling-to-60", "diablo-4", "leveling", "Season Leveling to 60", 39, "6 hours", ["Fast, safe leveling", "Gear kept in your stash", "Choose your class"], "Hot Offer", 4.9, 214, "Skull"),
  extra("diablo-4-uber-lilith-kill", "diablo-4", "boss", "Uber Lilith Kill", 59, "1 hour", ["Done by a top player", "All drops are yours", "Self-play available"], undefined, 4.8, 96, "Smiling face with horns"),
  extra("diablo-4-mythic-gear-farm", "diablo-4", "gear", "Mythic Gear Farm", 79, "2 days", ["Targeted farming", "Choose the item", "No shared accounts"], "Bundle", 4.7, 58, "Axe"),
  extra("poe-2-divine-orbs-100", "poe-2", "currency", "Divine Orbs, 100", 42, "15 minutes", ["Delivered in game", "Safe trade", "24/7 support"], "Sale", 4.9, 321, "Gem stone"),
  extra("poe-2-atlas-completion", "poe-2", "atlas", "Atlas Completion", 69, "3 days", ["All maps cleared", "Your build, our hands", "Progress report"], undefined, 4.8, 77, "Compass"),
  extra("poe-2-boss-carry-pack", "poe-2", "boss", "Boss Carry Pack", 55, "4 hours", ["Five bosses", "Any difficulty", "Loot goes to you"], "Save More", 4.8, 103, "Crossed swords"),
  extra("last-epoch-empowered-monolith-push", "last-epoch", "monolith", "Empowered Monolith Push", 29, "3 hours", ["Up to the max echo", "Faction rewards", "Keep your gear"], undefined, 4.7, 44, "Hourglass not done"),
  extra("ffxiv-savage-raid-clear", "ffxiv", "raid", "Savage Raid Clear", 64, "3 hours", ["Full clear with a static", "Weekly lockout", "Voice optional"], "Hot Offer", 4.9, 167, "Crossed swords"),
  extra("ffxiv-gil-100m", "ffxiv", "currency", "Gil, 100M", 19, "10 minutes", ["Mail or trade", "Fast delivery", "Region of your choice"], undefined, 4.8, 402, "Coin"),
  extra("ffxiv-crafting-levels", "ffxiv", "crafting", "Crafting Levels", 24, "1 day", ["All crafting jobs", "No account sharing", "Materials included"], undefined, 4.6, 38, "Wrench"),
  extra("lost-ark-gold-100k", "lost-ark", "currency", "Gold, 100K", 18, "10 minutes", ["Safe delivery", "Any server", "Fast support"], "Sale", 4.9, 288, "Money bag"),
  extra("lost-ark-hone-to-+20", "lost-ark", "gear", "Hone to +20", 45, "2 days", ["No broken stones", "Your character", "Daily progress"], undefined, 4.7, 61, "Hammer"),
  extra("call-of-duty-camo-unlock-pack", "call-of-duty", "camo", "Camo Unlock Pack", 34, "1 day", ["All gold camos", "Pick the weapons", "Safe methods"], "Seasonal", 4.7, 120, "Military helmet"),
  extra("call-of-duty-rank-boost-to-prestige", "call-of-duty", "rank", "Rank Boost to Prestige", 49, "2 days", ["Played by a pro", "Duo or solo", "Keep your stats"], undefined, 4.8, 85, "Trophy"),
  extra("d2-raid-clear-day-one", "d2", "raid", "Raid Clear, Day One", 74, "4 hours", ["Flawless option", "All the loot", "Sherpa quality"], "Hot Offer", 4.9, 142, "Ringed planet"),
  extra("d2-exotic-catalyst-pack", "d2", "exotic", "Exotic Catalyst Pack", 28, "1 day", ["Five catalysts", "Pick the weapons", "Self-play"], undefined, 4.7, 52, "Star"),
  extra("valorant-rank-boost-to-ascendant", "valorant", "rank", "Rank Boost to Ascendant", 59, "3 days", ["Played on your account", "VPN protected", "Live stream"], "Bundle", 4.8, 239, "Bullseye"),
  extra("valorant-coaching-session", "valorant", "coaching", "Coaching Session", 25, "1 hour", ["One-on-one", "VOD review", "Aim routines"], undefined, 4.9, 67, "Headphone"),
  extra("cs2-premier-rating-boost", "cs2", "rank", "Premier Rating Boost", 49, "2 days", ["To the rating you choose", "Duo option", "No cheating, ever"], undefined, 4.7, 111, "Bomb"),
  extra("genshin-impact-abyss-36-stars", "genshin-impact", "abyss", "Abyss 36 Stars", 14, "1 day", ["Every floor", "Your team", "Screenshots as proof"], "Sale", 4.9, 310, "Sparkles"),
  extra("genshin-impact-primogems-top-up", "genshin-impact", "topup", "Primogems Top-up", 29, "15 minutes", ["Official channels", "Instant", "All regions"], undefined, 4.8, 198, "Crystal ball"),
  extra("lol-duo-queue-boost", "lol", "rank", "Duo Queue Boost", 34, "2 days", ["With a top player", "Choose the roles", "Safe"], undefined, 4.8, 150, "Crown"),
  extra("lol-placement-matches", "lol", "placement", "Placement Matches", 17, "1 day", ["Ten games", "High win rate", "Fast start"], undefined, 4.7, 95, "Chess pawn"),
  extra("ea-sports-fc-coins-1m", "ea-sports-fc", "coins", "Coins, 1M", 27, "20 minutes", ["Safe transfer", "Console or PC", "Fast support"], "Hot Offer", 4.8, 330, "Soccer ball"),
];

OFFERS.push(...MORE_OFFERS);
OFFERS.forEach((o) => { o.image = o.image || EXTRA_IMAGES[o.id]; });
// how many times an offer was bought (invented, grows with its reviews)
OFFERS.forEach((o, i) => { o.sold = Math.round(o.reviews * (5 + (i % 4) * 1.5)) + 40; });
export const sold = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K` : String(n));
export const offerOf = (id) => OFFERS.find((x) => x.id === id);

export const REGIONS = ['EU', 'US'];
export const REALMS = { EU: ['Draenor', 'Tarren Mill', 'Silvermoon', 'Kazzak'], US: ['Area 52', 'Illidan', 'Stormrage', 'Tichondrius'] };
export const FACTIONS = ['Alliance', 'Horde'];

const names = ['GoldHarbor', 'MoonMerchant', 'FastTrade', 'NightOwlGold', 'RealmRunner', 'SilverQuill', 'AzerothBank', 'DragonVault', 'CoinSmith', 'LootLine'];
export const SELLERS = names.map((name, i) => {
  const r = rng(seedOf(name));
  return { id: name.toLowerCase(), name, orders: r.int(800, 24000), rating: 4.5 + r.int(0, 5) / 10, online: i % 3 !== 2, stock: r.int(2, 90) * 100, per: +(1.2 + r.int(0, 60) / 100).toFixed(2), eta: r.pick([5, 10, 15, 30]) };
});

export const REVIEWS = [
  ["Shellmeadowstinger", "BEST players ever , never hesitate to call them for any help, versatile and useful, MORE than just gladiators, but Awesome people and teachers, feel free to call for their services ! in one hour I got my desired items! SUPER quick!"],
  ["Zane", "totally awesome ! i loved the gameplay and the skills i've learned, Best players that can carry you even if you play like a sheep! Totally recommend this website and the players that are here!No stress , QUICK , big Damage"],
  ["Crocushollowscribe", "Absolutely fantastic booster, was done within 5 hours of the Elite PvP Set order being placed, very impressive"],
  ["MahoSlime", "Great Service Fast And Trusting First time letting anyone pilot my account and was having a panic attack but the service was top notch"],
  ["Emberpricklehyena", "Awesome team on the website (was assisted by Dean), awesome pilot (thanks again Sunasuna) - fast, efficient, great communication, trustworthy !"],
  ["Sagethreadpiper", "The best and most effective booster ExpertSagar does a good job, I am satisfied with his services. Good mood. Interesting talk. Game knowledge. Execution speed"],
  ["Heelher", "A little bumpy start but not OG's fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!"],
  ["Grovelimesamurai", "Very quick and efficient help! I had never used any service like this before, but the person who helped made it very simple to understand. I really bought this service just to get a quest done, but Overgear really did go above and beyond. 10/10"],
  ["gibsonpraise520", "Sunev was awesome, got everything finished in a timely fashion (based on my availabilty). Super patient and friendly, great teacher"],
  ["Mintpewterpalm", "Absolutely amazing booster, ver professional and great communication. I would want him in charge of my future orders"],
  ["Pricklebrassmoose", "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!"],
  ["Skitterrib", "quick start time, and the booster was very professional in knowing what to do by setting up keybindings and made sure they where set back to the original keybindings i use after he had complete the challenge. and he made the mage tower look so easy :)"],
];

export const FAQ = [
  ['What is boosting?', 'A pro player completes the content for you, or plays with you, and you get the rewards. You choose the service, the date and how it is played'],
  ['Is it safe?', 'Orders are played by verified boosters. You can choose self-play, where you keep control of the character, and we never ask for more than we need'],
  ['How fast does it start?', 'Most orders start within an hour of payment. The estimate on every offer is the usual time to finish, not to start'],
  ['Can I get a refund?', 'Yes. If the order is not started or not completed as described, the money is returned to the card or the wallet it came from'],
  ['Why Overgear?', 'Fixed prices, a guarantee on every order, 24/7 support and more than two million finished orders'],
];

export const PAYMENTS = ['Mastercard', 'Visa', 'PayPal', 'Apple Pay', 'Google Pay', 'Stripe', 'SEPA'];
export const money = (n) => `$${(+n).toFixed(2)}`;
export const SEED_ORDERS = [
  { id: 'OG-482913', date: Date.now() - 86400000 * 9, status: 'Completed', items: [{ title: 'Venomous Abyss Heroic', qty: 1, price: 89 }], total: 89 },
  { id: 'OG-479221', date: Date.now() - 86400000 * 31, status: 'Completed', items: [{ title: 'WoW Gold, 500K', qty: 1, price: 24.5 }], total: 24.5 },
];
