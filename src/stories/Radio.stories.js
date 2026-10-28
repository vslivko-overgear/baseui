import { h } from '../react.js';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '../components/Radio.js';
import { meta, example, Row, Stack } from './_helpers.js';

export default meta({ title: 'Components/Radio', component: Radio, args: { value: '_' } });
const one = (props, group) => h(BaseRadioGroup, { ...group }, h(Radio, { value: props.checked ? 'on' : 'off', ...props }));
export const States = example({
  name: 'States', description: 'States: unchecked, checked, disabled, disabled and checked. A Radio is checked by the value of its group.',
  render: () => h(Row, null,
    h(BaseRadioGroup, null, h(Radio, { value: 'off', 'aria-label': 'unchecked' })),
    h(BaseRadioGroup, { defaultValue: 'on' }, h(Radio, { value: 'on', 'aria-label': 'checked' })),
    h(BaseRadioGroup, null, h(Radio, { value: 'off', disabled: true, 'aria-label': 'disabled' })),
    h(BaseRadioGroup, { defaultValue: 'on' }, h(Radio, { value: 'on', disabled: true, 'aria-label': 'disabled and checked' }))),
  source: `<RadioGroup defaultValue="on"><Radio value="on" aria-label="checked" /></RadioGroup>`,
});
export const WithLabel = example({
  name: 'With Label', description: 'With and without a label.',
  render: () => h(BaseRadioGroup, { defaultValue: 'a', style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-12)' } }, h(Radio, { value: 'a', label: 'With a label' }), h(Radio, { value: 'b', 'aria-label': 'no label' })),
  source: `<Radio value="a" label="With a label" />`,
});
export const __namedExportsOrder = ['States', 'WithLabel'];
