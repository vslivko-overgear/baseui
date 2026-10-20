import { h, useState, useMemo } from '../../src/react.js';
import { Navbar, BottomBar } from '../../src/components/MobileNavigation.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { List, ListItem } from '../../src/components/List.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Skeleton } from '../../src/components/Skeleton.js';
import { Status } from '../../src/components/Status.js';
import { Pagination } from '../../src/components/Pagination.js';
import { ClickableCard } from '../../src/components/Card.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Link } from '../../src/components/Link.js';
import { Divider } from '../../src/components/Divider.js';
import { HStack } from '../../src/components/Layout.js';
import { TextField } from '../../src/base.js';
import { I, S } from './icons.js';
import { CONTACTS, CALLS, contactOf } from './data.js';
import { PersonAvatar, chatTitle, previewOf } from './chat.js';
import { listTime } from './util.js';

const top = (n) => ({ className: 'mm-pane__top' });
export const SETTINGS_PAGES = [
  { key: 'profile', label: 'Profile', icon: I.UserCircle, hint: 'Name, bio, birthday' },
  { key: 'notifications', label: 'Notifications', icon: I.Bell01, hint: 'Sounds, previews, mentions' },
  { key: 'privacy', label: 'Privacy and security', icon: I.Lock01, hint: 'Last seen, devices' },
  { key: 'appearance', label: 'Appearance', icon: I.Palette, hint: 'Theme, wallpaper, text size' },
  { key: 'storage', label: 'Storage', icon: I.Database01, hint: 'Cache, media, files' },
  { key: 'help', label: 'Help', icon: I.HelpCircle, hint: 'FAQ and feedback' },
];

function ChatSkeleton() {
  return h('div', { className: 'mm-pad', 'aria-busy': 'true', 'aria-label': 'Loading chats' },
    Array.from({ length: 7 }, (_, i) => h('div', { key: i, className: 'mm-row', style: { padding: '10px 0' } },
      h(Skeleton, { variant: 'circle', width: 48, height: 48 }), h('div', { className: 'mm-grow' }, h(Skeleton, { width: '45%' }), h(Skeleton, { width: '80%' })))));
}

export function ChatsSection({ chats, typing, activeId, onOpen, onNew, onReadAll, loading, unread }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const q = query.trim().toLowerCase();
  const shown = useMemo(() => chats
    .filter((c) => (filter === 'unread' ? c.unread > 0 : filter === 'groups' ? c.type === 'group' : true))
    .filter((c) => !q || chatTitle(c).toLowerCase().includes(q) || c.messages.some((m) => m.text?.toLowerCase().includes(q)))
    .sort((a, b) => b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time), [chats, filter, q]);
  const pinned = shown.filter((c) => c.pinned), rest = shown.filter((c) => !c.pinned);
  const row = (c) => {
    const last = c.messages[c.messages.length - 1];
    const isTyping = typing[c.id];
    return h(ListItem, {
      key: c.id, active: c.id === activeId, onClick: () => onOpen(c.id),
      avatar: h(PersonAvatar, { id: c.with, group: c.type === 'group', name: c.type === 'group' ? c.name : undefined, size: 'md' }),
      subtitle: isTyping ? 'typing…' : `${last.from === 'me' ? 'You: ' : c.type === 'group' ? `${contactOf(last.from)?.name.split(' ')[0]}: ` : ''}${previewOf(last)}`,
      details: h('div', { className: 'mm-details' },
        h('span', { className: 'mm-time' }, listTime(last.time)),
        c.unread > 0 ? h(Badge, { type: 'counter', size: 'sm', variant: c.muted ? 'secondary' : 'primary', label: c.unread }) : c.pinned ? h(I.Pin01, { size: 16, 'aria-label': 'Pinned' }) : null),
    }, chatTitle(c));
  };
  return h('div', { className: 'mm-pane' },
    h('div', top(), h(Navbar, {
      title: 'Chats', subtitle: unread ? `${unread} unread` : 'All caught up', showBack: false,
      actions: [{ icon: h(I.CheckDone01, { size: 24 }), label: 'Mark all as read', onClick: onReadAll, disabled: !unread }, { icon: h(I.Edit05 ?? I.Edit01, { size: 24 }), label: 'New chat', onClick: onNew }],
    })),
    h('div', { className: 'mm-scroll' },
      h('div', { className: 'mm-tools' },
        h(TextField, { label: 'Search', startIcon: h(I.SearchLg), value: query, onChange: (e) => setQuery(e.target.value), clearable: true, actionLabel: 'Clear search' }),
        h(SegmentedControl, { label: 'Filter chats', fullWidth: true, size: 'sm', value: filter, onValueChange: setFilter, items: [
          { value: 'all', label: 'All' }, { value: 'unread', label: 'Unread', counter: unread || undefined }, { value: 'groups', label: 'Groups' }] })),
      loading ? h(ChatSkeleton)
        : shown.length === 0 ? h('div', { className: 'mm-pad' }, h(Status, { status: 'neutral', title: 'Nothing found', description: q ? `No chats match “${query}”.` : 'No chats in this filter.', actionLabel: q ? 'Clear search' : 'New chat', actionVariant: 'secondary', onAction: q ? () => setQuery('') : onNew }))
          : h('div', { className: 'mm-pad' },
            pinned.length > 0 && h(List, { title: 'Pinned', divider: rest.length > 0, 'aria-label': 'Pinned chats' }, pinned.map(row)),
            rest.length > 0 && h(List, { title: pinned.length ? 'All chats' : undefined, 'aria-label': 'Chats' }, rest.map(row)))));
}

