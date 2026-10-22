// Spacing balance: the markup is the grouping. Content that sits in one container belongs together, so the gaps inside a container must be
// smaller than the gaps between that container and its neighbours, level by level: the deeper the nesting, the tighter the gap.
// Run it in the browser (import this module, or paste spacingBalance in the console); it needs no dependencies.
//
//   import { spacingBalance } from './tools/spacing-balance.js';
//   console.table(spacingBalance(document.body));
//
// It looks at every stack (siblings one under another, or side by side) and measures the gaps between the visible content of the
// siblings (text, icons, images and surfaces, not the empty padding of their boxes). It knows no component and no tag. Findings:
//   inversion  a group is not separated from its neighbours: the gap around a container is not bigger than the gaps inside it
//   weak       the gap around a container is bigger, but by less than a step (4px, or 25%): the groups still read as one
//   uneven     one container holds gaps that differ a lot (2x and 8px or more): it is really two groups, so wrap them in containers
//   weaker     a text that is visually weaker than the one above it (smaller, thinner or lighter) is farther from it than that text is
//              from what is above it: a note belongs to the thing it explains
// For a group the suggestion is the gap to use between groups: the inner gap plus a step, on the 4px grid.
// A group that paints its own surface or border (a button, a card, a bubble) is closed by it and is not checked.
// An element inside [data-spacing-ignore] is skipped.

const TOLERANCE = 1;
const STEP = 4;
const ceilGrid = (px) => Math.ceil(px / 4) * 4;

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

const AXES = {
  y: { start: 'top', end: 'bottom', cross: ['left', 'right'] },
  x: { start: 'left', end: 'right', cross: ['top', 'bottom'] },
};

/** Is the free space spread between the children (space-between, space-around, auto margins)? */
function spreads(parent, kids, axis) {
  const cs = getComputedStyle(parent);
  if (/space/.test(cs.justifyContent) || /space/.test(cs.alignContent)) return true;
  const sides = axis === 'x' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  return kids.some((k) => sides.some((s) => getComputedStyle(k)[`margin${s}`] === 'auto' || (parseFloat(getComputedStyle(k)[`margin${s}`]) > 24 && false)));
}

/** The stack formed by the children of `parent`: { axis, kids, boxes, gaps }, or null. */
function stackOf(parent) {
  const kids = [...parent.children].filter((k) => visible(k) && inFlow(k) && !k.matches('script, style, [hidden]'));
  if (kids.length < 2) return null;
  const boxes = kids.map(ink);
  if (boxes.some((b) => !b)) return null;
  for (const axis of ['y', 'x']) {
    const a = AXES[axis];
    const ok = boxes.every((b, i) => i === 0 || (b[a.start] >= boxes[i - 1][a.end] - 1
      && Math.min(b[a.cross[1]], boxes[i - 1][a.cross[1]]) - Math.max(b[a.cross[0]], boxes[i - 1][a.cross[0]]) > 0));
    if (ok) return { axis, spread: spreads(parent, kids, axis), kids, boxes, gaps: boxes.slice(1).map((b, i) => b[a.start] - boxes[i][a.end]) };
  }
  return null;
}

// how strongly a text is drawn: size, weight and darkness
function weight(el) {
  const cs = getComputedStyle(el);
  const [r, g, b, a = 1] = (cs.color.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
  const dark = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return parseFloat(cs.fontSize) * (0.6 + (+cs.fontWeight || 400) / 1000) * (0.5 + 0.5 * Math.max(dark, 1 - a * 0.5) * a + 0.25);
}
const isText = (el) => el.children.length === 0 && el.textContent.trim().length > 0;

/**
 * @param root  the element to check (its descendants)
 * @returns     [{ kind, element, selector, gap, around, suggestion }]
 */
export function spacingBalance(root = document.body) {
  const out = [];
  const stacks = new Map();
  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (el.closest('[data-spacing-ignore]') || !visible(el)) continue;
    const s = stackOf(el);
    if (s) stacks.set(el, s);
  }
  // the usual gap inside an element along `axis`: its own stack, or that of the only child it wraps (a gap that is only there
  // because the free space is spread, as in space-between, is not a gap of the design)
  const innerGap = (el, axis) => {
    for (let e = el, n = 0; e && n < 4; n++) {
      const s = stacks.get(e);
      if (s && s.axis === axis && !s.spread) { const g = s.gaps.filter((x) => x > 0).sort((p, q) => p - q); return g.length ? g[Math.floor(g.length / 2)] : 0; }
      const only = [...e.children].filter((k) => visible(k) && inFlow(k));
      e = only.length === 1 ? only[0] : null;
    }
    return 0;
  };

  for (const [parent, s] of stacks) {
    const { kids, gaps } = s;
    // groups: every child that holds a stack of its own must be separated from its neighbours by more than the gaps inside it
    kids.forEach((k, i) => {
      const inner = innerGap(k, s.axis);
      if (inner < 6 || !(k.children.length > 0) || paints(k, getComputedStyle(k))) return;   // a surface or a border closes its content by itself
      const outer = [gaps[i - 1], gaps[i]].filter((g) => g !== undefined && g > 0);
      if (!outer.length) return;
      const around = Math.min(...outer);
      const need = ceilGrid(Math.max(inner + STEP, inner * 1.25));
      if (around + TOLERANCE >= need) return;
      out.push({ kind: around <= inner + TOLERANCE ? 'inversion' : 'weak', element: k, selector: `${label(parent)} > ${label(k)}`, gap: Math.round(inner), around: outer.map(Math.round).join(' / '),
        suggestion: `${need}px between groups, or ${Math.max(0, ceilGrid(around - STEP) - STEP)}px inside` });
    });
    // one container, gaps that differ a lot: two groups hide in it
    const pos = gaps.filter((g) => g > 0);
    if (pos.length >= 2 && !s.spread && s.axis === 'y') {
      const hi = Math.max(...pos), lo = Math.min(...pos);
      if (hi >= lo * 2 && hi - lo >= 8) out.push({ kind: 'uneven', element: kids[gaps.indexOf(hi) + 1], selector: `${label(parent)} > ${label(kids[gaps.indexOf(hi) + 1])}`, gap: Math.round(hi), around: `${Math.round(lo)}`, suggestion: 'wrap the items that go together in a container' });
    }
    // a weaker text farther from its parent text than that text is from what is above it
    kids.forEach((k, i) => {
      if (i < 2 || s.axis !== 'y' || !isText(k) || !isText(kids[i - 1])) return;
      if (weight(k) >= weight(kids[i - 1]) * 0.98) return;
      const own = gaps[i - 1], above = gaps[i - 2];
      if (above > 0 && own > above + 2) out.push({ kind: 'weaker', element: k, selector: `${label(parent)} > ${label(k)}`, gap: Math.round(own), around: `${Math.round(above)}`, suggestion: `${Math.max(0, ceilGrid(above) - STEP)}px or less` });
    });
  }
  return out;
}
