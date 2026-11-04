import { documentControls } from './controls-docs.js';
import { usageOf } from '../src/usage.js';
import { createRoot } from 'react-dom/client';
import { React } from '../src/react.js';
import manifest from './manifest.js';
import { TextInput } from '../src/components/TextInput.jsx';
import { Switch } from '../src/components/Switch.jsx';
import { Token } from '../src/components/Token.jsx';
import { TokenGroup } from '../src/components/TokenGroup.jsx';
import { Dialog } from '../src/components/Dialog.jsx';
import { List, ListItem } from '../src/components/List.jsx';
import { Button, IconButton } from '../src/components/Button.jsx';
import { LOGO_PATHS } from './logo.js';
import { SegmentedControl } from '../src/components/SegmentedControl.jsx';
import { Slider } from '../src/components/Slider.jsx';
import { Skeleton } from '../src/components/Skeleton.jsx';
import { BuiltinIcon } from '../src/builtin-icons.jsx';
import { Table, pixel, proportional } from '../src/components/Table.jsx';
import { composeStory, StoryCanvas, Boundary } from './story.jsx';
import { startTheme } from './theme.js';
import { AppContext, TemplatesGallery, TemplatePage } from './templates-ui.jsx';

startTheme();
const icons = await import('../lib/line-HpXc8B8J.js');

const { createElement: h, useState, useEffect, useMemo, useContext, createContext, Fragment } = React;
const SettingsContext = createContext(() => {});

/* ------------------------------------------------------------- page index */

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const stemOf = (file) =>
  file
    .split('/')
    .pop()
    .replace(/\.stories.*$/, '')
    .toLowerCase();

/** manifest (sections → items → children) → flat list of routable pages: one page per story file. */
const pages = [];
for (const { section, items } of manifest) {
  const add = (item, parent, group, hidden) => {
    const page = {
      template: item.template,
      gallery: item.page === 'templates',
      hidden: hidden || undefined,
      section,
      group,
      parent,
      title: item.title,
      slug: kebab(item.title),
      file: item.file,
      lead: item.lead,
      icon: item.icon,
      examples: item.examples || [],
    };
    pages.push(page);
    (item.children || []).forEach((c) => add(c, page, group, hidden));
  };
  // An item with `group` is a catalog folder (no page of its own) that holds several pages.
  items.forEach((item) => (item.group ? item.items.forEach((i) => add(i, undefined, item.group, item.hidden)) : add(item)));
}
const routeOf = (p) => `#/${p.section.toLowerCase()}/${p.slug}`;

