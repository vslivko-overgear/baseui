// A product page of a boost service, rebuilt from the components of the design system.
import { t as initDom, r as renderInto } from '../../lib/react-18-D4o7zN8K.js';
import { h, useState, useMemo, useEffect, useRef } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.js';
import { Card } from '../../src/components/Card.js';
import { Collapsible, CollapsibleGroup } from '../../src/components/Collapsible.js';
import { Divider } from '../../src/components/Divider.js';
import { Link } from '../../src/components/Link.js';
import { List, ListItem } from '../../src/components/List.js';
import { RatingDisplay } from '../../src/components/Rating.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { ToastProvider, useToast } from '../../src/components/Toast.js';
import { Tooltip } from '../../src/components/Tooltip.js';
import { Checkbox, RadioGroup } from '../../src/components/Checks.js';
import { Modal, Select, TextField } from '../../src/base.js';
import { I } from './icons.js';
import { CATEGORIES, WINS, STEPS, WHY, REVIEWS, ALSO, ABOUT, FAQ, NUMBERS, METHODS, EXTRAS, PER_LEVEL, FOOTER, OTHER_GAMES, DISCLAIMER } from './data.js';

const useMedia = (q) => {
  const [on, setOn] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q); const f = () => setOn(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, [q]);
  return on;
};
const money = (n) => `$${n.toFixed(2)}`;
const Logo = () => h('a', { className: 'og-logo', href: '#', 'aria-label': 'overgear' },
  h('svg', { viewBox: '0 0 32 36', width: 32, height: 36, 'aria-hidden': 'true' }, h('path', { d: 'M16 1 2 6v11c0 9 6 15 14 18 8-3 14-9 14-18V6L16 1Z', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinejoin: 'round' }), h('path', { d: 'M16 9l-7 3v6c0 5 3 8 7 10 4-2 7-5 7-10v-6l-7-3Z', fill: '#f5a524' })),
  h('span', null, 'overgear'));

/* ---------------------------------------------------------------- header and categories */

function Header({ onMenu, isWide }) {
  return h('header', { className: 'og-header' },
    h(Logo),
    h(IconButton, { variant: 'primary', size: 'md', label: 'Categories', icon: h(I.Menu01), onClick: onMenu, className: 'og-menu' }),
    h('div', { className: 'og-search' }, h(TextField, { label: 'Search', trailing: h(IconButton, { variant: 'primary', size: 'sm', label: 'Search', icon: h(I.SearchLg), tooltip: false }) })),
    h('nav', { className: 'og-actions', 'aria-label': 'Account' },
      [['Wishlist', I.Heart], ['Cart', I.ShoppingCart01], ['Sign In', I.User01]].map(([label, Icon]) =>
        h('button', { key: label, type: 'button', className: 'og-action' }, h(Icon, { size: 24 }), h('span', null, label)))));
}

function Categories({ onPick }) {
  return h('div', { className: 'og-cats' },
    h('div', { className: 'og-caption' }, 'Categories'),
    h(List, { 'aria-label': 'Categories', size: 'md' },
      CATEGORIES.map((c) => h(ListItem, {
        key: c.label, defaultExpanded: !!c.open, onClick: c.items ? undefined : onPick,
        items: c.items && c.items.map((s) => h(ListItem, { key: s, size: 'md', subitem: true, active: c.active === s, onClick: onPick }, s)),
      }, c.label))));
}

/* ---------------------------------------------------------------- order form */

function RangeSlider({ min, max, from, to, onChange }) {
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return h('div', { className: 'og-range', style: { '--a': `${pct(from)}%`, '--b': `${pct(to)}%` } },
    h('div', { className: 'og-range__track' }),
    h('input', { type: 'range', min, max, value: from, 'aria-label': 'Leveling range from', onChange: (e) => onChange(Math.min(Number(e.target.value), to - 1), to) }),
    h('input', { type: 'range', min, max, value: to, 'aria-label': 'Leveling range to', onChange: (e) => onChange(from, Math.max(Number(e.target.value), from + 1)) }),
    h('div', { className: 'og-range__scale' }, h('span', null, min), h('span', null, max)));
}
const Help = ({ text }) => h(Tooltip, { content: text, placement: 'top' }, h('span', { className: 'og-help', tabIndex: 0, role: 'img', 'aria-label': 'Help' }, '?'));

