// The theme of the documentation site: presets, brand color, shape, radius and fonts. It is applied to <html> at once
// and kept in a cookie, so the choice survives reloads on this device.

const BRANDS = {
  default: null,
  blue: 'var(--baseui-Accent-Colors-Blue)', green: 'var(--baseui-Accent-Colors-Green)', pink: 'var(--baseui-Accent-Colors-Pink)', orange: 'var(--baseui-Accent-Colors-Orange)',
  red: 'var(--baseui-Accent-Colors-Red)', 'blue-light': 'var(--baseui-Accent-Colors-Blue-Light)', 'green-light': 'var(--baseui-Accent-Colors-Green-Light)',
};
export const BRAND_OPTIONS = [...Object.keys(BRANDS), 'custom'];

// name → [family, weights]; every family has Cyrillic.
export const HEADLINE_FONTS = {
  Geist: null, Unbounded: '400;600;700', 'Montserrat Alternates': '400;600;700', 'Playfair Display': '400;600;700', Comfortaa: '400;600;700', Oswald: '400;600;700', 'Russo One': '',
};
export const TEXT_FONTS = {
  Geist: null, Inter: '400;600;700', Manrope: '400;600;700', Roboto: '400;500;700', 'Open Sans': '400;600;700', 'PT Sans': '400;700', Nunito: '400;600;700', 'Golos Text': '400;600;700', Onest: '400;600;700', 'IBM Plex Sans': '400;600;700',
};

export const DEFAULT = { preset: 'default', brand: 'default', brandColor: '#564fff', shape: 'rounded', radius: 12, headingFont: 'Geist', textFont: 'Geist', motion: 'basic', floating: false, glass: false };
export const PRESETS = {
  default: { ...DEFAULT },
  ocean: { brand: 'blue', shape: 'rounded', radius: 16, headingFont: 'Montserrat Alternates', textFont: 'Inter', motion: 'enhanced', floating: false, glass: true },
  forest: { brand: 'green', shape: 'rounded', radius: 8, headingFont: 'Playfair Display', textFont: 'Manrope', motion: 'basic', floating: false, glass: false },
  sunset: { brand: 'orange', shape: 'circle', radius: 12, headingFont: 'Unbounded', textFont: 'Golos Text', motion: 'enhanced', floating: true, glass: false },
  berry: { brand: 'pink', shape: 'circle', radius: 20, headingFont: 'Comfortaa', textFont: 'Nunito', motion: 'enhanced', floating: true, glass: true },
  graphite: { brand: 'default', shape: 'rounded', radius: 4, headingFont: 'Oswald', textFont: 'IBM Plex Sans', motion: 'basic', floating: false, glass: false },
};
delete PRESETS.default.preset;
export const MOTION_OPTIONS = ['off', 'basic', 'enhanced'];
export const PRESET_OPTIONS = [...Object.keys(PRESETS), 'custom'];

const COOKIE = 'baseui-theme';
export function loadTheme() {
  try {
    const m = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
    return { ...DEFAULT, ...(m ? JSON.parse(decodeURIComponent(m.slice(COOKIE.length + 1))) : {}) };
  } catch { return { ...DEFAULT }; }
}
export function saveTheme(theme) {
  try { document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(theme))}; max-age=31536000; path=/; SameSite=Lax`; } catch { /* cookies unavailable */ }
}

const RADII = [4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32];
const GEIST = 'var(--font-geist,"Geist"), system-ui, -apple-system, "Segoe UI", sans-serif';
const loadFont = (name, weights) => {
  if (weights == null || document.querySelector(`link[data-font="${name}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.dataset.font = name;
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}${weights ? `:wght@${weights}` : ''}&display=swap`;
  document.head.append(link);
};
const family = (name, weights) => (weights == null ? GEIST : `"${name}", system-ui, -apple-system, "Segoe UI", sans-serif`);

// White or near-black text, whichever reads better on the brand color: it becomes Extensions-Text-and-Icon-OnBrand.
function onColor(css) {
  const probe = document.createElement('span');
  probe.style.color = css; document.body.append(probe);
  const [r, g, b] = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
  probe.remove();
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.4 ? '#0c0d17' : '#ffffff';
}

export function applyTheme(t) {
  const root = document.documentElement;
  const set = (k, v) => (v == null ? root.style.removeProperty(k) : root.style.setProperty(k, v));
  const brand = t.brand === 'custom' ? t.brandColor : BRANDS[t.brand];
  set('--baseui-Background-Brand', brand);
  set('--baseui-Background-Brand-Hover', brand && `color-mix(in srgb, ${brand} 88%, black)`);
  set('--baseui-Extensions-Text-and-Icon-OnBrand', brand && onColor(brand));
  root.dataset.shape = t.shape;
  const k = t.radius / DEFAULT.radius;
  // the radius tokens follow --baseui-radius-scale in CSS; a browser without round() gets every value set here
  const scaled = CSS.supports('width', 'round(1px, 1px)');
  set('--baseui-radius-scale', k === 1 ? null : String(k));
  for (const n of RADII) set(`--baseui-radius-${n}`, scaled || k === 1 ? null : `${Math.round(n * k * 2) / 2}px`);
  const head = HEADLINE_FONTS[t.headingFont], text = TEXT_FONTS[t.textFont];
  loadFont(t.headingFont, head); loadFont(t.textFont, text);
  set('--baseui-Typography-Headline-Font-Family', family(t.headingFont, head));
  set('--baseui-Typography-Font-Family', family(t.textFont, text));
  root.dataset.motion = t.motion; root.dataset.floating = t.floating ? 'on' : 'off'; root.dataset.glass = t.glass ? 'on' : 'off';
}

/** Applies the stored theme now and again when the light/dark theme changes (the brand text color depends on it). */
export function startTheme() {
  const run = () => applyTheme(loadTheme());
  run();
  new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
