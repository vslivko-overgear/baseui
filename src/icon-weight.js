// Icon weight: the stroke of an outline icon follows the thickness of the text it stands next to.
// A stem of the text is a fraction of the font size that grows with the font weight; the icon is drawn in a 24 box, so the stroke
// that matches the stem is the stem in px scaled by 24 / icon size. It is kept between MIN and MAX; a text that is bolder than MAX
// can take is matched by the filled icon instead.
import { useState, useLayoutEffect, useRef } from './react.js';

export const MIN_STROKE = 1;
export const MAX_STROKE = 2.5;
export const DEFAULT_STROKE = 2;
// stem thickness in em by font weight (a typical text face)
const STEM = [[100, 0.04], [200, 0.05], [300, 0.065], [400, 0.085], [500, 0.1], [600, 0.115], [700, 0.13], [800, 0.15], [900, 0.17]];
const stemEm = (weight) => {
  const w = Math.max(100, Math.min(900, weight));
  const i = STEM.findIndex(([x]) => x >= w);
  if (i <= 0) return STEM[0][1];
  const [x0, y0] = STEM[i - 1], [x1, y1] = STEM[i];
  return y0 + ((y1 - y0) * (w - x0)) / (x1 - x0);
};
const round = (n) => Math.round(n * 4) / 4;

/** The stroke (in a 24 box) that matches a text, and whether it is too thick for an outline icon. */
export function iconWeight({ fontSize, fontWeight, iconSize = 24 }) {
  const wanted = stemEm(fontWeight) * fontSize * (24 / iconSize);
  return { wanted, stroke: round(Math.max(MIN_STROKE, Math.min(MAX_STROKE, wanted))), filled: wanted > MAX_STROKE };
}

/** The text an icon is the companion of: the nearest text beside it in its group (up to three levels up). */
export function textNear(svg) {
  let node = svg;
  for (let level = 0; level < 3 && node.parentElement; level += 1) {
    const parent = node.parentElement;
    const text = [...parent.childNodes].find((n) => n !== node && !n.contains(svg) && !(n.nodeType === 1 && n.matches?.('svg')) && n.textContent.trim());
    if (text) return text.nodeType === 1 ? text : parent;
    node = parent;
  }
  return null;
}
export function weightNear(svg, iconSize) {
  const el = textNear(svg);
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { ...iconWeight({ fontSize: parseFloat(cs.fontSize), fontWeight: parseInt(cs.fontWeight, 10) || 400, iconSize: iconSize ?? svg.getBoundingClientRect().width }), el };
}

/** A ref for the element that wraps the icon (its first child is the svg) and the weight that matches its text: { stroke, filled }; until it is measured the default stroke. */
export function useIconWeight(enabled, size, deps = []) {
  const ref = useRef(null);
  const [weight, setWeight] = useState({ stroke: DEFAULT_STROKE, filled: false });
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;
    const w = weightNear(ref.current.firstElementChild || ref.current, size);
    if (w && (w.stroke !== weight.stroke || w.filled !== weight.filled)) setWeight({ stroke: w.stroke, filled: w.filled });
  }, [enabled, size, ...deps]);
  return [ref, weight];
}
