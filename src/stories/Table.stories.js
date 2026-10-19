import { h, useState } from '../react.js';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, pixel, proportional } from '../components/Table.js';
import { Avatar } from '../components/Avatar.js';
import { Badge } from '../components/Badge.js';
import { Button } from '../components/Button.js';
import { meta, playground, example } from './_helpers.js';

const data = [
  { id: 1, name: 'Anna Petrova', role: 'Designer', status: 'Active', seats: 3, joined: '2024-03-12' },
  { id: 2, name: 'Mark Lee', role: 'Engineer', status: 'Invited', seats: 1, joined: '2024-05-02' },
  { id: 3, name: 'Sofia Rossi', role: 'Product Manager', status: 'Active', seats: 5, joined: '2023-11-20' },
  { id: 4, name: 'Jun Park', role: 'Engineer', status: 'Suspended', seats: 2, joined: '2024-01-08' },
];
const columns = [
  { key: 'name', header: 'Name', width: proportional(2) },
  { key: 'role', header: 'Role', width: proportional(2) },
  { key: 'status', header: 'Status', width: proportional(1) },
  { key: 'seats', header: 'Seats', align: 'end', width: pixel(100) },
];
const tone = { Active: 'success', Invited: 'info', Suspended: 'error' };
const rich = [
  { key: 'name', header: 'Member', width: proportional(3), sortable: true, renderCell: (u) => h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 12 } }, h(Avatar, { name: u.name, size: 'sm' }), u.name) },
  { key: 'role', header: 'Role', width: proportional(2), sortable: true },
  { key: 'status', header: 'Status', width: proportional(2), renderCell: (u) => h(Badge, { variant: tone[u.status], label: u.status }) },
  { key: 'seats', header: 'Seats', align: 'end', width: pixel(100), sortable: true },
];

