// Form templates: single-column, two-column, sectioned with a summary, and the wizard variants.
import { useState } from '../react.js';
import { Card } from '../components/Card.jsx';
import { Stack } from '../components/Layout.jsx';
import { Form, FormRow, FormSection } from '../components/Form.jsx';
import { Button } from '../components/Button.jsx';
import { ButtonGroup } from '../components/ButtonGroup.jsx';
import { Banner } from '../components/Banner.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Selector } from '../components/Selector.jsx';
import { Switch } from '../components/Switch.jsx';
import { Dialog } from '../components/Dialog.jsx';
import { TokenGroup } from '../components/TokenGroup.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { RadioGroup } from '../components/RadioGroup.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { Divider } from '../components/Divider.jsx';
import { Page, PageHeader, Panel, money } from './_kit.jsx';

const opts = (...v) => v.map((x) => ({ value: x, label: x }));
const COUNTRIES = opts('Germany', 'Japan', 'Spain', 'United States');

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <Page width={560}>
      <PageHeader title="Contact us" subtitle="We reply within one working day" />
      {sent && <Banner status="success" title="Message sent">Thank you, we will be in touch</Banner>}
      <Card variant="surface" padding={6}>
        <Form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <TextInput label="Name" />
            <TextInput label="Email" type="email" />
            <Selector label="Topic" options={opts('Sales', 'Support', 'Press', 'Something else')} />
            <TokenGroup title="How did you hear about us?" options={opts('Search', 'Friend', 'Social', 'Event')} />
            <TextInput label="Message" multiline minRows={4} />
            <Checkbox label="Send me product news" />
            <Button variant="primary" label="Send message" width="100%" />
        </Form>
      </Card>
    </Page>
  );
}

export function TwoColumnForm() {
  return (
    <Page width={800}>
      <PageHeader title="New customer" subtitle="Fields that belong together sit side by side" />
      <Card variant="surface" padding={6}>
        <Form as="div">
          <FormSection title="Contact">
            <FormRow><TextInput label="First name" /><TextInput label="Last name" /></FormRow>
            <FormRow><TextInput label="Email" type="email" /><TextInput label="Phone" type="tel" /></FormRow>
          </FormSection>
          <Divider />
          <FormSection title="Address">
            <TextInput label="Street" />
            <FormRow><TextInput label="City" /><Selector label="Country" options={COUNTRIES} /></FormRow>
          </FormSection>
          <Divider />
          <Switch label="Send an invoice by email" defaultChecked />
          <ButtonGroup justify="end"><Button label="Cancel" variant="secondary" /><Button variant="primary" label="Create customer" /></ButtonGroup>
        </Form>
      </Card>
    </Page>
  );
}

const ITEMS = [{ name: 'Standing desk', price: 590 }, { name: 'Monitor arm', price: 130 }];
function Summary({ shipping }) {
  const sub = ITEMS.reduce((n, i) => n + i.price, 0);
  return (
    <Panel title="Order summary">
      <Stack gap={2}>
        {ITEMS.map((i) => <Stack key={i.name} direction="row" justify="space-between"><span className="tpl-text">{i.name}</span><span className="tpl-text">{money(i.price)}</span></Stack>)}
        <Stack direction="row" justify="space-between"><span className="tpl-meta">Shipping</span><span className="tpl-meta">{shipping ? money(shipping) : 'Free'}</span></Stack>
        <Divider />
        <Stack direction="row" justify="space-between"><strong className="tpl-text">Total</strong><strong className="tpl-text">{money(sub + shipping)}</strong></Stack>
      </Stack>
    </Panel>
  );
}

function ShippingFields({ onChange }) {
  return (
    <Form as="div">
      <TextInput label="Full name" />
      <TextInput label="Address" />
      <FormRow><TextInput label="City" /><Selector label="Country" options={COUNTRIES} /></FormRow>
      <RadioGroup title="Delivery" defaultValue="free" onValueChange={(v) => onChange && onChange(v === 'fast' ? 25 : 0)} options={[{ value: 'free', label: 'Standard, 5 days, free' }, { value: 'fast', label: 'Express, 2 days, $25' }]} />
    </Form>
  );
}
const PaymentFields = () => (
  <Form as="div"><TextInput label="Card number" /><FormRow stack="never"><TextInput label="Expiry" /><TextInput label="CVC" /></FormRow></Form>
);

export function CheckoutForm() {
  const [shipping, setShipping] = useState(0);
  return (
    <Page>
      <PageHeader title="Checkout" />
      <div className="tpl-split">
        <Stack gap={4}>
          <Panel title="Shipping"><ShippingFields onChange={setShipping} /></Panel>
          <Panel title="Payment"><PaymentFields /></Panel>
          <Button variant="primary" label="Pay now" width="100%" />
        </Stack>
        <Summary shipping={shipping} />
      </div>
    </Page>
  );
}

function useSteps(count) {
  const [step, setStep] = useState(0);
  return { step, next: () => setStep((s) => Math.min(count - 1, s + 1)), back: () => setStep((s) => Math.max(0, s - 1)), last: step === count - 1, first: step === 0 };
}
const Nav = ({ w, label = 'Continue', finish = 'Place order' }) => (
  <Stack direction="row" justify="space-between"><Button label="Back" variant="secondary" onClick={w.back} disabled={w.first} /><Button variant="primary" label={w.last ? finish : label} onClick={w.next} /></Stack>
);