/* ------------------------------------------------------------------ utils */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
function markdown(src = '') {
  return src
    .trim()
    .split(/\n\s*\n/)
    .map((b) => {
      const lines = b.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return '<ul>' + lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('') + '</ul>';
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
}
const Md = ({ text, className = 'prose' }) => (text ? <div className={className} dangerouslySetInnerHTML={{ __html: markdown(text) }} /> : null);

const store = {
  get(k, d) {
    try {
      return localStorage.getItem(k) ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* storage unavailable */
    }
  },
};

/* ------------------------------------------------- component registry (UI) */

const modules = new Map();
const loadModule = (file) => {
  if (!modules.has(file))
    modules.set(
      file,
      import(file).then((m) => {
        documentControls(m.default);
        return m;
      }),
    );
  return modules.get(file);
};
const ui = { Button, TextInput, Switch, Token };

/* ---------------------------------------------------------------- controls */

function Control({ name, spec, value, onChange, args }) {
  if (spec.if && args[spec.if.arg] !== spec.if.eq) return null;
  const { Switch, TextInput } = ui;
  const type = typeof spec.control === 'string' ? spec.control : spec.control?.type;
  let input = null;
  if (type === 'boolean') {
    input = <Switch size="sm" label={name} checked={!!value} onCheckedChange={onChange} />;
  } else if (type === 'inline-radio' || type === 'radio' || type === 'select') {
    const options = spec.options || [];
    input = (
      <TokenGroup
        size="sm"
        title={name}
        value={[String(value)]}
        onValueChange={(v) => {
          const next = v[v.length - 1];
          if (next !== undefined) onChange(options.find((o) => String(o) === next) ?? next);
        }}
        options={options.map((o) => ({ value: String(o), label: String(o) }))}
      />
    );
  } else if (type === 'range') {
    const { min = 0, max = 100, step = 1 } = spec.control;
    input = <Slider min={min} max={max} step={step} value={value ?? min} label={name} showValue onValueChange={onChange} />;
  } else if (type === 'number') {
    input = (
      <TextInput
        label={name}
        type="number"
        size="sm"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      />
    );
  } else if (type === 'color') {
    input = (
      <div className="color-row">
        <TextInput label={name} size="sm" value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)} />
        <input
          type="color"
          className="swatch"
          aria-label={name}
          value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#575df6'}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  } else if (type === 'text') {
    input = <TextInput label={name} size="sm" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  if (!input) return null;
  return <div className="control">{input}</div>;
}

function Controls({ meta, args, setOverride, reset, title = 'Settings', showReset = true }) {
  const items = Object.entries(meta.argTypes || {}).filter(([, s]) => s.control);
  if (!items.length) return null;
  // Controls with the same `row` sit side by side.
  const groups = [];
  for (const it of items) {
    const last = groups[groups.length - 1];
    if (last && it[1].row && last[0][1].row === it[1].row) last.push(it);
    else groups.push([it]);
  }
  // A control can also set others: a preset sets all the theme settings, any of them turns the preset into custom.
  const change = (name, spec, v) => {
    setOverride(name, v);
    const more = spec.derive && spec.derive(v);
    if (more) Object.entries(more).forEach(([k, x]) => setOverride(k, x));
  };
  return (
    <div className="controls">
      {title && <div className="controls-title">{title}</div>}
      {groups.map((g) =>
        g.length === 1 && !g[0][1].row ? (
          <Control key={g[0][0]} name={g[0][0]} spec={g[0][1]} args={args} value={args[g[0][0]]} onChange={(v) => change(g[0][0], g[0][1], v)} />
        ) : (
          <div key={g[0][0]} className="controls-row">
            {g.map(([name, spec]) => (
              <Control key={name} name={name} spec={spec} args={args} value={args[name]} onChange={(v) => change(name, spec, v)} />
            ))}
          </div>
        ),
      )}
      {showReset && (
        <ui.Button variant="secondary" size="md" width="100%" className="controls-reset" onClick={reset}>
          Reset
        </ui.Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ blocks */

function Code({ source }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!source || source.trim() === '{}') return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="code">
      <div className="code-actions">
        <ui.Button variant="secondary" size="xsm" onClick={() => setOpen(!open)}>
          {open ? 'Hide code' : 'Show code'}
        </ui.Button>
        {open && (
          <ui.Button variant="secondary" size="xsm" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </ui.Button>
        )}
      </div>
      {open && (
        <pre>
          <code>{source}</code>
        </pre>
      )}
    </div>
  );
}

/** Anchors of a page: every element marked with `data-anchor` (Playground, Props, each example or block). */
function Toc({ items }) {
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <nav className="toc" aria-label="On this page">
      {items.map((a) => (
        <ui.Token key={a.id} size="sm" action="press" onClick={() => go(a.id)}>
          {a.name}
        </ui.Token>
      ))}
    </nav>
  );
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
    if (showControls)
      setSettings({
        meta,
        args: { ...base, ...overrides },
        setOverride: (k, v) => setOverrides((o) => ({ ...o, [k]: v })),
        reset: () => {
          meta.onReset && meta.onReset();
          setOverrides({});
        },
      });
  }, [showControls, meta, base, overrides]);
  useEffect(
    () => () => {
      if (showControls) setSettings(null);
    },
    [showControls],
  );
  return (
    <section className="example" id={id} data-anchor={name}>
      <h3>{name}</h3>
      <div className="stage">
        <div className="canvas">
          {shown ? (
            <Boundary key={nonce}>
              <StoryCanvas meta={meta} story={story} args={current} />
            </Boundary>
          ) : (
            <div className="gate">This example opens on top of the page</div>
          )}
          {gated && (
            <div className="gate-actions">
              {!shown && (
                <ui.Button variant="primary" size="sm" onClick={() => setShown(true)}>
                  Open example
                </ui.Button>
              )}
              {shown && (
                <ui.Button variant="secondary" size="xsm" onClick={() => setNonce(nonce + 1)}>
                  Reopen
                </ui.Button>
              )}
              {shown && (
                <ui.Button variant="ghost" size="xsm" onClick={() => setShown(false)}>
                  Hide
                </ui.Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Code source={doc.source && doc.source.originalSource} />
    </section>
  );
}

const TYPE_CLEAN = (t) => (t ? t.raw || t.name : '');
const HIDDEN_PROPS = new Set([
  'ref',
  'className',
  'style',
  'id',
  'data-testid',
  'contentClassName',
  'portalContainer',
  'keepMounted',
  'initialFocus',
  'finalFocus',
  'name',
  'form',
  'labelId',
  'captionId',
  'focusRef',
  'cellRef',
  'onBlur',
]);
/** One short fragment: first sentence, no @tags, no trailing period. */
const brief = (text = '', max = 110) =>
  text
    .replace(/@\w+.*$/s, '')
    .trim()
    .split(/(?<=[.!?])\s/)[0]
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .slice(0, max);
/** What to do and what not to do with a component (src/usage.js), the guidance an agent reads before it builds with it. */
function UsageBlock({ component }) {
  const usage = component && usageOf(component);
  if (!usage) return null;
  return (
    <section className="section" id="usage" data-anchor="Usage">
      <h2>Usage</h2>
      <div className="usage">
        <div className="usage__col usage__col--do">
          <h3>
            <BuiltinIcon name="success" size={20} aria-hidden="true" /> Do
          </h3>
          <ul>
            {usage.do.map((t) => (
              <li key={t}>
                <Md text={t} />
              </li>
            ))}
          </ul>
        </div>
        <div className="usage__col usage__col--dont">
          <h3>
            <BuiltinIcon name="error" size={20} aria-hidden="true" /> Don&apos;t
          </h3>
          <ul>
            {usage.dont.map((t) => (
              <li key={t}>
                <Md text={t} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
function PropsTable({ component, title = 'Props', id = 'props' }) {
  const props = component && component.__docgenInfo && component.__docgenInfo.props;
  const rows = props
    ? Object.entries(props)
        .filter(([n, p]) => !HIDDEN_PROPS.has(n) && !/@internal/.test(p.description || '') && brief(p.description))
        .map(([name, p]) => ({ name, ...p }))
    : [];
  if (!rows.length) return null;
  const columns = [
    {
      key: 'name',
      header: 'Prop',
      width: proportional(2, { minWidth: 120 }),
      renderCell: (r) => (
        <>
          <code>{r.name}</code>
          {r.required && (
            <span className="req" title="Required">
              *
            </span>
          )}
        </>
      ),
    },
    { key: 'type', header: 'Type', width: proportional(3, { minWidth: 160 }), renderCell: (r) => <code className="type">{TYPE_CLEAN(r.tsType)}</code> },
    { key: 'default', header: 'Default', width: pixel(120), renderCell: (r) => (r.defaultValue ? <code>{r.defaultValue.value}</code> : '—') },
    {
      key: 'description',
      header: 'Description',
      width: proportional(4, { minWidth: 200 }),
      renderCell: (r) => <Md text={brief(r.description)} className="prose small" />,
    },
  ];
  return (
    <section className="section" id={id} data-anchor={title}>
      <h2>{title}</h2>
      <Table data={rows} columns={columns} rowKey="name" caption={title} verticalAlign="top" />
    </section>
  );
}

/* ------------------------------------------------------------------- pages */

const humanize = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
const storiesOf = (state, stem) =>
  (state.__namedExportsOrder || Object.keys(state))
    .filter((k) => k !== 'default' && k !== '__namedExportsOrder' && k !== 'page' && state[k])
    .map((k) => ({ key: kebab(humanize(k)), id: `${stem}--${kebab(humanize(k))}`, name: state[k].name || humanize(k), story: state[k] }));

/** The page frame while its module loads: the known title is real, everything else is a skeleton of the same layout. */
function PageSkeleton({ entry }) {
  return (
    <article className="page page--loading" aria-busy="true" aria-label={`Loading ${entry.title}`}>
      <div className="eyebrow">
        {entry.parent ? `${entry.section} · ${entry.parent.title}` : entry.group ? `${entry.section} · ${entry.group}` : entry.section}
      </div>
      <h1>{entry.title}</h1>
      <Skeleton variant="text" lines={2} width="70%" className="skel-lead" />
      <div className="skel-chips">
        {[88, 64, 96, 80].map((w, i) => (
          <Skeleton key={i} variant="rect" width={w} height={32} style={{ borderRadius: 'var(--bui-radius-full)' }} />
        ))}
      </div>
      <Skeleton variant="text" width={160} height={28} className="skel-title" />
      <Skeleton variant="rect" height={96} style={{ borderRadius: 'var(--bui-radius-2xl)' }} />
      <Skeleton variant="text" width={120} height={28} className="skel-title" />
      <Skeleton variant="rect" height={220} style={{ borderRadius: 'var(--bui-radius-2xl)' }} />
    </article>
  );
}

/** A page is a story file (components, foundations), a template, a theme or the gallery of templates. */
function Page({ entry }) {
  if (entry.gallery) return <GalleryPage entry={entry} />;
  if (entry.template) return <TemplatePage entry={entry} routeOf={routeOf} pages={pages} />;
  return <StoryPage entry={entry} />;
}

function GalleryPage({ entry }) {
  return (
    <article className="page page--template">
      <div className="eyebrow">Templates</div>
      <h1>{entry.title}</h1>
      <p className="prose lead">{entry.lead}</p>
      <TemplatesGallery routeOf={routeOf} find={(id) => pages.find((p) => p.template === id)} />
    </article>
  );
}

/** Every story page has the same structure: title, lead, anchors, Playground, Props, Examples. */
function StoryPage({ entry }) {
  const files = [entry.file, ...entry.examples.map((e) => e.file)];
  const [states, setStates] = useState(null);
  const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    let alive = true;
    setStates(null);
    setAnchors([]);
    Promise.all(files.map(loadModule)).then(
      (m) => alive && setStates(m),
      (e) => alive && setStates({ error: e }),
    );
    return () => {
      alive = false;
    };
  }, [entry]);
  useEffect(() => {
    if (!states || states.error) return;
    const t = setTimeout(() => setAnchors([...document.querySelectorAll('.page [data-anchor]')].map((el) => ({ id: el.id, name: /** @type {HTMLElement} */ (el).dataset.anchor }))), 120);
    return () => clearTimeout(t);
  }, [states]);
  if (!states) return <PageSkeleton entry={entry} />;
  if (states.error) return <div className="error">{String(states.error)}</div>;

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

  return (
    <article className="page">
      <div className="eyebrow">
        {entry.parent ? `${entry.section} · ${entry.parent.title}` : entry.group ? `${entry.section} · ${entry.group}` : entry.section}
      </div>
      <h1>{entry.title}</h1>
      <Md text={entry.lead || brief(desc && desc.component, 240)} className="prose lead" />
      {anchors.length > 1 && <Toc items={anchors} />}
      {state.page && <state.page />}
      {playground && (
        <Example key={entry.slug + 'pg'} meta={meta} story={playground.story} name={playground.name} id={playground.id} controls overlay={overlay} />
      )}
      {!isFoundation && <UsageBlock component={meta.component} />}
      {!isFoundation && <PropsTable component={meta.component} />}
      {entry.examples.map(
        (e, i) => e.props && <PropsTable key={e.title} component={states[i + 1].default.component} title={`${e.title} Props`} id={`props-${kebab(e.title)}`} />,
      )}
      {(rest.length > 0 || extra.length > 0) && (
        <section className="section">
          {!isFoundation && <h2>Examples</h2>}
          {rest.map((s) => (
            <Example key={entry.slug + s.id} meta={meta} story={s.story} name={s.name} id={s.id} controls={false} overlay={overlay} />
          ))}
          {extra.map((s) => (
            <Example key={entry.slug + s.id} meta={s.meta} story={s.story} name={s.name} id={s.id} controls={false} overlay={overlay} />
          ))}
        </section>
      )}
    </article>
  );
}

// sections without a heading in the menu make one block on the home page: their cards stand in one row
const blocks = manifest.reduce((out, s) => {
  const last = out[out.length - 1];
  if (last && last[0].hideTitle && s.hideTitle) last.push(s);
  else out.push([s]);
  return out;
}, []);

function Home() {
  return (
    <article className="page">
      <div className="eyebrow">Design system</div>
      <h1>baseui</h1>
      <p className="prose lead">
        {'A universal design system: foundations and components built on Base UI. Light and dark themes switch with the '}
        <code>data-theme</code>
        {' attribute'}
      </p>
      {blocks.map((block) => (
        <section className="section" key={block.map((s) => s.section).join()}>
          {!block[0].hideTitle && <h2>{block[0].section}</h2>}
          <div className="cards">
            {pages
              .filter((p) => block.some((s) => s.section === p.section) && !p.parent && !p.hidden)
              .map((p) => (
                <a className="card" key={p.title} href={routeOf(p)}>
                  {pageIcon(p, 24) && (
                    <span className="card-icon" aria-hidden="true">
                      {pageIcon(p, 24)}
                    </span>
                  )}
                  <span>{p.title}</span>
                </a>
              ))}
          </div>
        </section>
      ))}
    </article>
  );
}

/* -------------------------------------------------------------- navigation */

/** The icon of a page of Theming and Foundations (a name of the line icon set in the manifest). */
const pageIcon = (p, size) => (p.icon && icons[p.icon] ? h(icons[p.icon], { size }) : undefined);

// five quick clicks on the logo open the Overgear showcase (a hidden entry: it is in no menu and no list)
const logoClicks = { n: 0, t: 0 };
function countLogoClicks(e) {
  const now = Date.now();
  logoClicks.n = now - logoClicks.t < 1500 ? logoClicks.n + 1 : 1;
  logoClicks.t = now;
  if (logoClicks.n >= 5) {
    logoClicks.n = 0;
    e.preventDefault();
    location.href = 'overgear/';
  }
}

function Nav({ entry, query }) {
  // One folder is open at a time; a folder is a row that opens a list and is not a page itself.
  const [openKey, setOpenKey] = useState(null);
  const kids = (p) => pages.filter((x) => x.parent === p);
  const match = (p) => p.title.toLowerCase().includes(query);
  const root = (p) => (p && p.parent ? p.parent : p);
  const folderOf = (r) => (!r ? null : r.group ? `group:${r.group}` : kids(r).length ? `group:${r.title}` : null);
  useEffect(() => {
    setOpenKey(folderOf(root(entry)));
  }, [entry]);
  const go = (p) => () => {
    location.hash = routeOf(p);
  };
  const folder = (name, list) => {
    const k = `group:${name}`;
    const toggle = (v) => setOpenKey((cur) => (v === undefined ? (cur === k ? null : k) : v ? k : cur === k ? null : cur));
    return (
      <ListItem
        key={k}
        active={false}
        expanded={query ? true : openKey === k}
        onExpandedChange={toggle}
        onClick={() => toggle()}
        items={list.map((c) => (
          <ListItem key={c.title} subitem active={entry === c} onClick={go(c)}>
            {c.title}
          </ListItem>
        ))}
      >
        {name}
      </ListItem>
    );
  };
  const entries = (section) => {
    const out = [];
    for (const item of /** @type {any[]} */ (manifest.find((m) => m.section === section).items)) {
      if (item.hidden) continue;
      if (item.group) {
        const list = pages.filter((p) => p.section === section && p.group === item.group).filter((p) => match(p) || (p.parent && match(p.parent)));
        if (list.length) out.push({ name: item.group, list });
      } else {
        const p = pages.find((x) => x.section === section && x.title === item.title);
        const sub = kids(p);
        if (!sub.length) {
          if (match(p)) out.push({ p });
          continue;
        }
        const list = [p, ...sub].filter((x) => match(x) || match(p));
        if (list.length) out.push({ name: item.title, list });
      }
    }
    return out;
  };
  const sections = manifest.map(({ section }) => ({ section, shown: entries(section) })).filter((x) => x.shown.length > 0);
  return (
    <nav aria-label="Documentation">
      {sections.map(({ section, shown }, i) => (
        <List key={section} title={manifest.find((m) => m.section === section).hideTitle ? undefined : section} size="sm" divider={i < sections.length - 1 && !(manifest.find((m) => m.section === section).hideTitle && manifest.find((m) => m.section === sections[i + 1].section).hideTitle)}>
          {shown.map((e) =>
            e.p ? (
              <ListItem key={e.p.title} active={entry === e.p} icon={pageIcon(e.p, 20)} onClick={go(e.p)}>
                {e.p.title}
              </ListItem>
            ) : (
              folder(e.name, e.list)
            ),
          )}
        </List>
      ))}
    </nav>
  );
}

/* --------------------------------------------------------------------- app */

/** @type {(open: boolean) => void} */
let setMenu = () => {};
function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const f = () => {
      setHash(location.hash);
      window.scrollTo(0, 0);
      document.getElementById('main')?.scrollTo(0, 0);
      setMenu(false);
    };
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
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    store.set('baseui-theme', theme);
  }, [theme]);
  useEffect(() => {
    store.set('baseui-viewport', viewport);
  }, [viewport]);
  useEffect(() => {
    document.title = entry ? `${entry.title} — baseui` : 'baseui';
  }, [entry]);
  const { Button, TextInput } = ui;
  const dark = theme === 'dark';

  const skip = (e) => {
    e.preventDefault();
    const m = document.getElementById('main');
    m.setAttribute('tabindex', '-1');
    m.focus();
  };
  const themeControl = (
    <SegmentedControl
      size="sm"
      showLabel={false}
      label="Theme"
      value={theme}
      onValueChange={setTheme}
      items={[
        { value: 'light', label: 'Light theme', icon: <icons.Sun /> },
        { value: 'dark', label: 'Dark theme', icon: <icons.Moon01 /> },
      ]}
    />
  );
  const viewControl = (
    <SegmentedControl
      size="sm"
      showLabel={false}
      label="Preview width"
      value={viewport}
      onValueChange={setViewport}
      items={[
        { value: 'desktop', label: 'Desktop', icon: <icons.Monitor01 /> },
        { value: 'mobile', label: 'Mobile', icon: <icons.Phone01 /> },
      ]}
    />
  );
  const catalog = [
    <div className="search" key="search">
      <TextInput
        type="search"
        size="sm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>,
    <Nav key="nav" entry={entry} query={q.trim().toLowerCase()} />,
  ];
  return (
    <SettingsContext.Provider value={setSettings}>
      <AppContext.Provider value={{ theme, viewport, setTheme }}>
      <div className="shell">
        <a className="skip" href="#main" onClick={skip}>
          Skip to content
        </a>
        <header className="appbar">
          <IconButton
            variant="ghost"
            size="sm"
            label="Open catalog"
            icon={<icons.Menu01 />}
            className="menu-btn"
            tooltip={false}
            onClick={() => _setMenu(true)}
          />
          <a className="brand" href="#/" aria-label="baseui" onClick={countLogoClicks}>
            <svg className="brand-logo" viewBox="0 0 64 14" width={128} height={28} fill="currentColor" aria-hidden="true" focusable="false">
              {LOGO_PATHS.map((d) => (
                <path key={d.slice(0, 24)} d={d} />
              ))}
            </svg>
          </a>
          <div className="appbar-end">
            <div className="view-control">{viewControl}</div>
            {themeControl}
          </div>
        </header>
        <div className={'body' + (settings ? ' body--settings' : '')}>
          <aside className="side">
            <div className="panel-scroll">{catalog}</div>
          </aside>
          <main id="main" data-viewport={viewport}>
            {entry ? <Page entry={entry} key={entry.slug} /> : <Home />}
          </main>
          {settings && (
            <aside className="settings" aria-label="Settings">
              <div className="panel-scroll">
                <Controls {...settings} />
              </div>
            </aside>
          )}
        </div>
        {settings && (
          <Button variant="primary" size="md" className="settings-fab" icon={<icons.Sliders01 />} onClick={() => setSheet(true)}>
            Settings
          </Button>
        )}
        <Dialog open={menu} onOpenChange={_setMenu} title="Catalog" height="viewport">
          <div className="catalog-sheet">{catalog}</div>
        </Dialog>
        <Dialog
          open={sheet && !!settings}
          onOpenChange={setSheet}
          title="Settings"
          primaryAction={
            <Button variant="primary" onClick={() => setSheet(false)}>
              Done
            </Button>
          }
          secondaryAction={
            settings && (
              <Button variant="secondary" onClick={settings.reset}>
                Reset
              </Button>
            )
          }
        >
          {settings && (
            <div className="settings-sheet">
              <Controls {...settings} title={null} showReset={false} />
            </div>
          )}
        </Dialog>
      </div>
      </AppContext.Provider>
    </SettingsContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
