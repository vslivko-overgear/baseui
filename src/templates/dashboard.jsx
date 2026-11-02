// Dashboard templates: summary pages of numbers, charts and tables.
import { useState } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Selector } from '../components/Selector.jsx';
import { Table, proportional } from '../components/Table.jsx';
import { SegmentedControl } from '../components/SegmentedControl.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { Banner } from '../components/Banner.jsx';
import { Status } from '../components/Status.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Fluid, Tile, Spark, Bars, HBars, Panel, MONTHS, PEOPLE, STATUS_TONE, money, Person } from './_kit.jsx';

const RANGES = [{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }];
const spark = (seed) => Array.from({ length: 12 }, (_, i) => 20 + ((i * seed * 7) % 23) + i * 2);

const ordersColumns = [
  { key: 'name', header: 'Customer', width: proportional(2, { minWidth: 160 }), renderCell: (r) => <Person name={r.name} size="sm" /> },
  { key: 'city', header: 'City', width: proportional(1, { minWidth: 100 }) },
  { key: 'status', header: 'Status', width: proportional(1, { minWidth: 100 }), renderCell: (r) => <Badge variant={STATUS_TONE[r.status]} label={r.status} /> },
  { key: 'amount', header: 'Amount', width: proportional(1, { minWidth: 90 }), renderCell: (r) => money(r.amount) },
];

export function AnalyticsDashboard() {
  const [range, setRange] = useState('30d');
  return (
    <Page>
      <PageHeader
        title="Analytics"
        subtitle="Traffic and revenue for the selected period"
        actions={<SegmentedControl label="Period" items={RANGES} value={range} onValueChange={setRange} size="sm" />}
      />
      <Fluid min={200}>
        <Tile label="Revenue" value="$128,400" delta={12.4} footnote="vs previous period" spark={spark(3)} />
        <Tile label="Visitors" value="84,210" delta={5.1} footnote="vs previous period" spark={spark(5)} />
        <Tile label="Conversion" value="3.8%" delta={-0.6} footnote="vs previous period" spark={spark(2)} />
        <Tile label="Refunds" value="1.2%" delta={-0.2} tone="success" footnote="vs previous period" spark={spark(4)} />
      </Fluid>
      <Fluid min={320}>
        <Panel title="Revenue by month" subtitle="Thousands of dollars"><Bars series={MONTHS} label="Revenue by month" /></Panel>
        <Panel title="Top channels"><HBars series={[{ label: 'Search', value: 46, text: '46%' }, { label: 'Direct', value: 28, text: '28%' }, { label: 'Social', value: 17, text: '17%' }, { label: 'Email', value: 9, text: '9%' }]} /></Panel>
      </Fluid>
      <Panel title="Recent orders" padding={4}>
        <Table data={PEOPLE.slice(0, 5)} columns={ordersColumns} caption="Recent orders" />
      </Panel>
    </Page>
  );
}

export function DataDashboard() {
  return (
    <Page>
      <PageHeader title="Data" subtitle="Compare segments over time" actions={<><Selector label="Region" size="sm" options={['All regions', 'Europe', 'Americas', 'Asia'].map((v) => ({ value: v, label: v }))} defaultValue="All regions" /><Button label="Export" variant="secondary" size="sm" /></>} />
      <Fluid min={200} gap={3}>
        <Tile label="Active users" value="21,904" delta={8.2} spark={spark(3)} />
        <Tile label="Sessions per user" value="4.6" delta={1.9} spark={spark(6)} />
        <Tile label="Retention, day 30" value="38%" delta={-2.4} spark={spark(2)} />
        <Tile label="Support tickets" value="312" delta={-9.7} tone="success" spark={spark(5)} />
      </Fluid>
      <Tabs label="Breakdown" items={[
        { value: 'plan', label: 'By plan', content: <Panel title="Active users by plan"><HBars series={[{ label: 'Free', value: 12400 }, { label: 'Team', value: 6100 }, { label: 'Business', value: 2700 }, { label: 'Enterprise', value: 704 }]} /></Panel> },
        { value: 'device', label: 'By device', content: <Panel title="Active users by device"><HBars series={[{ label: 'Desktop', value: 11800 }, { label: 'Mobile', value: 8200 }, { label: 'Tablet', value: 1904 }]} /></Panel> },
        { value: 'source', label: 'By source', content: <Panel title="Active users by source"><HBars series={[{ label: 'Organic', value: 9400 }, { label: 'Paid', value: 5600 }, { label: 'Referral', value: 4200 }, { label: 'Other', value: 2704 }]} /></Panel> },
      ]} />
      <Panel title="Goal progress" subtitle="Quarter to date">
        <Stack gap={4}>
          <ProgressBar label="New customers" value={72} showValue />
          <ProgressBar label="Revenue" value={58} showValue />
          <ProgressBar label="Activation" value={91} showValue />
        </Stack>
      </Panel>
    </Page>
  );
}

