import { h, cx, useId, useRef, createContext, useContext, useControllable } from '../react.js';
import { describe } from '../doc.js';
import { Badge } from './Badge.js';

const TabsContext = createContext(null);
const TabListContext = createContext({ showIcon: true, showLabel: true, showCounter: true, showBadge: true });
const useTabs = () => useContext(TabsContext);

export function Tabs({ value, defaultValue, onValueChange, children, className, ...rest }) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const uid = useId();
  return h(TabsContext.Provider, { value: { current, setCurrent, uid } }, h('div', { className: cx('bui-tabs', className), ...rest }, children));
}
describe(Tabs, 'Switches between related views.', {
  value: ['string', null, 'Selected tab'],
  defaultValue: ['string', null, 'Initially selected tab'],
  onValueChange: ['(value: string) => void', null, 'Called when the selected tab changes'],
});

export function TabList({ size = 'md', fullWidth = false, showIcon = true, showLabel = true, showCounter = true, showBadge = true, label, children, className, ...rest }) {
  const { current, setCurrent } = useTabs();
  const ref = useRef(null);
  const onKeyDown = (e) => {
    const tabs = [...ref.current.querySelectorAll('[role="tab"]:not(:disabled)')];
    const i = tabs.indexOf(document.activeElement);
    let next;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    next.focus();
    setCurrent(next.dataset.value);
  };
  return h(TabListContext.Provider, { value: { showIcon, showLabel, showCounter, showBadge } },
    h('div', { role: 'tablist', 'aria-label': label, ref, onKeyDown, className: cx('bui-tablist', `bui-tablist--${size}`, fullWidth && 'bui-tablist--full', className), ...rest }, children));
}
describe(TabList, 'The row of tabs. Its settings work like the Segmented Control ones.', {
  size: ["'sm' | 'md'", "'md'", 'Tab height'],
  fullWidth: ['boolean', 'false', 'Fill the container width; the tabs are equal'],
  showIcon: ['boolean', 'true', 'Show the tab icons'],
  showLabel: ['boolean', 'true', 'Show the tab labels; with it off the tabs are icons only and the text becomes the accessible name'],
  showCounter: ['boolean', 'true', 'Show the tab counters'],
  showBadge: ['boolean', 'true', 'Show the tab badges'],
  label: ['string', null, 'Accessible name'],
});

export function Tab({ value, icon, counter, badge, disabled = false, children, className, ...rest }) {
  const { current, setCurrent, uid } = useTabs();
  const { showIcon, showLabel, showCounter, showBadge } = useContext(TabListContext);
  const selected = current === value;
  const hasIcon = showIcon && icon;
  const labelShown = showLabel || !hasIcon;
  const text = typeof children === 'string' ? children : undefined;
  const iconOnly = hasIcon && !labelShown && !(showCounter && counter != null) && !(showBadge && badge != null);
  return h('button', {
    type: 'button', role: 'tab', id: `${uid}-t-${value}`, 'data-value': value, 'aria-selected': selected, 'aria-controls': `${uid}-p-${value}`,
    tabIndex: selected ? 0 : -1, disabled, title: labelShown ? undefined : text, 'aria-label': labelShown ? undefined : text,
    className: cx('bui-tab', iconOnly && 'bui-tab--icon', className), onClick: () => setCurrent(value), ...rest,
  },
  hasIcon && h('span', { className: 'bui-tab__icon', 'aria-hidden': 'true' }, icon),
  labelShown && h('span', { className: 'bui-tab__label' }, children),
  showCounter && counter != null && h('span', { className: 'bui-tab__counter' }, counter),
  showBadge && badge != null && (typeof badge === 'object' ? badge : h(Badge, { label: badge, variant: 'red' })));
}
describe(Tab, 'A tab button.', {
  value: ['string', null, 'Identifier matching a `TabPanel`'],
  icon: ['ReactNode', null, 'Icon before the label'],
  counter: ['number | string', null, 'Counter after the label'],
  badge: ['ReactNode | string', null, 'Badge after the label'],
  disabled: ['boolean', 'false', 'Disable the tab'],
});

export function TabPanel({ value, children, className, ...rest }) {
  const { current, uid } = useTabs();
  if (current !== value) return null;
  return h('div', { role: 'tabpanel', id: `${uid}-p-${value}`, 'aria-labelledby': `${uid}-t-${value}`, tabIndex: 0, className: cx('bui-tabpanel', className), ...rest }, children);
}
describe(TabPanel, 'The content of a tab.', { value: ['string', null, 'Identifier of its `Tab`.'] });
