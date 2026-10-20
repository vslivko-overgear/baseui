import { h, cx, createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';
import { glassClass } from '../theme-flags.js';
import { Button } from './Button.js';

const ToastContext = createContext(null);

/** Hook: const { toast, dismiss, update } = useToast(); toast({ message, variant, status, icon, action, duration }) */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast: wrap your app in <ToastProvider>');
  return ctx;
}

function ToastItem({ item, onDismiss, onGone }) {
  const timer = useRef();
  const left = useRef(0);
  const startedAt = useRef(0);
  const run = useCallback(() => {
    clearTimeout(timer.current);
    if (item.leaving || left.current <= 0) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => onDismiss(item.id), left.current);
  }, [item.id, item.leaving, onDismiss]);
  const pause = () => {
    if (!timer.current) return;
    clearTimeout(timer.current); timer.current = 0;
    left.current = Math.max(0, left.current - (Date.now() - startedAt.current));
  };
  useEffect(() => { left.current = item.duration || 0; run(); return () => clearTimeout(timer.current); }, [item.duration, run]);
  // Leaving: the wrapper fades and collapses (transition), then the toast is removed; the timeout is a safety net.
  useEffect(() => {
    if (!item.leaving) return;
    const t = setTimeout(() => onGone(item.id), 700);
    return () => clearTimeout(t);
  }, [item.leaving, item.id, onGone]);

  const { status, icon, action } = item;
  return h('div', {
    className: 'bui-toast-item', 'data-leaving': item.leaving || undefined,
    onTransitionEnd: (e) => { if (item.leaving && e.target === e.currentTarget && e.propertyName === 'grid-template-rows') onGone(item.id); },
  }, h('div', { className: 'bui-toast-item__clip' }, h('div', {
    role: status === 'error' ? 'alert' : 'status', className: cx('bui-toast', `bui-toast--${item.variant}`, glassClass(item.glass)),
    onMouseEnter: pause, onMouseLeave: run, onFocus: pause, onBlur: run,
  },
    (icon || status !== 'neutral') && h('span', { className: 'bui-toast__icon' }, icon || h(Icon, { name: status, size: 24 })),
    h('div', { className: 'bui-toast__text' }, item.message),
    action && h(Button, { variant: 'ghost', size: 'xsm', className: 'bui-toast__action', onClick: () => { action.onClick?.(); onDismiss(item.id); } }, action.label),
    h('button', { type: 'button', className: 'bui-toast__close', 'aria-label': 'Dismiss notification', onClick: () => onDismiss(item.id) },
      h(Icon, { name: 'close', size: 24 })))));
}

export function ToastProvider({ children, placement = 'bottom-right', limit = 4, glass }) {
  const [items, setItems] = useState([]);
  const counter = useRef(0);
  const gone = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const dismiss = useCallback((id) => setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t))), []);
  const toast = useCallback((options) => {
    const id = ++counter.current;
    setItems((list) => [...list, { variant: 'base', status: 'neutral', duration: 5000, glass, ...options, id }]);
    return id;
  }, [limit, glass]);
  const update = useCallback((id, options) => setItems((list) => list.map((t) => (t.id === id ? { ...t, ...options } : t))), []);
  const api = useMemo(() => ({ toast, dismiss, update }), [toast, dismiss, update]);
  return h(ToastContext.Provider, { value: api }, children,
    h('div', { className: cx('bui-toast-region', `bui-toast-region--${placement}`), role: 'region', 'aria-label': 'Notifications' },
      items.filter((t) => !t.leaving).slice(-limit).concat(items.filter((t) => t.leaving)).sort((x, y) => x.id - y.id).map((item) => h(ToastItem, { key: item.id, item, onDismiss: dismiss, onGone: gone }))));
}

describe(ToastProvider, 'Shows brief notifications: a message, an optional action and a close button. Call `useToast()` to add one.', {
  placement: ["'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'", "'bottom-right'", 'Where the stack appears'],
  limit: ['number', '4', 'Maximum simultaneous toasts'],
  glass: ['boolean', 'theme', 'Translucent, blurred base toasts; also a toast() option; true or false overrides the Glass setting of the theme'],
  message: ['ReactNode', null, 'toast() option: the text'],
  variant: ["'base' | 'inverse'", "'base'", 'toast() option: base is a surface with a shadow, inverse is dark (light in a dark theme) without a shadow'],
  status: ["'neutral' | 'success' | 'error' | 'info'", "'neutral'", 'toast() option: the icon; neutral has none. Settings: none, success, error, info, or custom (a custom icon)'],
  icon: ['ReactNode', null, 'toast() option: a custom icon instead of the status one'],
  action: ['{ label: string; onClick?: () => void }', null, 'toast() option: an optional button; it closes the toast'],
  duration: ['number', '5000', 'toast() option: milliseconds before it closes; 0 keeps it open'],
});
