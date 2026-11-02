import { useMemo, useState } from '../../src/react.js';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Token } from '../../src/components/Token.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { Tabs } from '../../src/components/Tabs.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Table, proportional } from '../../src/components/Table.jsx';
import { Collapsible, CollapsibleGroup } from '../../src/components/Collapsible.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Pagination } from '../../src/components/Pagination.jsx';
import { NumberInput } from '../../src/components/NumberInput.jsx';
import { RadioGroup } from '../../src/components/RadioGroup.jsx';
import { Slider } from '../../src/components/Slider.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Banner } from '../../src/components/Banner.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Bleed } from '../../src/components/Layout.jsx';
import { go } from './util.js';
import { GAMES, CATEGORIES, OFFERS, SERVICES, SELLERS, REGIONS, REALMS, FACTIONS, FAQ, WOW_VERSIONS, money, gameOf } from './data.js';
import { matchGames, matchOffers } from './suggest.js';
import { useAddedToCart, Page, PageHead, Section, GameTile, OfferListing, Stars, SortChip } from './ui.jsx';
import { useStore } from './store.jsx';

/** The offers of all the games: a listing like the page of a game, filtered by the group of games and sorted. */
export function Offers({ category = 'All games' }) {
  const [sort, setSort] = useState('popular');
  let list = OFFERS.filter((o) => category === 'All games' || gameOf(o.game)?.category === category);
  list = [...list].sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'rating' ? b.rating - a.rating : b.reviews - a.reviews));
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Games' }]} title="Offers of all the games" />
      <div className="og-stack og-stack--related">
        <div className="og-chiprow">
          <Bleed scroll className="og-chips">
            <TokenGroup size="sm" aria-label="Games" value={[category]} onValueChange={(v) => v.length && go(v[v.length - 1] === 'All games' ? '/games' : `/games?c=${encodeURIComponent(v[v.length - 1])}`)} options={CATEGORIES.map((c) => ({ value: c, label: c === 'All games' ? 'All offers' : c }))} />
          </Bleed>
            <SortChip value={sort} onValueChange={setSort} options={[{ value: 'popular', label: 'Popular' }, { value: 'price', label: 'Price, low to high' }, { value: 'rating', label: 'Rating' }]} />
        </div>
        {list.length ? <OfferListing offers={list} /> : <Status status="neutral" title="No offers here yet" description="Try another group of games" />}
      </div>
    </Page>
  );
}

/** The results of the header search: games and services that match. */
export function SearchResults({ q = '' }) {
  const games = matchGames(q);
  const offers = matchOffers(q);
  return (
    <Page>
      <PageHead title={q ? `Results for “${q}”` : 'Search'} meta={`${games.length} games, ${offers.length} offers`} />
      {games.length > 0 && <Section title="Games"><div className="og-grid og-grid--games">{games.map((g) => <GameTile key={g.slug} game={g} />)}</div></Section>}
      {offers.length > 0 && <Section title="Offers"><OfferListing offers={offers} /></Section>}
      {!games.length && !offers.length && <Status status="neutral" title="Nothing found" description="Check the spelling or try a game name" actionLabel="All games" actionVariant="secondary" onAction={() => go('/catalog')} />}
    </Page>
  );
}

/** The game page: version tabs, the services menu, the offers and the questions. Only World of Warcraft has offers here. */
export function Game({ slug, service = 'hot' }) {
  const game = gameOf(slug);
  const [version, setVersion] = useState('Midnight');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  if (!game) return <Page><Status status="neutral" title="Game not found" actionLabel="All games" onAction={() => go('/catalog')} /></Page>;
  if (game.category !== 'World of Warcraft') {
    return (
      <Page crumbs>
        <div className="og-stack og-stack--crumbs">
          <Breadcrumbs items={[{ label: 'Home', href: '#/' }, { label: 'Games', href: '#/games' }, { label: game.name }]} showCurrent={false} />
          <Status status="neutral" title={`${game.name} offers are on the way`} description="This example has the full catalog for World of Warcraft only" actionLabel="Open World of Warcraft" onAction={() => go('/games/wow')} />
        </div>
      </Page>
    );
  }
  let list = OFFERS.filter((o) => service === 'hot' ? !!o.badge : o.service === service);
  list = [...list].sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'rating' ? b.rating - a.rating : b.reviews - a.reviews));
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Games', href: '#/games' }, { label: 'World of Warcraft' }]} title="WoW boost, professional World of Warcraft boosting service" />
      <Tabs label="Game version" size="md" value={version} onValueChange={setVersion} items={WOW_VERSIONS.map((v) => ({ value: v, label: v }))}>
        <div className="og-stack og-stack--related">
        <div className="og-chiprow">
          <Bleed scroll className="og-chips">
            <TokenGroup size="sm" aria-label="Type of offers" value={[service]} onValueChange={(v) => v.length && go(`/games/wow?s=${v[v.length - 1]}`)} options={SERVICES.filter((s) => s.id !== 'gold').map((s) => ({ value: s.id, label: s.id === 'hot' ? 'All offers' : s.label }))} />
          </Bleed>
            <SortChip value={sort} onValueChange={(v) => { setSort(v); setPage(1); }} options={[{ value: 'popular', label: 'Popular' }, { value: 'price', label: 'Price, low to high' }, { value: 'rating', label: 'Rating' }]} />
        </div>
        {list.length ? <OfferListing offers={list} /> : <Status status="neutral" title="No offers here yet" description="Try another type" />}
        </div>
      </Tabs>
      <Section title="Questions about boosting"><Faq /></Section>
    </Page>
  );
}