function OrderForm({ toast }) {
  const narrow = useMedia('(max-width: 520px)');
  const [region, setRegion] = useState('us');
  const [range, setRange] = useState([80, 90]);
  const [express, setExpress] = useState(false);
  const [chars, setChars] = useState('0');
  const [method, setMethod] = useState('piloted');
  const [extras, setExtras] = useState({});
  const [from, to] = range;
  const price = useMemo(() => {
    // the base price is per level; Express, the method and the number of characters add their percentages to it
    let p = (to - from) * PER_LEVEL;
    p *= 1 + (express ? 0.3 : 0) + METHODS.find((m) => m[0] === method)[2] / 100;
    p *= 1 + NUMBERS[Number(chars)][1] / 100;
    for (const [id, , cost] of EXTRAS) if (extras[id]) p += cost;
    return p;
  }, [from, to, express, chars, method, extras]);
  const minutes = Math.round((to - from) * 37.5 / (express ? 1.5 : 1) * (1 + Number(chars) * 0.5));
  const duration = `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes`;
  return h('aside', { className: 'og-order', 'aria-label': 'Order' },
    h('div', { className: 'og-order__art', 'aria-hidden': 'true' },
      h(IconButton, { variant: 'secondary', size: 'sm', label: 'Add to wishlist', icon: h(I.Heart), className: 'og-order__heart', onClick: () => toast({ message: 'Added to the wishlist', status: 'success', duration: 2200 }) })),
    h('div', { className: 'og-order__form' },
      h('div', { className: 'og-field' }, h('div', { className: 'og-label' }, 'Region'),
        h(SegmentedControl, { label: 'Region', size: 'sm', value: region, onValueChange: setRegion, items: [{ value: 'eu', label: 'EU' }, { value: 'us', label: 'US' }] })),
      h('div', { className: 'og-field' }, h('div', { className: 'og-label' }, 'Leveling range'),
        h('div', { className: 'og-levels' },
          h(TextField, { label: 'From', value: String(from), onChange: (e) => { const v = Math.max(1, Math.min(Number(e.target.value) || 1, to - 1)); setRange([v, to]); } }),
          h(I.ArrowRight, { size: 24, 'aria-hidden': 'true' }),
          h(TextField, { label: 'To', value: String(to), onChange: (e) => { const v = Math.min(90, Math.max(Number(e.target.value) || 2, from + 1)); setRange([from, v]); } })),
        h(RangeSlider, { min: 1, max: 90, from, to, onChange: (a, b) => setRange([a, b]) })),
      h('div', { className: 'og-row' }, h(Checkbox, { label: '⚡ Express start & completion', checked: express, onCheckedChange: setExpress }), h('span', { className: 'og-row__end' }, '+30%'), h(Help, { text: 'A booster starts at once and works on your order in a priority queue' })),
      h('div', { className: 'og-field' }, h('div', { className: 'og-label' }, 'Choose number of characters ', h(Help, { text: 'Level up to 5 characters and save up to 20%' })),
        h(Select, { label: 'Characters', options: NUMBERS.map(([label, add], i) => ({ value: String(i), label: add ? `${label} +${add}%` : label })), value: chars, onValueChange: setChars })),
      h('div', { className: 'og-field' }, h('div', { className: 'og-label' }, 'Boost method'),
        narrow
          ? h(RadioGroup, { title: 'Boost method', value: method, onValueChange: setMethod, options: METHODS.map(([value, label, add]) => ({ value, label: add ? `${label} +${add}%` : label })) })
          : h(SegmentedControl, { label: 'Boost method', size: 'md', fullWidth: true, value: method, onValueChange: setMethod, items: METHODS.map(([value, label, add]) => ({ value, label: add ? `${label} +${add}%` : label })) })),
      h('div', { className: 'og-field' }, h('div', { className: 'og-label' }, 'Additional options'),
        EXTRAS.map(([id, label, cost, was]) => h('div', { key: id, className: 'og-row' },
          h(Checkbox, { label, checked: !!extras[id], onCheckedChange: (v) => setExtras({ ...extras, [id]: v }) }),
          h('span', { className: 'og-row__end' }, was && h('s', null, money(was)), ' ', id === 'camp' ? money(cost) : `+${money(cost)}`), h(Help, { text: `${label.replace(/^\S+\s/, '')}: an extra for your order` }))))),
    h('div', { className: 'og-order__foot' },
      h('div', { className: 'og-price' }, h('strong', null, money(price)), h(Badge, { variant: 'secondary', size: 'lg', label: 'Cashback from 1%' })),
      h('div', { className: 'og-meta' }, h(I.Clock, { size: 16 }), h('b', null, '15 minutes'), ' average start time'),
      h('div', { className: 'og-meta' }, h(I.Clock, { size: 16 }), h('b', null, duration), ' order completion'),
      h(Button, { variant: 'primary', size: 'md', width: '100%', icon: h(I.ShoppingCart01), onClick: () => toast({ message: `Added to cart: ${from}–${to} for ${money(price)}`, status: 'success' }) }, 'Add to cart'),
      h('div', { className: 'og-pay', 'aria-label': 'Payment methods' }, ['stripe', 'Mastercard', 'VISA', 'Apple Pay', 'G Pay', 'PayPal', '₿ Ξ Ł'].map((x) => h('span', { key: x }, x))),
      h('div', { className: 'og-guarantee' }, h(I.CheckCircle, { size: 16 }), '100% Money-Back Guarantee')));
}

