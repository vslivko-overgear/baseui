// The same product page with the information in order of priority:
//   main block:   title, the main USPs, the order form, the additional information
//   right column: the price, the cart button and the safety elements; why players choose us
// Base font: 14px on a phone, 16px on a desktop.
import { t as initDom, r as renderInto } from '../../lib/react-18-D4o7zN8K.js';
import { h, useState, useMemo, useEffect } from '../../src/react.js';
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
import { Checkbox } from '../../src/components/Checks.js';
import { Modal, Select, TextField } from '../../src/base.js';
import { I } from '../overgear/icons.js';
import { CATEGORIES, WINS, STEPS, WHY, REVIEWS, ALSO, ABOUT, FAQ, NUMBERS, METHODS, EXTRAS, PER_LEVEL, FOOTER, OTHER_GAMES, DISCLAIMER } from '../overgear/data.js';

const useMedia = (q) => {
  const [on, setOn] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q); const f = () => setOn(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, [q]);
  return on;
};
const money = (n) => `$${n.toFixed(2)}`;
const Hl = ({ children }) => h('span', { className: 'og2-hl' }, children);
const Help = ({ text }) => h(Tooltip, { content: text, placement: 'top' }, h('span', { className: 'og2-help', tabIndex: 0, role: 'img', 'aria-label': 'Help' }, '?'));

/* ------------------------------------------------------------ the order: one state for the form and the summary */

function useOrder() {
  const [region, setRegion] = useState('us');
  const [range, setRange] = useState([80, 90]);
  const [express, setExpress] = useState(false);
  const [chars, setChars] = useState('0');
  const [method, setMethod] = useState('piloted');
  const [extras, setExtras] = useState({});
  const [from, to] = range;
  const price = useMemo(() => {
    let p = (to - from) * PER_LEVEL;
    p *= 1 + (express ? 0.3 : 0) + METHODS.find((m) => m[0] === method)[2] / 100;
    p *= 1 + NUMBERS[Number(chars)][1] / 100;
    for (const [id, , cost] of EXTRAS) if (extras[id]) p += cost;
    return p;
  }, [from, to, express, chars, method, extras]);
  const minutes = Math.round((to - from) * 37.5 / (express ? 1.5 : 1) * (1 + Number(chars) * 0.5));
  return { region, setRegion, range, setRange, express, setExpress, chars, setChars, method, setMethod, extras, setExtras, from, to, price, minutes,
    duration: `${Math.floor(minutes / 60)} h ${minutes % 60} min`, extrasCount: EXTRAS.filter(([id]) => extras[id]).length };
}

/* ------------------------------------------------------------ header and categories */

function Logo() {
  return h('a', { className: 'og2-logo', href: '#', 'aria-label': 'overgear' },
    h('svg', { viewBox: '0 0 32 36', width: 26, height: 29, 'aria-hidden': 'true' }, h('path', { d: 'M16 1 2 6v11c0 9 6 15 14 18 8-3 14-9 14-18V6L16 1Z', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinejoin: 'round' }), h('path', { d: 'M16 9l-7 3v6c0 5 3 8 7 10 4-2 7-5 7-10v-6l-7-3Z', fill: '#f5a524' })),
    h('span', null, 'overgear'));
}
function Header({ onMenu }) {
  return h('header', { className: 'og2-header' },
    h(Logo),
    h(IconButton, { variant: 'primary', size: 'sm', label: 'Categories', icon: h(I.Menu01), onClick: onMenu, className: 'og2-menu' }),
    h('div', { className: 'og2-search' }, h(TextField, { label: 'Search', size: 'sm', trailing: h(IconButton, { variant: 'primary', size: 'xsm', label: 'Search', icon: h(I.SearchLg), tooltip: false }) })),
    h('nav', { className: 'og2-actions', 'aria-label': 'Account' }, [['Wishlist', I.Heart], ['Cart', I.ShoppingCart01], ['Sign In', I.User01]].map(([label, Icon]) =>
      h('button', { key: label, type: 'button', className: 'og2-action' }, h(Icon, { size: 20 }), h('span', null, label)))));
}
function Categories({ onPick }) {
  return h('div', { className: 'og2-cats' },
    h('div', { className: 'og2-caption' }, 'Categories'),
    h(List, { 'aria-label': 'Categories', size: 'sm' }, CATEGORIES.map((c) => h(ListItem, {
      key: c.label, defaultExpanded: !!c.open, onClick: c.items ? undefined : onPick,
      items: c.items && c.items.map((s) => h(ListItem, { key: s, size: 'sm', subitem: true, active: c.active === s, onClick: onPick }, s)),
    }, c.label))));
}

