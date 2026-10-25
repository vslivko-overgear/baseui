import { h } from '../react.js';
import { OtpInput } from '../components/OtpInput.js';
import { meta, playground, example, Stack } from './_helpers.js';

// The demo code is 123456 (the first digits for 4 and 5 cells); the check takes a second, like a request.
const verify = (length) => (code) => new Promise((resolve) => setTimeout(() => resolve(code === '123456'.slice(0, length)), 1200));

export default meta({
  title: 'Components/OtpInput', component: OtpInput,
  args: { length: 6, grouped: false, mask: false, validationType: 'numeric', captureTyping: false, autoReset: true, motion: 'theme', disabled: false, error: '' },
  argTypes: {
    length: { control: 'inline-radio', options: [4, 5, 6] },
    grouped: { control: 'boolean', description: 'Split the cells into groups with a separator' },
    validationType: { control: 'inline-radio', options: ['numeric', 'alphanumeric', 'alpha'] },
    mask: { control: 'boolean' }, captureTyping: { control: 'boolean' }, autoReset: { control: 'boolean' },
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    disabled: { control: 'boolean' }, error: { control: 'text' },
  },
});
const view = (args) => h(OtpInput, { key: `${args.length}-${args.grouped}`, ...args, error: args.error || undefined, onComplete: verify(args.length), label: 'Verification code' });
export const Playground = {
  ...playground({ source: `<OtpInput length={6} grouped label="Verification code"
  onComplete={async (code) => (await api.verify(code)).ok} />   // false or a rejection: error; anything else: success` }),
  render: view,
};
const fixed = (name, props, description) => example({ name, description, render: () => h(OtpInput, { label: 'Verification code', ...props }), source: `<OtpInput ${Object.entries(props).map(([k, v]) => `${k}=${typeof v === 'string' ? `"${v}"` : `{${JSON.stringify(v)}}`}`).join(' ')} />` });
export const Lengths = example({ name: 'Lengths', description: '4, 5 or 6 cells.', render: () => h(Stack, null, [4, 5, 6].map((n) => h(OtpInput, { key: n, length: n, label: `${n} digits` }))), source: `<OtpInput length={4} />\n<OtpInput length={5} />\n<OtpInput length={6} />` });
export const Grouped = fixed('Groups', { length: 6, grouped: true, defaultValue: '123' }, 'grouped splits the cells with a separator: 2 + 2, 2 + 3 or 3 + 3, depending on the length.');
export const Verifying = fixed('Verifying', { defaultValue: '123456', status: 'verifying' }, 'While onComplete runs the cells pulse as a wave, input is locked and screen readers hear "Verifying your code…".');
export const Failed = fixed('Error', { defaultValue: '123456', status: 'error' }, 'A wrong code: the row shakes (enhanced animations), the cells turn red.');
export const Verified = fixed('Success', { defaultValue: '123456', status: 'success' });
export const Masked = fixed('Masked', { defaultValue: '1234', length: 4, mask: true });
export const __namedExportsOrder = ['Playground', 'Lengths', 'Grouped', 'Verifying', 'Failed', 'Verified', 'Masked'];
