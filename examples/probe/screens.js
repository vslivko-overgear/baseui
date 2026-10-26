import { h, cx } from '../../src/react.js';

// The prototypes a study can test. A screen is a list of boxes in percent of the frame, so one definition draws the screen,
// finds what a click hit and places the click map of the results.
export const SCREENS = {
  cart: {
    label: 'Shop · cart', ratio: [16, 10],
    targets: { checkout: 'Checkout button', promo: 'Promo code link', continue: 'Continue shopping' },
    boxes: [
      { k: 'bar', x: 0, y: 0, w: 100, h: 9, label: 'Nook' }, { k: 'link bartext', x: 84, y: 3, w: 12, h: 3.4, label: 'Cart (2)' },
      { k: 'title', x: 6, y: 14, w: 50, h: 6, label: 'Your cart' },
      { k: 'card', x: 6, y: 24, w: 56, h: 17 }, { k: 'img', x: 8, y: 26, w: 12, h: 13 }, { k: 'text', x: 23, y: 27, w: 30, h: 4, label: 'Linen reading chair' }, { k: 'muted', x: 23, y: 33, w: 20, h: 3.5, label: '$289.00 · Qty 1' },
      { k: 'card', x: 6, y: 44, w: 56, h: 17 }, { k: 'img', x: 8, y: 46, w: 12, h: 13 }, { k: 'text', x: 23, y: 47, w: 30, h: 4, label: 'Oak side table' }, { k: 'muted', x: 23, y: 53, w: 20, h: 3.5, label: '$114.00 · Qty 1' },
      { k: 'link', x: 6, y: 65, w: 24, h: 4, label: 'Have a promo code?', target: 'promo' },
      { k: 'card', x: 66, y: 24, w: 28, h: 56 }, { k: 'text', x: 69, y: 27, w: 22, h: 4, label: 'Order summary' },
      { k: 'muted', x: 69, y: 34, w: 22, h: 3.5, label: 'Subtotal      $403.00' }, { k: 'muted', x: 69, y: 40, w: 22, h: 3.5, label: 'Shipping            Free' }, { k: 'text', x: 69, y: 47, w: 22, h: 4, label: 'Total      $403.00' },
      { k: 'btn', x: 69, y: 56, w: 22, h: 9, label: 'Checkout', target: 'checkout' }, { k: 'btn2', x: 69, y: 67, w: 22, h: 8, label: 'Continue shopping', target: 'continue' },
    ],
  },
  pricing: {
    label: 'SaaS · pricing page', ratio: [16, 10],
    targets: { free: 'Free plan', pro: 'Pro plan', team: 'Team plan' },
    boxes: [
      { k: 'bar', x: 0, y: 0, w: 100, h: 9, label: 'Beacon' }, { k: 'link bartext', x: 66, y: 3, w: 30, h: 3.4, label: 'Product   Docs   Pricing   Log in' },
      { k: 'title', x: 18, y: 14, w: 64, h: 8, label: 'Plans that grow with your team', center: true }, { k: 'muted', x: 22, y: 24, w: 56, h: 4, label: 'Start free. Upgrade when you need more seats.', center: true },
      { k: 'card', x: 8, y: 33, w: 26, h: 55 }, { k: 'text', x: 11, y: 36, w: 20, h: 4, label: 'Free' }, { k: 'title', x: 11, y: 43, w: 20, h: 6, label: '$0' }, { k: 'muted', x: 11, y: 52, w: 20, h: 3.5, label: '1 project · 5 responses' }, { k: 'btn2', x: 11, y: 76, w: 20, h: 8, label: 'Get started', target: 'free' },
      { k: 'card hot', x: 37, y: 33, w: 26, h: 55 }, { k: 'chip', x: 40, y: 35, w: 9, h: 3.6, label: 'Popular' }, { k: 'text', x: 40, y: 41, w: 20, h: 4, label: 'Pro' }, { k: 'title', x: 40, y: 47, w: 20, h: 6, label: '$29' }, { k: 'muted', x: 40, y: 56, w: 20, h: 3.5, label: 'Unlimited studies' }, { k: 'btn', x: 40, y: 76, w: 20, h: 8, label: 'Start trial', target: 'pro' },
      { k: 'card', x: 66, y: 33, w: 26, h: 55 }, { k: 'text', x: 69, y: 36, w: 20, h: 4, label: 'Team' }, { k: 'title', x: 69, y: 43, w: 20, h: 6, label: '$99' }, { k: 'muted', x: 69, y: 52, w: 20, h: 3.5, label: 'SSO · roles · audit log' }, { k: 'btn2', x: 69, y: 76, w: 20, h: 8, label: 'Contact sales', target: 'team' },
    ],
  },
  trails: {
    label: 'Mobile · trails app', ratio: [9, 16],
    targets: { search: 'Search field', saved: 'Saved tab', plan: 'Plan a trip', home: 'Home tab' },
    boxes: [
      { k: 'bar', x: 0, y: 0, w: 100, h: 8, label: 'Trails' },
      { k: 'field', x: 6, y: 11, w: 88, h: 7, label: 'Search trails or places', target: 'search' },
      { k: 'img wide', x: 6, y: 21, w: 88, h: 24, label: 'Lake Serene loop' }, { k: 'muted', x: 6, y: 46.5, w: 60, h: 3.4, label: '8.2 km · moderate' },
      { k: 'btn', x: 6, y: 52, w: 88, h: 8, label: 'Plan a trip', target: 'plan' },
      { k: 'img', x: 6, y: 64, w: 42, h: 14 }, { k: 'img', x: 52, y: 64, w: 42, h: 14 },
      { k: 'bar tabs', x: 0, y: 90, w: 100, h: 10 }, { k: 'link', x: 6, y: 93, w: 18, h: 3.4, label: 'Home', target: 'home' }, { k: 'link', x: 30, y: 93, w: 18, h: 3.4, label: 'Saved', target: 'saved' }, { k: 'link', x: 54, y: 93, w: 18, h: 3.4, label: 'Map' }, { k: 'link', x: 78, y: 93, w: 16, h: 3.4, label: 'Me' },
    ],
  },
};

