import { h } from '../../react.js';
import { StepProgressBar } from '../molecules/StepProgressBar.js';
import { meta, playground, example, Stack } from '../../stories/_helpers.js';

const THREE = [{ min: 0, max: 100 }, { min: 100, max: 300 }, { min: 300, max: 600 }];
const FIVE = [0, 1, 2, 3, 4].map((i) => ({ min: i * 20, max: (i + 1) * 20 }));
const box = (c) => h('div', { style: { width: 360, maxWidth: '100%' } }, c);
export default meta({
  title: 'Overgear/Molecules/StepProgressBar', component: StepProgressBar, args: { value: 180, bars: THREE, label: 'Boost progress' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 600, step: 10 } }, bars: { control: 'object' }, label: { control: 'text' } },
});
export const Playground = { ...playground({ source: `<StepProgressBar value={180} bars={[{ min: 0, max: 100 }, { min: 100, max: 300 }, { min: 300, max: 600 }]} />` }), render: (args) => box(h(StepProgressBar, args)) };
export const Stages = example({
  name: 'Stages', description: 'Each segment fills on its own as the value moves through its range.',
  render: () => box(h(Stack, null, [0, 100, 180, 450, 600].map((v) => h('div', { key: v }, h('div', { style: { font: 'var(--baseui-Typography-Text-12-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)', marginBottom: 4 } }, `value ${v}`), h(StepProgressBar, { value: v, bars: THREE }))))),
  source: `<StepProgressBar value={450} bars={bars} />`,
});
export const EqualSteps = example({
  name: 'Equal Steps', render: () => box(h(StepProgressBar, { value: 50, bars: FIVE, label: 'Order steps' })),
  source: `<StepProgressBar value={50} bars={fiveEqualBars} />`,
});
export const SingleBar = example({
  name: 'Single Bar', render: () => box(h(StepProgressBar, { value: 35, bars: [{ min: 0, max: 100 }] })),
  source: `<StepProgressBar value={35} bars={[{ min: 0, max: 100 }]} />`,
});
export const __namedExportsOrder = ['Playground', 'Stages', 'EqualSteps', 'SingleBar'];
