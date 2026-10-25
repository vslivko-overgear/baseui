import { h, cx, useState, useRef, useEffect, useLayoutEffect, useCallback, useControllable } from '../react.js';
import { CompiledOtpInput } from '../base.js';
import { describe } from '../doc.js';
import { useMotion } from '../theme-flags.js';

// The characters each validationType lets in (the same as Base UI filters with).
const KEY = { numeric: /^\d$/, alpha: /^[a-z]$/i, alphanumeric: /^[a-z0-9]$/i, none: /^.$/s };
const EDITABLE = 'input, textarea, select, [role="textbox"], [role="combobox"], [role="spinbutton"]';
// iOS paints selection handles above the cells: after the code is complete the field loses focus and does not take it back by itself.
const isIOS = () => typeof CSS !== 'undefined' && CSS.supports('-webkit-touch-callout', 'none');

/**
 * A one-time code field: the Base UI OTP cells plus the states a verification needs (verifying, error, success), motion that follows the
 * Animations setting, groups with a separator, a live region for screen readers and typing from anywhere on the page.
 */
export function OtpInput({
  length = 6, groups, value, defaultValue = '', onValueChange, onComplete, status, autoReset = true, captureTyping = false, motion,
  error, errorText = 'Invalid code', verifyingText = 'Verifying your code…', successText = 'Code verified',
  validationType = 'numeric', disabled = false, className, ...rest
}) {
  const level = useMotion(motion);
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const [phase, setPhase] = useState('idle');
  const [shake, setShake] = useState(false);
  const [marks, setMarks] = useState({ ring: null, seps: [] });
  const root = useRef(null);
  const state = status ?? phase;
  const locked = state === 'verifying';
  const size = length === 4 || length === 5 ? length : 6;
  const visibleError = error ?? (state === 'error' ? errorText : undefined);

  const cells = useCallback(() => [...(root.current?.querySelectorAll('[data-slot="otp-cell"]') ?? [])], []);
  const focusCell = useCallback((i) => { const c = cells(); const el = c[Math.max(0, Math.min(i, c.length - 1))]; el?.focus({ preventScroll: true }); el?.select?.(); }, [cells]);

  // too long a value after the length changed
  useEffect(() => { if (code.length > size) setCode(code.slice(0, size)); }, [size]);

  const doShake = useCallback(() => { if (level === 'enhanced') setShake(true); }, [level]);
  useEffect(() => { if (state === 'error') doShake(); }, [state]);
  useEffect(() => {
    if (!shake) return undefined;
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [shake]);

  // the filled cells (the digit animation starts when a cell becomes filled)
  useLayoutEffect(() => { cells().forEach((el, i) => el.toggleAttribute('data-filled', !!code[i])); }, [code, size, cells]);

  // verification: onComplete may return a promise; false or a rejection is an error, anything else is a success
  const complete = useCallback((next) => {
    if (!onComplete) return;
    setPhase('verifying');
    if (isIOS()) document.activeElement?.blur?.();
    const done = (ok) => {
      setPhase(ok ? 'success' : 'error');
      if (!ok && autoReset) {
        setCode('');
        if (!isIOS()) requestAnimationFrame(() => focusCell(0));
      }
    };
    Promise.resolve().then(() => onComplete(next)).then((r) => done(r !== false), () => done(false));
  }, [onComplete, autoReset, setCode, focusCell]);

  const change = (next) => {
    if (locked) return;
    setCode(next);
    if (phase !== 'idle') setPhase('idle');
  };

  // a key the field does not accept shakes the row instead of being ignored
  const onKeyDown = (e) => {
    rest.onKeyDown?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    if (!(KEY[validationType] || KEY.none).test(e.key)) doShake();
  };

  // typing from anywhere on the page goes into the field (never into another editable control)
  useEffect(() => {
    if (!captureTyping || disabled) return undefined;
    const re = KEY[validationType] || KEY.none;
    const onDoc = (e) => {
      if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || !re.test(e.key) || locked) return;
      if (root.current?.contains(document.activeElement) && document.activeElement?.matches?.('[data-slot="otp-cell"]')) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || t.closest(EDITABLE))) return;
      e.preventDefault();
      if (code.length >= size) return;
      const next = code + e.key;
      change(next);
      requestAnimationFrame(() => focusCell(next.length));
      if (next.length === size) complete(next);
    };
    document.addEventListener('keydown', onDoc);
    return () => document.removeEventListener('keydown', onDoc);
  }, [captureTyping, disabled, validationType, locked, code, size, complete, focusCell]);

  // the focus ring is one element that slides to the active cell; the separators sit in the gaps between groups
  const measure = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    const list = cells();
    const active = list.find((c) => c === document.activeElement);
    const rel = (r) => ({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height });
    const ring = active ? { ...rel(active.getBoundingClientRect()), r: getComputedStyle(active).borderTopLeftRadius } : null;
    const seps = list.filter((c) => c.hasAttribute('data-group-start')).map((c) => {
      const prev = list[+c.dataset.index - 1].getBoundingClientRect(); const cur = c.getBoundingClientRect();
      return { x: (prev.right + cur.left) / 2 - box.left, y: cur.top - box.top + cur.height / 2 };
    });
    setMarks({ ring, seps });
  }, [cells]);
  useLayoutEffect(() => { measure(); }, [code, size, groups, state, measure]);
  useEffect(() => {
    const el = root.current;
    const on = () => requestAnimationFrame(measure);
    el.addEventListener('focusin', on); el.addEventListener('focusout', on);
    const ro = new ResizeObserver(on); ro.observe(el);
    return () => { el.removeEventListener('focusin', on); el.removeEventListener('focusout', on); ro.disconnect(); };
  }, [measure]);

  const ring = level !== 'off' && !locked && marks.ring;
  const message = state === 'verifying' ? verifyingText : state === 'success' ? successText : state === 'error' ? (typeof visibleError === 'string' ? visibleError : errorText) : '';
  return h('div', {
    ref: root, 'data-slot': 'otp-field', className: cx('bui-otp', className), 'data-status': state, 'data-motion-level': level,
    'data-shake': shake || undefined, 'data-slide': ring ? '' : undefined, 'aria-busy': locked || undefined, onKeyDown,
  },
  h(CompiledOtpInput, {
    ...rest, onKeyDown: undefined, length: size, groups, value: code, onValueChange: change, onValueComplete: (v) => { rest.onValueComplete?.(v); complete(v); },
    validationType, disabled, readOnly: locked || rest.readOnly, error: visibleError,
  }),
  ring && h('span', { 'data-slot': 'otp-ring', 'aria-hidden': 'true', className: 'bui-otp__ring', style: { transform: `translate(${marks.ring.x}px, ${marks.ring.y}px)`, width: marks.ring.w, height: marks.ring.h, borderRadius: marks.ring.r } }),
  marks.seps.map((s, i) => h('span', { key: i, 'data-slot': 'otp-separator', 'aria-hidden': 'true', className: 'bui-otp__separator', style: { left: s.x, top: s.y } })),
  h('span', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', className: 'bui-visually-hidden' }, message));
}

describe(OtpInput, 'A one-time code field. It checks the code through onComplete and shows the states of that check: verifying, error (the row shakes) and success. Digits arrive with a short animation and the focus ring slides between the cells; both follow the Animations setting.', {
  length: ["4 | 5 | 6", '6', 'Number of cells'],
  groups: ['number[]', null, 'Sizes of the groups the cells are split into, for example [3, 3]; a gap and a separator open between groups'],
  value: ['string', null, 'The code (controlled)'],
  defaultValue: ['string', "''", 'Initial code (uncontrolled)'],
  onValueChange: ['(value: string) => void', null, 'Called on every change; ignored while the code is being verified'],
  onComplete: ['(code: string) => void | boolean | Promise<boolean | void>', null, 'Called when every cell is filled. A promise puts the field in the verifying state until it settles; false or a rejection is an error, anything else a success'],
  status: ["'idle' | 'verifying' | 'error' | 'success'", null, 'Sets the state from outside; by default it follows onComplete'],
  autoReset: ['boolean', 'true', 'Clear the cells after an error and put the cursor in the first one'],
  captureTyping: ['boolean', 'false', 'Typing a character anywhere on the page goes into the field, unless focus is in another editable control'],
  validationType: ["'numeric' | 'alpha' | 'alphanumeric' | 'none'", "'numeric'", 'Characters the cells accept; any other key shakes the row'],
  mask: ['boolean', 'false', 'Hide the typed characters'],
  error: ['ReactNode', null, 'Error text under the cells; marks all cells invalid. With status error and no text, errorText is shown'],
  errorText: ['string', "'Invalid code'", 'Text of the error state when error is not given'],
  verifyingText: ['string', "'Verifying your code…'", 'Announced to screen readers while verifying'],
  successText: ['string', "'Code verified'", 'Announced to screen readers after a success'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'The ring slides and the cells pulse while verifying unless off; the digits arrive and the row shakes on enhanced'],
  disabled: ['boolean', 'false', 'Disabled state'],
});
