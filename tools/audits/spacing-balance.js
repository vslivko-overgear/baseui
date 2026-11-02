// Spacing balance: the markup is the grouping. Content that sits in one container belongs together, so the gaps inside a container must be
// smaller than the gaps between that container and its neighbours, level by level: the deeper the nesting, the tighter the gap.
// Run it in the browser (import this module, or paste spacingBalance in the console); it needs no dependencies.
//
//   import { spacingBalance } from './tools/audits/spacing-balance.js';
//   console.table(spacingBalance(document.body));
//
// It looks at every stack (siblings one under another, or side by side) and measures the gaps between the visible content of the
// siblings (text, icons, images and surfaces, not the empty padding of their boxes). It knows no component and no tag. Findings:
//   inversion  a group is not separated from its neighbours: the gap around a container is not bigger than the gaps inside it
//   weak       the gap around a container is bigger, but by less than a step (4px, or 25%): the groups still read as one
//   uneven     one container holds gaps that differ a lot (2x and 8px or more): it is really two groups, so wrap them in containers
//   lead       a heading belongs to what follows it, so the gap above it must be bigger than the gap below it, and the heavier the block above
//              (a surface, a code block, a card), the bigger: a heading that sits as close to the block above as to its own text reads as its caption
//   weaker     a text that is visually weaker than the one above it (smaller, thinner or lighter) is farther from it than that text is
//              from what is above it: a note belongs to the thing it explains
//   pull       a block is pulled closer with a negative margin: it belongs to another group, so put it in the group it belongs to (Group,
//              Stack relation); a row that must reach the screen edges is a Bleed, which is the only block allowed a negative margin
//   drift      a heading is too far from the content it names: the gap below it is bigger than 60% of its font size (16 at least), so it falls off
//   bar        a top or bottom bar that does not span the width of the screen: it sits inside a padded container, so put it outside
//   phone      on a phone (under 768px wide) the gap between two blocks is bigger than a section gap (40px): the page needs a shorter rhythm
// For a group the suggestion is the gap to use between groups: the inner gap plus a step, on the 4px grid.
// A group that paints its own surface or border (a button, a card, a bubble) is closed by it and is not checked.
// An element inside [data-spacing-ignore] is skipped.

const TOLERANCE = 1;
const STEP = 4;
// the spacing scale in px (D3): a suggestion is always a step of it
const SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
const ceilGrid = (px) => SCALE.find((v) => v >= px - 0.01) ?? Math.ceil(px / 16) * 16;
const floorGrid = (px) => [...SCALE].reverse().find((v) => v <= px + 0.01) ?? 0;
// a size as the spacing scale names it: 16px is `16px (4 gaps)`; a gap is 4px
const inGaps = (px) => `${px}px (${px / 4} gap${px === 4 ? '' : 's'})`;

