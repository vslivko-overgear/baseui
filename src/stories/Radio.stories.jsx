import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '../components/Radio.jsx';
import { meta, example, Row, Stack } from './_helpers.jsx';

export default meta({ title: 'Components/Radio', component: Radio, args: { value: '_' } });
const one = (props, group) => (
  <BaseRadioGroup {...group}>
    <Radio value={props.checked ? 'on' : 'off'} {...props} />
  </BaseRadioGroup>
);
export const States = example({
  name: 'States',
  description: 'States: unchecked, checked, disabled, disabled and checked. A Radio is checked by the value of its group',
  render: () => (
    <Row>
      <BaseRadioGroup>
        <Radio value="off" aria-label="unchecked" />
      </BaseRadioGroup>
      <BaseRadioGroup defaultValue="on">
        <Radio value="on" aria-label="checked" />
      </BaseRadioGroup>
      <BaseRadioGroup>
        <Radio value="off" disabled aria-label="disabled" />
      </BaseRadioGroup>
      <BaseRadioGroup defaultValue="on">
        <Radio value="on" disabled aria-label="disabled and checked" />
      </BaseRadioGroup>
    </Row>
  ),
  source: `<RadioGroup defaultValue="on"><Radio value="on" aria-label="checked" /></RadioGroup>`,
});
export const WithLabel = example({
  name: 'With Label',
  description: 'With and without a label',
  render: () => (
    <BaseRadioGroup defaultValue="a" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-3)' }}>
      <Radio value="a" label="With a label" />
      <Radio value="b" aria-label="no label" />
    </BaseRadioGroup>
  ),
  source: `<Radio value="a" label="With a label" />`,
});
export const __namedExportsOrder = ['States', 'WithLabel'];
