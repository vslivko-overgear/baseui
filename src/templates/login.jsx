// Login templates: a card, a split screen and single sign-on first.
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Form } from '../components/Form.jsx';
import { Button } from '../components/Button.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { Link } from '../components/Link.jsx';
import { Divider } from '../components/Divider.jsx';
import { Collapsible } from '../components/Collapsible.jsx';
import { Icon } from '../components/Icon.jsx';

const Credentials = ({ remember = true }) => (
  <Form as="div">
    <TextInput label="Email" type="email" />
    <TextInput label="Password" type="password" />
    {remember && <Stack direction="row" justify="space-between" align="center"><Checkbox label="Remember this device" defaultChecked /><Link href="#">Forgot password?</Link></Stack>}
    <Button label="Sign in" width="100%" variant="primary" />
  </Form>
);
const Heading = ({ title = 'Welcome back', text = 'Sign in to continue to Acme' }) => (
  <Stack gap={1}><h1 className="tpl-title">{title}</h1><p className="tpl-subtitle">{text}</p></Stack>
);
const Footer = () => <p className="tpl-meta">No account yet? <Link href="#">Create one</Link></p>;

export function LoginCard() {
  return (
    <div className="tpl-center">
      <Card variant="surface" padding={8} maxWidth={420} width="100%"><Stack gap={6}><Stack gap={4}><Heading /><Credentials /></Stack><Footer /></Stack></Card>
    </div>
  );
}

export function LoginSplit() {
  return (
    <div className="tpl-login-split">
      <div className="tpl-login-split__form"><Stack gap={6} style={{ width: '100%', maxWidth: 380 }}><Stack gap={4}><Heading /><Credentials /></Stack><Footer /></Stack></div>
      <div className="tpl-login-split__aside" aria-hidden="true"><p>Everything your team needs to plan, build and ship in one place</p></div>
    </div>
  );
}

export function LoginSso() {
  return (
    <div className="tpl-center">
      <Card variant="surface" padding={8} maxWidth={420} width="100%">
        <Stack gap={6}>
          <Stack gap={4}>
            <Heading title="Sign in" text="Use your company account" />
            <Stack gap={3}>
              <Button label="Continue with Google" variant="secondary" width="100%" icon={<Icon name="Globe01" size={20} />} />
              <Button label="Continue with Okta" variant="secondary" width="100%" icon={<Icon name="Lock01" size={20} />} />
            </Stack>
          </Stack>
          <Divider label="or" />
          <Collapsible title="Use email and password"><Credentials remember={false} /></Collapsible>
          <Footer />
        </Stack>
      </Card>
    </div>
  );
}
