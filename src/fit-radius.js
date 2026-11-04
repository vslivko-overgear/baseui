import { useCallback, useRef } from './react.js';

/**
 * The corner of a surface follows its mass, and the small ones are rounder in proportion: the radius is `reach × s / (s + half)` for the smaller side `s`,
 * a curve that rises fast on small sizes and flattens on big ones, kept between `min` and `max` (px) and always an even number.
 * A chip of 76px has 20, a card of 100px 22, a card of 177px 26, 240px 28, a page-wide one 32 (a field of 56px is 16 by its own size).
 */
export const FIT = { min: 12, max: 32, reach: 36, half: 60 };
export const radiusFor = (width, height) => {
  const side = Math.min(width, height);
  if (!(side > 0)) return FIT.max;
  // even only: 2 × a whole half
  return Math.max(FIT.min, Math.min(FIT.max, 2 * Math.round((FIT.reach * side) / (side + FIT.half) / 2)));
};

/**
 * A callback ref that keeps `--bui-card-radius` of the element in step with its size (it is not a re-render: the property is set on the node).
 * An explicit `radius` (a number of px or any CSS length) wins and is not measured. `outer` is the ref of the caller, if any.
 */
export function useFitRadius(radius, outer) {
  const observer = useRef(null);
  return useCallback(
    (node) => {
      observer.current?.disconnect();
      observer.current = null;
      if (typeof outer === 'function') outer(node);
      else if (outer) outer.current = node;
      if (!node) return;
      if (radius != null && radius !== 'fit') {
        node.style.setProperty('--bui-card-radius', typeof radius === 'number' ? `${radius}px` : String(radius));
        return;
      }
      const set = () => node.style.setProperty('--bui-card-radius', `${radiusFor(node.offsetWidth, node.offsetHeight)}px`);
      set();
      if (typeof ResizeObserver === 'function') {
        observer.current = new ResizeObserver(set);
        observer.current.observe(node);
      }
    },
    [radius, outer],
  );
}
