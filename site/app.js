import { t as requireReact } from '../lib/react-BZJXY1be.js';
import { t as initDom, r as renderInto } from '../lib/react-18-D4o7zN8K.js';
import manifest from './manifest.js';
import { TextField, Switch, Chip, ChipGroup, List, ListItem, Modal } from '../src/base.js';
import { Button } from '../src/components/Button.js';
import { LOGO_PATHS } from './logo.js';
import { SegmentedControl } from '../src/components/SegmentedControl.js';
import { Slider } from '../src/components/Slider.js';
import { Skeleton } from '../src/components/Skeleton.js';
import { Table, pixel, proportional } from '../src/components/Table.js';
import { composeStory, StoryCanvas, Boundary } from './story.js';

const icons = await import('../lib/line-HpXc8B8J.js');

const React = requireReact();
const { createElement: h, useState, useEffect, useMemo, useContext, createContext, Fragment } = React;
const SettingsContext = createContext(() => {});

/* ------------------------------------------------------------- page index */

const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stemOf = (file) => file.split('/').pop().replace(/\.stories.*$/, '').toLowerCase();

/** manifest (sections → items → children) → flat list of routable pages: one page per story file. */
const pages = [];
for (const { section, items } of manifest) {
  const add = (item, parent, group) => {
    const page = { section, group, parent, title: item.title, slug: kebab(item.title), file: item.file, lead: item.lead, examples: item.examples || [] };
    pages.push(page);
    (item.children || []).forEach((c) => add(c, page, group));
  };
  // An item with `group` is a catalog folder (no page of its own) that holds several pages.
  items.forEach((item) => (item.group ? item.items.forEach((i) => add(i, undefined, item.group)) : add(item)));
}
const routeOf = (p) => `#/${p.section.toLowerCase()}/${p.slug}`;

/* ------------------------------------------------------------------ utils */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
function markdown(src = '') {
  return src.trim().split(/\n\s*\n/).map((b) => {
    const lines = b.split('\n');
    if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
      return '<ul>' + lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('') + '</ul>';
    return `<p>${inline(lines.join(' '))}</p>`;
  }).join('');
}
const Md = ({ text, className = 'prose' }) =>
  text ? h('div', { className, dangerouslySetInnerHTML: { __html: markdown(text) } }) : null;

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

/* ------------------------------------------------- component registry (UI) */

const modules = new Map();
const loadModule = (file) => {
  if (!modules.has(file)) modules.set(file, import(file));
  return modules.get(file);
};
const ui = { Button, TextField, Switch, Chip };

/* ---------------------------------------------------------------- controls */

