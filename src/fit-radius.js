import { useCallback, useRef } from './react.js';

/**
 * The corner of a surface follows its mass: a big card is rounder than a small one, so a row of five cards and a row of two
 * are both in proportion. The radius is `K × √(the smaller side)` between `MIN` and `MAX` (px), always an even number: 100px is 16, 177px is 22, 240px is 24, 300px is 28, a page-wide card is 32.
 */
export const FIT = { min: 12, max: 32, k: 1.6 };
export const radiusFor = (width, height) => {
  const side = Math.min(width, height);
  if (!(side > 0)) return FIT.max;
  // even only: 2 × a whole half
  return Math.max(FIT.min, Math.min(FIT.max, 2 * Math.round((FIT.k * Math.sqrt(side)) / 2)));
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
