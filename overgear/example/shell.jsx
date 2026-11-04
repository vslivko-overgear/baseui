// The frame of every page: header with search, categories, cart and account; footer; and the bottom bar on a phone.
import { useState, useRef, useEffect } from '../../src/react.js';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Popover } from '../../src/components/Popover.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Link } from '../../src/components/Link.jsx';
import { OtpInput } from '../../src/components/OtpInput.jsx';
import { BottomBar } from '../../src/components/MobileNavigation.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useStore } from './store.jsx';
import { usePrefs } from './prefs.jsx';
import { CatalogColumns } from './catalog.jsx';
import { Search } from './search.jsx';
import { WalletButton } from './wallet.jsx';
import { AccountMenu } from './account.jsx';
import { go, href, openMiniCart } from './util.js';
import { GAMES } from './data.js';
import { PaymentLogos, PAY_MAIN, PAY_BADGES } from './ui.jsx';
import { ControlRow } from '../../src/components/Layout.jsx';

// the logo of the real service, linked from its server (not copied); the phone header shows only its mark (cropped by CSS)
const LOGO_FULL = 'https://overgear.com/images/overgear-logo-full.svg';

// brand marks of the three ways to sign in, drawn small and flat
const BRANDS = {
  Google: <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2Z" /><path fill="currentColor" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" /><path fill="currentColor" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" /><path fill="currentColor" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z" /></svg>,
  Discord: <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M19.6 5.3A16.6 16.6 0 0 0 15.5 4l-.2.4a15 15 0 0 1 3.7 1.9 13.8 13.8 0 0 0-12.1 0A15 15 0 0 1 10.6 4.4L10.5 4a16.600 16.600 0 0 0-4.100 1.300C3.800 9.200 3.100 13 3.400 16.700a16.700 16.700 0 0 0 5 2.500l1.100-1.800a11 11 0 0 1-1.700-.8l.4-.3a11.900 11.900 0 0 0 10.200 0l.4.300c-.5.300-1.100.6-1.700.8l1.100 1.800a16.700 16.700 0 0 0 5-2.500c.4-4.300-.7-8.100-3-11.400ZM9.500 14.500c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2Zm5 0c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2Z" /></svg>,
  Facebook: <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><path fill="var(--bui-background-secondary)" d="M13.300 20v-6.500h2.200l.3-2.600h-2.500V9.300c0-.7.200-1.200 1.300-1.200h1.300V5.800c-.2 0-1-.1-1.900-.1-1.900 0-3.200 1.200-3.200 3.300v1.900H8.600v2.600h2.200V20h2.500Z" /></svg>,
};

/** The sign-in sheet: an email, then the code that was sent to it, or one of three services. */
export function LoginDialog({ open, onClose }) {
  const store = useStore();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [tried, setTried] = useState(false);
  const bad = !/^\S+@\S+\.\S+$/.test(email.trim());
  const finish = (user) => { store.login(user); setStep('email'); setEmail(''); setTried(false); onClose(); };
  const next = () => {
    setTried(true);
    if (bad) { document.getElementById('og-login-email')?.focus(); return; }
    setStep('code');
  };
  const close = () => { setStep('email'); setTried(false); onClose(); };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()} title={step === 'email' ? 'Enter your email to get started' : 'Check your email'}>
      <div className="og-login">
        {step === 'email' ? (
          <>
            <form className="og-stack og-stack--lg" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
              <TextInput id="og-login-email" type="email" label="Email" startIcon={<Icon name="Mail01" size={24} />} autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setTried(false); }} status={tried && bad ? 'error' : undefined} caption={tried && bad ? 'Enter an email address, for example name@example.com' : undefined} />
              <Button variant="primary" size="lg" textSize={16} width="100%" label="Continue" type="submit" />
            </form>
            <Divider label="Or" />
            <div className="og-login__social">
              {Object.entries(BRANDS).map(([name, mark]) => (
                <IconButton key={name} variant="secondary" size="lg" width="100%" icon={mark} label={`Continue with ${name}`} onClick={() => finish({ name: `${name} user`, email: `${name.toLowerCase()}@example.com` })} />
              ))}
            </div>
            <p className="og-login__legal">
              By signing up, you accept <Link href={href('/info/terms')} onClick={close}>Terms and conditions</Link> &amp; <Link href={href('/info/privacy')} onClick={close}>Privacy policy</Link>
            </p>
          </>
        ) : (
          <>
            <p className="og-login__legal">{`We sent a 6-digit code to ${email.trim()}. Any code works in this demo`}</p>
            <div className="og-login__code">
              <OtpInput label="Code" grouped captureTyping onComplete={() => new Promise((r) => setTimeout(r, 700)).then(() => finish({ name: email.split('@')[0], email: email.trim() }))} />
            </div>
            <div className="og-stack">
              <Button variant="secondary" size="lg" textSize={16} width="100%" label="Use another email" onClick={() => setStep('email')} />
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

function Account({ onLogin }) {
  const store = useStore();
  const prefs = usePrefs();
  const [menu, setMenu] = useState(false);
  const timer = useRef(null);
  if (!store.user) return <Button variant="secondary" size="md" textSize={14} label="Log in" onClick={onLogin} />;
  // the profile popup opens on hover (and on a click); it is the same menu as the account screen of a phone and the left column of the account page
  const hover = (on) => { clearTimeout(timer.current); timer.current = setTimeout(() => setMenu(on), on ? 0 : 160); };
  return (
    <>
      <Popover open={menu} onOpenChange={(o) => { clearTimeout(timer.current); setMenu(o); }} placement="bottom-end" label="Profile" panelClassName="og-acc__pop" trigger={(props) => (
        <IconButton {...props} variant="ghost" label="Profile" tooltip={false} icon={<Icon name="User01" size={24} />} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} />
      )}>
        <div onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} data-test-id="profile-popup">
          <AccountMenu prefs={prefs} hide={['wallet']} onPick={() => setMenu(false)} />
        </div>
      </Popover>
      {prefs.sheets}
    </>
  );
}

