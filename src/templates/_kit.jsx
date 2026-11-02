// Shared pieces of the templates: the page shell, small data displays built from tokens, and the mock data.
import { Children } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack, Grid } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Icon } from '../components/Icon.jsx';

/** The page of a template: a column that is centered and at most `width` wide. The title belongs to the first block under it (rule H6): they are one group, 16px apart, and the other blocks are a section apart. */
export function Page({ width = 1120, padding = 6, gap, children, ...rest }) {
  const kids = Children.toArray(children);
  // the header (with breadcrumbs above it) and the first block under it are one group; whatever came before it (a banner) stays apart
  const at = kids.findIndex((k) => k.type === PageHeader);
  let body = kids;
  if (at >= 0 && at < kids.length - 1) {
    const crumbs = at > 0 && kids[at - 1].type === Breadcrumbs;
    const from = crumbs ? at - 1 : at;
    const title = crumbs ? <div className="tpl-page__head" key="title">{kids[at - 1]}{kids[at]}</div> : kids[at];
    const group = <div className="tpl-page__head tpl-page__head--body" key="head">{title}{kids[at + 1]}</div>;
    body = [...kids.slice(0, from), group, ...kids.slice(at + 2)];
  }
  return (
    <main className="tpl-page" style={{ maxWidth: width, padding: `calc(var(--baseui-spacing-${padding}, 24px))`, ...(gap ? { gap: `var(--baseui-spacing-${gap})` } : {}) }} {...rest}>
      {body}
    </main>
  );
}

/** A title with a line under it and actions on the right. */
export function PageHeader({ title, subtitle, actions, level = 1 }) {
  const H = `h${level}`;
  return (
    <header className="tpl-header">
      <div className="tpl-header__text">
        <H className="tpl-title">{title}</H>
        {subtitle && <p className="tpl-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="tpl-header__actions">{actions}</div>}
    </header>
  );
}

/** A grid that fills the width with columns of at least `min` px. */
export function Fluid({ min = 240, gap = 4, children, ...rest }) {
  return <Grid columns={`repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`} gap={gap} {...rest}>{children}</Grid>;
}

/** A number with its label and its change against the previous period. */
export function Tile({ label, value, delta, tone, spark, footnote }) {
  const status = tone || (delta == null ? undefined : delta >= 0 ? 'success' : 'error');
  return (
    <Card variant="surface" padding={4}>
      <Stack gap={1}>
        <span className="tpl-meta">{label}</span>
        <span className="tpl-figure">{value}</span>
        <Stack direction="row" gap={2} align="center">
          {delta != null && <Badge variant={status} label={`${delta >= 0 ? '+' : ''}${delta}%`} />}
          {footnote && <span className="tpl-meta">{footnote}</span>}
        </Stack>
        {spark && <Spark data={spark} />}
      </Stack>
    </Card>
  );
}

/** A line of points drawn in the accent color. */
export function Spark({ data, height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - 4 - ((v - min) / (max - min || 1)) * (height - 8)}`).join(' ');
  return (
    <svg className="tpl-spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" role="img" aria-label={`Trend, from ${data[0]} to ${data[data.length - 1]}`} style={{ height }}>
      <polyline points={pts} fill="none" stroke="var(--baseui-background-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Vertical bars; `series` is [{ label, value }]. */
export function Bars({ series, height = 160, label = 'Bar chart' }) {
  const max = Math.max(...series.map((s) => s.value));
  return (
    <div className="tpl-bars" role="img" aria-label={label} style={{ height }}>
      {series.map((s) => (
        <div key={s.label} className="tpl-bars__col">
          <div className="tpl-bars__bar" style={{ height: `${(s.value / max) * 100}%` }} title={`${s.label}: ${s.value}`} />
          <span className="tpl-meta">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars with their values, for a ranking or a breakdown. */
export function HBars({ series }) {
  const max = Math.max(...series.map((s) => s.value));
  return (
    <Stack gap={3}>
      {series.map((s) => (
        <div key={s.label} className="tpl-hbar">
          <span className="tpl-hbar__label">{s.label}</span>
          <span className="tpl-hbar__track"><span className="tpl-hbar__fill" style={{ width: `${(s.value / max) * 100}%` }} /></span>
          <span className="tpl-hbar__value">{s.text ?? s.value}</span>
        </div>
      ))}
    </Stack>
  );
}

/** A card with a title row (and actions) over its content. */
export function Panel({ title, subtitle, actions, padding = 4, children, ...rest }) {
  return (
    <Card variant="surface" padding={padding} {...rest}>
      <Stack gap={4}>
        {(title || actions) && (
          <div className="tpl-panel__head">
            <div>
              <h2 className="tpl-h2">{title}</h2>
              {subtitle && <p className="tpl-meta">{subtitle}</p>}
            </div>
            {actions}
          </div>
        )}
        {children}
      </Stack>
    </Card>
  );
}

/** The side navigation shared by the shells and the app-like templates. */
export function SideNav({ items, active, title = 'Acme', footer }) {
  return (
    <nav className="tpl-sidenav" aria-label="Main">
      <div className="tpl-sidenav__brand">{title}</div>
      <ul>
        {items.map((i) => (
          <li key={i.label}>
            <a href="#" className="tpl-sidenav__link" aria-current={i.label === active ? 'page' : undefined} onClick={(e) => e.preventDefault()}>
              <Icon name={i.icon} size={20} />
              <span>{i.label}</span>
            </a>
          </li>
        ))}
      </ul>
      {footer}
    </nav>
  );
}

export const NAV = [
  { label: 'Overview', icon: 'Home01' },
  { label: 'Reports', icon: 'BarChart01' },
  { label: 'Customers', icon: 'Users01' },
  { label: 'Messages', icon: 'Mail01' },
  { label: 'Settings', icon: 'Settings01' },
];

export const PEOPLE = [
  { id: 1, name: 'Amelia Brooks', role: 'Design', email: 'amelia@acme.com', status: 'Active', city: 'Berlin', amount: 4820 },
  { id: 2, name: 'Noah Ito', role: 'Engineering', email: 'noah@acme.com', status: 'Active', city: 'Tokyo', amount: 3150 },
  { id: 3, name: 'Priya Raman', role: 'Product', email: 'priya@acme.com', status: 'Away', city: 'Bangalore', amount: 2740 },
  { id: 4, name: 'Lucas Meyer', role: 'Engineering', email: 'lucas@acme.com', status: 'Active', city: 'Zurich', amount: 5260 },
  { id: 5, name: 'Sofia Alvarez', role: 'Marketing', email: 'sofia@acme.com', status: 'Invited', city: 'Madrid', amount: 1980 },
  { id: 6, name: 'Daniel Okafor', role: 'Sales', email: 'daniel@acme.com', status: 'Active', city: 'Lagos', amount: 3890 },
  { id: 7, name: 'Hana Kim', role: 'Design', email: 'hana@acme.com', status: 'Away', city: 'Seoul', amount: 2210 },
  { id: 8, name: 'Oliver Grant', role: 'Support', email: 'oliver@acme.com', status: 'Active', city: 'Dublin', amount: 1670 },
];

export const STATUS_TONE = { Active: 'success', Away: 'warning', Invited: 'info', Paused: 'secondary', Blocked: 'error' };

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) => ({ label, value: [42, 51, 47, 63, 58, 72, 69, 81, 77, 90, 86, 98][i] }));

export const money = (n) => `$${n.toLocaleString('en-US')}`;

export const Person = ({ name, size = 'md' }) => (
  <Stack direction="row" gap={2} align="center">
    <Avatar alt={name} size={size} />
    <span>{name}</span>
  </Stack>
);
