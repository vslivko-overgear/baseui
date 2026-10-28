import { h, Fragment, useState } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.js';
import { Button } from '../components/Button.js';

export default {
  title: 'Foundations/Motion',
  parameters: { docs: { description: { component: 'Duration and easing tokens for transitions.' } } },
};

function Demo({ rows }) {
  const [on, setOn] = useState(false);
  return h('div', { className: 'motion-demo' },
    h('div', null, h(Button, { variant: 'secondary', size: 'sm', onClick: () => setOn(!on) }, on ? 'Reset' : 'Play')),
    rows.map(({ label, duration, easing }) => h('div', { key: label, className: 'motion-row' },
      h('code', null, label),
      h('div', { className: 'motion-track' },
        h('div', { className: 'motion-ball', style: { left: on ? 'calc(100% - 36px)' : 4, transition: `left ${duration} ${easing}` } })))));
}

const EASE = 'var(--baseui-ease-standard)';
const SLOW = 'var(--baseui-duration-slow)';

export function page() {
  const s = section('Duration & easing', useTokens());
  if (!s) return h(Loading);
  const tokens = s.groups[0].tokens;
  const durations = ['fast', 'medium', 'slow'].map((band) => ({ label: `duration-${band}`, duration: `var(--baseui-duration-${band})`, easing: EASE }));
  const easings = [{ label: 'linear', duration: SLOW, easing: 'linear' }, ...tokens.filter((t) => t.name.startsWith('ease')).map((t) => ({ label: t.name, duration: SLOW, easing: `var(--baseui-${t.name})` }))];
  return h(Fragment, null,
    h(Block, { title: 'Duration' },
      h(Demo, { rows: durations }),
      h(TokenTable, { tokens: tokens.filter((t) => t.name.startsWith('duration')) })),
    h(Block, { title: 'Easing' },
      h(Demo, { rows: easings }),
      h(TokenTable, { tokens: tokens.filter((t) => t.name.startsWith('ease')) })));
}
export const __namedExportsOrder = [];