/** The button of the catalog (desktop): it opens and closes the catalog, the classifier of the pages, as a panel under the header. */
/** The icon of the catalog button: the three lines of a menu turn into a cross when the panel opens, and back when it closes (the lines and the icons Menu02 and XClose of the set). */
function MenuMorph({ open }) {
  return (
    <svg className="og-morph" data-open={open || undefined} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line className="og-morph__top" x1="3" y1="6" x2="21" y2="6" />
      <line className="og-morph__mid" x1="3" y1="12" x2="15" y2="12" />
      <line className="og-morph__bottom" x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CatalogButton({ open, onToggle }) {
  return <Button variant="secondary" size="md" textSize={14} icon={<MenuMorph open={open} />} label="Catalog" aria-expanded={open} aria-controls="og-catalog-modal" onClick={onToggle} />;
}

export function Header({ route, onLogin }) {
  const store = useStore();
  const [catalog, setCatalog] = useState(false);
  // the panel closes when the page changes and on Escape
  useEffect(() => { setCatalog(false); }, [route.path, route.query.s, route.query.c]);
  useEffect(() => {
    if (!catalog) return undefined;
    const key = (e) => e.key === 'Escape' && setCatalog(false);
    document.addEventListener('keydown', key);
    // the page behind the panel does not scroll
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = was; };
  }, [catalog]);
  return (
    <header className="og-header">
      <div className="og-wrap">
        <div className="og-top">
          <a className="og-brand" href={href('/')} aria-label="Overgear">
            <img className="og-brand__full" src={LOGO_FULL} alt="" width="145" height="32" />
          </a>
          <ControlRow className="og-find">
            <CatalogButton open={catalog} onToggle={() => setCatalog((o) => !o)} />
            <Search query={route.query.q} />
            {store.user && <WalletButton />}
            <ControlRow className="og-actions" gap={1}>
            {store.user && <IconButton variant="ghost" label="My orders" icon={<Icon name="ShoppingBag01" size={24} />} onClick={() => go('/orders')} />}
            <span title="Favorites" style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton variant="ghost" label={store.wishlist.length ? `Favorites, ${store.wishlist.length} items` : 'Favorites'} icon={<Icon name="Heart" size={24} />} onClick={() => go('/account?tab=wishlist')} />
              {store.wishlist.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, pointerEvents: 'none' }}><Badge type="counter" variant="primary" size="sm" label={store.wishlist.length} /></span>}
            </span>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton variant="ghost" label={`Cart, ${store.count} items`} icon={<Icon name="ShoppingCart01" size={24} />} onClick={openMiniCart} />
              {store.count > 0 && <span style={{ position: 'absolute', top: 2, right: 2, pointerEvents: 'none' }}><Badge type="counter" variant="critical" size="sm" label={store.count} /></span>}
            </span>
            <Account onLogin={onLogin} />
            </ControlRow>
          </ControlRow>
        </div>
      </div>
      {catalog && (
        <>
          <div id="og-catalog-modal" className="og-catalog-modal" role="dialog" aria-label="Catalog">
            <div className="og-wrap"><CatalogColumns onChoose={() => setCatalog(false)} /></div>
          </div>
        </>
      )}
    </header>
  );
}

