import { Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/Spacing',
  parameters: { docs: { description: { component: 'Spacing for padding, gap and margin. A token is named by its step: spacing-1 is 4px, spacing-4 is 16px, spacing-0-5 is 2px' } } },
};

/** The relations of baseui (--bui-rel-*, src/components.css): how closely blocks belong together, and the step of the scale each is. */
const RELATIONS = [
  { name: 'pair', value: '0px', what: 'a title and the line that describes it: no gap, the line-height is the space' },
  { name: 'tight', value: '8px', what: 'a heading and its content, the parts of one block' },
  { name: 'related', value: '16px', what: 'blocks that belong together: the cards of a list, a rating under a headline (the default)' },
  { name: 'group', value: '24px', what: 'groups of related blocks, the fields of a form section' },
  { name: 'section', value: '40px', what: 'the big blocks of a page, a section from the next one' },
];

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
      <Block title="Relations">
        <p className="doc-p">
          A gap between blocks is chosen by how closely the blocks belong together, not by a number. Five relations name the steps of the scale that are meant for blocks; <code>Stack relation</code>, <code>Group</code>, <code>FormSection</code> and the pages of a product take the relation and never a size. The size is in one place, the token, so one change moves every page.
        </p>
        <div className="space-list">
          {RELATIONS.map((r) => (
            <div key={r.name} className="space-row space-row--relation">
              <code>{`--bui-rel-${r.name}`}</code>
              <span className="space-bar-wrap">
                <span className="tok-bar" style={{ width: `var(--bui-rel-${r.name})`, minWidth: 1 }} />
              </span>
              <span className="val">{r.value}</span>
              <span className="space-relation__what">
                <strong>{r.name}</strong>
                <span>{r.what}</span>
                <span className="space-relation__demo" style={{ gap: `var(--bui-rel-${r.name})` }} aria-hidden="true"><i /><i /></span>
              </span>
            </div>
          ))}
        </div>
        <pre className="const-code">{`<Stack relation="related">…</Stack>      {/* the cards of a list: 16px */}
<Stack relation="section">…</Stack>      {/* the big blocks of a page: 40px */}`}</pre>
        <p className="doc-p">
          Inside an element, 4 to 8px (<code>spacing-1</code> to <code>spacing-2</code>), is not a relation between blocks: it is the padding of the element. A heading is at most 60% of its font size from its content, and 16px at least.
        </p>
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
