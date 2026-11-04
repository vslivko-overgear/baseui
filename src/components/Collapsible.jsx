import { cx, useId, useControllable } from '../react.js';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { describe } from '../doc.js';

export function Collapsible({ title, headingLevel = 3, open, defaultOpen = false, onOpenChange, disabled = false, children, className, ...rest }) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const uid = useId();
  const Heading = `h${headingLevel}`;
  return (
    <div data-slot="collapsible" className={cx('bui-collapsible', className)} data-open={isOpen || undefined} {...rest}>
      <Heading data-slot="collapsible-heading" className="bui-collapsible__heading">
        <button
          type="button"
          data-slot="collapsible-trigger"
          className="bui-collapsible__trigger"
          id={`${uid}-t`}
          aria-expanded={isOpen}
          aria-controls={`${uid}-p`}
          disabled={disabled}
          onClick={() => setOpen(!isOpen)}
        >
          <span>{title}</span>
          <BuiltinIcon name="chevronDown" size={20} data-slot="collapsible-chevron" className="bui-collapsible__chevron" />
        </button>
      </Heading>
      <div data-slot="collapsible-panel" className="bui-collapsible__panel" data-open={isOpen || undefined}>
        <div role="region" id={`${uid}-p`} aria-labelledby={`${uid}-t`} inert={!isOpen} data-slot="collapsible-content" className="bui-collapsible__content">
          <div data-slot="collapsible-inner" className="bui-collapsible__inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
describe(Collapsible, 'A section that expands and collapses: an island on the secondary background with its content inside it (a group of them is islands 8px apart, no dividers)', {
  title: ['ReactNode', null, 'Heading that toggles the content'],
  headingLevel: ['2 | 3 | 4 | 5 | 6', '3', 'The level of the heading: one below the heading of the page or of the section it belongs to (rule A9: no level is skipped)'],
  open: ['boolean', null, 'Open state'],
  defaultOpen: ['boolean', 'false', 'Initial state'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when toggled'],
  disabled: ['boolean', 'false', 'Prevent toggling'],
  children: ['ReactNode', null, 'Collapsible content'],
});

export function CollapsibleGroup({ items, headingLevel, multiple = false, value, defaultValue = [], onValueChange, className, ...rest }) {
  const [open, setOpen] = useControllable(value, defaultValue, onValueChange);
  const toggle = (v, on) => setOpen(on ? (multiple ? [...open, v] : [v]) : open.filter((x) => x !== v));
  return (
    <div data-slot="collapsible-group" className={cx('bui-collapsible-group', className)} {...rest}>
      {items.map((it) => (
        <Collapsible key={it.value} title={it.title} headingLevel={headingLevel} disabled={it.disabled} open={open.includes(it.value)} onOpenChange={(on) => toggle(it.value, on)}>
          {it.content}
        </Collapsible>
      ))}
    </div>
  );
}
describe(CollapsibleGroup, 'A set of collapsibles', {
  items: ['Array<{ value: string; title: ReactNode; content: ReactNode; disabled?: boolean }>', null, 'Sections'],
  headingLevel: ['2 | 3 | 4 | 5 | 6', '3', 'The level of the heading of every section (one below the heading of the page or of the section the group belongs to)'],
  multiple: ['boolean', 'false', 'Allow several open sections'],
  value: ['string[]', null, 'Open sections'],
  defaultValue: ['string[]', '[]', 'Initially open sections'],
  onValueChange: ['(value: string[]) => void', null, 'Called when the open sections change'],
});
