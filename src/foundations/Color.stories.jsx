import { Fragment } from '../react.js';
import { useTokens, section, Block, colorPreview, TokenTable, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/Color',
  parameters: { docs: { description: { component: 'Color tokens for text, backgrounds, borders and accents. Each has a light and a dark value' } } },
};

export function page() {
  const color = section('Color', useTokens());
  if (!color) return <Loading />;
  return (
    <>
      {color.groups.map((g) => (
        <Block key={g.title} title={g.title}>
          <TokenTable tokens={g.tokens} themed preview={colorPreview(color)} previewWidth={120} />
        </Block>
      ))}
    </>
  );
}
export const __namedExportsOrder = [];
