import { h } from '../../react.js';
import { CountdownTimer } from '../molecules/CountdownTimer.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';

const HOUR = 3600000;
const inMs = (ms) => new Date(Date.now() + ms);
export default meta({
  title: 'Overgear/Molecules/CountdownTimer', component: CountdownTimer, args: { hoursLeft: 5, hideIcon: false },
  argTypes: {
    // Story setting: the arg is turned into a target date, so the timer really ticks.
    hoursLeft: { control: { type: 'number', min: 0, max: 99, step: 1 }, docs: false },
    hideIcon: { control: 'boolean' },
  },
});
export const Playground = {
  ...playground({ source: `<CountdownTimer targetDate={new Date('2030-01-01T12:00:00')} />` }),
  render: ({ hoursLeft, ...args }) => h(CountdownTimer, { key: hoursLeft, ...args, targetDate: inMs(hoursLeft * HOUR + 59000) }),
};
export const WithIcon = example({
  name: 'With Icon', render: () => h(CountdownTimer, { targetDate: inMs(2 * HOUR + 15 * 60000) }),
  source: `<CountdownTimer targetDate={endsAt} />`,
});
export const TimeOnly = example({
  name: 'Time Only', render: () => h(CountdownTimer, { targetDate: inMs(45 * 60000), hideIcon: true }),
  source: `<CountdownTimer targetDate={endsAt} hideIcon />`,
});
export const LongRange = example({
  name: 'Over 24 Hours', description: 'Hours are not wrapped at 24: 49 hours shows as 49:00:00.',
  render: () => h(CountdownTimer, { remainingMs: 49 * HOUR }),
  source: `<CountdownTimer remainingMs={49 * 3600000} />`,
});
export const Inherited = example({
  name: 'Inherits Text Style', description: 'The timer takes the font and color of its surroundings.',
  render: () => h(Row, null,
    h('span', { style: { font: 'var(--baseui-Typography-Text-16-Semi-Bold)', color: 'var(--baseui-Extensions-Text-and-Icon-Error)' } }, h(CountdownTimer, { remainingMs: 12 * 60000 + 5000 })),
    h('span', { style: { font: 'var(--baseui-Typography-Header-24)' } }, h(CountdownTimer, { remainingMs: 3 * HOUR, hideIcon: true }))),
  source: `<span className="my-heading"><CountdownTimer remainingMs={180000} /></span>`,
});
export const Expired = example({
  name: 'Expired', description: 'After the target time the timer renders nothing visible.',
  render: () => h(Row, null, h('span', null, 'Before'), h(CountdownTimer, { targetDate: inMs(-1000) }), h('span', null, 'After')),
  source: `<CountdownTimer targetDate={pastDate} />`,
});
export const __namedExportsOrder = ['Playground', 'WithIcon', 'TimeOnly', 'LongRange', 'Inherited', 'Expired'];
