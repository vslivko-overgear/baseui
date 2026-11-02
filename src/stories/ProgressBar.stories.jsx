import { ProgressBar, PROGRESS_COLORS } from '../components/ProgressBar.jsx';
import { meta, playground, example, Stack, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Progress Bar',
  component: ProgressBar,
  args: { value: 60, size: 'md', color: 'brand', sections: 1, label: 'Uploading', showValue: true },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    color: { control: 'select', options: PROGRESS_COLORS },
    sections: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6, 7, 8] },
    label: { control: 'text' },
    showValue: { control: 'boolean' },
  },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(360, <ProgressBar {...args} />) };
export const Indeterminate = example({
  name: 'Indeterminate',
  render: () => (
    <Stack width={360}>
      <ProgressBar label="Processing…" />
      <ProgressBar size="sm" />
    </Stack>
  ),
  source: `<ProgressBar label="Processing…" />`,
});
export const Colors = example({
  name: 'Colors',
  render: () => (
    <Stack width={360} gap="var(--baseui-spacing-3)">
      {PROGRESS_COLORS.map((c) => (
        <ProgressBar key={c} color={c} value={65} label={c} showValue />
      ))}
    </Stack>
  ),
  source: `<ProgressBar color="success" value={65} />`,
});
export const Sections = example({
  name: 'Sections',
  render: () => (
    <Stack width={360} gap="var(--baseui-spacing-4)">
      <ProgressBar sections={3} value={50} label="Step 2 of 3" color="accent" />
      <ProgressBar sections={5} value={70} label="Password strength" color="success" />
      <ProgressBar sections={8} value={37} size="sm" label="Eight sections" />
    </Stack>
  ),
  source: `<ProgressBar sections={5} value={70} color="success" />`,
});
export const __namedExportsOrder = ['Playground', 'Indeterminate', 'Colors', 'Sections'];
