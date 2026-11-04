import { useRef, useState } from './react.js';

/**
 * The errors of the fields of a form, shown the way a person expects: nothing is red while they fill the form; Submit shows the errors of the fields that are wrong;
 * an error goes the moment its field is focused again or its value changes, and comes back with the next Submit if the field is still wrong.
 *
 * `errors` is `{ [name]: text }` (an empty text or nothing: the field is right), computed from the values on every render, so it is always current.
 *
 *   const errors = passwordErrors(values);
 *   const form = useFieldErrors(errors);
 *   <form onSubmit={(e) => { e.preventDefault(); form.reveal(); if (!valid) return; … form.reset(); }}>
 *     <TextInput label="New password" value={v} {...form.field('next', { caption: 'At least 8 characters', onChange: set('next') })} />
 *
 * `field(name, { caption, onChange })` gives a TextInput (or any field that takes them) the `status`, the `caption` (the error while it is shown, otherwise `caption`),
 * an `onFocus` and an `onChange` that hide the error (and call yours). `shown(name)` says whether the error of a field is on screen.
 * A form that moves the focus to the wrong field itself, right after `reveal()`, keeps that field's error: the focus that `reveal()` causes does not hide it, the next one does.
 */
/** @param {Record<string, string>} [errors] */
export function useFieldErrors(errors = {}) {
  const [on, setOn] = useState(() => new Set());
  const revealing = useRef(false);
  const hide = (name) => setOn((set) => (set.has(name) ? new Set([...set].filter((n) => n !== name)) : set));
  const shown = (name) => on.has(name) && !!errors[name];
  return {
    /** Show the errors of the fields that are wrong now (call it on Submit). */
    reveal: () => { revealing.current = true; setTimeout(() => { revealing.current = false; }, 0); setOn(new Set(Object.keys(errors).filter((name) => errors[name]))); },
    /** Hide every error (the form was sent, or reset). */
    reset: () => setOn(new Set()),
    shown,
    /** The props of a field: status and caption by whether its error is shown, and the handlers that hide the error. */
    field: (name, /** @type {{ caption?: any, onChange?: (e: any) => void, onFocus?: (e: any) => void }} */ { caption, onChange, onFocus } = {}) => ({
      status: shown(name) ? 'error' : undefined,
      caption: shown(name) ? errors[name] : caption,
      onFocus: (e) => { if (!revealing.current) hide(name); onFocus?.(e); },
      onChange: (e) => { hide(name); onChange?.(e); },
    }),
  };
}
