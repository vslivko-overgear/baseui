// Panels (Dropdown, Popover) open over the page: they are drawn in <body> with fixed coordinates taken from their trigger,
// so no scrolling or clipping container around the trigger can cut them or push the layout. They flip to the other side
// when there is no room and stay inside the screen.
import { React, useState, useCallback, useEffect } from './react.js';
import { t as requireReactDom } from '../lib/react-dom-BzEl8usk.js';

const { createPortal } = requireReactDom();
const GAP = 8;
const EDGE = 8;

/** Draws `children` in <body>. */
export const Floating = ({ children }) => createPortal(children, document.body);

/**
 * Where the open panel goes: `{ top, left, width?, maxHeight, placement }` for position: fixed.
 * @param anchorRef  the element the panel hangs on (the trigger)
 * @param panelRef   the panel itself, measured after it is rendered
 * @param placement  'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'; the opposite side is used when this one has no room
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
    const end = placement.endsWith('end');
    const left = Math.max(EDGE, Math.min(end ? r.right - width : r.left, vw - width - EDGE));
    const top = side === 'bottom' ? r.bottom + GAP : r.top - GAP - height;
    setPos((p) => {
      const next = { top: Math.round(top), left: Math.round(left), width: matchWidth ? Math.round(r.width) : undefined, maxHeight: Math.floor(room), placement: `${side}-${end ? 'end' : 'start'}` };
      return p && Object.keys(next).every((k) => p[k] === next[k]) ? p : next;
    });
  }, [anchorRef, panelRef, placement, matchWidth]);

  (React.useLayoutEffect)(() => {
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

/** The inline style of a positioned panel; hidden for the one frame before it is measured. */
export const panelStyle = (pos) => (pos
  ? { position: 'fixed', top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
  : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' });
