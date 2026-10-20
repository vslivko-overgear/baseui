import { h, Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.js';
import { Button } from '../components/Button.js';
import { Status } from '../components/Status.js';
import { Table, proportional, pixel } from '../components/Table.js';
import { checkRadii } from '../../tools/radius-check.js';

export default {
  title: 'Tools/Radius Check',
  parameters: { docs: { description: { component: 'Checks that nested rounded corners are concentric: the inner radius is the outer radius minus the inset between them.' } } },
};

const box = { background: 'var(--baseui-Background-Secondary)', padding: 8 };
const inner = { background: 'var(--baseui-Background-Primary)', height: 48, display: 'grid', placeItems: 'center', font: 'var(--baseui-Typography-Text-14-Regular)' };

/** Two nested surfaces: the outer radius 24 and the inset 8, so the inner radius must be 16. */
const Nested = ({ radius, label }) => h('div', { style: { ...box, borderRadius: 24, width: 220 } },
  h('div', { style: { ...inner, borderRadius: radius } }, label));

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
    { key: 'selector', header: 'Outer > inner', width: proportional(4, { minWidth: 220 }), renderCell: (r) => h('code', null, r.selector) },
    { key: 'corner', header: 'Corner', width: pixel(140) },
    { key: 'outer', header: 'Outer', width: pixel(72), align: 'end' },
    { key: 'inset', header: 'Inset', width: pixel(72), align: 'end' },
    { key: 'expected', header: 'Expected', width: pixel(90), align: 'end' },
    { key: 'actual', header: 'Actual', width: pixel(80), align: 'end' },
  ];
  return h(Fragment, null,
    h('p', { className: 'doc-p' }, 'Small scripts that look after the system. They are not components: you run them while you work on one.'),
    h(Block, { title: 'The rule' },
      h('p', { className: 'doc-p' }, 'A rounded element inside a rounded surface follows its corner: ', h('b', null, 'inner radius = outer radius − inset'), ', where the inset is the distance between the two edges (the padding). With a 24px surface and 8px of padding the inner corner is 16px. Then the gap between the two curves is the same all the way round.'),
      h('div', { ref: examples, 'data-radius-ignore': '', style: { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' } },
        h('div', null, h(Nested, { radius: 16, label: 'inner 16: concentric' })),
        h('div', null, h(Nested, { radius: 8, label: 'inner 8: too sharp' })),
        h('div', null, h(Nested, { radius: 20, label: 'inner 20: too round' }))),
      h('p', { className: 'doc-p', style: { marginTop: 16 } }, 'Pills and circles are skipped (they have no concentric partner), and so is a small element deep inside a surface, such as a button in a field. An example that breaks the rule on purpose carries ', h('code', null, 'data-radius-ignore'), '.')),
    h(Block, { title: 'Run it' },
      h('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 } },
        h(Button, { variant: 'primary', onClick: () => run('examples') }, 'Check the examples above'),
        h(Button, { variant: 'secondary', onClick: () => run('page') }, 'Check this page')),
      rows === null ? null
        : rows.length === 0 ? h(Status, { status: 'success', title: 'All concentric', description: `Every nested corner on ${scope} follows the rule.` })
          : h(Table, { data: rows, columns, density: 'compact', caption: `Corners that break the rule on ${scope}` })),
    h(Block, { title: 'In the browser' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/radius-check.js'), ' has no dependencies. Import it and give it any element:'),
      h('pre', null, h('code', null, "import { checkRadii } from './tools/radius-check.js';\nconsole.table(checkRadii(document.body));\n// [{ selector, corner, outer, inset, expected, actual }, …]"))),
    h(Block, { title: 'Every page of the site' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/check-radii.mjs'), ' opens every page of the documentation (and the first menu of each one), runs the check and prints what breaks the rule. The exit code is 1 when something does, so it fits CI. It needs Playwright and the site served over HTTP:'),
      h('pre', null, h('code', null, 'python3 -m http.server 8000 &\nnode tools/check-radii.mjs http://localhost:8000'))));
}
