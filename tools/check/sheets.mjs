#!/usr/bin/env node
// A list of options is a bottom sheet on a phone, not a menu over the page (rule M4). It opens, on a phone, every control of the example that opens a list (the triggers with aria-haspopup),
// on the pages that have one, and expects a dialog (the sheet) and no menu over the page; and on a desktop the same control opens a menu, not a sheet.
//
//   node tools/check/sheets.mjs http://localhost:8000
import { launch, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
// the pages of the example that have a list of options, and the name of the control that opens it
const PAGES = [
  ['overgear/example/#/catalog', 'Sort games'],
  ['overgear/example/#/games/wow', null],
];
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];

for (const [path, name] of PAGES) {
  for (const [width, phone] of [[390, true], [1440, false]]) {
    const page = await (await browser.newContext({ viewport: { width, height: 800 }, hasTouch: phone })).newPage();
    await page.goto(`${base}/${path}`);
    await page.waitForTimeout(1500);
    const triggers = name ? page.getByRole('button', { name }) : page.locator('[aria-haspopup="listbox"], [aria-haspopup="dialog"]:not([aria-label="Search"])');
    const count = await triggers.count();
    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i);
      if (!(await trigger.isVisible())) continue;
      await trigger.click();
      await page.waitForTimeout(500);
      const open = await page.evaluate(() => ({ sheet: !!document.querySelector('[role="dialog"] [role="listbox"]'), menu: [...document.querySelectorAll('.bui-dropdown')].some((m) => m.getBoundingClientRect().width > 0) }));
      const where = `${path} @${width}, control ${i + 1}`;
      if (phone && (open.menu || !open.sheet)) problems.push(`${where}: the list is ${open.menu ? 'a menu over the page' : 'not a sheet'} on a phone`);
      if (!phone && (open.sheet || !open.menu)) problems.push(`${where}: on a desktop the list is ${open.sheet ? 'a sheet' : 'not a menu'}`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    if (!count) problems.push(`${path} @${width}: no control that opens a list was found`);
    await page.close();
  }
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nSheets: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Sheets: a list of options is a sheet on a phone and a menu on a desktop.');
