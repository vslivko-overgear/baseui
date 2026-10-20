import { h, cx, useId, useRef, useEffect, useControllable } from '../react.js';
import { describe } from '../doc.js';
import { glassClass, usePresence, useMotion } from '../theme-flags.js';
import { Floating, useAnchoredPosition, panelStyle } from '../floating.js';

export function Popover({ trigger, children, open, defaultOpen = false, onOpenChange, placement = 'bottom-start', glass, motion, label, className, panelClassName, matchWidth = false, ...rest }) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const id = useId();
  const root = useRef(null);
  const panel = useRef(null);
  const level = useMotion(motion);
  const [shown, closing] = usePresence(isOpen, level === 'enhanced' ? 160 : 0);
  const pos = useAnchoredPosition(shown, root, panel, placement, matchWidth);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onDoc = (e) => { if (!root.current.contains(e.target) && !panel.current?.contains(e.target)) setOpen(false); };
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
    shown && h(Floating, null, h('div', { ref: panel, style: panelStyle(pos), id, role: 'dialog', 'aria-label': label, className: cx('bui-popover__panel', panelClassName, glassClass(glass), motion && `bui-motion--${motion}`), 'data-placement': pos?.placement ?? placement, 'data-closing': closing || undefined }, children)));
}
describe(Popover, 'A floating panel anchored to a trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container.', {
  trigger: ['(props) => ReactElement', null, 'Render function that receives the trigger props'],
  children: ['ReactNode', null, 'Panel content'],
  open: ['boolean', null, 'Open state'],
  defaultOpen: ['boolean', 'false', 'Initially open'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when it opens or closes'],
  placement: ["'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", "'bottom-start'", 'Where the panel appears'],
  label: ['string', null, 'Accessible name of the panel'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animation of opening and closing: off, basic (a quick fade), or enhanced (the panel grows from its trigger and plays out when it closes); by default the Animations setting of the theme'],
  glass: ['boolean', 'theme', 'Translucent, blurred panel; true or false overrides the Glass setting of the theme'],
});
