// The page of Torchlight: Infinite, with the content of the real page (overgear.com/games/torchlight-infinite): the title and the lead, the four categories as cards (the picture, the points, the price), the expert,
// the text about the services and the questions. The categories lead to the catalog of the game (the example has no pages of them).
import { Button } from '../../src/components/Button.jsx';
import { Card, ClickableCard } from '../../src/components/Card.jsx';
import { CollapsibleGroup } from '../../src/components/Collapsible.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { go } from './util.js';
import { money, EMOJI } from './data.js';
import { Page, PageHead, Section } from './ui.jsx';

const CDN = (id) => `https://overgear.com/cdn-cgi/image/width=400,quality=85,format=auto/cdn/uploads/${id}.jpeg`;

/** The categories of the real page: the name, the picture, three points (the first one is the accent) and the lowest price. */
const CATEGORIES = [
  { slug: 'flame-elementium', name: 'Flame Elementium', image: CDN('b646a3677c3c8c473796a7c89e12ab75'), points: ['Trade Tax Covered', 'Delivery in 15 minute', 'Any amount in stock'], from: 6.5, hot: true },
  { slug: 'character-leveling', name: 'Character Leveling', image: CDN('2e52d0eda233fc8a79cdb17f78692613'), points: ['Level 1–60 In 3 Hours', 'Mapping-Ready Hero', 'Loot stays with you'], from: 30 },
  { slug: 'acts', name: 'Acts', image: CDN('104604dd534198905ba4d2c3bfb8b77b'), points: ['Completion in 3 hours', 'Endgame unlocked', 'Loot stays with you'], from: 6 },
  { slug: 'rent-a-booster', name: 'Rent a Booster', image: CDN('413eccd38e8e5857083f3a7cb58cab9b'), points: ['Any Task Hourly', 'Hero Farm, You Rest', '15-min Login'], from: 15 },
];

const FAQ = [
  ['When does the next Torchlight: Infinite season start?', 'Season 14, Tartarus, gets its full preview on October 9. The exact launch date is expected to be announced during that stream'],
  ['Which Torchlight: Infinite services are the most popular?', 'Leveling to any point up to 100, campaign completion for players who want the Netherrealm open without replaying the campaign, Flame Elementium for instant Trade House spending, and an hourly pro player for anyone who needs hours of play handled on a custom task'],
  ['Where can I buy Torchlight: Infinite boost I can rely on?', 'At Overgear you work with the platform directly: verified pro players, our own Flame Elementium stock and support available 24/7'],
  ['Is Torchlight: Infinite Boosting Safe?', 'Every session is played by hand — no bots, no scripts. Logins go through a VPN matched to your region, and Flame Elementium arrives through an ordinary Trade House transaction that looks like any other trade between players'],
];

const Bullets = ({ items }) => <ul className="og-bullets">{items.map((b) => <li key={b}><Icon name="Check" size={16} /><span>{b}</span></li>)}</ul>;

function CategoryCard({ c }) {
  return (
    <ClickableCard label={c.name} variant="default" padding={0} onClick={() => go('/catalog/torchlight-infinite')} data-test-id={`tli-category-${c.slug}`}>
      <span className="og-tli">
        <img className="og-tli__art" src={c.image} alt="" loading="lazy" draggable="false" />
        {c.hot && <span className="og-tli__hot"><img src={EMOJI('Fire')} alt="" width="16" height="16" draggable="false" />Hot Offer!</span>}
        <span className="og-tli__body">
          <strong className="og-tli__name">{c.name}</strong>
          <span className="og-tli__points">{c.points.map((p, i) => <span key={p} data-accent={i === 0 || undefined}>{p}</span>)}</span>
          <span className="og-tli__from">From <strong>{money(c.from)}</strong></span>
        </span>
      </span>
    </ClickableCard>
  );
}

