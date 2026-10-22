// Spacing balance: things that belong together sit closer than things that do not (proximity). A title is closer to its subtitle than
// to the block above, a tab list is closer to its panel than the panel is to the next section, a label is closer to its field.
// Run it in the browser (import this module, or paste spacingBalance in the console); it needs no dependencies.
//
//   import { spacingBalance } from './tools/spacing-balance.js';
//   console.table(spacingBalance(document.body));
//
// It looks at every vertical stack (siblings one under another) and measures the gap between the visible content of neighbours: text, icons,
// images and surfaces, not the empty padding of their boxes. Pairs that belong together:
//   caption    a text followed by a smaller or muted text (a title and its subtitle, a name and "online")
//   heading    a heading (h1-h6, a title or label, a bold text of 20px or more) and what follows it
//   tabs       a tab list and its panel
//   avatar     an avatar and the name next to it
// The gap inside such a pair must not be bigger than the gap on either side of it (to the previous and to the next sibling; at the edge
// of a stack, to the neighbours of the stack itself), with a tolerance of 2px. The suggestion is the 4px-grid value to use. An element inside [data-spacing-ignore] is skipped.

const TOLERANCE = 2;
const grid = (px) => Math.max(0, Math.floor(px / 4) * 4);

const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
const inFlow = (el) => !['absolute', 'fixed'].includes(getComputedStyle(el).position);
const label = (el) => {
  const slot = el.dataset?.slot;
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
  return slot ? `${el.tagName.toLowerCase()}[${slot}]` : `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
};

/** Does the box paint something itself (a surface, a border, a line, an image)? */
function paints(el, cs) {
  if (el.matches('img, svg, canvas, video, input, textarea, hr')) return true;
  if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none') return true;
  if (cs.boxShadow !== 'none') return true;
  return ['Top', 'Bottom'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
}

/** The box that holds what is really drawn inside `el`: text, icons and surfaces, without the empty padding around them. */
function ink(el) {
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return null;
  let box = null;
  const add = (r) => { if (r.width <= 0 || r.height <= 0) return; box = box ? { top: Math.min(box.top, r.top), bottom: Math.max(box.bottom, r.bottom), left: Math.min(box.left, r.left), right: Math.max(box.right, r.right) } : { top: r.top, bottom: r.bottom, left: r.left, right: r.right }; };
  if (paints(el, cs)) add(el.getBoundingClientRect());
  for (const n of el.childNodes) {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const range = document.createRange(); range.selectNodeContents(n);
      const fs = parseFloat(cs.fontSize);
      for (const r of range.getClientRects()) { const lead = Math.max(0, (r.height - fs) / 2); add({ top: r.top + lead * 0.6, bottom: r.bottom - lead * 0.6, left: r.left, right: r.right, width: r.width, height: r.height }); }
    } else if (n.nodeType === 1 && inFlow(n)) { const b = ink(n); if (b) add({ ...b, width: b.right - b.left, height: b.bottom - b.top }); }
  }
  return box;
}

const textOnly = (el) => el.children.length === 0 && el.textContent.trim().length > 0;
const fontOf = (el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), weight: +cs.fontWeight || 400, color: cs.color }; };
const isHeading = (el) => {
  if (/^H[1-6]$/.test(el.tagName)) return true;
  if (/(title|heading|legend)$/.test(el.dataset.slot || '')) return true;
  if (!textOnly(el)) return false;
  const f = fontOf(el);
  return f.size >= 20 && f.weight >= 600;
};
const isTabs = (el) => /^(tablist|tablist-wrap|tabs-list)/.test(el.dataset.slot || '') || el.matches('[role=tablist]') || !!el.querySelector(':scope > [role=tablist], :scope > [data-slot^=tablist]');

/** How `a` and `b` (neighbours, a above b) belong together, or null. */
function relation(a, b) {
  if (isTabs(a) && !isTabs(b)) return 'tabs';
  if (a.dataset.slot === 'avatar' && b.textContent.trim() && !b.matches('[data-slot=avatar]')) return 'avatar';
  if (isHeading(a) && !isHeading(b)) return 'heading';
  if (textOnly(a) && textOnly(b)) {
    const fa = fontOf(a), fb = fontOf(b);
    if (fb.size < fa.size || (fb.size === fa.size && fb.color !== fa.color && fb.weight <= fa.weight)) return 'caption';
  }
  return null;
}

/** The gaps above and/or below `el` among its siblings, climbing while `el` is the edge of a stack of its own (3 levels at most). */
function outerGaps(el, above, below, depth = 0) {
  const parent = el.parentElement;
  if (!parent || depth > 3 || parent.closest('[data-spacing-ignore]')) return [];
  const kids = [...parent.children].filter((k) => visible(k) && inFlow(k));
  const i = kids.indexOf(el);
  const gaps = [];
  const mine = ink(el);
  if (kids.length > 1 && mine) {
    if (above && i > 0) { const b = ink(kids[i - 1]); if (b) gaps.push(mine.top - b.bottom); }
    if (below && i < kids.length - 1) { const b = ink(kids[i + 1]); if (b) gaps.push(b.top - mine.bottom); }
  }
  const missing = (above && !(i > 0 && kids.length > 1)) || (below && !(i < kids.length - 1 && kids.length > 1));
  return missing ? gaps.concat(outerGaps(parent, above && !(i > 0 && kids.length > 1), below && !(i < kids.length - 1 && kids.length > 1), depth + 1)) : gaps;
}

/**
 * @param root  the element to check (its descendants)
 * @returns     [{ kind, element, selector, gap, around, suggestion }]
 */
export function spacingBalance(root = document.body) {
  const out = [];
  for (const parent of [root, ...root.querySelectorAll('*')]) {
    if (parent.closest('[data-spacing-ignore]') || !visible(parent)) continue;
    const kids = [...parent.children].filter((k) => visible(k) && inFlow(k) && !k.matches('script, style, [hidden], [aria-hidden=true][data-slot=tooltip-bubble]'));
    if (kids.length < 2) continue;
    // a vertical stack: each child starts below the previous one and overlaps it horizontally
    const boxes = kids.map(ink);
    const stack = kids.every((k, i) => i === 0 || (boxes[i] && boxes[i - 1] && boxes[i].top >= boxes[i - 1].bottom - 1
      && Math.min(boxes[i].right, boxes[i - 1].right) - Math.max(boxes[i].left, boxes[i - 1].left) > 0));
    if (!stack) continue;
    const gaps = kids.slice(1).map((_, i) => boxes[i + 1].top - boxes[i].bottom);
    for (let i = 0; i < gaps.length; i++) {
      const kind = relation(kids[i], kids[i + 1]);
      if (!kind) continue;
      // the gaps on either side of the pair; at the edge of the stack, the gaps around the stack itself
      const neighbours = [];
      if (i > 0) neighbours.push(gaps[i - 1]);
      if (i + 1 < gaps.length) neighbours.push(gaps[i + 1]);
      if (i === 0 || i + 1 >= gaps.length) neighbours.push(...outerGaps(parent, i === 0, i + 1 >= gaps.length));
      const around = neighbours.filter((g) => g > 0);   // touching or overlapping neighbours (rows of a list, side by side) say nothing
      if (!around.length) continue;
      const limit = Math.min(...around);
      if (gaps[i] > limit + TOLERANCE) out.push({ kind, element: kids[i + 1], selector: `${label(kids[i])} + ${label(kids[i + 1])}`, gap: Math.round(gaps[i]), around: around.map(Math.round).join(' / '), suggestion: `${grid(limit - 1)}px or less` });
    }
  }
  return out;
}
