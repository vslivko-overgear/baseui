import { Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.jsx';
import { Button } from '../components/Button.jsx';
import { Status } from '../components/Status.jsx';
import { Table, proportional, pixel } from '../components/Table.jsx';
import { checkRadii } from '../../tools/audits/radius-check.js';

export default {
  title: 'Tools/Radius Check',
  parameters: {
    docs: {
      description: { component: 'Checks that nested rounded corners are concentric: the inner radius is the outer radius minus the inset between them' },
    },
  },
};

const box = { background: 'var(--baseui-background-secondary)', padding: 8 };
const inner = {
  background: 'var(--baseui-background-primary)',
  height: 48,
  display: 'grid',
  placeItems: 'center',
  font: 'var(--baseui-typography-text-14-regular)',
};

/** Two nested surfaces: the outer radius 24 and the inset 8, so the inner radius must be 16. */
const Nested = ({ radius, label }) => (
  <div style={{ ...box, borderRadius: 24, width: 220 }}>
    <div style={{ ...inner, borderRadius: radius }}>{label}</div>
  </div>
);

export function page() {
  const [rows, setRows] = useState(null);
  const [scope, setScope] = useState('');
  const examples = useRef(null);
  const run = (which) => {
    setScope(which === 'examples' ? 'the examples above' : 'this page');
    // the examples break the rule on purpose, so they carry data-radius-ignore; only their own check lifts it for a moment
    const ex = examples.current;
    if (which === 'examples') ex.removeAttribute('data-radius-ignore');
    const found = checkRadii(which === 'examples' ? ex : document.querySelector('#main') || document.body);
    ex.setAttribute('data-radius-ignore', '');
    setRows(found.map((f, i) => ({ id: i, ...f })));
  };
  const columns = [
    { key: 'selector', header: 'Outer > inner', width: proportional(4, { minWidth: 220 }), renderCell: (r) => <code>{r.selector}</code> },
    { key: 'corner', header: 'Corner', width: pixel(140) },
    { key: 'outer', header: 'Outer', width: pixel(72), align: 'end' },
    { key: 'inset', header: 'Inset', width: pixel(72), align: 'end' },
    { key: 'expected', header: 'Expected', width: pixel(90), align: 'end' },
    { key: 'actual', header: 'Actual', width: pixel(80), align: 'end' },
  ];
  return (
    <>
      <p className="doc-p">Small scripts that look after the system. They are not components: you run them while you work on one</p>
      <Block title="The rule">
        <p className="doc-p">
          {'A rounded element inside a rounded surface follows its corner: '}
          <b>inner radius = outer radius − inset</b>, where the inset is the distance between the two edges (the padding). With a 24px surface and 8px of
                  padding the inner corner is 16px. Then the gap between the two curves is the same all the way round
                </p>
        <div ref={examples} data-radius-ignore="" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          <div>
            <Nested radius={16} label="inner 16: concentric" />
          </div>
          <div>
            <Nested radius={8} label="inner 8: too sharp" />
          </div>
          <div>
            <Nested radius={20} label="inner 20: too round" />
          </div>
        </div>
        <p className="doc-p" style={{ marginTop: 16 }}>
          {
            'Pills and circles are skipped (they have no concentric partner), and so is a small element deep inside a surface, such as a button in a field. An example that breaks the rule on purpose carries '
          }
          <code>data-radius-ignore</code>.
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
          <Status status="success" title="All concentric" description={`Every nested corner on ${scope} follows the rule`} />
        ) : (
          <Table data={rows} columns={columns} density="compact" caption={`Corners that break the rule on ${scope}`} />
        )}
      </Block>
      <Block title="In the browser">
        <p className="doc-p">
          <code>tools/audits/radius-check.js</code>
          {' has no dependencies. Import it and give it any element:'}
        </p>
        <pre>
          <code>
            {
              "import { checkRadii } from './tools/audits/radius-check.js';\nconsole.table(checkRadii(document.body));\n// [{ selector, corner, outer, inset, expected, actual }, …]"
            }
          </code>
        </pre>
      </Block>
      <Block title="Every page of the site">
        <p className="doc-p">
          <code>tools/check/radii.mjs</code>
          {
            ' opens every page of the documentation (and the first menu of each one), runs the check and prints what breaks the rule. The exit code is 1 when something does, so it fits CI. It needs Playwright and the site served over HTTP:'
          }
        </p>
        <pre>
          <code>{'python3 -m http.server 8000 &\nnode tools/check/radii.mjs http://localhost:8000'}</code>
        </pre>
      </Block>
    </>
  );
}
