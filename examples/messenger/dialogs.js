import { h, useState, useEffect } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Avatar, AvatarGroup, AvatarGroupOverflow } from '../../src/components/Avatar.js';
import { Badge } from '../../src/components/Badge.js';
import { List, ListItem } from '../../src/components/List.js';
import { Tabs, TabList, Tab, TabPanel } from '../../src/components/Tabs.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { CollapsibleGroup } from '../../src/components/Collapsible.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { Rating } from '../../src/components/Rating.js';
import { Spinner } from '../../src/components/Spinner.js';
import { Status } from '../../src/components/Status.js';
import { Grid } from '../../src/components/Layout.js';
import { Modal, TextField, Switch, CheckboxGroup } from '../../src/base.js';
import { Checkbox } from '../../src/components/Checks.js';
import { I } from './icons.js';
import { CONTACTS, FILES, contactOf } from './data.js';
import { PersonAvatar, chatTitle, chatSubtitle } from './chat.js';

/** The info of a chat: about, media, files and members. Used as the right column on a wide screen and in a sheet on a phone. */
export function InfoContent({ chat, onToggle, onDelete, onCall, toast }) {
  const group = chat.type === 'group';
  const [confirm, setConfirm] = useState(false);
  const members = group ? chat.members : [];
  const files = FILES.slice(0, group ? 5 : 3);
  const columns = [
    { key: 'name', header: 'Name', width: proportional(3), sortable: true },
    { key: 'size', header: 'Size', width: pixel(92), align: 'end', renderCell: (f) => h('span', { style: { whiteSpace: 'nowrap' } }, f.size) },
  ];
  return h('div', { className: 'mm-info__scroll' },
    h('div', { className: 'mm-center' },
      h(PersonAvatar, { id: chat.with, group, size: 'xl' }),
      h('div', { className: 'mm-center__name' }, h('h2', null, chatTitle(chat)), h('span', { className: 'mm-muted' }, chatSubtitle(chat, false))),
      group && h(AvatarGroup, { size: 'sm' }, members.slice(0, 3).map((m) => h(Avatar, { key: m, name: contactOf(m).name, tooltip: true })), members.length > 3 && h(AvatarGroupOverflow, { count: members.length - 3 }))),
    h(Grid, { columns: 3, gap: 8 },
      h(Button, { variant: 'secondary', icon: h(I.Phone), onClick: () => onCall(chat), width: '100%' }, 'Call'),
      h(Button, { variant: 'secondary', icon: chat.muted ? h(I.BellOff01) : h(I.Bell01), onClick: () => onToggle('muted'), width: '100%' }, chat.muted ? 'Unmute' : 'Mute'),
      h(Button, { variant: 'secondary', icon: h(I.Pin01), onClick: () => onToggle('pinned'), width: '100%' }, chat.pinned ? 'Unpin' : 'Pin')),
    h(Tabs, { defaultValue: 'files' },
      h(TabList, { size: 'sm', label: 'Shared content', fullWidth: true, showBadge: false },
        h(Tab, { value: 'media', icon: h(I.Image01) }, 'Media'),
        h(Tab, { value: 'files', icon: h(I.File06), counter: files.length }, 'Files'),
        group && h(Tab, { value: 'members', icon: h(I.Users01), counter: members.length }, 'People')),
      h(TabPanel, { value: 'media' }, h('div', { className: 'mm-media', style: { marginTop: 12 } }, Array.from({ length: 9 }, (_, i) => h('i', { key: i, style: { background: `linear-gradient(135deg, hsl(${(i * 47 + 20) % 360} 75% 62%), hsl(${(i * 47 + 80) % 360} 70% 50%))` } })))),
      h(TabPanel, { value: 'files' }, h('div', null, h(Table, { data: files, columns, density: 'compact', caption: 'Shared files', hoverable: true, onRowClick: (f) => toast({ message: `Opening ${f.name}…`, status: 'info', duration: 2500 }) }))),
      group && h(TabPanel, { value: 'members' }, h(List, { size: 'sm', spacing: 'sm', 'aria-label': 'Members' }, members.map((id) => h(ListItem, { key: id, avatar: h(PersonAvatar, { id, size: 'sm' }), subtitle: contactOf(id).bio }, contactOf(id).name))))),
    h(CollapsibleGroup, { multiple: true, defaultValue: ['notify'], items: [
      { value: 'notify', title: 'Notifications', content: h('div', { className: 'mm-stack' },
        h(Switch, { size: 'md', label: 'Mute notifications', checked: !!chat.muted, onCheckedChange: () => onToggle('muted') }),
        h(Switch, { size: 'md', label: 'Pin to the top', checked: !!chat.pinned, onCheckedChange: () => onToggle('pinned') })) },
      { value: 'privacy', title: 'Privacy', content: h('span', { className: 'mm-muted' }, 'Messages in this chat are end-to-end encrypted (a demo, nothing leaves your browser).') },
    ] }),
    h(Button, { variant: 'destructive', icon: h(I.Trash01), onClick: () => setConfirm(true), width: '100%' }, 'Delete chat'),
    h(AlertDialog, { open: confirm, onOpenChange: setConfirm, destructive: true, title: 'Delete this chat?', description: `The conversation with ${chatTitle(chat)} will be removed from this device.`, confirmLabel: 'Delete', onConfirm: () => { setConfirm(false); onDelete(chat.id); } }));
}

