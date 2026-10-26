import { useState, useEffect, useCallback } from '../../src/react.js';

export const useMedia = (query) => {
  const [on, setOn] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const f = () => setOn(mq.matches);
    mq.addEventListener('change', f); f();
    return () => mq.removeEventListener('change', f);
  }, [query]);
  return on;
};

/** A small hash router: #/study/s1/results → { parts: ['study', 's1', 'results'], query }. */
const read = () => {
  const [path, qs = ''] = (location.hash.replace(/^#/, '') || '/').split('?');
  return { path, parts: path.split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(qs)) };
};
export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const f = () => setRoute(read());
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return route;
}
export const go = (path) => { location.hash = path; };
export const href = (path) => `#${path}`;

/** A seeded random generator: the same study always gets the same responses. */
export function rng(seed) {
  let s = seed >>> 0;
  const next = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  next.int = (a, b) => a + Math.floor(next() * (b - a + 1));
  next.pick = (list) => list[Math.floor(next() * list.length)];
  next.chance = (p) => next() < p;
  return next;
}
export const seedOf = (str) => [...str].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7);

export const DAY = 864e5;
export const duration = (s) => (s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s`);
export const ago = (t) => {
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const hrs = Math.round(m / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const d = Math.round(hrs / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
};
export const shortDate = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const money = (n) => `$${n.toLocaleString('en-US')}`;
export const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);

/** State kept in localStorage on this device (a demo: nothing leaves the browser). */
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial(); } catch { return initial(); }
  });
  const set = useCallback((next) => setValue((cur) => {
    const v = typeof next === 'function' ? next(cur) : next;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ }
    return v;
  }), [key]);
  return [value, set];
}