export function Faq() {
  return <CollapsibleGroup items={FAQ.map(([q, a], i) => ({ value: String(i), title: q, content: <p className="og-text">{a}</p> }))} />;
}

/** The gold page: region, realm and faction, then the sellers, and a purchase panel for the chosen one. */
export function Gold() {
  const store = useStore();
  const [region, setRegion] = useState('EU');
  const [realm, setRealm] = useState('Draenor');
  const [faction, setFaction] = useState('Alliance');
  const [online, setOnline] = useState(false);
  const [sort, setSort] = useState('price');
  const [pick, setPick] = useState(SELLERS[0].id);
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState('mail');
  const [character, setCharacter] = useState('');
  const addedToCart = useAddedToCart();
  const sellers = useMemo(() => [...SELLERS].filter((s) => !online || s.online).sort((a, b) => (sort === 'price' ? a.per - b.per : b.orders - a.orders)), [online, sort]);
  const seller = SELLERS.find((s) => s.id === pick) || sellers[0];
  const price = +((amount / 1000) * seller.per * (method === 'express' ? 1.1 : 1)).toFixed(2);
  const [tried, setTried] = useState(false);
  const noName = !character.trim();
  const add = () => {
    setTried(true);
    if (noName) { document.getElementById('og-character')?.focus(); return; }
    store.add({ key: `gold-${seller.id}-${realm}-${amount}-${method}`, title: `WoW Gold, ${amount}K`, sub: `${region} ${realm}, ${faction}, ${seller.name}, ${method === 'mail' ? 'Mail' : method === 'trade' ? 'Trade' : 'Express'}`, price, character });
    addedToCart();
  };
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'World of Warcraft', href: '#/games/wow' }, { label: 'WoW Gold' }]} title="Buy WoW Gold, cheap World of Warcraft gold for sale" meta="383,230 gold orders completed. Most orders arrive within 15 minutes" />
      <div className="og-split og-split--right">
        <div className="og-stack og-stack--lg">
          <div className="og-row">
            <Selector size="sm" label="Region" value={region} onValueChange={(v) => { setRegion(v); setRealm(REALMS[v][0]); }} options={REGIONS.map((r) => ({ value: r, label: r }))} />
            <Selector size="sm" label="Realm" value={realm} onValueChange={setRealm} options={REALMS[region].map((r) => ({ value: r, label: r }))} />
            <Selector size="sm" label="Faction" value={faction} onValueChange={setFaction} options={FACTIONS.map((r) => ({ value: r, label: r }))} />
          </div>
          <div className="og-row og-row--between">
            <Switch label="Seller online" checked={online} onCheckedChange={setOnline} />
            <SortChip value={sort} onValueChange={setSort} options={[{ value: 'price', label: 'Price' }, { value: 'reliability', label: 'Reliability' }]} />
          </div>
          <div className="og-table-wrap">
            <Table
              data={sellers}
              rowKey="id"
              caption="Gold sellers"
              hoverable
              onRowClick={(s) => setPick(s.id)}
              selectionMode="single"
              selectedKeys={[pick]}
              onSelectionChange={(k) => k[0] && setPick(k[0])}
              columns={[
                { key: 'name', header: 'Seller', width: proportional(2, { minWidth: 160 }), renderCell: (s) => <span className="og-row">{s.name}{s.online && <Badge variant="success" size="sm" label="Online" />}</span> },
                { key: 'rating', header: 'Reliability', width: proportional(2, { minWidth: 150 }), renderCell: (s) => <Stars value={s.rating} reviews={s.orders} /> },
                { key: 'stock', header: 'In stock', width: proportional(1, { minWidth: 90 }), renderCell: (s) => `${s.stock}K` },
                { key: 'per', header: 'Per 1K', width: proportional(1, { minWidth: 80 }), renderCell: (s) => money(s.per) },
              ]}
            />
          </div>
        </div>
        <Card variant="surface" padding={5}>
          <div className="og-stack og-stack--lg og-sticky">
            <h2 className="og-h3">{seller.name}</h2>
            <Slider label="Gold, thousands" min={50} max={Math.max(100, seller.stock)} step={50} value={Math.min(amount, seller.stock)} onValueChange={(v) => setAmount(v)} showValue />
            <RadioGroup title="Delivery" value={method} onValueChange={setMethod} options={[{ value: 'mail', label: 'Mail' }, { value: 'trade', label: 'Trade' }, { value: 'express', label: 'Express, +10%' }]} />
            <TextInput id="og-character" label="Character name" value={character} onChange={(e) => { setCharacter(e.target.value); setTried(false); }} status={tried && noName ? 'error' : undefined} caption={tried && noName ? 'Enter the name of the character that gets the gold' : 'Check the spelling: gold goes to this character'} />
            <div className="og-stack">
              <p className="og-price">{money(price)}</p>
              <Button variant="primary" size="lg" width="100%" label="Add to cart" onClick={add} />
            </div>
          </div>
        </Card>
      </div>
      <Section title="Questions about gold"><Faq /></Section>
    </Page>
  );
}