/* ---------------------------------------------------------------- content */

const Hl = ({ children }) => h('span', { className: 'og-hl' }, children);
function Intro() {
  return h('section', null,
    h(Breadcrumbs, { items: [{ label: 'Home', href: '#' }, { label: 'World of Warcraft: Midnight', href: '#' }, { label: 'Power Leveling' }] }),
    h('h1', { className: 'og-h1' }, 'WoW Midnight Level Boost'),
    h('div', { className: 'og-trust' },
      h('b', null, 'Excellent'), h('span', null, '4.9 out of 5'), h(RatingDisplay, { value: 5, size: 'sm', color: 'accent' }), h('b', { className: 'og-tp' }, 'Trustpilot'),
      h('span', { className: 'og-sep' }), h('span', null, h('b', null, '546,555'), ' World of Warcraft boosts completed')),
    h('div', { className: 'og-pills' }, [[I.Clock, '90 lvl in 6 Hours'], [I.Tag01, 'Up to 20% Off Alts'], [I.CheckSquare, 'Full AFK on Self-Play']].map(([Icon, t]) =>
      h(Badge, { key: t, variant: 'secondary', size: 'lg', label: t, icon: h(Icon), className: 'og-pill' }))),
    h('p', { className: 'og-lead' }, 'Buy Midnight Level Boost — ', h(Hl, null, 'hit 90 inside a day'), ' and walk straight into your first M+10.'),
    h('h2', { className: 'og-h2' }, 'Your Wins'),
    h('ul', { className: 'og-bullets' }, WINS.map((w, i) => h('li', { key: i },
      w[0], ' ', w[1] ? h(Hl, null, w[1]) : null, w.slice(2).map((x, j) => (j === 1 && w[3] ? h('b', { key: j }, x) : x))))),
    h('h2', { className: 'og-h2' }, 'How It Works'),
    h('p', { className: 'og-flow' }, '📋 ', h('b', null, 'Place Order'), ' → 🗺️ ', h('b', null, 'Leveling Starts'), ' → ✅ ', h('b', null, 'Endgame Unlocked')),
    h('ol', { className: 'og-steps' }, STEPS.map((s) => h('li', { key: s }, s))));
}

const WhyIcons = { shield: I.ShieldTick, coin: I.Coins01, podium: I.BarChart01, headset: I.Headphones01 };
function Why() {
  return h(Card, { padding: 32, className: 'og-why' },
    h('h2', { className: 'og-h2' }, 'Why Players Choose Overgear'),
    h('div', { className: 'og-why__list' }, WHY.map(([ic, title, text]) => h('div', { key: title, className: 'og-why__item' },
      h('span', { className: 'og-why__icon' }, h(WhyIcons[ic], { size: 32 })), h('div', null, h('b', null, title), h('p', null, text))))));
}

function Reviews() {
  const [page, setPage] = useState(0);
  return h('section', null,
    h('div', { className: 'og-head' }, h('h2', { className: 'og-h2' }, 'What players say about Overgear'),
      h('div', { className: 'og-arrows' }, h(IconButton, { variant: 'secondary', shape: 'circle', size: 'md', label: 'Previous reviews', icon: h(I.ChevronLeft), isDisabled: page === 0, onClick: () => setPage(0) }),
        h(IconButton, { variant: 'secondary', shape: 'circle', size: 'md', label: 'Next reviews', icon: h(I.ChevronRight), isDisabled: page === 1, onClick: () => setPage(1) }))),
    h('div', { className: 'og-reviews' }, (page ? [...REVIEWS].reverse() : REVIEWS).map(([text, by]) => h(Card, { key: by, padding: 16, className: 'og-review' },
      h(RatingDisplay, { value: 5, size: 'sm', color: 'accent' }), h('p', null, text), h('small', null, 'by ', by)))));
}

function Also() {
  return h('section', { className: 'og-also' },
    h('h2', { className: 'og-h2' }, 'You may also like'),
    h('div', { className: 'og-also__row' }, ALSO.map((a) => h('a', { key: a.title, href: '#', className: 'og-prod' },
      h('div', { className: 'og-prod__art', style: { '--hue': a.hue }, 'aria-hidden': 'true' }),
      h('div', { className: 'og-prod__body' }, h('h3', null, a.title),
        h('ul', null, a.lines.map(([k, t]) => h('li', { key: t, className: k ? `og-${k}` : undefined }, k === 'b' ? h('b', null, t) : t))),
        a.badge && h(Badge, { variant: 'green-light', size: 'sm', label: a.badge }), h('div', { className: 'og-prod__price' }, 'From ', h('b', null, a.price)))))),
    h(Button, { variant: 'secondary', size: 'md', width: '100%', className: 'og-discover' }, 'Discover all'));
}

