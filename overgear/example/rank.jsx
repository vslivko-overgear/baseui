// The rank of a buyer, as the real service shows it. The rank is in the menu of the profile (a desktop) and in the account tab (a phone), under the nick; a click opens the page of the rank (/rank): the rank, the way to the next
// one, the perks now and in the next rank, all ranks, how ranks work, and the history. The rules are in rank-core.js.
import { useMemo, useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Link } from '../../src/components/Link.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { ProgressBar } from '../../src/components/ProgressBar.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Table, pixel, proportional } from '../../src/components/Table.jsx';
import { go, href, useMedia } from './util.js';
import { money } from './data.js';
import { Page, PageHead } from './ui.jsx';
import { useStore } from './store.jsx';
import { spentLastYear, gradeFor, progressTo, BENEFITS, benefitValue, rankHistory } from './rank-core.js';

/** The rank of the buyer now: the spending of the last 365 days, the rank, the way to the next one and the history. */
export function useRank() {
  const store = useStore();
  return useMemo(() => {
    const now = Date.now();
    const paid = spentLastYear(store.orders, now);
    const grade = gradeFor(paid);
    return { paid, grade, progress: progressTo(paid, grade), history: rankHistory(store.orders, now) };
  }, [store.orders]);
}

/** The picture of a rank: the badge of the loyalty program (assets/ranks), as the real service shows it; it fits a box of `size` pixels. */
export function RankBadge({ grade, size = 40 }) {
  return <img className="og-rankbadge" src={`./assets/ranks/${grade.code}.png`} alt={`${grade.name} rank`} width={size} height={size} draggable="false" />;
}

const dateOf = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function HistoryDialog({ open, onOpenChange, history }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Rank history">
      {history.length ? (
        <List aria-label="Rank history">
          {history.map((e) => <ListItem key={e.createdDate} avatar={<RankBadge grade={e.grade} size={32} />} subtitle={dateOf(e.createdDate)}>{e.grade.name}</ListItem>)}
        </List>
      ) : <p className="og-text">No rank changes yet</p>}
    </Dialog>
  );
}

function Flag({ on }) {
  return on ? <span className="og-rflag og-rflag--on" aria-label="Yes"><Icon name="CheckCircle" size={24} filled /></span> : <span className="og-rflag" aria-label="No"><Icon name="Lock01" size={24} /></span>;
}

/** The perks: what the rank gives now, and what the next one will (the Table of the design system). */
function BenefitsTable({ grade, next }) {
  const wide = useMedia('(max-width: 767px)') ? 72 : 160;   // the columns of the values: wider on a desktop
  const cell = (b, g) => (b.kind === 'percent' ? <strong>{benefitValue(b, g)}</strong> : <Flag on={benefitValue(b, g)} />);
  const columns = [
    { key: 'name', header: 'Benefits', width: proportional(1, { minWidth: 100 }), renderCell: (b) => <span className="og-rtable__name">{b.name}{b.hint && <Hint label={`About ${b.name}`} content={b.hint} />}</span> },
    { key: 'now', header: 'Now', align: 'center', width: pixel(wide), renderCell: (b) => cell(b, grade) },
    ...(next ? [{ key: 'next', header: 'Next', align: 'center', width: pixel(wide), renderCell: (b) => cell(b, next) }] : []),
  ];
  return <Table data={BENEFITS} columns={columns} rowKey="uid" caption="Benefits of the rank" data-test-id="rank-benefits" />;
}

export function RankPage({ onLogin }) {
  const store = useStore();
  const rank = useRank();
  const [history, setHistory] = useState(false);
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Star01" size={28} />} title="Sign in to see your rank" description="Your rank depends on what you spend" actionLabel="Sign in" onAction={onLogin} /></Page>;
  const { grade, paid, progress } = rank;
  const { next } = progress;
  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="rank-page" data-rank={grade.code}>
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Your Rank' }]} media={<Avatar name={store.user.name} src={store.user.avatar} size={64} shape="rounded" />} title={store.user.name} meta={store.user.email} titleTestId="rank-user" />
        <Card variant="surface" padding={5}>
          <div className="og-stack og-stack--lg">
            <div className="og-rank__now">
              <RankBadge grade={grade} size={64} />
              <div className="og-stack og-stack--hair">
                <h2 className="og-h2" data-test-id="rank-name">{grade.name}</h2>
                <p className="og-meta">{`${money(paid)} spent in the last 365 days`}</p>
              </div>
              <div className="og-rank__actions">
                <Link href="https://loyalty.overgear.com/ranks" target="_blank" rel="noopener noreferrer" data-test-id="rank-all">See all ranks</Link>
                <Button variant="secondary" size="md" label="Rank history" onClick={() => setHistory(true)} data-test-id="rank-history" />
              </div>
            </div>
            {progress.isMax ? (
              <div className="og-stack og-stack--close" data-test-id="rank-max">
                <h3 className="og-h3">Maximum rank reached</h3>
                <p className="og-text">You&apos;ve reached the highest rank and unlocked all available perks</p>
              </div>
            ) : (
              <div className="og-stack og-stack--related" data-test-id="rank-progress">
                <ProgressBar size="md" color="success" value={Math.round(progress.percentage)} aria-label={`Progress to ${next.name}`} />
                <div className="og-row og-row--between og-rank__goal">
                  <div className="og-stack og-stack--pair"><strong>{`Spend ${money(progress.left)} more`}</strong><span className="og-meta">to level up</span></div>
                  <div className="og-rank__next"><div className="og-stack og-stack--pair og-rank__nextname"><strong data-test-id="rank-next">{next.name}</strong><span className="og-meta">Next rank</span></div><RankBadge grade={next} size={40} /></div>
                </div>
              </div>
            )}
            <BenefitsTable grade={grade} next={next} />
            <Button variant="secondary" size="lg" width="100%" label="Continue shopping" onClick={() => go('/')} />
          </div>
        </Card>
        <Card variant="surface" padding={5}>
          <div className="og-stack og-stack--lg" data-test-id="rank-how">
            <h2 className="og-h2">How do ranks work?</h2>
            <ol className="og-bullets og-bullets--num og-rank__how">
            <li><span>Ranks are recalculated and updated automatically once a day to ensure the information remains accurate</span></li>
            <li><span>Your rank depends on how much you spend. You can learn more about ranks <Link href="https://loyalty.overgear.com/ranks" target="_blank" rel="noopener noreferrer">here</Link></span></li>
            <li><span>Your rank is based on your spending over the last 365 days. You can review completed orders in <Link href={href('/orders')}>my orders page</Link></span></li>
            </ol>
          </div>
        </Card>
      </div>
      <HistoryDialog open={history} onOpenChange={setHistory} history={rank.history} />
    </Page>
  );
}
