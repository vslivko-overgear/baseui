#!/usr/bin/env node
// Builds vendor/: React and Base UI as plain ES modules, so the documentation site and the examples run without a bundler.
// The pages map the bare names (react, react-dom, @base-ui/react/…) to these files with an import map (see index.html);
// an application that installs the package gets its own react from node_modules and never loads vendor/.
//
//   npm i && node tools/build-vendor.mjs
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const out = join(root, 'vendor');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// ---- one copy of React, React DOM and the JSX runtime in a single bundle: every entry below shares it ----
const entry = `
import * as R from 'react';
import * as D from 'react-dom';
import * as C from 'react-dom/client';
import * as J from 'react/jsx-runtime';
export { R, D, C, J };
`;
await build({
  stdin: { contents: entry, resolveDir: root, loader: 'js' }, bundle: true, format: 'esm', minify: true, target: 'es2022',
  define: { 'process.env.NODE_ENV': '"production"' }, outfile: join(out, 'react-all.js'), legalComments: 'none',
});

const names = (mod) => Object.keys(require(mod)).filter((k) => k !== 'default' && /^[A-Za-z_$][\w$]*$/.test(k));
const proxy = (key, mod) => `import { ${key} as M } from './react-all.js';
const X = M.default && typeof M.default === 'object' ? M.default : M;
export default X;
export const { ${names(mod).join(', ')} } = X;
`;
await writeFile(join(out, 'react.js'), proxy('R', 'react'));
await writeFile(join(out, 'react-dom.js'), proxy('D', 'react-dom'));
await writeFile(join(out, 'react-dom-client.js'), proxy('C', 'react-dom/client'));
await writeFile(join(out, 'react-jsx-runtime.js'), proxy('J', 'react/jsx-runtime'));

// ---- Base UI: the parts the design system uses, bundled with React left out (it comes from the import map) ----
const baseUi = JSON.parse(await readFile(join(root, 'node_modules/@base-ui/react/package.json'), 'utf8'));
const parts = Object.keys(baseUi.exports).filter((k) => /^\.\/[a-z-]+$/.test(k)).map((k) => k.slice(2));
await build({
  stdin: { contents: parts.map((p) => `export * as ${p.replace(/-([a-z])/g, (_, c) => c.toUpperCase())} from '@base-ui/react/${p}';`).join('\n'), resolveDir: root, loader: 'js' },
  bundle: true, format: 'esm', minify: true, target: 'es2022', external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
  define: { 'process.env.NODE_ENV': '"production"' }, outfile: join(out, 'base-ui.js'), legalComments: 'none',
});
// one small module per Base UI part, named like the package export: @base-ui/react/switch → vendor/base-ui/switch.js
await mkdir(join(out, 'base-ui'), { recursive: true });
const ns = (p) => p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const importMap = {
  react: './vendor/react.js', 'react/jsx-runtime': './vendor/react-jsx-runtime.js', 'react-dom': './vendor/react-dom.js', 'react-dom/client': './vendor/react-dom-client.js',
};
for (const p of parts) {
  const mod = await import(`@base-ui/react/${p}`);
  const list = Object.keys(mod).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k));
  await writeFile(join(out, 'base-ui', `${p}.js`), `import { ${ns(p)} as M } from '../base-ui.js';\nexport const { ${list.join(', ')} } = M;\n`);
  importMap[`@base-ui/react/${p}`] = `./vendor/base-ui/${p}.js`;
}
// write the import map into the pages between the markers, with the paths of each page
const pages = ['index.html', 'examples/messenger/index.html', 'examples/probe/index.html'];
for (const page of pages) {
  const depth = page.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : './';
  const map = JSON.stringify({ imports: Object.fromEntries(Object.entries(importMap).map(([k, v]) => [k, v.replace('./', prefix)])) }, null, 2).replace(/^/gm, '  ');
  const file = join(root, page);
  const html = await readFile(file, 'utf8');
  const block = `<!-- importmap:start (tools/build-vendor.mjs) -->\n<script type="importmap">\n${map}\n  </script>\n  <!-- importmap:end -->`;
  const next = html.includes('<!-- importmap:start') ? html.replace(/<!-- importmap:start[\s\S]*?<!-- importmap:end -->/, block) : html.replace('</head>', `  ${block}\n</head>`);
  await writeFile(file, next);
}
console.log(`vendor/: react ${require('react/package.json').version}, base-ui ${baseUi.version} (${parts.length} parts)`);
