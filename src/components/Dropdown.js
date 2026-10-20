import { h, cx, useEffect, useId, useMemo, useRef, useState, useControllable } from '../react.js';
import { Button } from './Button.js';
import { describe } from '../doc.js';
import { glassClass, usePresence, useMotion } from '../theme-flags.js';
import { Floating, useAnchoredPosition, panelStyle } from '../floating.js';
import { DropdownItemContent, DropdownGroup, DropdownDivider, DropdownSelectAll, CheckMark, trackSelection, itemClass, isOption } from '../../lib/Dropdown.js';

/**
 * A menu of options that opens from any trigger. It is standalone: no field, no Selector. Selector and Typeahead draw
 * their lists with the same items, groups and dividers.
 */
export function Dropdown({
  trigger, options, value, defaultValue, onValueChange, multiple = false, selectAll = false, open, defaultOpen = false, onOpenChange,
  placement = 'bottom-start', glass, motion, label, className, ...rest
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [selected, setSelected] = useControllable(value, defaultValue ?? (multiple ? [] : null), onValueChange);
  const [active, setActive] = useState(-1);
  const root = useRef(null);
  const level = useMotion(motion);
  const [shown, closing] = usePresence(isOpen, level === 'enhanced' ? 160 : 0);
  const panel = useRef(null);
  const pos = useAnchoredPosition(shown, root, panel, placement);
  const id = useId();
  const real = useMemo(() => options.filter(isOption), [options]);
  const enabled = real.filter((o) => !o.disabled);
  const isOn = (o) => (multiple ? (selected || []).includes(o.value) : selected === o.value);
  const allOn = multiple && enabled.length > 0 && enabled.every(isOn);

  useEffect(() => {
    if (!isOpen) { setActive(-1); return undefined; }
    const first = enabled.findIndex(isOn);
    setActive(first >= 0 ? first : 0);
    panel.current?.focus();
    const onDoc = (e) => { if (!root.current.contains(e.target) && !panel.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [isOpen]);

  const choose = (o) => {
    if (!o || o.disabled) return;
    if (multiple) setSelected(isOn(o) ? selected.filter((v) => v !== o.value) : [...(selected || []), o.value]);
    else { setSelected(o.value); setOpen(false); root.current.querySelector('[aria-haspopup]')?.focus(); }
  };
  const onKeyDown = (e) => {
    const last = enabled.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, last)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(last); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(enabled[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); root.current.querySelector('[aria-haspopup]')?.focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };
  useEffect(() => { panel.current?.querySelector('[data-highlighted]')?.scrollIntoView({ block: 'nearest' }); }, [active]);

  const triggerProps = { 'aria-haspopup': 'listbox', 'aria-expanded': isOpen, 'aria-controls': isOpen ? id : undefined, onClick: () => setOpen(!isOpen) };
  let n = -1;
  return h('span', { ref: root, className: cx('bui-dropdown-root', className), ...rest },
    typeof trigger === 'function' ? trigger(triggerProps) : (trigger ?? h(Button, { variant: 'secondary', ...triggerProps }, 'Open')),
    shown && h(Floating, null, h('div', { ref: (el) => { panel.current = el; trackSelection(el); }, style: panelStyle(pos), id, role: 'listbox', tabIndex: -1, 'aria-label': label, 'aria-multiselectable': multiple || undefined, className: cx('bui-dropdown bui-dropdown--standalone', glassClass(glass), motion && `bui-motion--${motion}`), 'data-placement': pos?.placement ?? placement, 'data-closing': closing || undefined, onKeyDown },
      multiple && selectAll && h(DropdownSelectAll, { label: allOn ? 'Remove all' : 'Select all', onClick: () => setSelected(allOn ? [] : enabled.map((o) => o.value)) }),
      options.map((o, i) => {
        if (o.type === 'group') return h(DropdownGroup, { key: `g${i}`, label: o.label });
        if (o.type === 'divider') return h(DropdownDivider, { key: `d${i}` });
        const index = o.disabled ? -1 : enabled.indexOf(o);
        return h('div', {
          key: o.value, role: 'option', 'aria-selected': isOn(o), 'aria-disabled': o.disabled || undefined, 'data-highlighted': index === active && index >= 0 ? '' : undefined, tabIndex: -1,
          className: itemClass(o), onClick: () => choose(o), onPointerMove: () => index >= 0 && setActive(index),
        }, h(DropdownItemContent, { option: o, check: h('span', { className: 'bui-dropdown__check' }, h(CheckMark)) }));
      }))));
}
describe(Dropdown, 'A menu of options that opens from any trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container. It stands alone: Selector and Typeahead draw their lists with the same items, groups and dividers.', {
  trigger: ['ReactNode | (props) => ReactElement', null, 'What opens the menu; a render function receives the trigger props. Default: an Open button'],
  options: ['Array<{ value; label; details?; icon?; avatar?; subitem?; disabled? } | { type: \'group\'; label } | { type: \'divider\' }>', null, 'Items, group titles and dividers'],
  value: ['string | string[] | null', null, 'Selected value, or the values when `multiple` (controlled)'],
  defaultValue: ['string | string[] | null', null, 'Initial selection (uncontrolled)'],
  onValueChange: ['(value) => void', null, 'Called when the selection changes'],
  multiple: ['boolean', 'false', 'Several items can be selected; the menu stays open'],
  selectAll: ['boolean', 'false', 'Multiple only: a "Select all" / "Remove all" row above the items'],
  open: ['boolean', null, 'Open state (controlled)'],
  defaultOpen: ['boolean', 'false', 'Initially open'],
  onOpenChange: ['(open: boolean) => void', null, 'Called when it opens or closes'],
  placement: ["'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", "'bottom-start'", 'Where the menu appears'],
  label: ['string', null, 'Accessible name of the menu'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animation of opening and closing: off, basic (a quick fade), or enhanced (the menu grows from its trigger, and it plays out when it closes); by default the Animations setting of the theme'],
  glass: ['boolean', 'theme', 'Translucent, blurred menu; true or false overrides the Glass setting of the theme'],
});
