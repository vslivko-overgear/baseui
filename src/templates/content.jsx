// Content templates: landing pages, documentation, and detail pages for an order, a product and a work item.
import { useState } from '../react.js';
import { Card, ClickableCard } from '../components/Card.jsx';
import { Stack, Grid } from '../components/Layout.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Banner } from '../components/Banner.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Selector } from '../components/Selector.jsx';
import { RatingDisplay } from '../components/Rating.jsx';
import { Token } from '../components/Token.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Divider } from '../components/Divider.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page, PageHeader, Fluid, Panel, money } from './_kit.jsx';

const Picture = ({ label = 'Image' }) => <div className="tpl-image" role="img" aria-label={label}><Icon name="Image01" size={32} /></div>;

export function CenteredHero() {
  return (
    <Page width={880}>
      <div className="tpl-hero">
        <Stack gap={4} align="center">
          <Badge variant="info" label="New in 3.0" />
          <Stack gap={3} align="center">
            <h1>Plan, build and ship in one place</h1>
            <p className="tpl-text">One workspace for your roadmap, your tasks and your releases, so the whole team looks at the same page</p>
          </Stack>
        </Stack>
        <Stack direction="row" gap={3} justify="center" wrap><Button label="Start for free" size="lg" variant="primary" /><Button label="Book a demo" size="lg" variant="secondary" /></Stack>
        <Picture label="Product screenshot" />
      </div>
    </Page>
  );
}

export function GalleryHero() {
  return (
    <Page width={1040}>
      <div className="tpl-hero">
        <Stack gap={3} align="center">
          <h1>Made by people, for people</h1>
          <p className="tpl-text">A small studio designing things that are used every day</p>
        </Stack>
        <Button label="See our work" size="lg" variant="primary" />
      </div>
      <Grid columns="repeat(auto-fit, minmax(min(220px, 100%), 1fr))" gap={4}>{['One', 'Two', 'Three', 'Four'].map((n) => <Picture key={n} label={`Work ${n}`} />)}</Grid>
    </Page>
  );
}

const CATEGORIES = [['BookOpen01', 'Getting started', 'Install, configure and ship a first page'], ['LayoutGrid01', 'Components', 'Every building block with its settings'], ['Zap', 'Guides', 'Recipes for the patterns people ask about'], ['Settings01', 'Reference', 'Tokens, themes and the command line']];
export function DocumentationCatalog() {
  return (
    <Page width={960}>
      <PageHeader title="Documentation" subtitle="Find what you need, or start from a category" />
      <Fluid min={260}>
        {CATEGORIES.map(([icon, title, text]) => (
          <ClickableCard variant="surface" key={title} label={title} padding={5} onClick={() => {}}>
            <Stack gap={2}><Icon name={icon} size={28} /><h2 className="tpl-h2">{title}</h2><p className="tpl-meta">{text}</p></Stack>
          </ClickableCard>
        ))}
      </Fluid>
    </Page>
  );
}

export function DocumentationDesign() {
  return (
    <Page width={880}>
      <Breadcrumbs items={[{ label: 'Docs', href: '#' }, { label: 'Components', href: '#' }, { label: 'Button' }]} />
      <PageHeader title="Button" subtitle="Starts an action on the page" />
      <Panel title="Preview"><Stack direction="row" gap={3} wrap><Button label="Primary" variant="primary" /><Button label="Secondary" variant="secondary" /><Button label="Ghost" variant="ghost" /></Stack></Panel>
      <Fluid min={300}>
        <Card variant="surface" padding={5}><Stack gap={2}><Badge variant="success" label="Do" /><p className="tpl-text">Use one primary button for the main action of a view</p></Stack></Card>
        <Card variant="surface" padding={5}><Stack gap={2}><Badge variant="error" label="Don't" /><p className="tpl-text">Put several primary buttons side by side</p></Stack></Card>
      </Fluid>
    </Page>
  );
}

export function DocumentationTechnical() {
  return (
    <Page width={760}>
      <PageHeader title="Install the kit" subtitle="Five minutes from an empty folder to a themed page" />
      <div className="tpl-prose">
        <section className="tpl-step">
          <h2 className="tpl-h2">1. Add the package</h2>
          <pre className="tpl-code"><code>npm install baseui</code></pre>
        </section>
        <section className="tpl-step">
          <h2 className="tpl-h2">2. Import the tokens</h2>
          <p>Load the stylesheet once, at the root of your application</p>
          <pre className="tpl-code"><code>{"import 'baseui/tokens.css';"}</code></pre>
        </section>
        <section className="tpl-step">
          <h2 className="tpl-h2">3. Use a component</h2>
          <pre className="tpl-code"><code>{"import { Button } from 'baseui';\n\n<Button label=\"Save\" variant=\"primary\" />"}</code></pre>
        </section>
        <Banner status="info" title="Before you start">You need React 18 or newer</Banner>
      </div>
    </Page>
  );
}

