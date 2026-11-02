import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import manifest from '../site/manifest.js';

// One name per component, everywhere: the title in the documentation menu, the story file, the component file, the export
// and the registry item (kebab-case). A new component that is named differently in one of these places fails here.

// Pages whose title is not the name of their story file, on purpose.
const PAGE_ALIASES = {
  Radio: 'RadioGroup', // the page of the group; the single option is the child page "Radio List Item"
  'Radio List Item': 'Radio',
  Layout: 'Stack', // one page for the layout primitives
};
// Files in src/components that hold several components (Navbar and BottomBar, the toast provider and its hook), or parts that are not catalog components.
const SHARED_FILES = new Set(['Layout', 'dropdown-parts', 'FieldShell', 'ChoiceSheet', 'Icon', 'MobileNavigation', 'Toast']); // several exports, or a part of other components
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const pages = [];
const walk = (items) => { for (const it of items) { if (it.file) pages.push(it); walk(it.children || []); walk(it.items || []); } };
for (const s of manifest) walk(s.items || []);

describe('names', () => {
  test('a documentation page is titled like its story file', () => {
    const bad = pages
      .filter((p) => p.file.includes('/stories/'))
      .map((p) => ({ title: p.title, file: p.file.split('/').pop().replace('.stories.js', '') }))
      .filter(({ title, file }) => (PAGE_ALIASES[title] ?? title.replace(/\s/g, '')).toLowerCase() !== file.toLowerCase());
    expect(bad, 'rename the story file, the component and its export to the title of the page (or the other way round)').toEqual([]);
  });

  test('a component file exports a component with the name of the file', () => {
    const bad = [];
    for (const f of readdirSync('src/components').filter((f) => f.endsWith('.jsx'))) {
      const name = f.replace('.jsx', '');
      if (SHARED_FILES.has(name)) continue;
      if (!new RegExp(`export (function|const) ${name}\\b`).test(readFileSync(`src/components/${f}`, 'utf8'))) bad.push(f);
    }
    expect(bad).toEqual([]);
  });

  test('a component is public under its own name and has a registry item', () => {
    const index = readFileSync('src/index.jsx', 'utf8');
    const registry = JSON.parse(readFileSync('registry.json', 'utf8')).items.map((i) => i.name);
    const bad = [];
    for (const f of readdirSync('src/components').filter((f) => f.endsWith('.jsx'))) {
      const name = f.replace('.jsx', '');
      if (SHARED_FILES.has(name) || name === 'ConstitutionBanner') continue;
      if (!new RegExp(`export \\{[^}]*\\b${name}\\b[^}]*\\} from './components/${name}.jsx'`).test(index)) bad.push(`${name} is not exported from src/index.jsx under its own name`);
      if (!registry.includes(kebab(name))) bad.push(`${name} has no registry item "${kebab(name)}"`);
    }
    expect(bad).toEqual([]);
  });

  test('no alias renames a component on export', () => {
    expect(readFileSync('src/index.jsx', 'utf8').match(/export \{[^}]*\bas\b[^}]*\}/g) || []).toEqual([]);
  });

  test('every component file has a story file of the same name', () => {
    const missing = readdirSync('src/components').filter((f) => f.endsWith('.jsx')).map((f) => f.replace('.jsx', ''))
      .filter((n) => !SHARED_FILES.has(n) && !existsSync(`src/stories/${n}.stories.jsx`));
    expect(missing).toEqual([]);
  });
});
