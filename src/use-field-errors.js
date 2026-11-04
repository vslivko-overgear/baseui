import { useRef, useState } from './react.js';

/**
 * The errors of the fields of a form, shown the way a person expects: nothing is red while they fill the form; Submit shows the errors of the fields that are wrong;
 * an error goes at the first character changed or typed in its field (focusing the field does not clear it), and comes back with the next Submit if the field is still wrong.
 *
 * `errors` is `{ [name]: text }` (an empty text or nothing: the field is right), computed from the values on every render, so it is always current.
 *
 *   const errors = passwordErrors(values);
 *   const form = useFieldErrors(errors);
 *   <form onSubmit={(e) => { e.preventDefault(); form.reveal(); if (!valid) return; … form.reset(); }}>
 *     <TextInput label="New password" value={v} {...form.field('next', { caption: 'At least 8 characters', onChange: set('next') })} />
 *
 * `field(name, { caption, onChange })` gives a TextInput (or any field that takes them) the `ref`, the `status`, the `caption` (the error while it is shown, otherwise `caption`)
 * and an `onChange` that hides the error (and calls yours). `shown(name)` says whether the error of a field is on screen.
 * `reveal()` also puts the focus on the first wrong field (in the order of the page), so the person can type at once and the keyboard of a phone is already there; its error stays
 * until the first character is typed.
 */
/** @param {Record<string, string>} [errors] */
export function useFieldErrors(errors = {}) {
  const [on, setOn] = useState(() => new Set());
  const nodes = useRef(new Map());   // the field elements by name (the `ref` that `field()` gives)
  const hide = (name) => setOn((set) => (set.has(name) ? new Set([...set].filter((n) => n !== name)) : set));
  const shown = (name) => on.has(name) && !!errors[name];
  return {
    /** Show the errors of the fields that are wrong now (call it on Submit). */
    reveal: () => {
      const wrong = Object.keys(errors).filter((name) => errors[name]);
      setOn(new Set(wrong));
      // the first wrong field in the order of the page gets the focus (without scrolling it under the bar: the browser brings it into view)
      const els = wrong.map((name) => nodes.current.get(name)).filter((el) => el && el.isConnected);
      els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      els[0]?.focus();
    },
    /** Hide every error (the form was sent, or reset). */
    reset: () => setOn(new Set()),
    shown,
    /** The props of a field: its `ref` (for the focus), status and caption by whether its error is shown, and the handler that hides the error. */
    field: (name, /** @type {{ caption?: any, onChange?: (e: any) => void }} */ { caption, onChange } = {}) => ({
      ref: (el) => { if (el) nodes.current.set(name, el); else nodes.current.delete(name); },
      status: shown(name) ? 'error' : undefined,
      caption: shown(name) ? errors[name] : caption,
      onChange: (e) => { hide(name); onChange?.(e); },
    }),
  };
}