export function CallsSection({ onCall }) {
  const [filter, setFilter] = useState('all');
  const missed = CALLS.filter((c) => c.kind === 'missed').length;
  const list = CALLS.filter((c) => filter === 'all' || c.kind === 'missed');
  const icon = { incoming: I.PhoneIncoming02, outgoing: I.PhoneOutgoing02, missed: I.PhoneX };
  return h('div', { className: 'mm-pane' },
    h('div', top(), h(Navbar, { title: 'Calls', subtitle: missed ? `${missed} missed` : undefined, showBack: false, actions: [{ icon: h(I.PhonePlus, { size: 24 }), label: 'New call', onClick: () => onCall({ id: 'maya', name: 'Maya Chen' }) }] })),
    h('div', { className: 'mm-scroll' },
      h('div', { className: 'mm-tools' }, h(SegmentedControl, { label: 'Filter calls', fullWidth: true, size: 'sm', value: filter, onValueChange: setFilter, items: [{ value: 'all', label: 'All' }, { value: 'missed', label: 'Missed', counter: missed }] })),
      h('div', { className: 'mm-pad' }, list.length
        ? h(List, { 'aria-label': 'Call history' }, list.map((c) => {
          const person = contactOf(c.who);
          return h(ListItem, {
            key: c.id, avatar: h(PersonAvatar, { id: c.who, size: 'md' }), onClick: () => onCall({ id: c.who, name: person.name }),
            subtitle: h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4, color: c.kind === 'missed' ? 'var(--baseui-Extensions-Text-and-Icon-Error)' : undefined } }, h(icon[c.kind], { size: 16 }), c.kind === 'missed' ? 'Missed' : `${c.kind === 'incoming' ? 'Incoming' : 'Outgoing'} · ${c.length}`),
            details: h('span', { className: 'mm-time' }, listTime(Date.now() - c.minutes * 60000)),
            control: h(IconButton, { variant: 'ghost', size: 'sm', label: `Call ${person.name}`, icon: h(I.Phone), onClick: (e) => { e.stopPropagation(); onCall({ id: c.who, name: person.name }); } }),
          }, person.name);
        }))
        : h(Status, { status: 'success', title: 'No missed calls', description: 'You are all caught up.' }))));
}

