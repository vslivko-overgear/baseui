import { h, useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.js';
import { Card, SelectableCard } from '../../src/components/Card.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Badge } from '../../src/components/Badge.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { Tabs, TabList, Tab, TabPanel } from '../../src/components/Tabs.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { Divider } from '../../src/components/Divider.js';
import { Link } from '../../src/components/Link.js';
import { Modal, TextField, Select, Switch } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { I } from './icons.js';
import { TEAM, ME } from './data.js';
import { go } from './util.js';
import { useStore } from './store.js';

const ROLES = [{ value: 'owner', label: 'Owner' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }];
const PLANS = [
  { id: 'free', name: 'Free', price: '$0', points: ['1 active study', '10 responses a month'] },
  { id: 'team', name: 'Team', price: '$49', points: ['Unlimited studies', '500 responses a month', 'Click maps'] },
  { id: 'business', name: 'Business', price: '$199', points: ['Unlimited everything', 'SSO and audit log', 'Priority support'] },
];

function Section({ title, hint, children }) {
  return h('section', { className: 'pb-stack' }, h('div', null, h('h3', { className: 'pb-h3' }, title), hint && h('div', { className: 'pb-muted' }, hint)), children);
}

export function Settings() {
  const store = useStore();
  const { toast } = useToast();
  const [name, setName] = useState('Northwind Studio');
  const [team, setTeam] = useState(TEAM);
  const [plan, setPlan] = useState('team');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [reset, setReset] = useState(false);
  const { prefs, setPrefs } = store;
  const columns = [
    { key: 'name', header: 'Member', width: proportional(3), renderCell: (m) => h('span', { className: 'pb-who' }, h(Avatar, { name: m.name, size: 'sm', tooltip: false }), h('span', { className: 'pb-name' }, h('b', null, m.name === ME.name ? `${m.name} (you)` : m.name), h('span', { className: 'pb-muted' }, m.email))) },
    { key: 'role', header: 'Role', width: pixel(168), renderCell: (m) => h(Select, { size: 'sm', label: 'Role', value: m.role, disabled: m.id === ME.id, onValueChange: (v) => { setTeam(team.map((x) => (x.id === m.id ? { ...x, role: v } : x))); toast({ message: `${m.name} is now ${v}`, status: 'success', duration: 2500 }); }, options: ROLES }) },
  ];
  return h('div', { className: 'pb-stack pb-stack--lg' },
    h('div', { className: 'pb-stack pb-stack--tight' }, h('h1', { className: 'pb-h1' }, 'Settings'), h('span', { className: 'pb-muted' }, 'Workspace, team and plan.')),
    h(Tabs, { defaultValue: 'general' },
      h(TabList, { label: 'Settings', size: 'md' }, h(Tab, { value: 'general', icon: h(I.Settings02) }, 'General'), h(Tab, { value: 'team', icon: h(I.Users01), counter: team.length }, 'Team'), h(Tab, { value: 'plan', icon: h(I.CreditCard01) }, 'Plan')),
      h(TabPanel, { value: 'general' }, h('div', { className: 'pb-stack pb-stack--lg pb-narrow' },
        h(Section, { title: 'Workspace' },
          h(TextField, { label: 'Workspace name', value: name, onChange: (e) => setName(e.target.value) }),
          h('div', { className: 'pb-grid2' },
            h(Select, { label: 'Language', value: prefs.language, onValueChange: (v) => setPrefs({ language: v }), options: [{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }] }),
            h(Select, { label: 'Time zone', value: prefs.timezone, onValueChange: (v) => setPrefs({ timezone: v }), options: [{ value: 'utc', label: 'UTC' }, { value: 'cet', label: 'Central Europe (CET)' }, { value: 'est', label: 'US Eastern (EST)' }] }))),
        h(Divider),
        h(Section, { title: 'Notifications', hint: 'Choose what lands in your inbox.' },
          h(Switch, { size: 'md', label: 'Email me when a study gets a new response', checked: prefs.emailNew, onCheckedChange: (v) => setPrefs({ emailNew: v }) }),
          h(Switch, { size: 'md', label: 'Weekly digest of all studies', checked: prefs.emailDigest, onCheckedChange: (v) => setPrefs({ emailDigest: v }) }),
          h(Switch, { size: 'md', label: 'Post updates to Slack', checked: prefs.slack, onCheckedChange: (v) => setPrefs({ slack: v }) })),
        h(Divider),
        h(Section, { title: 'Privacy' }, h(Switch, { size: 'md', label: 'Hide participant names from viewers', checked: prefs.anonymize, onCheckedChange: (v) => setPrefs({ anonymize: v }) })),
        h(Divider),
        h(Section, { title: 'Appearance', hint: 'The brand color, shape, fonts, animations, floating bars and glass follow the design system theme.' },
          h('div', null, h(Button, { variant: 'secondary', href: '../../#/theming/theme-settings', icon: h(I.Settings01) }, 'Open the theme settings'))),
        h(Divider),
        h(Section, { title: 'Demo data', hint: 'Everything here is mock data kept in this browser.' }, h('div', null, h(Button, { variant: 'destructive', icon: h(I.ClockRewind), onClick: () => setReset(true) }, 'Reset the demo'))))),
      h(TabPanel, { value: 'team' }, h('div', { className: 'pb-stack' },
        h('div', { className: 'pb-row' }, h('span', { className: 'pb-grow pb-muted' }, `${team.length} people have access`), h(Button, { variant: 'primary', icon: h(I.UsersPlus), onClick: () => setInviteOpen(true) }, 'Invite a teammate')),
        h(Table, { data: team, columns, caption: 'Team', density: 'spacious' }))),
      h(TabPanel, { value: 'plan' }, h('div', { className: 'pb-stack pb-stack--lg' },
        h(Card, { padding: 16, variant: 'muted' }, h('div', { className: 'pb-stack' }, h('b', null, 'Usage this month'),
          h(ProgressBar, { value: 62, size: 'md', label: 'Responses · 310 of 500', 'aria-label': 'Responses' }), h(ProgressBar, { value: 40, size: 'md', label: 'Active studies · 2 of 5', 'aria-label': 'Studies' }))),
        h('div', { className: 'pb-cards' }, PLANS.map((p) => h(SelectableCard, { key: p.id, label: `${p.name} plan`, checked: plan === p.id, onCheckedChange: () => { setPlan(p.id); toast({ message: `Switched to the ${p.name} plan`, status: 'success', duration: 2500 }); }, padding: 20 },
          h('div', { className: 'pb-stack pb-stack--tight' }, h('div', { className: 'pb-row' }, h('b', { className: 'pb-h3 pb-grow' }, p.name), plan === p.id && h(Badge, { variant: 'primary', size: 'md', label: 'Current' })), h('div', null, h('b', { className: 'pb-price' }, p.price), h('span', { className: 'pb-muted' }, ' / month')), h('ul', { className: 'pb-list' }, p.points.map((x) => h('li', { key: x }, x)))))))))),
    h(Modal, { open: inviteOpen, onOpenChange: setInviteOpen, title: 'Invite a teammate', primaryAction: h(Button, { variant: 'primary', disabled: !/.+@.+\..+/.test(email), onClick: () => { setTeam([...team, { id: email, name: email.split('@')[0], email, role: 'viewer' }]); setInviteOpen(false); setEmail(''); toast({ message: 'Invitation sent', status: 'success', duration: 2500 }); } }, 'Send invitation'), secondaryAction: h(Button, { variant: 'secondary', onClick: () => setInviteOpen(false) }, 'Cancel') },
    h(TextField, { label: 'Email', type: 'email', value: email, onChange: (e) => setEmail(e.target.value), status: email && !/.+@.+\..+/.test(email) ? 'error' : undefined, caption: email && !/.+@.+\..+/.test(email) ? 'Enter a valid email' : 'They join as a viewer' })),
    h(AlertDialog, { open: reset, onOpenChange: setReset, destructive: true, title: 'Reset the demo?', description: 'Your changes and the studies you created will be removed, the demo data comes back.', confirmLabel: 'Reset', onConfirm: () => { store.reset(); setReset(false); toast({ message: 'Demo data restored', status: 'success', duration: 2500 }); go('/'); } }));
}
