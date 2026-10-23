import { h, Fragment, useState, useRef } from '../react.js';
import { Block } from '../foundations/_kit.js';
import { Button, IconButton } from '../components/Button.js';
import { Status } from '../components/Status.js';
import { Table, proportional, pixel } from '../components/Table.js';
import { sizeBalance, TEXT_LADDER, TIERS } from '../../tools/size-balance.js';

export default {
  title: 'Tools/Size Balance',
  parameters: { docs: { description: { component: 'Measures a screen from the 16px body text: one ladder of text sizes and one ladder of control heights, so nothing is small here and too big there.' } } },
};

const card = { background: 'var(--baseui-Background-Secondary)', borderRadius: 16, padding: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' };

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
    { key: 'selector', header: 'Element', width: proportional(3, { minWidth: 200 }), renderCell: (r) => h('code', null, r.selector) },
    { key: 'found', header: 'Found', width: proportional(3, { minWidth: 200 }) },
    { key: 'suggestion', header: 'Use', width: proportional(2, { minWidth: 120 }) },
  ];
  return h(Fragment, null,
    h('p', { className: 'doc-p' }, 'Small scripts that look after the system. They are not components: you run them while you work on one.'),
    h(Block, { title: 'The ladder' },
      h('p', { className: 'doc-p' }, 'Everything is measured from ', h('b', null, '16px'), ', the body text, which is ', h('b', null, 'md'), '. Text goes ', TEXT_LADDER.join(' · '), '; controls go ', TIERS.map((t, i) => `${t} ${[32, 40, 48, 56][i]}`).join(' · '), ' px high. Use md by default, sm for a row inside a list, xsm inside a message; lg is for a single call to action.'),
      h('div', { ref: examples, 'data-size-ignore': '', style: { display: 'grid', gap: 12 } },
        h('div', { style: card }, h(Button, { variant: 'primary', size: 'md' }, 'Send'), h(Button, { variant: 'secondary', size: 'md' }, 'Cancel'), h('span', { className: 'doc-p' }, 'md and md: calm')),
        h('div', { style: card }, h(Button, { variant: 'primary', size: 'lg' }, 'Send'), h(Button, { variant: 'secondary', size: 'xsm' }, 'Cancel'), h('span', { className: 'doc-p' }, 'lg beside xsm: a row that jumps')),
        h('div', { style: card }, h(IconButton, { variant: 'secondary', size: 'sm', label: 'Add', icon: h('span', null, '+') }), h(Button, { variant: 'primary', size: 'md' }, 'Save'), h('span', { className: 'doc-p' }, 'sm beside md: uneven'))),
      h('p', { className: 'doc-p', style: { marginTop: 16 } }, 'It reports five findings, each with the value to use: ',
        h('b', null, 'small-text'), ' (under 12px), ', h('b', null, 'off-ladder'), ' (a size that is not on the text ladder), ', h('b', null, 'row'), ' (controls of one row with different heights), ',
        h('b', null, 'anchor'), ' (a label bigger than the 16px body) and ', h('b', null, 'hierarchy'), ' (a secondary text not smaller than its title).')),
    h(Block, { title: 'Run it' },
      h('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 } },
        h(Button, { variant: 'primary', onClick: () => run('examples') }, 'Check the examples above'),
        h(Button, { variant: 'secondary', onClick: () => run('page') }, 'Check this page')),
      rows === null ? null
        : rows.length === 0 ? h(Status, { status: 'success', title: 'Balanced', description: `Everything on ${scope} is on the ladder.` })
          : h(Table, { data: rows, columns, density: 'compact', caption: `Findings on ${scope}` })),
    h(Block, { title: 'In the browser' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/size-balance.js'), ' has no dependencies. Import it and give it any element; an element inside ', h('code', null, '[data-size-ignore]'), ' is skipped:'),
      h('pre', null, h('code', null, "import { sizeBalance } from './tools/size-balance.js';\nconsole.table(sizeBalance(document.body));\n// [{ kind, selector, found, suggestion }, …]"))),
    h(Block, { title: 'A product' },
      h('p', { className: 'doc-p' }, h('code', null, 'tools/check-sizes.mjs'), ' opens the example products on a wide and a narrow screen (and the first row of a list) and prints what is off the ladder. The pages of this documentation are galleries that show every size on purpose, so they are not swept.'),
      h('pre', null, h('code', null, 'python3 -m http.server 8000 &\nnode tools/check-sizes.mjs http://localhost:8000 [path …]'))));
}
