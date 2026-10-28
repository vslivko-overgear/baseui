import { h, Fragment } from '../react.js';
import { Autocomplete } from '../components/Autocomplete.js';
import { SearchLg } from './_ui.js';
import { meta, playground } from './_helpers.js';

const OPTIONS = [{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }, { value: 'marketing', label: 'Marketing' }, { value: 'product', label: 'Product' }, { value: 'sales', label: 'Sales' }, { value: 'support', label: 'Support' }];
const width = (gap) => (Story) => h('div', { style: { ...(gap ? { display: 'flex', flexDirection: 'column', gap } : {}), width: 360 } }, h(Story));

export default meta({
  title: 'Components/Autocomplete', component: Autocomplete, description: 'A text field that suggests options as you type: the Base UI Combobox in the shared field shell. It filters the options by label and supports single and multiple selection.',
  args: { label: 'Team', options: OPTIONS, floatingLabel: true, emptyText: 'Nothing found', disabled: false },
  argTypes: {
    label: { control: 'text' }, placeholder: { control: 'text' }, floatingLabel: { control: 'boolean' }, caption: { control: 'text' },
    status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } }, emptyText: { control: 'text' }, disabled: { control: 'boolean' },
    mobileSearchPlaceholder: { control: 'text' }, mobileModalProps: { control: false }, options: { control: false },
  },
  decorators: [width()],
});
const story = (name, text, render, source, gap) => ({ name, decorators: gap ? [width(gap)] : undefined, render, parameters: { controls: { disable: true }, docs: { description: { story: text }, source: { originalSource: source } } } });
export const Playground = playground({ source: '{}' });
export const States = story('States', 'Empty, filled, disabled and validation.', () => h(Fragment, null,
  h(Autocomplete, { label: 'Team', options: OPTIONS }), h(Autocomplete, { label: 'Team', options: OPTIONS, defaultValue: 'design' }), h(Autocomplete, { label: 'Team', options: OPTIONS, disabled: true }),
  h(Autocomplete, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'error', caption: 'Choose a team' }), h(Autocomplete, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'warning', caption: 'Check your choice' }), h(Autocomplete, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'success', caption: 'Team is available' })),
`<Autocomplete label="Team" options={options} status="error" caption="Choose a team" />`, 'var(--baseui-spacing-12)');
export const IconAndLoading = story('Icon and Loading', 'startIcon, loading, prefix and suffix: the chrome shared with the Text Input.', () => h(Fragment, null,
  h(Autocomplete, { label: 'Team', options: OPTIONS, startIcon: h(SearchLg, { size: 24 }) }), h(Autocomplete, { label: 'Team', options: OPTIONS, startIcon: h(SearchLg, { size: 24 }), defaultValue: 'design' }), h(Autocomplete, { label: 'Team', options: OPTIONS, loading: true }), h(Autocomplete, { label: 'Amount', options: OPTIONS, prefix: '$', suffix: '₽', defaultValue: 'design' })),
`<Autocomplete label="Team" options={options} startIcon={<SearchLg />} />`, 12);
export const Opened = story('Opened', 'The input filters the options by label.', () => h(Autocomplete, { label: 'Team', options: OPTIONS, defaultOpen: true }), `<Autocomplete label="Team" options={options} defaultOpen />`);
export const Multiple = story('Multiple', 'One, a few, a counter and many chips.', () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-12)' } },
  h(Autocomplete, { multiple: true, label: 'Teams', options: OPTIONS, defaultValue: ['design'] }), h(Autocomplete, { multiple: true, label: 'Teams', options: OPTIONS, defaultValue: ['design', 'engineering'] }),
  h(Autocomplete, { multiple: true, label: 'Teams', options: OPTIONS, multipleDisplay: 'counter', defaultValue: OPTIONS.map((o) => o.value) }), h(Autocomplete, { multiple: true, label: 'Teams', options: OPTIONS, defaultValue: OPTIONS.map((o) => o.value) })),
`<Autocomplete multiple label="Teams" options={options} multipleDisplay="counter" />`);
export const MobileSheet = story('Mobile Sheet', 'On viewports up to 1200px the search moves to a separate input inside a bottom sheet.', () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-12)' } }, h(Autocomplete, { label: 'Team', options: OPTIONS }), h(Autocomplete, { multiple: true, label: 'Teams', options: OPTIONS, defaultValue: ['design'] })), `<Autocomplete label="Team" options={options} />`);
export const __namedExportsOrder = ['Playground', 'States', 'IconAndLoading', 'Opened', 'Multiple', 'MobileSheet'];
