import { h } from '../../react.js';
import { WarningBanner } from '../organisms/WarningBanner.js';
import { meta, playground, example, Stack } from '../../stories/_helpers.js';

export default meta({
  title: 'Overgear/Organisms/WarningBanner', component: WarningBanner,
  args: { variant: 'error', message: 'Your payment method was declined. Update it to keep your orders active.', mobileMessage: 'Payment declined', actionText: 'Update payment method', mobileActionText: 'Update' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['error', 'warning'] },
    message: { control: 'text' }, mobileMessage: { control: 'text' }, actionText: { control: 'text' }, mobileActionText: { control: 'text' },
  },
});
export const Playground = { ...playground({ source: `<WarningBanner message="Your payment method was declined." actionText="Update" onAction={fix} />` }), render: (args) => h(WarningBanner, args) };
export const Variants = example({
  name: 'Variants', render: () => h(Stack, null,
    h(WarningBanner, { variant: 'error', message: 'We could not verify your email address.', actionText: 'Resend email' }),
    h(WarningBanner, { variant: 'warning', message: 'Scheduled maintenance tonight from 02:00 to 03:00 UTC.', actionText: 'Learn more' })),
  source: `<WarningBanner variant="error" message="…" actionText="Resend email" />
<WarningBanner variant="warning" message="…" actionText="Learn more" />`,
});
export const MobileTexts = example({
  name: 'Mobile Texts', description: 'In a narrow container (under 640px) the mobile message and action replace the desktop ones.',
  render: () => h(Stack, { width: 360 },
    h(WarningBanner, { message: 'Your payment method was declined. Update it to keep your orders active.', mobileMessage: 'Payment declined', actionText: 'Update payment method', mobileActionText: 'Update' })),
  source: `<WarningBanner message="Your payment method was declined…" mobileMessage="Payment declined" actionText="Update payment method" mobileActionText="Update" />`,
});
export const AsLink = example({
  name: 'Action As Link', render: () => h(WarningBanner, { variant: 'warning', message: 'Complete your profile to unlock withdrawals.', actionText: 'Open profile', actionHref: '#profile' }),
  source: `<WarningBanner message="…" actionText="Open profile" actionHref="/profile" />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'MobileTexts', 'AsLink'];
