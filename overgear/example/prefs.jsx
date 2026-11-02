// The preferences of a visitor: the currency and the language. They are kept on the device and shared by every place that shows them
// (the account screen, the profile menu of the header).
import { useState, useEffect } from '../../src/react.js';
import { ChoiceSheet } from '../../src/components/ChoiceSheet.jsx';

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'PLN', 'UAH'].map((v) => ({ value: v, label: v }));
export const LANGUAGES = ['English', 'Deutsch', 'Español', 'Français', 'Polski', 'Українська'].map((v) => ({ value: v, label: v }));

const kept = (key, fallback) => { try { return localStorage.getItem(`baseui-overgear-${key}`) || fallback; } catch { return fallback; } };
const keep = (key, v) => { try { localStorage.setItem(`baseui-overgear-${key}`, v); } catch { /* storage unavailable */ } };
const listeners = new Set();
const state = { currency: kept('currency', 'USD'), language: kept('language', 'English') };
const set = (kind, v) => { state[kind] = v; keep(kind, v); listeners.forEach((f) => f()); };

/** The two preferences, a way to open the sheet of one of them, and the sheets themselves (render `sheets` once next to the control). */
export function usePrefs() {
  const [, tick] = useState(0);
  const [sheet, setSheet] = useState(null);
  useEffect(() => {
    const f = () => tick((n) => n + 1);
    listeners.add(f);
    return () => listeners.delete(f);
  }, []);
  const close = (o) => { if (!o) setSheet(null); };
  const sheets = (
    <>
      <ChoiceSheet open={sheet === 'currency'} title="Currency" options={CURRENCIES} value={state.currency} commitOnSelect action="close" onCommit={(v) => { set('currency', v); setSheet(null); }} onOpenChange={close} />
      <ChoiceSheet open={sheet === 'language'} title="Language" options={LANGUAGES} value={state.language} commitOnSelect action="close" onCommit={(v) => { set('language', v); setSheet(null); }} onOpenChange={close} />
    </>
  );
  return { currency: state.currency, language: state.language, open: setSheet, sheets };
}
