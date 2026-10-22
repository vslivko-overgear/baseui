// Shared helpers for Foundations pages: reads tokens.css (single source of truth) and renders common blocks.
import { h, useState, useEffect, Fragment } from '../react.js';
import { Table, pixel, proportional } from '../components/Table.js';
import { Skeleton } from '../components/Skeleton.js';

let cache;
/** Parses tokens.css into sections → groups → tokens. */
export function loadTokens() {
  cache ||= fetch(new URL('../../tokens.css', import.meta.url)).then((r) => r.text()).then(parse);
  return cache;
}

function parse(css) {
  css = css.replace(/@font-face\{[^}]*\}/g, '').replace(/@(?:media|supports)[^{]*\{[^{}]*\{[^}]*\}\s*\}/g, '');
  const parts = css.split(/\/\*\s*-{5,}\s*(.+?)\s*-{5,}\s*\*\/|\/\*\s*(Typography)\s*\*\//);
  const sections = [];
  for (let i = 1; i < parts.length; i += 3) {
    const title = (parts[i] || parts[i + 1]).replace(/\s*\(.*\)$/, '');
    const body = parts[i + 2];
    const blocks = [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));
    sections.push({ title, blocks });
  }
  return sections.map(({ title, blocks }) => {
    const groupsOf = (body) => {
      const groups = [];
      let current = { title: '', tokens: [] };
      for (const line of body.split('\n')) {
        const c = line.match(/^\s*\/\*\s*(.+?)\s*\*\/\s*$/);
        const t = line.match(/^\s*--baseui-([\w-]+):\s*(.+?);\s*$/);
        if (c) { if (current.tokens.length) groups.push(current); current = { title: c[1], tokens: [] }; }
        else if (t && !/-scale$|^corner-|^(on-)?(surface|muted|popover|accent|brand|destructive|disabled)(-|$)|^border$/.test(t[1])) current.tokens.push({ name: t[1], value: t[2] });   // helper variables (scales) are not tokens of the table
      }
      if (current.tokens.length) groups.push(current);
      return groups;
    };
    if (title === 'Color') {
      const light = groupsOf(blocks.find((b) => b.selector.includes('light')).body);
      const dark = groupsOf(blocks.find((b) => b.selector.includes('dark')).body);
      const darkBy = Object.fromEntries(dark.flatMap((g) => g.tokens).map((t) => [t.name, t.value]));
      // `X-Hover` tokens are not listed: each color row shows its hover next to the base swatch.
      const hovers = new Set(light.filter((g) => g.title === 'Hover').flatMap((g) => g.tokens.map((t) => t.name.replace(/-Hover$/, ''))));
      return { title, themed: true, hovers, groups: light.filter((g) => g.title !== 'Hover').map((g) => ({ ...g, tokens: g.tokens.map((t) => ({ name: t.name, light: t.value, dark: darkBy[t.name] })) })) };
    }
    const tokens = blocks.flatMap((b) => groupsOf(b.body).flatMap((g) => g.tokens));
    return { title, themed: false, groups: [{ title: '', tokens }] };
  });
}

export function useTokens() {
  const [data, setData] = useState(null);
  useEffect(() => { loadTokens().then(setData); }, []);
  return data;
}
export const section = (title, data) => data && data.find((s) => s.title === title);

/* ------------------------------------------------------------- doc blocks */

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const Block = ({ title, id, children }) =>
  h('section', { className: 'doc-block', id: id || (title ? `block-${slug(title)}` : undefined), 'data-anchor': title || undefined }, title && h('h2', null, title), children);

/** A color swatch with a smaller one beside it for the hover color, when the color has one. */
export const colorPreview = (color, size = 40) => (t) => h('span', { className: 'tok-pair' },
  h(Swatch, { name: t.name, size }),
  color.hovers.has(t.name) && h(Swatch, { name: `${t.name}-Hover`, size }));

export function Swatch({ name, size = 40 }) {
  return h('span', { className: 'tok-swatch', style: { width: size, height: size, background: `var(--baseui-${name})` }, 'aria-hidden': 'true' });
}

export function TokenTable({ tokens, themed, preview, previewWidth = 72 }) {
  const val = (key) => (t) => h('code', { className: 'val' }, t[key]);
  const columns = [
    ...(preview ? [{ key: 'preview', header: '', width: pixel(previewWidth), renderCell: preview }] : []),
    { key: 'name', header: 'Token', width: proportional(3, { minWidth: 220 }), renderCell: (t) => h('code', null, `--baseui-${t.name}`) },
    ...(themed
      ? [{ key: 'light', header: 'Light', width: proportional(2, { minWidth: 120 }), renderCell: val('light') }, { key: 'dark', header: 'Dark', width: proportional(2, { minWidth: 120 }), renderCell: val('dark') }]
      : [{ key: 'value', header: 'Value', width: proportional(3, { minWidth: 140 }), renderCell: val('value') }]),
  ];
  return h(Table, { data: tokens, columns, rowKey: 'name', caption: 'Tokens' });
}

export const Loading = () => h('div', { className: 'doc-block', 'aria-busy': 'true', 'aria-label': 'Loading tokens' },
  h(Skeleton, { variant: 'text', width: 160, height: 28 }),
  h('div', { style: { height: 16 } }),
  h(Skeleton, { variant: 'rect', height: 220, style: { borderRadius: 'var(--baseui-radius-16)' } }));
