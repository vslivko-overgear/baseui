// The settings of an account: the name and the email, the notifications (Discord, email, the wishlist) and the change of the password. The notifications are the subscriptions of the wallet, so the first time one is turned on it pays its reward.
import { useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { Section } from './ui.jsx';
import { useStore } from './store.jsx';
import { SUBSCRIPTIONS } from './wallet-core.js';
import { passwordErrors, passwordValid } from './settings-core.js';

/** The notifications: Discord, email and the wishlist (it needs the email). Turning one on the first time pays the reward of the subscription. */
function Notifications() {
  const store = useStore();
  const { toast } = useToast();
  const toggle = (id, on) => {
    const gets = on && SUBSCRIPTIONS.some((s) => s.id === id) && !store.subs.paid[id];
    store.setSubscription(id, on);
    if (gets) toast({ message: `${SUBSCRIPTIONS.find((s) => s.id === id).coins} OG Coins credited`, status: 'success' });
  };
  return (
    <Card variant="surface" padding={5}>
      <div className="og-stack" data-test-id="settings-notifications">
        <Switch label="Discord notifications" checked={store.subs.discord} onCheckedChange={(v) => toggle('discord', v)} data-test-id="settings-notify-discord" />
        <Switch label="Email updates" checked={store.subs.email} onCheckedChange={(v) => toggle('email', v)} data-test-id="settings-notify-email" />
        <Switch label="Notifications about wishlist items" checked={store.subs.email && store.subs.wishlist} disabled={!store.subs.email} onCheckedChange={(v) => store.setSubscription('wishlist', v)} data-test-id="settings-notify-wishlist" />
      </div>
    </Card>
  );
}

/** The change of the password: the current one, the new one and its repeat, each with its error once the person has tried to save. */
function Password() {
  const { toast } = useToast();
  const [values, setValues] = useState({ current: '', next: '', repeat: '' });
  const [tried, setTried] = useState(false);
  const errors = passwordErrors(values);
  const set = (key) => (e) => { setValues((v) => ({ ...v, [key]: e.target.value })); };
  const save = (e) => {
    e.preventDefault();
    setTried(true);
    if (!passwordValid(values)) return;
    setValues({ current: '', next: '', repeat: '' });
    setTried(false);
    toast({ message: 'Your password is changed', status: 'success' });
  };
  const field = (key, label, caption) => <TextInput label={label} type="password" autoComplete={key === 'current' ? 'current-password' : 'new-password'} value={values[key]} onChange={set(key)} status={tried && errors[key] ? 'error' : undefined} caption={tried && errors[key] ? errors[key] : caption} data-test-id={`settings-password-${key}`} />;
  return (
    <Card variant="surface" padding={5}>
      <form className="og-stack" noValidate onSubmit={save} style={{ maxWidth: 480 }} data-test-id="settings-password">
        {field('current', 'Current password')}
        {field('next', 'New password', 'At least 8 characters, with a letter and a digit')}
        {field('repeat', 'Repeat the new password')}
        <Button variant="primary" label="Change password" type="submit" data-test-id="settings-password-save" />
      </form>
    </Card>
  );
}

export function Settings() {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  return (
    <div className="og-stack og-stack--xl" data-test-id="settings-page">
      <Card variant="surface" padding={5}>
        <div className="og-stack" style={{ maxWidth: 480 }}>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="Email" value={store.user?.email || ''} disabled />
          <Button variant="primary" label="Save" onClick={() => store.login({ ...store.user, name })} />
        </div>
      </Card>
      <Section title="Notifications"><Notifications /></Section>
      <Section title="Change password"><Password /></Section>
    </div>
  );
}
