import { Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';

export default {
  title: 'Foundations/Layout',
  parameters: { docs: { description: { component: 'Page margins, container sizes and breakpoints: the numbers that lay out pages, dialogs and sheets' } } },
};

const frame = (width, margin, label) => (
  <div className="layout-frame" style={{ width }}>
    <div className="layout-frame__inner" style={{ padding: margin }}>
      <div className="layout-frame__content">{label}</div>
    </div>
  </div>
);

export function page() {
  const s = section('Layout', useTokens());
  if (!s) return <Loading />;
  // Non-themed sections are one flat list: the groups are told apart by token name.
  const all = s.groups.flatMap((g) => g.tokens);
  const group = (title) =>
    all.filter((t) => (title === 'Margins' ? /-margin-/ : title === 'Breakpoints' ? /^breakpoint-/ : /-(height|width|max-width)$/).test(t.name));
  const value = (name) => all.find((t) => t.name === name)?.value;
  return (
    <>
      <Block title="Margins">
        <p className="doc-p">
                  The space between a screen edge and its content. Mobile screens, mobile sheets and the mobile preview use the mobile margin; wide screens and the
                  desktop dialog use the desktop margin
                </p>
        <div className="layout-frames">
          {frame(220, value('layout-margin-mobile'), `Mobile ${value('layout-margin-mobile')}`)}
          {frame(320, value('layout-margin-desktop'), `Desktop ${value('layout-margin-desktop')}`)}
        </div>
        <TokenTable tokens={group('Margins')} />
      </Block>
      <Block title="Sizes">
        <p className="doc-p">Fixed dimensions of the page frame and of the dialog</p>
        <TokenTable tokens={group('Sizes')} />
      </Block>
      <Block title="Breakpoints">
        <p className="doc-p">
                  The breakpoints are Tailwind's. Below md (767px and less) the sidebar becomes a catalog sheet, the settings column becomes a sheet, and a Dialog, a Selector
                  and a Typeahead become a bottom sheet. Media queries cannot read variables, so these values are written out in the CSS
                </p>
        <TokenTable tokens={group('Breakpoints')} />
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];
