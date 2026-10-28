import { RadioGroup } from '../components/RadioGroup.js';
import { meta, playground } from './_helpers.js';

export default meta({
  title: 'Components/RadioGroup', component: RadioGroup,
  args: { title: 'Payment method', options: [{ value: 'card', label: 'Bank card' }, { value: 'transfer', label: 'Instant bank transfer' }, { value: 'crypto', label: 'Cryptocurrency' }, { value: 'balance', label: 'Account balance' }], defaultValue: 'card', size: 'md', caption: '', error: '' },
  argTypes: { title: { control: 'text' }, defaultValue: { control: 'text' }, size: { control: 'inline-radio', options: ['sm', 'md'] }, caption: { control: 'text' }, error: { control: 'text' } },
});
const src = (s) => ({ docs: { source: { originalSource: s } } });
export const Playground = playground({ source: '{}' });
export const States = { name: 'States', args: { title: undefined, defaultValue: 'checked', options: [{ value: 'unchecked', label: 'Not selected' }, { value: 'checked', label: 'Selected' }, { value: 'disabled', label: 'Disabled', disabled: true }] }, parameters: { docs: { description: { story: 'Circle states: unchecked, checked, disabled.' }, ...src(`<RadioGroup options={options} defaultValue="checked" />`).docs } } };
export const Locked = { name: 'Locked', args: { title: undefined, defaultValue: 'saved', options: [{ value: 'saved', label: 'Saved choice', disabled: true }, { value: 'other', label: 'Another option', disabled: true }] }, parameters: { docs: { description: { story: 'A disabled selected value: locked, with the value kept.' }, ...src(`<RadioGroup options={options} defaultValue="saved" disabled />`).docs } } };
export const WithCaption = { name: 'With Caption', args: { caption: 'The fee depends on the method' }, parameters: { docs: { description: { story: 'A caption under the group.' }, ...src(`<RadioGroup title="Payment" options={options} caption="The fee depends on the method" />`).docs } } };
export const WithError = { name: 'With Error', args: { defaultValue: undefined, error: 'Choose a payment method' }, parameters: { docs: { description: { story: 'A validation error: a message under the group, the circles stay neutral.' }, ...src(`<RadioGroup title="Payment" options={options} error="Choose a payment method" />`).docs } } };
export const __namedExportsOrder = ['Playground', 'States', 'Locked', 'WithCaption', 'WithError'];
