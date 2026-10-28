import { h, useState, useEffect, useCallback, Fragment } from '../react.js';
import { useTokens, section, Loading } from './_kit.js';

export default {
  title: 'Foundations/Typography',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, docs: { description: { component: 'Type styles for headings and text.' } } },
};

const shortValue = (v) => { const m = v.match(/^(\d+)\s+(\d+)px\s*\/\s*(\d+)px/); return m ? `${m[1]} · ${m[2]}/${m[3]}` : v; };
function Scale() {
  const tokens = section('Typography', useTokens());
  const [copied, setCopied] = useState('');
  useEffect(() => { if (!copied) return undefined; const t = setTimeout(() => setCopied(''), 1500); return () => clearTimeout(t); }, [copied]);
  const copy = useCallback((varName) => {
    const text = `var(--${varName})`;
    const fallback = () => {
      const active = document.activeElement, area = document.createElement('textarea');
      area.value = text; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.append(area); area.select();
      const ok = document.execCommand('copy');
      area.remove(); if (active instanceof HTMLElement) active.focus(); if (ok) setCopied(varName);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => setCopied(varName)).catch(fallback); else fallback();
  }, []);
  if (!tokens) return h(Loading);
  const styles = tokens.groups[0].tokens.filter((t) => /^Typography-(Header|Text)-/.test(t.name));
  const groups = [['Headers', styles.filter((t) => t.name.startsWith('Typography-Header-'))], ['Text', styles.filter((t) => t.name.startsWith('Typography-Text-'))]];
  return h('div', { className: 'type-page' },
    groups.map(([title, list]) => h('section', { key: title, className: 'type-section' },
      h('h3', { className: 'type-section-title' }, title),
      h('div', { className: 'type-list' }, list.map((t) => {
        const varName = `baseui-${t.name}`, name = t.name.replace(/^Typography-/, '');
        return h('button', { key: t.name, type: 'button', className: 'type-row', title: `var(--${varName}): ${t.value}`, onClick: () => copy(varName) },
          h('span', { className: 'type-sample', style: { font: `var(--${varName})` } }, name.replace(/-/g, ' ')),
          h('span', { className: 'type-meta' }, h('span', { className: 'type-name' }, name), h('span', { className: copied === varName ? 'type-value type-copied' : 'type-value' }, copied === varName ? 'Copied' : shortValue(t.value))));
      })))),
    h('span', { className: 'sr-only', role: 'status' }, copied && `Copied var(--${copied})`));
}
export const Scale_ = { name: 'Scale', render: () => h(Scale), parameters: { docs: { description: { story: 'Type styles `--baseui-Typography-*` from tokens.css, grouped into headers and text. Clicking a row copies `var(--baseui-…)`.' }, source: { originalSource: '<Typography />' } } } };
export { Scale_ as Scale };
export const __namedExportsOrder = ['Scale'];
