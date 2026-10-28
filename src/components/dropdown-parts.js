// Dropdown parts shared by the standalone Dropdown, Selector and Typeahead: the item markup, groups, dividers and the select-all row,
// plus the adapter that draws them with the Base UI parts of a Select or a Combobox. Specs follow the Figma "Menu" and "Menu Item".
import { h, Fragment, useMemo } from '../react.js';
import { Icon } from '../icons.js';

/** Entries of `options`: an option `{ value, label, details?, icon?, avatar?, subitem?, disabled? }`, a group title `{ type: 'group', label }` or a divider `{ type: 'divider' }`. */
export const isOption = (o) => o && o.type !== 'group' && o.type !== 'divider';
/** The text of an option for matching and for the accessible name: its `textValue`, a string label, or the fallback. */
export const optionLabel = (o, fallback) => (o ? (o.textValue ? o.textValue : typeof o.label === 'string' ? o.label : fallback) : fallback);

export const CheckMark = () => h(Icon, { name: 'check', size: 24, 'aria-hidden': 'true' });

const Avatar = (o) => o.avatar && h('img', { 'data-slot': 'dropdown-avatar', className: 'bui-dropdown__avatar', src: o.avatar, alt: '', 'aria-hidden': 'true' });
const OptionIcon = (o) => !o.avatar && o.icon && h('span', { 'data-slot': 'dropdown-icon', className: 'bui-dropdown__icon', 'aria-hidden': 'true' }, o.icon);

/** The inside of an item: icon or avatar, label, details and a check mark for the selected one. */
export function DropdownItemContent({ option: o, ids = {}, check }) {
  return h(Fragment, null, Avatar(o), OptionIcon(o),
    h('span', { id: ids.label, 'data-slot': 'dropdown-label', className: 'bui-dropdown__label' }, o.label),
    o.details && h('span', { id: ids.details, 'data-slot': 'dropdown-details', className: 'bui-dropdown__details' }, o.details),
    check);
}
export const itemClass = (o) => `bui-dropdown__item${o.subitem ? ' bui-dropdown__item--subitem' : ''}`;
export const DropdownGroup = ({ label }) => h('div', { 'data-slot': 'dropdown-group', className: 'bui-dropdown__group', role: 'presentation' }, label);
export const DropdownDivider = () => h('div', { 'data-slot': 'dropdown-divider', className: 'bui-dropdown__divider', role: 'separator' });
/** The "Select all" / "Remove all" row of a multiple dropdown. */
export const DropdownSelectAll = ({ label, onClick }) => h('div', {
  'data-slot': 'dropdown-select-all', className: 'bui-dropdown__item bui-dropdown__select-all', role: 'button', tabIndex: -1, onClick,
  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } },
}, h('span', { 'data-slot': 'dropdown-label', className: 'bui-dropdown__label' }, label));

/**
 * A ref for the panel of any dropdown (standalone, Selector, Typeahead): it keeps `data-was` on the items that were selected before the panel started closing,
 * so a menu that plays out after a choice does not show the new check mark on a fading panel (see the menu CSS).
 */
export function trackSelection(panel) {
  if (!panel || panel.__track) return;
  const closing = () => panel.hasAttribute('data-closing') || panel.hasAttribute('data-ending-style');
  const take = () => {
    if (closing()) return;
    panel.querySelectorAll('.bui-dropdown__item').forEach((it) => {
      const on = it.getAttribute('aria-selected') === 'true' || it.hasAttribute('data-selected');
      if (on) it.setAttribute('data-was', ''); else it.removeAttribute('data-was');
    });
  };
  // a choice and the closing come in separate commits, so the snapshot waits a moment and is dropped if the panel starts closing
  let timer = 0;
  const snap = () => { clearTimeout(timer); if (!closing()) timer = setTimeout(take, 80); };
  const ob = new MutationObserver(snap);
  ob.observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-selected', 'data-selected', 'data-closing', 'data-ending-style'] });
  panel.__track = ob; take();
}

/**
 * Draws the list of a Selector or a Typeahead.
 * @param parts     Base UI parts of the host: `{ Portal, Positioner, Popup, List, Item, Indicator, ItemText?, Empty? }`.
 * @param size      `sm` or `md` (default): follows the size of the field it opens from.
 * @param mode      `select` renders the options as children (groups, dividers and select-all supported), `combobox` as a render function (filtered list and empty state).
 * @param selectAll `{ label, onClick }` shows the select-all row above the list.
 */
export function DropdownList({ parts, mode = 'select', size = 'md', positionerRef, anchor, menu = false, options, idBase, testIdPrefix, emptyText, selectAll }) {
  const { Portal, Positioner, Popup, List, Item, ItemText, Indicator, Empty } = parts;
  const real = useMemo(() => options.filter(isOption), [options]);
  const byValue = useMemo(() => new Map(real.map((o) => [o.value, o])), [real]);
  const option = (o, index) => {
    const labelId = `${idBase}-${index}-label`, detailsId = `${idBase}-${index}-details`;
    const common = { 'data-slot': 'dropdown-item', className: itemClass(o), value: o.value, disabled: o.disabled, 'data-testid': `${testIdPrefix}-${o.value}`, 'aria-labelledby': labelId, 'aria-describedby': o.details ? detailsId : undefined };
    const check = h(Indicator, { 'data-slot': 'dropdown-check', className: 'bui-dropdown__check', keepMounted: true }, h(CheckMark));
    // the Select item text is a Base UI part of its own, so the label is drawn here and not by DropdownItemContent
    if (mode === 'select') {
      return h(Item, { key: o.value, ...common, label: optionLabel(o, o.value) }, Avatar(o), OptionIcon(o),
        h(ItemText, { id: labelId, 'data-slot': 'dropdown-label', className: 'bui-dropdown__label' }, o.label),
        o.details && h('span', { id: detailsId, 'data-slot': 'dropdown-details', className: 'bui-dropdown__details' }, o.details), check);
    }
    return h(Item, { key: o.value, ...common, index }, h(DropdownItemContent, { option: o, ids: { label: labelId, details: detailsId }, check }));
  };
  let n = -1;
  const children = options.map((o, i) => (o.type === 'group' ? h(DropdownGroup, { key: `g${i}`, label: o.label }) : o.type === 'divider' ? h(DropdownDivider, { key: `d${i}` }) : option(o, ++n)));
  return h(Portal, null,
    h(Positioner, { ref: positionerRef, 'data-slot': 'dropdown-positioner', className: `bui-choice-popup__positioner${menu ? ' bui-select-menu' : ''}`, anchor: menu ? undefined : anchor, sideOffset: 8, align: 'start', ...(mode === 'select' ? { alignItemWithTrigger: false } : {}), collisionPadding: 8 },
      h(Popup, { ref: trackSelection, 'data-slot': 'dropdown-popup', 'data-size': size || 'md', className: `bui-choice-popup__popup bui-dropdown${menu ? ' bui-select-menu__popup' : ''}` },
        selectAll && h(DropdownSelectAll, selectAll),
        mode === 'select'
          ? h(List, { 'data-slot': 'dropdown-list', className: 'bui-dropdown__list' }, children)
          : h(Fragment, null,
            h(List, { 'data-slot': 'dropdown-list', className: 'bui-dropdown__list' }, (value, index) => { const o = byValue.get(value); return o ? option(o, index) : null; }),
            h(Empty, { 'data-slot': 'dropdown-empty', className: 'bui-choice-popup__empty' }, emptyText)))));
}
