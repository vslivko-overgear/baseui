import { cx, useState } from '../react.js';
import { describe } from '../doc.js';
import { useMediaQuery, useTouchScreen } from '../theme-flags.js';
import { Tooltip } from './Tooltip.jsx';
import { Dialog } from './Dialog.jsx';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';

/**
 * A small question mark that explains something next to it. With a mouse the text shows as a tooltip; on a touch screen or a phone, where there is no hover,
 * a tap opens a dialog with the same text and a button that closes it (no header). The hint is a button either way: it is reached with the keyboard, too.
 */
export function Hint({ content, label = 'More information', closeLabel = 'Close', size = 16, placement = 'top', children, className, ...rest }) {
  const [open, setOpen] = useState(false);
  const touch = useTouchScreen();
  const phone = useMediaQuery('(max-width: 767px)');
  const sheet = touch || phone;
  const trigger = (
    <button type="button" data-slot="hint" className={cx('bui-hint', children && 'bui-hint--wrap', className)} aria-label={label} aria-haspopup={sheet ? 'dialog' : undefined} onClick={sheet ? () => setOpen(true) : undefined} {...rest}>
      {children ?? <Icon name="HelpCircle" size={size} />}
    </button>
  );
  if (!sheet) return <Tooltip content={content} placement={placement}>{trigger}</Tooltip>;
  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen} header={false} aria-label={label} className="bui-hint__dialog" primaryAction={<Button variant="secondary" size="lg" width="100%" label={closeLabel} onClick={() => setOpen(false)} />}>
        <p className="bui-hint__text">{content}</p>
      </Dialog>
    </>
  );
}

describe(Hint, 'A question mark (or any small element you give it, such as a badge) that explains something: a tooltip with a mouse, a dialog with the text and a Close button on a touch screen or a phone (a tooltip has no hover there)', {
  content: ['ReactNode', null, 'The text of the hint'],
  label: ['string', "'More information'", 'Accessible name of the question mark'],
  closeLabel: ['string', "'Close'", 'Label of the button that closes the dialog on a touch screen'],
  size: ['number', '16', 'Size of the icon, px'],
  placement: ["'top' | 'bottom' | 'left' | 'right'", "'top'", 'Side of the tooltip with a mouse'],
  children: ['ReactNode', null, 'What to press instead of the question mark, for example a Badge: the whole thing then explains itself (a tooltip with a mouse, the dialog on a touch screen). Give it a `label` that says what it explains'],
});
