// The browser harness shared by every check-*.mjs script: opens each path at the given widths, waits until the page is ready (not for a fixed time),
// runs an in-page audit and groups the findings by a text key. The pages are opened several at a time, each in a context of its own (its own storage),
// with the reduced motion of the system on, so nothing has to be waited out. Needs Playwright and the site served over HTTP.
export async function launch() {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { throw new Error('Playwright is not installed: npm i -D playwright'); }
  return chromium.launch();
}

/** How many pages a check opens at a time: CHECK_CONCURRENCY, or 4 (the container has 4 cores; more makes each page slower, not the whole faster). */
export const CONCURRENCY = Math.max(1, Number(process.env.CHECK_CONCURRENCY) || 4);

/**
 * A page is ready when its fonts are in, the app has drawn something, no part of it says it is still loading (aria-busy), and two frames have passed;
 * then `extra` ms more for what moves after the first frame (an effect, a measure). With reduced motion there is no transition to wait out.
 */
export async function ready(page, extra = 150) {
  await page.waitForFunction(() => document.fonts.status === 'loaded' && document.body?.children.length > 0, null, { timeout: 10000 }).catch(() => {});
  // a list that is loading says so (aria-busy) for a moment; a gallery that shows the loading state on purpose says it for good, so this wait is short
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 1500 }).catch(() => {});
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  if (extra) await page.waitForTimeout(extra);
}

/** A new page in a context of its own: a viewport, reduced motion, and the touch of a phone below 500px when asked. */
export async function openPage(browser, { width, height = 900, touch = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: touch });
  const page = await context.newPage();
  page.close = ((close) => async () => { await close(); await context.close(); })(page.close.bind(page));
  return page;
}

/** Runs `work(item)` for every item, `limit` at a time; the results keep the order of the items. */
export async function pool(items, limit, work) {
  const out = new Array(items.length);
  let next = 0;
  const runner = async () => { while (next < items.length) { const i = next++; out[i] = await work(items[i], i); } };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
  return out;
}

// Every page link of the documentation site, as '#/…' hashes.
export async function docsLinks(browser, base) {
  const page = await openPage(browser, { width: 1300, height: 1000 });
  try {
    await page.goto(`${base}/`);
    await ready(page);
    return await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href')))]);
  } finally { await page.close(); }
}

// Opens the first row of a list, so the expanded state is audited as well.
export async function openFirstRow(page) {
  const row = page.locator('[data-slot=list-item-header]').first();
  if (await row.count()) { await row.click().catch(() => {}); await ready(page, 100); }
}

// `audit(page, path)` returns rows; `key(row)` turns a row into the text it is grouped by. Returns Map<key, Set<where>>.
// `settle` is what a page waits after it is ready (ms); `init`: [function, argument] run in the page before it loads (for example, a logged-in visitor with a cart in its storage).
// `spa`: the paths are routes of one app (they differ after the #), so a worker loads the app once per width and goes from route to route by the hash, closing what an audit opened (Escape) in between.
export async function sweep({ browser, base, paths, widths = [1300], settle = 150, audit, key, init, spa = false, concurrency = CONCURRENCY }) {
  const found = new Map();
  const jobs = paths.flatMap((path) => widths.map((width) => ({ path, width })));
  const add = (row, path, width) => {
    const k = key(row);
    if (!found.has(k)) found.set(k, new Set());
    found.get(k).add(widths.length > 1 ? `${path} @${width}` : path);
  };
  const visit = async (page, path, reuse) => {
    const [doc, hash = ''] = path.split('#');
    if (reuse && page.doc === doc) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.evaluate((h) => { window.scrollTo(0, 0); location.hash = h; }, hash);
    } else {
      const response = await page.goto(`${base}/${path}`);
      if (response && !response.ok()) throw new Error(`Could not load ${path}: ${response.status()}`);
      page.doc = doc;
    }
    await ready(page, settle);
  };
  if (spa) {
    // one page per worker and width; the jobs of a width go to the workers of that width
    for (const width of widths) {
      const mine = jobs.filter((j) => j.width === width);
      const workers = Array.from({ length: Math.max(1, Math.round(concurrency / widths.length)) }, () => null);
      let next = 0;
      await Promise.all(workers.map(async () => {
        const page = await openPage(browser, { width, height: widths.length > 1 ? 900 : 1000 });
        if (init) await page.addInitScript(init[0], init[1]);
        try {
          while (next < mine.length) {
            const { path } = mine[next++];
            await visit(page, path, true);
            for (const row of await audit(page, path)) add(row, path, width);
          }
        } finally { await page.close(); }
      }));
    }
    return found;
  }
  await pool(jobs, concurrency, async ({ path, width }) => {
    const page = await openPage(browser, { width, height: widths.length > 1 ? 900 : 1000 });
    if (init) await page.addInitScript(init[0], init[1]);
    try {
      await visit(page, path, false);
      for (const row of await audit(page, path)) add(row, path, width);
    } finally { await page.close(); }
  });
  return found;
}

// Prints the groups and returns the exit code: 1 when something is found.
export function report(found, { name, pages, clean, noun = 'problem', limit = Infinity }) {
  if (!found.size) { console.log(`${name}: ${pages} pages, ${clean}.`); return 0; }
  for (const [k, where] of found) {
    const list = [...where].sort();
    console.log(`${k}\n    ${list.slice(0, limit).join('  ')}${list.length > limit ? `  (+${list.length - limit})` : ''}`);
  }
  console.log(`\n${name}: ${found.size} ${noun}${found.size === 1 ? '' : 's'} on ${pages} pages.`);
  return 1;
}

export const arg = (i, fallback) => (process.argv[i] || fallback).replace(/\/$/, '');
