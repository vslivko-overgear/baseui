import { useState, useRef, useEffect } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { Skeleton } from '../../src/components/Skeleton.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { go, useMedia, useWidth } from './util.js';
import { loadTheme } from '../../site/theme.js';
import { COOKIE } from '../theme.js';
import { audienceOf, tileLayout, splitOffers, gameTabs, TILE_GAP, fitTiles } from '../audience.js';
import { GAMES, OFFERS, REVIEWS, TILE_ROWS, gameOf, kindsOf } from './data.js';
import { Bleed } from '../../src/components/Layout.jsx';
import { Page, Section, GameTile, GameChip, OfferListing } from './ui.jsx';

// the 3D icons of the headline: the blue ones of Overgear (assets/hero), 160 px for a 50 px icon, so they stay sharp on a screen of 3x
const ART = './assets/hero';

/** A word of the headline with a small 3D icon before it. Each kind of icon has its own short move: a gem shines, a coin spins, a trophy jumps.
 *  The icons play one at a time on their own, and a click on an icon plays it too (decorative: it is not a control). */
function Word({ art, kind, playing, onPlay, onEnd, children }) {
  return (
    <span className="og-nowrap">
      <span className={`og-hero__ico${playing ? ` is-playing is-${kind}` : ''}`} aria-hidden="true" onClick={onPlay} onAnimationEnd={onEnd}>
        <img src={`${ART}/${art}`} alt="" width="44" height="44" draggable="false" />
      </span>
      {children}
    </span>
  );
}

