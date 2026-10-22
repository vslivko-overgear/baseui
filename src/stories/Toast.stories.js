import { h, useRef, useEffect } from '../react.js';
import { ToastProvider, useToast } from '../components/Toast.js';
import { Button, Heart } from './_ui.js';
import { meta, playground, Row } from './_helpers.js';

const toastOptions = ({ message, variant, status, action, actionLabel, autoClose }) => ({
  message,
  variant,
  status: status === 'custom' || status === 'none' ? 'neutral' : status,
  icon: status === 'custom' ? h(Heart, { size: 24 }) : undefined,
  action: action ? { label: actionLabel } : undefined,
  duration: autoClose ? 5000 : 0,
});

/** Each click opens one more toast; the open toasts follow the settings live. */
function Demo(args) {
  const { toast, update } = useToast();
  const ids = useRef([]);
  const opts = toastOptions(args);
  useEffect(() => { ids.current.forEach((id) => update(id, opts)); }, [args.message, args.variant, args.status, args.action, args.actionLabel, args.autoClose]);
  return h(Row, null,
    h(Button, { variant: 'secondary', onClick: () => { ids.current.push(toast(opts)); } }, 'Open toast'));
}
export default meta({
  title: 'Components/Toast', component: ToastProvider,
  args: { glass: 'theme', message: 'Changes saved', variant: 'base', status: 'success', action: false, actionLabel: 'Undo', autoClose: false, placement: 'bottom-right', limit: 4 },
  argTypes: { glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    message: { control: 'text' },
    variant: { control: 'inline-radio', options: ['base', 'inverse'] },
    status: { control: 'inline-radio', options: ['none', 'success', 'error', 'info', 'custom'], description: 'Icon: none, a status or a custom one' },
    action: { control: 'boolean', description: 'Optional action button' },
    actionLabel: { control: 'text', if: { arg: 'action', eq: true } },
    autoClose: { control: 'boolean', description: 'Closes itself after 5 seconds' },
    placement: { control: 'inline-radio', options: ['bottom-right', 'bottom-center', 'top-right', 'top-center'] },
    limit: { control: 'number', description: 'Maximum simultaneous toasts' },
  },
});
export const Playground = {
  ...playground({
    source: `// Once, at the app root
<ToastProvider>…</ToastProvider>

// Anywhere below
const { toast } = useToast();
toast({ message: 'Message deleted', status: 'success', action: { label: 'Undo', onClick: restore } });

// A toast that follows a promise: a spinner while it runs, then success or error
const { promise } = useToast();
promise(save(), { loading: 'Saving…', success: 'Saved', error: (e) => e.message });`,
  }),
  render: (args) => h(ToastProvider, { placement: args.placement, limit: args.limit || 1, glass: args.glass }, h(Demo, args)),
};
export const __namedExportsOrder = ['Playground'];
