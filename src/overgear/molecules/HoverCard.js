import { h, cx, useControllable } from '../../react.js';
import { PreviewCard } from '@base-ui/react/preview-card';
import { describe } from '../../doc.js';

/**
 * A card that opens over its trigger on hover or keyboard focus and closes when the pointer leaves. It is the Base UI PreviewCard
 * (hover intent delays, flipping, collision padding) with the Overgear surface and an optional arrow. Everything it shows must also be
 * reachable some other way: there is no hover on a touch screen.
 */
export function HoverCard({
  trigger, children, side = 'bottom', align = 'center', sideOffset = 8, openDelay = 700, closeDelay = 300, open, defaultOpen = false, onOpenChange,
  arrow = false, maxWidth, triggerAs = 'span', triggerProps, portalContainer, className, contentClassName, ...rest
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return h(PreviewCard.Root, { open: isOpen, onOpenChange: (next) => setOpen(next) },
    h(PreviewCard.Trigger, { render: (props) => h(triggerAs, props), delay: openDelay, closeDelay, 'data-slot': 'hover-card-trigger', className: cx('og-hover-card__trigger', className), ...triggerProps }, trigger),
    h(PreviewCard.Portal, { container: portalContainer },
      h(PreviewCard.Positioner, { side, align, sideOffset, collisionPadding: 8, className: 'og-hover-card__positioner' },
        h(PreviewCard.Popup, { 'data-slot': 'hover-card', className: cx('og-hover-card', contentClassName), style: maxWidth ? { maxWidth: `min(${maxWidth}px, calc(100vw - 16px))` } : undefined, ...rest },
          arrow && h(PreviewCard.Arrow, { className: 'og-hover-card__arrow' }, h('svg', { width: 20, height: 10, viewBox: '0 0 20 10', 'aria-hidden': 'true' }, h('path', { d: 'M0 10 8.6 1.4a2 2 0 0 1 2.8 0L20 10Z', fill: 'currentColor' }))),
          children))));
}
describe(HoverCard, 'A card that opens over its trigger on hover or keyboard focus and closes when the pointer leaves: the Base UI PreviewCard with the Overgear surface, collision-aware positioning and an optional arrow. It never opens on touch, so keep its content reachable another way.', {
  trigger: ['ReactNode', null, 'The element that opens the card (rendered inside a `span` by default)'],
  children: ['ReactNode', null, 'Card content'],
  side: ["'top' | 'right' | 'bottom' | 'left'", "'bottom'", 'Preferred side of the trigger'],
  align: ["'start' | 'center' | 'end'", "'center'", 'Alignment against the trigger'],
  sideOffset: ['number', '8', 'Distance from the trigger, px'],
  openDelay: ['number', '700', 'Delay between the pointer entering the trigger and the card opening, ms'],
  closeDelay: ['number', '300', 'Delay between the pointer leaving and the card closing, ms'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open (uncontrolled)'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when the card opens or closes'],
  arrow: ['boolean', 'false', 'Show an arrow that points at the trigger'],
  maxWidth: ['number', null, 'Maximum width, px; never wider than the viewport minus 16px'],
  triggerAs: ["'span' | 'a' | 'button'", "'span'", 'Element the trigger is rendered as'],
  triggerProps: ['object', null, 'Extra props of the trigger element'],
  portalContainer: ['HTMLElement', null, 'Container of the portal; the body by default'],
  className: ['string', null, 'Extra class of the trigger'],
  contentClassName: ['string', null, 'Extra class of the card'],
});
