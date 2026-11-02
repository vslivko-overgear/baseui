import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';
import { AGENT_DEFAULTS } from '../constitution/rules.js';

export default {
  title: 'Foundations/Radius',
  parameters: { docs: { description: { component: 'Corner radii: the named scale, and the custom radii that make nested corners concentric' } } },
};

const Swatches = ({ tokens }) => (
  <div className="shape-grid">
    {tokens.map((t) => (
      <figure key={t.name} className="shape-item">
        <div className="shape-box" style={{ borderRadius: t.value }} />
        <figcaption>
          <code>{t.name.replace('radius-', '')}</code>
          <span>{t.value}</span>
        </figcaption>
      </figure>
    ))}
  </div>
);

export function page() {
  const s = section('Radius', useTokens());
  if (!s) return <Loading />;
  const all = s.groups[0].tokens;
  const custom = { tokens: all.filter((t) => t.name.startsWith('radius-custom-')) };
  const scale = { tokens: all.filter((t) => !t.name.startsWith('radius-custom-')) };
  const radius = AGENT_DEFAULTS.find((d) => d.id === 'radius');
  return (
    <>
      <Block title="Radius Scale">
        <p className="doc-p">The names and sizes are Tailwind's: sm 4px, md 6px, lg 8px, xl 12px, 2xl 16px, 3xl 24px, 4xl 32px, plus none and full</p>
        <Swatches tokens={scale.tokens} />
        <TokenTable tokens={scale.tokens} />
      </Block>
      <Block title="Custom Radius">
        <p className="doc-p">
          Four more sizes that Tailwind has no name for: 10, 14, 20 and 28px. They are what nested corners need when the outer radius is on the scale and the gap
          to the inner one is 2 or 4px (12 − 2 = 10, 16 − 2 = 14, 24 − 4 = 20, 32 − 4 = 28). They are named by their size, <code>radius-custom-10</code>, and follow the radius scale factor like the others
                </p>
        <Swatches tokens={custom.tokens} />
        <TokenTable tokens={custom.tokens} />
      </Block>
      <Block title="Concentric Radius">
        <p className="doc-p">Inner radius = outer radius − padding. A background around an entity gets the entity's radius plus the padding</p>
        <div className="concentric">
          <div className="concentric-outer">
            <div className="concentric-inner">24 − 8 = 16</div>
          </div>
        </div>
      </Block>
      <Block title="For Agents">
        {radius.text.map((t) => (
          <p key={t} className="doc-p">
            {t}
          </p>
        ))}
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];