export default meta({
  title: 'Components/Table', component: Table,
  args: { data, columns, caption: 'Team members', density: 'balanced', dividers: 'rows', isStriped: false, hasHover: false, verticalAlign: 'middle', textOverflow: 'wrap', selectionMode: 'none', isStickyHeader: false, isLoading: false },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'balanced', 'spacious'] },
    dividers: { control: 'inline-radio', options: ['rows', 'columns', 'grid', 'none'] },
    verticalAlign: { control: 'inline-radio', options: ['middle', 'top', 'bottom'] },
    textOverflow: { control: 'inline-radio', options: ['wrap', 'truncate'] },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    isStriped: { control: 'boolean' }, hasHover: { control: 'boolean' }, isStickyHeader: { control: 'boolean' }, isLoading: { control: 'boolean' },
  },
});
export const Playground = playground({ source: `<Table data={data} columns={columns} caption="Team members" />` });
export const Density = example({
  name: 'Density', render: () => h('div', { style: { display: 'grid', gap: 24 } }, ['compact', 'balanced', 'spacious'].map((d) => h(Table, { key: d, data: data.slice(0, 2), columns, density: d, caption: d }))),
  source: `<Table density="compact" … />  // compact · balanced · spacious`,
});
export const Dividers = example({
  name: 'Dividers', render: () => h('div', { style: { display: 'grid', gap: 24 } }, ['rows', 'columns', 'grid', 'none'].map((d) => h(Table, { key: d, data: data.slice(0, 3), columns, dividers: d, caption: d }))),
  source: `<Table dividers="grid" … />  // rows · columns · grid · none`,
});
export const Striped = example({ name: 'Striped and Hover', render: () => h(Table, { data, columns, isStriped: true, hasHover: true, caption: 'Striped' }), source: `<Table isStriped hasHover … />` });
export const RichCells = example({
  name: 'Rich Cells', render: () => h(Table, { data, columns: rich, hasHover: true, caption: 'Members' }),
  source: `columns={[{ key: 'status', header: 'Status', renderCell: (u) => <Badge variant="success" label={u.status} /> }]}`,
});
export const Sorting = example({
  name: 'Sorting', render: () => h(Table, { data, columns: rich, defaultSort: { key: 'seats', direction: 'desc' }, caption: 'Sortable' }),
  source: `<Table columns={[{ key: 'name', header: 'Name', sortable: true }]} defaultSort={{ key: 'seats', direction: 'desc' }} />`,
});
function SelectionDemo({ mode }) {
  const [keys, setKeys] = useState([2]);
  return h('div', { style: { display: 'grid', gap: 12 } },
    h(Table, { data, columns: rich, selectionMode: mode, selectedKeys: keys, onSelectionChange: setKeys, caption: 'Selectable' }),
    h('div', { style: { font: 'var(--baseui-Typography-Text-14-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, `Selected: ${keys.length ? keys.join(', ') : 'none'}`));
}
export const Selection = example({
  name: 'Selection', render: () => h('div', { style: { display: 'grid', gap: 24 } }, h(SelectionDemo, { mode: 'multiple' }), h(SelectionDemo, { mode: 'single' })),
  source: `<Table selectionMode="multiple" selectedKeys={keys} onSelectionChange={setKeys} … />`,
});
export const Actions = example({
  name: 'Row Click', render: () => h(Table, { data, columns, onRowClick: () => {}, caption: 'Clickable rows' }),
  source: `<Table onRowClick={(row) => open(row.id)} … />`,
});
const long = [
  { id: 1, file: 'quarterly-report-final-v3-reviewed-by-legal-and-finance.pdf', owner: 'Anna Petrova', note: 'Shared with the whole product team for the planning session next week' },
  { id: 2, file: 'brand-guidelines.pdf', owner: 'Mark Lee', note: 'Updated colors' },
];
export const Overflow = example({
  name: 'Text Overflow', render: () => h('div', { style: { display: 'grid', gap: 24 } }, ['wrap', 'truncate'].map((m) => h(Table, { key: m, data: long, textOverflow: m, caption: m, columns: [{ key: 'file', header: 'File', width: proportional(2) }, { key: 'owner', header: 'Owner', width: proportional(1) }, { key: 'note', header: 'Note', width: proportional(2) }] }))),
  source: `<Table textOverflow="truncate" … />  // wrap · truncate`,
});
export const StickyHeader = example({
  name: 'Sticky Header', render: () => h(Table, { data: Array.from({ length: 14 }, (_, i) => ({ id: i, name: `Member ${i + 1}`, role: 'Engineer', status: 'Active', seats: i })), columns, isStickyHeader: true, maxHeight: 240, hasHover: true, caption: 'Scrolling' }),
  source: `<Table isStickyHeader maxHeight={240} … />`,
});
export const States = example({
  name: 'Empty and Loading', render: () => h('div', { style: { display: 'grid', gap: 24 } }, h(Table, { data: [], columns, caption: 'Empty', emptyState: 'No members yet' }), h(Table, { data, columns, isLoading: true, caption: 'Loading' })),
  source: `<Table data={[]} emptyState="No members yet" />  <Table isLoading … />`,
});
export const Composition = example({
  name: 'Children Mode', render: () => h(Table, { caption: 'Plan' },
    h(TableHeader, null, h(TableRow, null, h(TableHeaderCell, null, 'Plan'), h(TableHeaderCell, { align: 'end' }, 'Price'))),
    h(TableBody, null,
      h(TableRow, null, h(TableCell, null, 'Free'), h(TableCell, { align: 'end' }, '$0')),
      h(TableRow, null, h(TableCell, null, 'Team'), h(TableCell, { align: 'end' }, '$12')))),
  source: `<Table><TableHeader><TableRow><TableHeaderCell>Plan</TableHeaderCell>…</TableRow></TableHeader><TableBody>…</TableBody></Table>`,
});
export const __namedExportsOrder = ['Playground', 'Density', 'Dividers', 'Striped', 'RichCells', 'Sorting', 'Selection', 'Actions', 'Overflow', 'StickyHeader', 'States', 'Composition'];
