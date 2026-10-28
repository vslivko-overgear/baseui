import { h } from '../react.js';
import { Checkbox } from '../components/Checkbox.js';
import { meta, playground, example, Row, Stack } from './_helpers.js';

export default meta({
  title: 'Components/Checkbox', component: Checkbox, args: { label: 'Label', size: 'md', motion: 'theme', defaultChecked: false, disabled: false, indeterminate: false, error: '' },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    defaultChecked: { control: 'boolean' }, disabled: { control: 'boolean' }, indeterminate: { control: 'boolean' },
    error: { control: 'text' },
  },
});
export const Playground = playground({ source: '{}' });
export const States = example({
  name: 'States', description: 'Box states: unchecked, checked, indeterminate, disabled, disabled and checked.',
  render: () => h(Stack, null, ['md', 'sm'].map((s) => h(Row, { key: s }, h(Checkbox, { size: s, 'aria-label': 'unchecked' }), h(Checkbox, { size: s, defaultChecked: true, 'aria-label': 'checked' }), h(Checkbox, { size: s, indeterminate: true, 'aria-label': 'indeterminate' }), h(Checkbox, { size: s, disabled: true, 'aria-label': 'disabled' }), h(Checkbox, { size: s, disabled: true, defaultChecked: true, 'aria-label': 'disabled and checked' })))),
  source: `<Checkbox aria-label="Accept" defaultChecked />`,
});
export const WithLabel = example({
  name: 'With Label', description: 'With and without a label. For a group of checkboxes see Checkbox Group.',
  render: () => h(Stack, { gap: 'var(--baseui-spacing-12)' }, h(Checkbox, { label: 'With a label', defaultChecked: true }), h(Checkbox, { 'aria-label': 'no label' })),
  source: `<Checkbox label="I agree to the terms" />`,
});
export const WithError = example({
  name: 'With Error', description: 'The error is text under the field; the box has no outline.',
  render: () => h(Checkbox, { label: 'I agree to the terms', error: 'Required field' }),
  source: `<Checkbox label="I agree to the terms" error="Required field" />`,
});
export const __namedExportsOrder = ['Playground', 'States', 'WithLabel', 'WithError'];