export function InfoSheet({ open, onClose, ...rest }) {
  return h(Modal, { open, onOpenChange: (o) => !o && onClose(), title: 'Chat info', keepMounted: false }, rest.chat && h(InfoContent, rest));
}

/** A call: ringing, the timer, mute, end, and a rating of the quality afterwards. */
export function CallModal({ call, onClose, toast }) {
  const [phase, setPhase] = useState('ringing');
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [stars, setStars] = useState(0);
  useEffect(() => { if (call) { setPhase('ringing'); setSecs(0); setMuted(false); setStars(0); } }, [call]);
  useEffect(() => {
    if (!call || phase !== 'ringing') return undefined;
    const t = setTimeout(() => setPhase('live'), 1800);
    return () => clearTimeout(t);
  }, [call, phase]);
  useEffect(() => {
    if (phase !== 'live') return undefined;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);
  const mm = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const title = call ? (call.name) : '';
  return h(Modal, {
    open: !!call, onOpenChange: (o) => { if (!o) { setPhase('done'); } }, title: phase === 'done' ? 'Call ended' : 'Voice call',
    primaryAction: phase === 'done' ? h(Button, { variant: 'primary', onClick: () => { if (stars) toast({ message: `Thanks for rating: ${stars}/5`, status: 'success', duration: 3000 }); onClose(); } }, 'Done') : undefined,
  }, call && h('div', { className: 'mm-call' },
    h(PersonAvatar, { id: call.id, group: call.group, name: call.name, size: 'xl', dot: false }),
    h('h2', { style: { margin: 0, font: 'var(--baseui-Typography-Header-24)' } }, title),
    phase === 'ringing' && h('div', { className: 'mm-row mm-muted' }, h(Spinner, { size: 'sm' }), 'Calling…'),
    phase === 'live' && h('div', { className: 'mm-call__timer', role: 'timer' }, mm),
    phase === 'done' && h('div', { className: 'mm-stack', style: { alignItems: 'center' } },
      h('span', { className: 'mm-muted' }, `Duration ${mm}`),
      h(Rating, { label: 'How was the call quality?', value: stars, onValueChange: setStars, size: 'md' })),
    phase !== 'done' && h('div', { className: 'mm-call__row' },
      h(IconButton, { variant: muted ? 'primary' : 'secondary', size: 'md', label: muted ? 'Unmute microphone' : 'Mute microphone', icon: muted ? h(I.MicrophoneOff01) : h(I.Microphone01), onClick: () => setMuted(!muted) }),
      h(IconButton, { variant: 'destructive', size: 'md', label: 'End call', icon: h(I.PhoneHangUp), onClick: () => setPhase('done') }))));
}

/** A new chat or group: pick the people from the contacts. */
export function NewChatModal({ open, onClose, onCreate }) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState([]);
  const [name, setName] = useState('');
  useEffect(() => { if (open) { setQuery(''); setPicked([]); setName(''); } }, [open]);
  const list = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return h(Modal, {
    open, onOpenChange: (o) => !o && onClose(), title: 'New chat', subtitle: picked.length > 1 ? 'A group needs a name' : 'Pick one person, or several for a group',
    primaryAction: h(Button, { variant: 'primary', disabled: !picked.length || (picked.length > 1 && !name.trim()), onClick: () => onCreate(picked, name.trim()) }, picked.length > 1 ? 'Create group' : 'Start chat'),
    secondaryAction: h(Button, { variant: 'secondary', onClick: onClose }, 'Cancel'),
  }, h('div', { className: 'mm-stack' },
    h(TextField, { size: 'sm', label: 'Search contacts', startIcon: h(I.SearchLg), value: query, onChange: (e) => setQuery(e.target.value), clearable: true, actionLabel: 'Clear' }),
    picked.length > 0 && h('div', { className: 'mm-chips' }, picked.map((id) => h(Badge, { key: id, variant: 'primary', size: 'md', label: contactOf(id).name }))),
    picked.length > 1 && h(TextField, { size: 'sm', label: 'Group name', value: name, onChange: (e) => setName(e.target.value) }),
    h('div', { className: 'mm-modal-list' }, list.length
      ? h(List, { size: 'sm', 'aria-label': 'Contacts' }, list.map((c) => h(ListItem, { key: c.id, avatar: h(PersonAvatar, { id: c.id, size: 'md' }), subtitle: c.bio, onClick: () => toggle(c.id), control: h(Checkbox, { checked: picked.includes(c.id), onCheckedChange: () => toggle(c.id), 'aria-label': `Select ${c.name}` }) }, c.name)))
      : h(Status, { status: 'neutral', title: 'No contacts found', description: 'Try a different name.' }))));
}
