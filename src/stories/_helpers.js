// Helpers for stories: one format for page metadata and examples.
import { h } from '../react.js';

/** Page metadata; the description comes from describe() on the component. */
export const meta = ({ title, component, args, argTypes, description }) => ({
  title,
  component,
  args,
  argTypes,
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

export const Stack = ({ gap = 'var(--baseui-spacing-16)', width, children }) =>
  h('div', { style: { display: 'flex', flexDirection: 'column', gap, width, maxWidth: '100%' } }, children);
export const Row = ({ gap = 'var(--baseui-spacing-16)', align = 'center', children }) =>
  h('div', { style: { display: 'flex', flexWrap: 'wrap', gap, alignItems: align } }, children);
export const Box = ({ children, style }) =>
  h('div', { style: { padding: 'var(--baseui-spacing-12) var(--baseui-spacing-16)', borderRadius: 'var(--baseui-radius-12)', background: 'var(--baseui-Background-Secondary)', font: 'var(--baseui-Typography-Text-14-Regular)', ...style } }, children);
const W = (w, c) => h('div', { style: { width: w, maxWidth: '100%' } }, c);
export { W };

/** A local placeholder picture (no network): a gradient with a letter. */
export const demoImage = (letter, hue = 220) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 62%)"/><stop offset="1" stop-color="hsl(${hue + 40} 70% 42%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="66" font-size="48" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`)}`;

/** A phone-sized frame for mobile components: an optional top bar, a content area and an optional bottom bar. */
export const Phone = ({ top, bottom, children, height = 320 }) =>
  h('div', { style: { display: 'flex', flexDirection: 'column', width: 375, maxWidth: '100%', height, borderRadius: 'var(--baseui-radius-24, 24px)', overflow: 'hidden', background: 'var(--baseui-Background-Primary)' } },
    top, h('div', { style: { flex: 1, margin: '0 var(--baseui-spacing-8)', padding: 'var(--baseui-spacing-16)', borderRadius: 'var(--baseui-radius-16, 16px)', background: 'var(--baseui-Background-Secondary)', font: 'var(--baseui-Typography-Text-14-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, children), bottom);
