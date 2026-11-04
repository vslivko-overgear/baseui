// Table templates: collections that are searched, filtered, grouped, collapsed, read as an inbox or compared.
import { useState, useMemo } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Token } from '../components/Token.jsx';
import { Selector } from '../components/Selector.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Table, proportional } from '../components/Table.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Status } from '../components/Status.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { Collapsible, CollapsibleGroup } from '../components/Collapsible.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Switch } from '../components/Switch.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Panel, PEOPLE, STATUS_TONE, money, Person } from './_kit.jsx';

const cols = [
  { key: 'name', header: 'Name', width: proportional(2, { minWidth: 160 }), sortable: { sortKey: 'name' }, renderCell: (r) => <Person name={r.name} size="sm" /> },
  { key: 'role', header: 'Team', width: proportional(1, { minWidth: 110 }), sortable: { sortKey: 'role' } },
  { key: 'city', header: 'City', width: proportional(1, { minWidth: 100 }) },
  { key: 'status', header: 'Status', width: proportional(1, { minWidth: 100 }), renderCell: (r) => <Badge variant={STATUS_TONE[r.status]} label={r.status} /> },
  { key: 'amount', header: 'Revenue', width: proportional(1, { minWidth: 100 }), sortable: { sortKey: 'amount' }, renderCell: (r) => money(r.amount) },
];

