// The theme of Overgear (the showcase and the example share it, in one cookie): the global settings of the system (...)
// and the local settings of the elements Overgear shapes itself. A local setting that is switched off hands the element back to the theme.
import { applyTheme, loadTheme, saveTheme } from '../site/theme.js';
import { CATALOGUE_FONTS } from './fonts/catalogue/catalogue.js';

export const COOKIE = 'baseui-overgear-theme';
/** The elements with settings of their own (on by default): the bottom bar (floating and glass), the dropdowns (glass) and the header (a blurred gradient under it). */
export const LOCAL_DEFAULT = { bottombar: true, dropdowns: true, header: true };
/** The five steps of the blue cast of the dark theme: the share of the chroma of its grays that stays. The last one is the full cast of Overgear. */
export const TINT_STEPS = [0, 0.25, 0.5, 0.75, 1];
export const TINT_DEFAULT = TINT_STEPS.length - 1;
/**
 * The sans-serif fonts of the catalogue uncut.wtf (a free typeface catalogue) that are served from a CDN under an open license (SIL OFL 1.1): the fonts of Fontsource, linked from jsdelivr,
 * loaded when chosen and not before. Only fonts with a bold are listed (Hedvig Letters Sans has a regular only). [key (the id at Fontsource), name, weights]. The others of the catalogue that we may ship and that have a bold are in this repository (overgear/fonts/catalogue,
 * CATALOGUE_FONTS); the rest of its sans-serif fonts are not here: see overgear/fonts/catalogue/README.md.
 */
export const UNCUT_FONTS = [
  ['geist', 'Geist', [400, 500, 600, 700]], ['instrument-sans', 'Instrument Sans', [400, 500, 600, 700]], ['pretendard', 'Pretendard', [400, 500, 600, 700]],
  ['uncut-sans', 'Uncut Sans', [400, 500, 600, 700]], ['inclusive-sans', 'Inclusive Sans', [400, 500, 600, 700]], ['tasa-orbiter', 'TASA Orbiter', [400, 500, 600, 700]],
  ['hauora-sans', 'Hauora Sans', [400, 500, 600, 700]], ['kulim-park', 'Kulim Park', [400, 600, 700]], ['zen-kaku-gothic-new', 'Zen Kaku Gothic New', [400, 500, 700]],
];
/**
 * The fonts of the Theme page, in the order of its list: TT Interphases Pro, the font of the live site (linked from the overgear repository; Inter stands in until it loads) comes first,
 * the others follow in alphabetical order: Apfel Grotezk (bundled, the font of this showcase), the fonts of the catalogue from the CDN and those of this repository. The key of the live
 * site's font is `site` (it was the name of its set). [key, name]
 */
const byName = ([, a], [, b]) => a.localeCompare(b, 'en', { sensitivity: 'base' });
export const FONTS = [['site', 'TT Interphases Pro'], ...[['apfel', 'Apfel Grotezk'], ...UNCUT_FONTS.map(([key, name]) => [key, name]), ...CATALOGUE_FONTS].sort(byName)];
export const FONTS_DEFAULT = 'apfel';
const fontOf = (t) => (FONTS.some(([key]) => key === t.fonts) ? t.fonts : FONTS_DEFAULT);
const stylesheet = (id, href) => {
  if (document.querySelector(`link[data-font="${id}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.dataset.font = id; link.href = href;
  document.head.append(link);
};

/** The theme as the page applies it: it has no floating and no glass of its own; the glass of the dropdown menus is written when their local setting asks for it. */
export function resolveTheme(t) {
  const local = { ...LOCAL_DEFAULT, ...t.local };
  // there is no floating and no glass in the theme: only the elements with settings of their own have them (the bottom bar, the menus of dropdowns)
  return { ...t, floating: false, glass: local.dropdowns ? 'dropdowns' : false };
}

/** Writes the settings on <html>; `data-og-bottombar` tells the bottom bar whether it keeps its own floating and glass, `data-og-header` whether the header has its own blur. */
export function applyOvergearTheme(t) {
  applyTheme(resolveTheme(t));
  const fonts = fontOf(t);
  document.documentElement.dataset.ogFonts = fonts;
  if (fonts === 'site') stylesheet('Inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  // a font of the catalogue: the name for overgear.css to put in the font variables; one from the CDN also gets its weights from Fontsource (the others are in catalogue.css, fetched when used)
  const uncut = UNCUT_FONTS.find(([key]) => key === fonts);
  if (uncut) for (const weight of uncut[2]) stylesheet(`${uncut[0]}-${weight}`, `https://cdn.jsdelivr.net/npm/@fontsource/${uncut[0]}@5/${weight}.css`);
  const named = FONTS.find(([key]) => key === fonts);
  if (fonts !== 'site' && fonts !== FONTS_DEFAULT && named) document.documentElement.style.setProperty('--og-font', `"${named[1]}"`);
  else document.documentElement.style.removeProperty('--og-font');
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
