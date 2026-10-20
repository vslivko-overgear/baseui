import { h, useState } from '../../src/react.js';
import { Navbar } from '../../src/components/MobileNavigation.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Badge } from '../../src/components/Badge.js';
import { Banner } from '../../src/components/Banner.js';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.js';
import { Card, SelectableCard } from '../../src/components/Card.js';
import { CollapsibleGroup } from '../../src/components/Collapsible.js';
import { DatePicker } from '../../src/components/Calendar.js';
import { Link } from '../../src/components/Link.js';
import { List, ListItem } from '../../src/components/List.js';
import { NumberInput } from '../../src/components/NumberInput.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { Rating } from '../../src/components/Rating.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Slider } from '../../src/components/Slider.js';
import { Spinner } from '../../src/components/Spinner.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { Tooltip } from '../../src/components/Tooltip.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { Checkbox, RadioGroup, CheckboxGroup } from '../../src/components/Checks.js';
import { Modal, Select, Switch, TextField } from '../../src/base.js';
import { I } from './icons.js';
import { SESSIONS, STORAGE, WALLPAPERS } from './data.js';
import { SETTINGS_PAGES } from './lists.js';
import { useColorScheme } from './util.js';

const Group = ({ title, caption, children }) => h('section', { className: 'mm-group' },
  h('div', null, h('div', { style: { font: 'var(--baseui-Typography-Text-16-Bold)' } }, title), caption && h('div', { className: 'mm-muted', style: { font: 'var(--baseui-Typography-Text-14-Regular)' } }, caption)),
  children);

function Profile({ settings, update, toast }) {
  const [p, setP] = useState(settings.profile);
  const dirty = JSON.stringify(p) !== JSON.stringify(settings.profile);
  return h('div', { className: 'mm-stack' },
    h('div', { className: 'mm-profile-card' },
      h(Avatar, { name: p.name || 'A', size: 'xl', tooltip: false }),
      h('div', { className: 'mm-stack', style: { gap: 8 } }, h(Button, { variant: 'secondary', size: 'sm', icon: h(I.Camera01), onClick: () => toast({ message: 'Photo upload is not part of this demo', status: 'info' }) }, 'Change photo'),
        h(Badge, { variant: 'success', label: 'Online', size: 'md' }))),
    h(TextField, { label: 'Name', value: p.name, onChange: (e) => setP({ ...p, name: e.target.value }) }),
    h(TextField, { label: 'Bio', multiline: true, minRows: 2, maxRows: 4, value: p.bio, onChange: (e) => setP({ ...p, bio: e.target.value }) }),
    h(DatePicker, { label: 'Birthday', value: p.birthday, onValueChange: (v) => setP({ ...p, birthday: v }), max: new Date().toISOString().slice(0, 10), weekStartsOn: 1, locale: 'en-US' }),
    h(Select, { label: 'Status', value: p.status, onValueChange: (v) => setP({ ...p, status: v }), options: [{ value: 'online', label: 'Online' }, { value: 'away', label: 'Away' }, { value: 'busy', label: 'Do not disturb' }] }),
    h('div', { className: 'mm-row' },
      h(Button, { variant: 'primary', isDisabled: !dirty, clickAction: async () => { await new Promise((r) => setTimeout(r, 700)); update({ profile: p }); toast({ message: 'Profile saved', status: 'success' }); } }, 'Save changes'),
      h(Button, { variant: 'ghost', isDisabled: !dirty, onClick: () => setP(settings.profile) }, 'Discard')));
}

