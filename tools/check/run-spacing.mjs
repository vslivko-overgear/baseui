// Browser runner shared by product-independent and product-specific audit commands.
import { launch, sweep, report, openFirstRow } from '../lib/sweep.mjs';

export async function runSpacingCheck({ base, paths, modulePath = 'tools/audits/spacing-balance.js' }) {
  const root = base.replace(/\/$/, '');
  const url = new URL(modulePath, `${root}/`).href;
  const browser = await launch();
  try {
    const found = await sweep({
      browser, base: root, paths, widths: [1500, 390],
      audit: async (page) => {
        await openFirstRow(page);
        return page.evaluate(async (u) => {
          const m = await import(u);
          return m.spacingBalance(document.body).map((f) => ({ kind: f.kind, selector: f.selector, gap: f.gap, around: f.around, suggestion: f.suggestion }));
        }, url);
      },
      key: (r) => `${r.kind.padEnd(8)} ${r.selector}: gap ${r.gap}px, around it ${r.around}px -> ${r.suggestion}`,
    });
    return report(found, { name: 'Spacing balance', pages: paths.length, clean: 'related things are closer than unrelated ones' });
  } finally { await browser.close(); }
}
