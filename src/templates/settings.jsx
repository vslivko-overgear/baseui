// Settings templates: one long form, panels with a list of areas, and settings in a dialog.
import { useState } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Form } from '../components/Form.jsx';
import { Button } from '../components/Button.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Selector } from '../components/Selector.jsx';
import { Switch } from '../components/Switch.jsx';
import { RadioGroup } from '../components/RadioGroup.jsx';
import { Dialog } from '../components/Dialog.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Divider } from '../components/Divider.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Panel } from './_kit.jsx';

const opts = (...v) => v.map((x) => ({ value: x, label: x }));

const Profile = () => (
  <Form as="div">
    <Stack direction="row" gap={4} align="center"><Avatar alt="Amelia Brooks" size="lg" /><Button label="Change photo" variant="secondary" size="sm" /></Stack>
    <TextInput label="Name" defaultValue="Amelia Brooks" />
    <TextInput label="Email" defaultValue="amelia@acme.com" type="email" />
    <Selector label="Language" options={opts('English', 'Deutsch', 'Español')} defaultValue="English" />
  </Form>
);
const Notifications = () => (
  <Stack gap={4}>
    <Switch label="Email me about new comments" defaultChecked />
    <Switch label="Weekly summary" defaultChecked />
    <Switch label="Product news" />
  </Stack>
);
const Appearance = () => (
  <Stack gap={5}>
    <RadioGroup title="Theme" defaultValue="system" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'Match my device' }]} />
    <Switch label="Reduce motion" />
  </Stack>
);

export function SettingsForm() {
  return (
    <Page width={720}>
      <PageHeader title="Settings" subtitle="Changes are saved when you press the button below" />
      <Panel title="Profile"><Profile /></Panel>
      <Panel title="Notifications"><Notifications /></Panel>
      <Panel title="Appearance"><Appearance /></Panel>
      <Card variant="surface" padding={4}><Stack direction="row" gap={2} justify="flex-end"><Button label="Discard" variant="secondary" /><Button variant="primary" label="Save changes" /></Stack></Card>
    </Page>
  );
}

export function SettingsPanels() {
  const areas = [{ id: 'profile', label: 'Profile', icon: 'User01', body: <Profile /> }, { id: 'notifications', label: 'Notifications', icon: 'Bell01', body: <Notifications /> }, { id: 'appearance', label: 'Appearance', icon: 'Settings01', body: <Appearance /> }];
  const [id, setId] = useState('profile');
  const area = areas.find((a) => a.id === id);
  return (
    <Page width={960}>
      <PageHeader title="Settings" subtitle="Saved as you go" />
      <div className="tpl-split" style={{ gridTemplateColumns: '240px minmax(0, 1fr)' }}>
        <Card variant="surface" padding={2}>
          <List>{areas.map((a) => <ListItem key={a.id} icon={<Icon name={a.icon} size={20} />} active={a.id === id} onClick={() => setId(a.id)}>{a.label}</ListItem>)}</List>
        </Card>
        <Panel title={area.label}>{area.body}</Panel>
      </div>
    </Page>
  );
}

export function SettingsDialog() {
  const [open, setOpen] = useState(true);
  return (
    <Page width={640}>
      <PageHeader title="Workspace" actions={<Button label="Preferences" onClick={() => setOpen(true)} variant="secondary" />} />
      <p className="tpl-text">The page stays where it is while preferences open in a dialog</p>
      <Dialog open={open} onOpenChange={setOpen} title="Preferences" primaryAction={<Button variant="primary" label="Done" onClick={() => setOpen(false)} />}>
        <Tabs label="Preferences" items={[{ value: 'profile', label: 'Profile', content: <Profile /> }, { value: 'alerts', label: 'Alerts', content: <Notifications /> }, { value: 'look', label: 'Look', content: <Appearance /> }]} panelClassName="tpl-settings-panel" />
      </Dialog>
    </Page>
  );
}