export function ExecutiveSummaryDashboard() {
  return (
    <Page width={1000}>
      <PageHeader title="Quarterly summary" subtitle="Q3, prepared for the leadership team" actions={<Button label="Download report" variant="secondary" size="sm" />} />
      <Fluid min={200}>
        <Tile label="Revenue" value="$4.2M" delta={14} />
        <Tile label="Gross margin" value="71%" delta={2} />
        <Tile label="Net retention" value="112%" delta={3} />
        <Tile label="Burn multiple" value="1.4" delta={-8} tone="warning" />
      </Fluid>
      <div className="tpl-split">
        <Stack gap={4}>
          <Panel title="Goals"><Stack gap={4}><ProgressBar label="Revenue target" value={84} showValue /><ProgressBar label="Hiring plan" value={61} showValue /><ProgressBar label="Product launches" value={100} showValue /></Stack></Panel>
          <Panel title="Revenue trend" subtitle="By month, thousands of dollars"><Bars series={MONTHS.slice(6)} label="Revenue trend" /></Panel>
        </Stack>
        <Panel title="Commentary">
          <Stack gap={3}>
            <p className="tpl-text">Revenue grew faster than planned, led by the Business plan</p>
            <p className="tpl-text">Margin improved after the move to a single cloud region</p>
            <p className="tpl-meta">Burn is above target while hiring catches up with the plan</p>
          </Stack>
        </Panel>
      </div>
    </Page>
  );
}

export function FunnelCohortDashboard() {
  const steps = [{ label: 'Visited', value: 100, text: '48,000' }, { label: 'Signed up', value: 41, text: '19,700' }, { label: 'Activated', value: 27, text: '12,900' }, { label: 'Subscribed', value: 9, text: '4,300' }];
  const cohorts = [['Jan', 100, 62, 48, 41], ['Feb', 100, 66, 51, 44], ['Mar', 100, 59, 45, 0], ['Apr', 100, 64, 0, 0], ['May', 100, 0, 0, 0]];
  return (
    <Page>
      <PageHeader title="Funnel and cohorts" subtitle="Where people drop off and who stays" actions={<Selector size="sm" label="Segment" options={['All users', 'Free', 'Trial'].map((v) => ({ value: v, label: v }))} defaultValue="All users" />} />
      <Panel title="Funnel" subtitle="Share of visitors that reach each step"><HBars series={steps} /></Panel>
      <Panel title="Retention by cohort" subtitle="Share of a signup month still active">
        <div className="tpl-heat" style={{ gridTemplateColumns: '64px repeat(4, 1fr)' }}>
          <span className="tpl-meta">Cohort</span>
          {['Week 0', 'Week 1', 'Week 2', 'Week 3'].map((w) => <span key={w} className="tpl-meta">{w}</span>)}
          {cohorts.map(([name, ...vals]) => [
            <span key={name} className="tpl-text">{name}</span>,
            ...vals.map((v, i) => <span key={`${name}${i}`} className="tpl-heat__cell" style={{ background: v ? `color-mix(in srgb, var(--baseui-background-brand) ${Number(v) >= 60 ? Math.max(75, Number(v)) : Math.min(35, Number(v) * 0.7)}%, var(--baseui-background-primary))` : 'transparent', color: Number(v) >= 60 ? 'var(--baseui-extensions-text-and-icon-on-brand)' : undefined }}>{v ? `${v}%` : ''}</span>),
          ])}
        </div>
      </Panel>
    </Page>
  );
}

export function PortfolioDashboard() {
  const [range, setRange] = useState('90d');
  const holdings = [
    { id: 1, name: 'Global equities', value: 182000, change: 4.2 },
    { id: 2, name: 'Bonds', value: 96000, change: 0.8 },
    { id: 3, name: 'Real estate', value: 74000, change: -1.3 },
    { id: 4, name: 'Cash', value: 31000, change: 0 },
  ];
  return (
    <Page>
      <PageHeader title="Portfolio" subtitle="All accounts" actions={<SegmentedControl label="Period" items={RANGES} value={range} onValueChange={setRange} size="sm" />} />
      <Fluid min={300}>
        <Card variant="surface" padding={5}><Stack gap={2}><span className="tpl-meta">Total value</span><span className="tpl-figure">$383,000</span><Badge variant="success" label="+3.1% this period" /><Spark data={spark(4)} height={64} /></Stack></Card>
        <Panel title="Allocation"><HBars series={holdings.map((h) => ({ label: h.name, value: h.value, text: money(h.value) }))} /></Panel>
      </Fluid>
      <Panel title="Positions">
        <Table
          data={holdings}
          caption="Positions"
          defaultSort={{ key: 'value', direction: 'desc' }}
          columns={[
            { key: 'name', header: 'Holding', width: proportional(2, { minWidth: 160 }), sortable: { sortKey: 'name' } },
            { key: 'value', header: 'Value', width: proportional(1, { minWidth: 100 }), sortable: { sortKey: 'value' }, renderCell: (r) => money(r.value) },
            { key: 'change', header: 'Change', width: proportional(1, { minWidth: 100 }), renderCell: (r) => <Badge variant={r.change > 0 ? 'success' : r.change < 0 ? 'error' : 'secondary'} label={`${r.change > 0 ? '+' : ''}${r.change}%`} /> },
          ]}
        />
      </Panel>
    </Page>
  );
}