export function TorchlightPage() {
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Torchlight: Infinite' }]} title="Torchlight: Infinite Boost">
        <p className="og-text og-lead-text">Reach the Netherrealm sooner, stock Flame Elementium in minutes, and hand the slow sessions to a pro player. Every order is played by hand on your own hero, so <strong className="og-accent">the season you plan actually happens before it ends</strong></p>
      </PageHead>
      <div className="og-tli-grid" data-test-id="tli-categories">{CATEGORIES.map((c) => <CategoryCard key={c.slug} c={c} />)}</div>
      <Card variant="surface" padding={5}>
        <div className="og-stack og-stack--related" data-test-id="tli-expert">
          <div className="og-stack og-stack--hair">
            <h2 className="og-h3">Gear up faster with our Torchlight Infinite Expert — in 60 seconds</h2>
            <p className="og-meta">We'll tell you the fastest route, exact price, and start time — tailored to your goal</p>
          </div>
          <Button variant="primary" size="lg" label="Chat with our Torchlight Infinite Expert" onClick={() => go('/info/contact')} />
        </div>
      </Card>
      <div className="og-stack og-stack--xl og-offer-info">
        <Section title="About Torchlight: Infinite Boosting Services">
          <p className="og-text">A Torchlight: Infinite season lasts about three months, and every new one starts on a fresh server. That window is tight for anyone who plays between work and family, often from a phone. The distance between a newly created hero and one that farms TM8 is counted in evenings, not minutes</p>
          <p className="og-text">Overgear closes that distance with pro players who know Netherrealm routing, Hero Trait setups and Trade House pricing. They take the parts you would rather skip — leveling, story chapters, currency farming — and return a character ready for the part of the game you came for</p>
          <p className="og-text">All work is done manually. There are no scripts and no automation, logins go through a VPN matched to your region, and progress is visible in your order. Anything that drops along the way stays on your character</p>
        </Section>
        <Section title="Why Boost Matters in the Tartarus Season">
          <p className="og-text">Season 14, Tartarus, starts on October 15 at 7 PM PDT (October 16, 02:00 UTC). This time you are the Warden of a Netherrealm prison: track down escaped inmates, fill your cells and end the riot that follows for a pile of rewards. The season also brings Followers — companions from four beast tribes with skills of their own — and Youga's new Hero Trait, The Ultimate One</p>
          <p className="og-text">A new season means a new character, and the first weeks decide how much of it you actually get to enjoy</p>
          <Bullets items={['Your hero reaches mapping level while the season is still young', 'Story chapters closed without replaying content you have already seen', 'Flame Elementium ready for the first wave of Trade House upgrades', 'Timemark progress pushed toward TM8 on your schedule', 'The Ultimate One or the reworked Oracle Thea tried on a ready character', 'Free hours left for prison runs and Follower upgrades']} />
        </Section>
        <Section title="What Overgear Offers for Torchlight: Infinite">
          <p className="og-text">Each option targets a specific bottleneck of the season, and every one of them starts the same way:</p>
          <Bullets items={['Hours of grinding returned to you', 'A pro player on your order within 15 minutes', 'Hand-played sessions with VPN-routed logins', 'Scope adjusted to your goal, not a fixed package']} />
        </Section>
        <Section title="Leveling">
          <p className="og-text">Pick any level up to 100 and a pro player takes your hero there. The slow stretch is the end of the curve — the last levels before the cap take far more mapping than everything before them. That climb is handled for you, and every point earned along the way is ready to spend</p>
        </Section>
        <Section title="Campaign">
          <p className="og-text">Every story chapter and every mandatory boss cleared on your hero, ending at the Netherrealm Device. You log in to an unlocked endgame and start mapping right away instead of walking through the campaign again</p>
        </Section>
        <Section title="Currency">
          <p className="og-text">Flame Elementium comes from our own stock and arrives through a regular Trade House transaction. You list an item at the agreed price, a pro player picks it up by hand, and the FE lands in your mail tab within 15 minutes. The Trade House unlocks at level 60</p>
        </Section>
        <Section title="Hourly Play">
          <p className="og-text">Book a pro player by the hour and set the task yourself — Netherrealm farming, bosses, Timemark progress or anything else you need done. Hours are tracked, and you get notified the moment they are used</p>
        </Section>
        <Section title="Key Features of Torchlight: Infinite">
          <p className="og-text">Torchlight: Infinite is a free-to-play ARPG by XD, released in early access on October 11, 2022 and launched globally on May 9, 2023</p>
          <Bullets items={['Combat with no stamina bars and no skill cooldowns', 'Heroes with Hero Traits that reshape how a build plays', '24 talent tabs and more than 240 skills to combine', 'Netherrealm endgame with Timemark tiers from TM1 to TM8 and beyond', 'A player-driven economy on the Trade House, priced in Flame Elementium', 'Cross-platform progress between PC and mobile on one account']} />
        </Section>
        <Section title="Why Choose a Torchlight: Infinite Carry Service at Overgear">
          <p className="og-text">Short seasons punish slow starts, and handing your account to an anonymous seller adds a risk on top of that. Overgear removes both problems:</p>
          <Bullets items={['You work with the platform directly, not with a random freelancer', 'Flame Elementium comes from our own stock, not resold from third parties', 'Pro players are verified and have played TLI across multiple seasons', 'Play is manual only, with a VPN on every login', 'Every drop from the session stays on your character', 'Support answers around the clock, 24/7']} />
          <p className="og-text">Choose an option above, and your hero starts moving within 15 minutes</p>
        </Section>
        <Section title="Torchlight: Infinite Services FAQ">
          <CollapsibleGroup items={FAQ.map(([q, a], i) => ({ value: String(i), title: q, content: <p className="og-text">{a}</p> }))} />
        </Section>
      </div>
    </Page>
  );
}
