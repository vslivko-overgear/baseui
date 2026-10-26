import { h } from '../react.js';
import { describe } from '../doc.js';
import { useIconWeight, DEFAULT_STROKE, MIN_STROKE, MAX_STROKE } from '../icon-weight.js';

const [line, solid] = await Promise.all([import('../../lib/line-HpXc8B8J.js'), import('../../lib/solid-BKvSM0yD.js')]);
export const ICON_NAMES = Object.keys(line).filter((k) => typeof line[k] === 'function');

/**
 * An icon of the catalog by name. With weight="auto" (the default) the stroke follows the text beside it
 * (see src/icon-weight.js); a text too bold for the thickest stroke gets the filled icon.
 */
export function Icon({ name, size = 24, weight = 'auto', filled, ...rest }) {
  const auto = weight === 'auto';
  const [ref, w] = useIconWeight(auto && filled === undefined, size);
  const solidNow = filled ?? (auto && w.filled);
  const stroke = auto ? w.stroke : Math.max(MIN_STROKE, Math.min(MAX_STROKE, Number(weight) || DEFAULT_STROKE));
  const Component = (solidNow ? solid : line)[name];
  if (!Component) return null;
  // the catalog icons are plain function components, so a wrapper without a box of its own carries the ref
  return h('span', { ref, 'data-slot': 'icon', 'data-filled': solidNow || undefined, style: { display: 'contents' } }, h(Component, { size, ...(solidNow ? {} : { strokeWidth: stroke }), ...rest }));
}
describe(Icon, 'An icon of the catalog. Its stroke follows the text it stands next to; a text that is bolder than the thickest stroke gets the filled icon.', {
  name: ['string', null, 'Name in the catalog, for example `Star01`'],
  size: ['number', '24', 'Size in px'],
  weight: ["'auto' | number", "'auto'", `Stroke width from ${MIN_STROKE} to ${MAX_STROKE}: a number sets it, auto matches the weight of the text beside the icon`],
  filled: ['boolean', null, 'Force the filled (true) or the outline (false) icon; by default auto chooses'],
});