export function MobileHeader({ route, onLogin }) {
  const store = useStore();
  return (
    <header className="og-header">
      <div className="og-wrap">
        <div className="og-top">
          <a className="og-brand" href={href('/')}>
            <span className="og-brand__mark" aria-hidden="true"><span className="og-brand__crop"><img src={LOGO_FULL} alt="" width="145" height="32" /></span></span>
          </a>
          <Search query={route.query.q} />
          {!store.user && <div className="og-actions"><Account onLogin={onLogin} /></div>}
        </div>
      </div>
    </header>
  );
}

export function MobileBar({ route }) {
  const store = useStore();
  // the bottom bar has its own floating and glass (it is not a setting of the theme)
  // the badge of the favorites is white (primary), not red: it is drawn here, in the icon, in the place of the badge of the bar
  const wishBadge = store.wishlist.length > 0 && <Badge type="counter" variant="primary" size="sm" label={store.wishlist.length} className="bui-bottombar__badge" />;
  const first = route.parts[0] || 'home';
  const value = first === 'account' || first === 'orders' || first === 'order' ? (route.query.tab === 'wishlist' ? 'favorites' : 'account') : ['home', 'cart'].includes(first) ? first : ['catalog', 'games', 'offer'].includes(first) ? 'catalog' : 'home';
  const path = { home: '/', catalog: '/catalog', favorites: '/account?tab=wishlist', cart: '/cart', account: '/account' };
  return (
    <div className="og-bottom">
      <BottomBar
        label="Main"
        showLabels={false}
        floating
        glass
        value={value}
        onValueChange={(v) => go(path[v])}
        items={[
          { value: 'home', label: 'Home', icon: <Icon name="Home01" size={24} />, activeIcon: <Icon name="Home01" size={24} filled /> },
          { value: 'catalog', label: 'Catalog', icon: <Icon name="Menu02" size={24} />, activeIcon: <Icon name="Menu02" size={24} filled /> },
          { value: 'favorites', label: 'Favorites', icon: <>{<Icon name="Heart" size={24} />}{wishBadge}</>, activeIcon: <>{<Icon name="Heart" size={24} filled />}{wishBadge}</> },
          { value: 'cart', label: 'Cart', icon: <Icon name="ShoppingCart01" size={24} />, activeIcon: <Icon name="ShoppingCart01" size={24} filled />, badge: store.count || undefined },
          { value: 'account', label: 'Account', icon: <Icon name="User01" size={24} />, activeIcon: <Icon name="User01" size={24} filled /> },
        ]}
      />
    </div>
  );
}

const LEGAL_NOTE = "Overgear is not endorsed by, directly affiliated with, maintained, or sponsored by Blizzard Entertainment, Bungie, Electronic Arts, Grinding Gear Games, Activision Publishing, Square Enix Co., Valve, Battlestate Games, Wargaming.net Limited, Amazon Technologies, Jagex Limited, Riot Games, Smilegate RPG, Digital Extremes. The views and opinions expressed by Overgear do not reflect those of anyone officially associated with producing or managing their game franchises. Copyrighted art submitted to or through Overgear remains the intellectual property of the respective copyright holder. Overgear does not engage in the sale of in-game items. Instead, our service focuses on enhancing players' in-game skills and occasionally gifting in-game items to users";
const OTHER_GAMES = ['Apex Legends', 'New World', 'EFT', 'Destiny 2', 'PoE', 'Fellowship', 'Lost Ark', 'Valorant', 'Diablo Immortal', 'EA Sports FC 27', 'Call of Duty', 'Diablo 4', 'World of Tanks', 'Counter-Strike 2', 'WoW Classic Hardcore', 'WoW Classic Era', 'Season of Discovery', 'The Finals', 'League of Legends', 'Last Epoch', 'Helldivers 2', 'Dota 2', 'Rainbow 6 Siege', 'The First Descendant', 'Albion Online', 'Overwatch', 'Genshin Impact', 'Arena Breakout Infinite', 'Old School Runescape', 'Warhammer 40k Space Marine 2', 'WoW Classic Fresh', 'Path of Exile 2', 'Marvel Rivals', 'Deadlock', 'Delta Force', 'Where Winds Meet', 'Guild Wars 2', 'Final Fantasy XIV', 'Diablo 2 Resurrected', 'Diablo 3', 'The Elder Scrolls Online', 'Monster Hunter Wilds', 'The Division 2', 'Dune Awakening', 'Sea of Thieves', 'Elden Ring Nightreign', 'Destiny Rising', 'Battlefield 6', 'ARC Raiders', 'Active Matter', 'Marathon', 'Arknights: Endfield', 'NBA 2K', 'WoW Forever', 'WARDOGS', 'Fortnite', 'Gears of War: E-Day', 'Torchlight: Infinite', 'Warframe'];

