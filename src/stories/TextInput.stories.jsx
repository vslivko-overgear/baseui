import { TextInput } from '../components/TextInput.jsx';
import { InfoCircle, Heart } from './_ui.jsx';
import { meta, playground, example } from './_helpers.jsx';

const Col = ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-4)', maxWidth: 360 }}>{children}</div>;
const info = (
  <button type="button" className="bui-input__icon-button" aria-label="Info">
    <InfoCircle size={24} />
  </button>
);
export default meta({
  title: 'Components/TextInput',
  component: TextInput,
  args: { label: 'Label', variant: 'filled', size: 'md', floatingLabel: true, caption: '', disabled: false, loading: false, action: 'none', multiline: false },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['filled', 'standard'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    floatingLabel: { control: 'boolean' },
    caption: { control: 'text' },
    status: { control: 'inline-radio', options: ['none', 'error', 'warning', 'success'], mapping: { none: undefined } },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    action: { control: 'inline-radio', options: ['none', 'clear', 'info', 'custom'] },
    multiline: { control: 'boolean' },
    minRows: { control: 'number', if: { arg: 'multiline', eq: true } },
    maxRows: { control: 'number', if: { arg: 'multiline', eq: true } },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
  render: (args) => (
    <TextInput
      {...args}
      clearable={args.action === 'clear'}
      actionLabel={args.action === 'clear' ? 'Clear' : undefined}
      action={
        args.action === 'info' ? (
          info
        ) : args.action === 'custom' ? (
          <button type="button" className="bui-input__icon-button" aria-label="Custom action">
            <Heart size={24} />
          </button>
        ) : undefined
      }
    />
  ),
});
export const Playground = playground({ source: '{}' });
export const Types = example({
  name: 'Types',
  render: () => (
    <Col>
      <TextInput label="Filled" defaultValue="Filled text" />
      <TextInput label="Standard" variant="standard" defaultValue="Filled text" />
    </Col>
  ),
  source: `<TextInput label="Filled" variant="filled" />`,
});
export const States = example({
  name: 'States',
  render: () => (
    <Col>
      <TextInput label="Empty" />
      <TextInput label="Filled" defaultValue="Filled text" />
      <TextInput label="Error" defaultValue="Filled text" status="error" caption="Error text" />
      <TextInput label="Warning" defaultValue="Filled text" status="warning" caption="Please note" />
      <TextInput label="Success" defaultValue="Filled text" status="success" caption="All good" />
      <TextInput label="Disabled" disabled />
      <TextInput label="Disabled filled" defaultValue="Filled text" disabled />
      <TextInput label="Loading" loading />
    </Col>
  ),
  source: `<TextInput label="Error" status="error" caption="Error text" />`,
});
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Col>
      <TextInput label="Medium" defaultValue="Filled text" />
      <TextInput label="Small" size="sm" defaultValue="Filled text" />
    </Col>
  ),
  source: `<TextInput size="sm" label="Small" />`,
});
export const Actions = example({
  name: 'Actions',
  render: () => (
    <Col>
      <TextInput label="Clearable" clearable actionLabel="Clear" defaultValue="Filled text" />
      <TextInput label="Password" type="password" actionLabel="Show/hide password" defaultValue="secret123" />
      <TextInput label="Password (empty: the eye shows on focus)" type="password" actionLabel="Show/hide password" />
      <TextInput label="Custom (visible even when empty)" action={info} />
    </Col>
  ),
  source: `<TextInput label="Clearable" clearable actionLabel="Clear" />`,
});
export const Multiline = example({
  name: 'Multiline',
  render: () => (
    <Col>
      <TextInput label="Multiline" multiline defaultValue={'Multiline\nFilled text'} />
      <TextInput label="minRows=2, maxRows=4" multiline minRows={2} maxRows={4} />
    </Col>
  ),
  source: `<TextInput label="Notes" multiline minRows={2} maxRows={4} />`,
});
export const PlaceholderLabel = example({
  name: 'Placeholder Label',
  render: () => (
    <Col>
      <TextInput label="Label" floatingLabel={false} />
      <TextInput label="Label" floatingLabel={false} defaultValue="Filled text" />
    </Col>
  ),
  source: `<TextInput label="Label" floatingLabel={false} />`,
});
export const OutsideLabel = example({
  name: 'Outside Label',
  description: 'The label is a title above the box, as the title of a group of radios or tags; the box takes a placeholder.',
  render: () => (
    <Col>
      <TextInput label="Full name" labelPlacement="outside" placeholder="As on the passport" />
      <TextInput label="Email" labelPlacement="outside" placeholder="name@example.com" caption="We send the receipt here" />
    </Col>
  ),
  source: `<TextInput label="Full name" labelPlacement="outside" placeholder="As on the passport" />`,
});
export const WithIcon = example({
  name: 'With Icon',
  render: () => (
    <Col>
      <TextInput label="Label" startIcon={<Heart size={24} />} />
    </Col>
  ),
  source: `<TextInput label="Label" startIcon={<Heart />} />`,
});
export const Search = example({
  name: 'Search',
  render: () => (
    <Col>
      <TextInput type="search" />
      <TextInput type="search" label="Search people" defaultValue="Amelia" />
      <TextInput type="search" size="sm" />
    </Col>
  ),
  source: `<TextInput type="search" />
<TextInput type="search" label="Search people" />`,
});
export const Caption = example({
  name: 'Caption',
  render: () => (
    <Col>
      <TextInput label="Label" caption="Caption" />
      <TextInput label="Label" defaultValue="Filled text" caption="Caption" status="error" />
    </Col>
  ),
  source: `<TextInput label="Label" caption="Caption" />`,
});
export const PrefixSuffix = example({
  name: 'Prefix Suffix',
  render: () => (
    <Col>
      <TextInput label="Label" prefix="$" defaultValue="Filled text" />
      <TextInput label="Label" suffix="$" defaultValue="Filled text" />
    </Col>
  ),
  source: `<TextInput label="Label" prefix="$" />`,
});
export const __namedExportsOrder = [
  'Playground',
  'Types',
  'States',
  'Sizes',
  'Actions',
  'Multiline',
  'PlaceholderLabel',
  'OutsideLabel',
  'WithIcon',
  'Search', 'Caption',
  'PrefixSuffix',
];