/* ------------------------------------------------------------ 1. title and 2. the main USPs */

function Title() {
  return h('section', { className: 'og2-title' },
    h(Breadcrumbs, { className: 'og2-crumbs', items: [{ label: 'Home', href: '#' }, { label: 'World of Warcraft: Midnight', href: '#' }, { label: 'Power Leveling' }] }),
    h('h1', null, 'WoW Midnight Level Boost'),
    h('div', { className: 'og2-trust' },
      h(RatingDisplay, { value: 5, size: 'sm', color: 'accent' }), h('b', null, '4.9'), h('span', null, 'Trustpilot'), h('i', null),
      h('span', null, h('b', null, '546,555'), ' boosts completed')));
}
function Usps() {
  const items = [[I.Clock, '90 lvl in 6 hours'], [I.Tag01, 'Up to 20% off alts'], [I.CheckSquare, 'Full AFK on Self-Play'], [I.ShieldTick, 'Manual, zero-ban']];
  return h('section', { className: 'og2-usps', 'aria-label': 'Main benefits' },
    h('p', null, 'Hit 90 ', h(Hl, null, 'inside a day'), ' and walk straight into your first M+10.'),
    h('div', { className: 'og2-chips' }, items.map(([Icon, t]) => h(Badge, { key: t, variant: 'secondary', size: 'lg', label: t, icon: h(Icon), className: 'og2-chip' }))));
}

/* ------------------------------------------------------------ 3. the form */

function RangeSlider({ min, max, from, to, onChange }) {
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return h('div', { className: 'og2-range', style: { '--a': `${pct(from)}%`, '--b': `${pct(to)}%` } },
    h('div', { className: 'og2-range__track' }),
    h('input', { type: 'range', min, max, value: from, 'aria-label': 'Leveling range from', onChange: (e) => onChange(Math.min(Number(e.target.value), to - 1), to) }),
    h('input', { type: 'range', min, max, value: to, 'aria-label': 'Leveling range to', onChange: (e) => onChange(from, Math.max(Number(e.target.value), from + 1)) }));
}
function Form({ o }) {
  return h(Card, { padding: 16, className: 'og2-form', 'aria-label': 'Configure your boost' },
    h('h2', null, 'Configure your boost'),
    h('div', { className: 'og2-form__grid' },
      h('div', { className: 'og2-f' }, h('label', null, 'Region'),
        h(SegmentedControl, { label: 'Region', size: 'sm', fullWidth: true, value: o.region, onValueChange: o.setRegion, items: [{ value: 'eu', label: 'EU' }, { value: 'us', label: 'US' }] })),
      h('div', { className: 'og2-f' }, h('label', null, 'Boost method'),
        h(SegmentedControl, { label: 'Boost method', size: 'sm', fullWidth: true, value: o.method, onValueChange: o.setMethod, items: METHODS.map(([value, label, add]) => ({ value, label, counter: add ? `+${add}%` : undefined })) })),
      h('div', { className: 'og2-f og2-f--wide' }, h('label', null, 'Leveling range'),
        h('div', { className: 'og2-levels' },
          h(TextField, { label: 'From', size: 'sm', value: String(o.from), onChange: (e) => o.setRange([Math.max(1, Math.min(Number(e.target.value) || 1, o.to - 1)), o.to]) }),
          h(I.ArrowRight, { size: 20, 'aria-hidden': 'true' }),
          h(TextField, { label: 'To', size: 'sm', value: String(o.to), onChange: (e) => o.setRange([o.from, Math.min(90, Math.max(Number(e.target.value) || 2, o.from + 1))]) }),
          h('div', { className: 'og2-levels__slider' }, h(RangeSlider, { min: 1, max: 90, from: o.from, to: o.to, onChange: (a, b) => o.setRange([a, b]) })))),
      h('div', { className: 'og2-f' }, h('label', null, 'Number of characters ', h(Help, { text: 'Level up to 5 characters and save up to 20%' })),
        h(Select, { label: 'Characters', size: 'sm', options: NUMBERS.map(([label, add], i) => ({ value: String(i), label: add ? `${label} +${add}%` : label })), value: o.chars, onValueChange: o.setChars })),
      h('div', { className: 'og2-f og2-f--center' }, h('div', { className: 'og2-row' }, h(Checkbox, { size: 'sm', label: '⚡ Express start & completion', checked: o.express, onCheckedChange: o.setExpress }), h('span', { className: 'og2-end' }, '+30%'), h(Help, { text: 'A booster starts at once and works on your order in a priority queue' }))),
      h('div', { className: 'og2-f og2-f--wide' }, h('label', null, 'Additional options'),
        h('div', { className: 'og2-extras' }, EXTRAS.map(([id, label, cost, was]) => h('div', { key: id, className: 'og2-row' },
          h(Checkbox, { size: 'sm', label, checked: !!o.extras[id], onCheckedChange: (v) => o.setExtras({ ...o.extras, [id]: v }) }),
          h('span', { className: 'og2-end' }, was && h('s', null, money(was)), ' ', id === 'camp' ? money(cost) : `+${money(cost)}`), h(Help, { text: `${label.replace(/^\S+\s/, '')}: an extra for your order` })))))));
}