function Notifications({ settings, update, toast }) {
  const row = (key, label, subtitle) => h(ListItem, { key, subtitle, control: h(Switch, { size: 'md', 'aria-label': label, checked: !!settings[key], onCheckedChange: (v) => update({ [key]: v }) }) }, label);
  return h('div', { className: 'mm-stack', style: { gap: 24 } },
    h(Group, { title: 'Alerts' }, h(List, { 'aria-label': 'Alerts' }, row('notifyMessages', 'Messages', 'From people you chat with'), row('notifyGroups', 'Groups', 'Messages in group chats'), row('notifyCalls', 'Calls', 'Incoming and missed calls'), row('preview', 'Message preview', 'Show the text in the notification'))),
    h(Group, { title: 'Sound' },
      h(RadioGroup, { title: 'Notification sound', value: settings.sound, onValueChange: (v) => update({ sound: v }), options: [{ value: 'chime', label: 'Chime' }, { value: 'pop', label: 'Pop' }, { value: 'none', label: 'None' }] }),
      h(Slider, { label: 'Volume', showValue: true, value: settings.volume, onValueChange: (v) => update({ volume: v }), disabled: settings.sound === 'none' })),
    h(Group, { title: 'Notify me about', caption: 'Only for chats that are not muted' },
      h(CheckboxGroup, { title: 'Events', value: settings.notifyAbout, onValueChange: (v) => update({ notifyAbout: v }), options: [{ value: 'mentions', label: 'Mentions' }, { value: 'replies', label: 'Replies to my messages' }, { value: 'reactions', label: 'Reactions' }] })),
    h(Group, { title: 'Quiet hours', caption: 'Mute every chat for a number of hours' },
      h('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' } }, h('div', { style: { width: 160 } }, h(NumberInput, { label: 'Hours', defaultValue: 8, min: 1, max: 24 })),
        h(Button, { variant: 'secondary', size: 'lg', icon: h(I.BellOff01), onClick: () => toast({ message: 'Notifications are muted for 8 hours', status: 'success', action: { label: 'Undo' } }) }, 'Mute'))));
}

function Privacy({ settings, update, toast }) {
  const [sessions, setSessions] = useState(SESSIONS);
  const [ending, setEnding] = useState(null);
  const columns = [
    { key: 'device', header: 'Device', width: proportional(3), renderCell: (s) => h('span', null, s.device, s.current && h(Badge, { variant: 'success', size: 'sm', label: 'This device', className: 'mm-badge-gap' })) },
    { key: 'active', header: 'Active', width: proportional(2) },
    { key: 'act', header: '', width: pixel(48), align: 'end', renderCell: (s) => !s.current && h(IconButton, { variant: 'ghost', size: 'sm', label: `End session on ${s.device}`, icon: h(I.LogOut01), onClick: () => setEnding(s) }) },
  ];
  return h('div', { className: 'mm-stack', style: { gap: 24 } },
    h(Banner, { status: 'info', title: 'End-to-end encryption' }, 'Messages here never leave your browser. Read how the real thing works in the ', h(Link, { href: '../../#/' }, 'documentation'), '.'),
    h(Group, { title: 'Who can see my last seen' },
      h(Select, { label: 'Last seen', value: settings.lastSeen, onValueChange: (v) => update({ lastSeen: v }), options: [{ value: 'everyone', label: 'Everyone' }, { value: 'contacts', label: 'My contacts' }, { value: 'nobody', label: 'Nobody' }] }),
      h(List, { 'aria-label': 'Privacy' },
        h(ListItem, { subtitle: 'Others see when you have read their messages', control: h(Switch, { size: 'md', 'aria-label': 'Read receipts', checked: settings.readReceipts, onCheckedChange: (v) => update({ readReceipts: v }) }) }, 'Read receipts'),
        h(ListItem, { subtitle: 'Ask for a password when you sign in', control: h(Switch, { size: 'md', 'aria-label': 'Two-step verification', checked: settings.twoStep, onCheckedChange: (v) => { update({ twoStep: v }); toast({ message: v ? 'Two-step verification is on' : 'Two-step verification is off', status: v ? 'success' : 'neutral' }); } }) }, 'Two-step verification'))),
    h(Group, { title: 'Active sessions' }, h(Table, { data: sessions, columns, density: 'compact', caption: 'Active sessions' })),
    h(CollapsibleGroup, { items: [
      { value: 'blocked', title: 'Blocked users', content: h('span', { className: 'mm-muted' }, 'You have not blocked anyone.') },
      { value: 'data', title: 'My data', content: h('div', { className: 'mm-stack' }, h('span', { className: 'mm-muted' }, 'Download a copy of everything this demo keeps for you in this browser.'), h(Button, { variant: 'secondary', size: 'sm', icon: h(I.Download01), onClick: () => toast({ message: 'The export is ready (a demo)', status: 'success' }) }, 'Export data')) },
    ] }),
    h(AlertDialog, { open: !!ending, onOpenChange: (o) => !o && setEnding(null), destructive: true, title: 'End this session?', description: ending ? `${ending.device} will be signed out.` : '', confirmLabel: 'End session', onConfirm: () => { setSessions((s) => s.filter((x) => x.id !== ending.id)); setEnding(null); toast({ message: 'Session ended', status: 'success' }); } }));
}

