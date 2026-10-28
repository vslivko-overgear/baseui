// Local placeholder art for the organism stories: no network, no real products. Colors are decorative sample data.
const enc = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** A tall "key art" picture: a gradient sky with abstract shapes. */
export const keyArt = (hue = 250) => enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 410" preserveAspectRatio="xMidYMin slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 75% 55%)"/><stop offset="1" stop-color="hsl(${hue + 60} 70% 28%)"/></linearGradient></defs><rect width="400" height="410" fill="url(#g)"/><circle cx="290" cy="110" r="70" fill="hsl(${hue + 120} 90% 70%)" opacity=".55"/><path d="M0 260 120 150 220 250 300 180 400 270V410H0Z" fill="hsl(${hue} 50% 18%)" opacity=".55"/><path d="M0 310 90 240 190 320 290 250 400 330V410H0Z" fill="hsl(${hue} 50% 12%)" opacity=".6"/></svg>`);

/** A small square product icon. */
export const itemArt = (letter, hue = 220) => enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 62%)"/><stop offset="1" stop-color="hsl(${hue + 40} 70% 42%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="66" font-size="48" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`);

/** A 20px selling-point glyph. */
export const glyph = (hue = 260) => enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 1.5 12.6 7l6 .8-4.4 4.2 1.1 6L10 15l-5.3 3 1.1-6L1.4 7.800l6-.8Z" fill="hsl(${hue} 80% 60%)"/></svg>`);
