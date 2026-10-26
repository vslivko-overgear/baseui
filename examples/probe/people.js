import { h, useState, useMemo, useEffect } from '../../src/react.js';
import { Button } from '../../src/components/Button.js';
import { Badge } from '../../src/components/Badge.js';
import { Card } from '../../src/components/Card.js';
import { Avatar } from '../../src/components/Avatar.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Slider } from '../../src/components/Slider.js';
import { NumberInput } from '../../src/components/NumberInput.js';
import { Status } from '../../src/components/Status.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { Banner } from '../../src/components/Banner.js';
import { Modal, TextField, Select, Switch } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { I } from './icons.js';
import { PANEL, COUNTRIES, RATE, DEVICES } from './data.js';
import { go, plural, money, useMedia } from './util.js';
import { useStore } from './store.js';

const studyOptions = (store) => store.studies.filter((s) => s.status !== 'done').map((s) => ({ value: s.id, label: s.name }));

/** Recruit: describe the audience, see how many panelists match and what it costs, then invite them. */
function RecruitModal({ open, studyId, onClose }) {
  const store = useStore();
  const { toast } = useToast();
  const [study, setStudy] = useState(studyId);
  const [countries, setCountries] = useState([]);
  const [age, setAge] = useState(60);
  const [device, setDevice] = useState('any');
  const [count, setCount] = useState(10);
  const [screen, setScreen] = useState(false);
  useEffect(() => { if (open) setStudy(studyId || store.studies.find((s) => s.status !== 'done')?.id); }, [open, studyId]);
  const matches = useMemo(() => PANEL.filter((p) => (!countries.length || countries.includes(p.country)) && p.age <= age && (device === 'any' || p.device === device)), [countries, age, device]);
  const target = store.study(study);
  const n = Math.max(1, Number(count) || 1);
  const price = Math.round(n * RATE * ((target?.minutes || 5) / 5) * (screen ? 1.2 : 1));
  const invited = Math.min(n, matches.length);
  const launch = () => {
    store.invite(matches.slice(0, invited).map((p) => p.id), study);
    onClose();
    toast({ message: `${plural(invited, 'person', 'people')} invited to “${target.name}”`, status: 'success', action: { label: 'See the panel', onClick: () => go('/people') }, duration: 5000 });
  };
  return h(Modal, { open, onOpenChange: (o) => !o && onClose(), title: 'Recruit participants', subtitle: 'Invite people from the panel to your study',
    primaryAction: h(Button, { variant: 'primary', disabled: !matches.length || !target, onClick: launch }, `Invite ${invited} for ${money(price)}`), secondaryAction: h(Button, { variant: 'secondary', onClick: onClose }, 'Cancel') },
  h('div', { className: 'pb-stack' },
    h(Select, { size: 'sm', label: 'Study', value: study, onValueChange: setStudy, options: studyOptions(store) }),
    h(Card, { padding: 16, variant: matches.length ? 'green' : 'orange' }, h('div', { className: 'pb-row' }, h(I.Users01, { size: 20 }), h('div', { className: 'pb-grow' }, h('b', null, matches.length ? `${plural(matches.length, 'person', 'people')} match` : 'Nobody matches'), h('div', { className: 'pb-muted' }, matches.length ? (matches.length < n ? `Only ${matches.length} of ${n} can be invited, widen the audience for more.` : `${money(price)} for ${plural(n, 'participant')}, about ${target?.minutes || 5} min each.`) : 'Widen the age range or pick more countries.')))),
    h(Select, { size: 'sm', label: 'Countries', multiple: true, value: countries, onValueChange: setCountries, options: COUNTRIES.map((c) => ({ value: c, label: c })), caption: countries.length ? undefined : 'Anywhere' }),
    h(Slider, { label: 'Up to age', showValue: true, min: 18, max: 70, value: age, onValueChange: setAge }),
    h(SegmentedControl, { label: 'Device', size: 'md', fullWidth: true, value: device, onValueChange: setDevice, items: [{ value: 'any', label: 'Any' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }] }),
    h(NumberInput, { size: 'sm', label: 'Participants', min: 1, max: 200, value: count, onValueChange: setCount }),
    h(Switch, { size: 'md', label: 'Add a screening question (+20%)', checked: screen, onCheckedChange: setScreen })));
}

