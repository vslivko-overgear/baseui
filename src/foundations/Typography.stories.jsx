import { Fragment } from '../react.js';
import { Collapsible } from '../components/Collapsible.jsx';
import { useTokens, section, Loading } from './_kit.jsx';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { AGENT_DEFAULTS } from '../constitution/rules.js';

export default {
  title: 'Foundations/Typography',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, docs: { description: { component: 'Type styles for headings and text' } } },
};

const shortValue = (v) => {
  const m = v.match(/^(\d+)\s+(\d+)px\s*\/\s*(\d+)px/);
  return m ? `${m[1]} · ${m[2]}/${m[3]}` : v;
};
const HEADER_SETTING = 'The quick brown fox jumps over the lazy dog';
const TEXT_SETTING = 'Good typography makes a page easy to read. Lines are short enough to follow, the leading gives each line room, and the size says what matters. Numbers such as 0123456789 line up, and a long word like internationalization still fits.';

const SECOND_HEADER = 'Pack my box with five dozen liquor jugs';
const SECOND = 'A second paragraph follows after the paragraph spacing of this size, so the two read as separate thoughts of one text';

function Scale() {
  const tokens = section('Typography', useTokens());
  if (!tokens) return <Loading />;
  const paragraphs = Object.fromEntries(tokens.groups[0].tokens.filter((t) => t.name.startsWith('typography-paragraph-')).map((t) => [t.name.replace(/^typography-paragraph-/, ''), t.value]));
  const styles = tokens.groups[0].tokens.filter((t) => /^typography-(header|text)-/.test(t.name));
  const groups = [
    ['Headers', styles.filter((t) => t.name.startsWith('typography-header-')), HEADER_SETTING],
    ['Text', styles.filter((t) => t.name.startsWith('typography-text-')), TEXT_SETTING],
  ];
  return (
    <div className="type-page">
      {groups.map(([title, list, setting]) => (
        <section key={title} className="type-section">
          <h3 className="type-section-title">{title}</h3>
          <div className="type-list">
            {list.map((t) => {
              const varName = `baseui-${t.name}`,
                name = t.name.replace(/^typography-/, ''),
                paragraph = t.name.replace(/^typography-(text-)?/, '').split('-').slice(0, t.name.startsWith('typography-header-') ? 2 : 1).join('-');
              return (
                <Collapsible
                  key={t.name}
                  className="type-row"
                  title={
                    <span className="type-head">
                      <span className="type-sample" style={{ font: `var(--${varName})` }}>
                        {name.replace(/-/g, ' ')}
                      </span>
                      <span className="type-meta">
                        <span className="type-name">{name}</span>
                        <span className="type-value">{shortValue(t.value)}</span>
                      </span>
                    </span>
                  }
                >
                  <div className="type-setting" style={{ font: `var(--${varName})`, '--para': paragraph ? `var(--baseui-typography-paragraph-${paragraph})` : undefined }}>
                    <p>{setting}</p>
                    {paragraph && <p>{title === 'Headers' ? SECOND_HEADER : SECOND}</p>}
                  </div>
                  <p className="type-token">
                    <code>{`var(--${varName})`}</code>
                    <code>{t.value}</code>
                    {paragraph && <code>{`paragraph spacing var(--baseui-typography-paragraph-${paragraph}): ${paragraphs[paragraph]}`}</code>}
                  </p>
                </Collapsible>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
export const Scale_ = {
  name: 'Scale',
  render: () => <Scale />,
  parameters: {
    docs: {
      description: { story: 'Type styles `--baseui-typography-*` from tokens.css, grouped into headers and text. Open a row to see a text set in that style' },
      source: { originalSource: '<Typography />' },
    },
  },
};
export { Scale_ as Scale };
function Periods() {
  const defaults = AGENT_DEFAULTS.find((d) => d.id === 'punctuation');
  const text = { margin: 0, font: 'var(--baseui-typography-text-16-regular)' };
  return (
    <div className="type-page">
      <p className="doc-p">
        The last sentence of any text has no period: in a label, a caption, a hint, a description, a list item, a tooltip, a toast, a paragraph. The periods between sentences stay, and so do a question mark, an exclamation mark and an ellipsis
      </p>
      <div className="usage">
        <div className="usage__col usage__col--do">
          <h3>
            <BuiltinIcon name="success" size={20} aria-hidden="true" /> Do
          </h3>
          <p style={text}>Your plan renews on 1 March. You can cancel at any time</p>
          <p style={text}>Changes saved</p>
          <p style={text}>Delete this file? You cannot undo it</p>
        </div>
        <div className="usage__col usage__col--dont">
          <h3>
            <BuiltinIcon name="error" size={20} aria-hidden="true" /> Don&apos;t
          </h3>
          <p style={text} data-constitution-example="">
            Your plan renews on 1 March. You can cancel at any time.
          </p>
          <p style={text} data-constitution-example="">
            Changes saved.
          </p>
          <p style={text} data-constitution-example="">
            Delete this file? You cannot undo it.
          </p>
        </div>
      </div>
      {defaults.text.map((t) => (
        <p key={t} className="doc-p">
          {t}
        </p>
      ))}
    </div>
  );
}
export const Periods_ = {
  name: 'Final Period',
  render: () => <Periods />,
  parameters: {
    docs: {
      description: { story: 'The last sentence of a text has no period' },
      source: { originalSource: '<p>Changes saved</p>' },
    },
  },
};
export { Periods_ as Periods };
export const __namedExportsOrder = ['Scale', 'TextColor', 'Periods'];

function TextColor() {
  const defaults = AGENT_DEFAULTS.find((d) => d.id === 'typography');
  const sample = { margin: 0, font: 'var(--baseui-typography-text-16-regular)' };
  const note = { margin: 'var(--baseui-spacing-1) 0 0', font: 'var(--baseui-typography-text-12-regular)', color: 'var(--baseui-text-and-icon-secondary)' };
  return (
    <div className="type-page">
      <p className="doc-p">
        The main text, what a person has to read, is set in <code>text-and-icon-primary</code>. <code>text-and-icon-secondary</code> is for supporting text: a caption, a hint, metadata, a timestamp, the helper line under a title. It has less contrast, so a paragraph set in it is harder to read, and when everything is quiet nothing leads. <code>text-and-icon-disabled</code> is only for disabled controls
            </p>
      <div className="usage">
        <div className="usage__col usage__col--do">
          <h3>
            <BuiltinIcon name="success" size={20} aria-hidden="true" /> Do
          </h3>
          <p style={{ ...sample, font: 'var(--baseui-typography-text-16-semi-bold)' }}>Your plan renews on 1 March</p>
          <p style={{ ...sample, color: 'var(--baseui-text-and-icon-primary)' }}>You can change or cancel it at any time before then. We will send a receipt to your email after each payment</p>
          <p style={note}>Billed monthly · Visa ending in 4242</p>
        </div>
        <div className="usage__col usage__col--dont">
          <h3>
            <BuiltinIcon name="error" size={20} aria-hidden="true" /> Don&apos;t
          </h3>
          <p style={{ ...sample, font: 'var(--baseui-typography-text-16-semi-bold)', color: 'var(--baseui-text-and-icon-secondary)' }}>Your plan renews on 1 March</p>
          <p style={{ ...sample, color: 'var(--baseui-text-and-icon-secondary)' }} data-constitution-example="">
                      You can change or cancel it at any time before then. We will send a receipt to your email after each payment
                    </p>
          <p style={note}>Billed monthly · Visa ending in 4242</p>
        </div>
      </div>
      {defaults.text.map((t) => (
        <p key={t} className="doc-p">
          {t}
        </p>
      ))}
    </div>
  );
}
export const TextColor_ = {
  name: 'Text Color',
  render: () => <TextColor />,
  parameters: {
    docs: {
      description: { story: 'Primary for the main text, Secondary only for supporting text' },
      source: { originalSource: '<p style={{ color: "var(--baseui-text-and-icon-primary)" }}>…</p>' },
    },
  },
};
export { TextColor_ as TextColor };
