import { h, cx, useId, useState, useRef, useEffect, useLayoutEffect, useCallback, useControllable } from '../react.js';
import { OtpRoot, OtpCell } from '../base.js';
import { describe } from '../doc.js';
import { useMotion } from '../theme-flags.js';

// The characters each validationType lets in.
const KEY = { numeric: /^\d$/, alpha: /^[a-z]$/i, alphanumeric: /^[a-z0-9]$/i, none: /^.$/s };
const EDITABLE = 'input, textarea, select, [role="textbox"], [role="combobox"], [role="spinbutton"]';
// How the cells split into groups when `grouped` is on.
const GROUPS = { 4: [2, 2], 5: [2, 3], 6: [3, 3] };
// iOS paints selection handles above the cells: after the code is complete the field loses focus and does not take it back by itself.
const isIOS = () => typeof CSS !== 'undefined' && CSS.supports('-webkit-touch-callout', 'none');

/**
 * A one-time code field built from the Base UI OTP field parts (Root and Input): Base UI moves the focus, filters and pastes the characters,
 * takes the autofill and joins a native form. The DS adds what a verification needs: onComplete with the states verifying, error and success,
 * groups, a live region, typing from anywhere on the page and motion that follows the Animations setting.
 */
export function OtpInput({
  length = 6, grouped = false, value, defaultValue = '', onValueChange, onComplete, status, autoReset = true, captureTyping = false, motion,
  label, error, errorText = 'Invalid code', verifyingText = 'Verifying your code…', successText = 'Code verified', name, mask = false,
  validationType = 'numeric', disabled = false, inputRef, className, 'aria-label': ariaLabel, ...rest
}) {
  const level = useMotion(motion);
  const uid = useId();
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const [phase, setPhase] = useState('idle');
  const [shake, setShake] = useState(false);
  const [ring, setRing] = useState(null);
  const root = useRef(null);
  const cellsEl = useRef(null);
  const cellRefs = useRef([]);
  const state = status ?? phase;
  const locked = state === 'verifying';
  const size = length === 4 || length === 5 ? length : 6;
  const re = KEY[validationType] || KEY.none;
  const visibleError = error ?? (state === 'error' ? errorText : undefined);
  const groups = grouped ? GROUPS[size] : [size];
  const starts = new Set(groups.reduce((acc, g) => [...acc, (acc.at(-1) ?? 0) + g], []).slice(0, -1));

  const pending = useRef(null);
  // focus moves after the render that holds the new code (a cell beyond the code hands the focus back)
  const queueFocus = (i) => { pending.current = i; };
  useLayoutEffect(() => {
    if (pending.current === null) return;
    const i = pending.current; pending.current = null;
    cellRefs.current[Math.max(0, Math.min(i, size - 1))]?.focus({ preventScroll: true });
  });
  const focusCell = useCallback((i) => { const el = cellRefs.current[Math.max(0, Math.min(i, size - 1))]; el?.focus({ preventScroll: true }); }, [size]);
  const doShake = useCallback(() => { if (level === 'enhanced') setShake(true); }, [level]);
  useEffect(() => { if (code.length > size) setCode(code.slice(0, size)); }, [size]);
  useEffect(() => {
    if (!shake) return undefined;
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [shake]);

  // verification: onComplete may return a promise; false or a rejection is an error, anything else is a success
  const complete = useCallback((next) => {
    if (!onComplete) return;
    setPhase('verifying');
    if (isIOS()) document.activeElement?.blur?.();
    Promise.resolve().then(() => onComplete(next)).then((r) => setPhase(r === false ? 'error' : 'success'), () => setPhase('error'));
  }, [onComplete]);

  // after an error the shake plays, the cells are cleared and the cursor goes back to the first one
  useEffect(() => {
    if (state !== 'error') return;
    doShake();
    if (autoReset && status === undefined) { setCode(''); if (!isIOS()) queueFocus(0); }
  }, [state]);

  const commit = (next) => {
    if (locked) return;
    setCode(next);
    if (phase !== 'idle') setPhase('idle');
  };
  // Base UI filters the characters; a key it would drop shakes the row instead of being ignored
  const onKeyDown = (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    if (!re.test(e.key)) doShake();
  };

  // typing from anywhere on the page goes into the field (never into another editable control)
  useEffect(() => {
    if (!captureTyping || disabled) return undefined;
    const onDoc = (e) => {
      if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || !re.test(e.key) || locked) return;
      if (cellRefs.current.includes(document.activeElement)) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || t.closest(EDITABLE))) return;
      e.preventDefault();
      if (code.length >= size) return;
      const next = code + e.key;
      commit(next);
      queueFocus(Math.min(next.length, size - 1));
      if (next.length === size) complete(next);
    };
    document.addEventListener('keydown', onDoc);
    return () => document.removeEventListener('keydown', onDoc);
  });

  // enhanced: the focus ring is one element that slides to the active cell (inside the row, so it shakes with it)
  const measure = useCallback(() => {
    const row = cellsEl.current;
    const active = cellRefs.current.find((c) => c === document.activeElement);
    if (!row || !active) { setRing(null); return; }
    const box = row.getBoundingClientRect(); const r = active.getBoundingClientRect();
    setRing({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height, r: getComputedStyle(active).borderTopLeftRadius });
  }, []);
  useLayoutEffect(() => { if (level === 'enhanced') measure(); }, [code, size, grouped, level, measure]);
  useEffect(() => {
    const el = root.current;
    if (!el || level !== 'enhanced') { setRing(null); return undefined; }
    const on = () => requestAnimationFrame(measure);
    el.addEventListener('focusin', on); el.addEventListener('focusout', on);
    const ro = new ResizeObserver(on); ro.observe(el);
    return () => { el.removeEventListener('focusin', on); el.removeEventListener('focusout', on); ro.disconnect(); };
  }, [level, measure]);

  const message = state === 'verifying' ? verifyingText : state === 'success' ? successText : state === 'error' ? (typeof visibleError === 'string' ? visibleError : errorText) : '';
  const errorId = `${uid}-error`;
  const cells = [];
  for (let i = 0; i < size; i++) {
    if (starts.has(i)) cells.push(h('span', { key: `s${i}`, 'data-slot': 'otp-separator', 'aria-hidden': 'true', className: 'bui-otp__separator' }));
    cells.push(h(OtpCell, {
      key: i, ref: (el) => { cellRefs.current[i] = el; if (i === 0 && inputRef) { typeof inputRef === 'function' ? inputRef(el) : (inputRef.current = el); } },
      'data-slot': 'otp-cell', 'data-index': i, 'data-filled': code[i] ? '' : undefined, style: { '--otp-i': i }, className: 'bui-otp__cell',
      'aria-label': `${label || ariaLabel || 'Code'}, ${i + 1} of ${size}`, 'aria-invalid': visibleError ? 'true' : undefined,
      'data-1p-ignore': true, 'data-lpignore': 'true', 'data-bwignore': true, 'data-form-type': 'other',
    }));
  }
  return h('div', {
    ref: root, 'data-slot': 'otp', className: cx('bui-otp', className), 'data-status': state, 'data-motion-level': level, 'data-shake': shake || undefined,
    'data-slide': ring ? '' : undefined, 'aria-busy': locked || undefined, ...rest,
  },
  label && h('span', { 'data-slot': 'otp-label', className: 'bui-otp__label' }, label),
  h(OtpRoot, {
    ref: cellsEl, 'data-slot': 'otp-cells', className: 'bui-otp__cells', 'aria-label': label || ariaLabel || 'Verification code', 'aria-describedby': visibleError ? errorId : undefined,
    length: size, value: code, onValueChange: commit, onValueComplete: (v) => complete(v), validationType, mask, disabled, readOnly: locked, name, onKeyDown,
  },
  cells,
  ring && h('span', { 'data-slot': 'otp-ring', 'aria-hidden': 'true', className: 'bui-otp__ring', style: { transform: `translate(${ring.x}px, ${ring.y}px)`, width: ring.w, height: ring.h, borderRadius: ring.r } })),
  visibleError && h('div', { id: errorId, 'data-slot': 'otp-error', className: 'bui-otp__error' }, visibleError),
  h('span', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', className: 'bui-visually-hidden' }, message));
}

describe(OtpInput, 'A one-time code field. It checks the code through onComplete and shows the states of that check: verifying, error (the row shakes) and success. On enhanced animations the digits arrive with a short animation and the focus ring slides between the cells.', {
  length: ["4 | 5 | 6", '6', 'Number of cells'],
  grouped: ['boolean', 'false', 'Split the cells into groups with a separator: 2 + 2, 2 + 3 or 3 + 3, depending on the length'],
  value: ['string', null, 'The code (controlled)'],
  defaultValue: ['string', "''", 'Initial code (uncontrolled)'],
  onValueChange: ['(value: string) => void', null, 'Called on every change; ignored while the code is being verified'],
  onComplete: ['(code: string) => void | boolean | Promise<boolean | void>', null, 'Called when every cell is filled. A promise puts the field in the verifying state until it settles; false or a rejection is an error, anything else a success'],
  status: ["'idle' | 'verifying' | 'error' | 'success'", null, 'Sets the state from outside; by default it follows onComplete'],
  autoReset: ['boolean', 'true', 'Clear the cells after an error and put the cursor in the first one'],
  captureTyping: ['boolean', 'false', 'Typing a character anywhere on the page goes into the field, unless focus is in another editable control'],
  validationType: ["'numeric' | 'alpha' | 'alphanumeric' | 'none'", "'numeric'", 'Characters the cells accept; any other key shakes the row (enhanced)'],
  mask: ['boolean', 'false', 'Hide the typed characters'],
  label: ['string', null, 'Text above the cells; also the accessible name of the group'],
  error: ['ReactNode', null, 'Error text under the cells; marks all cells invalid. With status error and no text, errorText is shown'],
  errorText: ['string', "'Invalid code'", 'Text of the error state when error is not given'],
  verifyingText: ['string', "'Verifying your code…'", 'Announced to screen readers while verifying'],
  successText: ['string', "'Code verified'", 'Announced to screen readers after a success'],
  name: ['string', null, 'Name for a native form: the code is sent as one value'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'The cells pulse while verifying unless off; on enhanced the digits arrive, the focus ring slides and the row shakes'],
  disabled: ['boolean', 'false', 'Disabled state'],
  inputRef: ['Ref<HTMLInputElement>', null, 'Ref to the first cell'],
});