function Control({ name, spec, value, onChange, args }) {
  if (spec.if && args[spec.if.arg] !== spec.if.eq) return null;
  const { Switch, TextField } = ui;
  const type = typeof spec.control === 'string' ? spec.control : spec.control?.type;
  let input = null;
  if (type === 'boolean') {
    input = h(Switch, { size: 'sm', label: name, checked: !!value, onCheckedChange: onChange });
  } else if (type === 'inline-radio' || type === 'radio' || type === 'select') {
    const options = spec.options || [];
    input = h(ChipGroup, {
      size: 'sm', title: name, value: [String(value)],
      onValueChange: (v) => { const next = v[v.length - 1]; if (next !== undefined) onChange(options.find((o) => String(o) === next) ?? next); },
      options: options.map((o) => ({ value: String(o), label: String(o) })),
    });
  } else if (type === 'range') {
    const { min = 0, max = 100, step = 1 } = spec.control;
    input = h(Slider, { min, max, step, value: value ?? min, label: name, showValue: true, onValueChange: onChange });
  } else if (type === 'number') {
    input = h(TextField, {
      label: name, type: 'number', size: 'sm', value: value ?? '',
      onChange: (e) => onChange(e.target.value === '' ? undefined : Number(e.target.value)),
    });
  } else if (type === 'color') {
    input = h('div', { className: 'color-row' },
      h(TextField, { label: name, size: 'sm', value: value ?? '', onChange: (e) => onChange(e.target.value || undefined) }),
      h('input', { type: 'color', className: 'swatch', 'aria-label': name, value: /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#575df6', onChange: (e) => onChange(e.target.value) }));
  } else if (type === 'text') {
    input = h(TextField, { label: name, size: 'sm', value: value ?? '', onChange: (e) => onChange(e.target.value) });
  }
  if (!input) return null;
  return h('div', { className: 'control' },
    input);
}

function Controls({ meta, args, setOverride, reset, title = 'Settings' }) {
  const items = Object.entries(meta.argTypes || {}).filter(([, s]) => s.control);
  if (!items.length) return null;
  // Controls with the same `row` sit side by side.
  const groups = [];
  for (const it of items) {
    const last = groups[groups.length - 1];
    if (last && it[1].row && last[0][1].row === it[1].row) last.push(it); else groups.push([it]);
  }
  return h('div', { className: 'controls' },
    title && h('div', { className: 'controls-title' }, title),
    groups.map((g) => g.length === 1 && !g[0][1].row
      ? h(Control, { key: g[0][0], name: g[0][0], spec: g[0][1], args, value: args[g[0][0]], onChange: (v) => setOverride(g[0][0], v) })
      : h('div', { key: g[0][0], className: 'controls-row' }, g.map(([name, spec]) =>
        h(Control, { key: name, name, spec, args, value: args[name], onChange: (v) => setOverride(name, v) })))),
    h(ui.Button, { variant: 'secondary', size: 'xsm', onClick: reset }, 'Reset'));
}

/* ------------------------------------------------------------------ blocks */

function Code({ source }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!source || source.trim() === '{}') return null;
  const copy = async () => {
    try { await navigator.clipboard.writeText(source); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  };
  return h('div', { className: 'code' },
    h('div', { className: 'code-actions' },
      h(ui.Button, { variant: 'secondary', size: 'xsm', onClick: () => setOpen(!open) }, open ? 'Hide code' : 'Show code'),
      open && h(ui.Button, { variant: 'secondary', size: 'xsm', onClick: copy }, copied ? 'Copied' : 'Copy')),
    open && h('pre', null, h('code', null, source)));
}

/** Anchors of a page: every element marked with `data-anchor` (Playground, Props, each example or block). */
function Toc({ items }) {
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return h('nav', { className: 'toc', 'aria-label': 'On this page' },
    items.map((a) => h(ui.Chip, { key: a.id, size: 'sm', action: 'press', onClick: () => go(a.id) }, a.name)));
}

function Example({ meta, story, name, id, controls, overlay }) {
  const base = useMemo(() => composeStory(meta, story).args, [meta, story]);
  const [overrides, setOverrides] = useState({});
  const current = { ...base, ...overrides };
  const parameters = composeStory(meta, story).parameters;
  const showControls = controls && !(parameters.controls && parameters.controls.disable);
  const doc = parameters.docs || {};
  const gated = overlay || /defaultOpen/.test((doc.source && doc.source.originalSource) || '');
  const [shown, setShown] = useState(!gated);
  const [nonce, setNonce] = useState(0);
  // The settings of the playground live in the right column (or the sheet on small screens).
  const setSettings = useContext(SettingsContext);
  React.useLayoutEffect(() => {
    if (showControls) setSettings({ meta, args: { ...base, ...overrides }, setOverride: (k, v) => setOverrides((o) => ({ ...o, [k]: v })), reset: () => setOverrides({}) });
  }, [showControls, meta, base, overrides]);
  useEffect(() => () => { if (showControls) setSettings(null); }, [showControls]);
  return h('section', { className: 'example', id, 'data-anchor': name },
    h('h3', null, name),
    h('div', { className: 'stage' },
      h('div', { className: 'canvas' },
        shown
          ? h(Boundary, { key: nonce }, h(StoryCanvas, { meta, story, args: current }))
          : h('div', { className: 'gate' }, 'This example opens on top of the page.'),
        gated && h('div', { className: 'gate-actions' },
          !shown && h(ui.Button, { variant: 'primary', size: 'sm', onClick: () => setShown(true) }, 'Open example'),
          shown && h(ui.Button, { variant: 'secondary', size: 'xsm', onClick: () => setNonce(nonce + 1) }, 'Reopen'),
          shown && h(ui.Button, { variant: 'ghost', size: 'xsm', onClick: () => setShown(false) }, 'Hide')))),
    h(Code, { source: doc.source && doc.source.originalSource }));
}

const TYPE_CLEAN = (t) => (t ? t.raw || t.name : '');
const HIDDEN_PROPS = new Set(['ref', 'className', 'style', 'id', 'data-testid', 'contentClassName', 'portalContainer', 'keepMounted', 'initialFocus', 'finalFocus', 'name', 'form', 'labelId', 'captionId', 'focusRef', 'cellRef', 'onBlur']);
/** One short fragment: first sentence, no @tags, no trailing period. */
const brief = (text = '', max = 110) => text.replace(/@\w+.*$/s, '').trim().split(/(?<=[.!?])\s/)[0].replace(/\s+/g, ' ').replace(/\.$/, '').slice(0, max);
function PropsTable({ component, title = 'Props', id = 'props' }) {
  const props = component && component.__docgenInfo && component.__docgenInfo.props;
  const rows = props ? Object.entries(props).filter(([n, p]) => !HIDDEN_PROPS.has(n) && !/@internal/.test(p.description || '') && brief(p.description)).map(([name, p]) => ({ name, ...p })) : [];
  if (!rows.length) return null;
  const columns = [
    { key: 'name', header: 'Prop', width: proportional(2, { minWidth: 120 }), renderCell: (r) => h(Fragment, null, h('code', null, r.name), r.required && h('span', { className: 'req', title: 'Required' }, '*')) },
    { key: 'type', header: 'Type', width: proportional(3, { minWidth: 160 }), renderCell: (r) => h('code', { className: 'type' }, TYPE_CLEAN(r.tsType)) },
    { key: 'default', header: 'Default', width: pixel(120), renderCell: (r) => (r.defaultValue ? h('code', null, r.defaultValue.value) : '—') },
    { key: 'description', header: 'Description', width: proportional(4, { minWidth: 200 }), renderCell: (r) => h(Md, { text: brief(r.description), className: 'prose small' }) },
  ];
  return h('section', { className: 'section', id, 'data-anchor': title },
    h('h2', null, title),
    h(Table, { data: rows, columns, rowKey: 'name', caption: title, verticalAlign: 'top' }));
}

/* ------------------------------------------------------------------- pages */

const humanize = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
const storiesOf = (state, stem) => (state.__namedExportsOrder || Object.keys(state))
  .filter((k) => k !== 'default' && k !== '__namedExportsOrder' && k !== 'page' && state[k])
  .map((k) => ({ key: kebab(humanize(k)), id: `${stem}--${kebab(humanize(k))}`, name: state[k].name || humanize(k), story: state[k] }));

/** The page frame while its module loads: the known title is real, everything else is a skeleton of the same layout. */
function PageSkeleton({ entry }) {
  return h('article', { className: 'page page--loading', 'aria-busy': 'true', 'aria-label': `Loading ${entry.title}` },
    h('div', { className: 'eyebrow' }, entry.parent ? `${entry.section} · ${entry.parent.title}` : entry.group ? `${entry.section} · ${entry.group}` : entry.section),
    h('h1', null, entry.title),
    h(Skeleton, { variant: 'text', lines: 2, width: '70%', className: 'skel-lead' }),
    h('div', { className: 'skel-chips' }, [88, 64, 96, 80].map((w, i) => h(Skeleton, { key: i, variant: 'rect', width: w, height: 32, style: { borderRadius: 'var(--baseui-radius-full)' } }))),
    h(Skeleton, { variant: 'text', width: 160, height: 28, className: 'skel-title' }),
    h(Skeleton, { variant: 'rect', height: 96, style: { borderRadius: 'var(--baseui-radius-16)' } }),
    h(Skeleton, { variant: 'text', width: 120, height: 28, className: 'skel-title' }),
    h(Skeleton, { variant: 'rect', height: 220, style: { borderRadius: 'var(--baseui-radius-16)' } }));
}

/** Every page has the same structure: title, lead, anchors, Playground, Props, Examples. */
function Page({ entry }) {
  const files = [entry.file, ...entry.examples.map((e) => e.file)];
  const [states, setStates] = useState(null);
  const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    let alive = true;
    setStates(null);
    setAnchors([]);
    Promise.all(files.map(loadModule)).then((m) => alive && setStates(m), (e) => alive && setStates({ error: e }));
    return () => { alive = false; };
  }, [entry]);
  useEffect(() => {
    if (!states || states.error) return;
    const t = setTimeout(() => setAnchors([...document.querySelectorAll('.page [data-anchor]')].map((el) => ({ id: el.id, name: el.dataset.anchor }))), 120);
    return () => clearTimeout(t);
  }, [states]);
  if (!states) return h(PageSkeleton, { entry });
  if (states.error) return h('div', { className: 'error' }, String(states.error));

  const state = states[0];
  const meta = state.default;
  const stem = stemOf(entry.file);
  const stories = storiesOf(state, stem);
  const playground = stories.find((s) => s.key === 'playground');
  const rest = stories.filter((s) => s !== playground);
  const desc = meta.parameters && meta.parameters.docs && meta.parameters.docs.description;
  const isFoundation = entry.section === 'Foundations';
  const overlay = /^(Dialog|Alert Dialog)$/.test(entry.title);
  const extra = entry.examples.flatMap((e, i) => {
    const st = states[i + 1];
    const estem = stemOf(e.file);
    return storiesOf(st, estem).map((x) => ({ ...x, name: x.key === 'playground' ? e.title : `${e.title}: ${x.name}`, meta: st.default }));
  });

  return h('article', { className: 'page' },
    h('div', { className: 'eyebrow' }, entry.parent ? `${entry.section} · ${entry.parent.title}` : entry.group ? `${entry.section} · ${entry.group}` : entry.section),
    h('h1', null, entry.title),
    h(Md, { text: entry.lead || brief(desc && desc.component, 240) + '.', className: 'prose lead' }),
    anchors.length > 1 && h(Toc, { items: anchors }),
    state.page && h(state.page),
    playground && h(Example, { key: entry.slug + 'pg', meta, story: playground.story, name: playground.name, id: playground.id, controls: true, overlay }),
    !isFoundation && h(PropsTable, { component: meta.component }),
    entry.examples.map((e, i) => e.props && h(PropsTable, { key: e.title, component: states[i + 1].default.component, title: `${e.title} Props`, id: `props-${kebab(e.title)}` })),
    (rest.length > 0 || extra.length > 0) && h('section', { className: 'section' },
      !isFoundation && h('h2', null, 'Examples'),
      rest.map((s) => h(Example, { key: entry.slug + s.id, meta, story: s.story, name: s.name, id: s.id, controls: false, overlay })),
      extra.map((s) => h(Example, { key: entry.slug + s.id, meta: s.meta, story: s.story, name: s.name, id: s.id, controls: false, overlay }))));
}

function Home() {
  return h('article', { className: 'page' },
    h('div', { className: 'eyebrow' }, 'Design system'),
    h('h1', null, 'baseui'),
    h('p', { className: 'prose lead' }, 'A universal design system: foundations and components built on Base UI. Light and dark themes switch with the ', h('code', null, 'data-theme'), ' attribute.'),
    manifest.map((s) => h('section', { className: 'section', key: s.section },
      h('h2', null, s.section),
      h('div', { className: 'cards' }, pages.filter((p) => p.section === s.section && !p.parent).map((p) =>
        h('a', { className: 'card', key: p.title, href: routeOf(p) }, h('span', null, p.title)))))));
}

/* -------------------------------------------------------------- navigation */

function Nav({ entry, query }) {
  const [open, setOpen] = useState({});
  const kids = (p) => pages.filter((x) => x.parent === p);
  const match = (p) => p.title.toLowerCase().includes(query);
  const root = (p) => (p && p.parent ? p.parent : p);
  useEffect(() => {
    const r = root(entry);
    if (r) setOpen((o) => ({ ...o, [r.title]: true, ...(r.group ? { [`group:${r.group}`]: true } : {}) }));
  }, [entry]);
  const go = (p) => () => { location.hash = routeOf(p); };
  // A page with sub-pages is an expandable row; a group is an expandable folder whose rows are the pages (sub-pages follow their page).
  const pageRow = ({ p, sub }) => {
    const own = entry === p;
    if (!sub.length) return h(ListItem, { key: p.title, active: own, onClick: go(p) }, p.title);
    return h(ListItem, {
      key: p.title, active: own, expanded: query ? true : !!open[p.title], onExpandedChange: (v) => setOpen((o) => ({ ...o, [p.title]: v })), onClick: go(p),
      items: sub.map((c) => h(ListItem, { key: c.title, subitem: true, active: entry === c, onClick: go(c) }, c.title)),
    }, p.title);
  };
  const entries = (section) => {
    const out = [];
    for (const item of manifest.find((m) => m.section === section).items) {
      if (item.group) {
        const rows = pages.filter((p) => p.section === section && p.group === item.group && !p.parent).map((p) => {
          const sub = kids(p).filter((c) => match(c) || match(p));
          return match(p) || sub.length ? { p, sub } : null;
        }).filter(Boolean);
        if (rows.length) out.push({ group: item.group, rows });
      } else {
        const p = pages.find((x) => x.section === section && x.title === item.title);
        const sub = kids(p).filter((c) => match(c) || match(p));
        if (match(p) || sub.length) out.push({ p, sub });
      }
    }
    return out;
  };
  const sections = manifest.map(({ section }) => ({ section, shown: entries(section) })).filter((x) => x.shown.length > 0);
  return h('nav', { 'aria-label': 'Documentation' }, sections.map(({ section, shown }, i) =>
    h(List, { key: section, title: section, size: 'xsm', divider: i < sections.length - 1 },
      shown.map((e) => {
        if (!e.group) return pageRow(e);
        const k = `group:${e.group}`;
        const pagesIn = e.rows.flatMap(({ p, sub }) => [p, ...sub]);
        return h(ListItem, {
          key: k, active: false, expanded: query ? true : !!open[k], onExpandedChange: (v) => setOpen((o) => ({ ...o, [k]: v })), onClick: () => setOpen((o) => ({ ...o, [k]: !o[k] })),
          items: pagesIn.map((c) => h(ListItem, { key: c.title, subitem: true, active: entry === c, onClick: go(c) }, c.title)),
        }, e.group);
      }))));
}

/* --------------------------------------------------------------------- app */

let setMenu = () => {};
function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const f = () => { setHash(location.hash); window.scrollTo(0, 0); document.getElementById('main')?.scrollTo(0, 0); setMenu(false); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const [, section, slug] = hash.split('/');
  return pages.find((p) => p.section.toLowerCase() === section && p.slug === slug) || null;
}

function App() {
  const entry = useRoute();
  const [theme, setTheme] = useState(() => store.get('baseui-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [viewport, setViewport] = useState(() => (store.get('baseui-viewport', 'desktop') === 'mobile' ? 'mobile' : 'desktop'));
  const [q, setQ] = useState('');
  const [menu, _setMenu] = useState(false);
  const [settings, setSettings] = useState(null);
  const [sheet, setSheet] = useState(false);
  setMenu = _setMenu;
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); store.set('baseui-theme', theme); }, [theme]);
  useEffect(() => { store.set('baseui-viewport', viewport); }, [viewport]);
  useEffect(() => { document.title = entry ? `${entry.title} — baseui` : 'baseui'; }, [entry]);
  const { Button, TextField } = ui;
  const dark = theme === 'dark';

  const skip = (e) => { e.preventDefault(); const m = document.getElementById('main'); m.setAttribute('tabindex', '-1'); m.focus(); };
  const themeControl = h(SegmentedControl, { size: 'sm', showLabel: false, label: 'Theme', value: theme, onValueChange: setTheme, items: [{ value: 'light', label: 'Light theme', icon: h(icons.Sun) }, { value: 'dark', label: 'Dark theme', icon: h(icons.Moon01) }] });
  const viewControl = h(SegmentedControl, { size: 'sm', showLabel: false, label: 'Preview width', value: viewport, onValueChange: setViewport, items: [{ value: 'desktop', label: 'Desktop', icon: h(icons.Monitor01) }, { value: 'mobile', label: 'Mobile', icon: h(icons.Phone01) }] });
  const catalog = [
    h('div', { className: 'search', key: 'search' }, h(TextField, {
      label: 'Search', floatingLabel: false, size: 'sm', value: q, clearable: true, actionLabel: 'Clear search', startIcon: h(icons.SearchSm, { size: 24 }),
      onChange: (e) => setQ(e.target.value),
    })),
    h(Nav, { key: 'nav', entry, query: q.trim().toLowerCase() }),
  ];
  return h(SettingsContext.Provider, { value: setSettings },
      h('div', { className: 'shell' },
        h('a', { className: 'skip', href: '#main', onClick: skip }, 'Skip to content'),
        h('header', { className: 'appbar' },
          h(Button, { variant: 'ghost', size: 'sm', isIconOnly: true, label: 'Open catalog', icon: h(icons.Menu01), className: 'menu-btn', onClick: () => _setMenu(true) }),
          h('a', { className: 'brand', href: '#/', 'aria-label': 'baseui' },
            h('svg', { className: 'brand-logo', viewBox: '0 0 64 14', width: 128, height: 28, fill: 'currentColor', 'aria-hidden': 'true', focusable: 'false' }, LOGO_PATHS.map((d) => h('path', { key: d.slice(0, 24), d })))),
          h('div', { className: 'appbar-end' }, h('div', { className: 'view-control' }, viewControl), themeControl)),
        h('div', { className: 'body' + (settings ? ' body--settings' : '') },
          h('aside', { className: 'side' }, catalog),
          h('main', { id: 'main', 'data-viewport': viewport },
            entry ? h(Page, { entry, key: entry.slug }) : h(Home)),
          settings && h('aside', { className: 'settings', 'aria-label': 'Settings' }, h(Controls, settings))),
        settings && h(Button, { variant: 'primary', size: 'md', className: 'settings-fab', icon: h(icons.Sliders01), onClick: () => setSheet(true) }, 'Settings'),
        h(Modal, { open: menu, onOpenChange: _setMenu, title: 'Catalog', height: 'viewport' }, h('div', { className: 'catalog-sheet' }, catalog)),
        h(Modal, { open: sheet && !!settings, onOpenChange: setSheet, title: 'Settings', primaryAction: h(Button, { onClick: () => setSheet(false) }, 'Done') }, settings && h('div', { className: 'settings-sheet' }, h(Controls, { ...settings, title: null })))));
}

await initDom();
renderInto(h(App), document.getElementById('root'));
