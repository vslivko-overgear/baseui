import { h } from '../react.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Slider } from '../components/Slider.js';

/** A progress bar and a slider: both take the brand color. */
export const Progress = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)', maxWidth: 360 } },
  h(ProgressBar, { value: 60, label: 'Uploading', showValue: true }),
  h(Slider, { defaultValue: 40, label: 'Volume', showValue: true }));
