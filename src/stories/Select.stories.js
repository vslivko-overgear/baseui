import { h, Fragment } from '../react.js';
import { Select } from '../components/Select.js';
import { SearchLg } from './_ui.js';
import { meta, playground, example } from './_helpers.js';

const OPTIONS = [{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }, { value: 'marketing', label: 'Marketing' }, { value: 'product', label: 'Product' }, { value: 'sales', label: 'Sales' }, { value: 'support', label: 'Support' }];
const width = (gap) => (Story) => h('div', { style: { ...(gap ? { display: 'flex', flexDirection: 'column', gap } : {}), width: 360 } }, h(Story));

export default meta({
  title: 'Components/Select', component: Select, description: 'A field, or any element, that opens a list of options: the Base UI Select in the shared field shell. Single and multiple selection, validation, keyboard navigation.',
  args: { label: 'Team', options: OPTIONS, floatingLabel: true, disabled: false },
  argTypes: {
    label: { control: 'text' }, placeholder: { control: 'text' }, floatingLabel: { control: 'boolean' }, loading: { control: 'boolean' }, caption: { control: 'text' },
    status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } }, disabled: { control: 'boolean' }, options: { control: false }, mobileModalProps: { control: false },
  },
  decorators: [width()],
});
const story = (name, text, render, source, gap) => ({ name, decorators: gap ? [width(gap)] : undefined, render, parameters: { controls: { disable: true }, docs: { description: { story: text }, source: { originalSource: source } } } });
export const Playground = playground({ source: '{}' });
export const States = story('States', 'Empty, filled, multiple, disabled and validation. A single value has no outline; a multiple selection has the selected outline.', () => h(Fragment, null,
  h(Select, { label: 'Team', options: OPTIONS }), h(Select, { label: 'Team', options: OPTIONS, defaultValue: 'design' }), h(Select, { multiple: true, selectAll: true, label: 'Team', options: OPTIONS, defaultValue: ['design', 'engineering'] }), h(Select, { label: 'Team', options: OPTIONS, disabled: true }),
  h(Select, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'error', caption: 'Choose a team' }), h(Select, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'warning', caption: 'Check your choice' }), h(Select, { label: 'Team', options: OPTIONS, defaultValue: 'design', status: 'success', caption: 'Team is available' })),
`<Select label="Team" options={options} status="error" caption="Choose a team" />`, 'var(--baseui-spacing-12)');
export const IconAndLoading = story('Icon and Loading', 'startIcon, loading, prefix and suffix: the chrome shared with the Text Input.', () => h(Fragment, null,
  h(Select, { label: 'Team', options: OPTIONS, startIcon: h(SearchLg, { size: 24 }) }), h(Select, { label: 'Team', options: OPTIONS, startIcon: h(SearchLg, { size: 24 }), defaultValue: 'design' }), h(Select, { label: 'Team', options: OPTIONS, loading: true }), h(Select, { label: 'Amount', options: OPTIONS, prefix: '$', suffix: '₽', defaultValue: 'design' })),
`<Select label="Team" options={options} startIcon={<SearchLg />} />`, 12);
export const Multiple = story('Multiple', 'Selecting several values.', () => h(Select, { multiple: true, selectAll: true, label: 'Teams', options: OPTIONS, defaultValue: ['design', 'engineering'] }), `<Select multiple selectAll label="Teams" options={options} />`);
export const WithoutFloatingLabel = story('Without Floating Label', 'The label does not float: the selected value stays centered.', () => h(Select, { label: 'Team', floatingLabel: false, options: OPTIONS, defaultValue: 'design' }), `<Select label="Team" floatingLabel={false} options={options} />`);
export const Opened = story('Opened', 'The menu is open right away.', () => h(Select, { label: 'Team', options: OPTIONS, defaultOpen: true }), `<Select label="Team" options={options} defaultOpen />`);
export const MobileSheet = story('Mobile Sheet', 'On viewports up to 1200px the dropdown is replaced by a bottom sheet.', () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-12)' } }, h(Select, { label: 'Team', options: OPTIONS }), h(Select, { multiple: true, label: 'Teams', options: OPTIONS, defaultValue: ['design'] })), `<Select label="Team" options={options} />`);
export const __namedExportsOrder = ['Playground', 'States', 'IconAndLoading', 'Multiple', 'WithoutFloatingLabel', 'Opened', 'MobileSheet'];
