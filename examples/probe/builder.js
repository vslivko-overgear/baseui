import { h, useState, useEffect } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { Card } from '../../src/components/Card.js';
import { Dropdown } from '../../src/components/Dropdown.js';
import { List, ListItem } from '../../src/components/List.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Status } from '../../src/components/Status.js';
import { NumberInput } from '../../src/components/NumberInput.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.js';
import { Tooltip } from '../../src/components/Tooltip.js';
import { Modal, TextField, Switch, Select } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { BlockView } from './blocks.js';
import { Screen, SCREENS } from './screens.js';
import { I } from './icons.js';
import { BLOCK_TYPES, STATUS, newBlock, uid, memberOf } from './data.js';
import { go, ago, plural, useMedia } from './util.js';
import { useStore } from './store.js';

/** The title of a study page: breadcrumbs, name, status and the actions that fit the status. */
export function StudyHeader({ study, tab, onShare, children }) {
  const store = useStore();
  const { toast } = useToast();
  const [confirm, setConfirm] = useState(null);
  const [label, tone] = STATUS[study.status];
  const owner = memberOf(study.owner);
  const set = (status, message) => { store.update(study.id, { status }); toast({ message, status: 'success', duration: 3000 }); };
  const primary = study.status === 'draft' ? h(Button, { variant: 'primary', icon: h(I.Rocket01), onClick: () => setConfirm('publish') }, 'Publish')
    : study.status === 'live' ? h(Button, { variant: 'secondary', icon: h(I.PauseCircle), onClick: () => set('paused', 'Study paused: no new responses') }, 'Pause')
      : study.status === 'paused' ? h(Button, { variant: 'primary', icon: h(I.Play), onClick: () => set('live', 'Study resumed') }, 'Resume')
        : h(Button, { variant: 'secondary', icon: h(I.Copy01), onClick: () => { const c = store.duplicate(study.id); toast({ message: 'Duplicated as a draft', status: 'success', action: { label: 'Open', onClick: () => go(`/study/${c.id}/build`) } }); } }, 'Duplicate');
  return h('div', { className: 'pb-stack' },
    h('div', { className: 'pb-crumbs' }, h(Breadcrumbs, { items: [{ label: 'Studies', onClick: () => go('/') }, { label: study.name }] })),
    h('div', { className: 'pb-titlebar' },
      h('div', { className: 'pb-grow' },
        h('div', { className: 'pb-row pb-row--wrap' }, h('h1', { className: 'pb-h1' }, study.name), h(Badge, { variant: tone, size: 'md', label })),
        h('div', { className: 'pb-row pb-muted' }, h(Avatar, { name: owner.name, size: 'xsm', tooltip: false }), h('span', null, `${owner.name} · created ${ago(study.created)} · ${plural(store.countOf(study), 'response')}`))),
      h('div', { className: 'pb-actions' },
        h(Button, { variant: 'secondary', icon: h(I.Eye), onClick: () => go(`/run/${study.id}?preview=1`) }, 'Preview'),
        h(Button, { variant: 'secondary', icon: h(I.Share07), onClick: onShare }, 'Share'),
        primary)),
    h(SegmentedControl, { label: 'Study sections', size: 'md', value: tab, onValueChange: (v) => go(`/study/${study.id}/${v}`), items: [{ value: 'build', label: 'Build', icon: h(I.Edit05) }, { value: 'results', label: 'Results', icon: h(I.BarChart01), counter: store.countOf(study) || undefined }] }),
    children,
    h(AlertDialog, { open: confirm === 'publish', onOpenChange: (o) => !o && setConfirm(null), title: 'Publish this study?', description: 'People with the link can start taking it right away. You can pause it at any time.', confirmLabel: 'Publish',
      onConfirm: () => { setConfirm(null); set('live', 'Study is live'); onShare && onShare(); } }));
}

/** The link, the panel and the embed: how a study reaches people. */
export function ShareModal({ study, open, onClose }) {
  const { toast } = useToast();
  const [anyone, setAnyone] = useState(true);
  const link = `${location.origin}${location.pathname.replace(/examples\/probe\/.*$/, '')}examples/probe/#/run/${study.id}`;
  const copy = async () => { try { await navigator.clipboard.writeText(link); } catch { /* clipboard unavailable */ } toast({ message: 'Link copied', status: 'success', duration: 2200 }); };
  return h(Modal, { open, onOpenChange: (o) => !o && onClose(), title: 'Share the study', subtitle: study.status === 'draft' ? 'The link works once the study is published' : 'Anyone with the link can respond',
    primaryAction: h(Button, { variant: 'primary', onClick: onClose }, 'Done'), secondaryAction: h(Button, { variant: 'secondary', icon: h(I.Users01), onClick: () => { onClose(); go(`/people?recruit=${study.id}`); } }, 'Recruit from the panel') },
  h('div', { className: 'pb-stack' },
    h(TextField, { label: 'Study link', value: link, readOnly: true, size: 'sm', action: h(IconButton, { variant: 'ghost', size: 'sm', label: 'Copy the link', icon: h(I.Copy01), onClick: copy }) }),
    h(Switch, { size: 'md', label: 'Anyone with the link can respond', checked: anyone, onCheckedChange: setAnyone }),
    h(Button, { variant: 'secondary', icon: h(I.PlayCircle), onClick: () => { onClose(); go(`/run/${study.id}`); } }, 'Take it yourself'),
    h('span', { className: 'pb-muted' }, 'Taking it yourself adds a real response to the results.')));
}

