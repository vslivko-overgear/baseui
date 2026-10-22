import { h, cx, createContext, useContext, useMemo, useState, useControllable } from '../react.js';
import { Checkbox } from '../base.js';
import { Skeleton } from './Skeleton.js';
import { describe } from '../doc.js';

/** Column widths: `pixel(120)` is fixed, `proportional(2)` shares the free space by weight. */
export const pixel = (value) => ({ type: 'pixel', value });
export const proportional = (value = 1, { minWidth } = {}) => ({ type: 'proportional', value, minWidth });

const TableContext = createContext({});
const SELECT_WIDTH = 48;
const widthOf = (w) => (typeof w === 'number' ? pixel(w) : w || proportional(1, { minWidth: 60 }));
const alignOf = (a) => (a === 'end' ? 'end' : a === 'center' ? 'center' : 'start');

const compare = (a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true }));

function SortIcon({ direction }) {
  return h('svg', { 'data-slot': 'table-sort', className: 'bui-table__sort', viewBox: '0 0 16 16', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
    h('path', { d: 'm5 6.5 3-3 3 3', opacity: direction === 'desc' ? 0.3 : 1 }),
    h('path', { d: 'm5 9.5 3 3 3-3', opacity: direction === 'asc' ? 0.3 : 1 }));
}

export function Table({
  data, columns = [], rowKey = 'id', caption, density = 'balanced', dividers = 'rows', isStriped = false, hasHover = false,
  verticalAlign = 'middle', textOverflow = 'wrap', sort, defaultSort = null, onSortChange, manualSort = false,
  selectionMode = 'none', selectedKeys, defaultSelectedKeys = [], onSelectionChange, onRowClick,
  isStickyHeader = false, maxHeight, isLoading = false, emptyState = 'No data', children, className, ...rest
}) {
  const [sortState, setSort] = useControllable(sort, defaultSort, onSortChange);
  const [selected, setSelected] = useControllable(selectedKeys, defaultSelectedKeys, onSelectionChange);
  const keyOf = (item, i) => (typeof rowKey === 'function' ? rowKey(item) : item[rowKey] ?? i);

  const rows = useMemo(() => {
    if (!data) return [];
    const col = sortState && columns.find((c) => (c.sortable && c.sortable.sortKey) === sortState.key || c.key === sortState.key);
    if (!col || manualSort) return data;
    const value = (item) => (col.sortValue ? col.sortValue(item) : item[sortState.key]);
    const out = [...data].sort((a, b) => compare(value(a), value(b)));
    return sortState.direction === 'desc' ? out.reverse() : out;
  }, [data, columns, sortState, manualSort]);

  const select = selectionMode !== 'none';
  const keys = new Set(selected);
  const allKeys = rows.map(keyOf);
  const toggle = (k) => {
    if (selectionMode === 'single') return setSelected(keys.has(k) ? [] : [k]);
    const next = new Set(keys); next.has(k) ? next.delete(k) : next.add(k); setSelected([...next]);
  };
  const toggleAll = () => setSelected(allKeys.every((k) => keys.has(k)) ? [] : allKeys);

  const cycle = (c) => {
    const key = (c.sortable && c.sortable.sortKey) || c.key;
    setSort(!sortState || sortState.key !== key ? { key, direction: 'asc' } : sortState.direction === 'asc' ? { key, direction: 'desc' } : null);
  };

  // Column widths: fixed pixels first, the rest is shared by weight.
  const fixed = columns.reduce((n, c) => n + (widthOf(c.width).type === 'pixel' ? widthOf(c.width).value : 0), select ? SELECT_WIDTH : 0);
  const weights = columns.reduce((n, c) => n + (widthOf(c.width).type === 'proportional' ? widthOf(c.width).value : 0), 0);
  const floor = columns.reduce((n, c) => { const w = widthOf(c.width); return n + (w.type === 'pixel' ? w.value : w.minWidth ?? 120); }, select ? SELECT_WIDTH : 0);
  const colWidth = (c) => { const w = widthOf(c.width); return w.type === 'pixel' ? w.value : `calc((100% - ${fixed}px) * ${w.value / weights})`; };

  const ctx = { density, dividers, isStriped, hasHover, verticalAlign, textOverflow };
  const clickable = !!onRowClick;
  const cls = cx('bui-table', `bui-table--${density}`, `bui-table--div-${dividers}`, isStriped && 'bui-table--striped', (hasHover || clickable) && 'bui-table--hover', `bui-table--v-${verticalAlign}`, textOverflow === 'truncate' && 'bui-table--truncate', className);
  const wrapStyle = maxHeight ? { maxHeight } : undefined;
  const wrapCls = cx('bui-table-wrap', (isStickyHeader || maxHeight) && 'bui-table-wrap--scroll', isStickyHeader && 'bui-table-wrap--sticky');

  // Children mode: TableHeader, TableBody, TableRow, TableHeaderCell, TableCell.
  if (!data) {
    return h(TableContext.Provider, { value: ctx }, h('div', { className: wrapCls, style: wrapStyle }, h('table', { className: cls, ...rest }, caption && h('caption', { 'data-slot': 'visually-hidden', className: 'bui-visually-hidden' }, caption), children)));
  }

  const cell = (c, item) => {
    const content = c.renderCell ? c.renderCell(item) : item[c.key];
    return h('td', { key: c.key, style: { textAlign: alignOf(c.align) }, title: textOverflow === 'truncate' && !c.renderCell && content != null ? String(content) : undefined }, content);
  };
  const colCount = columns.length + (select ? 1 : 0);

  return h(TableContext.Provider, { value: ctx },
    h('div', { className: wrapCls, style: wrapStyle },
      h('table', { className: cls, style: { minWidth: floor }, ...rest },
        caption && h('caption', { 'data-slot': 'visually-hidden', className: 'bui-visually-hidden' }, caption),
        h('colgroup', null, select && h('col', { style: { width: SELECT_WIDTH } }), columns.map((c) => h('col', { key: c.key, style: { width: colWidth(c) } }))),
        h('thead', null, h('tr', null,
          select && h('th', { scope: 'col', 'data-slot': 'table-select', className: 'bui-table__select' }, selectionMode === 'multiple' && h(Checkbox, { 'aria-label': 'Select all rows', checked: allKeys.length > 0 && allKeys.every((k) => keys.has(k)), indeterminate: allKeys.some((k) => keys.has(k)) && !allKeys.every((k) => keys.has(k)), onCheckedChange: toggleAll })),
          columns.map((c) => {
            const key = (c.sortable && c.sortable.sortKey) || c.key;
            const dir = sortState && sortState.key === key ? sortState.direction : null;
            return h('th', { key: c.key, scope: 'col', 'aria-sort': c.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined, style: { textAlign: alignOf(c.align) } },
              c.sortable
                ? h('button', { type: 'button', 'data-slot': 'table-sortbtn', className: cx('bui-table__sortbtn', dir && 'is-sorted'), onClick: () => cycle(c) }, c.header ?? c.key, h(SortIcon, { direction: dir }))
                : c.header ?? c.key);
          }))),
        h('tbody', null,
          isLoading && Array.from({ length: 4 }, (_, i) => h('tr', { key: `s${i}` }, Array.from({ length: colCount }, (__, j) => h('td', { key: j }, h(Skeleton, { width: j === 0 && select ? 16 : '70%' }))))),
          !isLoading && rows.length === 0 && h('tr', null, h('td', { colSpan: colCount, 'data-slot': 'table-empty', className: 'bui-table__empty' }, emptyState)),
          !isLoading && rows.map((item, i) => {
            const k = keyOf(item, i);
            const on = keys.has(k);
            return h('tr', {
              key: k, 'aria-selected': select ? on : undefined, className: cx(on && 'is-selected', clickable && 'is-clickable'),
              tabIndex: clickable ? 0 : undefined, onClick: clickable ? () => onRowClick(item) : undefined,
              onKeyDown: clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(item); } } : undefined,
            },
            select && h('td', { 'data-slot': 'table-select', className: 'bui-table__select', onClick: (e) => e.stopPropagation() }, h(Checkbox, { 'aria-label': 'Select row', checked: on, onCheckedChange: () => toggle(k) })),
            columns.map((c) => cell(c, item)));
          })))));
}

