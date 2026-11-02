// The font setting of the Theme page: the list of fonts, and what choosing one does to the page.
import { beforeEach, describe, expect, test } from 'vitest';
import { FONTS, FONTS_DEFAULT, UNCUT_FONTS, applyOvergearTheme } from '../theme.js';
import { DEFAULT } from '../../site/theme.js';

const html = document.documentElement;
const links = () => [...document.head.querySelectorAll('link[data-font]')].map((l) => l.dataset.font);

describe('fonts', () => {
  beforeEach(() => {
    delete html.dataset.ogFonts;
    html.style.removeProperty('--og-font');
    document.head.querySelectorAll('link[data-font]').forEach((l) => l.remove());
  });

  test('TT Interphases Pro comes first, then Apfel Grotezk, then the fonts of the catalogue', () => {
    expect(FONTS[0]).toEqual(['site', 'TT Interphases Pro']);
    expect(FONTS[1]).toEqual(['apfel', 'Apfel Grotezk']);
    expect(FONTS.slice(2).map(([key]) => key)).toEqual(UNCUT_FONTS.map(([key]) => key));
    expect(FONTS_DEFAULT).toBe('apfel');
  });

  test('the keys and the names are different, and every font of the catalogue has weights to load', () => {
    expect(new Set(FONTS.map(([key]) => key)).size).toBe(FONTS.length);
    expect(new Set(FONTS.map(([, name]) => name)).size).toBe(FONTS.length);
    for (const [key, , weights] of UNCUT_FONTS) {
      expect(weights.length, key).toBeGreaterThan(0);
      expect(weights, key).toContain(400);
    }
  });

  test('choosing a font of the catalogue names it in --og-font and links its weights, once', () => {
    applyOvergearTheme({ ...DEFAULT, fonts: 'geist' });
    applyOvergearTheme({ ...DEFAULT, fonts: 'geist' });
    expect(html.dataset.ogFonts).toBe('geist');
    expect(html.style.getPropertyValue('--og-font')).toBe('"Geist"');
    expect(links()).toEqual(['geist-400', 'geist-500', 'geist-600', 'geist-700']);
    expect(document.head.querySelector('link[data-font="geist-400"]').href).toBe('https://cdn.jsdelivr.net/npm/@fontsource/geist@5/400.css');
  });

  test('TT Interphases Pro and Apfel Grotezk load nothing of the catalogue, and an unknown font is the default', () => {
    applyOvergearTheme({ ...DEFAULT, fonts: 'site' });
    expect(html.dataset.ogFonts).toBe('site');
    expect(html.style.getPropertyValue('--og-font')).toBe('');
    expect(links()).toEqual(['Inter']);
    applyOvergearTheme({ ...DEFAULT, fonts: 'nonsense' });
    expect(html.dataset.ogFonts).toBe('apfel');
  });
});
