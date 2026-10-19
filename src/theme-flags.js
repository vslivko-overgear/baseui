// The theme settings that components follow: data-motion, data-floating and data-glass on <html>.
import { useState, useEffect } from './react.js';


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

/** off | basic | enhanced of the nearest element that sets data-motion (the page by default); basic when nothing sets it. */
export const motionOf = (el) => el?.closest?.('[data-motion]')?.dataset.motion || 'basic';
/** The class that forces glass on or off for one component; nothing follows the theme. */
export const glassClass = (glass) => (glass === true ? 'bui-glass' : glass === false ? 'bui-glass-off' : undefined);
