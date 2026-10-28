import { h, cx, useControllable } from '../../react.js';
import { HoverCard } from './HoverCard.js';
import { Modal } from '../../components/Modal.js';
import { Button } from '../../components/Button.js';
import { Icon } from '../../icons.js';
import { SHEET_QUERY } from '../../components/Select.js';
import { useMediaQuery, useTouchScreen } from '../../theme-flags.js';
import { describe } from '../../doc.js';

const PLACEMENTS = {
  'top-left': ['top', 'start'], 'top-center': ['top', 'center'], 'top-right': ['top', 'end'],
  'bottom-left': ['bottom', 'start'], 'bottom-center': ['bottom', 'center'], 'bottom-right': ['bottom', 'end'],
  left: ['left', 'center'], right: ['right', 'center'],
};

/** The class that paints a hint bubble and its arrow for a variant (the colors live in molecules-b.css). */
export const getHintColor = (variant = 'default') => `og-hint--${['primary', 'gradient', 'blue', 'surface'].includes(variant) ? variant : 'default'}`;

/** The round "i" that opens a hint; it fills while the hint is open. */
const HintIcon = ({ open }) => h('span', { 'data-slot': 'hint-icon', className: 'og-hint__icon', 'data-open': open || undefined }, h(Icon, { name: 'info', size: 20 }));

/**
 * A short explanation next to a label or a control. It opens on hover or focus of its trigger (a tap on a touch screen) in a card that
 * is positioned by the Base UI PreviewCard. The trigger is the info icon, or your own `children`.
 */
export function Hint({
  text, content, placement = 'top-right', variant = 'default', maxWidth = 400, open, defaultOpen = false, onClose, withCross = false, children, isChildrenWithDefaultIcon = false,
  closeLabel = 'Close', triggerLabel = 'More information', clampToViewport = true, triggerDataId, className, ...rest
}) {
  const touch = useTouchScreen();
  const [isOpen, setOpen] = useControllable(open, defaultOpen, (next) => { if (!next) onClose?.(); });
  const [side, align] = PLACEMENTS[placement] ?? PLACEMENTS['top-right'];
  const own = !children;
  const trigger = own ? h(HintIcon, { open: isOpen })
    : isChildrenWithDefaultIcon ? h('span', { className: 'og-hint__with-icon' }, children, h(HintIcon, { open: isOpen })) : children;
  return h(HoverCard, {
    trigger,
    open: isOpen, onOpenChange: setOpen, openDelay: 100, closeDelay: 100, side, align, sideOffset: 8, arrow: true, contentClassName: cx('og-hint', getHintColor(variant)), maxWidth: clampToViewport ? maxWidth : undefined, ...(clampToViewport ? {} : { style: { maxWidth } }), triggerAs: own ? 'button' : 'span', className: cx('og-hint__trigger', className),
    triggerProps: { 'data-id': triggerDataId, ...(own ? { type: 'button', 'aria-label': triggerLabel } : {}), 'aria-expanded': isOpen, onClick: (e) => { e.stopPropagation(); setOpen(touch ? !isOpen : true); } }, ...rest,
  },
  h('div', { className: 'og-hint__body' },
    content ?? h('p', { className: 'og-hint__text' }, text),
    withCross && h('button', { type: 'button', className: 'og-hint__cross', 'aria-label': closeLabel, onClick: () => setOpen(false) }, h(Icon, { name: 'close', size: 16 }))));
}
describe(Hint, 'A short explanation that opens on hover, focus or tap next to a label or a control: the info icon (or your own trigger) and a card with an arrow, in five color variants.', {
  text: ['string', null, 'Plain text of the card'],
  content: ['ReactNode', null, 'Rich content of the card; replaces `text`'],
  placement: ["'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left' | 'right'", "'top-right'", 'Side of the trigger and the alignment against it'],
  variant: ["'default' | 'primary' | 'gradient' | 'blue' | 'surface'", "'default'", 'Color of the card and its arrow'],
  maxWidth: ['number', '400', 'Maximum width of the card, px'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open (uncontrolled)'],
  onClose: ['() => void', null, 'Called when the hint closes'],
  withCross: ['boolean', 'false', 'Show a cross in the corner of the card'],
  children: ['ReactNode', null, 'Your own trigger instead of the info icon'],
  isChildrenWithDefaultIcon: ['boolean', 'false', 'Show the info icon next to your own trigger'],
  closeLabel: ['string', "'Close'", 'Accessible name of the cross'],
  triggerLabel: ['string', "'More information'", 'Accessible name of the info icon button'],
  clampToViewport: ['boolean', 'true', 'Never wider than the viewport minus 16px'],
  triggerDataId: ['string', null, 'Applied as `data-id` on the trigger, for end-to-end selectors'],
  className: ['string', null, 'Extra class of the trigger'],
});

/**
 * The responsive hint: on a wide screen the gradient Hint, and up to 1200px a tap on the icon opens a bottom sheet
 * (the Modal) with the title, the content and a confirm button.
 */
export function HintWithDrawer({ title, content, confirmLabel = 'Got it', tooltipMaxWidth = 272, triggerClassName, triggerDataId, placement = 'top-center', variant = 'gradient' }) {
  const sheet = useMediaQuery(SHEET_QUERY);
  const [isOpen, setOpen] = useControllable(undefined, false);
  if (!sheet) return h(Hint, { maxWidth: tooltipMaxWidth, placement, variant, className: triggerClassName, content, triggerDataId, triggerLabel: title });
  return h('span', { className: 'og-hint__sheet-wrap' },
    h('button', { type: 'button', 'data-id': triggerDataId, 'aria-label': title, className: cx('og-hint__trigger', triggerClassName), onClick: () => setOpen(true) }, h(HintIcon, { open: isOpen })),
    h(Modal, { open: isOpen, onOpenChange: setOpen, title, header: 'close', secondaryAction: h(Button, { variant: 'secondary', width: '100%', onClick: () => setOpen(false) }, confirmLabel) },
      h('div', { className: 'og-hint__sheet-body' }, content)));
}
describe(HintWithDrawer, 'The responsive Hint: the gradient card on a wide screen, and up to 1200px a tap on the info icon opens a bottom sheet with a title, the content and a confirm button.', {
  title: ['string', null, 'Title of the sheet; also the accessible name of the icon'],
  content: ['ReactNode', null, 'Body of the card and of the sheet'],
  confirmLabel: ['string', "'Got it'", 'Label of the sheet button that closes it'],
  tooltipMaxWidth: ['number', '272', 'Maximum width of the card on a wide screen, px'],
  placement: ['HintPlacement', "'top-center'", 'Placement of the card on a wide screen'],
  variant: ["'default' | 'primary' | 'gradient' | 'blue' | 'surface'", "'gradient'", 'Color of the card on a wide screen'],
  triggerClassName: ['string', null, 'Extra class of the trigger'],
  triggerDataId: ['string', null, 'Applied as `data-id` on the trigger'],
});