export function SearchableTable() {
  const [q, setQ] = useState('');
  const rows = PEOPLE.filter((p) => `${p.name} ${p.role} ${p.city}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Page>
      <PageHeader title="People" subtitle={`${rows.length} of ${PEOPLE.length} shown`} actions={<Button variant="primary" label="Invite" size="sm" />} />
      <TextInput type="search" label="Search people" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />
      <Table data={rows} columns={cols} caption="People" emptyState={<Status title="No one found" description="Try another name, team or city" actionLabel="Clear search" actionVariant="secondary" onAction={() => setQ('')} />} />
      <Stack align="center"><Pagination page={1} total={5} onPageChange={() => {}} /></Stack>
    </Page>
  );
}

export function FilterableTable() {
  const [filters, setFilters] = useState(['Active']);
  const [view, setView] = useState('all');
  const [selected, setSelected] = useState(null);
  const toggle = (f) => setFilters((c) => (c.includes(f) ? c.filter((x) => x !== f) : [...c, f]));
  const rows = useMemo(() => PEOPLE.filter((p) => (!filters.length || filters.includes(p.status)) && (view === 'all' || p.role === 'Engineering')), [filters, view]);
  const person = PEOPLE.find((p) => p.id === selected);
  return (
    <Page>
      <PageHeader title="Team" subtitle="Filters stack; the table narrows as you add them" />
      <Tabs label="Saved views" value={view} onValueChange={setView} items={[{ value: 'all', label: 'All people' }, { value: 'eng', label: 'Engineering' }]}>
        <Stack gap={8}>
        <Stack direction="row" gap={2} wrap align="center">
          {['Active', 'Away', 'Invited'].map((f) => <Token key={f} pressed={filters.includes(f)} onPressedChange={() => toggle(f)}>{f}</Token>)}
          <Selector size="sm" label="Team" options={['Any team', 'Design', 'Engineering'].map((v) => ({ value: v, label: v }))} defaultValue="Any team" />
        </Stack>
        <div className="tpl-split">
          <Table data={rows} columns={cols.slice(0, 4)} caption="Team" hoverable onRowClick={(r) => setSelected(r.id)} />
          <Panel title={person ? person.name : 'Details'}>
            {person ? (
              <Stack gap={2}><span className="tpl-text">{person.email}</span><span className="tpl-meta">{`${person.role} · ${person.city}`}</span><Badge variant={STATUS_TONE[person.status]} label={person.status} /></Stack>
            ) : <span className="tpl-meta">Select a row to see the person</span>}
          </Panel>
        </div>
        </Stack>
      </Tabs>
    </Page>
  );
}

export function GroupedTable() {
  const groups = [...new Set(PEOPLE.map((p) => p.role))];
  return (
    <Page>
      <PageHeader title="People by team" />
      <CollapsibleGroup multiple defaultValue={[groups[0]]} items={groups.map((g) => ({ value: g, title: `${g} · ${PEOPLE.filter((p) => p.role === g).length}`, content: <Table data={PEOPLE.filter((p) => p.role === g)} columns={cols.filter((c) => c.key !== 'role')} caption={g} /> }))} />
    </Page>
  );
}

export function CollapsibleTable() {
  const orders = [{ id: 1, item: 'Standing desk', qty: 2, total: 1180 }, { id: 2, item: 'Monitor arm', qty: 4, total: 520 }];
  const invoices = [{ id: 1, no: 'INV-1042', due: 'Nov 3', total: 2400 }, { id: 2, no: 'INV-1043', due: 'Nov 17', total: 980 }];
  const tickets = [{ id: 1, topic: 'Login loop', owner: 'Oliver Grant', state: 'Open' }];
  return (
    <Page>
      <PageHeader title="Account" subtitle="Tables that do not share a schema" />
      <CollapsibleGroup
        multiple
        defaultValue={['orders']}
        items={[
          { value: 'orders', title: 'Orders', content: <Table data={orders} caption="Orders" columns={[{ key: 'item', header: 'Item' }, { key: 'qty', header: 'Qty' }, { key: 'total', header: 'Total', renderCell: (r) => money(r.total) }]} /> },
          { value: 'invoices', title: 'Invoices', content: <Table data={invoices} caption="Invoices" columns={[{ key: 'no', header: 'Number' }, { key: 'due', header: 'Due' }, { key: 'total', header: 'Total', renderCell: (r) => money(r.total) }]} /> },
          { value: 'tickets', title: 'Support tickets', content: <Table data={tickets} caption="Tickets" columns={[{ key: 'topic', header: 'Topic' }, { key: 'owner', header: 'Owner' }, { key: 'state', header: 'State', renderCell: (r) => <Badge variant="accent" label={r.state} /> }]} /> },
        ]}
      />
    </Page>
  );
}

const MAIL = [
  { id: 1, from: 'Priya Raman', subject: 'Roadmap review on Thursday', preview: 'Can we move it to the afternoon', time: '09:12', unread: true },
  { id: 2, from: 'Lucas Meyer', subject: 'Deploy window', preview: 'The migration is ready for tonight', time: 'Yesterday', unread: true },
  { id: 3, from: 'Sofia Alvarez', subject: 'Campaign assets', preview: 'The final files are in the shared folder', time: 'Mon', unread: false },
];
export function InboxTable() {
  const [open, setOpen] = useState(1);
  const [reply, setReply] = useState(false);
  const mail = MAIL.find((m) => m.id === open);
  return (
    <Page>
      <PageHeader title="Inbox" subtitle="2 unread" />
      <div className="tpl-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)' }}>
        <Card variant="surface" padding={2}>
          <List>
            {MAIL.map((m) => (
              <ListItem key={m.id} avatar={<Avatar alt={m.from} />} subtitle={m.preview} details={m.time} active={m.id === open} onClick={() => setOpen(m.id)}>{m.unread ? <strong>{m.subject}</strong> : m.subject}</ListItem>
            ))}
          </List>
        </Card>
        <Panel title={mail.subject} subtitle={`From ${mail.from}`} actions={<Button label={reply ? 'Cancel' : 'Reply'} variant="secondary" size="sm" onClick={() => setReply(!reply)} />}>
          <p className="tpl-text">{`${mail.preview}. Let me know what works for you and I will update the invite`}</p>
          {reply && (
            <Stack gap={3}><TextInput label="Your reply" multiline minRows={3} /><Stack direction="row" justify="flex-end"><Button variant="primary" label="Send" size="sm" /></Stack></Stack>
          )}
        </Panel>
      </div>
    </Page>
  );
}

export function ComparisonTable() {
  const [diff, setDiff] = useState(false);
  const rows = [
    { id: 1, feature: 'Seats', a: '5', b: '25', c: 'Unlimited' },
    { id: 2, feature: 'Storage', a: '10 GB', b: '1 TB', c: 'Custom' },
    { id: 3, feature: 'Single sign-on', a: 'No', b: 'Yes', c: 'Yes' },
    { id: 4, feature: 'Audit log', a: 'No', b: 'No', c: 'Yes' },
    { id: 5, feature: 'Support', a: 'Email', b: 'Priority', c: 'Dedicated' },
  ].filter((r) => !diff || new Set([r.a, r.b, r.c]).size > 1);
  const head = (name, price) => <Stack gap={1}><span>{name}</span><span className="tpl-meta">{price}</span></Stack>;
  return (
    <Page width={900}>
      <PageHeader title="Compare plans" actions={<Switch label="Only differences" checked={diff} onCheckedChange={setDiff} />} />
      <Table
        data={rows}
        caption="Plans"
        columns={[
          { key: 'feature', header: 'Feature', width: proportional(2, { minWidth: 140 }) },
          { key: 'a', header: head('Starter', '$0'), width: proportional(1, { minWidth: 100 }) },
          { key: 'b', header: head('Team', '$12'), width: proportional(1, { minWidth: 100 }), renderCell: (r) => <Badge variant="accent" label={r.b} /> },
          { key: 'c', header: head('Business', '$29'), width: proportional(1, { minWidth: 100 }) },
        ]}
      />
    </Page>
  );
}
