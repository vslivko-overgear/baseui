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

const card = { background: 'var(--baseui-Background-Secondary)', borderRadius: 16, padding: 16, width: 220 };
const line = { margin: 0, font: 'var(--baseui-Typography-Text-16-Regular)', lineHeight: '16px' };   // no leading, so the box gaps are the drawn gaps

/** Two groups of lines: `inner` is the gap inside a group, `outer` the gap between the groups. */
const Groups = ({ inner, outer, label }) => h('div', null,
  h('div', { style: { ...card, display: 'flex', flexDirection: 'column', gap: outer } },
    [1, 2].map((g) => h('div', { key: g, style: { display: 'flex', flexDirection: 'column', gap: inner } },
      h('p', { style: { ...line, fontWeight: 600 } }, `Group ${g}`), h('p', { style: line }, 'First line'), h('p', { style: line }, 'Second line')))),
  h('p', { className: 'doc-p', style: { marginTop: 8, maxWidth: 220 } }, label));

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
    { key: 'selector', header: 'Container > group', width: proportional(4, { minWidth: 220 }), renderCell: (r) => h('code', null, r.selector) },
    { key: 'gap', header: 'Inside', width: pixel(70), align: 'end' },
    { key: 'around', header: 'Around', width: pixel(110), align: 'end' },
    { key: 'suggestion', header: 'Use', width: proportional(2, { minWidth: 110 }) },
  ];
  return h(Fragment, null,
    h('p', { className: 'doc-p' }, 'Small scripts that look after the system. They are not components: you run them while you work on one.'),
    h(Block, { title: 'The rule' },
      h('p', { className: 'doc-p' }, 'The markup is the grouping. What sits in one container belongs together, so the gaps ', h('b', null, 'inside'), ' a container are smaller than the gaps ', h('b', null, 'around'), ' it, level by level: the deeper the nesting, the tighter the gap. The tool knows no component and no tag; it measures the gap between what is drawn (text, icons, surfaces), not between the boxes with their padding.'),
      h('div', { ref: examples, 'data-spacing-ignore': '', style: { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' } },
        h(Groups, { inner: 4, outer: 24, label: '4 inside, 24 between: two groups' }),
        h(Groups, { inner: 12, outer: 16, label: '12 inside, 16 between: weak, the groups blur' }),
        h(Groups, { inner: 16, outer: 12, label: '16 inside, 12 between: inverted, the lines pair up wrongly' })),
      h('p', { className: 'doc-p', style: { marginTop: 16 } }, 'Findings, each with the value to use: ',
        h('b', null, 'inversion'), ' (the gap around a group is not bigger than inside it), ', h('b', null, 'weak'), ' (bigger, but by less than a step: 4px or 25%), ',
        h('b', null, 'uneven'), ' (one container holds gaps that differ 2x: it is really two groups, wrap them) and ', h('b', null, 'weaker'),
        ' (a text that is visually weaker than the one above it is farther from it than that text is from what is above it). A group that paints its own surface or border (a button, a card, a bubble) is closed by it and is not checked.')),
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
      h('p', { className: 'doc-p' }, h('code', null, 'tools/check-spacing.mjs'), ' opens the example products on a wide and a narrow screen (and the first row of a list) and prints the groups that are not separated enough.'),
      h('pre', null, h('code', null, 'python3 -m http.server 8000 &\nnode tools/check-spacing.mjs http://localhost:8000 [path …]'))));
}