export function OrderDetail() {
  const steps = [['Ordered', 'Oct 24'], ['Packed', 'Oct 25'], ['Shipped', 'Oct 26'], ['Delivered', 'Expected Oct 29']];
  return (
    <Page width={960}>
      <PageHeader title="Order 10482" subtitle="Placed on Oct 24 by Amelia Brooks" actions={<><Badge variant="info" label="Shipped" /><Button label="Track package" variant="primary" size="sm" /></>} />
      <div className="tpl-split">
        <Stack gap={4}>
          <Panel title="Items">
            <List><ListItem avatar={<Avatar alt="Desk" shape="square" />} subtitle="Quantity 1" details={money(590)}>Standing desk</ListItem><ListItem avatar={<Avatar alt="Arm" shape="square" />} subtitle="Quantity 2" details={money(260)}>Monitor arm</ListItem></List>
          </Panel>
          <Panel title="Timeline"><ol className="tpl-steps">{steps.map(([s, d], i) => <li key={s} data-done={i < 3 || undefined} aria-current={i === 2 ? 'step' : undefined}><span className="tpl-steps__dot">{i < 2 ? '✓' : i + 1}</span><span>{s}</span><span className="tpl-meta">{d}</span></li>)}</ol></Panel>
        </Stack>
        <Stack gap={4}>
          <Panel title="Delivery"><p className="tpl-text">12 Rosenthaler Strasse, Berlin</p></Panel>
          <Panel title="Payment"><Stack gap={2}><Stack direction="row" justify="space-between"><span className="tpl-meta">Subtotal</span><span className="tpl-text">{money(850)}</span></Stack><Stack direction="row" justify="space-between"><span className="tpl-meta">Shipping</span><span className="tpl-text">Free</span></Stack><Divider /><Stack direction="row" justify="space-between"><strong className="tpl-text">Total</strong><strong className="tpl-text">{money(850)}</strong></Stack></Stack></Panel>
        </Stack>
      </div>
    </Page>
  );
}

export function ProductDetail() {
  const [size, setSize] = useState('M');
  return (
    <Page width={1040} gap={12}>
      <Breadcrumbs items={[{ label: 'Shop', href: '#' }, { label: 'Desks', href: '#' }, { label: 'Standing desk' }]} />
      <Grid columns="repeat(auto-fit, minmax(min(320px, 100%), 1fr))" gap={8}>
        <Stack gap={3}><Picture label="Standing desk" /><Grid columns={4} gap={2}>{[1, 2, 3, 4].map((n) => <Picture key={n} label={`View ${n}`} />)}</Grid></Stack>
        <Stack gap={6}>
          <Stack gap={4}>
          <Stack gap={2}><h1 className="tpl-title">Standing desk</h1><Stack direction="row" gap={2} align="center"><RatingDisplay value={4} /><span className="tpl-meta">128 reviews</span></Stack><span className="tpl-figure">{money(590)}</span></Stack>
          <Stack gap={3}>
            <Stack direction="row" gap={2}>{['S', 'M', 'L'].map((s) => <Token key={s} pressed={size === s} onPressedChange={() => setSize(s)}>{s}</Token>)}</Stack>
            <Selector label="Finish" options={['Oak', 'Walnut', 'White'].map((v) => ({ value: v, label: v }))} defaultValue="Oak" />
            <Button label="Add to cart" size="lg" variant="primary" width="100%" />
          </Stack>
          </Stack>
          <Tabs label="Product" items={[
            { value: 'about', label: 'About', content: <p className="tpl-text">A sturdy electric desk with memory presets and a quiet motor</p> },
            { value: 'specs', label: 'Specs', content: <p className="tpl-text">Height 62 to 128 cm, load 120 kg, two motors</p> },
            { value: 'shipping', label: 'Shipping', content: <p className="tpl-text">Ships in three working days, free returns for 30 days</p> },
          ]} />
        </Stack>
      </Grid>
    </Page>
  );
}

export function WorkItemDetail() {
  return (
    <Page width={1040}>
      <Breadcrumbs items={[{ label: 'Board', href: '#' }, { label: 'ENG-214' }]} />
      <PageHeader title="Fix the login loop" actions={<Button label="Mark as done" variant="primary" size="sm" />} />
      <div className="tpl-split">
        <Stack gap={4}>
          <Panel title="Description"><p className="tpl-text">Some people are sent back to the login page after signing in with a single sign-on account. It started after the last release</p></Panel>
          <Panel title="Activity">
            <List>
              <ListItem avatar={<Avatar alt="Oliver Grant" />} subtitle="2 hours ago">Oliver Grant moved this to In progress</ListItem>
              <ListItem avatar={<Avatar alt="Priya Raman" />} subtitle="Yesterday">Priya Raman added a reproduction</ListItem>
            </List>
          </Panel>
        </Stack>
        <Panel title="Details">
          <Stack gap={3}>
            {[['Status', <Badge key="s" variant="info" label="In progress" />], ['Assignee', <Stack key="a" direction="row" gap={2} align="center"><Avatar alt="Oliver Grant" size="sm" /><span className="tpl-text">Oliver Grant</span></Stack>], ['Priority', <Badge key="p" variant="warning" label="High" />], ['Due', <span key="d" className="tpl-text">Nov 3</span>]].map(([k, v]) => <Stack key={k} direction="row" justify="space-between" align="center"><span className="tpl-meta">{k}</span>{v}</Stack>)}
          </Stack>
        </Panel>
      </div>
    </Page>
  );
}