export function ProjectStatusDashboard() {
  const projects = [
    { id: 1, name: 'Website redesign', lead: 'Amelia Brooks', health: 'Active', progress: 72, due: 'Nov 14' },
    { id: 2, name: 'Mobile app 2.0', lead: 'Noah Ito', health: 'Away', progress: 45, due: 'Dec 2' },
    { id: 3, name: 'Billing migration', lead: 'Lucas Meyer', health: 'Blocked', progress: 30, due: 'Dec 19' },
    { id: 4, name: 'Help center', lead: 'Oliver Grant', health: 'Active', progress: 90, due: 'Nov 3' },
  ];
  const label = { Active: 'On track', Away: 'At risk', Blocked: 'Blocked' };
  return (
    <Page>
      <PageHeader title="Projects" subtitle="Status of everything in flight" actions={<Button variant="primary" label="New project" size="sm" />} />
      <Fluid min={200}>
        <Tile label="On track" value="2" tone="success" />
        <Tile label="At risk" value="1" tone="warning" />
        <Tile label="Blocked" value="1" tone="error" />
        <Tile label="Shipping this month" value="2" />
      </Fluid>
      <Panel title="All projects">
        <Table
          data={projects}
          caption="Projects"
          columns={[
            { key: 'name', header: 'Project', width: proportional(2, { minWidth: 160 }) },
            { key: 'lead', header: 'Lead', width: proportional(2, { minWidth: 150 }), renderCell: (r) => <Person name={r.lead} size="sm" /> },
            { key: 'health', header: 'Health', width: proportional(1, { minWidth: 100 }), renderCell: (r) => <Badge variant={STATUS_TONE[r.health]} label={label[r.health]} /> },
            { key: 'progress', header: 'Progress', width: proportional(2, { minWidth: 140 }), renderCell: (r) => <ProgressBar label={`${r.name} progress`} value={r.progress} showValue /> },
            { key: 'due', header: 'Due', width: proportional(1, { minWidth: 80 }) },
          ]}
        />
      </Panel>
    </Page>
  );
}

export function ServiceMonitoringDashboard() {
  const services = [
    { name: 'API', status: 'Active', uptime: '99.98%', latency: 120 },
    { name: 'Dashboard', status: 'Active', uptime: '99.95%', latency: 210 },
    { name: 'Webhooks', status: 'Away', uptime: '99.12%', latency: 480 },
    { name: 'Search', status: 'Active', uptime: '99.99%', latency: 85 },
  ];
  return (
    <Page>
      <Banner status="warning" title="Webhooks are slower than usual">Deliveries are delayed by about a minute while we scale the queue</Banner>
      <PageHeader title="Service health" subtitle="Last 24 hours" />
      <Fluid min={220}>
        {services.map((s) => (
          <Card variant="surface" key={s.name} padding={4}>
            <Stack gap={2}>
              <Stack direction="row" justify="space-between" align="center"><span className="tpl-h2">{s.name}</span><Badge variant={STATUS_TONE[s.status]} label={s.status === 'Active' ? 'Operational' : 'Degraded'} /></Stack>
              <span className="tpl-meta">{`Uptime ${s.uptime}`}</span>
              <Spark data={spark(s.latency % 7 + 2)} />
              <span className="tpl-meta">{`${s.latency} ms median`}</span>
            </Stack>
          </Card>
        ))}
      </Fluid>
      <Panel title="Recent events">
        <List>
          <ListItem icon={<Icon name="AlertTriangle" size={20} />} subtitle="14:02 · Webhooks">Queue depth above the limit</ListItem>
          <ListItem icon={<Icon name="CheckCircle" size={20} />} subtitle="11:40 · API">Latency back to normal</ListItem>
          <ListItem icon={<Icon name="Server01" size={20} />} subtitle="09:15 · Search">Index rebuilt on a new node</ListItem>
        </List>
      </Panel>
    </Page>
  );
}