const move = (list, i, d) => { const next = [...list]; const j = i + d; if (j < 0 || j >= next.length) return list; [next[i], next[j]] = [next[j], next[i]]; return next; };

function Editor({ block, patch }) {
  const t = block.type;
  const screens = Object.entries(SCREENS).map(([value, s]) => ({ value, label: s.label }));
  const targets = block.screen ? Object.entries(SCREENS[block.screen].targets).map(([value, label]) => ({ value, label })) : [];
  return h('div', { className: 'pb-stack' },
    h('div', { className: 'pb-row' }, h('span', { className: 'pb-tile' }, h(BLOCK_TYPES[t].icon, { size: 20 })), h('div', null, h('b', null, BLOCK_TYPES[t].label), h('div', { className: 'pb-muted' }, BLOCK_TYPES[t].hint))),
    h(TextField, { label: t === 'welcome' || t === 'thanks' ? 'Heading' : 'Question', value: block.title, onChange: (e) => patch({ title: e.target.value }) }),
    h(TextField, { label: 'Description', multiline: true, minRows: 2, maxRows: 6, value: block.desc || '', onChange: (e) => patch({ desc: e.target.value }) }),
    t === 'scale' && h('div', { className: 'pb-stack' },
      h(SegmentedControl, { label: 'Scale', size: 'md', value: String(block.max), onValueChange: (v) => patch({ max: Number(v) }), items: [{ value: '5', label: '1 to 5 stars' }, { value: '7', label: '1 to 7' }, { value: '10', label: '0 to 10' }] }),
      h('div', { className: 'pb-grid2' }, h(TextField, { size: 'sm', label: 'Low label', value: block.low || '', onChange: (e) => patch({ low: e.target.value }) }), h(TextField, { size: 'sm', label: 'High label', value: block.high || '', onChange: (e) => patch({ high: e.target.value }) }))),
    t === 'choice' && h('div', { className: 'pb-stack' },
      (block.options || []).map((o, i) => h('div', { key: o.id, className: 'pb-row' },
        h('div', { className: 'pb-grow' }, h(TextField, { size: 'sm', label: `Option ${i + 1}`, value: o.label, onChange: (e) => patch({ options: block.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) }) })),
        h(IconButton, { variant: 'ghost', size: 'sm', label: `Remove option ${i + 1}`, icon: h(I.Trash01), disabled: block.options.length <= 2, onClick: () => patch({ options: block.options.filter((x) => x.id !== o.id) }) }))),
      h('div', { className: 'pb-row' }, h(Button, { variant: 'secondary', size: 'sm', icon: h(I.Plus), disabled: (block.options || []).length >= 8, onClick: () => patch({ options: [...(block.options || []), { id: uid('o'), label: '' }] }) }, 'Add option')),
      h(Switch, { size: 'md', label: 'Allow several answers', checked: !!block.multiple, onCheckedChange: (v) => patch({ multiple: v }) })),
    (t === 'task' || t === 'fivesec') && h('div', { className: 'pb-stack' },
      h('div', { className: t === 'task' ? 'pb-grid2' : undefined },
        h(Select, { size: 'sm', label: 'Prototype', value: block.screen, onValueChange: (v) => patch({ screen: v, targets: [Object.keys(SCREENS[v].targets)[0]] }), options: screens }),
        t === 'task' && h(Select, { size: 'sm', label: 'Success when people click', value: block.targets?.[0], onValueChange: (v) => patch({ targets: [v] }), options: targets })),
      h('div', { className: 'pb-proto pb-proto--small' }, h(Screen, { screen: block.screen }))),
    !['welcome', 'thanks'].includes(t) && h(Switch, { size: 'md', label: 'Required', checked: !!block.required, onCheckedChange: (v) => patch({ required: v }) }));
}

