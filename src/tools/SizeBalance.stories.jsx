import { Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.jsx';
import { Button, IconButton } from '../components/Button.jsx';
import { Status } from '../components/Status.jsx';
import { Table, proportional, pixel } from '../components/Table.jsx';
import { sizeBalance, TEXT_LADDER, TIERS } from '../../tools/audits/size-balance.js';

export default {
  title: 'Tools/Size Balance',
  parameters: {
    docs: {
      description: {
        component:
          'Measures a screen from the 16px body text: one ladder of text sizes and one ladder of control heights, so nothing is small here and too big there',
      },
    },
  },
};

const card = {
  background: 'var(--baseui-extensions-background-surface)',
  borderRadius: 16,
  padding: 16,
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export function page() {
  const [rows, setRows] = useState(null);
  const [scope, setScope] = useState('');
  const examples = useRef(null);
  const run = (which) => {
    setScope(which === 'examples' ? 'the examples above' : 'this page');
    const ex = examples.current;
    if (which === 'examples') ex.removeAttribute('data-size-ignore');
    const found = sizeBalance(which === 'examples' ? ex : document.querySelector('#main') || document.body);
    ex.setAttribute('data-size-ignore', '');
    setRows(found.map((f, i) => ({ id: i, ...f })));
  };
  const columns = [
    { key: 'kind', header: 'Finding', width: pixel(110) },
    { key: 'selector', header: 'Element', width: proportional(3, { minWidth: 200 }), renderCell: (r) => <code>{r.selector}</code> },
    { key: 'found', header: 'Found', width: proportional(3, { minWidth: 200 }) },
    { key: 'suggestion', header: 'Use', width: proportional(2, { minWidth: 120 }) },
  ];
  return (
    <>
      <p className="doc-p">Small scripts that look after the system. They are not components: you run them while you work on one</p>
      <Block title="The ladder">
        <p className="doc-p">
          {'Everything is measured from '}
          <b>16px</b>
          {', the body text, which is '}
          <b>md</b>
          {'. Text goes '}
          {TEXT_LADDER.join(' · ')}
          {'; controls go '}
          {TIERS.map((t, i) => `${t} ${[32, 40, 48, 56][i]}`).join(' · ')}
          {' px high. Use md by default, sm for a row inside a list, xsm inside a message; lg is for a single call to action'}
        </p>
        <div ref={examples} data-size-ignore="" style={{ display: 'grid', gap: 12 }}>
          <div style={card}>
            <Button variant="primary" size="md">
              Send
            </Button>
            <Button variant="secondary" size="md">
              Cancel
            </Button>
            <span className="doc-p">md and md: calm</span>
          </div>
          <div style={card}>
            <Button variant="primary" size="lg">
              Send
            </Button>
            <Button variant="secondary" size="xsm">
              Cancel
            </Button>
            <span className="doc-p">lg beside xsm: a row that jumps</span>
          </div>
          <div style={card}>
            <IconButton variant="secondary" size="sm" label="Add" icon={<span>+</span>} />
            <Button variant="primary" size="md">
              Save
            </Button>
            <span className="doc-p">sm beside md: uneven</span>
          </div>
        </div>
        <p className="doc-p" style={{ marginTop: 16 }}>
          {'It reports five findings, each with the value to use: '}
          <b>small-text</b>
          {' (under 12px), '}
          <b>off-ladder</b>
          {' (a size that is not on the text ladder), '}
          <b>row</b>
          {' (controls of one row with different heights), '}
          <b>anchor</b>
          {' (a label bigger than the 16px body) and '}
          <b>hierarchy</b>
          {' (a secondary text not smaller than its title)'}
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
          <Status status="success" title="Balanced" description={`Everything on ${scope} is on the ladder`} />
        ) : (
          <Table data={rows} columns={columns} density="compact" caption={`Findings on ${scope}`} />
        )}
      </Block>
      <Block title="In the browser">
        <p className="doc-p">
          <code>tools/audits/size-balance.js</code>
          {' has no dependencies. Import it and give it any element; an element inside '}
          <code>[data-size-ignore]</code>
          {' is skipped:'}
        </p>
        <pre>
          <code>
            {
              "import { sizeBalance } from './tools/audits/size-balance.js';\nconsole.table(sizeBalance(document.body));\n// [{ kind, selector, found, suggestion }, …]"
            }
          </code>
        </pre>
      </Block>
      <Block title="A product">
        <p className="doc-p">
          <code>tools/check/sizes.mjs</code>
          {
            ' opens the example products on a wide and a narrow screen (and the first row of a list) and prints what is off the ladder. The pages of this documentation are galleries that show every size on purpose, so they are not swept'
          }
        </p>
        <pre>
          <code>{'python3 -m http.server 8000 &\nnode tools/check/sizes.mjs http://localhost:8000 [path …]'}</code>
        </pre>
      </Block>
    </>
  );
}