const SOCIAL = [
  ['facebook', 'Facebook', 'https://www.facebook.com/overgearcom', <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>],
  ['instagram', 'Instagram', 'https://www.instagram.com/overgearcom/', <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>],
  ['tiktok', 'TikTok', 'https://www.tiktok.com/@overgearcom', <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>],
  ['youtube', 'YouTube', 'https://www.youtube.com/@Overgear_com', <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>],
  ['x', 'X (Twitter)', 'https://x.com/overgear_com', <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>],
];

export function Footer() {
  const col = (title, links) => (
    <div className="og-stack og-stack--related">
      <h2 className="og-caps">{title}</h2>
      <ul className="og-links">{links.map(([l, to]) => <li key={l}><a href={href(to)}>{l}</a></li>)}</ul>
    </div>
  );
  return (
    <footer className="og-footer">
      <div className="og-wrap og-stack og-stack--lg">
        <PaymentLogos items={PAY_MAIN} />
        <Divider />
        <div className="og-row og-row--between og-footer__brand">
          <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
            <filter id="og-tint" colorInterpolationFilters="sRGB"><feFlood style={{ floodColor: 'var(--bui-text-and-icon-secondary)' }} /><feComposite in2="SourceAlpha" operator="in" /></filter>
          </svg>
          <img className="og-footer__logo" src={LOGO_FULL} alt="Overgear" />
          <ul className="og-social" aria-label="Social networks">
            {SOCIAL.map(([n, label, url, icon]) => <li key={n}><IconButton variant="secondary" size="sm" tooltip={false} label={label} icon={icon} href={url} target="_blank" rel="noreferrer" /></li>)}
          </ul>
        </div>
        <div className="og-footer__cols">
          {col('Overgear', [['About us', '/info/about'], ['Work with us', '/info/careers'], ['Guides', '/info/guides'], ['Contact us', '/info/contact'], ['Get help', '/info/help'], ['Guarantees', '/info/guarantees']])}
          {col('Legal', [['Terms and conditions', '/info/terms'], ['Privacy policy', '/info/privacy'], ['Refund policy', '/info/refund'], ['Cookies policy', '/info/cookies'], ['Consent Preferences', '/info/consent'], ['Credential on File Agreement', '/info/credential']])}
          {col('World of Warcraft', [['WoW Boosting', '/games/wow'], ['WoW Gold', '/games/wow/gold'], ['Mythic+ Dungeon boost', '/games/wow?s=mythic'], ['WoW Raid Boost', '/games/wow?s=raids'], ['PvP Boosting', '/games/wow?s=pvp'], ['WoW Power Leveling', '/games/wow']])}
          {col('WoW Mists of Pandaria', [['Mists of Pandaria Boosting', '/games/wow'], ['Mists of Pandaria Gold', '/games/wow/gold'], ['Mists of Pandaria Power Leveling', '/games/wow'], ['Mists of Pandaria Raids', '/games/wow?s=raids'], ['Mists of Pandaria PvP Boosting', '/games/wow?s=pvp']])}
        </div>
        <div className="og-stack og-stack--related">
          <h2 className="og-caps">Other games</h2>
          <ul className="og-links og-footer__games">{OTHER_GAMES.map((n) => <li key={n}><a href={href('/search?q=' + encodeURIComponent(n))}>{n}</a></li>)}</ul>
        </div>
        <p className="og-caption">{LEGAL_NOTE}</p>
        <div className="og-row og-row--between og-footer__bottom">
          <p className="og-caption og-caption--dim">© Overgear 2018-2026. All rights reserved. Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus. Reg. number: HE395043</p>
          <PaymentLogos items={PAY_BADGES} label="Security badges" />
        </div>
      </div>
    </footer>
  );
}
