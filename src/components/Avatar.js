import { h, cx, createContext, useContext, useState, useEffect, Fragment } from '../react.js';
import { Tooltip } from './Tooltip.js';
import { describe } from '../doc.js';

const PX = { xsm: 20, sm: 24, md: 36, lg: 48, xl: 128 };
export const resolveSize = (size = 'md') => (typeof size === 'number' ? size : PX[size]);
// Rounded corners follow the size, like the other controls: about 30% of the side.
const rounded = (px) => `var(--baseui-radius-${px <= 20 ? 6 : px <= 24 ? 8 : px <= 32 ? 10 : px <= 40 ? 12 : px <= 56 ? 16 : px <= 72 ? 20 : 28})`;
const radiusOf = (shape, px) => (shape === 'circle' ? '9999px' : shape === 'rounded' ? rounded(px) : '0');

export const AvatarGroupContext = createContext(null);
const AvatarSizeContext = createContext(null);
export const useAvatarSize = () => useContext(AvatarSizeContext);

const initialsOf = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function Person() {
  return h('svg', { viewBox: '0 0 24 24', width: '60%', height: '60%', fill: 'currentColor', 'aria-hidden': 'true' },
    h('path', { d: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z' }));
}

export function Avatar({ name, src, fallbackSrc, alt, size = 'md', shape = 'circle', status, tooltip = true, href, target, rel, onClick, className, style, ...rest }) {
  const group = useContext(AvatarGroupContext);
  const px = resolveSize(group ? group.size : size);
  const shp = group ? group.shape : shape;
  const sources = [src, fallbackSrc].filter(Boolean);
  const [failed, setFailed] = useState(0);
  useEffect(() => setFailed(0), [src, fallbackSrc]);
  const image = sources[failed];
  const label = alt || name;

  const content = h(Fragment, null,
    image
      ? h('img', { 'data-slot': 'avatar-img', className: 'bui-avatar__img', src: image, alt: '', onError: () => setFailed((n) => n + 1) })
      : name ? h('span', { 'data-slot': 'avatar-initials', className: 'bui-avatar__initials', style: { fontSize: Math.max(10, Math.round(px * 0.4)) } }, initialsOf(name)) : h(Person),
    status && h('span', { 'data-slot': 'avatar-status', className: 'bui-avatar__status' }, status));

  const interactive = href || onClick;
  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const props = {
    'data-slot': 'avatar', 'data-size': typeof size === 'number' ? 'custom' : size, 'data-shape': shape, className: cx('bui-avatar', interactive && 'bui-avatar--interactive', className),
    style: { width: px, height: px, borderRadius: radiusOf(shp, px), ...(group && { marginInlineStart: -group.overlap }), ...style },
    ...(href ? { href, target, rel } : onClick ? { type: 'button', onClick } : label ? { role: 'img' } : { 'aria-hidden': 'true' }),
    ...(label && interactive && { 'aria-label': label }),
    ...(label && !interactive && { 'aria-label': label }),
    ...rest,
  };
  const node = h(AvatarSizeContext.Provider, { value: px }, h(Tag, props, content));
  const tip = tooltip === true ? name : tooltip || undefined;
  return tip ? h(Tooltip, { content: tip }, node) : node;
}
describe(Avatar, 'A person or entity shown as an image, initials or a placeholder.', {
  name: ['string', null, 'Source of the initials and the default alt text'],
  src: ['string', null, 'Image URL'],
  fallbackSrc: ['string', null, 'Used when `src` fails; if it fails too, initials are shown'],
  alt: ['string', null, 'Accessible name; defaults to `name`'],
  size: ["'xsm' | 'sm' | 'md' | 'lg' | 'xl' | number", "'md'", 'Size: 20 / 24 / 36 / 48 / 128 px, or a number in px'],
  shape: ["'circle' | 'rounded' | 'square'", "'circle'", 'Corner shape'],
  status: ['ReactNode', null, 'Corner content, usually an `AvatarStatusDot`'],
  tooltip: ['string | boolean', 'true', 'Hover text; `true` uses the name, `false` hides it'],
  href: ['string', null, 'Renders a link'],
  onClick: ['(event) => void', null, 'Renders a button when there is no `href`'],
});

export function AvatarGroup({ children, size = 'md', shape = 'circle', className, ...rest }) {
  const px = resolveSize(size);
  const overlap = Math.round(px * 0.25);
  return h(AvatarGroupContext.Provider, { value: { size, shape, overlap, px } },
    h('div', { role: 'group', 'data-slot': 'avatar-group', className: cx('bui-avatar-group', className), style: { paddingInlineStart: overlap }, ...rest }, children));
}
describe(AvatarGroup, 'A row of overlapping avatars.', {
  children: ['ReactNode', null, 'Avatars, optionally followed by one `AvatarGroupOverflow`'],
  size: ["'xsm' | 'sm' | 'md' | 'lg' | 'xl' | number", "'md'", 'Applied to every avatar'],
  shape: ["'circle' | 'rounded' | 'square'", "'circle'", 'Applied to every avatar'],
});

export function AvatarGroupOverflow({ count, onClick, children, className, style, ...rest }) {
  const group = useContext(AvatarGroupContext) || { size: 'md', shape: 'circle', overlap: 0, px: 36 };
  const n = Math.max(0, count);
  const Tag = onClick ? 'button' : 'span';
  return h(Tag, {
    className: cx('bui-avatar-overflow', onClick && 'bui-avatar--interactive', className),
    style: { height: group.px, minWidth: group.px, borderRadius: radiusOf(group.shape, group.px), fontSize: Math.max(12, Math.round(group.px * 0.35)), marginInlineStart: -group.overlap, ...style },
    'aria-label': `${n} more`, ...(onClick && { type: 'button', onClick }), ...rest,
  }, children ?? `+${n}`);
}
describe(AvatarGroupOverflow, 'The “+N” indicator at the end of an Avatar Group.', {
  count: ['number', null, 'Hidden avatars: total minus visible'],
  onClick: ['() => void', null, 'Makes the indicator a button'],
  children: ['ReactNode', null, 'Replaces the default “+N”'],
});

const DOT = { small: { size: 10, border: 1 }, medium: { size: 20, border: 2 }, large: { size: 32, border: 4 } };
export function AvatarStatusDot({ variant = 'success', label, icon, className, style, ...rest }) {
  const parent = useAvatarSize();
  const tier = parent == null ? 'small' : parent <= 36 ? 'small' : parent <= 72 ? 'medium' : 'large';
  const { size, border } = DOT[tier];
  return h('span', {
    'data-slot': 'avatar-dot', className: cx('bui-avatar-dot', `bui-avatar-dot--${variant}`, className),
    role: parent == null ? 'img' : undefined, 'aria-label': parent == null ? label : undefined, title: label,
    style: { width: size, height: size, boxShadow: `0 0 0 ${border}px var(--baseui-Background-Primary)`, ...style }, ...rest,
  }, icon && tier !== 'small' ? h('span', { 'data-slot': 'avatar-dot-icon', className: 'bui-avatar-dot__icon', 'aria-hidden': 'true' }, icon) : variant === 'error' && tier !== 'small' ? h('span', { 'data-slot': 'avatar-dot-bar', className: 'bui-avatar-dot__bar', 'aria-hidden': 'true' }) : null);
}
describe(AvatarStatusDot, 'A presence indicator on an avatar.', {
  variant: ["'success' | 'neutral' | 'error'", "'success'", 'Online, away, busy'],
  label: ['string', null, 'Accessible label, e.g. “Online”'],
  icon: ['ReactNode', null, 'Replaces the built-in glyph; hidden at the smallest size'],
});
