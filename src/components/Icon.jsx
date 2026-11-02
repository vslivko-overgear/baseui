import { describe } from '../doc.js';
import * as line from '../../lib/line-HpXc8B8J.js';
import * as solid from '../../lib/solid-BKvSM0yD.js';
import { useIconWeight, DEFAULT_STROKE, MIN_STROKE, MAX_STROKE } from '../icon-weight.js';

export const ICON_NAMES = Object.keys(line).filter((k) => typeof line[k] === 'function');

/**
 * An icon of the catalog by name. The outline icon has the standard stroke (2) everywhere. With weight="auto" the stroke follows the text
 * beside it (see src/icon-weight.js); a text too bold for the thickest stroke gets the filled icon.
 */
export function Icon({ name, size = 24, weight = DEFAULT_STROKE, filled, ...rest }) {
  const auto = String(weight) === 'auto';
  const [ref, w] = useIconWeight(auto && filled === undefined, size);
  const solidNow = filled ?? (auto && w.filled);
  const stroke = auto ? w.stroke : Math.max(MIN_STROKE, Math.min(MAX_STROKE, Number(weight) || DEFAULT_STROKE));
  const Component = (solidNow ? solid : line)[name];
  if (!Component) return null;
  // the catalog icons are plain function components, so a wrapper without a box of its own carries the ref
  return (
    <span ref={ref} data-slot="icon" data-filled={solidNow || undefined} style={{ display: 'contents' }}>
      <Component size={size} {...(solidNow ? {} : { strokeWidth: stroke })} {...rest} />
    </span>
  );
}
describe(Icon, 'An icon of the catalog. The outline icon has the standard stroke everywhere; `weight="auto"` makes it follow the text it stands next to', {
  name: ['string', null, 'Name in the catalog, for example `Star01`'],
  size: ['number', '24', 'Size in px'],
  weight: [
    "'auto' | number",
    `${DEFAULT_STROKE}`,
    `Stroke width from ${MIN_STROKE} to ${MAX_STROKE}; the standard one (${DEFAULT_STROKE}) by default. auto matches the weight of the text beside the icon, and is off unless you ask for it`,
  ],
  filled: ['boolean', null, 'Force the filled (true) or the outline (false) icon; by default the outline one (with weight auto, the text decides)'],
});
