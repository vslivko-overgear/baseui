import { Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.jsx';
import { Button } from '../components/Button.jsx';
import { Status } from '../components/Status.jsx';
import { Table, proportional, pixel } from '../components/Table.jsx';
import { spacingBalance } from '../../tools/audits/spacing-balance.js';

export default {
  title: 'Tools/Spacing Balance',
  parameters: { docs: { description: { component: 'Checks proximity: things that belong together sit closer than things that do not' } } },
};

const card = { background: 'var(--bui-background-secondary)', borderRadius: 'var(--bui-radius-2xl)', padding: 16, width: 220 };
const line = { margin: 0, font: 'var(--bui-typography-text-16-regular)', lineHeight: '16px' }; // no leading, so the box gaps are the drawn gaps

/** Two groups of lines: `inner` is the gap inside a group, `outer` the gap between the groups. */
const Groups = ({ inner, outer, label }) => (
  <div>
    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: outer }}>
      {[1, 2].map((g) => (
        <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: inner }}>
          <p style={{ ...line, fontWeight: 600 }}>{`Group ${g}`}</p>
          <p style={line}>First line</p>
          <p style={line}>Second line</p>
        </div>
      ))}
    </div>
    <p className="doc-p" style={{ marginTop: 8, maxWidth: 220 }}>
      {label}
    </p>
  </div>
);

export function page() {
  const [rows, setRows] = useState(null);
  const [scope, setScope] = useState('');
  const examples = useRef(null);
  const run = (which) => {
    setScope(which === 'examples' ? 'the examples above' : 'this page');
    const ex = examples.current;
    if (which === 'examples') ex.removeAttribute('data-spacing-ignore');
    const found = spacingBalance(which === 'examples' ? ex : document.querySelector('#main') || document.body);
    ex.setAttribute('data-spacing-ignore', '');
    setRows(found.map((f, i) => ({ id: i, ...f })));
  };
  const columns = [
    { key: 'kind', header: 'Finding', width: pixel(90) },
    { key: 'selector', header: 'Container > group', width: proportional(4, { minWidth: 220 }), renderCell: (r) => <code>{r.selector}</code> },
    { key: 'gap', header: 'Inside', width: pixel(70), align: 'end' },
    { key: 'around', header: 'Around', width: pixel(110), align: 'end' },
    { key: 'suggestion', header: 'Use', width: proportional(2, { minWidth: 110 }) },
  ];
  return (
    <>
      <p className="doc-p">Small scripts that look after the system. They are not components: you run them while you work on one</p>
      <Block title="The rule">
        <p className="doc-p">
          {'The markup is the grouping. What sits in one container belongs together, so the gaps '}
          <b>inside</b>
          {' a container are smaller than the gaps '}
          <b>around</b>
          {
            ' it, level by level: the deeper the nesting, the tighter the gap. The tool knows no component and no tag; it measures the gap between what is drawn (text, icons, surfaces), not between the boxes with their padding'
          }
        </p>
        <div ref={examples} data-spacing-ignore="" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          <Groups inner={4} outer={24} label="4 inside, 24 between: two groups" />
          <Groups inner={12} outer={16} label="12 inside, 16 between: weak, the groups blur" />
          <Groups inner={16} outer={12} label="16 inside, 12 between: inverted, the lines pair up wrongly" />
        </div>
        <p className="doc-p" style={{ marginTop: 16 }}>
          {'Findings, each with the value to use: '}
          <b>inversion</b>
          {' (the gap around a group is not bigger than inside it), '}
          <b>weak</b>
          {' (bigger, but by less than a step: 4px or 25%), '}
          <b>uneven</b>
          {' (one container holds gaps that differ 2x: it is really two groups, wrap them), '}
          <b>lead</b>
          {' (a heading belongs to what follows it, so the gap above it must be bigger than the gap below it, and 2x after a heavy block such as a card or a code block) and '}
          <b>weaker</b>
          {
            ' (a text that is visually weaker than the one above it is farther from it than that text is from what is above it). A group that paints its own surface or border (a button, a card, a bubble) is closed by it and is not checked'
          }
        </p>
      </Block>
      <Block title="Run it">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Button variant="primary" onClick={() => run('examples')}>
            Check the examples above
          </Button>
          <Button variant="secondary" onClick={() => run('page')}>
            Check this page
          </Button>
        </div>
        {rows === null ? null : rows.length === 0 ? (
          <Status status="success" title="Grouped" description={`Related things on ${scope} sit closer than unrelated ones`} />
        ) : (
          <Table data={rows} columns={columns} density="compact" caption={`Gaps that break the rule on ${scope}`} />
        )}
      </Block>
      <Block title="In the browser">
        <p className="doc-p">
          <code>tools/audits/spacing-balance.js</code>
          {' has no dependencies. Import it and give it any element; an element inside '}
          <code>[data-spacing-ignore]</code>
          {' is skipped:'}
        </p>
        <pre>
          <code>
            {
              "import { spacingBalance } from './tools/audits/spacing-balance.js';\nconsole.table(spacingBalance(document.body));\n// [{ kind, selector, gap, around, suggestion }, …]"
            }
          </code>
        </pre>
      </Block>
      <Block title="A product">
        <p className="doc-p">
          <code>tools/check/spacing.mjs</code>
          {' opens the example products and every template on a wide and a narrow screen (and the first row of a list) and prints the groups that are not separated enough'}
        </p>
        <pre>
          <code>{'python3 -m http.server 8000 &\nnode tools/check/spacing.mjs http://localhost:8000 [path …]'}</code>
        </pre>
      </Block>
    </>
  );
}
