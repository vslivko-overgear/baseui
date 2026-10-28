// Single access point for React and shared helpers of baseui components.
import * as ReactModule from 'react';

// react comes from the page: an import map in the documentation site, node_modules in an application (never a second copy)
export const React = ReactModule.default && ReactModule.default.createElement ? ReactModule.default : ReactModule;
export const h = React.createElement;
export const {
  Fragment, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
} = React;

/** Join class names: cx('a', cond && 'b') */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/**
 * Controlled / uncontrolled state: value + defaultValue + onChange.
 * Convention for all baseui components: `value`, `defaultValue`, `onValueChange`.
 */
export function useControllable(value, defaultValue, onChange) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback((next) => {
    if (!controlled) setInner(next);
    if (onChange) onChange(next);
  }, [controlled, onChange]);
  return [current, set];
}
