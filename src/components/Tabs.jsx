import { cx, useId, useRef, useState, useEffect, createContext, useContext, useControllable } from '../react.js';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { Badge } from './Badge.jsx';
import { IconButton } from './Button.jsx';
import { describe } from '../doc.js';
import { motionOf, useAppear, useReady, themeAttrs } from '../theme-flags.js';
import { useHighlight } from '../highlight.js';

const TabsContext = createContext(null);
const TabListContext = createContext({ size: 'md', showIcon: true, showCounter: true, showBadge: true });
const useTabs = () => useContext(TabsContext);

/**
 * Tabs: a row of tabs and, under it, the panel of the selected tab, in one component. The content a tab owns goes into the panel (the `content` of its item,
 * or `children`, which is a node or a function of the selected value), so the part of a page that a tab switches is always the part below the row (rule D17).
 */
export function Tabs({
  items = [],
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  showIcon = true,
  showCounter = true,
  showBadge = true,
  motion,
  label,
  children,
  className,
  panelClassName,
  ...rest
}) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items.find((i) => !i.disabled)?.value, onValueChange);
  const uid = useId();
  const item = items.find((i) => i.value === current);
  const body = item?.content ?? (typeof children === 'function' ? children(current) : children);
  const hasPanel = body != null && body !== false;
  return (
    <TabsContext.Provider value={{ current, setCurrent, uid, hasPanel }}>
      <div data-slot="tabs" className={cx('bui-tabs', className)} {...rest}>
        <TabList size={size} showIcon={showIcon} showCounter={showCounter} showBadge={showBadge} motion={motion} label={label}>
          {items.map((i) => (
            <Tab key={i.value} value={i.value} icon={i.icon} counter={i.counter} badge={i.badge} disabled={i.disabled}>
              {i.label}
            </Tab>
          ))}
        </TabList>
        {hasPanel && <TabPanel className={panelClassName}>{body}</TabPanel>}
      </div>
    </TabsContext.Provider>
  );
}
describe(
  Tabs,
  'Switches between related views: the row of tabs and the panel under it. A row wider than its container scrolls, with slide buttons and a fade at the edges from the lg breakpoint (1024px); below it the row is scrolled by touch or the wheel',
  {
    items: [
      'Array<{ value: string; label: ReactNode; icon?: ReactNode; counter?: number | string; badge?: ReactNode | string; disabled?: boolean; content?: ReactNode }>',
      null,
      'The tabs. `content` is the panel of the tab; a badge is red by default (sm for sm and md tabs, md otherwise)',
    ],
    value: ['string', null, 'Selected tab (controlled)'],
    defaultValue: ['string', 'the first enabled tab', 'Initially selected tab'],
    onValueChange: ['(value: string) => void', null, 'Called when the selected tab changes'],
    children: ['ReactNode | ((value: string) => ReactNode)', null, 'The panel under the row for tabs that have no `content`: a node, or a function of the selected value. Everything a tab switches goes here'],
    size: ["'sm' | 'md' | 'lg' | 'xl'", "'md'", 'Tab size: the label goes from 16 to 28px (Figma Small to Extra Large)'],
    showIcon: ['boolean', 'true', 'Show the tab icons'],
    showCounter: ['boolean', 'true', 'Show the tab counters'],
    showBadge: ['boolean', 'true', 'Show the tab badges'],
    motion: [
      "'off' | 'basic' | 'enhanced'",
      'theme',
      'Animations of the row: off, basic, or enhanced (the underline slides to the selected tab and nudges toward the hovered one); by default the Animations setting of the theme',
    ],
    label: ['string', null, 'Accessible name of the row'],
    panelClassName: ['string', null, 'Class of the panel under the row'],
  },
);

