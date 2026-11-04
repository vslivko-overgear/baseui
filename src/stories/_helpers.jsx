// Helpers for stories: one format for page metadata and examples.

/** Page metadata; the description comes from describe() on the component. */
export const meta = ({ title, component, args, argTypes, description, decorators, render }) => ({
  title,
  component,
  args,
  argTypes,
  decorators,
  render,
  parameters: { docs: { description: { component: description || component.__docgenInfo.description } } },
});

/** Interactive story (with a controls panel). */
export const playground = ({ description, source }) => ({
  parameters: { docs: { description: { story: description }, source: { originalSource: source } } },
});

/** Static example without controls. */
export const example = ({ name, render, description, source }) => ({
  name,
  render,
  parameters: { controls: { disable: true }, docs: { description: { story: description }, source: { originalSource: source } } },
});

export const Stack = ({ gap = 'var(--bui-spacing-4)', width, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, width, maxWidth: '100%' }}>{children}</div>
);
export const Row = ({ gap = 'var(--bui-spacing-4)', align = 'center', children }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: align }}>{children}</div>
);
export const Box = ({ children, style }) => (
  <div
    style={{
      padding: 'var(--bui-spacing-3) var(--bui-spacing-4)',
      borderRadius: 'var(--bui-radius-xl)',
      background: 'var(--bui-background-secondary)',
      font: 'var(--bui-typography-text-14-regular)',
      ...style,
    }}
  >
    {children}
  </div>
);
const W = (w, c) => <div style={{ width: w, maxWidth: '100%' }}>{c}</div>;
export { W };

/** A local placeholder picture (no network): a gradient with a letter. */
export const demoImage = (letter, hue = 220) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 62%)"/><stop offset="1" stop-color="hsl(${hue + 40} 70% 42%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="66" font-size="48" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`)}`;

/** A phone-sized frame for mobile components: an optional top bar, a content area and an optional bottom bar.
 *  With `overlay` the bars lie over colorful content, which shows floating and glass. */
export const Phone = ({ top, bottom, children, height = 320, overlay = false }) => {
  const frame = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: 375,
    maxWidth: '100%',
    height,
    borderRadius: 'var(--bui-radius-3xl, 24px)',
    overflow: 'hidden',
    background: 'var(--bui-background-primary)',
  };
  const content = {
    flex: 1,
    margin: '0 var(--bui-spacing-2)',
    padding: 'var(--bui-spacing-4)',
    borderRadius: 'var(--bui-radius-2xl, 16px)',
    background: 'var(--bui-background-secondary)',
    font: 'var(--bui-typography-text-14-regular)',
  };
  if (!overlay)
    return (
      <div style={frame}>
        {top}
        <div style={content}>{children}</div>
        {bottom}
      </div>
    );
  const blob = (x, y, c) => `radial-gradient(circle at ${x}% ${y}%, var(--bui-extensions-background-${c}) 0, transparent 38%)`;
  return (
    <div
      style={{ ...frame, background: `${blob(15, 30, 'light-accent')}, ${blob(85, 55, 'light-error')}, ${blob(40, 95, 'light-warning')}, var(--bui-background-secondary)` }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>{top}</div>
      <div
        style={{
          flex: 1,
          padding: 'var(--bui-spacing-4)',
          paddingTop: 72,
          font: 'var(--bui-typography-text-14-regular)',
          color: 'var(--bui-text-and-icon-primary)',
        }}
      >
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1 }}>{bottom}</div>
    </div>
  );
};