export function ContactsSection({ onOpenContact, onMessage, onNew }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE = 8;
  const list = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const cur = Math.min(page, pages);
  return h('div', { className: 'mm-pane' },
    h('div', top(), h(Navbar, { title: 'Contacts', subtitle: `${CONTACTS.length} people`, showBack: false, actions: [{ icon: h(I.UserPlus01, { size: 24 }), label: 'Add contact', onClick: onNew }] })),
    h('div', { className: 'mm-scroll' },
      h('div', { className: 'mm-tools' }, h(TextField, { label: 'Search contacts', startIcon: h(I.SearchLg), value: query, onChange: (e) => { setQuery(e.target.value); setPage(1); }, clearable: true, actionLabel: 'Clear search' })),
      h('div', { className: 'mm-pad' },
        list.length ? h(List, { 'aria-label': 'Contacts' }, list.slice((cur - 1) * PAGE, cur * PAGE).map((c) => h(ListItem, {
          key: c.id, avatar: h(PersonAvatar, { id: c.id, size: 'md' }), subtitle: c.bio, onClick: () => onOpenContact(c.id),
          control: h(IconButton, { variant: 'ghost', size: 'sm', label: `Message ${c.name}`, icon: h(I.MessageChatCircle), onClick: (e) => { e.stopPropagation(); onMessage(c.id); } }),
        }, c.name)))
          : h(Status, { status: 'neutral', title: 'No contacts found', description: `Nobody is called “${query}”.` }),
        pages > 1 && h('div', { style: { display: 'flex', justifyContent: 'center', padding: '16px 0' } }, h(Pagination, { page: cur, total: pages, onPageChange: setPage, siblings: 0 })))));
}

export function SettingsSection({ page, onOpen, profile }) {
  return h('div', { className: 'mm-pane' },
    h('div', top(), h(Navbar, { title: 'Settings', showBack: false })),
    h('div', { className: 'mm-scroll' },
      h('div', { className: 'mm-pad mm-stack', style: { paddingTop: 8 } },
        h(ClickableCard, { label: 'Open profile', onClick: () => onOpen('profile') },
          h('div', { className: 'mm-profile-card' }, h(Avatar, { name: profile.name, size: 'lg', tooltip: false }),
            h('div', { className: 'mm-grow' }, h('div', { style: { font: 'var(--baseui-Typography-Text-16-Bold)' } }, profile.name), h('div', { className: 'mm-muted' }, profile.bio)))),
        h(List, { 'aria-label': 'Settings' }, SETTINGS_PAGES.map((p) => h(ListItem, { key: p.key, icon: h(p.icon), subtitle: p.hint, active: page === p.key, onClick: () => onOpen(p.key) }, p.label))),
        h(Divider),
        h('div', { className: 'mm-stack' },
          h(Button, { variant: 'secondary', href: '../../#/theming/theme-settings', icon: h(I.Palette), width: '100%' }, 'Design system theme'),
          h('span', { className: 'mm-muted', style: { font: 'var(--baseui-Typography-Text-14-Regular)' } }, 'The brand color, shape, fonts, animations, floating bars and glass apply to this app as well. ', h(Link, { href: '../../#/' }, 'Back to the documentation'), '.')))));
}

export function Sidebar({ section, setSection, unread, missed, children }) {
  const items = [
    { value: 'chats', label: 'Chats', icon: h(I.MessageChatCircle), activeIcon: h(S.MessageChatCircle), badge: unread || undefined },
    { value: 'calls', label: 'Calls', icon: h(I.Phone), activeIcon: h(S.Phone), badge: missed || undefined },
    { value: 'contacts', label: 'Contacts', icon: h(I.Users01), activeIcon: h(S.Users01) },
    { value: 'settings', label: 'Settings', icon: h(I.Settings02), activeIcon: h(S.Settings02) },
  ];
  return h('aside', { className: 'mm-side', 'aria-label': 'Messenger' },
    children,
    h('div', { className: 'mm-pane__bottom' }, h(BottomBar, { items, value: section, onValueChange: setSection })));
}
