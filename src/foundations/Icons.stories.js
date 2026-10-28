import { h, useState, useEffect, useMemo, useCallback, useDeferredValue, memo } from '../react.js';
import { TextField } from '../components/TextField.js';
import { ToastProvider, useToast } from '../components/Toast.js';
import { meta } from '../stories/_helpers.js';
import { MIN_STROKE, MAX_STROKE } from '../icon-weight.js';

const SOURCES = { outline: () => import('../../lib/line-HpXc8B8J.js'), filled: () => import('../../lib/solid-BKvSM0yD.js') };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function useIcons(variant) {
  const [icons, setIcons] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    SOURCES[variant]().then((m) => { if (live) setIcons(Object.entries(m).filter(([, v]) => typeof v === 'function')); }).catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [variant]);
  return { icons, failed };
}

const Cell = memo(({ name, Icon, importText, onCopy, strokeWidth, size }) => h('button', { type: 'button', className: 'icon-cell', 'aria-label': name, title: importText, onClick: () => onCopy(name) },
  h(Icon, { size: size || 24, ...(strokeWidth ? { strokeWidth } : {}) }), h('span', { 'aria-hidden': 'true', className: 'icon-name' }, name)));

function Gallery({ variant, strokeWidth, size }) {
  const { toast } = useToast();
  const { icons, failed } = useIcons(variant);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const importText = useCallback((name) => `import { ${name} } from 'baseui-kit/icons/${variant === 'filled' ? 'solid' : 'line'}'`, [variant]);
  const copy = useCallback((name) => {
    const notify = () => toast({ message: 'Copied', variant: 'inverse', status: 'success', duration: 2000 });
    const text = importText(name);
    const fallback = () => {
      const active = document.activeElement, area = document.createElement('textarea');
      area.value = text; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.append(area); area.select();
      const ok = document.execCommand('copy');
      area.remove(); if (active instanceof HTMLElement) active.focus(); if (ok) notify();
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(notify).catch(fallback); else fallback();
  }, [importText, toast]);
  const shown = useMemo(() => { if (!icons) return null; const q = norm(deferred); return q ? icons.filter(([n]) => norm(n).includes(q)) : deferred.trim() ? [] : icons; }, [icons, deferred]);
  if (failed) return h('p', { className: 'icon-status' }, 'Could not load the icons. Refresh the page.');
  if (!icons || !shown) return h('p', { className: 'icon-status' }, 'Loading icons…');
  return h('div', { className: 'icon-gallery' },
    h('div', { className: 'icon-toolbar' },
      h('div', { style: { flex: '1 1 auto' } }, h(TextField, { label: 'Search', floatingLabel: false, size: 'sm', value: query, clearable: true, actionLabel: 'Clear search', onChange: (e) => setQuery(e.target.value) })),
      h('span', { className: 'sr-only', role: 'status' }, `${shown.length} of ${icons.length} icons`)),
    shown.length === 0
      ? h('p', { className: 'icon-status' }, `Nothing found for “${query}”`)
      : h('div', { className: 'icon-grid', style: { opacity: query === deferred ? 1 : 0.6 } }, shown.map(([name, Icon]) => h(Cell, { key: name, name, Icon, importText: importText(name), onCopy: copy, strokeWidth: variant === 'outline' ? strokeWidth : undefined, size }))));
}

export default {
  ...meta({
    title: 'Foundations/Icons', component: Gallery, args: { variant: 'outline', strokeWidth: 2, size: 24 },
    argTypes: {
      variant: { control: 'inline-radio', options: ['outline', 'filled'], description: 'Style: outline icons or filled icons' },
      strokeWidth: { control: { type: 'range', min: MIN_STROKE, max: MAX_STROKE, step: 0.25 }, if: { arg: 'variant', eq: 'outline' }, description: 'Stroke width: outline only' },
      size: { control: { type: 'range', min: 16, max: 64, step: 4 }, description: 'Icon size in px' },
    },
    description: 'A single icon catalog. The style is chosen with `variant`: `outline` (a contour whose stroke width is set with `strokeWidth` from 1 to 2.5, 2 by default) or `filled`. Click an icon to copy its import. The `Icon` component matches the stroke to the text beside it.',
  }),
  tags: ['!autodocs'],
};
export const Playground = { render: (args) => h(ToastProvider, { placement: 'bottom-center', limit: 1 }, h(Gallery, args)), parameters: { docs: { description: { story: 'Switch `variant` (outline or filled), the stroke width `strokeWidth` (outline) and the size `size`.' }, source: { originalSource: '<IconGallery variant="outline" strokeWidth={2} size={24} />' } } } };
export const __namedExportsOrder = ['Playground'];