export function Builder({ study }) {
  const store = useStore();
  const { toast } = useToast();
  const [sel, setSel] = useState(study.blocks[0]?.id);
  const [share, setShare] = useState(false);
  const [del, setDel] = useState(null);
  const wide = useMedia('(min-width: 1240px)');
  const blocks = study.blocks;
  const block = blocks.find((b) => b.id === sel) || blocks[0];
  const setBlocks = (next) => store.update(study.id, { blocks: next });
  const patch = (p) => setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, ...p } : b)));
  useEffect(() => { if (new URLSearchParams(location.hash.split('?')[1] || '').get('share')) setShare(true); }, []);
  useEffect(() => { setSel(study.blocks[0]?.id); }, [study.id]);

  const add = (type) => {
    const b = newBlock(type);
    const thanks = blocks.findIndex((x) => x.type === 'thanks');
    const next = [...blocks];
    next.splice(type === 'thanks' ? next.length : thanks >= 0 ? thanks : next.length, 0, b);
    setBlocks(next); setSel(b.id);
  };
  const remove = (b) => {
    const idx = blocks.indexOf(b);
    const next = blocks.filter((x) => x.id !== b.id);
    setBlocks(next); setSel(next[Math.min(idx, next.length - 1)]?.id); setDel(null);
    toast({ message: 'Block deleted', action: { label: 'Undo', onClick: () => { setBlocks(blocks); setSel(b.id); } }, duration: 4500 });
  };
  const options = [];
  ['Screens', 'Tests', 'Questions'].forEach((g) => {
    options.push({ type: 'group', label: g });
    Object.entries(BLOCK_TYPES).filter(([, v]) => v.group === g).forEach(([value, v]) => options.push({ value, label: v.label, icon: h(v.icon), details: undefined }));
  });

  return h('div', { className: 'pb-stack pb-stack--lg' },
    h(StudyHeader, { study, tab: 'build', onShare: () => setShare(true) }),
    h('div', { className: 'pb-builder', 'data-wide': wide || undefined },
      h('section', { className: 'pb-panel', 'aria-label': 'Blocks' },
        h('div', { className: 'pb-panel__head' }, h('b', null, 'Blocks'), h(Badge, { variant: 'secondary', size: 'md', type: 'counter', label: blocks.length })),
        blocks.length
          ? h(List, { size: 'md', spacing: 'sm', 'aria-label': 'Blocks of the study' }, blocks.map((b, i) => h(ListItem, {
            key: b.id, active: b.id === block?.id, onClick: () => setSel(b.id), icon: h(BLOCK_TYPES[b.type].icon), subtitle: BLOCK_TYPES[b.type].label,
            control: b.id !== block?.id ? undefined : h('span', { className: 'pb-row pb-row--tight' },
              h(IconButton, { variant: 'ghost', size: 'sm', label: 'Move up', icon: h(I.ArrowUp), disabled: i === 0, onClick: (e) => { e.stopPropagation(); setBlocks(move(blocks, i, -1)); } }),
              h(IconButton, { variant: 'ghost', size: 'sm', label: 'Move down', icon: h(I.ArrowDown), disabled: i === blocks.length - 1, onClick: (e) => { e.stopPropagation(); setBlocks(move(blocks, i, 1)); } }),
              h(IconButton, { variant: 'ghost', size: 'sm', label: 'Delete the block', icon: h(I.Trash01), onClick: (e) => { e.stopPropagation(); setDel(b); } })),
          }, b.title || 'Untitled')))
          : h(Status, { status: 'neutral', title: 'No blocks yet', description: 'Add a screen, a task or a question.' }),
        h(Dropdown, { size: 'md', label: 'Add a block', options, value: null, onValueChange: add, trigger: (tp) => h(Button, { variant: 'secondary', icon: h(I.Plus), width: '100%', ...tp }, 'Add a block') }),
        h(Card, { padding: 16, variant: 'muted' }, h('div', { className: 'pb-stack' },
          h('b', null, 'Study settings'),
          h(TextField, { size: 'sm', label: 'Name', value: study.name, onChange: (e) => store.update(study.id, { name: e.target.value }) }),
          h('div', { className: 'pb-grid2' }, h(NumberInput, { size: 'sm', label: 'Goal', min: 1, max: 5000, value: study.goal, onValueChange: (v) => store.update(study.id, { goal: Number(v) || 1 }) }), h(NumberInput, { size: 'sm', label: 'Minutes', min: 1, max: 60, value: study.minutes, onValueChange: (v) => store.update(study.id, { minutes: Number(v) || 1 }) }))))),
      h('section', { className: 'pb-panel pb-panel--edit', 'aria-label': 'Block editor' },
        block ? h(Editor, { block, patch, key: block.id }) : h(Status, { status: 'neutral', title: 'Nothing selected', description: 'Choose a block on the left to edit it.' })),
      wide && h('section', { className: 'pb-panel pb-panel--preview', 'aria-label': 'Preview' },
        h('div', { className: 'pb-panel__head' }, h('b', null, 'Preview'), h(Tooltip, { content: 'Open the whole study' }, h(IconButton, { variant: 'ghost', size: 'sm', label: 'Open the preview', icon: h(I.LinkExternal01), onClick: () => go(`/run/${study.id}?preview=1`) }))),
        block && h('div', { className: 'pb-preview', key: block.id }, h(BlockView, { block, preview: true, onAnswer: () => {} })))),
    h(ShareModal, { study, open: share, onClose: () => setShare(false) }),
    h(AlertDialog, { open: !!del, onOpenChange: (o) => !o && setDel(null), destructive: true, title: 'Delete this block?', description: del ? `“${del.title || 'Untitled'}” will be removed from the study.` : '', confirmLabel: 'Delete', onConfirm: () => remove(del) }));
}
