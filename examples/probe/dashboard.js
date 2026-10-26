import { h, useState, useMemo } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { ClickableCard } from '../../src/components/Card.js';
import { Dropdown } from '../../src/components/Dropdown.js';
import { List, ListItem } from '../../src/components/List.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Status } from '../../src/components/Status.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Skeleton } from '../../src/components/Skeleton.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { TextField } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { I } from './icons.js';
import { STATUS, memberOf, ME } from './data.js';
import { go, ago, pct, useMedia } from './util.js';
import { useStore } from './store.js';

/** Where a demo visitor can go: every scenario is a different path through the product. */
export const SCENARIOS = [
  { id: 'build', icon: I.Edit05, title: 'Build a study from a template', desc: 'Pick a template, edit its blocks, preview and publish.', run: () => go('/templates') },
  { id: 'take', icon: I.PlayCircle, title: 'Take a test as a participant', desc: 'Try the checkout prototype. Your response lands in the results.', run: () => go('/run/s1') },
  { id: 'analyze', icon: I.BarChart01, title: 'Analyze a finished study', desc: 'Completion, scores, click maps and every single response.', run: () => go('/study/s2/results') },
  { id: 'recruit', icon: I.UsersPlus, title: 'Recruit from the panel', desc: 'Set the audience, see the price and invite people.', run: () => go('/people?recruit=s1') },
  { id: 'empty', icon: I.FolderPlus, title: 'Start from an empty workspace', desc: 'See the first-run experience, then bring the demo data back.', run: (store) => { store.setEmpty(true); go('/'); } },
];

export function ScenarioCards() {
  const store = useStore();
  return h('section', { className: 'pb-stack', 'aria-label': 'Demo scenarios' },
    h('div', { className: 'pb-row' }, h('h2', { className: 'pb-h2' }, 'Try a scenario'), h(Badge, { variant: 'primary', size: 'md', label: 'Demo' })),
    h('div', { className: 'pb-cards' }, SCENARIOS.map((s) => h(ClickableCard, { key: s.id, label: s.title, onClick: () => s.run(store), variant: 'muted', padding: 16 },
      h('div', { className: 'pb-stack pb-stack--tight' }, h('span', { className: 'pb-tile' }, h(s.icon, { size: 20 })), h('b', null, s.title), h('span', { className: 'pb-muted' }, s.desc))))));
}

const FILTERS = ['all', 'live', 'draft', 'paused', 'done'];

