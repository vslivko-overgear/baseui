import { h, useState, Fragment } from '../../react.js';
import { MultiRangeSlider } from '../molecules/MultiRangeSlider.js';
import { NumberInput } from '../../components/NumberInput.js';
import { meta, playground, example, W } from '../../stories/_helpers.js';

const usd = (n) => `$${n}`;

export default meta({
  title: 'Overgear/Molecules/MultiRangeSlider', component: MultiRangeSlider,
  args: { defaultValue: [20, 180], min: 0, max: 500, step: 10, label: 'Price', showValue: true, showMinMaxLabels: true, lockStartPosition: false, disabled: false },
  argTypes: { label: { control: 'text' }, min: { control: 'number' }, max: { control: 'number' }, step: { control: 'inline-radio', options: [1, 5, 10, 50] }, showValue: { control: 'boolean' }, showMinMaxLabels: { control: 'boolean' }, lockStartPosition: { control: 'boolean' }, disabled: { control: 'boolean' }, hideRange: { control: 'boolean' }, value: { control: false }, defaultValue: { control: false }, formatValue: { control: false } },
});
export const Playground = { ...playground({ source: `<MultiRangeSlider label="Price" min={0} max={500} step={10} defaultValue={[20, 180]} formatValue={(n) => '$' + n} showValue showMinMaxLabels />` }), render: (args) => W(360, h(MultiRangeSlider, { ...args, formatValue: usd })) };
const Controlled = () => {
  const [range, setRange] = useState([50, 250]);
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    h(MultiRangeSlider, { label: 'Price per item', min: 0, max: 500, step: 5, value: range, onValueChange: setRange, formatValue: usd, showValue: true, showMinMaxLabels: true }),
    h('div', { style: { display: 'flex', gap: 'var(--baseui-spacing-12)' } },
      h(NumberInput, { label: 'From', value: range[0], min: 0, max: range[1] - 5, step: 5, onValueChange: (v) => v != null && setRange([v, range[1]]) }),
      h(NumberInput, { label: 'To', value: range[1], min: range[0] + 5, max: 500, step: 5, onValueChange: (v) => v != null && setRange([range[0], v]) })));
};
export const WithInputs = example({ name: 'Controlled With Inputs', description: 'The value is shared with two inputs; typing moves the thumbs and dragging updates the inputs.', render: () => W(360, h(Controlled)), source: `const [range, setRange] = useState([50, 250]);\n<MultiRangeSlider value={range} onValueChange={setRange} />` });
export const Labels = example({ name: 'Min and Max Labels', description: 'Formatted limits under the track, for example a price in dollars and a level range.', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-24)' } },
  h(MultiRangeSlider, { label: 'Price', defaultValue: [10, 90], min: 0, max: 100, showMinMaxLabels: true, formatValue: usd, maxLabel: '$100+' }),
  h(MultiRangeSlider, { label: 'Character level', defaultValue: [30, 60], min: 1, max: 80, showMinMaxLabels: true, showValue: true }))), source: `<MultiRangeSlider showMinMaxLabels maxLabel="$100+" … />` });
export const LockedStart = example({ name: 'Locked Start', description: 'Only the end thumb moves: "up to" filters.', render: () => W(360, h(MultiRangeSlider, { label: 'Up to', defaultValue: [0, 200], min: 0, max: 500, step: 10, lockStartPosition: true, formatValue: usd, showValue: true, showMinMaxLabels: true })), source: `<MultiRangeSlider lockStartPosition defaultValue={[0, 200]} />` });
export const Disabled = example({ name: 'Disabled', render: () => W(360, h(MultiRangeSlider, { label: 'Price', defaultValue: [100, 300], min: 0, max: 500, disabled: true, formatValue: usd, showValue: true })), source: `<MultiRangeSlider disabled … />` });
export const __namedExportsOrder = ['Playground', 'WithInputs', 'Labels', 'LockedStart', 'Disabled'];
