import { h } from '../../react.js';
import { describe } from '../../doc.js';
import { IconButton } from '../../components/Button.js';

const svg = (...children) => h('svg', { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'currentColor', 'aria-hidden': 'true', focusable: 'false' }, ...children);
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Simplified monochrome glyphs (not the official brand art).
export const SOCIAL_PLATFORMS = {
  facebook: { label: 'Facebook', icon: () => svg(h('path', { d: 'M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8V13.5h2.5V21h3Z' })) },
  instagram: { label: 'Instagram', icon: () => svg(h('rect', { x: 4, y: 4, width: 16, height: 16, rx: 4.5, ...stroke }), h('circle', { cx: 12, cy: 12, r: 3.6, ...stroke }), h('circle', { cx: 17, cy: 7, r: 1.1 })) },
  tiktok: { label: 'TikTok', icon: () => svg(h('path', { d: 'M14.5 4v10.2a3.2 3.2 0 1 1-3.2-3.2M14.5 4c.3 2.3 1.8 3.8 4 4', ...stroke })) },
  youtube: { label: 'YouTube', icon: () => svg(h('rect', { x: 3, y: 6, width: 18, height: 12, rx: 4, ...stroke }), h('path', { d: 'm10.5 9.5 4 2.5-4 2.5v-5Z' })) },
  x: { label: 'X (Twitter)', icon: () => svg(h('path', { d: 'M5 5l14 14M19 5 5 19', ...stroke })) },
};

export function SocialButton({ platform, href, size = 'md', ...rest }) {
  const { label, icon } = SOCIAL_PLATFORMS[platform];
  return h(IconButton, { 'data-platform': platform, label, icon: icon(), href, target: '_blank', rel: 'noopener noreferrer', variant: 'secondary', size, ...rest });
}
describe(SocialButton, 'A square icon link to a social network profile. It opens in a new tab.', {
  platform: ["'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'x'", null, 'Network; sets the icon and the accessible name'],
  href: ['string', null, 'Profile URL'],
  size: ["'xsm' | 'sm' | 'md' | 'lg'", "'md'", 'Button size (same as IconButton)'],
});
