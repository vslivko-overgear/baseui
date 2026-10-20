// Radius check: nested rounded corners must be concentric, so the inner radius = the outer radius - the inset between them.
// Run it in the browser (import this module, or paste checkRadii in the console); it needs no dependencies.
//
//   import { checkRadii } from './tools/radius-check.js';
//   console.table(checkRadii(document.body));
//
// For every element with a rounded corner it takes the nearest ancestor that is rounded too. When a corner of the element
// sits inside the corner area of that ancestor (both distances are smaller than the outer radius), the rule applies:
//   expected = max(0, outer - inset), where inset = the smaller of the two distances.
// Elements that sit deeper than 60% of the outer radius are skipped (a small button inside a field is not a nested surface).
// An element inside [data-radius-ignore] is skipped.
// Pills and circles (the radius is at least half of the smaller side) are skipped on both sides: they have no concentric partner.

const CORNERS = [
  { prop: 'borderTopLeftRadius', dx: (e, a) => e.left - a.left, dy: (e, a) => e.top - a.top },
  { prop: 'borderTopRightRadius', dx: (e, a) => a.right - e.right, dy: (e, a) => e.top - a.top },
  { prop: 'borderBottomRightRadius', dx: (e, a) => a.right - e.right, dy: (e, a) => a.bottom - e.bottom },
  { prop: 'borderBottomLeftRadius', dx: (e, a) => e.left - a.left, dy: (e, a) => a.bottom - e.bottom },
];

const radiusOf = (cs, prop) => parseFloat(cs[prop]) || 0;
const isPill = (r, rect) => r >= Math.min(rect.width, rect.height) / 2 - 0.5;
const label = (el) => {
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
  return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
};

/** The nearest ancestor of `el` that has a rounded corner and is not hidden. */
function roundedAncestor(el) {
  for (let a = el.parentElement; a; a = a.parentElement) {
    const cs = getComputedStyle(a);
    if (CORNERS.some((c) => radiusOf(cs, c.prop) > 0)) return a;
  }
  return null;
}

/**
 * Finds nested corners that are not concentric.
 * @param root       the element to check (its descendants)
 * @param tolerance  how many pixels the radius may differ from the rule
 * @returns          [{ element, selector, corner, outer, inset, expected, actual }]
 */
export function checkRadii(root = document.body, { tolerance = 0.75 } = {}) {
  const out = [];
  for (const el of root.querySelectorAll('*')) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (el.closest('[data-radius-ignore]')) continue;                   // examples that break the rule on purpose
    const outerEl = roundedAncestor(el);
    if (!outerEl) continue;
    const ocs = getComputedStyle(outerEl);
    const orect = outerEl.getBoundingClientRect();
    for (const c of CORNERS) {
      const actual = radiusOf(cs, c.prop);
      const outer = radiusOf(ocs, c.prop);
      if (!actual || !outer || isPill(actual, rect) || isPill(outer, orect)) continue;
      const dx = c.dx(rect, orect);
      const dy = c.dy(rect, orect);
      if (dx < 0 || dy < 0 || dx >= outer || dy >= outer) continue;      // the corner is not inside the corner area of the outer one
      if (Math.abs(dx - dy) > 1) continue;                              // different insets on the two sides: there is no single rule
      const inset = Math.min(dx, dy);
      if (inset > outer * 0.6) continue;                                // far from the edge: a small element inside, not a nested surface
      const expected = Math.max(0, outer - inset);
      if (Math.abs(actual - expected) > tolerance) {
        out.push({ element: el, selector: `${label(outerEl)} > ${label(el)}`, corner: c.prop.replace(/^border|Radius$/g, ''), outer, inset: Math.round(inset * 10) / 10, expected: Math.round(expected * 10) / 10, actual });
      }
    }
  }
  return out;
}
