import { Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/Spacing',
  parameters: { docs: { description: { component: 'Spacing for padding, gap and margin. A token is named by its step: spacing-1 is 4px, spacing-4 is 16px, spacing-0-5 is 2px' } } },
};

export function page() {
  const s = section('Spacing', useTokens());
  if (!s) return <Loading />;
  const tokens = s.groups[0].tokens;
  return (
    <>
      <Block title="Scale">
        <div className="space-list">
          {tokens.map((t) => (
            <div key={t.name} className="space-row">
              <code>{`--baseui-${t.name}`}</code>
              <span className="space-bar-wrap">
                <span className="tok-bar" style={{ width: t.value === '0' ? 1 : t.value }} />
              </span>
              <span className="val">{t.value}</span>
            </div>
          ))}
        </div>
        <TokenTable tokens={tokens} />
      </Block>
      <Block title="Negative Spacing">
        <p className="doc-p">
          There is one more token, <code>--baseui-spacing-negative</code>, a plain <code>-1</code>. Multiply any spacing token by it to get the same step as a negative value, for example to let a block bleed into the padding of its container
                </p>
        <pre className="const-code">{`margin-inline: calc(var(--baseui-spacing-4) * var(--baseui-spacing-negative));   /* -16px */`}</pre>
        <div className="space-negative">
          <div className="space-negative__box">
            <div className="space-negative__bleed">margin-inline: -spacing-4</div>
          </div>
        </div>
        <p className="doc-p">In Tailwind the same is <code>-mx-4</code>.</p>
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];
