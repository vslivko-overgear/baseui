import { h, useState } from '../../react.js';
import { CalendarEventDate } from '../organisms/CalendarEventDate.js';
import { meta, playground, example, Stack, W } from '../../stories/_helpers.js';

const dates = (n) => ['12 Nov', '13 Nov', '14 Nov', '15 Nov', '16 Nov', '17 Nov'].slice(0, n).map((date) => ({ date }));
function Controlled({ count }) {
  const slots = dates(count);
  const [active, setActive] = useState(slots[0]);
  return h(Stack, { width: 360 }, h(CalendarEventDate, { slots, activeSlot: active, onSelect: setActive }), h('span', { style: { font: 'var(--baseui-Typography-Text-14-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, `Selected: ${active.date}`));
}
export default meta({
  title: 'Overgear/Organisms/CalendarEventDate', component: CalendarEventDate,
  args: { count: 5, dropdownPlaceholder: 'Choose date' },
  argTypes: { count: { control: { type: 'number', min: 2, max: 6, step: 1 }, docs: false }, dropdownPlaceholder: { control: 'text' } },
});
export const Playground = {
  ...playground({ source: `<CalendarEventDate slots={slots} activeSlot={active} onSelect={setActive} />` }),
  render: ({ count, ...args }) => h('div', { key: count }, W(360, h(CalendarEventDate, { ...args, slots: dates(count) }))),
};
export const TwoDates = example({ name: 'Two Dates', render: () => W(360, h(CalendarEventDate, { slots: dates(2) })), source: `<CalendarEventDate slots={[{ date: '12 Nov' }, { date: '13 Nov' }]} onSelect={pick} />` });
export const ThreeDates = example({ name: 'Three Dates', render: () => W(360, h(CalendarEventDate, { slots: dates(3), defaultActiveSlot: dates(3)[2] })), source: `<CalendarEventDate slots={three} />` });
export const WithDropdown = example({
  name: 'With Dropdown', description: 'From four dates, the first two stay as segments and the rest open from a menu.',
  render: () => h(Controlled, { count: 6 }), source: `<CalendarEventDate slots={six} activeSlot={active} onSelect={setActive} />`,
});
export const DropdownSelected = example({
  name: 'Date From Dropdown', description: 'A date picked from the menu is shown on the menu button.',
  render: () => W(360, h(CalendarEventDate, { slots: dates(5), defaultActiveSlot: dates(5)[3] })), source: `<CalendarEventDate slots={five} activeSlot={{ date: '15 Nov' }} />`,
});
export const __namedExportsOrder = ['Playground', 'TwoDates', 'ThreeDates', 'WithDropdown', 'DropdownSelected'];
