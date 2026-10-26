import { t as initDom, r as renderInto } from '../../lib/react-18-D4o7zN8K.js';
import { h, cx, useState, useEffect } from '../../src/react.js';
import { ToastProvider } from '../../src/components/Toast.js';
import { Navbar, BottomBar } from '../../src/components/MobileNavigation.js';
import { Button } from '../../src/components/Button.js';
import { Dropdown } from '../../src/components/Dropdown.js';
import { List, ListItem } from '../../src/components/List.js';
import { Status } from '../../src/components/Status.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Badge } from '../../src/components/Badge.js';
import { Link } from '../../src/components/Link.js';
import { Divider } from '../../src/components/Divider.js';
import { Modal } from '../../src/base.js';
import { startTheme } from '../../site/theme.js';
import { I, S } from './icons.js';
import { StoreProvider, useStore } from './store.js';
import { useRoute, useMedia, go } from './util.js';
import { ME } from './data.js';
import { Dashboard, DashboardSkeleton, SCENARIOS } from './dashboard.js';
import { Templates } from './templates.js';
import { Builder } from './builder.js';
import { Results } from './results.js';
import { StudyHeader, ShareModal } from './builder.js';
import { People } from './people.js';
import { Settings } from './settings.js';
import { Runner } from './runner.js';

startTheme();

const NAV = [
  { value: 'studies', path: '/', label: 'Studies', icon: h(I.Folder), activeIcon: h(S.Folder) },
  { value: 'templates', path: '/templates', label: 'Templates', icon: h(I.LayoutAlt01), activeIcon: h(S.LayoutAlt01) },
  { value: 'people', path: '/people', label: 'Panel', icon: h(I.Users01), activeIcon: h(S.Users01) },
  { value: 'settings', path: '/settings', label: 'Settings', icon: h(I.Settings02), activeIcon: h(S.Settings02) },
];
const sectionOf = (parts) => (!parts.length || parts[0] === 'study' ? 'studies' : parts[0]);

/** The demo scenarios: every one is a different path through the product. */
function ScenariosMenu({ trigger, placement }) {
  const store = useStore();
  return h(Dropdown, { size: 'md', label: 'Demo scenarios', placement, trigger, value: null,
    options: [{ type: 'group', label: 'Demo scenarios' }, ...SCENARIOS.map((s) => ({ value: s.id, label: s.title, icon: h(s.icon) })), { type: 'divider' }, { value: 'reset', label: 'Reset the demo', icon: h(I.ClockRewind) }],
    onValueChange: (v) => { if (v === 'reset') { store.reset(); go('/'); } else SCENARIOS.find((s) => s.id === v).run(store); } });
}
function ScenariosModal({ open, onClose }) {
  const store = useStore();
  return h(Modal, { open, onOpenChange: (o) => !o && onClose(), title: 'Demo scenarios', subtitle: 'Jump straight into a path through the product' },
    h(List, { 'aria-label': 'Demo scenarios' }, SCENARIOS.map((s) => h(ListItem, { key: s.id, icon: h(s.icon), subtitle: s.desc, onClick: () => { onClose(); s.run(store); } }, s.title))));
}

function Body({ route }) {
  const store = useStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  const [first, second, third] = route.parts;
  if (!first) return loading ? h(DashboardSkeleton) : h(Dashboard);
  if (first === 'templates') return h(Templates);
  if (first === 'people') return h(People, { recruitFor: route.query.recruit });
  if (first === 'settings') return h(Settings);
  if (first === 'study') {
    const study = store.study(second);
    if (!study) return h(Status, { status: 'neutral', title: 'Study not found', description: 'It may have been deleted.', actionLabel: 'Back to studies', onAction: () => go('/') });
    return third === 'results' ? h(ResultsPage, { study }) : h(Builder, { study });
  }
  return h(Status, { status: 'neutral', title: 'Page not found', actionLabel: 'Back to studies', onAction: () => go('/') });
}
function ResultsPage({ study }) {
  const [share, setShare] = useState(false);
  return h('div', { className: 'pb-stack pb-stack--lg' }, h(StudyHeader, { study, tab: 'results', onShare: () => setShare(true) }), h(Results, { study }), h(ShareModal, { study, open: share, onClose: () => setShare(false) }));
}

function Shell({ route }) {
  const store = useStore();
  const isMobile = useMedia('(max-width: 859px)');
  const [scenarios, setScenarios] = useState(false);
  const section = sectionOf(route.parts);
  const study = route.parts[0] === 'study' ? store.study(route.parts[1]) : null;
  const title = study ? study.name : NAV.find((n) => n.value === section).label;
  const live = store.studies.filter((s) => s.status === 'live').length;

  if (isMobile) {
    return h('div', { className: 'pb pb--mobile' },
      h('div', { className: 'pb-pane' },
        h('div', { className: 'pb-pane__top' }, h(Navbar, { title, showBack: !!study, onBack: () => go('/'), backLabel: 'Studies', actions: [{ icon: h(I.Zap, { size: 24 }), label: 'Demo scenarios', onClick: () => setScenarios(true) }] })),
        h('div', { className: 'pb-scroll', key: route.path }, h('div', { className: 'pb-page' }, h(Body, { route }))),
        h('div', { className: 'pb-pane__bottom' }, h(BottomBar, { items: NAV.map((n) => ({ ...n, badge: n.value === 'studies' && live ? live : undefined })), value: section, onValueChange: (v) => go(NAV.find((n) => n.value === v).path) }))),
      h(ScenariosModal, { open: scenarios, onClose: () => setScenarios(false) }));
  }
  return h('div', { className: 'pb' },
    h('aside', { className: 'pb-side', 'aria-label': 'Probe' },
      h('a', { className: 'pb-brand', href: '#/', 'aria-label': 'Probe, home' }, h('span', { className: 'pb-brand__mark' }, h(I.Target04, { size: 20 })), h('b', null, 'Probe')),
      h(List, { 'aria-label': 'Main navigation', spacing: 'sm' }, NAV.map((n) => h(ListItem, { key: n.value, icon: n.value === section ? n.activeIcon : n.icon, active: n.value === section, onClick: () => go(n.path), details: n.value === 'studies' && live ? h(Badge, { type: 'counter', size: 'md', variant: 'primary', label: live }) : undefined }, n.label))),
      h('div', { className: 'pb-grow' }),
      h('div', { className: 'pb-stack' },
        h(ScenariosMenu, { placement: 'top-start', trigger: (tp) => h(Button, { variant: 'primary', icon: h(I.Zap), width: '100%', ...tp }, 'Demo scenarios') }),
        h(Divider),
        h('div', { className: 'pb-row' }, h(Avatar, { name: ME.name, size: 'md', tooltip: false }), h('div', { className: 'pb-grow pb-name' }, h('b', null, ME.name), h('span', { className: 'pb-muted' }, 'Northwind Studio'))),
        h('span', { className: 'pb-muted pb-small' }, 'A baseui example with mock data. ', h(Link, { href: '../../#/' }, 'Back to the docs')))),
    h('main', { className: 'pb-main' }, h('div', { className: 'pb-scroll', key: route.path }, h('div', { className: 'pb-page' }, h(Body, { route })))));
}

function Probe() {
  const route = useRoute();
  const [first, second] = route.parts;
  if (first === 'run') return h(Runner, { id: second, preview: route.query.preview === '1', key: `${second}${route.query.preview}` });
  return h(Shell, { route });
}

await initDom();
renderInto(h(ToastProvider, { placement: 'top-center' }, h(StoreProvider, null, h(Probe))), document.getElementById('root'));
