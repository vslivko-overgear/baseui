import { h, Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.js';
import { Button } from '../components/Button.js';
import { Status } from '../components/Status.js';
import { Table, proportional, pixel } from '../components/Table.js';
import { spacingBalance } from '../../tools/spacing-balance.js';

export default {
  title: 'Tools/Spacing Balance',
  parameters: { docs: { description: { component: 'Checks proximity: things that belong together sit closer than things that do not.' } } },
};

const card = { background: 'var(--baseui-Background-Secondary)', borderRadius: 16, padding: 16, width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
const name = { font: 'var(--baseui-Typography-Header-24)', margin: 0 };
const muted = { font: 'var(--baseui-Typography-Text-16-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' };
const dot = { width: 64, height: 64, borderRadius: '50%', background: 'var(--baseui-Background-Tertiary)' };

/** An avatar, a name and a line under it, with the gap between the name and the line set by the example. */
const Profile = ({ gap, label }) => h('div', null,
  h('div', { style: card },
    h('div', { style: dot }), h('h2', { style: { ...name, marginTop: 8 } }, 'Maya Chen'), h('span', { style: { ...muted, marginTop: gap } }, 'online')),
  h('p', { className: 'doc-p', style: { marginTop: 8 } }, label));

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
    { key: 'kind', header: 'Pair', width: pixel(90) },
    { key: 'selector', header: 'Elements', width: proportional(4, { minWidth: 220 }), renderCell: (r) => h('code', null, r.selector) },
    { key: 'gap', header: 'Gap', width: pixel(70), align: 'end' },
    { key: 'around', header: 'Around it', width: pixel(110), align: 'end' },
    { key: 'suggestion', header: 'Use', width: proportional(2, { minWidth: 110 }) },
  ];
  return h(Fragment, null,
    h('p', { className: 'doc-p' }, 'Small scripts that look after the system. They are not components: you run them while you work on one.'),
    h(Block, { title: 'The rule' },
      h('p', { className: 'doc-p' }, 'Things that belong together sit ', h('b', null, 'closer'), ' than things that do not. The gap inside a pair must not be bigger than the gap on either side of it. The pairs it knows: a text and a smaller or muted text under it, a heading and what follows, a tab list and its panel, an avatar and its name. The gap is measured between what is drawn (text, icons, surfaces), not between the boxes with their padding.'),
      h('div', { ref: examples, 'data-spacing-ignore': '', style: { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' } },
        h(Profile, { gap: 2, label: 'online 2px under the name: one group' }),
        h(Profile, { gap: 24, label: 'online 24px under the name: it fell off' }))),
    h(Block, { title: 'Run it' },
      h('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 } },
        h(Button, { variant: 'primary', onClick: () => run('examples') }, 'Check the examples above'),
        h(Button, { variant: 'secondary', onClick: () => run('page') }, 'Check this page')),
      rows === null ? null
        : rows.length === 0 ? h(Status, { status: 'success', title: 'Grouped', description: `Related things on ${scope} sit closer than unrelated ones.` })
          : h(Table, { data: rows, columns, density: 'compact', caption: `Gaps that break the rule on ${scope}` })),
    h(Block, { title: 'In the browser' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/spacing-balance.js'), ' has no dependencies. Import it and give it any element; an element inside ', h('code', null, '[data-spacing-ignore]'), ' is skipped:'),
      h('pre', null, h('code', null, "import { spacingBalance } from './tools/spacing-balance.js';\nconsole.table(spacingBalance(document.body));\n// [{ kind, selector, gap, around, suggestion }, …]"))),
    h(Block, { title: 'A product' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/check-spacing.mjs'), ' opens the example products on a wide and a narrow screen (and the first row of a list) and prints the gaps that break the rule.'),
      h('pre', null, h('code', null, 'python3 -m http.server 8000 &\nnode tools/check-spacing.mjs http://localhost:8000 [path …]'))));
}
