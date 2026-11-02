import { DatePicker } from '../components/Calendar.jsx';
import TextFieldStory from './TextInput.stories.jsx';
import { meta, playground, example } from './_helpers.jsx';

// The field is a Text Input: its settings and their docs come from Text Input.
const T = TextFieldStory.argTypes;
const shared = ['variant', 'size', 'floatingLabel', 'caption', 'status', 'disabled', 'loading'];
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const tp = TextFieldStory.component.__docgenInfo.props;
const hp = /** @type {any} */ (DatePicker).__docgenInfo.props;
for (const k of shared) if (tp[k]) hp[k] = { ...hp[k], ...tp[k] };

export default meta({
  title: 'Components/Date Picker',
  component: DatePicker,
  args: {
    label: 'Date',
    mode: 'single',
    presentation: 'auto',
    weekStartsOn: 1,
    locale: 'en-US',
    variant: 'filled',
    size: 'md',
    floatingLabel: true,
    loading: false,
    disabled: false,
  },
  argTypes: {
    label: T.label,
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    locale: { control: 'inline-radio', options: ['en-US', 'de-DE', 'ru-RU', 'ja-JP'] },
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    presentation: { control: 'inline-radio', options: ['auto', 'popover', 'dialog'] },
    ...Object.fromEntries(shared.map((k) => [k, T[k]])),
  },
});
export const Playground = {
  ...playground({ source: `<DatePicker label="Date" value={date} onValueChange={setDate} />` }),
  render: (args) => (
    <div style={{ minHeight: 440 }}>
      <DatePicker key={args.mode + args.presentation} {...args} />
    </div>
  ),
};
export const InDialog = example({
  name: 'In a Dialog',
  render: () => <DatePicker label="Check-in" presentation="dialog" weekStartsOn={1} locale="en-US" defaultValue={inDays(2)} />,
  source: `<DatePicker label="Check-in" presentation="dialog" />  // on screens below 768px "auto" does the same`,
});
export const RangeValue = example({
  name: 'Range',
  render: () => (
    <div style={{ minHeight: 440 }}>
      <DatePicker label="Stay" mode="range" weekStartsOn={1} locale="en-US" min={inDays(0)} />
    </div>
  ),
  source: `<DatePicker label="Stay" mode="range" min={today} />`,
});
export const __namedExportsOrder = ['Playground', 'InDialog', 'RangeValue'];
