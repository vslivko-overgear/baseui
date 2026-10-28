import { h, cx, useState } from '../../react.js';
import { describe } from '../../doc.js';
import { SegmentedControl } from '../../components/SegmentedControl.js';
import { Dropdown } from '../../components/Dropdown.js';
import { Button } from '../../components/Button.js';
import { Icon } from '../../icons.js';

/** Date slots as a segmented control; with 4 or more, the first two stay as segments and the rest move into a menu. */
export function CalendarEventDate({ slots, activeSlot, defaultActiveSlot, onSelect, dropdownPlaceholder = 'Choose date', className, ...rest }) {
  const [inner, setInner] = useState(defaultActiveSlot ?? slots[0]);
  const active = activeSlot ?? inner;
  const [first, second, ...more] = slots;
  const third = more.length === 1 ? more[0] : null;
  const menu = more.length > 1 ? more : [];
  const select = (date) => {
    const slot = slots.find((s) => s.date === date);
    if (!slot) return;
    setInner(slot);
    onSelect && onSelect(slot);
  };
  const segments = [first, second, third].filter(Boolean);
  const inMenu = menu.some((s) => s.date === active?.date);
  return h('div', { 'data-slot': 'calendar-event-date', className: cx('og-event-date', className), ...rest },
    h(SegmentedControl, { size: 'sm', label: 'Event date', items: segments.map((s) => ({ value: s.date, label: s.date })), value: inMenu ? '' : active?.date, onValueChange: select }),
    menu.length > 0 && h('div', { className: 'og-event-date__more' },
      h(Dropdown, {
        size: 'sm', label: 'More dates', options: menu.map((s) => ({ value: s.date, label: s.date })), value: inMenu ? active.date : null, onValueChange: select,
        trigger: h(Button, { variant: 'secondary', size: 'sm', width: '100%', 'data-active': inMenu || undefined, className: 'og-event-date__trigger', endContent: h(Icon, { name: 'chevronDown', size: 20 }) }, inMenu ? active.date : dropdownPlaceholder),
      })));
}
describe(CalendarEventDate, 'Picks one of several event dates: the first two or three as a segmented control and, past that, the rest in a dropdown menu.', {
  slots: ['Array<{ date: string }>', null, 'All available dates; `date` is the label'],
  activeSlot: ['{ date: string }', null, 'The selected slot (controlled)'],
  defaultActiveSlot: ['{ date: string }', 'first slot', 'The initially selected slot (uncontrolled)'],
  onSelect: ['(slot) => void', null, 'Called when a date is chosen'],
  dropdownPlaceholder: ['string', "'Choose date'", 'Text of the menu button while no date from it is selected'],
});
