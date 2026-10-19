import { h, cx, React, useId, useRef, useState, useEffect, createContext, useContext, useControllable } from '../react.js';
import { Icon } from '../icons.js';
import { Badge } from './Badge.js';
import { IconButton } from './Button.js';
import { describe } from '../doc.js';
import { motionOf, useAppear } from '../theme-flags.js';

const TabsContext = createContext(null);
const TabListContext = createContext({ size: 'md', showIcon: true, showCounter: true, showBadge: true });
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

export function TabList({ size = 'md', fullWidth = false, showIcon = true, showCounter = true, showBadge = true, motion, label, children, className, ...rest }) {
  const { current, setCurrent } = useTabs();
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const [bar, setBar] = useState(null);
  const [ready, setReady] = useState(false);
  const [nudge, setNudge] = useState(0);
  const indicator = useRef(null);
  // Slide buttons appear when the row is wider than its container, like the Figma "slide left / right".
  useEffect(() => {
    const el = ref.current;
    const measure = () => setEdge({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro.disconnect(); };
  }, [children, size, showIcon, showCounter, showBadge]);
  useEffect(() => { ref.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [current]);
  // The underline is one element that slides to the selected tab; it is measured again when the row changes size.
  React.useLayoutEffect(() => {
    const el = ref.current;
    const measure = () => {
      const t = el.querySelector('[aria-selected="true"]');
      setBar(t ? { x: t.offsetLeft, w: t.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current, children, size, fullWidth, showIcon, showCounter, showBadge]);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);
  useAppear(indicator, ref, bar && `${bar.x}/${bar.w}`);
  const slide = (dir) => ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.6, behavior: 'smooth' });
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
  return h(TabListContext.Provider, { value: { size, showIcon, showCounter, showBadge } },
    h('div', { 'data-motion': motion, className: cx('bui-tablist-wrap', `bui-tablist-wrap--${size}`, fullWidth && 'bui-tablist-wrap--full', ready && 'bui-tablist-wrap--ready', className) },
      edge.left && h('div', { className: 'bui-tablist__slide bui-tablist__slide--left' }, h(IconButton, { variant: 'ghost', size: 'xsm', label: 'Slide left', tooltip: false, tabIndex: -1, icon: h(Icon, { name: 'chevronLeft', size: 24 }), onClick: () => slide(-1) })),
      h('div', { role: 'tablist', 'aria-label': label, ref, onKeyDown,
        // Hovering another tab nudges the underline a few pixels toward it (enhanced animations only).
        onPointerOver: (e) => {
          if (e.pointerType !== 'mouse' || motionOf(ref.current) !== 'enhanced') return;
          const t = e.target.closest('[role="tab"]:not(:disabled)');
          const sel = ref.current.querySelector('[aria-selected="true"]');
          setNudge(t && sel && t !== sel ? (t.offsetLeft > sel.offsetLeft ? 6 : -6) : 0);
        },
        onPointerLeave: () => setNudge(0), className: 'bui-tablist', ...rest }, children,
        bar && h('span', { ref: indicator, className: 'bui-tablist__indicator', 'aria-hidden': 'true', style: { width: bar.w, transform: `translateX(${bar.x + nudge}px)` } })),
      edge.right && h('div', { className: 'bui-tablist__slide bui-tablist__slide--right' }, h(IconButton, { variant: 'ghost', size: 'xsm', label: 'Slide right', tooltip: false, tabIndex: -1, icon: h(Icon, { name: 'chevronRight', size: 24 }), onClick: () => slide(1) }))));
}
describe(TabList, 'The row of tabs. Its settings work like the Segmented Control ones; a row wider than its container scrolls with slide buttons.', {
  size: ["'sm' | 'md' | 'lg' | 'xl'", "'md'", 'Tab size: the label goes from 16 to 28px (Figma Small to Extra Large)'],
  fullWidth: ['boolean', 'false', 'The divider fills the container width; the tabs stay hugging their content'],
  showIcon: ['boolean', 'true', 'Show the tab icons'],
  showCounter: ['boolean', 'true', 'Show the tab counters'],
  showBadge: ['boolean', 'true', 'Show the tab badges'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animations of this row: off, basic, or enhanced (the underline slides to the selected tab and nudges toward the hovered one); by default the Animations setting of the theme'],
  label: ['string', null, 'Accessible name'],
});

export function Tab({ value, icon, counter, badge, disabled = false, children, className, ...rest }) {
  const { current, setCurrent, uid } = useTabs();
  const { size, showIcon, showCounter, showBadge } = useContext(TabListContext);
  const selected = current === value;
  const hasIcon = showIcon && icon;
  return h('button', {
    type: 'button', role: 'tab', id: `${uid}-t-${value}`, 'data-value': value, 'aria-selected': selected, 'aria-controls': `${uid}-p-${value}`,
    tabIndex: selected ? 0 : -1, disabled,
    className: cx('bui-tab', className), onClick: () => setCurrent(value), ...rest,
  },
  h('span', { className: 'bui-tab__block' },
    hasIcon && h('span', { className: 'bui-tab__icon', 'aria-hidden': 'true' }, icon),
    h('span', { className: 'bui-tab__text' },
      h('span', { className: 'bui-tab__label' }, children),
      showCounter && counter != null && h('span', { className: 'bui-tab__counter' }, counter)),
    showBadge && badge != null && (typeof badge === 'object' ? badge : h(Badge, { label: badge, variant: 'red', size: size === 'sm' || size === 'md' ? 'sm' : 'md', disabled }))),
  h('span', { className: 'bui-tab__line', 'aria-hidden': 'true' }));
}
describe(Tab, 'A tab button.', {
  value: ['string', null, 'Identifier matching a `TabPanel`'],
  icon: ['ReactNode', null, 'Icon before the label'],
  counter: ['number | string', null, 'Counter after the label'],
  badge: ['ReactNode | string', null, 'A Badge after the counter (red by default; sm for sm and md tabs, md otherwise)'],
  disabled: ['boolean', 'false', 'Disable the tab'],
});

export function TabPanel({ value, children, className, ...rest }) {
  const { current, uid } = useTabs();
  if (current !== value) return null;
  return h('div', { role: 'tabpanel', id: `${uid}-p-${value}`, 'aria-labelledby': `${uid}-t-${value}`, tabIndex: 0, className: cx('bui-tabpanel', className), ...rest }, children);
}
describe(TabPanel, 'The content of a tab.', { value: ['string', null, 'Identifier of its `Tab`.'] });