export function CheckoutWizard() {
  const w = useSteps(3);
  const [shipping, setShipping] = useState(0);
  const names = ['Cart', 'Shipping', 'Payment'];
  return (
    <Page>
      <PageHeader title="Checkout" subtitle={`Step ${w.step + 1} of 3 · ${names[w.step]}`} />
      <ProgressBar label="Checkout progress" value={((w.step + 1) / 3) * 100} />
      <div className="tpl-split">
        <Panel title={names[w.step]}>
          <Stack gap={6}>
            {w.step === 0 && <Stack gap={2}>{ITEMS.map((i) => <Stack key={i.name} direction="row" justify="space-between"><span className="tpl-text">{i.name}</span><span className="tpl-text">{money(i.price)}</span></Stack>)}</Stack>}
            {w.step === 1 && <ShippingFields onChange={setShipping} />}
            {w.step === 2 && <PaymentFields />}
            <Nav w={w} />
          </Stack>
        </Panel>
        <Summary shipping={shipping} />
      </div>
    </Page>
  );
}

export function FormWizard() {
  const w = useSteps(3);
  return (
    <Page width={640}>
      <PageHeader title="Create a workspace" subtitle={`Step ${w.step + 1} of 3`} />
      <ProgressBar label="Progress" value={((w.step + 1) / 3) * 100} sections={3} />
      <Card variant="surface" padding={6}>
        <Stack gap={6}>
          {w.step === 0 && <Stack gap={4}><TextInput label="Workspace name" /><TextInput label="Web address" suffix=".acme.com" /></Stack>}
          {w.step === 1 && <Stack gap={4}><Selector label="Team size" options={opts('Just me', '2 to 10', '11 to 50', 'More than 50')} /><Selector label="Industry" options={opts('Software', 'Retail', 'Finance', 'Education')} /></Stack>}
          {w.step === 2 && <Stack gap={4}><Banner status="info" title="Almost done">Review your choices, then create the workspace</Banner><Switch label="Invite teammates after creating" defaultChecked /></Stack>}
          <Nav w={w} finish="Create workspace" />
        </Stack>
      </Card>
    </Page>
  );
}

export function VerticalWizard() {
  const w = useSteps(4);
  const steps = ['Account', 'Profile', 'Preferences', 'Review'];
  return (
    <Page width={880}>
      <PageHeader title="Set up your account" />
      <div className="tpl-split" style={{ gridTemplateColumns: '220px minmax(0, 1fr)' }}>
        <ol className="tpl-steps" aria-label="Steps">
          {steps.map((s, i) => <li key={s} aria-current={i === w.step ? 'step' : undefined} data-done={i < w.step || undefined}><span className="tpl-steps__dot">{i < w.step ? '✓' : i + 1}</span>{s}</li>)}
        </ol>
        <Panel title={steps[w.step]}>
          <Stack gap={6}>
            {w.step === 0 && <Stack gap={4}><TextInput label="Email" type="email" /><TextInput label="Password" type="password" /></Stack>}
            {w.step === 1 && <Stack gap={4}><TextInput label="Display name" /><Selector label="Role" options={opts('Designer', 'Engineer', 'Manager')} /></Stack>}
            {w.step === 2 && <Stack gap={4}><Switch label="Email notifications" defaultChecked /><Switch label="Weekly digest" /></Stack>}
            {w.step === 3 && <p className="tpl-text">Everything is ready. Create the account to continue</p>}
            <Nav w={w} finish="Create account" />
          </Stack>
        </Panel>
      </div>
    </Page>
  );
}

export function InlineWizard() {
  const w = useSteps(2);
  return (
    <Page width={520}>
      <Card variant="surface" padding={6}>
        <Stack gap={5}>
          <Stack gap={1}><h1 className="tpl-h2">Invite a teammate</h1><p className="tpl-meta">{`Step ${w.step + 1} of 2`}</p></Stack>
          {w.step === 0 ? <Stack gap={4}><TextInput label="Email" type="email" /><Selector label="Role" options={opts('Viewer', 'Editor', 'Admin')} /></Stack> : <Stack gap={4}><TokenGroup title="Projects" multiple options={opts('Website', 'Mobile app', 'Billing')} /></Stack>}
          <Nav w={w} finish="Send invite" />
        </Stack>
      </Card>
    </Page>
  );
}

export function DialogWizard() {
  const w = useSteps(2);
  const [open, setOpen] = useState(true);
  return (
    <Page width={560}>
      <PageHeader title="Projects" actions={<Button variant="primary" label="New project" onClick={() => setOpen(true)} />} />
      <p className="tpl-text">Your projects are listed here, and the dialog keeps the page in place while you create one</p>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="New project"
        subtitle={`Step ${w.step + 1} of 2`}
        secondaryAction={<Button variant="secondary" label={w.first ? 'Cancel' : 'Back'} onClick={() => (w.first ? setOpen(false) : w.back())} />}
        primaryAction={<Button variant="primary" label={w.last ? 'Create' : 'Next'} onClick={() => (w.last ? setOpen(false) : w.next())} />}
      >
        {w.step === 0 ? <Stack gap={4}><TextInput label="Project name" /><Selector label="Template" options={opts('Blank', 'Website', 'Mobile app')} /></Stack> : <Stack gap={4}><Switch label="Make it private" defaultChecked /><Switch label="Add the whole team" /></Stack>}
      </Dialog>
    </Page>
  );
}
