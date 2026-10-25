// The theme settings that components follow, and the shared hooks around them.
//
// One convention for every setting: the theme writes it on <html> as a data attribute (data-motion, data-glass, data-floating),
// and a component that overrides it with a prop writes the same attribute on its own root, or on its floating panel:
//   motion   'off' | 'basic' | 'enhanced'  → data-motion   (CSS: --bui-fx is 1 only in enhanced; off stops transitions and animations)
//   glass    true | false                  → data-glass="on" | "off"
//   floating true | false                  → the floating layout of the bars and the dialog (a class of the component; read with useFloating)
import { React, useState, useEffect, useRef, useCallback } from './react.js';

/** The value of a data attribute of <html>, kept up to date when the theme changes. */
export function useRootAttr(name) {
  const read = () => document.documentElement.getAttribute(`data-${name}`);
  const [value, setValue] = useState(read);
  useEffect(() => {
    const ob = new MutationObserver(() => setValue(read()));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: [`data-${name}`] });
    setValue(read());
    return () => ob.disconnect();
  }, [name]);
  return value;
}

/** The motion level of one component: its own prop, else the theme setting; basic when nothing sets it. */
export const useMotion = (motion) => { const root = useRootAttr('motion'); return motion || root || 'basic'; };
/** The floating layout of one component: its own prop, else the theme setting. */
export const useFloating = (floating) => { const root = useRootAttr('floating') === 'on'; return floating ?? root; };
/** The motion level that applies to an element: the nearest data-motion around it (its component or the page). */
export const motionOf = (el) => el?.closest?.('[data-motion]')?.dataset.motion || 'basic';

/** The data attributes of the per-component overrides, written the way the theme writes them on <html>. */
export const themeAttrs = ({ motion, glass } = {}) => ({
  'data-motion': motion || undefined,
  'data-glass': glass === true ? 'on' : glass === false ? 'off' : undefined,
});

/** A media query, kept up to date. */
export function useMediaQuery(query) {
  const subscribe = useCallback((cb) => {
    const q = window.matchMedia(query);
    q.addEventListener('change', cb);
    return () => q.removeEventListener('change', cb);
  }, [query]);
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
/** A touch screen: no hover there, so hover-only UI (tooltips) stays hidden and hover styles must not stick. */
export const useTouchScreen = () => useMediaQuery('(hover: none), (pointer: coarse)');

/** False on the first frame, true afterwards: transitions switched on with it do not play from the initial position. */
export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);
  return ready;
}

/** Basic animations: the highlight (underline, thumb, pill) does not slide, it appears at the new place with a short fade. */
export function useAppear(ref, container, key) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current;
    if (el && el.animate && motionOf(container.current) === 'basic') el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
  }, [key]);
}

/** Keeps a panel mounted for `ms` after it closes so it can play an exit animation; returns [mounted, closing]. */
export function usePresence(open, ms) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) { setMounted(true); return undefined; }
    if (!ms) { setMounted(false); return undefined; }
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  if (!ms) return [open, false];
  return [open || mounted, !open && mounted];
}
