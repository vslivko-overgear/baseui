import { Fragment, useState } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';
import { Button } from '../components/Button.jsx';

export default {
  title: 'Foundations/Motion',
  parameters: { docs: { description: { component: 'Duration and easing tokens for transitions' } } },
};

function Demo({ rows }) {
  const [on, setOn] = useState(false);
  return (
    <div className="motion-demo">
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOn(!on)}>
          {on ? 'Reset' : 'Play'}
        </Button>
      </div>
      {rows.map(({ label, duration, easing }) => (
        <div key={label} className="motion-row">
          <code>{label}</code>
          <div className="motion-track">
            <div className="motion-ball" style={{ left: on ? 'calc(100% - 36px)' : 4, transition: `left ${duration} ${easing}` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const EASE = 'var(--baseui-ease-out)';
const SLOW = 'var(--baseui-duration-500)';

export function page() {
  const s = section('Duration & easing', useTokens());
  if (!s) return <Loading />;
  const tokens = s.groups[0].tokens;
  const durations = tokens.filter((t) => t.name.startsWith('duration')).map((t) => ({ label: t.name, duration: `var(--baseui-${t.name})`, easing: EASE }));
  const easings = [
    { label: 'linear', duration: SLOW, easing: 'linear' },
    ...tokens.filter((t) => t.name.startsWith('ease')).map((t) => ({ label: t.name, duration: SLOW, easing: `var(--baseui-${t.name})` })),
  ];
  return (
    <>
      <Block title="Duration">
        <Demo rows={durations} />
        <TokenTable tokens={tokens.filter((t) => t.name.startsWith('duration'))} />
      </Block>
      <Block title="Easing">
        <Demo rows={easings} />
        <TokenTable tokens={tokens.filter((t) => t.name.startsWith('ease'))} />
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];
