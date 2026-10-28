import { h } from '../../react.js';
import { SocialButton } from '../molecules/SocialButton.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';

const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'];
export default meta({
  title: 'Overgear/Molecules/SocialButton', component: SocialButton, args: { platform: 'youtube', href: 'https://example.com/overgear', size: 'md' },
  argTypes: { platform: { control: 'select', options: PLATFORMS }, href: { control: 'text' }, size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] } },
});
export const Playground = { ...playground({ source: `<SocialButton platform="youtube" href="https://example.com/overgear" />` }), render: (args) => h(SocialButton, args) };
export const Platforms = example({
  name: 'Platforms', render: () => h(Row, null, PLATFORMS.map((p) => h(SocialButton, { key: p, platform: p, href: 'https://example.com/overgear' }))),
  source: `<SocialButton platform="facebook" href={url} />
<SocialButton platform="x" href={url} />`,
});
export const Sizes = example({
  name: 'Sizes', render: () => h(Row, null, ['xsm', 'sm', 'md', 'lg'].map((s) => h(SocialButton, { key: s, platform: 'instagram', size: s, href: 'https://example.com/overgear' }))),
  source: `<SocialButton platform="instagram" size="lg" href={url} />`,
});
export const Disabled = example({
  name: 'Disabled', render: () => h(Row, null, PLATFORMS.map((p) => h(SocialButton, { key: p, platform: p, disabled: true, href: 'https://example.com/overgear' }))),
  source: `<SocialButton platform="tiktok" href={url} disabled />`,
});
export const __namedExportsOrder = ['Playground', 'Platforms', 'Sizes', 'Disabled'];
