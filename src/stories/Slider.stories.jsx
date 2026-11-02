import { Slider } from '../components/Slider.jsx';
import { meta, playground, example, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Slider',
  component: Slider,
  args: { defaultValue: 40, min: 0, max: 100, step: 5, label: 'Volume', showValue: true, range: false, disabled: false },
  argTypes: {
    label: { control: 'text' },
    step: { control: 'inline-radio', options: [1, 5, 10] },
    showValue: { control: 'boolean' },
    range: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<Slider label="Volume" defaultValue={40} step={5} showValue />` }),
  // the value of one thumb is a number, of two a pair: switching `range` in the controls swaps the default
  render: ({ range, defaultValue, ...args }) => W(360, <Slider key={String(range)} range={range} defaultValue={range ? [20, 70] : defaultValue} {...args} />),
};
export const Range = example({
  name: 'Range',
  render: () => W(360, <Slider range label="Price" defaultValue={[20, 70]} step={5} showValue />),
  source: `<Slider range label="Price" defaultValue={[20, 70]} step={5} showValue />`,
});
export const MinimumGap = example({
  name: 'Range With Minimum Gap',
  render: () => W(360, <Slider range label="Dates" defaultValue={[10, 40]} minStepsBetweenValues={10} showValue />),
  source: `<Slider range defaultValue={[10, 40]} minStepsBetweenValues={10} />`,
});
export const RangeDisabled = example({
  name: 'Range Disabled',
  render: () => W(360, <Slider range label="Price" defaultValue={[30, 60]} disabled showValue />),
  source: `<Slider range defaultValue={[30, 60]} disabled />`,
});
export const __namedExportsOrder = ['Playground', 'Range', 'MinimumGap', 'RangeDisabled'];
