// The Overgear showcase. For now it has one section: the colors of Overgear, light and dark, and what the dark theme changes against the default.
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Banner } from '../../src/components/Banner.jsx';
import { Table, proportional } from '../../src/components/Table.jsx';
import { Tabs } from '../../src/components/Tabs.jsx';
import { Typography } from './typography-page.jsx';
import { Theme } from './theme-page.jsx';
import { startOvergearTheme } from '../theme.js';

startOvergearTheme();

// the tokens the page shows, in groups
/** @type {Array<[string, string[]]>} */
const GROUPS = [
  ['Text and icons', ['text-and-icon-primary', 'text-and-icon-secondary', 'text-and-icon-disabled', 'text-and-icon-accent']],
  ['Backgrounds', ['background-primary', 'background-secondary', 'background-tertiary', 'background-disabled', 'background-accent', 'background-brand', 'extensions-background-surface']],
  ['Borders', ['border-primary', 'border-accent', 'border-disabled']],
];
const CHANGED = ['text-and-icon-primary', 'text-and-icon-secondary', 'text-and-icon-disabled', 'text-and-icon-accent', 'background-primary', 'background-secondary', 'background-tertiary', 'background-disabled', 'background-accent', 'border-primary', 'border-accent', 'border-disabled', 'extensions-background-surface'];

/** The value of a token in a scope with data-theme: read from the computed style, as a hex. */
const hex = (css) => {
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (!m) return css.trim();
  const [r, g, b] = m[1].split(/[ ,/]+/).map(Number);
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
};
function useValues(theme) {
  const ref = useRef(null);
  const [values, setValues] = useState({});
  useEffect(() => {
    if (!ref.current) return;
    const probe = document.createElement('span');
    ref.current.append(probe);
    const out = {};
    for (const [, names] of GROUPS) for (const n of names) {
      probe.style.color = `var(--baseui-${n})`;
      out[n] = hex(getComputedStyle(probe).color);
    }
    probe.remove();
    setValues(out);
  }, [theme]);
  return [ref, values];
}

