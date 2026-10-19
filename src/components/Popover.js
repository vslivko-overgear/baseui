import { h, cx, useId, useRef, useEffect, useControllable } from '../react.js';
import { describe } from '../doc.js';
import { glassClass, outlineClass, usePresence, useMotion } from '../theme-flags.js';

export function Popover({ trigger, children, open, defaultOpen = false, onOpenChange, placement = 'bottom-start', glass, outline, motion, label, className, ...rest }) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const id = useId();
  const root = useRef(null);
  const level = useMotion(motion);
  const [shown, closing] = usePresence(isOpen, level === 'enhanced' ? 160 : 0);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onDoc = (e) => { if (!root.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); root.current.querySelector('[aria-haspopup]')?.focus(); } };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [isOpen, setOpen]);
  return h('span', { ref: root, className: cx('bui-popover', className), ...rest },
    h('span', { className: 'bui-popover__trigger' },
      typeof trigger === 'function'
        ? trigger({ 'aria-haspopup': 'dialog', 'aria-expanded': isOpen, 'aria-controls': isOpen ? id : undefined, onClick: () => setOpen(!isOpen) })
        : trigger),
    shown && h('div', { id, role: 'dialog', 'aria-label': label, className: cx('bui-popover__panel', glassClass(glass), outlineClass(outline), motion && `bui-motion--${motion}`), 'data-placement': placement, 'data-closing': closing || undefined }, children));
}
describe(Popover, 'A floating panel anchored to a trigger.', {
  trigger: ['(props) => ReactElement', null, 'Render function that receives the trigger props'],
  children: ['ReactNode', null, 'Panel content'],
  open: ['boolean', null, 'Open state'],
  defaultOpen: ['boolean', 'false', 'Initially open'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when it opens or closes'],
  placement: ["'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", "'bottom-start'", 'Where the panel appears'],
  label: ['string', null, 'Accessible name of the panel'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animation of opening and closing: off, basic (a quick fade), or enhanced (the panel grows from its trigger and plays out when it closes); by default the Animations setting of the theme'],
  glass: ['boolean', 'theme', 'Translucent, blurred panel; true or false overrides the Glass setting of the theme'],
  outline: ['boolean', 'theme', 'A thin rim around the panel (glassy when glass is on); true or false overrides the Outline setting of the theme'],
});
