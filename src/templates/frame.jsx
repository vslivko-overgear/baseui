// The page a template is shown in: templates/frame/?t=<id>&theme=light|dark.
// It loads one template, applies the theme of the site, and tells the parent page its height.
import { createRoot } from 'react-dom/client';
import { loadTheme, applyTheme } from '../../site/theme.js';

const params = new URLSearchParams(location.search);
const id = params.get('t');
const root = document.documentElement;
root.setAttribute('data-theme', params.get('theme') === 'dark' ? 'dark' : 'light');
const settings = loadTheme();
applyTheme(settings);

const post = () => parent !== window && parent.postMessage({ type: 'baseui-frame-height', id, height: Math.ceil(document.documentElement.scrollHeight) }, '*');
try {
  const { TEMPLATE_COMPONENTS } = await import('./index.js');
  const Template = TEMPLATE_COMPONENTS[id];
  if (!Template) throw new Error('unknown');
  document.title = `${id} · baseui template`;
  createRoot(document.getElementById('root')).render(<Template />);
  new ResizeObserver(post).observe(document.body);
  setTimeout(post, 400);
} catch (e) {
  document.getElementById('root').textContent = `No template "${id}"`;
}