function TabList({
  size = 'md',
  showIcon = true,
  showCounter = true,
  showBadge = true,
  motion,
  label,
  children,
  className,
  ...rest
}) {
  const { current, setCurrent } = useTabs();
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const ready = useReady();
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
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [children, size, showIcon, showCounter, showBadge]);
  useEffect(() => {
    ref.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [current]);
  // The underline is one element that slides to the selected tab.
  const [bar] = useHighlight(ref, (row) => row.querySelector('[aria-selected="true"]'), [current, children, size, showIcon, showCounter, showBadge]);
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
  return (
    <TabListContext.Provider value={{ size, showIcon, showCounter, showBadge }}>
      <div
        {...themeAttrs({ motion })}
        data-slot="tablist-wrap"
        data-size={size}
        className={cx('bui-tablist-wrap', `bui-tablist-wrap--${size}`, ready && 'bui-tablist-wrap--ready', className)}
      >
        {edge.left && (
          <div data-slot="tablist-slide" className="bui-tablist__slide bui-tablist__slide--left">
            <IconButton
              variant="ghost"
              size="xsm"
              label="Slide left"
              tooltip={false}
              tabIndex={-1}
              icon={<BuiltinIcon name="chevronLeft" size={24} />}
              onClick={() => slide(-1)}
            />
          </div>
        )}
        <div
          role="tablist"
          aria-label={label}
          data-slot="tablist"
          ref={ref}
          onKeyDown={onKeyDown}
          onPointerOver={(e) => {
            if (e.pointerType !== 'mouse' || motionOf(ref.current) !== 'enhanced') return;
            const t = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest('[role="tab"]:not(:disabled)'));
            const sel = /** @type {HTMLElement} */ (ref.current.querySelector('[aria-selected="true"]'));
            setNudge(t && sel && t !== sel ? (t.offsetLeft > sel.offsetLeft ? 6 : -6) : 0);
          }}
          onPointerLeave={() => setNudge(0)}
          className="bui-tablist"
          {...rest}
        >
          {children}
          {bar && (
            <span
              ref={indicator}
              data-slot="tablist-indicator"
              className="bui-tablist__indicator"
              aria-hidden="true"
              style={{ width: bar.w, transform: `translateX(${bar.x + nudge}px)` }}
            />
          )}
        </div>
        {edge.right && (
          <div data-slot="tablist-slide" className="bui-tablist__slide bui-tablist__slide--right">
            <IconButton
              variant="ghost"
              size="xsm"
              label="Slide right"
              tooltip={false}
              tabIndex={-1}
              icon={<BuiltinIcon name="chevronRight" size={24} />}
              onClick={() => slide(1)}
            />
          </div>
        )}
      </div>
    </TabListContext.Provider>
  );
}

function Tab({ value, icon, counter, badge, disabled = false, children, className, ...rest }) {
  const { current, setCurrent, uid, hasPanel } = useTabs();
  const { size, showIcon, showCounter, showBadge } = useContext(TabListContext);
  const selected = current === value;
  const hasIcon = showIcon && icon;
  return (
    <button
      type="button"
      role="tab"
      id={`${uid}-t-${value}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={hasPanel ? `${uid}-p` : undefined}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-slot="tab"
      className={cx('bui-tab', className)}
      onClick={() => setCurrent(value)}
      {...rest}
    >
      <span data-slot="tab-block" className="bui-tab__block">
        {hasIcon && (
          <span data-slot="tab-icon" className="bui-tab__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span data-slot="tab-text" className="bui-tab__text">
          <span data-slot="tab-label" className="bui-tab__label">
            {children}
          </span>
          {showCounter && counter != null && (
            <span data-slot="tab-counter" className="bui-tab__counter">
              {counter}
            </span>
          )}
        </span>
        {showBadge &&
          badge != null &&
          (typeof badge === 'object' ? badge : <Badge label={badge} variant="critical" size={size === 'sm' || size === 'md' ? 'sm' : 'md'} disabled={disabled} />)}
      </span>
      <span data-slot="tab-line" className="bui-tab__line" aria-hidden="true" />
    </button>
  );
}

function TabPanel({ children, className }) {
  const { current, uid } = useTabs();
  return (
    <div role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t-${current}`} tabIndex={0} data-slot="tabpanel" className={cx('bui-tabpanel', className)}>
      {children}
    </div>
  );
}
