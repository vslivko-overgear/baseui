// The compiled baseui components (lib/), exposed by name for use in composite components and docs.
// A component is taken from its own stories' metadata, so we do not depend on names inside the bundle.
import { h, cx } from './react.js';
import { useRootAttr } from './theme-flags.js';

const component = async (file) => (await import(`../lib/${file}`)).default.component;

export const [Button, TextField, Checkbox, CheckboxGroup, Switch, Chip, Select, CompiledModal, Radio, RadioGroup, BaseList, BaseListItem, ChipGroup, BaseRating] = await Promise.all([
  component('Button.stories-BIZ8i_Er.js'),
  component('TextField.stories-JboKGoC9.js'),
  component('Checkbox.stories-CjVZ5VOE.js'),
  component('CheckboxGroup.stories-DyCBCBrP.js'),
  component('Switch.stories-UfYPEzH7.js'),
  component('Chip.stories-BFj78RSq.js'),
  component('Select.stories-vOU6jfFc.js'),
  component('Modal.stories-BG7Qmigd.js'),
  component('Radio.stories-ByX4his4.js'),
  component('RadioGroup.stories-DVXazEy6.js'),
  component('List.stories-Alo3K1f2.js'),
  component('ListItem.stories-Dq00OmrP.js'),
  component('ChipGroup.stories-DmXtmuTG.js'),
  component('Rating.stories-B5Vm-Sbj.js'),
]);

/**
 * The dialog of the design system: the compiled Modal with the `floating` option.
 * On a small screen the sheet then floats: margins at the bottom and the sides, rounded on every side.
 */
export function Modal({ floating, className, ...rest }) {
  const themeFloating = useRootAttr('floating') === 'on';
  return h(CompiledModal, { className: cx((floating ?? themeFloating) && 'bui-dialog--floating', className), ...rest });
}
Modal.displayName = 'Modal';
const compiledDoc = CompiledModal.__docgenInfo || { description: '', props: {} };
Modal.__docgenInfo = { ...compiledDoc, props: { ...compiledDoc.props, floating: {
  required: false, tsType: { name: 'boolean', raw: 'boolean' }, defaultValue: { value: 'theme', computed: false },
  description: 'A floating sheet on small screens: margins at the bottom and the sides, rounded on every side; by default it follows the Floating setting of the theme. On a wide screen the dialog already floats in the middle',
} } };
