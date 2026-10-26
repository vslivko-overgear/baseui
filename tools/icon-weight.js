// Icon weight tool (browser module): finds the outline icons that stand next to text and matches their stroke to the weight of that text.
//   import { auditIcons, applyIconWeight } from './tools/icon-weight.js';
//   auditIcons(document.body)       // → [{ selector, text, fontSize, fontWeight, iconSize, stroke, wanted, filled }] for icons whose stroke is off
//   applyIconWeight(document.body)  // sets the matching stroke on every such icon; returns the icons that need the filled variant
// The Icon component does the same for itself (weight="auto"); this is for icons drawn by other means and for the audit of a page.
import { weightNear, DEFAULT_STROKE } from '../src/icon-weight.js';

const isOutlineIcon = (svg) => svg.getAttribute('viewBox') === '0 0 24 24' && svg.querySelector('path[stroke="currentColor"]') && !svg.closest('[data-icon-weight="off"], [data-slot="story-canvas-icons"]');
const strokeOf = (svg) => parseFloat(svg.querySelector('path[stroke="currentColor"]').getAttribute('stroke-width') || svg.getAttribute('stroke-width') || DEFAULT_STROKE);
const describe = (el) => `${el.tagName.toLowerCase()}${el.dataset?.slot ? `[${el.dataset.slot}]` : ''}`;

export function auditIcons(root = document.body) {
  const out = [];
  root.querySelectorAll('svg').forEach((svg) => {
    if (!isOutlineIcon(svg)) return;
    const size = svg.getBoundingClientRect().width;
    if (!size) return;
    const w = weightNear(svg, size);
    if (!w) return;
    const stroke = strokeOf(svg);
    if (w.filled || Math.abs(stroke - w.stroke) >= 0.25) {
      const cs = getComputedStyle(w.el);
      out.push({ selector: `${describe(svg.parentElement)} > svg`, text: w.el.textContent.trim().slice(0, 24), fontSize: parseFloat(cs.fontSize), fontWeight: parseInt(cs.fontWeight, 10), iconSize: size, stroke, wanted: Math.round(w.wanted * 100) / 100, recommended: w.stroke, filled: w.filled });
    }
  });
  return out;
}

export function applyIconWeight(root = document.body) {
  const needFilled = [];
  root.querySelectorAll('svg').forEach((svg) => {
    if (!isOutlineIcon(svg)) return;
    const w = weightNear(svg);
    if (!w) return;
    svg.querySelectorAll('path[stroke="currentColor"]').forEach((p) => p.setAttribute('stroke-width', String(w.stroke)));
    if (w.filled) needFilled.push(svg);
  });
  return needFilled;
}
