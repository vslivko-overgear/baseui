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

const pad = (n) => String(n).padStart(2, '0');
export const hhmm = (t) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const fullDate = (t) => new Date(t).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
const startOf = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const dayKey = (t) => startOf(t);
export const dayLabel = (t) => {
  const diff = Math.round((startOf(Date.now()) - startOf(t)) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return new Date(t).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};
export const listTime = (t) => {
  const diff = Math.round((startOf(Date.now()) - startOf(t)) / 864e5);
  if (diff === 0) return hhmm(t);
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return new Date(t).toLocaleDateString('en-US', { weekday: 'short' });
  return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const SETTINGS_KEY = 'baseui-messenger';
export const DEFAULT_SETTINGS = {
  notifyMessages: true, notifyGroups: true, notifyCalls: true, preview: true, sound: 'chime', volume: 60, notifyAbout: ['mentions', 'replies'],
  lastSeen: 'contacts', readReceipts: true, twoStep: false,
  wallpaper: 'dawn', textSize: 100, density: 'comfortable', groupAvatars: true,
  offline: false,
  profile: { name: 'Alex Morgan', bio: 'Product designer · coffee first', birthday: '1992-04-18', status: 'online' },
};
/** The settings of the messenger, kept in localStorage on this device. */
export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; } catch { return { ...DEFAULT_SETTINGS }; }
  });
  const update = useCallback((patch) => setSettings((s) => {
    const next = { ...s, ...patch };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    return next;
  }), []);
  return [settings, update];
}

/** The light or dark theme of the page, shared with the documentation site through localStorage. */
export function useColorScheme() {
  const read = () => document.documentElement.getAttribute('data-theme') || 'light';
  const [scheme, setScheme] = useState(read);
  useEffect(() => {
    const ob = new MutationObserver(() => setScheme(read()));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => ob.disconnect();
  }, []);
  const set = (v) => { document.documentElement.setAttribute('data-theme', v); try { localStorage.setItem('baseui-theme', v); } catch { /* storage unavailable */ } };
  return [scheme, set];
}
