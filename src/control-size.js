// The size of the controls of one row (rule D15). A `ControlRow` gives its controls one tier, and a control that has no `size` of its own takes it:
// a Button or an IconButton takes the tier as it is (xsm 32 · sm 40 · md 48 · lg 56); a field (TextField, Select, Autocomplete…) takes the field size of that height
// (the field sizes are 48 and 56, so only md and lg have a field). A size set on the control itself always wins.
import { createContext, useContext } from './react.js';

export const ControlSizeContext = createContext(/** @type {string | null} */ (null));
/** The tier of the row the control stands in, or null outside a ControlRow. */
export const useControlSize = () => useContext(ControlSizeContext);
/** The size of a field of a tier: the 48px field is `sm`, the 56px field is `md`. */
export const FIELD_OF_TIER = { md: 'sm', lg: 'md' };
