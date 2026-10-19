// The theme settings that components follow: data-motion, data-floating and data-glass on <html>.
import { useState, useEffect } from './react.js';

/** off | basic | enhanced; enhanced when the page sets nothing. */
export const motionLevel = () => document.documentElement.dataset.motion || 'enhanced';

/** The value of a data attribute of <html>, kept up to date when the theme changes. */
export function useRootAttr(name) {
  const read = () => document.documentElement.getAttribute(`data-${name}`);
  const [value, setValue] = useState(read);
  useEffect(() => {
    const ob = new MutationObserver(() => setValue(read()));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: [`data-${name}`] });
    setValue(read());
    return () => ob.disconnect();
  }, [name]);
  return value;
}
