import { h, cx, useId, useControllable } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

export function Collapsible({ title, open, defaultOpen = false, onOpenChange, disabled = false, children, className, ...rest }) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const uid = useId();
  return h('div', { 'data-slot': 'collapsible', className: cx('bui-collapsible', className), 'data-open': isOpen || undefined, ...rest },
    h('h3', { 'data-slot': 'collapsible-heading', className: 'bui-collapsible__heading' },
      h('button', {
        type: 'button', 'data-slot': 'collapsible-trigger', className: 'bui-collapsible__trigger', id: `${uid}-t`, 'aria-expanded': isOpen, 'aria-controls': `${uid}-p`,
        disabled, onClick: () => setOpen(!isOpen),
      }, h('span', null, title), h(Icon, { name: 'chevronDown', size: 20, 'data-slot': 'collapsible-chevron', className: 'bui-collapsible__chevron' }))),
    h('div', { 'data-slot': 'collapsible-panel', className: 'bui-collapsible__panel', 'data-open': isOpen || undefined },
      h('div', { role: 'region', id: `${uid}-p`, 'aria-labelledby': `${uid}-t`, inert: !isOpen, 'data-slot': 'collapsible-content', className: 'bui-collapsible__content' },
        h('div', { 'data-slot': 'collapsible-inner', className: 'bui-collapsible__inner' }, children))));
}
describe(Collapsible, 'A section that expands and collapses.', {
  title: ['ReactNode', null, 'Heading that toggles the content'],
  open: ['boolean', null, 'Open state'],
  defaultOpen: ['boolean', 'false', 'Initial state'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when toggled'],
  disabled: ['boolean', 'false', 'Prevent toggling'],
  children: ['ReactNode', null, 'Collapsible content'],
});

export function CollapsibleGroup({ items, multiple = false, value, defaultValue = [], onValueChange, className, ...rest }) {
  const [open, setOpen] = useControllable(value, defaultValue, onValueChange);
  const toggle = (v, on) => setOpen(on ? (multiple ? [...open, v] : [v]) : open.filter((x) => x !== v));
  return h('div', { 'data-slot': 'collapsible-group', className: cx('bui-collapsible-group', className), ...rest },
    items.map((it) => h(Collapsible, {
      key: it.value, title: it.title, disabled: it.disabled, open: open.includes(it.value), onOpenChange: (on) => toggle(it.value, on),
    }, it.content)));
}
describe(CollapsibleGroup, 'A set of collapsibles.', {
  items: ['Array<{ value: string; title: ReactNode; content: ReactNode; disabled?: boolean }>', null, 'Sections'],
  multiple: ['boolean', 'false', 'Allow several open sections'],
  value: ['string[]', null, 'Open sections'],
  defaultValue: ['string[]', '[]', 'Initially open sections'],
  onValueChange: ['(value: string[]) => void', null, 'Called when the open sections change'],
});
