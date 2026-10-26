import { h, useState, useMemo } from '../../src/react.js';
import { Button } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { ClickableCard } from '../../src/components/Card.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { List, ListItem } from '../../src/components/List.js';
import { Status } from '../../src/components/Status.js';
import { Modal, TextField } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { I } from './icons.js';
import { TEMPLATES, CATEGORIES, BLOCK_TYPES } from './data.js';
import { go, plural } from './util.js';
import { useStore } from './store.js';

export function Templates() {
  const store = useStore();
  const { toast } = useToast();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(null);
  const [name, setName] = useState('');
  const shown = useMemo(() => TEMPLATES.filter((t) => (category === 'all' || t.category === category) && `${t.name} ${t.desc}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query]);
  const choose = (t) => { setPicked(t); setName(t.name); };
  const create = () => {
    const s = store.createFromTemplate(picked.id, name.trim() || picked.name);
    setPicked(null);
    toast({ message: `Draft “${s.name}” created`, status: 'success', duration: 3000 });
    go(`/study/${s.id}/build`);
  };
  return h('div', { className: 'pb-stack pb-stack--lg' },
    h('div', { className: 'pb-stack pb-stack--tight' }, h('h1', { className: 'pb-h1' }, 'Templates'), h('span', { className: 'pb-muted' }, 'Start from a proven set of blocks and change anything.')),
    h('div', { className: 'pb-toolbar' },
      h(SegmentedControl, { label: 'Category', size: 'md', value: category, onValueChange: setCategory, showIcon: false, items: [{ value: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))] }),
      h('div', { className: 'pb-search' }, h(TextField, { size: 'sm', label: 'Search templates', startIcon: h(I.SearchLg), value: query, onChange: (e) => setQuery(e.target.value), clearable: true, actionLabel: 'Clear search' }))),
    shown.length
      ? h('div', { className: 'pb-cards pb-cards--wide' }, shown.map((t) => h(ClickableCard, { key: t.id, label: `Use ${t.name}`, onClick: () => choose(t), padding: 20 },
        h('div', { className: 'pb-stack' },
          h('div', { className: 'pb-row' }, h('span', { className: 'pb-tile' }, h(t.icon, { size: 20 })), h('span', { className: 'pb-grow' }), h(Badge, { variant: 'secondary', size: 'md', label: t.category })),
          h('div', { className: 'pb-stack pb-stack--tight' }, h('b', { className: 'pb-h3' }, t.name), h('span', { className: 'pb-muted' }, t.desc)),
          h('div', { className: 'pb-row pb-muted' }, h(I.Clock, { size: 16 }), h('span', null, `${t.minutes} min · ${plural(t.blocks.length, 'block')}`))))))
      : h(Status, { status: 'neutral', title: 'No templates found', description: 'Try another category or a different word.', actionLabel: 'Show all', actionVariant: 'secondary', onAction: () => { setCategory('all'); setQuery(''); } }),
    h('div', { className: 'pb-row pb-row--center' }, h(Button, { variant: 'secondary', icon: h(I.Plus), onClick: () => { const s = store.createBlank(); go(`/study/${s.id}/build`); } }, 'Start from scratch')),
    h(Modal, { open: !!picked, onOpenChange: (o) => !o && setPicked(null), title: picked ? picked.name : '', subtitle: picked ? `${picked.minutes} min · ${plural(picked.blocks.length, 'block')}` : undefined,
      primaryAction: h(Button, { variant: 'primary', disabled: !name.trim(), onClick: create }, 'Create the study'), secondaryAction: h(Button, { variant: 'secondary', onClick: () => setPicked(null) }, 'Cancel') },
    picked && h('div', { className: 'pb-stack' },
      h('p', { className: 'pb-muted pb-flush' }, picked.desc),
      h(TextField, { size: 'sm', label: 'Study name', value: name, onChange: (e) => setName(e.target.value) }),
      h(List, { size: 'sm', title: 'What is inside', 'aria-label': 'Blocks of the template' }, picked.blocks.map((type, i) => h(ListItem, { key: i, icon: h(BLOCK_TYPES[type].icon), subtitle: BLOCK_TYPES[type].hint }, BLOCK_TYPES[type].label))))));
}
