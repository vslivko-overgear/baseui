// Gallery templates: grids of tiles, with filters beside or above them.
import { useState } from '../react.js';
import { Card, ClickableCard } from '../components/Card.jsx';
import { Stack, Grid } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Token } from '../components/Token.jsx';
import { TokenGroup } from '../components/TokenGroup.jsx';
import { Selector } from '../components/Selector.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { CheckboxGroup } from '../components/CheckboxGroup.jsx';
import { RatingDisplay } from '../components/Rating.jsx';
import { Status } from '../components/Status.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Panel, money } from './_kit.jsx';

const KINDS = ['Nature', 'City', 'People', 'Objects'];
const ITEMS = Array.from({ length: 12 }, (_, i) => ({ id: i, title: `${KINDS[i % 4]} study ${Math.floor(i / 4) + 1}`, kind: KINDS[i % 4], tall: [0, 3, 4, 7, 9].includes(i) }));
const Pic = ({ ratio = '4 / 3', label }) => <div className="tpl-image" role="img" aria-label={label} style={{ aspectRatio: ratio }}><Icon name="Image01" size={28} /></div>;

const useKind = () => {
  const [kind, setKind] = useState('All');
  return [kind, setKind, ITEMS.filter((i) => kind === 'All' || i.kind === kind)];
};
// the tabs own what they filter: the items are their panel
const KindTabs = ({ kind, setKind, children }) => <Tabs label="Category" value={kind} onValueChange={setKind} items={['All', ...KINDS].map((k) => ({ value: k, label: k }))}>{children}</Tabs>;

export function CardGrid() {
  const [kind, setKind, shown] = useKind();
  return (
    <Page>
      <PageHeader title="Collection" subtitle={`${shown.length} items`} />
      <KindTabs kind={kind} setKind={setKind}>
      {shown.length ? <Grid columns="repeat(auto-fill, minmax(min(240px, 100%), 1fr))" gap={4}>{shown.map((i) => <ClickableCard variant="surface" key={i.id} label={i.title} padding={3} onClick={() => {}}><Stack gap={3}><Pic label={i.title} /><Stack direction="row" justify="space-between" align="center"><span className="tpl-text">{i.title}</span><Badge variant="secondary" label={i.kind} /></Stack></Stack></ClickableCard>)}</Grid> : <Status title="Nothing here" description="Try another category" />}
      </KindTabs>
    </Page>
  );
}

export function ClassicGallery() {
  const [kind, setKind, shown] = useKind();
  return (
    <Page width={960}>
      <PageHeader title="Gallery" />
      <Stack direction="row" gap={2} wrap>{['All', ...KINDS].map((k) => <Token key={k} pressed={kind === k} onPressedChange={() => setKind(k)}>{k}</Token>)}</Stack>
      <Grid columns="repeat(auto-fill, minmax(min(200px, 100%), 1fr))" gap={3}>{shown.map((i) => <Pic key={i.id} label={i.title} ratio="1 / 1" />)}</Grid>
    </Page>
  );
}

export function MixedGallery() {
  const [kind, setKind, shown] = useKind();
  return (
    <Page>
      <PageHeader title="Moodboard" />
      <KindTabs kind={kind} setKind={setKind}>
      <div className="tpl-masonry">{shown.map((i) => <div key={i.id} className="tpl-masonry__item"><Pic label={i.title} ratio={i.tall ? '3 / 4' : '4 / 3'} /></div>)}</div>
      </KindTabs>
    </Page>
  );
}

const PRODUCTS = [['Standing desk', 590, 4], ['Monitor arm', 130, 5], ['Desk lamp', 74, 4], ['Chair', 420, 3], ['Keyboard', 160, 5], ['Headphones', 220, 4]].map(([name, price, rating], id) => ({ id, name, price: Number(price), rating: Number(rating) }));
function ProductCard({ p }) {
  return <ClickableCard variant="surface" label={p.name} padding={3} onClick={() => {}}><Stack gap={2}><Pic label={p.name} /><span className="tpl-text">{p.name}</span><RatingDisplay value={p.rating} size="sm" /><strong className="tpl-text">{money(p.price)}</strong></Stack></ClickableCard>;
}

export function ProductGallery() {
  const [sort, setSort] = useState('popular');
  const list = [...PRODUCTS].sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : a.id - b.id));
  return (
    <Page>
      <PageHeader title="Workspace" subtitle={`${list.length} products`} actions={<Selector size="sm" label="Sort by" value={sort} onValueChange={setSort} options={[{ value: 'popular', label: 'Popular' }, { value: 'low', label: 'Price, low to high' }, { value: 'high', label: 'Price, high to low' }]} />} />
      <TokenGroup size="sm" title="Filter" options={['All', 'Desks', 'Chairs', 'Accessories'].map((v) => ({ value: v, label: v }))} defaultValue={['All']} />
      <Grid columns="repeat(auto-fill, minmax(min(220px, 100%), 1fr))" gap={4}>{list.map((p) => <ProductCard key={p.id} p={p} />)}</Grid>
    </Page>
  );
}

export function SideGallery() {
  const [cats, setCats] = useState(['Desks']);
  const list = PRODUCTS.filter((_, i) => !cats.length || cats.includes(['Desks', 'Accessories', 'Accessories', 'Chairs', 'Accessories', 'Accessories'][i]));
  return (
    <Page width={1120}>
      <PageHeader title="Shop" subtitle={`${list.length} results`} />
      <div className="tpl-split" style={{ gridTemplateColumns: '220px minmax(0, 1fr)' }}>
        <Panel title="Category"><CheckboxGroup value={cats} onValueChange={setCats} options={['Desks', 'Chairs', 'Accessories'].map((v) => ({ value: v, label: v }))} /></Panel>
        {list.length ? <Grid columns="repeat(auto-fill, minmax(min(200px, 100%), 1fr))" gap={4}>{list.map((p) => <ProductCard key={p.id} p={p} />)}</Grid> : <Status title="No results" description="Clear a filter to see more" actionLabel="Clear filters" actionVariant="secondary" onAction={() => setCats([])} />}
      </div>
    </Page>
  );
}