/* ------------------------------------------------------------ the right column */

function Summary({ o, toast }) {
  const method = METHODS.find((m) => m[0] === o.method)[1];
  const add = () => toast({ message: `Added to cart: ${o.from}–${o.to} for ${money(o.price)}`, status: 'success' });
  return h(Card, { padding: 16, className: 'og2-summary' },
    h('div', { className: 'og2-price' }, h('strong', null, money(o.price)), h(Badge, { variant: 'secondary', size: 'sm', label: 'Cashback from 1%' })),
    h('ul', { className: 'og2-lines', 'aria-label': 'Your order' },
      h('li', null, h('span', null, 'Leveling'), h('b', null, `${o.from} → ${o.to}`)),
      h('li', null, h('span', null, 'Method · region'), h('b', null, `${method} · ${o.region.toUpperCase()}`)),
      h('li', null, h('span', null, 'Options'), h('b', null, (o.express ? 1 : 0) + o.extrasCount ? `${(o.express ? 1 : 0) + o.extrasCount} selected` : 'none'))),
    h('div', { className: 'og2-times' },
      h('div', null, h(I.Clock, { size: 14 }), h('b', null, '15 min'), ' to start'),
      h('div', null, h(I.Clock, { size: 14 }), h('b', null, o.duration), ' to finish')),
    h(Button, { variant: 'primary', size: 'md', width: '100%', icon: h(I.ShoppingCart01), onClick: add, className: 'og2-cta' }, 'Add to cart'),
    h('div', { className: 'og2-safe' },
      h('span', null, h(I.CheckCircle, { size: 14 }), '100% money-back guarantee'),
      h('span', null, h(I.Lock01, { size: 14 }), 'Secure checkout'),
      h('span', null, h(I.ShieldTick, { size: 14 }), 'Zero-ban, manual only')),
    h('div', { className: 'og2-pay', 'aria-label': 'Payment methods' }, ['stripe', 'VISA', 'Mastercard', 'Apple Pay', 'G Pay', 'PayPal', '₿ Ξ Ł'].map((x) => h('span', { key: x }, x))));
}
const WhyIcons = { shield: I.ShieldTick, coin: I.Coins01, podium: I.BarChart01, headset: I.Headphones01 };
function Why() {
  return h(Card, { padding: 16, className: 'og2-why' },
    h('h2', null, 'Why players choose us'),
    h('ul', null, WHY.map(([ic, title, text]) => h('li', { key: title }, h('span', null, h(WhyIcons[ic], { size: 22 })), h('div', null, h('b', null, title), h('p', null, text))))));
}

/* ------------------------------------------------------------ 4. additional information */

