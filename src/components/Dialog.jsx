import { cx, useState, useRef, useEffect, useLayoutEffect } from '../react.js';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { useFloating } from '../theme-flags.js';
import { describe } from '../doc.js';
import { ControlSizeContext } from '../control-size.js';

export const DIALOG_HEADER = { close: 'close', closeAndBack: 'close-and-back', titleOnly: 'title-only' };
const WITH_CLOSE = [DIALOG_HEADER.close, DIALOG_HEADER.closeAndBack];
// the visual viewport shrinks when the keyboard of a phone is open: the sheet then follows it
const KEYBOARD_GAP = 120;

function useVisualViewport(enabled) {
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const vv = typeof window === 'undefined' ? null : window.visualViewport;
    if (!enabled || !vv) return undefined;
    let frame = null;
    const read = () => {
      frame = null;
      setBox((b) =>
        b && b.height === vv.height && b.offsetTop === vv.offsetTop && b.scale === vv.scale
          ? b
          : { height: vv.height, offsetTop: vv.offsetTop, scale: vv.scale },
      );
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(read);
    };
    read();
    vv.addEventListener('resize', schedule);
    vv.addEventListener('scroll', schedule);
    return () => {
      vv.removeEventListener('resize', schedule);
      vv.removeEventListener('scroll', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [enabled]);
  return enabled ? box : null;
}
const keyboardStyle = (box) =>
  box !== null && box.scale === 1 && box.height < window.innerHeight - KEYBOARD_GAP
    ? { '--dialog-visual-viewport-height': `${box.height}px`, '--dialog-visual-viewport-offset-top': `${box.offsetTop}px` }
    : undefined;

// Opened with a finger or a mouse, a dialog does not move the focus onto its first control (a ring on the close button that nobody asked for); opened with the keyboard it does, as a keyboard user needs.
// the last thing the person used, the keyboard or a pointer (a dialog opened by code has no trigger to ask)
let lastWasKeyboard = false;
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', () => { lastWasKeyboard = true; }, true);
  document.addEventListener('pointerdown', () => { lastWasKeyboard = false; }, true);
}
const focusOnKeyboard = () => lastWasKeyboard;

/**
 * The dialog of the design system, on the Base UI Dialog: a centered window on a wide screen and a bottom sheet below 768px, which can be
 * dragged down by its header to close. A header (a title, a subtitle, the close and back buttons), a scrolling content and a footer of actions.
 */
