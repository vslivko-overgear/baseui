import { h, cx, useState, useRef, useEffect, useLayoutEffect } from '../react.js';
import { Dialog } from '@base-ui/react/dialog';
import { Icon } from '../icons.js';
import { useFloating } from '../theme-flags.js';
import { describe } from '../doc.js';

export const MODAL_HEADER = { close: 'close', closeAndBack: 'close-and-back', titleOnly: 'title-only' };
const WITH_CLOSE = [MODAL_HEADER.close, MODAL_HEADER.closeAndBack];
// the visual viewport shrinks when the keyboard of a phone is open: the sheet then follows it
const KEYBOARD_GAP = 120;

function useVisualViewport(enabled) {
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const vv = typeof window === 'undefined' ? null : window.visualViewport;
    if (!enabled || !vv) return undefined;
    let frame = null;
    const read = () => { frame = null; setBox((b) => (b && b.height === vv.height && b.offsetTop === vv.offsetTop && b.scale === vv.scale ? b : { height: vv.height, offsetTop: vv.offsetTop, scale: vv.scale })); };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(read); };
    read();
    vv.addEventListener('resize', schedule); vv.addEventListener('scroll', schedule);
    return () => { vv.removeEventListener('resize', schedule); vv.removeEventListener('scroll', schedule); if (frame !== null) cancelAnimationFrame(frame); };
  }, [enabled]);
  return enabled ? box : null;
}
const keyboardStyle = (box) => (box !== null && box.scale === 1 && box.height < window.innerHeight - KEYBOARD_GAP ? { '--modal-visual-viewport-height': `${box.height}px`, '--modal-visual-viewport-offset-top': `${box.offsetTop}px` } : undefined);

/**
 * The dialog of the design system, on the Base UI Dialog: a centered window on a wide screen and a bottom sheet up to 1200px, which can be
 * dragged down by its header to close. A header (a title, a subtitle, the close and back buttons), a scrolling content and a footer of actions.
 */
