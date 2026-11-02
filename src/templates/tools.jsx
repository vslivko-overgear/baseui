// Tools templates: working surfaces, a board of cards and a file explorer.
import { useState } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Avatar, AvatarGroup } from '../components/Avatar.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';
import { SegmentedControl } from '../components/SegmentedControl.jsx';
import { Table, proportional } from '../components/Table.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Panel } from './_kit.jsx';

const COLUMNS = [
  { id: 'todo', title: 'To do', cards: [{ t: 'Write the launch notes', tag: 'Docs', who: ['Hana Kim'] }, { t: 'Audit the pricing page', tag: 'Growth', who: ['Sofia Alvarez', 'Daniel Okafor'] }] },
  { id: 'doing', title: 'In progress', cards: [{ t: 'Migrate billing to the new provider', tag: 'Backend', who: ['Lucas Meyer'] }, { t: 'Design the empty states', tag: 'Design', who: ['Amelia Brooks'] }, { t: 'Fix the login loop', tag: 'Bug', who: ['Oliver Grant'] }] },
  { id: 'done', title: 'Done', cards: [{ t: 'Ship the new onboarding', tag: 'Product', who: ['Priya Raman', 'Noah Ito'] }] },
];

export function KanbanBoard() {
  return (
    <Page width={1200}>
      <PageHeader title="Sprint board" subtitle="Cards move left to right as work progresses" actions={<Button label="Add card" size="sm" variant="primary" />} />
      <div className="tpl-kanban">
        {COLUMNS.map((c) => (
          <Stack key={c.id} gap={3}>
            <Stack direction="row" justify="space-between" align="center"><h2 className="tpl-h2">{c.title}</h2><Badge type="counter" variant="secondary" label={c.cards.length} /></Stack>
            {c.cards.map((card) => (
              <Card variant="surface" key={card.t} padding={4}>
                <Stack gap={3}>
                  <span className="tpl-text">{card.t}</span>
                  <Stack direction="row" justify="space-between" align="center"><Badge variant="secondary" label={card.tag} /><AvatarGroup size="sm">{card.who.map((n) => <Avatar key={n} alt={n} size="sm" />)}</AvatarGroup></Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        ))}
      </div>
    </Page>
  );
}

const TREE = [{ name: 'Design', files: [{ id: 1, name: 'Brand guidelines.pdf', size: '4.2 MB', modified: 'Oct 21' }, { id: 2, name: 'Icons.fig', size: '12 MB', modified: 'Oct 18' }] }, { name: 'Engineering', files: [{ id: 3, name: 'Architecture.md', size: '18 KB', modified: 'Oct 25' }, { id: 4, name: 'Release plan.xlsx', size: '210 KB', modified: 'Oct 12' }] }, { name: 'Finance', files: [{ id: 5, name: 'Budget 2027.xlsx', size: '540 KB', modified: 'Oct 2' }] }];

export function FileExplorer() {
  const [folder, setFolder] = useState('Design');
  const [view, setView] = useState('list');
  const [file, setFile] = useState(null);
  const files = TREE.find((f) => f.name === folder).files;
  return (
    <Page width={1120}>
      <PageHeader title="Files" actions={<SegmentedControl label="View" size="sm" items={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} value={view} onValueChange={setView} />} />
      <Breadcrumbs items={[{ label: 'Files', href: '#' }, { label: folder }]} />
      <div className="tpl-split" style={{ gridTemplateColumns: '220px minmax(0, 1fr) 260px' }}>
        <Card variant="surface" padding={2}><List>{TREE.map((f) => <ListItem key={f.name} icon={<Icon name="Folder" size={20} />} active={f.name === folder} onClick={() => { setFolder(f.name); setFile(null); }}>{f.name}</ListItem>)}</List></Card>
        {view === 'list' ? (
          <Table data={files} caption={folder} hoverable onRowClick={(r) => setFile(r)} columns={[{ key: 'name', header: 'Name', width: proportional(3, { minWidth: 160 }), renderCell: (r) => <Stack direction="row" gap={2} align="center"><Icon name="File01" size={20} />{r.name}</Stack> }, { key: 'size', header: 'Size', width: proportional(1, { minWidth: 70 }) }, { key: 'modified', header: 'Modified', width: proportional(1, { minWidth: 80 }) }]} />
        ) : (
          <div className="tpl-files-grid">{files.map((f) => <Card variant="surface" key={f.id} padding={4}><Stack gap={2} align="center"><Icon name="File01" size={32} /><span className="tpl-text">{f.name}</span></Stack></Card>)}</div>
        )}
        <Panel title={file ? file.name : 'Details'}>{file ? <Stack gap={2}><span className="tpl-meta">{`Size ${file.size}`}</span><span className="tpl-meta">{`Modified ${file.modified}`}</span><Button label="Download" variant="secondary" size="sm" /></Stack> : <span className="tpl-meta">Select a file to see its details</span>}</Panel>
      </div>
    </Page>
  );
}