export function Dashboard() {
  const store = useStore();
  const { toast } = useToast();
  const isMobile = useMedia('(max-width: 859px)');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [del, setDel] = useState(null);
  const studies = store.studies;
  const shown = useMemo(() => studies.filter((s) => (filter === 'all' || s.status === filter) && s.name.toLowerCase().includes(query.trim().toLowerCase())), [studies, filter, query]);
  const count = (f) => (f === 'all' ? studies.length : studies.filter((s) => s.status === f).length);

  const open = (s) => go(s.status === 'draft' ? `/study/${s.id}/build` : `/study/${s.id}/results`);
  const remove = (s) => {
    store.remove(s.id); setDel(null);
    toast({ message: `“${s.name}” deleted`, action: { label: 'Undo', onClick: () => store.restore(s) }, duration: 5000 });
  };
  const menu = (s) => h(Dropdown, { size: 'sm', label: `Actions for ${s.name}`, placement: 'bottom-end', trigger: (tp) => h(IconButton, { variant: 'ghost', size: 'sm', label: `Actions for ${s.name}`, icon: h(I.DotsVertical), ...tp, onClick: (e) => { e.stopPropagation(); tp.onClick(); } }),
    options: [{ value: 'open', label: 'Open', icon: h(I.LinkExternal01) }, { value: 'edit', label: 'Edit blocks', icon: h(I.Edit05) }, { value: 'copy', label: 'Duplicate', icon: h(I.Copy01) }, { type: 'divider' }, { value: 'delete', label: 'Delete', icon: h(I.Trash01) }], value: null,
    onValueChange: (v) => { if (v === 'open') open(s); if (v === 'edit') go(`/study/${s.id}/build`); if (v === 'copy') { const c = store.duplicate(s.id); toast({ message: 'Duplicated as a draft', status: 'success', action: { label: 'Open', onClick: () => go(`/study/${c.id}/build`) } }); } if (v === 'delete') setDel(s); } });

  const columns = [
    { key: 'name', header: 'Study', width: proportional(4), sortable: true, renderCell: (s) => h('div', { className: 'pb-name' }, h('b', null, s.name), h('span', { className: 'pb-muted' }, s.tags.join(' · ') || 'No tags')) },
    { key: 'status', header: 'Status', width: pixel(124), sortable: true, renderCell: (s) => h(Badge, { variant: STATUS[s.status][1], size: 'md', label: STATUS[s.status][0] }) },
    { key: 'n', header: 'Responses', width: proportional(2), sortable: { sortKey: 'n' }, renderCell: (s) => h('div', { className: 'pb-progress' }, h('span', null, `${store.countOf(s)} / ${s.goal}`), h(ProgressBar, { value: Math.min(100, pct(store.countOf(s), s.goal)), size: 'sm', 'aria-label': 'Progress to the goal' })) },
    { key: 'owner', header: 'Owner', width: pixel(80), renderCell: (s) => h(Avatar, { name: memberOf(s.owner).name, size: 'sm' }) },
    { key: 'created', header: 'Created', width: pixel(116), align: 'end', sortable: true, renderCell: (s) => ago(s.created) },
    { key: 'menu', header: h('span', { className: 'pb-visually-hidden' }, 'Actions'), width: pixel(56), align: 'end', renderCell: menu },
  ];

  if (store.empty) {
    return h('div', { className: 'pb-stack pb-stack--lg' }, h(Greeting),
      h(Status, { status: 'accent', icon: h(I.FolderPlus, { size: 32 }), title: 'Your workspace is empty', description: 'Create a study from a template, or bring the demo studies back to look around.',
        action: h('div', { className: 'pb-row pb-row--center' }, h(Button, { variant: 'primary', icon: h(I.Plus), onClick: () => go('/templates') }, 'Browse templates'), h(Button, { variant: 'secondary', onClick: () => { store.setEmpty(false); toast({ message: 'Demo data is back', status: 'success', duration: 2500 }); } }, 'Load demo data')) }));
  }

  return h('div', { className: 'pb-stack pb-stack--lg' },
    h(Greeting),
    h(ScenarioCards),
    h('section', { className: 'pb-stack', 'aria-label': 'Studies' },
      h('div', { className: 'pb-row pb-row--wrap' }, h('h2', { className: 'pb-h2 pb-grow' }, 'Studies'), h(Button, { variant: 'primary', icon: h(I.Plus), onClick: () => { const s = store.createBlank(); go(`/study/${s.id}/build`); } }, 'New study')),
      h('div', { className: 'pb-toolbar' },
        h(SegmentedControl, { label: 'Filter by status', size: 'md', value: filter, onValueChange: setFilter, showCounter: !isMobile, items: FILTERS.map((f) => ({ value: f, label: f === 'all' ? 'All' : STATUS[f][0], counter: count(f) })) }),
        h('div', { className: 'pb-search' }, h(TextField, { size: 'sm', label: 'Search studies', startIcon: h(I.SearchLg), value: query, onChange: (e) => setQuery(e.target.value), clearable: true, actionLabel: 'Clear search' }))),
      shown.length === 0
        ? h(Status, { status: 'neutral', title: 'No studies found', description: query ? `Nothing matches “${query}”.` : 'There are no studies with this status.', actionLabel: 'Show all', actionVariant: 'secondary', onAction: () => { setFilter('all'); setQuery(''); } })
        : isMobile
          ? h(List, { 'aria-label': 'Studies' }, shown.map((s) => h(ListItem, { key: s.id, icon: h(I.File06), onClick: () => open(s), subtitle: `${store.countOf(s)} of ${s.goal} responses`, details: h(Badge, { variant: STATUS[s.status][1], size: 'md', label: STATUS[s.status][0] }) }, s.name)))
          : h(Table, { data: shown, columns, caption: 'Studies', density: 'spacious', hoverable: true, defaultSort: { key: 'created', direction: 'desc' }, onRowClick: open })),
    h(AlertDialog, { open: !!del, onOpenChange: (o) => !o && setDel(null), destructive: true, title: 'Delete this study?', description: del ? `“${del.name}” and its ${store.countOf(del)} responses will be removed.` : '', confirmLabel: 'Delete', onConfirm: () => remove(del) }));
}

function Greeting() {
  const store = useStore();
  const live = store.studies.filter((s) => s.status === 'live').length;
  const hour = new Date().getHours();
  return h('div', { className: 'pb-stack pb-stack--tight' }, h('h1', { className: 'pb-h1' }, `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${ME.name.split(' ')[0]}`),
    h('span', { className: 'pb-muted' }, store.studies.length ? `${live} ${live === 1 ? 'study is' : 'studies are'} collecting responses right now.` : 'Run your first study in a few minutes.'));
}

export function DashboardSkeleton() {
  return h('div', { className: 'pb-stack pb-stack--lg', 'aria-busy': 'true', 'aria-label': 'Loading' }, h(Skeleton, { width: '40%', height: 36 }), h('div', { className: 'pb-cards' }, Array.from({ length: 3 }, (_, i) => h(Skeleton, { key: i, height: 120 }))), h(Skeleton, { height: 320 }));
}