function Custom() {
  return h('section', { className: 'og-custom' },
    h('div', null, h('h2', null, 'Create Your Custom Offer!'), h('p', null, "If you can't find what you need, let's customize!", h('br'), 'Click to create your perfect offer now.')),
    h('div', { className: 'og-custom__cta' }, h(Button, { variant: 'primary', size: 'md' }, 'Request custom offer'), h('span', null, h(I.Clock, { size: 16 }), h('b', null, ' 2 minutes'), ' is our usual reply time')));
}

function Texts() {
  return h('div', { className: 'og-texts' }, ABOUT.map((s) => h('section', { key: s.h },
    h('h2', { className: 'og-h2' }, s.h), s.p.map((t) => h('p', { key: t }, t)),
    s.ul && h('ul', { className: 'og-bullets og-bullets--text' }, s.ul.map((t) => h('li', { key: t }, t))),
    s.after && s.after.map((t) => h('p', { key: t }, t)))));
}

function Footer() {
  return h('footer', { className: 'og-footer' },
    h('div', { className: 'og-footer__in' },
      h('div', { className: 'og-social' }, ['f', '◎', '♪', '▶', '𝕏'].map((s) => h(IconButton, { key: s, variant: 'secondary', size: 'md', label: `Social ${s}`, icon: h('span', { 'aria-hidden': 'true' }, s), tooltip: false }))),
      h('div', { className: 'og-footer__cols' }, Object.entries(FOOTER).map(([title, links]) => h('div', { key: title }, h('h4', null, title), links.map((l) => h(Link, { key: l, href: '#', underline: false }, l))))),
      h('h4', null, 'Other games'),
      h('div', { className: 'og-footer__cols og-footer__games' }, OTHER_GAMES.map((g) => h(Link, { key: g, href: '#', underline: false }, g))),
      h('p', { className: 'og-disclaimer' }, DISCLAIMER),
      h('p', { className: 'og-copy' }, '© Overgear 2018-2026. All rights reserved. Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus. Reg. number: HE395043')));
}

function Privacy() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return h(Card, { padding: 24, className: 'og-privacy', role: 'dialog', 'aria-label': 'We value your privacy' },
    h(IconButton, { variant: 'ghost', size: 'xsm', label: 'Close', icon: h(I.XClose), onClick: () => setOpen(false), className: 'og-privacy__x' }),
    h('b', null, 'We value your privacy'),
    h('p', null, 'This website or its third-party tools process personal data. You can opt out of the sale of your personal information by clicking on the “Do Not Sell or Share My Personal Information” link.'),
    h(Link, { href: '#' }, 'Do Not Sell or Share My Personal Information'));
}

function Page() {
  const { toast } = useToast();
  const wide = useMedia('(min-width: 1100px)');
  const [menu, setMenu] = useState(false);
  const rest = [h(Why, { key: 'why' }), h(Collapsible, { key: 'acc', title: 'Boost methods explained', className: 'og-acc' }, 'Self-Play: you stay in the game and take part yourself. Piloted: a booster plays on your character through a secure VPN. Remote: a booster plays through remote access without getting your account details.'),
    h(Reviews, { key: 'rev' }), h(Also, { key: 'also' }), h(Custom, { key: 'custom' }), h(Texts, { key: 'texts' }),
    h('h2', { key: 'faqh', className: 'og-h2' }, 'WoW Midnight Leveling Service FAQ'),
    h(CollapsibleGroup, { key: 'faq', className: 'og-faq', items: FAQ.map(([title, content], i) => ({ value: String(i), title, content })) })];
  return h('div', { className: 'og' },
    h(Header, { onMenu: () => setMenu(true), isWide: wide }),
    h('div', { className: 'og-body' },
      wide && h('aside', { className: 'og-side' }, h(Categories)),
      h('main', { className: 'og-main' },
        wide
          ? h('div', { className: 'og-grid' }, h('div', { className: 'og-col' }, h(Intro), rest), h('div', { className: 'og-sticky' }, h(OrderForm, { toast })))
          : h('div', { className: 'og-col' }, h(Intro), h('div', { className: 'og-stack-order' }, h(OrderForm, { toast })), rest))),
    h(Footer),
    h(Privacy),
    h(Modal, { open: menu && !wide, onOpenChange: setMenu, title: 'Categories', height: 'viewport' }, h(Categories, { onPick: () => setMenu(false) })));
}

await initDom();
renderInto(h(ToastProvider, { placement: 'top-center' }, h(Page)), document.getElementById('root'));