export function Dialog({
  title,
  subtitle,
  header = DIALOG_HEADER.close,
  height = 'content',
  children,
  primaryAction,
  secondaryAction,
  onBack,
  closeLabel = 'Close',
  swipeToClose = true,
  backLabel = 'Back',
  floating,
  'aria-label': ariaLabel,
  className,
  contentClassName,
  portalContainer,
  keepMounted,
  initialFocus = focusOnKeyboard,
  finalFocus,
  ref,
  open,
  defaultOpen = false,
  modal = true,
  onOpenChange,
  ...rest
}) {
  const isFloating = useFloating(floating);
  const [scrolled, setScrolled] = useState(false);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const hasTitle = title != null && title !== false;
  const hasSubtitle = hasTitle && subtitle != null && subtitle !== false;
  const hasHeader = Boolean(header);
  const hasClose = WITH_CLOSE.includes(header);
  const hasActions = primaryAction !== undefined || secondaryAction !== undefined;
  const keyboard = keyboardStyle(useVisualViewport(isOpen));
  const drag = useRef(null);
  const change = (next, details) => {
    if (open === undefined) setInnerOpen(next);
    if (!next) setScrolled(false);
    onOpenChange?.(next, details);
  };
  useEffect(() => {
    if (!isOpen) setScrolled(false);
  }, [isOpen]);

  // dragging the header down closes the sheet: a short fast flick or a long pull
  const swipe =
    !swipeToClose || !hasHeader
      ? {}
      : {
          onPointerDown: (e) => {
            if (e.button !== 0 || e.target.closest('button,a,input,textarea,select') || !window.matchMedia('(max-width: 767px)').matches) return;
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
            if (d.dy > 96 || (d.dy > 24 && d.dy / (performance.now() - d.t) > 0.5)) {
              d.popup.style.transform = 'translateY(100%)';
              change(false, { reason: 'swipe', event: e.nativeEvent });
            } else d.popup.style.transform = '';
          },
          onPointerCancel: () => {
            const d = drag.current;
            if (d) {
              d.popup.style.transition = '';
              d.popup.style.transform = '';
              drag.current = null;
            }
          },
        };
  return (
    <BaseDialog.Root {...rest} defaultOpen={defaultOpen} modal={modal} open={open} onOpenChange={change}>
      <BaseDialog.Portal container={portalContainer} keepMounted={keepMounted}>
        <BaseDialog.Backdrop data-slot="dialog-backdrop" className="bui-dialog__backdrop" forceRender />
        <BaseDialog.Viewport data-slot="dialog-viewport" className="bui-dialog__viewport" style={keyboard} data-testid="dialog-viewport">
          <BaseDialog.Popup
            ref={ref}
            data-slot="dialog"
            className={cx('bui-dialog__popup', isFloating && 'bui-dialog--floating', className)}
            data-height={height}
            data-scrolled={scrolled || undefined}
            data-testid="dialog-root"
            aria-label={ariaLabel}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            // a control with `data-dialog-close` closes its own dialog (not the one around it: a dialog in a portal bubbles its events through the React tree)
            onClick={(e) => {
              const target = /** @type {Element} */ (e.target).closest?.('[data-dialog-close]');
              if (target && target.closest('[data-slot="dialog"]') === e.currentTarget) change(false, { reason: 'close-press', event: e.nativeEvent });
            }}
          >
            {hasHeader && (
              <header
                data-slot="dialog-header"
                className="bui-dialog__header"
                {...swipe}
                data-swipe={swipe.onPointerDown ? '' : undefined}
                data-header={header}
                data-scrolled={scrolled || undefined}
              >
                {header === DIALOG_HEADER.closeAndBack && (
                  <button
                    data-slot="dialog-icon-button"
                    className="bui-dialog__icon-button"
                    type="button"
                    onClick={onBack}
                    disabled={!onBack}
                    aria-label={backLabel}
                    data-testid="dialog-back-button"
                  >
                    <BuiltinIcon name="arrowLeft" size={24} aria-hidden="true" />
                  </button>
                )}
                <div data-slot="dialog-title-block" className="bui-dialog__title-block">
                  {hasTitle && (
                    <BaseDialog.Title data-slot="dialog-title" className="bui-dialog__title">
                      {title}
                    </BaseDialog.Title>
                  )}
                  {hasSubtitle && (
                    <BaseDialog.Description data-slot="dialog-subtitle" className="bui-dialog__subtitle">
                      {subtitle}
                    </BaseDialog.Description>
                  )}
                </div>
                {hasClose && (
                  <BaseDialog.Close className="bui-dialog__icon-button bui-dialog__close-button" aria-label={closeLabel} data-testid="dialog-close-button">
                    <BuiltinIcon name="close" size={24} aria-hidden="true" />
                  </BaseDialog.Close>
                )}
              </header>
            )}
            {!hasHeader && hasTitle && <BaseDialog.Title className="bui-dialog__visually-hidden">{title}</BaseDialog.Title>}
            {!hasClose && (
              <BaseDialog.Close className="bui-dialog__visually-hidden" data-testid="dialog-close-button">
                {closeLabel}
              </BaseDialog.Close>
            )}
            <div
              data-slot="dialog-content"
              className={cx('bui-dialog__content', contentClassName)}
              data-without-header={!hasHeader || undefined}
              data-testid="dialog-content"
              onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
            >
              {children}
            </div>
            {hasActions && (
              <footer data-slot="dialog-footer" className="bui-dialog__actions">
                {/* the buttons of a sheet are large (56px, text 16) unless one says otherwise */}
                <ControlSizeContext.Provider value="lg">
                  {primaryAction !== undefined && (
                    <div data-slot="dialog-action" className="bui-dialog__action">
                      {primaryAction}
                    </div>
                  )}
                  {secondaryAction !== undefined && (
                    <div data-slot="dialog-action" className="bui-dialog__action">
                      {secondaryAction}
                    </div>
                  )}
                </ControlSizeContext.Provider>
              </footer>
            )}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
describe(
  Dialog,
  'The dialog: a centered window on a wide screen and a bottom sheet on small ones, built on the Base UI Dialog. The sheet can be dragged down by its header to close. A control inside it with `data-dialog-close` (a Close or Done button) closes the dialog without wiring an onClick',
  {
    open: ['boolean', null, 'Open state (controlled)'],
    defaultOpen: ['boolean', 'false', 'Initially open (uncontrolled)'],
    onOpenChange: ['(open: boolean, details) => void', null, 'Called when the dialog opens or closes'],
    title: ['ReactNode', null, 'Title of the window'],
    subtitle: ['ReactNode', null, 'Subtitle. Shown only together with the title and always takes one line'],
    header: ["'close' | 'close-and-back' | 'title-only' | false", "'close'", 'Header variant: close, back and close, title only, or no header'],
    height: ["'content' | 'viewport'", "'content'", 'Height by content or the whole available viewport'],
    floating: [
      'boolean',
      'theme',
      'A floating sheet on small screens: margins at the bottom and the sides, rounded on every side; by default it follows the Floating setting of the theme. On a wide screen the dialog already floats in the middle',
    ],
    children: ['ReactNode', null, 'Main content of the window'],
    primaryAction: ['ReactNode', null, 'The primary action, usually a Button with variant="primary"; the buttons of the actions are large (56px, text 16) by default'],
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
    initialFocus: ['RefObject | boolean | function', 'keyboard only', 'Initial focus after opening: by default the focus goes into the dialog only when the last thing the person used was the keyboard; after a finger or a mouse, or when it is opened by code, nothing is focused, so no ring shows on its first control'],
    finalFocus: ['RefObject | boolean | function', null, 'Focus after closing'],
    modal: ['boolean', 'true', 'Block the page behind the dialog'],
    ref: ['Ref<HTMLDivElement>', null, 'Ref to the popup'],
  },
);