/** The count of orders: now and then it grows by a few, and the number runs up to the new value with a small pop. With the animations off it stays still. */
function Orders({ start }) {
  const [value, setValue] = useState(start);
  const [bump, setBump] = useState(false);
  const shown = useRef(start);
  const [text, setText] = useState(start);
  useEffect(() => {
    const off = () => !parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--baseui-duration-500'));
    let timer;
    const schedule = () => { timer = setTimeout(() => { if (!off() && !document.hidden) setValue((v) => v + 1 + Math.floor(Math.random() * 3)); schedule(); }, 5000 + Math.random() * 4000); };
    schedule();
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (value === shown.current) return undefined;
    const from = shown.current;
    const t0 = performance.now();
    let raf;
    setBump(true);
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 700);
      const eased = 1 - (1 - k) ** 3;
      shown.current = Math.round(from + (value - from) * eased);
      setText(shown.current);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setBump(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={`og-orders${bump ? ' is-bump' : ''}`}>{text.toLocaleString('en-US')}</span>;
}


/** Which icon plays now: one after another every few seconds, unless the animations are off. */
function useTakeTurns(count, every = 3600) {
  const [now, setNow] = useState(-1);
  const turn = useRef(0);
  useEffect(() => {
    const off = () => !parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--baseui-duration-500'));
    const id = setInterval(() => {
      if (off() || document.hidden) return;
      setNow(turn.current % count);
      turn.current += 1;
    }, every);
    return () => clearInterval(id);
  }, [count, every]);
  return [now, setNow];
}

const OG = 'https://overgear.com';
const MAX_LOADED = 100;
const BENEFITS = [
  ['diamond', 'Best value for your money', 'We carefully monitor the market every day to get you the best deals from the top level professional suppliers'],
  ['shield', '100% Moneyback Guarantee', 'Our deals protection guarantees that you will get the currency, item, service you paid for or your money back!'],
  ['globe', 'One-stop shop for all your gaming needs', 'Whether you seek top quality services or to bargain with sellers on the marketplace - we got you covered'],
];
const STEPS = [
  ['Browse our catalog and select a service or a product', 'Choose from our catalog of carefully picked and ID-verified players'],
  ['Book your slot with payment', 'We put your money on hold in a safe place until you confirm completion'],
  ['The Magic Begins!', 'The Pro-player will do their best to start ASAP and complete your order within the deadline'],
  ['Confirm Completion', 'This will automatically release the payment to the player'],
];

/** The reviews: five orange stars each; on a desktop two buttons scroll the row sideways (a phone swipes it). */
function Reviews() {
  const row = useRef(null);
  const by = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <Section
      title="What our clients say"
      action={<div className="og-arrows"><IconButton variant="secondary" size="sm" label="Previous reviews" icon={<Icon name="ChevronLeft" size={20} />} onClick={() => by(-1)} /><IconButton variant="secondary" size="sm" label="Next reviews" icon={<Icon name="ChevronRight" size={20} />} onClick={() => by(1)} /></div>}
    >
      <div className="og-scroller" ref={row}>
        {REVIEWS.map(([name, text]) => (
          <Card key={name} variant="surface" padding={5}>
            <div className="og-stack">
              <div className="og-row"><Avatar alt={name} size="sm" shape="rounded" /><span className="og-text">{name}</span></div>
              <span className="og-stars" role="img" aria-label="5 out of 5">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="Star01" size={20} filled aria-hidden="true" />)}</span>
              <p className="og-text" data-user-content>{text}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function Home() {
  const [playing, setPlaying] = useTakeTurns(3);
  const turn = (i) => ({ playing: playing === i, onPlay: () => setPlaying(i), onEnd: () => setPlaying(-1) });
  // the tabs of the listing are games: All games is the one that is open, the game of the audience is the next to it
  const [category, setCategory] = useState('all');
  // with a game open, a second level of tabs: the kinds of its offers (a game with one kind has no second level)
  const [chosenKind, setKind] = useState('all');
  const kinds = category === 'all' ? [] : kindsOf(OFFERS.filter((o) => o.game === category));
  // the kind chosen for another game does not apply to this one (derived, so there is no render with a kind the game does not have)
  const kind = kinds.some((k) => k.id === chosenKind) ? chosenKind : 'all';
  // who the page is made for (the Theme setting of the showcase): its game leads the tiles and the listing
  const audience = audienceOf(loadTheme(COOKIE));
  const tiles = tileLayout(TILE_ROWS, audience);
  // on a desktop the games are a grid of equal columns that always fits the width, with no scroll: two rows of six (the family of the audience first, then the others in their order); the games that do not fit are left out
  const mobile = useMedia('(max-width: 767px)');
  const [gamesRef, gamesWidth] = useWidth();
  const fitted = gamesWidth ? fitTiles(tiles, gamesWidth) : null;
  // the products of the game of the audience come first; the products of the other games take turns, so the first screen is varied
  const products = (() => {
    const [own, rest] = splitOffers(OFFERS.filter((o) => (category === 'all' || o.game === category) && (kind === 'all' || o.service === kind)), audience);
    const by = new Map();
    for (const o of rest) by.set(o.game, [...(by.get(o.game) || []), o]);
    const lists = [...by.values()];
    const out = [...own];
    for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
    return out;
  })();
  // Popular products: two rows and a Show more button; the same products come again, up to MAX_LOADED
  const [loaded, setLoaded] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => { setLoaded(20); }, [category, kind]);
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => { setLoaded((n) => n + 20); setLoadingMore(false); }, 700);
  };
  return (
    <Page roomy>
      <div className="og-lead">
        <div className="og-hero">
          <div className="og-stack og-stack--tight og-hero__head">
            <h1>
              Save your time getting <Word art="gem.webp" kind="shine" {...turn(0)}>items</Word>,{' '}
              <Word art="coin.webp" kind="spin" {...turn(1)}>currency</Word> and <Word art="trophy.webp" kind="jump" {...turn(2)}>skills</Word>
            </h1>
          </div>
          <div className="og-stack og-stack--tight og-hero__stats">
            <p className="og-hero__rating">
              <Icon name="Star01" size={20} filled />
              <span className="og-text">4.9 out of 5 from our clients</span>
            </p>
            <p className="og-text"><Orders start={2318976} /> orders completed</p>
          </div>
        </div>
        <section className="og-section" aria-label="Games">
          {mobile ? (
            <Bleed scroll>
              <div className="og-tiles">
                {tiles.group.length > 0 && (
                  <div className="og-grows">
                    {tiles.group.map((row, i) => (
                      <div key={i} className="og-grow">
                        {row.map(([slug, width]) => <GameChip key={slug} slug={slug} width={width} />)}
                      </div>
                    ))}
                  </div>
                )}
                <div className="og-grows">
                  {tiles.rows.map((row, i) => (
                    <div key={i} className="og-grow">
                      {row.map(([slug, width]) => <GameChip key={slug} slug={slug} width={width} />)}
                    </div>
                  ))}
                </div>
              </div>
            </Bleed>
          ) : (
            <div className="og-tiles og-tiles--fit" ref={gamesRef} data-test-id="home-games">
              {fitted?.blocks.map(({ rows, length }, b) => (
                <div key={b} className="og-grows" style={{ flex: `${length} 1 0` }} data-test-id="home-games-block">
                  {rows.map((row, i) => (
                    <div key={i} className="og-grow">
                      {row.map(([slug, width]) => <GameChip key={slug} slug={slug} grow={width} />)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
        <Section title="Popular products" close>
          <div className="og-stack og-stack--tight">
            <Bleed scroll className="og-chips">
              <TokenGroup
                size="sm"
                aria-label="Game"
                value={[category]}
                onValueChange={(v) => v.length && setCategory(v[v.length - 1])}
                options={[{ value: 'all', label: 'All Games' }, ...gameTabs(audience, TILE_ROWS.flat().map(([slug]) => slug), OFFERS.map((o) => o.game)).slice(0, -2).filter((slug) => slug !== 'cs2').map((slug) => ({ value: slug, label: gameOf(slug).name }))]}
              />
            </Bleed>
            {kinds.length > 1 && (
              <Bleed scroll className="og-chips">
                <TokenGroup
                  size="sm"
                  aria-label="Kind of offer"
                  value={[kind]}
                  onValueChange={(v) => v.length && setKind(v[v.length - 1])}
                  options={[{ value: 'all', label: 'All' }, ...kinds.map((k) => ({ value: k.id, label: k.label }))]}
                />
              </Bleed>
            )}
          </div>
          <OfferListing compact showGame={category === 'all'} more="button" offers={Array.from({ length: loaded }, (_, i) => ({ ...products[i % products.length], listKey: `${category}-${kind}-${i}` }))} hasMore={loaded < MAX_LOADED} loading={loadingMore} onLoadMore={loadMore} />
        </Section>

      </div>
      <div className="og-about">
        <Section title="Overgear is streamlined and really easy to use">
          <p className="og-text">Find whatever you need to level up your experience within a few clicks</p>
          <ol className="og-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <Card variant="surface" padding={5}>
                  <span className="og-step-n" aria-hidden="true">{i + 1}</span>
                  <div className="og-stack og-stack--tight"><h3 className="og-h3">{t}</h3><p className="og-text">{d}</p></div>
                </Card>
              </li>
            ))}
          </ol>
        </Section>
        <Section title="Gamers trust Overgear to supply everything they're looking for in online games">
          <div className="og-grid og-grid--three">
            {BENEFITS.map(([img, t, d]) => (
              <Card key={t} variant="surface" padding={5}>
                <div className="og-stack og-stack--related og-center"><img src={`./assets/benefits/${img}.png`} alt="" width="96" height="96" loading="lazy" /><div className="og-stack og-stack--tight"><h3 className="og-h3">{t}</h3><p className="og-text">{d}</p></div></div>
              </Card>
            ))}
          </div>
        </Section>
        <Reviews />
        <div className="og-hire-wrap">
          <img className="og-hire__elf" src="./assets/hire/elf.webp" alt="" width="640" height="960" loading="lazy" />
          <Card variant="surface" padding={10} className="og-hire-card">
            <section className="og-hire" aria-label="Hiring">
              <h2 className="og-h2">We are hiring PRO Players to join our elite team</h2>
              <p className="og-text">Join our squad of 5,000+ hand-picked pros helping gamers worldwide. Pass our rigorous selection, prove your skills, and get paid for your gaming passion</p>
              <Button variant="primary" onClick={() => go('/info/careers')}>Start earning with Overgear</Button>
            </section>
          </Card>
        </div>
      </div>
    </Page>
  );
}
