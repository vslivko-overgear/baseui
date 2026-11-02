// The browser harness shared by every check-*.mjs script: opens each path at the given widths, lets the page settle,
// runs an in-page audit and groups the findings by a text key. Needs Playwright (npm i -D playwright) and the site served over HTTP.
export async function launch() {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { throw new Error('Playwright is not installed: npm i -D playwright'); }
  return chromium.launch();
}

// Every page link of the documentation site, as '#/…' hashes.
export async function docsLinks(browser, base) {
  const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
  try {
    await page.goto(`${base}/`);
    await page.waitForTimeout(1500);
    return await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href')))]);
  } finally { await page.close(); }
}

// Opens the first row of a list, so the expanded state is audited as well.
export async function openFirstRow(page) {
  const row = page.locator('[data-slot=list-item-header]').first();
  if (await row.count()) { await row.click().catch(() => {}); await page.waitForTimeout(700); }
}

// `audit(page, path)` returns rows; `key(row)` turns a row into the text it is grouped by. Returns Map<key, Set<where>>.
export async function sweep({ browser, base, paths, widths = [1300], settle = 1200, audit, key }) {
  const found = new Map();
  for (const path of paths) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: widths.length > 1 ? 900 : 1000 } });
      try {
        const response = await page.goto(`${base}/${path}`);
        if (response && !response.ok()) throw new Error(`Could not load ${path}: ${response.status()}`);
        await page.waitForTimeout(settle);
        for (const row of await audit(page, path)) {
          const k = key(row);
          if (!found.has(k)) found.set(k, new Set());
          found.get(k).add(widths.length > 1 ? `${path} @${width}` : path);
        }
      } finally { await page.close(); }
    }
  }
  return found;
}

// Prints the groups and returns the exit code: 1 when something is found.
export function report(found, { name, pages, clean, noun = 'problem', limit = Infinity }) {
  if (!found.size) { console.log(`${name}: ${pages} pages, ${clean}.`); return 0; }
  for (const [k, where] of found) {
    const list = [...where];
    console.log(`${k}\n    ${list.slice(0, limit).join('  ')}${list.length > limit ? `  (+${list.length - limit})` : ''}`);
  }
  console.log(`\n${name}: ${found.size} ${noun}${found.size === 1 ? '' : 's'} on ${pages} pages.`);
  return 1;
}

export const arg = (i, fallback) => (process.argv[i] || fallback).replace(/\/$/, '');
