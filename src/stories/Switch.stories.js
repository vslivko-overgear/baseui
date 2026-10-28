import { h } from '../react.js';
import { Switch } from '../components/Switch.js';
import { meta, playground, example, Row, Stack } from './_helpers.js';

export default meta({
  title: 'Components/Switch', component: Switch, args: { label: 'Label', size: 'md', shape: 'theme', defaultChecked: false, disabled: false, error: '' },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['theme', 'rounded', 'circle'], mapping: { theme: undefined } },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
});
export const Playground = playground({ source: '{}' });
export const States = example({
  name: 'States', render: () => h(Stack, null,
    h(Row, null, ['md', 'sm', 'lg'].map((s) => h(Row, { key: s }, h(Switch, { size: s, 'aria-label': `${s} off` }), h(Switch, { size: s, defaultChecked: true, 'aria-label': `${s} on` }), h(Switch, { size: s, disabled: true, 'aria-label': `${s} disabled` }), h(Switch, { size: s, disabled: true, defaultChecked: true, 'aria-label': `${s} disabled on` })))),
  ),
  source: `<Switch aria-label="Notifications" defaultChecked />`,
});
export const WithLabel = example({
  name: 'With Label', render: () => h(Stack, { gap: 'var(--baseui-spacing-12)' }, h(Switch, { label: 'Small label', size: 'sm', defaultChecked: true }), h(Switch, { label: 'Medium label', defaultChecked: true }), h(Switch, { label: 'Large label', size: 'lg', defaultChecked: true })),
  source: `<Switch label="Notifications" />`,
});
export const WithError = example({
  name: 'With Error', render: () => h(Switch, { label: 'I accept the terms', error: 'Accept the terms to continue' }),
  source: `<Switch label="I accept the terms" error="Accept the terms to continue" />`,
});
export const __namedExportsOrder = ['Playground', 'States', 'WithLabel', 'WithError'];
