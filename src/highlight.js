// The sliding highlight of Tabs (underline), Segmented Control (thumb), Bottom Bar (pill) and OTP Input (focus ring):
// one element inside the container that moves to the active item. It is measured with layout offsets within the container,
// so a running animation or transform of an item (a shake, an entrance) never moves it, and it is measured again when the
// container changes size. The container must be positioned (position: relative).
import { useState, useRef, useLayoutEffect } from './react.js';

/** The position of `el` inside `container`, summed along the offset parents; null when `container` is not one of them. */
export function offsetWithin(el, container) {
  let x = 0, y = 0, e = el;
  while (e && e !== container) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
  return e === container ? { x, y } : null;
}

const same = (a, b) => a === b || (a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h && a.r === b.r);

/**
 * @param containerRef the positioned element the highlight lives in
 * @param find         (container) => the active item, or null
 * @param deps         what changes the active item or the layout
 * @param withRadius   also read the corner radius of the item (the highlight takes its shape)
 * @returns [rect | null, remeasure]   rect: { x, y, w, h, r? }
 */
export function useHighlight(containerRef, find, deps, { withRadius = false } = {}) {
  const [rect, setRect] = useState(null);
  const measure = useRef(() => {});
  measure.current = () => {
    const box = containerRef.current;
    const el = box && find(box);
    const at = el && offsetWithin(el, box);
    const next = at ? { ...at, w: el.offsetWidth, h: el.offsetHeight, ...(withRadius && { r: getComputedStyle(el).borderTopLeftRadius }) } : null;
    setRect((prev) => (same(prev, next) ? prev : next));
  };
  useLayoutEffect(() => {
    measure.current();
    const box = containerRef.current;
    if (!box) return undefined;
    const ro = new ResizeObserver(() => measure.current());
    ro.observe(box);
    return () => ro.disconnect();
  }, deps);
  return [rect, () => measure.current()];
}
