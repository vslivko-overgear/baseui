import { useState } from '../react.js';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, pixel, proportional } from '../components/Table.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { meta, playground, example } from './_helpers.jsx';

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
  {
    key: 'name',
    header: 'Member',
    width: proportional(3),
    sortable: true,
    renderCell: (u) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={u.name} size="sm" />
        {u.name}
      </span>
    ),
  },
  { key: 'role', header: 'Role', width: proportional(2), sortable: true },
  { key: 'status', header: 'Status', width: proportional(2), renderCell: (u) => <Badge variant={tone[u.status]} label={u.status} /> },
  { key: 'seats', header: 'Seats', align: 'end', width: pixel(100), sortable: true },
];

export default meta({
  title: 'Components/Table',
  component: Table,
  args: {
    data,
    columns,
    caption: 'Team members',
    density: 'balanced',
    dividers: 'rows',
    striped: false,
    hoverable: false,
    verticalAlign: 'middle',
    textOverflow: 'wrap',
    selectionMode: 'none',
    stickyHeader: false,
    loading: false,
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'balanced', 'spacious'] },
    dividers: { control: 'inline-radio', options: ['rows', 'columns', 'grid', 'none'] },
    verticalAlign: { control: 'inline-radio', options: ['middle', 'top', 'bottom'] },
    textOverflow: { control: 'inline-radio', options: ['wrap', 'truncate'] },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
});
export const Playground = playground({ source: `<Table data={data} columns={columns} caption="Team members" />` });
export const Density = example({
  name: 'Density',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {['compact', 'balanced', 'spacious'].map((d) => (
        <Table key={d} data={data.slice(0, 2)} columns={columns} density={d} caption={d} />
      ))}
    </div>
  ),
  source: `<Table density="compact" … />  // compact · balanced · spacious`,
});
export const Dividers = example({
  name: 'Dividers',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {['rows', 'columns', 'grid', 'none'].map((d) => (
        <Table key={d} data={data.slice(0, 3)} columns={columns} dividers={d} caption={d} />
      ))}
    </div>
  ),
  source: `<Table dividers="grid" … />  // rows · columns · grid · none`,
});
export const Striped = example({
  name: 'Striped and Hover',
  render: () => <Table data={data} columns={columns} striped hoverable caption="Striped" />,
  source: `<Table striped hoverable … />`,
});
export const RichCells = example({
  name: 'Rich Cells',
  render: () => <Table data={data} columns={rich} hoverable caption="Members" />,
  source: `columns={[{ key: 'status', header: 'Status', renderCell: (u) => <Badge variant="success" label={u.status} /> }]}`,
});
export const Sorting = example({
  name: 'Sorting',
  render: () => <Table data={data} columns={rich} defaultSort={{ key: 'seats', direction: 'desc' }} caption="Sortable" />,
  source: `<Table columns={[{ key: 'name', header: 'Name', sortable: true }]} defaultSort={{ key: 'seats', direction: 'desc' }} />`,
});
function SelectionDemo({ mode }) {
  const [keys, setKeys] = useState([2]);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Table data={data} columns={rich} selectionMode={mode} selectedKeys={keys} onSelectionChange={setKeys} caption="Selectable" />
      <div
        style={{ font: 'var(--baseui-typography-text-14-regular)', color: 'var(--baseui-text-and-icon-secondary)' }}
      >{`Selected: ${keys.length ? keys.join(', ') : 'none'}`}</div>
    </div>
  );
}
export const Selection = example({
  name: 'Selection',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <SelectionDemo mode="multiple" />
      <SelectionDemo mode="single" />
    </div>
  ),
  source: `<Table selectionMode="multiple" selectedKeys={keys} onSelectionChange={setKeys} … />`,
});
export const Actions = example({
  name: 'Row Click',
  render: () => <Table data={data} columns={columns} onRowClick={() => {}} caption="Clickable rows" />,
  source: `<Table onRowClick={(row) => open(row.id)} … />`,
});
const long = [
  {
    id: 1,
    file: 'quarterly-report-final-v3-reviewed-by-legal-and-finance.pdf',
    owner: 'Anna Petrova',
    note: 'Shared with the whole product team for the planning session next week',
  },
  { id: 2, file: 'brand-guidelines.pdf', owner: 'Mark Lee', note: 'Updated colors' },
];
export const Overflow = example({
  name: 'Text Overflow',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {['wrap', 'truncate'].map((m) => (
        <Table
          key={m}
          data={long}
          textOverflow={m}
          caption={m}
          columns={[
            { key: 'file', header: 'File', width: proportional(2) },
            { key: 'owner', header: 'Owner', width: proportional(1) },
            { key: 'note', header: 'Note', width: proportional(2) },
          ]}
        />
      ))}
    </div>
  ),
  source: `<Table textOverflow="truncate" … />  // wrap · truncate`,
});
export const StickyHeader = example({
  name: 'Sticky Header',
  render: () => (
    <Table
      data={Array.from({ length: 14 }, (_, i) => ({ id: i, name: `Member ${i + 1}`, role: 'Engineer', status: 'Active', seats: i }))}
      columns={columns}
      stickyHeader
      maxHeight={240}
      hoverable
      caption="Scrolling"
    />
  ),
  source: `<Table stickyHeader maxHeight={240} … />`,
});
export const States = example({
  name: 'Empty and Loading',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Table data={[]} columns={columns} caption="Empty" emptyState="No members yet" />
      <Table data={data} columns={columns} loading caption="Loading" />
    </div>
  ),
  source: `<Table data={[]} emptyState="No members yet" />  <Table loading … />`,
});
export const Composition = example({
  name: 'Children Mode',
  render: () => (
    <Table caption="Plan">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Plan</TableHeaderCell>
          <TableHeaderCell align="end">Price</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Free</TableCell>
          <TableCell align="end">$0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Team</TableCell>
          <TableCell align="end">$12</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  source: `<Table><TableHeader><TableRow><TableHeaderCell>Plan</TableHeaderCell>…</TableRow></TableHeader><TableBody>…</TableBody></Table>`,
});
export const __namedExportsOrder = [
  'Playground',
  'Density',
  'Dividers',
  'Striped',
  'RichCells',
  'Sorting',
  'Selection',
  'Actions',
  'Overflow',
  'StickyHeader',
  'States',
  'Composition',
];