export function Modal({
  title, subtitle, header = MODAL_HEADER.close, height = 'content', children, primaryAction, secondaryAction, onBack, closeLabel = 'Close', swipeToClose = true, backLabel = 'Back',
  floating, 'aria-label': ariaLabel, className, contentClassName, portalContainer, keepMounted, initialFocus, finalFocus, ref, open, defaultOpen = false, modal = true, onOpenChange, ...rest
}) {
  const isFloating = useFloating(floating);
  const [scrolled, setScrolled] = useState(false);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const hasTitle = title != null && title !== false;
  const hasSubtitle = hasTitle && subtitle != null && subtitle !== false;
  const hasHeader = header !== false;
  const hasClose = WITH_CLOSE.includes(header);
  const hasActions = primaryAction !== undefined || secondaryAction !== undefined;
  const keyboard = keyboardStyle(useVisualViewport(isOpen));
  const drag = useRef(null);
  const change = (next, details) => { if (open === undefined) setInnerOpen(next); if (!next) setScrolled(false); onOpenChange?.(next, details); };
  useEffect(() => { if (!isOpen) setScrolled(false); }, [isOpen]);

  // dragging the header down closes the sheet: a short fast flick or a long pull
  const swipe = !swipeToClose || !hasHeader ? {} : {
    onPointerDown: (e) => {
      if (e.button !== 0 || e.target.closest('button,a,input,textarea,select') || !window.matchMedia('(max-width: 1200px)').matches) return;
      const popup = e.currentTarget.closest('[role="dialog"]');
      if (!popup) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      popup.style.transition = 'none';
      drag.current = { y: e.clientY, t: performance.now(), dy: 0, popup, id: e.pointerId };
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      d.dy = Math.max(0, e.clientY - d.y);
      d.popup.style.transform = `translateY(${d.dy}px)`;
    },
    onPointerUp: (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      drag.current = null;
      d.popup.style.transition = '';
      if (d.dy > 96 || (d.dy > 24 && d.dy / (performance.now() - d.t) > 0.5)) { d.popup.style.transform = 'translateY(100%)'; change(false, { reason: 'swipe', event: e.nativeEvent }); } else d.popup.style.transform = '';
    },
    onPointerCancel: () => { const d = drag.current; if (d) { d.popup.style.transition = ''; d.popup.style.transform = ''; drag.current = null; } },
  };
  return h(Dialog.Root, { ...rest, defaultOpen, modal, open, onOpenChange: change },
    h(Dialog.Portal, { container: portalContainer, keepMounted },
      h(Dialog.Backdrop, { 'data-slot': 'modal-backdrop', className: 'bui-modal__backdrop', forceRender: true }),
      h(Dialog.Viewport, { 'data-slot': 'modal-viewport', className: 'bui-modal__viewport', style: keyboard, 'data-testid': 'modal-viewport' },
        h(Dialog.Popup, { ref, 'data-slot': 'modal', className: cx('bui-modal__popup', isFloating && 'bui-dialog--floating', className), 'data-height': height, 'data-scrolled': scrolled || undefined, 'data-testid': 'modal-root', 'aria-label': ariaLabel, initialFocus, finalFocus },
          hasHeader && h('header', { 'data-slot': 'modal-header', className: 'bui-modal__header', ...swipe, 'data-swipe': swipe.onPointerDown ? '' : undefined, 'data-header': header, 'data-scrolled': scrolled || undefined },
            header === MODAL_HEADER.closeAndBack && h('button', { 'data-slot': 'modal-icon-button', className: 'bui-modal__icon-button', type: 'button', onClick: onBack, disabled: !onBack, 'aria-label': backLabel, 'data-testid': 'modal-back-button' }, h(Icon, { name: 'arrowLeft', size: 24, 'aria-hidden': 'true' })),
            h('div', { 'data-slot': 'modal-title-block', className: 'bui-modal__title-block' },
              hasTitle && h(Dialog.Title, { 'data-slot': 'modal-title', className: 'bui-modal__title' }, title),
              hasSubtitle && h(Dialog.Description, { 'data-slot': 'modal-subtitle', className: 'bui-modal__subtitle' }, subtitle)),
            hasClose && h(Dialog.Close, { className: 'bui-modal__icon-button bui-modal__close-button', 'aria-label': closeLabel, 'data-testid': 'modal-close-button' }, h(Icon, { name: 'close', size: 24, 'aria-hidden': 'true' }))),
          !hasHeader && hasTitle && h(Dialog.Title, { className: 'bui-modal__visually-hidden' }, title),
          !hasClose && h(Dialog.Close, { className: 'bui-modal__visually-hidden', 'data-testid': 'modal-close-button' }, closeLabel),
          h('div', { 'data-slot': 'modal-content', className: cx('bui-modal__content', contentClassName), 'data-without-header': !hasHeader || undefined, 'data-testid': 'modal-content', onScroll: (e) => setScrolled(e.currentTarget.scrollTop > 0) }, children),
          hasActions && h('footer', { 'data-slot': 'modal-footer', className: 'bui-modal__actions' },
            primaryAction !== undefined && h('div', { 'data-slot': 'modal-action', className: 'bui-modal__action' }, primaryAction),
            secondaryAction !== undefined && h('div', { 'data-slot': 'modal-action', className: 'bui-modal__action' }, secondaryAction))))));
}
describe(Modal, 'The dialog: a centered window on a wide screen and a bottom sheet on small ones, built on the Base UI Dialog. The sheet can be dragged down by its header to close.', {
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open (uncontrolled)'],
  onOpenChange: ['(open: boolean, details) => void', null, 'Called when the dialog opens or closes'],
  title: ['ReactNode', null, 'Title of the window'],
  subtitle: ['ReactNode', null, 'Subtitle. Shown only together with the title and always takes one line'],
  header: ["'close' | 'close-and-back' | 'title-only' | false", "'close'", 'Header variant: close, back and close, title only, or no header'],
  height: ["'content' | 'viewport'", "'content'", 'Height by content or the whole available viewport'],
  floating: ['boolean', 'theme', 'A floating sheet on small screens: margins at the bottom and the sides, rounded on every side; by default it follows the Floating setting of the theme. On a wide screen the dialog already floats in the middle'],
  children: ['ReactNode', null, 'Main content of the window'],
  primaryAction: ['ReactNode', null, 'The primary action, usually a Button with variant="primary"'],
  secondaryAction: ['ReactNode', null, 'The secondary action, usually a Button with variant="secondary"'],
  onBack: ['() => void', null, 'Handler of the back button for header="close-and-back"'],
  swipeToClose: ['boolean', 'true', 'Swipe down on the header to close the bottom sheet (touch and mouse drag, narrow screens only)'],
  closeLabel: ['string', "'Close'", 'Accessible name of the close button'],
  backLabel: ['string', "'Back'", 'Accessible name of the back button'],
  'aria-label': ['string', null, 'Accessible name of the dialog when there is no visual title'],
  className: ['string', null, 'Extra class of the popup'],
  contentClassName: ['string', null, 'Extra class of the content part'],
  portalContainer: ['HTMLElement', null, 'Container of the portal; the body by default'],
  keepMounted: ['boolean', null, 'Keep the portal mounted after closing'],
  initialFocus: ['RefObject | boolean | function', null, 'Initial focus after opening'],
  finalFocus: ['RefObject | boolean | function', null, 'Focus after closing'],
  modal: ['boolean', 'true', 'Block the page behind the dialog'],
  ref: ['Ref<HTMLDivElement>', null, 'Ref to the popup'],
});
