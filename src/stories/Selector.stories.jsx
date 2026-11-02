import { Fragment } from '../react.js';
import { Selector } from '../components/Selector.jsx';
import { SearchSm } from './_ui.jsx';
import { meta, playground, example } from './_helpers.jsx';

const OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product', label: 'Product' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
];
const width = (gap) => (Story) => (
  <div style={{ ...(gap ? { display: 'flex', flexDirection: 'column', gap } : {}), width: 360 }}>
    <Story />
  </div>
);

export default meta({
  title: 'Components/Selector',
  component: Selector,
  description:
    'A field, or any element, that opens a list of options: the Base UI Select in the shared field shell. Single and multiple selection, validation, keyboard navigation',
  args: { label: 'Team', options: OPTIONS, floatingLabel: true, disabled: false },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    floatingLabel: { control: 'boolean' },
    loading: { control: 'boolean' },
    caption: { control: 'text' },
    status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } },
    disabled: { control: 'boolean' },
    options: { control: false },
    mobileDialogProps: { control: false },
  },
  decorators: [width()],
});
const story = (name, text, render, source, gap) => ({
  name,
  decorators: gap ? [width(gap)] : undefined,
  render,
  parameters: { controls: { disable: true }, docs: { description: { story: text }, source: { originalSource: source } } },
});
export const Playground = playground({ source: '{}' });
export const States = story(
  'States',
  'Empty, filled, multiple, disabled and validation. A single value has no outline; a multiple selection has the selected outline',
  () => (
    <>
      <Selector label="Team" options={OPTIONS} />
      <Selector label="Team" options={OPTIONS} defaultValue="design" />
      <Selector multiple selectAll label="Team" options={OPTIONS} defaultValue={['design', 'engineering']} />
      <Selector label="Team" options={OPTIONS} disabled />
      <Selector label="Team" options={OPTIONS} defaultValue="design" status="error" caption="Choose a team" />
      <Selector label="Team" options={OPTIONS} defaultValue="design" status="warning" caption="Check your choice" />
      <Selector label="Team" options={OPTIONS} defaultValue="design" status="success" caption="Team is available" />
    </>
  ),
  `<Selector label="Team" options={options} status="error" caption="Choose a team" />`,
  'var(--baseui-spacing-3)',
);
export const IconAndLoading = story(
  'Icon and Loading',
  'startIcon, loading, prefix and suffix: the chrome shared with the Text Input.',
  () => (
    <>
      <Selector label="Team" options={OPTIONS} startIcon={<SearchSm size={24} />} />
      <Selector label="Team" options={OPTIONS} startIcon={<SearchSm size={24} />} defaultValue="design" />
      <Selector label="Team" options={OPTIONS} loading />
      <Selector label="Amount" options={OPTIONS} prefix="$" suffix="₽" defaultValue="design" />
    </>
  ),
  `<Selector label="Team" options={options} startIcon={<SearchSm />} />`,
  12,
);
export const Multiple = story(
  'Multiple',
  'Selecting several values',
  () => <Selector multiple selectAll label="Teams" options={OPTIONS} defaultValue={['design', 'engineering']} />,
  `<Selector multiple selectAll label="Teams" options={options} />`,
);
export const WithoutFloatingLabel = story(
  'Without Floating Label',
  'The label does not float: the selected value stays centered',
  () => <Selector label="Team" floatingLabel={false} options={OPTIONS} defaultValue="design" />,
  `<Selector label="Team" floatingLabel={false} options={options} />`,
);
export const Opened = story(
  'Opened',
  'The menu is open right away',
  () => <Selector label="Team" options={OPTIONS} defaultOpen />,
  `<Selector label="Team" options={options} defaultOpen />`,
);
export const MobileSheet = story(
  'Mobile Sheet',
  'On viewports below 768px the dropdown is replaced by a bottom sheet',
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-3)' }}>
      <Selector label="Team" options={OPTIONS} />
      <Selector multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
    </div>
  ),
  `<Selector label="Team" options={options} />`,
);
export const __namedExportsOrder = ['Playground', 'States', 'IconAndLoading', 'Multiple', 'WithoutFloatingLabel', 'Opened', 'MobileSheet'];
