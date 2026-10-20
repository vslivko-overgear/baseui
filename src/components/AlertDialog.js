import { h } from '../react.js';
import { Modal, Button } from '../base.js';
import { describe } from '../doc.js';

export function AlertDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, destructive = false, floating }) {
  const close = () => onOpenChange(false);
  return h(Modal, {
    open, onOpenChange, title, floating, header: 'title-only',
    primaryAction: h(Button, { onClick: () => { onConfirm && onConfirm(); close(); }, customBackground: destructive ? 'var(--baseui-Extensions-Background-Error)' : undefined, variant: destructive ? 'custom' : 'primary', customColor: destructive ? '#ffffff' : undefined }, confirmLabel),
    secondaryAction: h(Button, { variant: 'secondary', onClick: close }, cancelLabel),
  }, description);
}
describe(AlertDialog, 'A dialog that asks the user to confirm or cancel.', {
  open: ['boolean', null, 'Open state'],
  floating: ['boolean', 'theme', 'A floating sheet on small screens (margins at the bottom and the sides, rounded on every side); by default it follows the Floating setting of the theme'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when it should open or close'],
  title: ['ReactNode', null, 'Question or statement'],
  description: ['ReactNode', null, 'Explains the consequence'],
  confirmLabel: ['string', "'Confirm'", 'Confirm button text'],
  cancelLabel: ['string', "'Cancel'", 'Cancel button text'],
  onConfirm: ['() => void', null, 'Called when confirmed'],
  destructive: ['boolean', 'false', 'Style the confirm button as destructive'],
});
