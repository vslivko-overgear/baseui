// The compiled baseui components (lib/), exposed by name for use in composite components and docs.
// A component is taken from its own stories' metadata, so we do not depend on names inside the bundle.
const component = async (file) => (await import(`../lib/${file}`)).default.component;

export const [Button, TextField, Checkbox, CheckboxGroup, Switch, Chip, Select, Modal, Radio, RadioGroup, List, ListItem, ChipGroup] = await Promise.all([
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
]);
