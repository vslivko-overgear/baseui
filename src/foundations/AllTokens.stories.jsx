import { Fragment } from '../react.js';
import { useTokens, Block, TokenTable, colorPreview, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/All Tokens',
  parameters: { docs: { description: { component: 'Every design token, read from tokens.css' } } },
};

const PREVIEW = {
  Spacing: (t) => <span className="tok-bar" style={{ width: t.value === '0' ? 1 : t.value }} />,
  Radius: (t) => <span className="tok-radius" style={{ borderRadius: t.value }} />,
  Shadow: (t) => <span className="tok-shadow" style={{ boxShadow: t.value }} />,
};

export function page() {
  const data = useTokens();
  if (!data) return <Loading />;
  return (
    <>
      {data.map((s) => (
        <Block key={s.title} title={s.title} id={s.title.toLowerCase()}>
          {s.groups.map((g) => (
            <Fragment key={g.title}>
              {g.title && <h3>{g.title}</h3>}
              <TokenTable tokens={g.tokens} themed={s.themed} preview={s.themed ? colorPreview(s, 28) : PREVIEW[s.title]} previewWidth={96} />
            </Fragment>
          ))}
        </Block>
      ))}
    </>
  );
}
export const __namedExportsOrder = [];