/** One mode of the palette: its swatches and a few real components in it. */
function Mode({ theme, title }) {
  const [ref, values] = useValues(theme);
  return (
    <div className="ov-mode" data-theme={theme} ref={ref}>
      <h3>{title}</h3>
      {GROUPS.map(([group, names]) => (
        <div key={group} className="ov-preview">
          <p className="ov-note">{group}</p>
          <div className="ov-swatches">
            {names.map((n) => (
              <div key={n} className="ov-swatch">
                <div className="ov-swatch__chip" style={{ background: `var(--baseui-${n})`, color: n.startsWith('Text') ? undefined : 'var(--baseui-text-and-icon-primary)' }}>{n.startsWith('Text') ? 'Aa' : ''}</div>
                <span className="ov-swatch__name">{n}</span>
                <span className="ov-swatch__value">{values[n] || ''}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="ov-preview">
        <p className="ov-note">In use</p>
        <Card variant="surface" padding={4}>
          <div className="ov-preview">
            <div className="ov-row"><Button variant="primary" label="Buy now" /><Button variant="secondary" label="Add to cart" /><Badge variant="info" label="Hot Offer" /></div>
            <TextInput label="Email" defaultValue="name@example.com" />
            <Switch label="Seller online" defaultChecked />
          </div>
        </Card>
      </div>
    </div>
  );
}

/** The default dark values of the tokens, read from tokens.css. */
function useDefaults() {
  const [map, setMap] = useState({});
  useEffect(() => {
    fetch('../tokens.css').then((r) => r.text()).then((css) => {
      const block = (css.match(/\[data-theme="dark"\]\s*\{([^}]*)\}/) || [])[1] || '';
      const out = {};
      for (const m of block.matchAll(/--baseui-([A-Za-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
      setMap(out);
    }).catch(() => {});
  }, []);
  return map;
}

function Changes() {
  const defaults = useDefaults();
  const [ref, now] = useValues('dark');
  const rows = CHANGED.map((n) => ({ id: n, name: n, was: (defaults[n] || '').toLowerCase(), now: now[n] || '' }));
  const swatch = (v) => <span className="ov-dot" style={{ background: v }} aria-hidden="true" />;
  return (
    <div className="ov-table" data-theme="dark" ref={ref} style={{ borderRadius: 'var(--baseui-radius-2xl)', background: 'var(--baseui-background-primary)' }}>
      <Table
        data={rows}
        rowKey="id"
        caption="What the dark theme changes"
        columns={[
          { key: 'name', header: 'Token', width: proportional(3, { minWidth: 220 }) },
          { key: 'was', header: 'Default dark', width: proportional(2, { minWidth: 140 }), renderCell: (r) => <span>{r.was && swatch(r.was)}{r.was}</span> },
          { key: 'now', header: 'Overgear dark', width: proportional(2, { minWidth: 140 }), renderCell: (r) => <span>{r.now && swatch(r.now)}{r.now}</span> },
        ]}
      />
    </div>
  );
}

/** The pages of the showcase, by the hash of the address: #/theme, #/typography and #/colors. Each has its heading and its lead, which are shown inside its panel, under the tabs. */
const PAGES = [
  ['theme', 'Theme', 'The local theme of Overgear: the shape, the radius, the animation, floating, glass, the blue cast of the dark theme and the brand. The bottom bar and the dropdowns have settings of their own, which can be switched off. It applies to this showcase and to the example only'],
  ['typography', 'Typography', 'The type of the Overgear example: Apfel Grotezk by Collletttivo (SIL Open Font License), the heading font and the text font of these pages only. The scale below is the scale of the system, set in it'],
  ['colors', 'Colors', 'The palette of the Overgear example. The dark theme leans to the deep navy of overgear.com, with a blue cast that is set on the Theme page, from none to full: a deep ground, bluish layers and a soft cool-white text. The light theme is off for now. It applies only to the pages of this showcase and of the example'],
];
const pageOf = () => {
  const id = location.hash.replace(/^#\/?/, '');
  return PAGES.some(([p]) => p === id) ? id : PAGES[0][0];
};
// the light theme of Overgear is off for now: the pages are dark only
const LIGHT = false;

function Colors() {
  return (
    <>
      <section className="ov-section">
        <h3 className="ov-h2">{LIGHT ? 'Light and dark' : 'Dark'}</h3>
        <div className="ov-modes">
          {LIGHT && <Mode theme="light" title="Light" />}
          <Mode theme="dark" title="Dark" />
        </div>
      </section>
      <section className="ov-section">
        <div className="ov-section__head">
          <h3 className="ov-h2">What the dark theme changes</h3>
          <p className="ov-note">The tokens of the dark theme that Overgear sets in overgear/overgear.css, against the default dark theme</p>
        </div>
        <Changes />
      </section>
    </>
  );
}

function App() {
  const [page, setPage] = useState(pageOf);
  useEffect(() => {
    const f = () => setPage(pageOf());
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  const content = { theme: <Theme />, typography: <Typography />, colors: <Colors /> };
  // the order of the page (rule D17): what is true for the whole showcase, then the tabs, then what belongs to one tab, inside its panel
  return (
    <main className="ov">
      <header className="ov-head">
        <div className="ov-head__text">
          <div className="ov-head__title">
            <p className="ov-eyebrow">Overgear</p>
            <h1 className="ov-title">Showcase</h1>
          </div>
          <p className="ov-lead">The sublibrary of the Overgear store on top of baseui: its own theme, its type and its colors, and the example store that is built from them. The pages below show the settings and the tokens that only Overgear sets</p>
        </div>
        <ButtonGroup stackOnMobile>
          <Button variant="primary" label="Open the example" href="example/" />
          <Button variant="secondary" label="Back to the documentation" href="../" />
        </ButtonGroup>
      </header>
      <Tabs label="Showcase pages" value={page} onValueChange={(v) => { location.hash = `#/${v}`; }} items={PAGES.map(([id, label]) => ({ value: id, label }))} panelClassName="ov-panel">
        {(id) => {
          const [, label, lead] = PAGES.find(([p]) => p === id);
          return (
            <>
              <div className="ov-panel__head">
                <h2 className="ov-panel__title">{label}</h2>
                <p className="ov-lead">{lead}</p>
              </div>
              {content[id]}
            </>
          );
        }}
      </Tabs>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