const WALL = { plain: 'var(--baseui-Background-Secondary)', dawn: 'linear-gradient(135deg, var(--baseui-Accent-Colors-Orange), var(--baseui-Accent-Colors-Pink))', ocean: 'linear-gradient(135deg, var(--baseui-Accent-Colors-Blue), var(--baseui-Accent-Colors-Blue-Light))', meadow: 'linear-gradient(135deg, var(--baseui-Accent-Colors-Green), var(--baseui-Accent-Colors-Green-Light))' };
function Appearance({ settings, update }) {
  const [scheme, setScheme] = useColorScheme();
  return h('div', { className: 'mm-stack', style: { gap: 24 } },
    h(Group, { title: 'Color scheme' }, h(SegmentedControl, { label: 'Color scheme', value: scheme, onValueChange: setScheme, items: [{ value: 'light', label: 'Light', icon: h(I.Sun) }, { value: 'dark', label: 'Dark', icon: h(I.Moon01) }] })),
    h(Group, { title: 'Design system theme', caption: 'Brand color, shape, fonts, animations, floating bars and glass' },
      h(Card, { padding: 16 }, h('div', { className: 'mm-row' }, h(I.Palette, { size: 24 }), h('div', { className: 'mm-grow' }, 'Open Theme settings to restyle this app. Your choices are kept on this device.'), h(Button, { variant: 'primary', size: 'sm', href: '../../#/theming/theme-settings' }, 'Open')))),
    h(Group, { title: 'Chat wallpaper' }, h('div', { className: 'mm-grid2' }, WALLPAPERS.map((w) => h(SelectableCard, { key: w.value, label: w.label, isSelected: settings.wallpaper === w.value, onChange: () => update({ wallpaper: w.value }), padding: 12 },
      h('div', { className: 'mm-wall', style: { background: WALL[w.value] } }), w.label)))),
    h(Group, { title: 'Text' },
      h(Slider, { label: 'Text size', showValue: true, min: 80, max: 130, value: settings.textSize, onValueChange: (v) => update({ textSize: v }) }),
      h(RadioGroup, { title: 'Message density', value: settings.density, onValueChange: (v) => update({ density: v }), options: [{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }] })),
    h(List, { 'aria-label': 'Chat options' }, h(ListItem, { subtitle: 'Next to messages in group chats', control: h(Switch, { size: 'md', 'aria-label': 'Avatars in groups', checked: settings.groupAvatars, onCheckedChange: (v) => update({ groupAvatars: v }) }) }, 'Avatars in groups')),
    h(Group, { title: 'Preview' }, h('div', { className: 'mm-wallpaper', 'data-wallpaper': settings.wallpaper, style: { padding: 16, borderRadius: 'var(--baseui-radius-16)', display: 'flex', flexDirection: 'column', gap: 4, fontSize: `${settings.textSize}%` } },
      h('div', { className: 'mm-msg', 'data-first': true }, h('div', { className: 'mm-bubble' }, 'Hi! How do you like the new look?')),
      h('div', { className: 'mm-msg', 'data-own': true }, h('div', { className: 'mm-bubble' }, 'Love it ✨')))));
}

