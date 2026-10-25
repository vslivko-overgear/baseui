import { h, cx, useId, useState, useRef, useEffect, React } from '../react.js';
import { describe } from '../doc.js';
import { useTouchScreen } from '../theme-flags.js';

export function Tooltip({ content, placement = 'top', delay = 300, children, className, ...rest }) {
  const [open, setOpen] = useState(false);
  const touch = useTouchScreen();
  const id = useId();
  const timer = useRef();
  const show = () => { clearTimeout(timer.current); if (!touch) timer.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(timer.current); setOpen(false); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const child = React.isValidElement(children)
    ? React.cloneElement(children, { 'aria-describedby': open ? id : undefined })
    : children;
  return h('span', {
    'data-slot': 'tooltip', className: cx('bui-tooltip', className), onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, ...rest,
  }, child,
    open && !touch && h('span', { role: 'tooltip', id, 'data-slot': 'tooltip-bubble', className: 'bui-tooltip__bubble', 'data-placement': placement }, content));
}

describe(Tooltip, 'A short hint on hover or focus. It is never shown on a touch screen (no hover there), so keep the information available some other way.', {
  content: ['ReactNode', null, 'Hint text'],
  placement: ["'top' | 'bottom' | 'left' | 'right'", "'top'", 'Side it appears on'],
  delay: ['number', '300', 'Show delay, ms'],
  children: ['ReactElement', null, 'Trigger element (receives `aria-describedby`)'],
});
