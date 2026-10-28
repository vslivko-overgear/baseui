#!/usr/bin/env node
// Builds llms.txt and one markdown file per page (docs/<section>/<page>.md) from the same data the documentation site shows:
// the manifest (titles, order, leads) and the describe() metadata of every component. For people, search tools and AI assistants.
// Needs Playwright (npm i -D playwright) and the site served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/build-docs.mjs http://localhost:8000
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed: npm i -D playwright'); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/`);
await page.waitForTimeout(1000);

// Everything is read inside the page: it imports the same modules as the site.
const data = await page.evaluate(async () => {
  const manifest = (await import('/site/manifest.js')).default;
  const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rows = [];
  const read = async (item, section, group, parent) => {
    const abs = new URL(item.file, `${location.origin}/site/manifest.js`).href;
    let docs = null; let examples = [];
    try {
      const m = await import(abs);
      const c = m.default && m.default.component;
      const info = c && c.__docgenInfo;
      if (info) docs = { description: info.description || '', props: Object.entries(info.props || {}).map(([name, p]) => ({ name, type: (p.tsType && (p.tsType.raw || p.tsType.name)) || '', def: p.defaultValue ? p.defaultValue.value : '', text: (p.description || '').replace(/\s+/g, ' ').trim() })) };
      examples = Object.keys(m).filter((k) => !['default', '__namedExportsOrder', 'page', 'Playground'].includes(k)).map((k) => k.replace(/([a-z])([A-Z])/g, '$1 $2'));
    } catch { /* a page that is not a component */ }
    const slug = kebab(item.title);
    rows.push({ section, group: group || '', parent: parent || '', title: item.title, slug, lead: item.lead || '', docs, examples, route: `#/${section.toLowerCase()}/${slug}` });
    for (const c of item.children || []) await read(c, section, group, item.title);
  };
  for (const { section, items } of manifest) {
    for (const item of items) {
      if (item.group) for (const i of item.items) await read(i, section, item.group);
      else await read(item, section);
    }
  }
  return rows;
});
await browser.close();

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const out = join(root, 'docs');
await rm(out, { recursive: true, force: true });
for (const r of data) {
  const lines = [`# ${r.title}`, ''];
  const desc = (r.docs && r.docs.description) || r.lead;
  if (desc) lines.push(desc, '');
  if (r.lead && r.docs && r.docs.description && r.lead !== r.docs.description) lines.push(r.lead, '');
  if (r.docs && r.docs.props.length) {
    lines.push('## Props', '', '| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const p of r.docs.props) lines.push(`| \`${p.name}\` | \`${cell(p.type)}\` | ${p.def ? `\`${cell(p.def)}\`` : '—'} | ${cell(p.text)} |`);
    lines.push('');
  }
  if (r.examples.length) lines.push('## Examples', '', ...r.examples.map((e) => `- ${e}`), '');
  lines.push(`Live page: ${base}/${r.route}`, '');
  const file = join(out, r.section.toLowerCase(), `${r.slug}.md`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, lines.join('\n'));
}

const index = ['# baseui', '', '> A design system on Base UI: foundations, components and a documentation site built from its own components. Zero build, ES modules, tokens in CSS variables.', '',
  '## Use', '', '- Load `tokens.css` and `src/components.css`; set `data-theme="light|dark"` on `<html>`.', '- Import components from `src/index.js`.', '- Every component documents its props with `describe()`; the pages below are generated from it.', ''];
let section = '';
for (const r of data) {
  if (r.section !== section) { section = r.section; index.push('', `## ${section}`, ''); }
  const lead = (r.docs && r.docs.description) || r.lead;
  index.push(`- [${r.title}](docs/${r.section.toLowerCase()}/${r.slug}.md)${lead ? `: ${lead.replace(/\s+/g, ' ').slice(0, 160)}` : ''}`);
}
await writeFile(join(root, 'llms.txt'), `${index.join('\n')}\n`);
console.log(`${data.length} pages -> llms.txt and docs/`);