function InviteModal({ open, ids, onClose }) {
  const store = useStore();
  const { toast } = useToast();
  const [study, setStudy] = useState();
  const [note, setNote] = useState('Hi! We would love your feedback on a short study (about 5 minutes).');
  useEffect(() => { if (open) setStudy(store.studies.find((s) => s.status !== 'done')?.id); }, [open]);
  const send = () => { store.invite(ids, study); onClose(true); toast({ message: `${plural(ids.length, 'invitation')} sent`, status: 'success', duration: 3000 }); };
  return h(Modal, { open, onOpenChange: (o) => !o && onClose(), title: `Invite ${plural(ids.length, 'person', 'people')}`, primaryAction: h(Button, { variant: 'primary', disabled: !study, onClick: send }, 'Send invitations'), secondaryAction: h(Button, { variant: 'secondary', onClick: () => onClose() }, 'Cancel') },
  h('div', { className: 'pb-stack' }, h(Select, { size: 'sm', label: 'Study', value: study, onValueChange: setStudy, options: studyOptions(store) }), h(TextField, { label: 'Message', multiline: true, minRows: 3, value: note, onChange: (e) => setNote(e.target.value) })));
}

export function People({ recruitFor }) {
  const store = useStore();
  const isMobile = useMedia('(max-width: 859px)');
  const [device, setDevice] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [recruit, setRecruit] = useState(!!recruitFor);
  const [invite, setInvite] = useState(false);
  useEffect(() => { if (recruitFor) setRecruit(true); }, [recruitFor]);
  const list = PANEL.filter((p) => (device === 'all' || p.device === device) && `${p.name} ${p.country} ${p.job}`.toLowerCase().includes(query.trim().toLowerCase()));
  const invitedTo = (id) => store.invites.filter((i) => i.person === id);
  const columns = [
    { key: 'name', header: 'Participant', width: proportional(4), sortable: true, renderCell: (p) => h('span', { className: 'pb-who' }, h(Avatar, { name: p.name, size: 'sm', tooltip: false }), h('span', { className: 'pb-name' }, h('b', null, p.name), h('span', { className: 'pb-muted' }, p.email))) },
    { key: 'country', header: 'Country', width: proportional(2), sortable: true },
    { key: 'age', header: 'Age', width: pixel(72), align: 'end', sortable: true },
    { key: 'job', header: 'Occupation', width: proportional(2), sortable: true },
    { key: 'device', header: 'Device', width: pixel(104), renderCell: (p) => DEVICES[p.device] },
    { key: 'rating', header: 'Rating', width: pixel(84), align: 'end', sortable: true, renderCell: (p) => h('span', { className: 'pb-row pb-row--tight' }, h(I.Star01, { size: 16 }), p.rating.toFixed(1)) },
    { key: 'status', header: 'Status', width: pixel(132), renderCell: (p) => (invitedTo(p.id).length ? h(Badge, { variant: 'info', size: 'md', label: 'Invited' }) : h(Badge, { variant: 'secondary', size: 'md', label: 'Available' })) },
  ];
  return h('div', { className: 'pb-stack pb-stack--lg' },
    h('div', { className: 'pb-titlebar' },
      h('div', { className: 'pb-grow pb-stack pb-stack--tight' }, h('h1', { className: 'pb-h1' }, 'Panel'), h('span', { className: 'pb-muted' }, `${PANEL.length} vetted participants. ${store.invites.length ? `${plural(store.invites.length, 'invitation')} sent.` : 'Nobody is invited yet.'}`)),
      h('div', { className: 'pb-actions' }, h(Button, { variant: 'primary', icon: h(I.UsersPlus), onClick: () => setRecruit(true) }, 'Recruit participants'))),
    store.invites.length > 0 && h(Banner, { status: 'success', title: 'Invitations are on their way' }, 'Participants usually respond within a few hours.'),
    h('div', { className: 'pb-toolbar' },
      h(SegmentedControl, { label: 'Device', size: 'md', value: device, onValueChange: setDevice, items: [{ value: 'all', label: 'All' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }] }),
      h('div', { className: 'pb-search' }, h(TextField, { size: 'sm', label: 'Search the panel', startIcon: h(I.SearchLg), value: query, onChange: (e) => setQuery(e.target.value), clearable: true, actionLabel: 'Clear search' })),
      selected.length > 0 && h(Button, { variant: 'secondary', icon: h(I.Mail01), onClick: () => setInvite(true) }, `Invite ${selected.length}`)),
    list.length
      ? h(Table, { data: list, columns: isMobile ? columns.filter((c) => c.key === 'name') : columns, caption: 'Panel', density: 'balanced', hoverable: true, selectionMode: 'multiple', selectedKeys: selected, onSelectionChange: (k) => setSelected([...k]), defaultSort: { key: 'rating', direction: 'desc' } })
      : h(Status, { status: 'neutral', title: 'Nobody found', description: 'Try another name or device.', actionLabel: 'Clear filters', actionVariant: 'secondary', onAction: () => { setQuery(''); setDevice('all'); } }),
    h(RecruitModal, { open: recruit, studyId: recruitFor, onClose: () => { setRecruit(false); if (recruitFor) go('/people'); } }),
    h(InviteModal, { open: invite, ids: selected, onClose: (sent) => { setInvite(false); if (sent) setSelected([]); } }));
}
