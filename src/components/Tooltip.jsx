import { cx, useId, useState, useRef, useEffect, React } from '../react.js';
import { describe } from '../doc.js';
import { useTouchScreen } from '../theme-flags.js';
import { Floating, useAnchoredSide } from '../floating.js';

export function Tooltip({ content, placement = 'top', delay = 300, children, className, ...rest }) {
  const [open, setOpen] = useState(false);
  const touch = useTouchScreen();
  const id = useId();
  const timer = useRef();
  const root = useRef(null);
  const bubble = useRef(null);
  const pos = useAnchoredSide(open && !touch, root, bubble, placement);
  const show = () => {
    clearTimeout(timer.current);
    if (!touch) timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const child = React.isValidElement(children) ? React.cloneElement(children, { 'aria-describedby': open ? id : undefined }) : children;
  return (
    <span ref={root} data-slot="tooltip" className={cx('bui-tooltip', className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} {...rest}>
      {child}
      {open && !touch && (
        <Floating>
          <span
            ref={bubble}
            role="tooltip"
            id={id}
            data-slot="tooltip-bubble"
            className="bui-tooltip__bubble"
            data-placement={pos?.side ?? placement}
            style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
          >
            {content}
          </span>
        </Floating>
      )}
    </span>
  );
}

describe(Tooltip, 'A short hint on hover or focus. It is never shown on a touch screen (no hover there), so keep the information available some other way', {
  content: ['ReactNode', null, 'Hint text'],
  placement: ["'top' | 'bottom' | 'left' | 'right'", "'top'", 'Side it appears on; the opposite side is used when there is no room in the window, and it is kept inside the window'],
  delay: ['number', '300', 'Show delay, ms'],
  children: ['ReactElement', null, 'Trigger element (receives `aria-describedby`)'],
});
