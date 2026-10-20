// The theme settings that components follow: data-motion, data-floating and data-glass on <html>.
import { useState, useEffect, useRef } from './react.js';


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

/** off | basic | enhanced of the nearest element that sets data-motion (the page by default); basic when nothing sets it. */
export const motionOf = (el) => el?.closest?.('[data-motion]')?.dataset.motion || 'basic';
/** The class that forces glass on or off for one component; nothing follows the theme. */
export const glassClass = (glass) => (glass === true ? 'bui-glass' : glass === false ? 'bui-glass-off' : undefined);

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
/** The motion level of one component: its own prop, else the theme setting. */
export const useMotion = (motion) => { const root = useRootAttr('motion'); return motion || root || 'basic'; };
