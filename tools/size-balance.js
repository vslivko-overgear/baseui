// Size balance: everything is measured from the body text, 16px. A screen reads as calm when its text steps and its control sizes
// follow one ladder, so a button is not 56px high next to a 40px field, and a caption is not 11px.
// Run it in the browser (import this module, or paste sizeBalance in the console); it needs no dependencies.
//
//   import { sizeBalance } from './tools/size-balance.js';
//   console.table(sizeBalance(document.body));
//
// The ladder (anchored at 16 = md):   text 12 · 14 · 16 · 20 · 24 · 32     control tier xsm 32 · sm 40 · md 48 · lg 56
// It reports six kinds of finding, each with a suggestion:
//   small-text   text under 12px
//   off-ladder   a text size that is not on the ladder (initials of an avatar and the like are skipped)
//   row          controls in one row whose heights differ (a row is the controls with the same parent that overlap vertically)
//   field-size   text fields (inputs, selects, date pickers…) of one form or dialog with different sizes
//   anchor       a control whose label is bigger than the 16px body (a lg button, a md tab): one tier down keeps 16 the center
//   hierarchy    a secondary text (subtitle, caption, meta) not smaller than the title next to it
// An element inside [data-size-ignore] is skipped.

export const TEXT_LADDER = [12, 14, 16, 20, 24, 32];
export const BODY = 16;
export const TIERS = ['xsm', 'sm', 'md', 'lg'];
const TIER_HEIGHT = { xsm: 32, sm: 40, md: 48, lg: 56 };
// controls that take part in the balance, by their data-slot
const CONTROL = /^(button|icon-button|textfield|chip|segmented|switch|tab)$/;
const SECONDARY = /(subtitle|caption|meta|time|overline|details|description)$/;
const PRIMARY = /(title|label|heading|text)$/;

const label = (el) => {
  const slot = el.dataset?.slot;
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
  return slot ? `${el.tagName.toLowerCase()}[${slot}${el.dataset.size ? ` ${el.dataset.size}` : ''}]` : `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
};
const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(el).visibility !== 'hidden'; };
const tierOf = (el) => {
  const t = TIERS.indexOf(el.dataset.size);
  if (t >= 0) return t;
  const h = el.getBoundingClientRect().height;
  return h <= 36 ? 0 : h <= 44 ? 1 : h <= 52 ? 2 : 3;
};
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const nearestTier = (px) => TIERS[[32, 40, 48, 56].reduce((best, v, i, a) => (Math.abs(v - px) < Math.abs(a[best] - px) ? i : best), 0)];

/**
 * @param root  the element to check (its descendants)
 * @returns     [{ kind, element, selector, found, suggestion }]
 */
export function sizeBalance(root = document.body) {
  const out = [];
  const add = (kind, element, found, suggestion) => out.push({ kind, element, selector: label(element), found, suggestion });
  const all = [...root.querySelectorAll('*')].filter((el) => !el.closest('[data-size-ignore]') && visible(el));

  // text
  const titleOf = new Map();
  for (const el of all) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own || el.closest('[data-slot=avatar]')) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 12) add('small-text', el, `${px}px`, '12px, the smallest text of the system');
    else if (!TEXT_LADDER.includes(px)) add('off-ladder', el, `${px}px`, `${TEXT_LADDER.reduce((b, v) => (Math.abs(v - px) < Math.abs(b - px) ? v : b))}px`);
    titleOf.set(el, px);
  }
  // hierarchy: inside one parent a secondary text must be smaller than the primary one
  for (const [el, px] of titleOf) {
    const slot = el.dataset.slot || '';
    if (!SECONDARY.test(slot)) continue;
    const sibling = [...(el.parentElement?.children || [])].find((s) => s !== el && titleOf.has(s) && PRIMARY.test(s.dataset.slot || ''));
    if (sibling && px >= titleOf.get(sibling)) add('hierarchy', el, `${px}px next to a ${titleOf.get(sibling)}px ${sibling.dataset.slot}`, `${TEXT_LADDER[Math.max(0, TEXT_LADDER.indexOf(titleOf.get(sibling)) - 1)]}px`);
  }

  // controls
  const controls = all.filter((el) => CONTROL.test(el.dataset.slot || '') && !el.closest('[data-slot=segmented], [data-slot=textfield]:not(:scope)') || el.matches('[data-slot=segmented], [data-slot=textfield]'));
  // rows: the same parent, overlapping vertically, different heights
  const byParent = new Map();
  for (const el of controls) if (!el.querySelector('textarea')) (byParent.get(el.parentElement) || byParent.set(el.parentElement, []).get(el.parentElement)).push(el);
  for (const group of byParent.values()) {
    if (group.length < 2) continue;
    const hs = group.map((e) => Math.round(e.getBoundingClientRect().height));
    const want = median(hs);
    group.forEach((e, i) => { if (Math.abs(hs[i] - want) >= 8 && group.length >= 2 && hs[i] !== want) add('row', e, `${hs[i]}px in a row of ${hs.join(' / ')}px`, `${nearestTier(want)} (${TIER_HEIGHT[nearestTier(want)]}px)`); });
  }
  // fields: every text-field-like control of one form, dialog or page shares one size
  const fieldGroups = new Map();
  for (const el of all) {
    if (el.dataset.slot !== 'textfield') continue;
    const scope = el.closest('[role=dialog], [data-slot=modal], form, main, aside, section') || root;
    (fieldGroups.get(scope) || fieldGroups.set(scope, []).get(scope)).push(el);
  }
  for (const group of fieldGroups.values()) {
    const counts = {};
    group.forEach((e) => { counts[e.dataset.size] = (counts[e.dataset.size] || 0) + 1; });
    const sizes = Object.keys(counts);
    if (sizes.length < 2) continue;
    const common = sizes.sort((x, y) => counts[y] - counts[x])[0];
    for (const e of group) if (e.dataset.size !== common) add('field-size', e, `${e.dataset.size} among ${common} fields`, common);
  }
  // anchor: a label bigger than the body text pulls the eye away from the content
  for (const el of controls) {
    const text = el.querySelector('[data-slot$=label]') || el;
    const px = parseFloat(getComputedStyle(text).fontSize);
    if (px > BODY && TIERS.includes(el.dataset.size)) add('anchor', el, `${px}px label (${el.dataset.size})`, TIERS[Math.max(0, TIERS.indexOf(el.dataset.size) - 1)]);
  }
  for (const el of all) {
    if (el.dataset.slot !== 'tab-label') continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px > BODY) add('anchor', el, `${px}px tab label`, 'a tab list of size sm (16px)');
  }
  return out;
}
