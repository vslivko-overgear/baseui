// The theme of Overgear (the showcase and the example share it, in one cookie): the global settings of the system (floating, glass, ...)
// and the local settings of the elements Overgear shapes itself. A local setting that is switched off hands the element back to the theme.
import { applyTheme, loadTheme, saveTheme } from '../site/theme.js';

export const COOKIE = 'baseui-overgear-theme';
/** The elements with settings of their own (on by default): the bottom bar (floating and glass), the dropdowns (glass) and the header (a blurred gradient under it). */
export const LOCAL_DEFAULT = { bottombar: true, dropdowns: true, header: true };
/** The five steps of the blue cast of the dark theme: the share of the chroma of its grays that stays. The last one is the full cast of Overgear. */
export const TINT_STEPS = [0, 0.25, 0.5, 0.75, 1];
export const TINT_DEFAULT = TINT_STEPS.length - 1;
/** The font sets: the one of Overgear (Apfel Grotezk, bundled) and the one of the live site (TT Interphases Pro, linked from the overgear repository; Inter stands in until it loads). */
export const FONT_SETS = [['apfel', 'Apfel Grotezk'], ['site', 'Overgear.com']];
export const FONTS_DEFAULT = 'apfel';

/** The theme as the page applies it: the glass of the dropdown menus alone is written when only their local setting asks for it. */
export function resolveTheme(t) {
  const local = { ...LOCAL_DEFAULT, ...t.local };
  const glass = t.glass === true;
  return { ...t, floating: t.floating === true, glass: glass ? true : local.dropdowns ? 'dropdowns' : false };
}

/** Writes the settings on <html>; `data-og-bottombar` tells the bottom bar whether it keeps its own floating and glass, `data-og-header` whether the header has its own blur. */
export function applyOvergearTheme(t) {
  applyTheme(resolveTheme(t));
  const fonts = t.fonts === 'site' ? 'site' : FONTS_DEFAULT;
  document.documentElement.dataset.ogFonts = fonts;
  if (fonts === 'site' && !document.querySelector('link[data-font="Inter"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.dataset.font = 'Inter';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.append(link);
  }
  document.documentElement.style.setProperty('--og-tint', String(TINT_STEPS[t.tint ?? TINT_DEFAULT] ?? 1));
  const local = { ...LOCAL_DEFAULT, ...t.local };
  document.documentElement.dataset.ogBottombar = local.bottombar ? 'own' : 'theme';
  document.documentElement.dataset.ogHeader = local.header ? 'own' : 'theme';
}

/** Applies the stored theme now and again when the light/dark theme changes (the brand text color depends on it). */
export function startOvergearTheme() {
  // Enhanced animations are the default of Overgear: set once for a browser (so a stored basic setting is lifted), then the Theme page is free to change it
  try {
    if (!localStorage.getItem('baseui-overgear-motion-default')) {
      saveTheme({ ...loadTheme(COOKIE), motion: 'enhanced' }, COOKIE);
      localStorage.setItem('baseui-overgear-motion-default', '1');
    }
  } catch { /* a browser without storage keeps what it has */ }
  const run = () => applyOvergearTheme(loadTheme(COOKIE));
  run();
  new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
