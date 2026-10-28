// Rendering of a story: used by the documentation site.

import { React } from '../src/react.js';
export { React };
export const h = React.createElement;
const { useMemo, useRef } = React;

export function composeStory(meta, story) {
  const args = { ...meta.args, ...story.args };
  const decorators = [...(story.decorators || []), ...(meta.decorators || [])];
  const render = story.render || meta.render;
  return { args, decorators, render, parameters: { ...meta.parameters, ...story.parameters } };
}

export function StoryCanvas({ meta, story, args }) {
  const ref = useRef(args);
  ref.current = args;
  const Inner = useMemo(() => {
    const { decorators, render, parameters } = composeStory(meta, story);
    const mapped = () => Object.fromEntries(Object.entries(ref.current).map(([k, v]) => { const m = meta.argTypes?.[k]?.mapping; return [k, m && v in m ? m[v] : v]; }));
    const ctx = () => ({ args: mapped(), parameters, globals: {}, argTypes: meta.argTypes, component: meta.component });
    let Story = () => (render ? render(mapped(), ctx()) : h(meta.component, mapped()));
    for (const deco of decorators) {
      const Prev = Story;
      Story = () => deco(() => h(Prev), ctx());
    }
    return Story;
  }, [meta, story]);
  return h(Inner);
}

export class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    return this.state.error
      ? h('div', { className: 'error' }, 'Could not render this example: ', String(this.state.error.message || this.state.error))
      : this.props.children;
  }
}
