// The settings of an account: the name and the email, the notifications (Discord, email, the wishlist) and the change of the password. The notifications are the subscriptions of the wallet, so the first time one is turned on it pays its reward.
import { useState, useRef } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { Section, CARD_X } from './ui.jsx';
import { useStore } from './store.jsx';
import { SUBSCRIPTIONS } from './wallet-core.js';
import { passwordErrors, passwordValid, avatarError } from './settings-core.js';
import { useFieldErrors } from '../../src/use-field-errors.js';
import { Avatar } from '../../src/components/Avatar.jsx';

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
    <Card variant="surface" padding={5} style={CARD_X}>
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
  const errors = passwordErrors(values);
  const form = useFieldErrors(errors);   // an error shows on Save and goes when its field is focused again or edited
  const set = (key) => (e) => { setValues((v) => ({ ...v, [key]: e.target.value })); };
  const save = (e) => {
    e.preventDefault();
    form.reveal();
    if (!passwordValid(values)) return;
    setValues({ current: '', next: '', repeat: '' });
    form.reset();
    toast({ message: 'Your password is changed', status: 'success' });
  };
  const field = (key, label, caption) => <TextInput label={label} type="password" autoComplete={key === 'current' ? 'current-password' : 'new-password'} value={values[key]} {...form.field(key, { caption, onChange: set(key) })} data-test-id={`settings-password-${key}`} />;
  return (
    <Card variant="surface" padding={5} style={CARD_X}>
      <form className="og-stack" noValidate onSubmit={save} style={{ maxWidth: 480 }} data-test-id="settings-password">
        {field('current', 'Current password')}
        {field('next', 'New password', 'At least 8 characters, with a letter and a digit')}
        {field('repeat', 'Repeat the new password')}
        <Button variant="primary" label="Change password" type="submit" data-test-id="settings-password-save" />
      </form>
    </Card>
  );
}

const AVATAR_PX = 256;
/** The picture of a file drawn into a square of 256px (the middle of it), as a data url: small enough to be kept on the device. */
function squareOf(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = AVATAR_PX; canvas.height = AVATAR_PX;
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_PX, AVATAR_PX);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
    img.src = url;
  });
}

/** The avatar: the picture, "Change photo" (a file of the device) and "Remove photo" once there is one. */
function AvatarEditor() {
  const store = useStore();
  const { toast } = useToast();
  const input = useRef(null);
  const user = store.user;
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const problem = avatarError(file);
    if (problem) { toast({ message: problem, status: 'error' }); return; }
    try { store.login({ ...user, avatar: await squareOf(file) }); } catch { toast({ message: 'The picture could not be read', status: 'error' }); }
  };
  return (
    <div className="og-head-row" data-test-id="settings-avatar">
      <Avatar name={user?.name} src={user?.avatar} size={64} shape="rounded" />
      <div className="og-row">
        <input ref={input} type="file" accept="image/*" hidden onChange={pick} data-test-id="settings-avatar-input" />
        <Button variant="secondary" size="md" label="Change photo" onClick={() => input.current?.click()} data-test-id="settings-avatar-change" />
        {user?.avatar && <Button variant="ghost" size="md" label="Remove photo" onClick={() => store.login({ ...user, avatar: undefined })} data-test-id="settings-avatar-remove" />}
      </div>
    </div>
  );
}

export function Settings() {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  return (
    <div className="og-stack og-stack--xl" data-test-id="settings-page">
      <Card variant="surface" padding={5} style={CARD_X}>
        <div className="og-stack" style={{ maxWidth: 480 }}>
          <AvatarEditor />
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
