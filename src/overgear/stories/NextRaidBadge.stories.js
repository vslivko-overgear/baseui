import { h } from '../../react.js';
import { NextRaidBadge } from '../molecules/NextRaidBadge.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';

const HOUR = 3600000;
export default meta({
  title: 'Overgear/Molecules/NextRaidBadge', component: NextRaidBadge,
  args: { isTimer: true, labelText: 'Next raid in:', datePretty: '18 Mar 13:00', compact: false },
  argTypes: { isTimer: { control: 'boolean' }, labelText: { control: 'text' }, datePretty: { control: 'text', if: { arg: 'isTimer', eq: false } }, compact: { control: 'boolean' } },
});
export const Playground = {
  ...playground({ source: `<NextRaidBadge isTimer timerTargetDate="2030-03-18T13:00:00" labelText="Next raid in:" />` }),
  render: (args) => h(NextRaidBadge, { ...args, remainingMs: 3 * HOUR + 25 * 60000 + 9000 }),
};
export const Timer = example({
  name: 'Timer', render: () => h(NextRaidBadge, { isTimer: true, timerTargetDate: new Date(Date.now() + 5 * HOUR + 30000), labelText: 'Next raid in:' }),
  source: `<NextRaidBadge isTimer timerTargetDate={startsAt} labelText="Next raid in:" />`,
});
export const DateText = example({
  name: 'Date', render: () => h(NextRaidBadge, { isTimer: false, timerTargetDate: '', datePretty: '18 Mar 13:00', labelText: 'Next raid:' }),
  source: `<NextRaidBadge isTimer={false} datePretty="18 Mar 13:00" labelText="Next raid:" />`,
});
export const Compact = example({
  name: 'Compact', render: () => h(Row, null,
    h(NextRaidBadge, { compact: true, isTimer: true, remainingMs: 2 * HOUR + 7 * 60000, labelText: 'Next raid in:' }),
    h(NextRaidBadge, { compact: true, isTimer: false, datePretty: '18 Mar 13:00', labelText: 'Next raid:' })),
  source: `<NextRaidBadge compact isTimer remainingMs={7620000} labelText="Next raid in:" />`,
});
export const __namedExportsOrder = ['Playground', 'Timer', 'DateText', 'Compact'];