export const TableHeader = ({ children, ...rest }) => h('thead', rest, children);
export const TableBody = ({ children, ...rest }) => h('tbody', rest, children);
export const TableRow = ({ children, ...rest }) => h('tr', rest, children);
export const TableHeaderCell = ({ children, align, ...rest }) => h('th', { scope: 'col', style: { textAlign: alignOf(align) }, ...rest }, children);
export const TableCell = ({ children, align, ...rest }) => h('td', { style: { textAlign: alignOf(align) }, ...rest }, children);

describe(Table, 'Tabular data with sorting, selection and several looks.', {
  data: ['object[]', null, 'Row data; without it the table renders its children'],
  columns: ['Array<{ key: string; header?: ReactNode; width?: number | pixel() | proportional(); align?: \'start\' | \'center\' | \'end\'; sortable?: boolean | { sortKey }; sortValue?: (row) => any; renderCell?: (row) => ReactNode }>', null, 'Column definitions'],
  rowKey: ['string | (row) => string', "'id'", 'Field or function that gives a row its key'],
  caption: ['string', null, 'Accessible caption'],
  density: ["'compact' | 'balanced' | 'spacious'", "'balanced'", 'Row height'],
  dividers: ["'rows' | 'columns' | 'grid' | 'none'", "'rows'", 'Which divider lines to draw'],
  isStriped: ['boolean', 'false', 'Tint every second row'],
  hasHover: ['boolean', 'false', 'Highlight the row under the pointer'],
  verticalAlign: ["'middle' | 'top' | 'bottom'", "'middle'", 'Vertical alignment of cells'],
  textOverflow: ["'wrap' | 'truncate'", "'wrap'", 'Wrap long text or cut it with an ellipsis'],
  sort: ['{ key: string; direction: \'asc\' | \'desc\' } | null', null, 'Sort state (controlled)'],
  defaultSort: ['{ key: string; direction: \'asc\' | \'desc\' } | null', null, 'Initial sort state'],
  onSortChange: ['(sort) => void', null, 'Called when a sortable header is clicked'],
  manualSort: ['boolean', 'false', 'Do not sort rows; sort the data yourself'],
  selectionMode: ["'none' | 'single' | 'multiple'", "'none'", 'Adds a selection column'],
  selectedKeys: ['string[]', null, 'Selected row keys (controlled)'],
  defaultSelectedKeys: ['string[]', '[]', 'Initially selected row keys'],
  onSelectionChange: ['(keys) => void', null, 'Called when the selection changes'],
  onRowClick: ['(row) => void', null, 'Makes rows clickable'],
  isStickyHeader: ['boolean', 'false', 'Keep the header visible while scrolling'],
  maxHeight: ['number | string', null, 'Scroll the rows inside this height'],
  isLoading: ['boolean', 'false', 'Show skeleton rows'],
  emptyState: ['ReactNode', "'No data'", 'Shown when there are no rows'],
});
