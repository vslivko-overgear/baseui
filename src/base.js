// The compiled baseui components (lib/), exposed by name for use in composite components and docs.
// A component is taken from its own stories' metadata, so we do not depend on names inside the bundle.
import { h, cx } from './react.js';
import { useFloating } from './theme-flags.js';
import { describeWrapper } from './doc.js';
import { n as initOtpField, OtpRoot, OtpCell } from '../lib/OtpInput-DVq9tE7o.js';

// The Base UI OTP field parts (root and cell) of the compiled bundle; the DS OtpInput is built from them directly.
initOtpField();
export { OtpRoot, OtpCell };

const component = async (file) => (await import(`../lib/${file}`)).default.component;

export const [Select, CompiledModal] = await Promise.all([
  component('Select.stories-vOU6jfFc.js'),
  component('Modal.stories-BG7Qmigd.js'),
]);

/**
 * The dialog of the design system: the compiled Modal with the `floating` option.
 * On a small screen the sheet then floats: margins at the bottom and the sides, rounded on every side.
 */
export function Modal({ floating, className, ...rest }) {
  return h(CompiledModal, { className: cx(useFloating(floating) && 'bui-dialog--floating', className), ...rest });
}
Modal.displayName = 'Modal';
describeWrapper(Modal, CompiledModal, {
  floating: ['boolean', 'theme', 'A floating sheet on small screens: margins at the bottom and the sides, rounded on every side; by default it follows the Floating setting of the theme. On a wide screen the dialog already floats in the middle'],
});

export { Button } from './components/Button.js';
export { TextField } from './components/TextField.js';
export { Switch } from './components/Switch.js';
export { Chip } from './components/Chip.js';
export { ChipGroup } from './components/ChipGroup.js';
export { Checkbox, CheckboxGroup, Radio, RadioGroup } from './components/Checks.js';
