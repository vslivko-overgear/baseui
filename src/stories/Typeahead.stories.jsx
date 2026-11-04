import { Fragment } from '../react.js';
import { Typeahead } from '../components/Typeahead.jsx';
import { SearchSm } from './_ui.jsx';
import { meta, playground } from './_helpers.jsx';

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
  title: 'Components/Typeahead',
  component: Typeahead,
  description:
    'A text field that suggests options as you type: the Base UI Combobox in the shared field shell. It filters the options by label and supports single and multiple selection',
  args: { label: 'Team', options: OPTIONS, floatingLabel: true, emptyText: 'Nothing found', disabled: false },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    floatingLabel: { control: 'boolean' },
    caption: { control: 'text' },
    status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } },
    emptyText: { control: 'text' },
    disabled: { control: 'boolean' },
    mobileSearchPlaceholder: { control: 'text' },
    mobileDialogProps: { control: false },
    options: { control: false },
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
  'Empty, filled, disabled and validation',
  () => (
    <>
      <Typeahead label="Team" options={OPTIONS} />
      <Typeahead label="Team" options={OPTIONS} defaultValue="design" />
      <Typeahead label="Team" options={OPTIONS} disabled />
      <Typeahead label="Team" options={OPTIONS} defaultValue="design" status="error" caption="Choose a team" />
      <Typeahead label="Team" options={OPTIONS} defaultValue="design" status="warning" caption="Check your choice" />
      <Typeahead label="Team" options={OPTIONS} defaultValue="design" status="success" caption="Team is available" />
    </>
  ),
  `<Typeahead label="Team" options={options} status="error" caption="Choose a team" />`,
  'var(--bui-spacing-3)',
);
export const IconAndLoading = story(
  'Icon and Loading',
  'startIcon, loading, prefix and suffix: the chrome shared with the Text Input.',
  () => (
    <>
      <Typeahead label="Team" options={OPTIONS} startIcon={<SearchSm size={24} />} />
      <Typeahead label="Team" options={OPTIONS} startIcon={<SearchSm size={24} />} defaultValue="design" />
      <Typeahead label="Team" options={OPTIONS} loading />
      <Typeahead label="Amount" options={OPTIONS} prefix="$" suffix="₽" defaultValue="design" />
    </>
  ),
  `<Typeahead label="Team" options={options} startIcon={<SearchSm />} />`,
  12,
);
export const Opened = story(
  'Opened',
  'The input filters the options by label',
  () => <Typeahead label="Team" options={OPTIONS} defaultOpen />,
  `<Typeahead label="Team" options={options} defaultOpen />`,
);
export const Multiple = story(
  'Multiple',
  'One, a few, a counter and many tokens',
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-3)' }}>
      <Typeahead multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
      <Typeahead multiple label="Teams" options={OPTIONS} defaultValue={['design', 'engineering']} />
      <Typeahead multiple label="Teams" options={OPTIONS} multipleDisplay="counter" defaultValue={OPTIONS.map((o) => o.value)} />
      <Typeahead multiple label="Teams" options={OPTIONS} defaultValue={OPTIONS.map((o) => o.value)} />
    </div>
  ),
  `<Typeahead multiple label="Teams" options={options} multipleDisplay="counter" />`,
);
export const MobileSheet = story(
  'Mobile Sheet',
  'On viewports below 768px the search moves to a separate input inside a bottom sheet',
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-3)' }}>
      <Typeahead label="Team" options={OPTIONS} />
      <Typeahead multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
    </div>
  ),
  `<Typeahead label="Team" options={options} />`,
);
export const __namedExportsOrder = ['Playground', 'States', 'IconAndLoading', 'Opened', 'Multiple', 'MobileSheet'];
