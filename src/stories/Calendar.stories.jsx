import { Calendar } from '../components/Calendar.jsx';
import { meta, playground, example } from './_helpers.jsx';

const weekday = (d) => d.getDay() !== 0 && d.getDay() !== 6;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

export default meta({
  title: 'Components/Calendar',
  component: Calendar,
  args: {
    mode: 'single',
    weekStartsOn: 0,
    numberOfMonths: 1,
    hasOutsideDays: true,
    hasVariableRowCount: false,
    hasWeekNumbers: false,
    locale: 'en-US',
    fluid: false,
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    numberOfMonths: { control: 'inline-radio', options: [1, 2] },
    hasOutsideDays: { control: 'boolean' },
    hasVariableRowCount: { control: 'boolean' },
    hasWeekNumbers: { control: 'boolean' },
    locale: { control: 'inline-radio', options: ['en-US', 'de-DE', 'ru-RU', 'ja-JP'] },
    fluid: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<Calendar mode="single" onValueChange={setDate} />` }),
  render: (args) => <Calendar key={args.mode} {...args} />,
};
export const Single = example({
  name: 'Single',
  render: () => <Calendar defaultValue={inDays(3)} />,
  source: `<Calendar value="2026-01-15" onValueChange={setDate} />`,
});
export const Range = example({
  name: 'Range',
  render: () => <Calendar mode="range" defaultValue={{ start: inDays(1), end: inDays(5) }} />,
  source: `<Calendar mode="range" value={{ start: '2026-01-10', end: '2026-01-20' }} onValueChange={setRange} />`,
});
export const TwoMonths = example({
  name: 'Two Months',
  render: () => <Calendar mode="range" numberOfMonths={2} defaultValue={{ start: inDays(20), end: inDays(35) }} />,
  source: `<Calendar mode="range" numberOfMonths={2} />`,
});
export const Constraints = example({
  name: 'Constraints',
  render: () => <Calendar min={inDays(-3)} max={inDays(40)} dateConstraints={[weekday]} />,
  source: `<Calendar min="2026-01-10" max="2026-03-20" dateConstraints={[(d) => d.getDay() !== 0 && d.getDay() !== 6]} />`,
});
export const RangeSpan = example({
  name: 'Range Span',
  render: () => <Calendar mode="range" minRangeSpan={2} maxRangeSpan={7} />,
  source: `<Calendar mode="range" minRangeSpan={2} maxRangeSpan={7} />`,
});
export const WeekNumbers = example({
  name: 'Week Numbers',
  render: () => <Calendar hasWeekNumbers weekStartsOn="mon" />,
  source: `<Calendar hasWeekNumbers weekStartsOn="mon" />`,
});
export const Locale = example({
  name: 'Locale',
  render: () => <Calendar locale="ru-RU" weekStartsOn="mon" />,
  source: `<Calendar locale="ru-RU" weekStartsOn="mon" />`,
});
export const __namedExportsOrder = ['Playground', 'Single', 'Range', 'TwoMonths', 'Constraints', 'RangeSpan', 'WeekNumbers', 'Locale'];
