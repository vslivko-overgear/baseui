// The font setting of the Theme page: the list of fonts, and what choosing one does to the page.
import { existsSync, readFileSync } from 'node:fs';
import { beforeEach, describe, expect, test } from 'vitest';
import { FONTS, FONTS_DEFAULT, UNCUT_FONTS, applyOvergearTheme } from '../theme.js';
import { CATALOGUE_FONTS } from '../fonts/catalogue/catalogue.js';
import { DEFAULT } from '../../site/theme.js';

const html = document.documentElement;
const links = () => [...document.head.querySelectorAll('link[data-font]')].map((l) => l.dataset.font);

describe('fonts', () => {
  beforeEach(() => {
    delete html.dataset.ogFonts;
    html.style.removeProperty('--og-font');
    document.head.querySelectorAll('link[data-font]').forEach((l) => l.remove());
  });

  test('TT Interphases Pro comes first and all the others follow in alphabetical order', () => {
    expect(FONTS[0]).toEqual(['site', 'TT Interphases Pro']);
    const names = FONTS.slice(1).map(([, name]) => name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
    expect(names).toContain('Apfel Grotezk');
    expect(FONTS_DEFAULT).toBe('apfel');
  });

  test('the list is Apfel Grotezk, the fonts from the CDN and the fonts of this repository, each once', () => {
    expect(FONTS).toHaveLength(1 + 1 + UNCUT_FONTS.length + CATALOGUE_FONTS.length);
    expect(new Set(FONTS.map(([key]) => key)).size).toBe(FONTS.length);
    expect(new Set(FONTS.map(([, name]) => name)).size).toBe(FONTS.length);
    for (const [key, , weights] of UNCUT_FONTS) expect(weights, key).toContain(400);
  });

  describe('the fonts of this repository (overgear/fonts/catalogue)', () => {
    const css = readFileSync('overgear/fonts/catalogue/catalogue.css', 'utf8');
    test.each(CATALOGUE_FONTS)('%s has a face for its name, its files and a license of the SIL Open Font License', (slug, name) => {
      expect(css, `${name} has no @font-face`).toContain(`font-family: "${name}"`);
      const files = [...css.matchAll(new RegExp(`url\\("(${slug}/[^"]+)"\\)`, 'g'))].map((m) => m[1]);
      expect(files.length, `${name} has no files`).toBeGreaterThan(0);
      for (const file of files) expect(existsSync(`overgear/fonts/catalogue/${file}`), file).toBe(true);
      expect(readFileSync(`overgear/fonts/catalogue/${slug}/LICENSE.txt`, 'utf8'), `${slug} license`).toMatch(/open font license/i);
    });

    test('the stylesheet is loaded by overgear.css, and a font of this repository names itself in --og-font without loading anything', () => {
      expect(readFileSync('overgear/overgear.css', 'utf8')).toContain('fonts/catalogue/catalogue.css');
      applyOvergearTheme({ ...DEFAULT, fonts: 'aspekta' });
      expect(html.dataset.ogFonts).toBe('aspekta');
      expect(html.style.getPropertyValue('--og-font')).toBe('"Aspekta"');
      expect(links()).toEqual([]);
    });
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
