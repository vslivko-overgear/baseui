// Shell templates: the frame of an application, with a top bar or a side navigation around the page.
import { useState } from '../react.js';
import { Stack } from '../components/Layout.jsx';
import { Button } from '../components/Button.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Badge } from '../components/Badge.jsx';
import { Card } from '../components/Card.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { BottomBar } from '../components/MobileNavigation.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Fluid, Tile, Panel, SideNav, NAV } from './_kit.jsx';

const Body = ({ title }) => (
  <Page>
    <PageHeader title={title} subtitle="The page sits inside the frame" actions={<Button label="Create" size="sm" variant="primary" />} />
    <Fluid min={200}><Tile label="Open items" value="24" delta={4} /><Tile label="Done this week" value="61" delta={12} /><Tile label="Overdue" value="3" delta={-1} tone="warning" /></Fluid>
    <Panel title="Recent activity"><p className="tpl-text">Amelia closed 4 items, Noah opened a new review</p></Panel>
  </Page>
);

export function TopNav() {
  const [tab, setTab] = useState('Overview');
  return (
    <div>
      <header className="tpl-topbar">
        <strong className="tpl-sidenav__brand">Acme</strong>
        <Tabs label="Main" value={tab} onValueChange={setTab} items={NAV.map((n) => ({ value: n.label, label: n.label }))} />
        <Avatar alt="Amelia Brooks" />
      </header>
      <Body title={tab} />
    </div>
  );
}

export function SideNavShell() {
  const [active, setActive] = useState('Overview');
  return (
    <div className="tpl-shell">
      <SideNav items={NAV} active={active} footer={<Stack direction="row" gap={2} align="center"><Avatar alt="Amelia Brooks" size="sm" /><span className="tpl-meta">Amelia Brooks</span></Stack>} />
      <div className="tpl-shell__main"><Body title={active} /></div>
    </div>
  );
}

export function ShellNav() {
  const [active, setActive] = useState('Overview');
  return (
    <div className="tpl-shell tpl-shell--responsive">
      <div className="tpl-shell__side"><SideNav items={NAV} active={active} /></div>
      <div className="tpl-shell__main"><Body title={active} /></div>
      <div className="tpl-shell__bottom"><BottomBar label="Main" items={NAV.map((n) => ({ value: n.label, label: n.label, icon: <Icon name={n.icon} size={24} /> }))} value={active} onValueChange={setActive} /></div>
    </div>
  );
}
