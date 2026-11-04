import { ProgressBar } from '../components/ProgressBar.jsx';
import { Slider } from '../components/Slider.jsx';

/** A progress bar and a slider: both take the brand color. */
export const Progress = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-4)', maxWidth: 360 }}>
    <ProgressBar value={60} label="Uploading" showValue />
    <Slider defaultValue={40} label="Volume" showValue />
  </div>
);

import { Navbar, BottomBar } from '../components/MobileNavigation.jsx';
import { ClickableCard } from '../components/Card.jsx';
import { Home01, SearchLg, User01, Heart, Share01 } from '../stories/_ui.jsx';

/** A screen with a navbar and a bottom bar over colorful content: shows floating, glass and animations. */
export const PhoneDemo = () => {
  const items = [
    { value: 'home', label: 'Home', icon: <Home01 /> },
    { value: 'search', label: 'Search', icon: <SearchLg /> },
    { value: 'saved', label: 'Saved', icon: <Heart />, badge: 2 },
    { value: 'me', label: 'Profile', icon: <User01 /> },
  ];
  return (
    <div
      style={{
        position: 'relative',
        width: 375,
        maxWidth: '100%',
        height: 360,
        overflow: 'hidden',
        borderRadius: 'var(--bui-radius-3xl)',
        background: 'linear-gradient(135deg, var(--bui-extensions-background-light-accent), var(--bui-extensions-background-light-critical) 55%, var(--bui-extensions-background-light-warning))',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
        <Navbar title="Project Atlas" subtitle="Updated today" actions={[{ icon: <Share01 size={24} />, label: 'Share' }]} />
      </div>
      <div style={{ position: 'absolute', inset: '72px 16px 80px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ClickableCard label="Open" onClick={() => {}}>
          Hover or press this card
        </ClickableCard>
        <ClickableCard label="Open too" onClick={() => {}}>
          And this one
        </ClickableCard>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BottomBar items={items} />
      </div>
    </div>
  );
};