function Storage({ toast }) {
  const [rows, setRows] = useState(STORAGE);
  const [selected, setSelected] = useState(['cache']);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const used = rows.reduce((a, r) => a + r.size, 0);
  const clearSel = rows.filter((r) => selected.includes(r.id)).reduce((a, r) => a + r.size, 0);
  const columns = [{ key: 'name', header: 'Category', width: proportional(2) }, { key: 'size', header: 'Size', align: 'end', width: pixel(110), renderCell: (r) => `${r.size} MB` }];
  return h('div', { className: 'mm-stack', style: { gap: 24 } },
    h(Group, { title: `${used} MB of 5 GB used` }, h(ProgressBar, { value: (used / 5120) * 100, label: 'Storage used', size: 'md' })),
    h(Table, { data: rows, columns, caption: 'Storage by category', selectionMode: 'multiple', selectedKeys: selected, onSelectionChange: (k) => setSelected([...k]) }),
    h('div', { className: 'mm-row' },
      h(Button, { variant: 'destructive', icon: h(I.Trash01), isDisabled: !clearSel || busy, isLoading: busy, onClick: () => setConfirm(true) }, `Clear ${clearSel} MB`),
      busy && h('span', { className: 'mm-row mm-muted' }, h(Spinner, { size: 'sm' }), 'Clearing…')),
    h(AlertDialog, { open: confirm, onOpenChange: setConfirm, destructive: true, title: 'Clear selected data?', description: 'Cached files will be downloaded again when needed.', confirmLabel: 'Clear', onConfirm: () => {
      setConfirm(false); setBusy(true);
      setTimeout(() => { setRows((r) => r.map((x) => (selected.includes(x.id) ? { ...x, size: 0 } : x))); setSelected([]); setBusy(false); toast({ message: `${clearSel} MB freed`, status: 'success' }); }, 1200);
    } }));
}

function Help({ toast }) {
  const [feedback, setFeedback] = useState(false);
  const [text, setText] = useState('');
  const [stars, setStars] = useState(0);
  return h('div', { className: 'mm-stack', style: { gap: 24 } },
    h(CollapsibleGroup, { items: [
      { value: 'a', title: 'How do I start a group chat?', content: 'Press “New chat” in the Chats list, pick two or more people and give the group a name.' },
      { value: 'b', title: 'Where is my data stored?', content: 'Only in this browser. The messenger is an example without a server: chats are mock data and the settings sit in localStorage.' },
      { value: 'c', title: 'How do I change the look?', content: h('span', null, 'Open ', h(Link, { href: '../../#/theming/theme-settings' }, 'Theme settings'), ' of the design system: brand color, shape, fonts and animations apply here as well.') },
    ] }),
    h(Group, { title: 'Rate Messenger' }, h(Rating, { label: 'Your rating', value: stars, onValueChange: (v) => { setStars(v); toast({ message: `Thanks! ${v} of 5`, status: 'success', duration: 2500 }); } })),
    h('div', { className: 'mm-row' }, h(Button, { variant: 'secondary', icon: h(I.MessageSquare01), onClick: () => setFeedback(true) }, 'Send feedback'), h(Tooltip, { content: 'Opens the baseui documentation' }, h(Button, { variant: 'ghost', href: '../../#/', icon: h(I.File06) }, 'Documentation'))),
    h(Modal, { open: feedback, onOpenChange: setFeedback, title: 'Send feedback', primaryAction: h(Button, { variant: 'primary', isDisabled: !text.trim(), onClick: () => { setFeedback(false); setText(''); toast({ message: 'Thank you for the feedback', status: 'success' }); } }, 'Send'), secondaryAction: h(Button, { variant: 'secondary', onClick: () => setFeedback(false) }, 'Cancel') },
      h(TextField, { label: 'What can we improve?', multiline: true, minRows: 4, maxRows: 8, value: text, onChange: (e) => setText(e.target.value) })));
}

const PAGES = { profile: Profile, notifications: Notifications, privacy: Privacy, appearance: Appearance, storage: Storage, help: Help };

export function SettingsPage({ pageKey, isMobile, onBack, ...props }) {
  const meta = SETTINGS_PAGES.find((p) => p.key === pageKey);
  const Page = PAGES[pageKey];
  return h('div', { className: 'mm-pane' },
    h('div', { className: 'mm-pane__top' }, h(Navbar, { title: meta.label, subtitle: meta.hint, showBack: isMobile, onBack, backLabel: 'Settings' })),
    h('div', { className: 'mm-scroll' }, h('div', { className: 'mm-page' },
      !isMobile && h(Breadcrumbs, { items: [{ label: 'Settings', href: '#', onClick: (e) => { e.preventDefault(); onBack(); } }, { label: meta.label }] }),
      h(Page, props))));
}
