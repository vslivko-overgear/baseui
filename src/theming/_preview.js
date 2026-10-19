import { h } from '../react.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Slider } from '../components/Slider.js';

/** A progress bar and a slider: both take the brand color. */
export const Progress = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)', maxWidth: 360 } },
  h(ProgressBar, { value: 60, label: 'Uploading', showValue: true }),
  h(Slider, { defaultValue: 40, label: 'Volume', showValue: true }));

import { Navbar, BottomBar } from '../components/MobileNavigation.js';
import { ClickableCard } from '../components/Card.js';
import { Home01, SearchLg, User01, Heart, Share01 } from '../stories/_ui.js';

/** A screen with a navbar and a bottom bar over colorful content: shows floating, glass and animations. */
export const PhoneDemo = () => {
  const items = [{ value: 'home', label: 'Home', icon: h(Home01) }, { value: 'search', label: 'Search', icon: h(SearchLg) }, { value: 'saved', label: 'Saved', icon: h(Heart), badge: 2 }, { value: 'me', label: 'Profile', icon: h(User01) }];
  return h('div', { style: { position: 'relative', width: 375, maxWidth: '100%', height: 360, overflow: 'hidden', borderRadius: 'var(--baseui-radius-24)', background: 'linear-gradient(135deg, var(--baseui-Accent-Colors-Blue-Light), var(--baseui-Accent-Colors-Pink) 55%, var(--baseui-Accent-Colors-Orange))' } },
    h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 } }, h(Navbar, { title: 'Project Atlas', subtitle: 'Updated today', actions: [{ icon: h(Share01, { size: 24 }), label: 'Share' }] })),
    h('div', { style: { position: 'absolute', inset: '72px 16px 80px', display: 'flex', flexDirection: 'column', gap: 12 } },
      h(ClickableCard, { label: 'Open', onClick: () => {} }, 'Hover or press this card'),
      h(ClickableCard, { label: 'Open too', onClick: () => {} }, 'And this one')),
    h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0 } }, h(BottomBar, { items })));
};