const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
const inFlow = (el) => !['absolute', 'fixed'].includes(getComputedStyle(el).position);
const label = (el) => {
  const slot = el.dataset?.slot;
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
  return slot ? `${el.tagName.toLowerCase()}[${slot}]` : `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
};

/** Does the box paint something itself (a surface, a border, a line, an image)? */
function paints(el, cs) {
  // a sticky bar is a surface of its own even when it is transparent and only blurs what scrolls beneath it
  if (cs.position === 'sticky') return true;
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
  // a child that grows takes the free space: the gap after it is the free space, not a gap of the design
  if (cs.display.includes('flex') && kids.some((k) => parseFloat(getComputedStyle(k).flexGrow) > 0)) return true;
  const sides = axis === 'x' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  return kids.some((k) => sides.some((s) => getComputedStyle(k)[`margin${s}`] === 'auto' || (parseFloat(getComputedStyle(k)[`margin${s}`]) > 24 && false)));
}

/** The stack formed by the children of `parent`: { axis, kids, boxes, gaps }, or null. */
function stackOf(parent) {
  // a form is spaced by one gap in both directions by design (Form, FormRow): rows and columns are not different relations
  if (parent.matches('.bui-form, .bui-form__fields, .bui-form__row')) return null;
  const kids = [...parent.children].filter((k) => visible(k) && inFlow(k) && !k.matches('script, style, [hidden]'));
  if (kids.length < 2) return null;
  const boxes = kids.map(ink);
  if (boxes.some((b) => !b)) return null;
  for (const axis of ['y', 'x']) {
    const a = AXES[axis];
    const ok = boxes.every((b, i) => i === 0 || (b[a.start] >= boxes[i - 1][a.end] - 1
      && Math.min(b[a.cross[1]], boxes[i - 1][a.cross[1]]) - Math.max(b[a.cross[0]], boxes[i - 1][a.cross[0]]) > 0));
    if (ok) {
      // side by side in a grid or a row with a gap: the gap of the design is that gap; the ink of text columns is narrower than its cells
      const cs = getComputedStyle(parent);
      const spread = spreads(parent, kids, axis);
      const layout = axis === 'x' && !spread && /grid|flex/.test(cs.display) ? parseFloat(cs.columnGap) : NaN;
      return { axis, spread, kids, boxes, gaps: boxes.slice(1).map((b, i) => (layout > 0 ? layout : b[a.start] - boxes[i][a.end])) };
    }
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
const HEADING = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
/** A heading, or a block that is only a heading with a line under it: it belongs to what follows, not to what is above. */
const isHeadBlock = (el) => el.matches(HEADING) || (!!el.querySelector(HEADING) && el.textContent.trim().length < 160 && !el.querySelector('input, select, textarea'));
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
      if (n > 0 && paints(e, getComputedStyle(e))) return 0;   // a surface closes what is in it: its gaps are not the gaps of the group around it
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
      // the gap to a heading above is not a gap between groups: the heading leads this group
      // a neighbour that paints a surface or a line (a bar, a card) is separated by it, so that gap is not a gap between groups either
      const closed = (n) => n && paints(n, getComputedStyle(n));
      const outer = [i > 0 && (isHeadBlock(kids[i - 1]) || closed(kids[i - 1])) ? undefined : gaps[i - 1], closed(kids[i + 1]) ? undefined : gaps[i]].filter((g) => g !== undefined && g > 0);
      if (!outer.length) return;
      const around = Math.min(...outer);
      const need = ceilGrid(Math.max(inner + STEP, inner * 1.25));
      // the ink of the text carries the leading of its lines, so a gap that is a step bigger and within 20% of what the ladder asks is a gap of the design
      if (around + TOLERANCE >= need || (around + TOLERANCE >= inner + 2 && around + TOLERANCE >= need * 0.8)) return;
      out.push({ kind: around <= inner + TOLERANCE ? 'inversion' : 'weak', element: k, selector: `${label(parent)} > ${label(k)}`, gap: Math.round(inner), around: outer.map(Math.round).join(' / '),
        suggestion: `${inGaps(need)} between groups, or ${inGaps(floorGrid(Math.max(0, around - STEP)))} inside` });
    });
    // one container, gaps that differ a lot: two groups hide in it
    const pos = gaps.filter((g) => g > 0);
    // the chrome of an app (header, main, footer) is spaced by the page, not by a design gap
    if (pos.length >= 2 && !s.spread && s.axis === 'y' && !kids.some((k) => k.matches('header, footer, main, nav, aside'))) {
      const hi = Math.max(...pos), lo = Math.min(...pos);
      if (hi >= lo * 2 && hi - lo >= 8) out.push({ kind: 'uneven', element: kids[gaps.indexOf(hi) + 1], selector: `${label(parent)} > ${label(kids[gaps.indexOf(hi) + 1])}`, gap: Math.round(hi), around: `${Math.round(lo)}`, suggestion: 'wrap the items that go together in a container' });
    }
    // a weaker text farther from its parent text than that text is from what is above it
    kids.forEach((k, i) => {
      if (i < 2 || s.axis !== 'y' || !isText(k) || !isText(kids[i - 1])) return;
      if (weight(k) >= weight(kids[i - 1]) * 0.98) return;
      const own = gaps[i - 1], above = gaps[i - 2];
      if (above > 0 && own > above + 2) out.push({ kind: 'weaker', element: k, selector: `${label(parent)} > ${label(k)}`, gap: Math.round(own), around: `${Math.round(above)}`, suggestion: `${inGaps(floorGrid(Math.max(0, above - STEP)))} or less` });
    });
  }
  // a heading belongs to what follows it: a big heading must not hang far above its content. Walk from the heading (and the small
  // lines right under it, its subtitle) to the next block of the page, climbing out of the containers that end there
  for (const h of root.querySelectorAll(HEADING)) {
    if (h.closest('[data-spacing-ignore]') || !visible(h)) continue;
    const fs = parseFloat(getComputedStyle(h).fontSize);
    if (fs < 24) continue;
    let bottom = ink(h)?.bottom;
    if (bottom == null) continue;
    let node = h;
    let next = null;
    for (let up = 0; up < 5 && node && node !== root && !next; up++) {
      let sib = node.nextElementSibling;
      while (sib && (!visible(sib) || !inFlow(sib))) sib = sib.nextElementSibling;
      // a subtitle: a small text line right under the heading is part of it
      while (sib && isText(sib) && parseFloat(getComputedStyle(sib).fontSize) <= fs * 0.7) {
        const b = ink(sib);
        if (!b || b.top - bottom > 16) break;
        bottom = b.bottom;
        sib = sib.nextElementSibling;
        while (sib && (!visible(sib) || !inFlow(sib))) sib = sib.nextElementSibling;
      }
      if (sib) next = sib; else node = node.parentElement;
    }
    const nb = next && ink(next);
    if (!nb) continue;
    const below = nb.top - bottom;
    const limit = Math.max(16, Math.round((fs * 0.6) / 4) * 4);
    if (below > limit + 5) out.push({ kind: 'drift', element: h, selector: label(h), gap: Math.round(below), around: `${limit}`, suggestion: `${inGaps(limit)} at most below a ${Math.round(fs)}px heading (Group, Stack relation="related")` });
  }
  // a bar of the screen (Navbar, BottomBar) spans the whole width: inside a padded page it is a narrow strip with the edges eaten
  for (const el of root.querySelectorAll('.bui-navbar:not(.bui-navbar--floating), .bui-bottombar:not(.bui-bottombar--floating)')) {
    if (el.closest('[data-spacing-ignore]') || !visible(el)) continue;
    const w = el.getBoundingClientRect().width;
    if (innerWidth < 768 && Math.abs(w - innerWidth) > 1) out.push({ kind: 'bar', element: el, selector: label(el), gap: Math.round(w), around: `${innerWidth}`, suggestion: 'render the bar outside the padded page so it spans the whole width of the screen' });
  }
  // a negative margin is a block pulled by hand; only a Bleed (data-slot="bleed") reaches out on purpose
  for (const el of root.querySelectorAll('*')) {
    if (el.closest('[data-spacing-ignore], [data-slot="bleed"]') || !visible(el) || !inFlow(el)) continue;
    // the parts of a library component keep their own margins; the layout blocks (Stack, Grid, Group, Section) and the author's are checked
    const own = el.dataset.slot || (typeof el.className === 'string' && /(^|\s)bui-(?!stack|grid|group|section|center)/.test(el.className));
    if (own && !/^(stack|grid|group|section|center)$/.test(el.dataset.slot || '')) continue;
    const cs = getComputedStyle(el);
    const wide = el.getBoundingClientRect().width >= innerWidth * 0.9;
    const vertical = parseFloat(cs.marginTop) < 0 || parseFloat(cs.marginBottom) < 0;
    const horizontal = wide && (parseFloat(cs.marginLeft) < 0 || parseFloat(cs.marginRight) < 0);
    if (vertical || horizontal) out.push({ kind: 'pull', element: el, selector: label(el), gap: Math.round(Math.min(parseFloat(cs.marginTop), parseFloat(cs.marginBottom), parseFloat(cs.marginLeft), parseFloat(cs.marginRight))), around: '0', suggestion: vertical ? 'put the block in the group it belongs to (Group, Stack relation) instead of pulling it' : 'use Bleed for a block that runs to the screen edges' });
  }
  // on a phone the gap between sections is 40 at most (the ink of the text adds up to 8px)
  if (innerWidth < 768) {
    for (const [parent, s] of stacks) {
      if (s.axis !== 'y' || s.spread || s.kids.some((k) => k.matches('header, footer, main, nav, aside'))) continue;
      // a block that is sticky, or the last block of a screen-high page that sticks to its bottom (a composer, a bar) is pushed by free space, not spaced by the design
      const pinned = (i) => getComputedStyle(s.kids[i + 1]).position === 'sticky' || i === s.kids.length - 2 && parent.getBoundingClientRect().height >= innerHeight * 0.9 && Math.abs(parent.getBoundingClientRect().bottom - s.kids[i + 1].getBoundingClientRect().bottom) < 40;
      s.gaps.forEach((g, i) => { if (g > 50 && !pinned(i)) out.push({ kind: 'phone', element: s.kids[i + 1], selector: `${label(parent)} > ${label(s.kids[i + 1])}`, gap: Math.round(g), around: '40', suggestion: `${inGaps(40)} at most between sections on a phone (Stack relation="section")` }); });
    }
  }
  // a heading leads the group below it: the gap above it is bigger than the gap below it (more after a heavy block, which pulls the eye)
  for (const [parent, s] of stacks) {
    if (s.axis !== 'y' || s.spread) continue;
    const { kids, boxes, gaps } = s;
    kids.forEach((k, i) => {
      if (i < 1 || i >= kids.length) return;
      const next = kids[i + 1];
      const heading = k.matches(HEADING) || (next && isText(k) && isText(next) && parseFloat(getComputedStyle(k).fontSize) >= parseFloat(getComputedStyle(next).fontSize) * 1.1 && (+getComputedStyle(k).fontWeight || 400) >= 600);
      if (!heading || !next) return;
      const above = gaps[i - 1], below = gaps[i];
      if (!(above > 0) || !(below > 0)) return;
      const prev = kids[i - 1];
      const heavy = paints(prev, getComputedStyle(prev)) && boxes[i - 1].bottom - boxes[i - 1].top >= 48 && prev.textContent.trim().length > 0;   // an icon plate is not a heavy block
      const need = ceilGrid(Math.max(below + STEP, below * (heavy ? 2 : 1.5)));
      if (above + TOLERANCE >= need) return;
      out.push({ kind: 'lead', element: k, selector: `${label(parent)} > ${label(k)}`, gap: Math.round(above), around: `${Math.round(below)}`, suggestion: `${inGaps(need)} above the heading${heavy ? ' (it follows a heavy block)' : ''}, or wrap the heading and its content in one container` });
    });
  }
  return out;
}
