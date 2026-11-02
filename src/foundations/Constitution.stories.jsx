import { useState } from '../react.js';
import { Block } from './_kit.jsx';
import { Banner } from '../components/Banner.jsx';
import { SegmentedControl } from '../components/SegmentedControl.jsx';
import { ConstitutionBanner } from '../components/ConstitutionBanner.jsx';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { AGENT_PROTOCOL, CATEGORIES, CONSTITUTION_VERSION, RULES, dontBody } from '../constitution/rules.js';

export default {
  title: 'Foundations/Constitution',
  parameters: {
    docs: {
      description: {
        component:
          'The design rules an interface built with baseui must follow to be at least acceptable. Each rule says what to do and what not to do. An agent that builds a prototype against a request that breaks a rule warns in its answer and puts a banner across the top of the prototype',
      },
    },
  },
};

const CHECK = { auto: 'Found by the audit', partial: 'The audit finds the clear cases, the rest needs a review', tool: 'Found by a script', review: 'Needs a review' };

function Rule({ rule }) {
  return (
    <article className="const-rule" id={`rule-${rule.id}`} data-level={rule.level}>
      <header className="const-rule__head">
        <span className="const-rule__id">{rule.id}</span>
        <h3>{rule.title}</h3>
        <span className="const-rule__tag" data-level={rule.level}>
          {rule.level === 'must' ? 'Must' : 'Should'}
        </span>
      </header>
      <div className="const-rule__cols">
        <p className="const-rule__do">
          <BuiltinIcon name="success" size={20} aria-hidden="true" />
          <span>
            <b>Do</b> {rule.do}
          </span>
        </p>
        <p className="const-rule__dont">
          <BuiltinIcon name="error" size={20} aria-hidden="true" />
          <span>
            <b>Don&apos;t</b> {dontBody(rule)}
          </span>
        </p>
      </div>
      <p className="const-rule__why">{rule.why}</p>
      <p className="const-rule__meta">
        {rule.source} · {CHECK[rule.check]}
        {rule.tool ? ` (${rule.tool})` : ''}
      </p>
    </article>
  );
}

export function page() {
  const [level, setLevel] = useState('all');
  const shown = (category) => RULES.filter((r) => r.category === category && (level === 'all' || r.level === level));
  const musts = RULES.filter((r) => r.level === 'must').length;
  return (
    <>
      <Block title="How it works">
        <p className="doc-p">
          {RULES.length} rules in {CATEGORIES.length} groups ({musts} must, {RULES.length - musts} should), version {CONSTITUTION_VERSION}. They come from WCAG 2.1 AA, from the tokens and components of this system, and from the usability, visual hierarchy, consistency and UX writing principles it follows. A <b>must</b> protects people and is always reported. A <b>should</b> is a strong default: keep it, or say why not
                </p>
        <p className="doc-p">
                  Anyone may choose to break a rule, but it must be visible. When a prototype is built against a request that breaks a rule, the agent says so in its answer and the prototype carries a banner across the top (below)
                </p>
        <SegmentedControl
          label="Show rules"
          value={level}
          onValueChange={setLevel}
          items={[
            { value: 'all', label: 'All', counter: RULES.length },
            { value: 'must', label: 'Must', counter: musts },
            { value: 'should', label: 'Should', counter: RULES.length - musts },
          ]}
        />
      </Block>
      {CATEGORIES.map((c) => {
        const rules = shown(c.id);
        return (
          rules.length > 0 && (
            <Block key={c.id} title={c.title}>
              <p className="doc-p">{c.lead}</p>
              <div className="const-rules">
                {rules.map((r) => (
                  <Rule key={r.id} rule={r} />
                ))}
              </div>
            </Block>
          )
        );
      })}
      <Block title="For agents">
        <p className="doc-p">
          This is the protocol for an agent that builds prototypes with baseui (also in <code>CONSTITUTION.md</code> and <code>AGENTS.md</code>)
                </p>
        <ol className="const-protocol">
          {AGENT_PROTOCOL.map((step, i) => (
            <li key={i}>{step.replace(/^\d\.\s/, '')}</li>
          ))}
        </ol>
        <Banner status="info" title="The banner">
                  Put it before any other content of the prototype
                </Banner>
      </Block>
      <Block title="The banner">
        <p className="doc-p">It stretches across the full width, lists the rules by id, opens to show what each one asks for, and cannot be closed</p>
        <div className="const-demo">
          <ConstitutionBanner sticky={false} defaultOpen violations={[{ id: 'A1', note: 'Body text is #bbbbbb on white (1.9:1)' }, { id: 'H2', note: 'Captions are 10px' }, 'D1']} />
        </div>
        <pre className="const-code">{`<ConstitutionBanner violations={[
  { id: 'A1', note: 'Body text is #bbbbbb on white' },
  { id: 'H2', note: 'Captions are 10px' },
]} />`}</pre>
        <p className="doc-p">
          <code>auditConstitution()</code> finds the rules marked “Found by the audit” in a rendered page (contrast, touch targets, labels, alt text, headings, one primary action, font size, sideways scroll). <code>{'<ConstitutionBanner audit />'}</code> runs it and adds what it finds
                </p>
      </Block>
    </>
  );
}
