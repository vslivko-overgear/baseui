// Rule D17: tabs change only what is below them. Unlike auditConstitution this one acts: it presses every tab of every tablist in `root`,
// reads the text that stands above the tablist before and after, and puts the original tab back. Run it in a browser (tools/check/constitution.mjs does).
//
//   import { auditTabs } from './src/constitution/audit-tabs.js';
//   await auditTabs(document.body)   // → [{ id: 'D17', note }]

const text = (range) => range.toString().replace(/\s+/g, ' ').trim();
const nameOf = (tab) => (tab.textContent || tab.getAttribute('aria-label') || tab.dataset.value || 'a tab').trim().slice(0, 30);

/** @param {Element} root @param {{ settle?: number }} [options] ms to wait after a press for the page to settle (default 0: two frames, which is when a tab has drawn its panel) */
export async function auditTabs(root = document.body, { settle = 0 } = {}) {
  const doc = root.ownerDocument;
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const wait = () => (settle ? new Promise((r) => setTimeout(r, settle)) : frames());
  const out = [];
  for (const list of /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[role="tablist"]')])) {
    const tabs = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('[role="tab"]:not([disabled])')]);
    if (tabs.length < 2) continue;
    const scope = list.closest('main, [role="main"]') || doc.body;
    const above = () => {
      const r = doc.createRange();
      r.setStart(scope, 0);
      r.setEndBefore(list);
      return text(r);
    };
    const home = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    const before = above();
    for (const tab of tabs) {
      if (tab === home) continue;
      tab.click();
      await wait();
      if (above() !== before) {
        out.push({ id: 'D17', note: `Switching to "${nameOf(tab)}" changes the content above the tabs: put what a tab shows in the panel of Tabs, below the row` });
        break;
      }
    }
    home.click();
    await wait();
  }
  return out;
}
