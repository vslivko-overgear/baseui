// The rank of a buyer, as the real service shows it. The rank is in the menu of the profile (a desktop) and in the account tab (a phone), under the nick; a click opens the page of the rank (/rank): the rank, the way to the next
// one, the perks now and in the next rank, all ranks, how ranks work, and the history. The rules are in rank-core.js.
import { useMemo, useState } from '../../src/react.js';
import { Badge } from '../../src/components/Badge.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Link } from '../../src/components/Link.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { ProgressBar } from '../../src/components/ProgressBar.jsx';
import { Status } from '../../src/components/Status.jsx';
import { go, href } from './util.js';
import { money } from './data.js';
import { Page, PageHead, Section } from './ui.jsx';
import { useStore } from './store.jsx';
import { GRADES, spentLastYear, gradeFor, progressTo, BENEFITS, benefitValue, rankHistory } from './rank-core.js';

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

/** The picture of a rank: a shield in the color of the rank, with as many chevrons as its level. */
export function RankBadge({ grade, size = 40 }) {
  const chevrons = Array.from({ length: grade.level }, (_, i) => 34 - i * 6);
  return (
    <svg width={size} height={Math.round(size * 1.15)} viewBox="0 0 40 46" fill="none" role="img" aria-label={`${grade.name} rank`} className="og-rankbadge">
      <path d="M20 1.5 37.5 8v14.5C37.5 33 29.5 41.5 20 44.5 10.5 41.5 2.5 33 2.5 22.5V8L20 1.5Z" fill={grade.color} />
      <path d="M20 1.5 37.5 8v14.5C37.5 33 29.5 41.5 20 44.5V1.5Z" fill="#000" opacity="0.14" />
      {chevrons.map((y) => <path key={y} d={`M13 ${y} L20 ${y - 6.5} L27 ${y}`} stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />)}
    </svg>
  );
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

/** The perks: what the rank gives now, and what the next one will. */
function BenefitsTable({ grade, next }) {
  const cell = (b, g) => (b.kind === 'percent' ? <strong>{benefitValue(b, g)}</strong> : <Flag on={benefitValue(b, g)} />);
  return (
    <table className="og-rtable" data-test-id="rank-benefits">
      <thead><tr><th scope="col">Benefits</th><th scope="col" className="og-rtable__now">Now</th>{next && <th scope="col">Next</th>}</tr></thead>
      <tbody>
        {BENEFITS.map((b) => (
          <tr key={b.uid}>
            <th scope="row"><span className="og-rtable__name">{b.name}{b.hint && <Hint label={`About ${b.name}`} content={b.hint} />}</span></th>
            <td className="og-rtable__now">{cell(b, grade)}</td>
            {next && <td>{cell(b, next)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
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
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Your Rank' }]} title="Your Rank" meta="Your rank impacts cashback rates, order priority, and other perks" />
        <Card variant="surface" padding={5}>
          <div className="og-stack og-stack--lg">
            <div className="og-rank__now">
              <RankBadge grade={grade} size={64} />
              <div className="og-stack og-stack--hair">
                <h2 className="og-h2" data-test-id="rank-name">{grade.name}</h2>
                <p className="og-meta">{`${money(paid)} spent in the last 365 days`}</p>
              </div>
              <Button variant="secondary" size="md" label="Rank history" onClick={() => setHistory(true)} data-test-id="rank-history" />
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
                  <div className="og-stack og-stack--hair"><strong>{`Spend ${money(progress.left)} more`}</strong><span className="og-meta">to level up</span></div>
                  <div className="og-rank__next"><div className="og-stack og-stack--hair og-rank__nextname"><strong data-test-id="rank-next">{next.name}</strong><span className="og-meta">Next rank</span></div><RankBadge grade={next} size={40} /></div>
                </div>
              </div>
            )}
            <BenefitsTable grade={grade} next={next} />
            <Button variant="secondary" size="lg" width="100%" label="Continue shopping" onClick={() => go('/')} />
          </div>
        </Card>
        <Section title="All ranks">
          <List aria-label="All ranks" data-test-id="rank-all">
            {GRADES.map((g) => (
              <ListItem key={g.code} avatar={<RankBadge grade={g} size={32} />} subtitle={g.paidUsd ? `From ${money(g.paidUsd)} spent in 365 days · cashback ${g.cashbackPercentage}% · coins pay up to ${g.purchaseLimitPercentage}%` : `Everyone starts here · cashback ${g.cashbackPercentage}% · coins pay up to ${g.purchaseLimitPercentage}%`} details={g.code === grade.code ? <Badge variant="info" size="sm" label="Your rank" /> : undefined}>{g.name}</ListItem>
            ))}
          </List>
        </Section>
        <Section title="How do ranks work?">
          <ol className="og-bullets og-bullets--num">
            <li>Ranks are recalculated and updated automatically once a day to ensure the information remains accurate</li>
            <li>Your rank depends on how much you spend. You can learn more about ranks <Link href="https://loyalty.overgear.com/ranks" target="_blank" rel="noopener noreferrer">here</Link></li>
            <li>Your rank is based on your spending over the last 365 days. You can review completed orders in <Link href={href('/orders')}>my orders page</Link></li>
          </ol>
        </Section>
      </div>
      <HistoryDialog open={history} onOpenChange={setHistory} history={rank.history} />
    </Page>
  );
}
