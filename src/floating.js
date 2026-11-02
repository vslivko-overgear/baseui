// Panels (Dropdown, Popover) open over the page: they are drawn in <body> with fixed coordinates taken from their trigger,
// so no scrolling or clipping container around the trigger can cut them or push the layout. They flip to the other side
// when there is no room and stay inside the screen.
import { useState, useCallback, useEffect, useLayoutEffect, useRef } from './react.js';
import { createPortal } from 'react-dom';

const GAP = 8;
const EDGE = 8;

/** Draws `children` in <body>. */
export const Floating = ({ children }) => createPortal(children, document.body);

/**
 * Where the open panel goes: `{ top, left, width?, maxHeight, placement }` for position: fixed.
 * @param anchorRef  the element the panel hangs on (the trigger)
 * @param panelRef   the panel itself, measured after it is rendered
 * @param placement  'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'; the opposite side is used when this one has no room, and the other alignment
 *                  (left edge or right edge of the anchor) when this one runs out of the window
 * @param matchWidth give the panel the width of the anchor
 */
export function useAnchoredPosition(open, anchorRef, panelRef, placement, matchWidth = false) {
  const [pos, setPos] = useState(null);
  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const r = anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const width = matchWidth ? r.width : panel.offsetWidth;
    const natural = panel.scrollHeight;
    const below = vh - r.bottom - GAP - EDGE;
    const above = r.top - GAP - EDGE;
    let side = placement.startsWith('top') ? 'top' : 'bottom';
    if (side === 'bottom' && natural > below && above > below) side = 'top';
    else if (side === 'top' && natural > above && below > above) side = 'bottom';
    const room = side === 'bottom' ? below : above;
    const height = Math.min(natural, room);
    // aligned to the left edge of the anchor by default (`start`), to its right edge when that does not fit (and the other way round for `end`);
    // never centered or shifted by a few pixels: only when neither fits is the panel kept inside the window
    const fitsStart = r.left + width <= vw - EDGE;
    const fitsEnd = r.right - width >= EDGE;
    let end = placement.endsWith('end');
    if (end && !fitsEnd && fitsStart) end = false;
    else if (!end && !fitsStart && fitsEnd) end = true;
    const left = Math.max(EDGE, Math.min(end ? r.right - width : r.left, vw - width - EDGE));
    const top = side === 'bottom' ? r.bottom + GAP : r.top - GAP - height;
    setPos((p) => {
      const next = { top: Math.round(top), left: Math.round(left), width: matchWidth ? Math.round(r.width) : undefined, maxHeight: Math.floor(room), placement: `${side}-${end ? 'end' : 'start'}` };
      return p && Object.keys(next).every((k) => p[k] === next[k]) ? p : next;
    });
  }, [anchorRef, panelRef, placement, matchWidth]);

  useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const ro = typeof ResizeObserver === 'function' && panelRef.current ? new ResizeObserver(update) : null;
    ro?.observe(panelRef.current);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); ro?.disconnect(); };
  }, [open, update]);
  return pos;
}

const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Where a small bubble (a tooltip) goes: `{ top, left, side }` for position: fixed. It opens on `placement` (top, bottom, left or right of the
 * anchor), takes the opposite side when this one has not enough room in the window, and is kept inside the window along the other axis.
 */
export function useAnchoredSide(open, anchorRef, bubbleRef, placement = 'top') {
  const [pos, setPos] = useState(null);
  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;
    const r = anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const w = bubble.offsetWidth;
    const h = bubble.offsetHeight;
    const room = { top: r.top - GAP - EDGE, bottom: vh - r.bottom - GAP - EDGE, left: r.left - GAP - EDGE, right: vw - r.right - GAP - EDGE };
    const need = placement === 'top' || placement === 'bottom' ? h : w;
    const side = room[placement] < need && room[OPPOSITE[placement]] > room[placement] ? OPPOSITE[placement] : placement;
    const across = (start, size, limit) => Math.max(EDGE, Math.min(start, limit - size - EDGE));
    let top;
    let left;
    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? r.top - GAP - h : r.bottom + GAP;
      left = across(r.left + r.width / 2 - w / 2, w, vw);
    } else {
      left = side === 'left' ? r.left - GAP - w : r.right + GAP;
      top = across(r.top + r.height / 2 - h / 2, h, vh);
    }
    setPos((p) => (p && p.top === Math.round(top) && p.left === Math.round(left) && p.side === side ? p : { top: Math.round(top), left: Math.round(left), side }));
  }, [anchorRef, bubbleRef, placement]);
  useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open, update]);
  return pos;
}

/** The inline style of a positioned panel; hidden for the one frame before it is measured. */
export const panelStyle = (pos) => (pos
  ? { position: 'fixed', top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
  : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' });

/**
 * Closes an open panel the way every panel of the system closes: a press outside the trigger and the panel, or Escape
 * (focus then goes back to the trigger, the element with aria-haspopup inside the root).
 */
export function useDismiss(open, close, rootRef, panelRef) {
  const latest = useRef(close);
  latest.current = close;
  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (!rootRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) latest.current(); };
    const escape = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      latest.current();
      rootRef.current?.querySelector('[aria-haspopup]')?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
}
