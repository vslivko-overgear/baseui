// The catalog: a classifier of the pages of the shop. It leads to the listings (games.jsx), where the products are.
//   /catalog            the games, in one list (a search, a sort and a row for each game)
//   /catalog/:slug      the kinds of offers of a game (a row opens the listing of that kind)
// On a desktop both are one page of two columns: the games on the left, the kinds of the chosen game on the right. On a phone the left column is the page /catalog, and a game opens the second.
import { useState } from '../../src/react.js';
import { TextInput } from '../../src/components/TextInput.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Status } from '../../src/components/Status.jsx';
import { ControlRow } from '../../src/components/Layout.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { Dropdown } from '../../src/components/Dropdown.jsx';
import { IconButton } from '../../src/components/Button.jsx';
import { Token } from '../../src/components/Token.jsx';
import { CollapsibleGroup } from '../../src/components/Collapsible.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Navbar } from '../../src/components/MobileNavigation.jsx';
import { go, href } from './util.js';
import { GAMES, EMOJI, catalogOf, gameOf } from './data.js';
import { Page } from './ui.jsx';

/** The games of the shop on a phone: the left column of the catalog of a desktop, as a page. A game opens its kinds of offers (CatalogGame). */
export function Catalog() {
  return (
    <Page>
      <GamesColumn onSelect={(slug) => go(`/catalog/${slug}`)} />
    </Page>
  );
}

/** The top bar of a catalog page of a game on a phone: it is the bar of the screen, so it sits outside the padded page and spans the whole width. */
export function CatalogBar({ slug }) {
  const game = gameOf(slug);
  return <Navbar title={game?.name || 'Game'} onBack={() => go('/catalog')} />;
}

/** Opens the listing of a group of offers of a game (the gold of WoW has its own page). */
const openKind = (game, id) => go(id === 'gold' && game.category === 'World of Warcraft' ? '/games/wow/gold' : id === 'hot' ? `/games/${game.slug}` : `/games/${game.slug}?s=${id}`);

/** The quick links of a game: a row of chips with a picture. */
function QuickLinks({ game, onChoose }) {
  return (
    <div className="og-quick">
      {catalogOf(game).quick.map((q) => (
        <Token key={q.label} action="press" icon={<img src={EMOJI(q.emoji)} alt="" width="20" height="20" draggable="false" />} onClick={() => { onChoose?.(); openKind(game, q.id); }}>{q.label}</Token>
      ))}
    </div>
  );
}

/** The groups of offers of a game on a desktop: blocks in columns, a heading and the kinds under it; every line opens a listing. */
function CatalogBlocks({ game, onChoose }) {
  const go1 = (id) => (e) => { e.preventDefault(); onChoose?.(); openKind(game, id); };
  return (
    <div className="og-blocks">
      {catalogOf(game).groups.map((g) => (
        <section key={g.id} className="og-block" aria-label={g.label}>
          <h3 className="og-block__title"><a href={href(`/games/${game.slug}?s=${g.id}`)} onClick={go1(g.id)}>{g.label}</a></h3>
          <ul className="og-block__list">
            {g.items.map((it) => <li key={it}><a href={href(`/games/${game.slug}?s=${g.id}`)} onClick={go1(g.id)}>{it}</a></li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** The left column of the catalog: a search, a sort and a row for each game. `active` marks the game that is open on its right (a desktop); `onSelect(slug)` says which one was chosen. */
function GamesColumn({ active, onSelect }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('popular');
  const list = GAMES.filter((g) => g.name.toLowerCase().includes(q.toLowerCase()));
  if (sort !== 'popular') list.sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  return (
    <div className="og-stack og-catalog__left">
      <ControlRow size="md">
        <TextInput type="search" className="og-catalog__search" label="Find a game" value={q} onChange={(e) => setQ(e.target.value)} />
        <Dropdown
          placement="bottom-end"
          label="Sort games"
          value={sort}
          onValueChange={setSort}
          options={[{ value: 'popular', label: 'By popularity' }, { value: 'az', label: 'A to Z' }, { value: 'za', label: 'Z to A' }]}
          trigger={<IconButton variant="secondary" label="Sort games" tooltip={false} icon={<Icon name="SwitchVertical01" size={24} />} />}
        />
      </ControlRow>
      <div className="og-catalog__games bui-list-scroll">
        <List aria-label="Games">
          {list.map((g) => <ListItem key={g.slug} active={g.slug === active} onClick={() => onSelect(g.slug)} details={<Icon name="ChevronRight" size={20} />}>{g.name}</ListItem>)}
        </List>
        {!list.length && <Status status="neutral" title="No game found" description="Try another name" />}
      </div>
    </div>
  );
}

/** The two columns of the catalog: the games on the left (with a search) and the kinds of offers of the chosen game on the right. A kind opens its listing. */
export function CatalogColumns({ slug, onChoose, select }) {
  const [active, setActive] = useState(slug || GAMES[0].slug);
  const game = gameOf(active) || GAMES[0];
  return (
    <div className="og-catalog">
      <GamesColumn active={game.slug} onSelect={(s) => (select ? select(s) : setActive(s))} />
      <Divider orientation="vertical" />
      <div className="og-stack og-stack--group og-catalog__right">
        <div className="og-stack">
          <h2 className="og-catalog__title">{game.name}</h2>
          <QuickLinks game={game} onChoose={onChoose} />
        </div>
        <CatalogBlocks game={game} onChoose={onChoose} />
      </div>
    </div>
  );
}

/** The catalog as a page of a desktop (a direct link): the columns under a title. */
export function CatalogDesktop({ slug }) {
  return (
    <Page>
      <CatalogColumns key={slug} slug={slug} select={(s) => go(`/catalog/${s}`)} />
    </Page>
  );
}

/** The groups of offers of a game on a phone: the quick links, then a section per group that opens into its kinds; every line opens a listing. */
export function CatalogGame({ slug }) {
  const game = gameOf(slug);
  if (!game) return <Page><Status status="neutral" title="Game not found" actionLabel="Catalog" onAction={() => go('/catalog')} /></Page>;
  return (
    <Page>
      <QuickLinks game={game} />
      <CollapsibleGroup
        multiple
        items={catalogOf(game).groups.map((g) => ({
          value: g.id,
          title: g.label,
          content: (
            <List aria-label={g.label}>
              <ListItem onClick={() => openKind(game, g.id)} details={<Icon name="ChevronRight" size={20} />}>{`All ${g.label}`}</ListItem>
              {g.items.map((it) => <ListItem key={it} onClick={() => openKind(game, g.id)} details={<Icon name="ChevronRight" size={20} />}>{it}</ListItem>)}
            </List>
          ),
        }))}
      />
    </Page>
  );
}