/** What a click at (x, y) hit, in percent of the frame: a target id, or null. */
export function hitOf(screen, x, y) {
  const def = SCREENS[screen];
  const box = [...def.boxes].reverse().find((b) => b.target && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
  return box ? box.target : null;
}
/** A point inside the target, for the generated clicks of the results. */
export function centerOf(screen, target) {
  const b = SCREENS[screen].boxes.find((x) => x.target === target);
  return b ? { x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h } : { x: 50, y: 50, w: 10, h: 10 };
}

/**
 * A prototype frame. With onClick it is a test: every click reports its place and the target it hit.
 * With `clicks` it is a click map: the places people clicked are drawn on top of it.
 */
export function Screen({ screen, onClick, clicks, hide, label }) {
  const def = SCREENS[screen];
  const [rw, rh] = def.ratio;
  const press = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
    onClick({ x, y, target: hitOf(screen, x, y) });
  };
  return h('div', {
    className: cx('pb-screen', onClick && 'pb-screen--live', hide && 'pb-screen--hidden'), 'data-slot': 'screen', 'data-screen': screen, style: { aspectRatio: `${rw} / ${rh}` },
    role: onClick ? 'application' : 'img', 'aria-label': label || def.label, onClick: onClick ? press : undefined,
  },
  def.boxes.map((b, i) => h('div', { key: i, className: cx('pb-box', ...b.k.split(' ').map((c) => `pb-box--${c}`), b.center && 'pb-box--center'), style: { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }, 'data-target': b.target }, b.label)),
  clicks && clicks.map((c, i) => h('i', { key: i, className: cx('pb-dot', c.hit && 'pb-dot--hit'), style: { left: `${c.x}%`, top: `${c.y}%` } })));
}
