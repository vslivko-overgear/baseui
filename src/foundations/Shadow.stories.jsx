import { Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/Shadow',
  parameters: { docs: { description: { component: 'Three shadow levels for raised surfaces' } } },
};

export function page() {
  const s = section('Shadow', useTokens());
  if (!s) return <Loading />;
  const tokens = s.groups[0].tokens;
  return (
    <>
      <Block title="Scale">
        <div className="shadow-grid">
          {tokens.map((t) => (
            <figure key={t.name} className="shadow-item">
              <div className="shadow-box" style={{ boxShadow: `var(--bui-${t.name})` }} />
              <figcaption>
                <code>{t.name}</code>
              </figcaption>
            </figure>
          ))}
        </div>
        <TokenTable tokens={tokens} />
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];
