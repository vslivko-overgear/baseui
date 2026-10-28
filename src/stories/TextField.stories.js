import { h } from '../react.js';
import { TextField } from '../components/TextField.js';
import { InfoCircle, Heart } from './_ui.js';
import { meta, playground, example } from './_helpers.js';

const Col = ({ children }) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)', maxWidth: 360 } }, children);
const info = h('button', { type: 'button', className: 'bui-input__icon-button', 'aria-label': 'Info' }, h(InfoCircle, { size: 24 }));
export default meta({
  title: 'Components/TextField', component: TextField,
  args: { label: 'Label', variant: 'filled', size: 'md', floatingLabel: true, caption: '', disabled: false, loading: false, action: 'none', multiline: false },
  argTypes: {
    label: { control: 'text' }, variant: { control: 'inline-radio', options: ['filled', 'standard'] }, size: { control: 'inline-radio', options: ['md', 'sm'] },
    floatingLabel: { control: 'boolean' }, caption: { control: 'text' }, status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } },
    disabled: { control: 'boolean' }, loading: { control: 'boolean' }, action: { control: 'inline-radio', options: ['none', 'clear', 'info', 'custom'] }, multiline: { control: 'boolean' },
    minRows: { control: 'number', if: { arg: 'multiline', eq: true } }, maxRows: { control: 'number', if: { arg: 'multiline', eq: true } },
    prefix: { control: 'text' }, suffix: { control: 'text' },
  },
  render: (args) => h(TextField, { ...args, clearable: args.action === 'clear', actionLabel: args.action === 'clear' ? 'Clear' : undefined, action: args.action === 'info' ? info : args.action === 'custom' ? h('button', { type: 'button', className: 'bui-input__icon-button', 'aria-label': 'Custom action' }, h(Heart, { size: 24 })) : undefined }),
});
export const Playground = playground({ source: '{}' });
export const Types = example({ name: 'Types', render: () => h(Col, null, h(TextField, { label: 'Filled', defaultValue: 'Filled text' }), h(TextField, { label: 'Standard', variant: 'standard', defaultValue: 'Filled text' })), source: `<TextField label="Filled" variant="filled" />` });
export const States = example({
  name: 'States', render: () => h(Col, null, h(TextField, { label: 'Empty' }), h(TextField, { label: 'Filled', defaultValue: 'Filled text' }),
    h(TextField, { label: 'Error', defaultValue: 'Filled text', status: 'error', caption: 'Error text' }), h(TextField, { label: 'Warning', defaultValue: 'Filled text', status: 'warning', caption: 'Please note' }),
    h(TextField, { label: 'Success', defaultValue: 'Filled text', status: 'success', caption: 'All good' }), h(TextField, { label: 'Disabled', disabled: true }),
    h(TextField, { label: 'Disabled filled', defaultValue: 'Filled text', disabled: true }), h(TextField, { label: 'Loading', loading: true })),
  source: `<TextField label="Error" status="error" caption="Error text" />`,
});
export const Sizes = example({ name: 'Sizes', render: () => h(Col, null, h(TextField, { label: 'Medium', defaultValue: 'Filled text' }), h(TextField, { label: 'Small', size: 'sm', defaultValue: 'Filled text' })), source: `<TextField size="sm" label="Small" />` });
export const Actions = example({
  name: 'Actions', render: () => h(Col, null, h(TextField, { label: 'Clearable', clearable: true, actionLabel: 'Clear', defaultValue: 'Filled text' }), h(TextField, { label: 'Password', type: 'password', actionLabel: 'Show/hide password', defaultValue: 'secret123' }),
    h(TextField, { label: 'Password (empty: the eye shows on focus)', type: 'password', actionLabel: 'Show/hide password' }), h(TextField, { label: 'Custom (visible even when empty)', action: info })),
  source: `<TextField label="Clearable" clearable actionLabel="Clear" />`,
});
export const Multiline = example({ name: 'Multiline', render: () => h(Col, null, h(TextField, { label: 'Multiline', multiline: true, defaultValue: 'Multiline\nFilled text' }), h(TextField, { label: 'minRows=2, maxRows=4', multiline: true, minRows: 2, maxRows: 4 })), source: `<TextField label="Notes" multiline minRows={2} maxRows={4} />` });
export const PlaceholderLabel = example({ name: 'Placeholder Label', render: () => h(Col, null, h(TextField, { label: 'Label', floatingLabel: false }), h(TextField, { label: 'Label', floatingLabel: false, defaultValue: 'Filled text' })), source: `<TextField label="Label" floatingLabel={false} />` });
export const WithIcon = example({ name: 'With Icon', render: () => h(Col, null, h(TextField, { label: 'Label', startIcon: h(Heart, { size: 24 }) })), source: `<TextField label="Label" startIcon={<Heart />} />` });
export const Caption = example({ name: 'Caption', render: () => h(Col, null, h(TextField, { label: 'Label', caption: 'Caption' }), h(TextField, { label: 'Label', defaultValue: 'Filled text', caption: 'Caption', status: 'error' })), source: `<TextField label="Label" caption="Caption" />` });
export const PrefixSuffix = example({ name: 'Prefix Suffix', render: () => h(Col, null, h(TextField, { label: 'Label', prefix: '$', defaultValue: 'Filled text' }), h(TextField, { label: 'Label', suffix: '$', defaultValue: 'Filled text' })), source: `<TextField label="Label" prefix="$" />` });
export const __namedExportsOrder = ['Playground', 'Types', 'States', 'Sizes', 'Actions', 'Multiline', 'PlaceholderLabel', 'WithIcon', 'Caption', 'PrefixSuffix'];