function Wins() {
  return h('section', { className: 'og2-sec' }, h('h2', null, 'Your wins'),
    h('ul', { className: 'og2-wins' }, WINS.map((w, i) => h('li', { key: i }, h('span', null, w[0]), h('div', null, w[1] ? h(Hl, null, w[1]) : null, w.slice(2).map((x, j) => (j === 1 && w[3] ? h('b', { key: j }, x) : x)))))));
}
function How() {
  return h('section', { className: 'og2-sec' }, h('h2', null, 'How it works'),
    h('ol', { className: 'og2-steps' }, ['📋 Place order', '🗺️ Leveling starts', '✅ Endgame unlocked'].map((t, i) => h('li', { key: t }, h('b', null, t), h('p', null, STEPS[i])))));
}
function Reviews() {
  return h('section', { className: 'og2-sec' }, h('h2', null, 'What players say'),
    h('div', { className: 'og2-reviews' }, REVIEWS.map(([text, by]) => h(Card, { key: by, padding: 12, className: 'og2-review' }, h(RatingDisplay, { value: 5, size: 'sm', color: 'accent' }), h('p', null, text), h('small', null, 'by ', by)))));
}
function Also() {
  return h('section', { className: 'og2-sec' }, h('h2', null, 'You may also like'),
    h('div', { className: 'og2-also' }, ALSO.map((a) => h('a', { key: a.title, href: '#', className: 'og2-prod', style: { '--hue': a.hue } },
      h('div', null, h('h3', null, a.title), h('p', null, a.lines[0][1])), h('div', { className: 'og2-prod__foot' }, a.badge && h(Badge, { variant: 'green-light', size: 'sm', label: a.badge }), h('span', null, 'From ', h('b', null, a.price)))))),
    h('div', { className: 'og2-custom' }, h('div', null, h('b', null, 'Need something else?'), h('span', null, ' Request a custom offer — we reply in 2 minutes.')), h(Button, { variant: 'primary', size: 'sm' }, 'Request custom offer')));
}
function More() {
  const all = [
    { value: 'methods', title: 'Boost methods explained', content: 'Self-Play: you stay in the game and take part yourself. Piloted: a booster plays on your character through a secure VPN. Remote: a booster plays through remote access without getting your account details.' },
    ...ABOUT.map((s, i) => ({ value: `a${i}`, title: s.h, content: h('div', { className: 'og2-text' }, s.p.map((t) => h('p', { key: t }, t)), s.ul && h('ul', null, s.ul.map((t) => h('li', { key: t }, t))), s.after && s.after.map((t) => h('p', { key: t }, t))) })),
  ];
  return h('section', { className: 'og2-sec' }, h('h2', null, 'About the service'), h(CollapsibleGroup, { className: 'og2-acc', items: all }),
    h('h2', { className: 'og2-faqh' }, 'FAQ'), h(CollapsibleGroup, { className: 'og2-acc', items: FAQ.map(([title, content], i) => ({ value: `f${i}`, title, content })) }));
}

function Footer() {
  return h('footer', { className: 'og2-footer' }, h('div', { className: 'og2-footer__in' },
    h('div', { className: 'og2-footer__cols' }, Object.entries(FOOTER).map(([title, links]) => h('div', { key: title }, h('h4', null, title), links.map((l) => h(Link, { key: l, href: '#', underline: false }, l))))),
    h('h4', null, 'Other games'), h('div', { className: 'og2-footer__games' }, OTHER_GAMES.map((g) => h(Link, { key: g, href: '#', underline: false }, g))),
    h('p', null, DISCLAIMER), h('p', { className: 'og2-copy' }, '© Overgear 2018-2026. All rights reserved. Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus. Reg. number: HE395043')));
}

/* ------------------------------------------------------------ the page */

function Page() {
  const { toast } = useToast();
  const wide = useMedia('(min-width: 1100px)');
  const rail = useMedia('(min-width: 1360px)');
  const [menu, setMenu] = useState(false);
  const o = useOrder();
  const main = [h(Title, { key: 't' }), h(Usps, { key: 'u' }), h(Form, { key: 'f', o })];
  const extra = [h(Wins, { key: 'w' }), h(How, { key: 'h' }), h(Reviews, { key: 'r' }), h(Also, { key: 'a' }), h(More, { key: 'm' })];
  return h('div', { className: 'og2' },
    h(Header, { onMenu: () => setMenu(true) }),
    h('div', { className: 'og2-body' },
      rail && h('aside', { className: 'og2-side' }, h(Categories)),
      h('main', { className: 'og2-main' },
        wide
          ? h('div', { className: 'og2-grid' }, h('div', { className: 'og2-col' }, main, extra), h('div', { className: 'og2-right' }, h(Summary, { o, toast }), h(Why)))
          : h('div', { className: 'og2-col' }, main, h(Summary, { o, toast }), h(Why), extra))),
    h(Footer),
    !wide && h('div', { className: 'og2-bar' }, h('div', null, h('strong', null, money(o.price)), h('small', null, `${o.from} → ${o.to} · ${o.duration}`)), h(Button, { variant: 'primary', size: 'md', icon: h(I.ShoppingCart01), onClick: () => toast({ message: `Added to cart: ${o.from}–${o.to} for ${money(o.price)}`, status: 'success' }) }, 'Add to cart')),
    h(Modal, { open: menu && !rail, onOpenChange: setMenu, title: 'Categories', height: 'viewport' }, h(Categories, { onPick: () => setMenu(false) })));
}

await initDom();
renderInto(h(ToastProvider, { placement: 'top-center' }, h(Page)), document.getElementById('root'));
