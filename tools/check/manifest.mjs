// The browser checks of the repository, in one list: what each one is, what it costs and which files make it worth running. tools/check/all.mjs runs them, tools/check/plan.mjs picks the ones a change calls for,
// and tests/constitution.test.jsx keeps the list in step with the rules (a rule names the script that checks it, and the script is here).
//
//   name     what `node tools/check/all.mjs <name>` takes
//   script   the file
//   cost     about how long it takes alone, in seconds (measured; several run at the same time, so a run of all of them is about two minutes)
//   touches  the files whose change can break it: globs, `*` is one level, `**` any depth
export const CHECKS = [
  { name: 'radii', script: 'tools/check/radii.mjs', cost: 13, touches: ['tokens.css', 'src/components.css', 'src/components/**', 'site/**'] },
  { name: 'sizes', script: 'tools/check/sizes.mjs', cost: 3, touches: ['tokens.css', 'src/components.css', 'src/components/**'] },
  { name: 'fixtures', script: 'tools/check/fixtures.mjs', cost: 2, touches: ['src/constitution/**', 'tools/check/fixtures.*'] },
  { name: 'constitution', script: 'tools/check/constitution.mjs', cost: 20, touches: ['overgear/components/**', 'src/constitution/**', 'tokens.css', 'src/components.css', 'src/components/**', 'overgear/example/**'] },
  { name: 'spacing', script: 'tools/check/spacing.mjs', cost: 24, touches: ['tools/audits/spacing-balance.js', 'src/components.css', 'src/templates/**', 'src/components/Stack*', 'src/components/Layout.jsx'] },
  { name: 'breadcrumbs', script: 'tools/check/breadcrumbs.mjs', cost: 7, touches: ['src/components/Breadcrumbs.jsx', 'src/components.css'] },
  { name: 'overgear-spacing', script: 'overgear/tools/check/spacing.mjs', cost: 9, touches: ['overgear/components/**', 'overgear/tools/audits/**', 'overgear/example/**', 'src/components/ProductListing.jsx'] },
  { name: 'overgear-tiles', script: 'overgear/tools/check/tiles.mjs', cost: 12, touches: ['overgear/audience.js', 'overgear/example/home.jsx', 'overgear/example/data.js', 'overgear/example/ui.jsx'] },
  { name: 'overgear-catalog', script: 'overgear/tools/check/catalog.mjs', cost: 19, touches: ['overgear/example/catalog*.jsx', 'overgear/example/shell.jsx', 'overgear/example/data.js'] },
  { name: 'overgear-search', script: 'overgear/tools/check/search.mjs', cost: 9, touches: ['overgear/example/search.jsx', 'overgear/example/suggest.js', 'overgear/example/shell.jsx'] },
  { name: 'overgear-wallet', script: 'overgear/tools/check/wallet.mjs', cost: 12, touches: ['overgear/components/**', 'overgear/example/wallet*.jsx', 'overgear/example/wallet-core.js', 'overgear/example/shell.jsx', 'overgear/example/store.jsx', 'overgear/example/account.jsx'] },
  { name: 'overgear-checkout', script: 'overgear/tools/check/checkout.mjs', cost: 12, touches: ['overgear/components/**', 'overgear/example/cart.jsx', 'overgear/example/order.jsx', 'overgear/example/order-core.js'] },
  { name: 'overgear-order', script: 'overgear/tools/check/order.mjs', cost: 10, touches: ['overgear/components/**', 'overgear/example/cart.jsx', 'overgear/example/order.jsx'] },
  { name: 'overgear-orders', script: 'overgear/tools/check/orders.mjs', cost: 48, touches: ['overgear/components/**', 'overgear/example/orders.jsx', 'overgear/example/order-page.jsx', 'overgear/example/order-result.jsx', 'overgear/example/order-core.js', 'overgear/example/order-seed.js'] },
];

/** A glob of the list above as a regular expression: `**` goes through folders, `*` stays in one level. */
export const globToRegExp = (glob) => new RegExp(`^${glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*')}$`);
export const touchesFile = (check, file) => check.touches.some((g) => globToRegExp(g).test(file));
