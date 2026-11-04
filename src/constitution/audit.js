// auditConstitution(): finds the violations of the constitution that a script can see in a rendered page
// (the rules with check: 'auto' in rules.js). It reads computed styles and geometry, so run it in a browser,
// or in jsdom for the rules that do not need layout. It is a floor, not a review: a clean audit does not mean a good interface.
import { RULES_BY_ID } from './rules.js';

const MIN_FONT = 12;

function parseColor(value) {
  if (!value || value === 'transparent') return null;
  let m = value.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4] };
  m = value.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
  if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4] };
  // the other spaces a browser may answer with (oklab, oklch, lab, lch, color(display-p3 …)): the browser itself turns them into sRGB through a canvas
  return /^(oklab|oklch|lab|lch|hwb|color)\(/.test(value) ? viaCanvas(value) : null;
}
let probe;
/** A color in a space the audit does not read, as sRGB: what a canvas paints with it. null where there is no canvas (jsdom). */
function viaCanvas(value) {
  try {
    if (probe === undefined) probe = typeof document === 'undefined' || /jsdom/i.test(navigator.userAgent) ? null : document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!probe) return null;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = '#000';
    probe.fillStyle = value;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  } catch { return null; }
}
const over = (top, under) => {
  const a = top.a + under.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (t, u) => (t * top.a + u * under.a * (1 - top.a)) / a;
  return { r: mix(top.r, under.r), g: mix(top.g, under.g), b: mix(top.b, under.b), a };
};
const luminance = ({ r, g, b }) => {
  const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
export const contrastRatio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** The color behind an element: its ancestors' backgrounds laid over each other. null when an image or a gradient is behind it. */
function backgroundOf(el, win) {
  const layers = [];
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const cs = win.getComputedStyle(node);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
    const c = parseColor(cs.backgroundColor);
    if (c && c.a > 0) { layers.push(c); if (c.a === 1) break; }
  }
  let base = { r: 255, g: 255, b: 255, a: 1 };
  for (const layer of layers.reverse()) base = over(layer, base);
  return base;
}

const visible = (el, win) => {
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const cs = win.getComputedStyle(node);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
  }
  return true;
};
const isDisabled = (el) => el.closest('[disabled], [aria-disabled="true"], [data-disabled], .bui-switch--disabled') !== null;
const describeEl = (el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : ''}`;
const nameOf = (el) => {
  if (el.getAttribute('aria-label')?.trim()) return true;
  const by = el.getAttribute('aria-labelledby');
  if (by && by.split(/\s+/).some((id) => el.ownerDocument.getElementById(id)?.textContent.trim())) return true;
  if (el.labels && [...el.labels].some((l) => l.textContent.trim())) return true;
  if (el.closest('label')?.textContent.trim()) return true;
  if (el.getAttribute('title')?.trim()) return true;
  return false;
};

/**
 * Audits a rendered page (or a subtree) and returns one entry per broken rule:
 * [{ id, note, count, elements }] where note is ready for a ConstitutionBanner.
 */
export function auditConstitution(root = typeof document === 'undefined' ? null : document.body, options = {}) {
  if (!root) return [];
  /** @type {Document} */
  const doc = /** @type {any} */ (root.ownerDocument || root);
  const win = doc.defaultView;
  const found = new Map();
  const add = (id, el, note) => {
    if (!RULES_BY_ID[id]) throw new Error(`Unknown rule ${id}`);
    const entry = found.get(id) || { id, notes: [], elements: [] };
    entry.elements.push(el);
    if (entry.notes.length < 3) entry.notes.push(note);
    found.set(id, entry);
  };
  const all = [...root.querySelectorAll('*')].filter((el) => !el.closest('[data-constitution-banner], script, style'));
  // the Secondary text color of the page, for H5; null when the tokens are not loaded (jsdom, a page without tokens.css)
  const secondaryColor = (() => {
    const raw = win.getComputedStyle(doc.documentElement).getPropertyValue('--bui-text-and-icon-secondary').trim();
    if (!raw) return null;
    // the token's own value, put through a probe so that it is in the form the computed style of text has
    const probe = doc.createElement('span');
    probe.style.color = raw;
    doc.body.append(probe);
    const c = win.getComputedStyle(probe).color;
    probe.remove();
    return c;
  })();
  // D11: the resolved colors of the tokens; null when the tokens are not loaded (jsdom)
  const tokenColor = (name) => {
    const raw = win.getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
    if (!raw) return null;
    const probe = doc.createElement('span');
    probe.style.backgroundColor = raw;
    doc.body.append(probe);
    const c = win.getComputedStyle(probe).backgroundColor;
    probe.remove();
    return c;
  };
  const secondaryBg = tokenColor('--bui-background-secondary');
  const groundOk = new Set([tokenColor('--bui-background-primary'), tokenColor('--bui-extensions-background-surface')]);

  for (const el of /** @type {any[]} */ (all)) {
    if (!visible(el, win)) continue;
    const cs = win.getComputedStyle(el);
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    const hasText = own.length > 0;

    if (hasText) {
      // jsdom leaves em and keyword sizes unresolved; a browser always returns px
      const size = cs.fontSize.endsWith('px') ? parseFloat(cs.fontSize) : NaN;
      // H5: a sentence or more of main-size text in Secondary is main text set too quiet
      if (secondaryColor && cs.color === secondaryColor && size >= 14 && own.length >= 70 && !el.closest('[data-constitution-example], [data-slot*="caption"], [class*="caption"], [class*="details"], [class*="muted"], [class*="subtitle"], [class*="description"], [class*="hint"], small, figcaption, label, [role="tooltip"]')) add('H5', el, `${describeEl(el)} sets ${own.length} characters of main text in Secondary`);
      // A1 contrast, H2 size
      if (size < MIN_FONT) add('H2', el, `${describeEl(el)} is ${size}px`);
      const fg = parseColor(cs.color);
      const bg = backgroundOf(el, win);
      if (fg && bg && !isDisabled(el)) {
        const solid = fg.a < 1 ? over(fg, bg) : fg;
        const ratio = contrastRatio(solid, bg);
        const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
        const need = large ? 3 : 4.5;
        if (ratio < need) add('A1', el, `${describeEl(el)} has contrast ${ratio.toFixed(1)}:1, needs ${need}:1`);
      }
    }

    // C6: a leaf of text that ends with a period (the last sentence of a piece of text has none)
    if (hasText && el.children.length === 0 && /^(P|LI|SPAN|DIV|TD|TH|BUTTON|A|LABEL|H[1-6]|FIGCAPTION|CAPTION|DD|DT|SMALL|STRONG|EM|B|OUTPUT)$/.test(el.tagName) && /[^.\s]\.$/.test(own) && !/(\b(e\.g|i\.e|etc|vs)|\.\.)\.?$/i.test(own) && !/\s\p{L}\.$/u.test(own) && !el.closest('pre, code, kbd, textarea, [contenteditable], [data-user-content], [data-constitution-example]')) {
      add('C6', el, `${describeEl(el)} ends with a period`);
    }

    // D11: a Secondary background on Primary or Surface only
    if (secondaryBg && cs.backgroundColor === secondaryBg && cs.backgroundImage === 'none' && !el.closest('[data-constitution-example]')) {
      let ground = null;
      for (let node = el.parentElement; node && node.nodeType === 1; node = node.parentElement) {
        const c = win.getComputedStyle(node);
        if (c.backgroundImage !== 'none') break;
        const k = parseColor(c.backgroundColor);
        if (k && k.a === 1) { ground = c.backgroundColor; break; }
      }
      if (ground && !groundOk.has(ground)) add('D11', el, `${describeEl(el)} has background-secondary on ${ground}`);
    }

    // D12: a filled element inside the box of the container that holds it
    if (!(el.tagName === 'SPAN' && cs.display === 'inline') && cs.position !== 'absolute' && cs.position !== 'fixed' && !el.closest('[data-constitution-example], svg, [role="tooltip"], .bui-avatar__status')) {
      const fill = parseColor(cs.backgroundColor);
      if (fill && fill.a > 0.05) {
        let box = el.parentElement;
        while (box && box !== doc.body) {
          const bs = win.getComputedStyle(box);
          const k = parseColor(bs.backgroundColor);
          if ((k && k.a > 0.05) || (bs.borderTopWidth !== '0px' && bs.borderTopStyle !== 'none')) break;
          box = box.parentElement;
        }
        if (box && box !== doc.body && box !== doc.documentElement) {
          const a = el.getBoundingClientRect();
          const c = box.getBoundingClientRect();
          if (a.width > 0 && c.width > 0 && (a.left < c.left - 1 || a.right > c.right + 1) && win.getComputedStyle(box).overflowX === 'visible') add('D12', el, `${describeEl(el)} sticks out of ${describeEl(box)} by ${Math.round(Math.max(c.left - a.left, a.right - c.right))}px`);
        }
      }
    }

    // D13: a count written into the label of a tab, a segment or a token. A count is in brackets, has a plus, or is a number of two digits or more after one word;
    // a number at the end of a longer label or of one digit is more often part of a name (Diablo 4, Counter Strike 2, EA Sports FC 27), so it is left alone
    if (hasText && /^(segmented|tab|token)-label$/.test(el.getAttribute('data-slot') || '') && (/(\(\d+\)|\s\d+\+)$/.test(own) || (/\s\d{2,}$/.test(own) && own.trim().split(/\s+/).length <= 2)) && !/\b(of|step|page|week|day|year|top|q|season|chapter|part|level|tier|episode|act|vol)\b/i.test(own)) add('D13', el, `${describeEl(el)} has the count in its label ("${own}"): use the counter`);

    // A7 images
    if (el.tagName === 'IMG' && !el.hasAttribute('alt')) add('A7', el, `${describeEl(el)} has no alt`);

    // A6 names
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && !/^(hidden|submit|button|reset|image)$/.test(el.type || '') && el.getAttribute('aria-hidden') !== 'true' && !nameOf(el)) {
      add('A6', el, `${describeEl(el)} has no label${el.getAttribute('placeholder') ? ' (the placeholder is not one)' : ''}`);
    }
    if ((el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') && !el.textContent.trim() && !nameOf(el)) add('A6', el, `${describeEl(el)} has no name`);
  }

  // D18: the fields of one form (or of one section of it) stand at one gap, down and across
  const scopes = new Map();
  for (const f of /** @type {any[]} */ ([...root.querySelectorAll('.bui-field')])) {
    if (!visible(f, win) || f.closest('[data-constitution-example]')) continue;
    const scope = f.closest('.bui-form__section, form, [data-slot="form"]');
    if (scope) scopes.set(scope, [...(scopes.get(scope) || []), f]);
  }
  for (const [scope, list] of scopes) {
    if (list.length < 2) continue;
    const rects = list.map((f) => f.getBoundingClientRect());
    const gaps = [];
    const near = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > Math.min(a.width, b.width) / 2;
    const level = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > Math.min(a.height, b.height) / 2;
    const order = rects.map((r, i) => i).sort((x, y) => rects[x].top - rects[y].top || rects[x].left - rects[y].left);
    for (const i of order) {
      let down = null; let across = null;
      for (const j of order) {
        if (i === j) continue;
        const a = rects[i]; const b = rects[j];
        if (near(a, b) && b.top >= a.bottom - 1 && (!down || b.top < down.top)) down = b;
        if (level(a, b) && b.left >= a.right - 1 && (!across || b.left < across.left)) across = b;
      }
      if (down) gaps.push(Math.round(down.top - rects[i].bottom));
      if (across) gaps.push(Math.round(across.left - rects[i].right));
    }
    const real = gaps.filter((g) => g >= 0 && g <= 64);
    if (real.length > 1 && Math.max(...real) - Math.min(...real) > 1) {
      add('D18', scope, `${describeEl(scope)}: the gaps between its fields are ${[...new Set(real)].sort((x, y) => x - y).join(', ')}px; use Form and FormRow, which give one gap in both directions`);
    }
  }

  // D19: the highlight of a row of a list is not cut by a box, and the rows of a list of a page stand on their text (the bleed is not taken away)
  for (const header of /** @type {any[]} */ ([...root.querySelectorAll('.bui-list__header')])) {
    if (!visible(header, win) || header.closest('[data-constitution-example]')) continue;
    const r = header.getBoundingClientRect();
    if (!(r.width > 0)) continue;
    for (let n = header.parentElement; n && n !== doc.body && n !== doc.documentElement; n = n.parentElement) {
      if (!/(auto|scroll|hidden|clip)/.test(win.getComputedStyle(n).overflowX)) continue;
      const c = n.getBoundingClientRect();
      if (r.left < c.left - 1 || r.right > c.right + 1) { add('D19', header, `the highlight of a row of ${describeEl(header)} is cut by ${describeEl(n)}; put the list in a bui-list-scroll box`); break; }
    }
    if (!header.closest('.bui-card, .bui-dialog__popup, .bui-popover, .bui-dropdown__popup, .bui-collapsible, .bui-list__nested-wrap') && parseFloat(win.getComputedStyle(header).marginLeft) === 0) add('D19', header, `the rows of ${describeEl(header)} have no room for the highlight, so the text is inset from the edge of the content; do not set --bui-list-bleed to 0 on a list of a page`);
  }

  // D15: a button in one row with an input has the height, the text size and the icon size of the input
  const fields = [...root.querySelectorAll('.bui-field')].filter((f) => visible(f, win));
  for (const btn of /** @type {any[]} */ ([...root.querySelectorAll('.bui-button')])) {
    if (!visible(btn, win) || btn.closest('.bui-field') || btn.closest('[data-constitution-example]')) continue;
    const b = btn.getBoundingClientRect();
    if (!(b.width > 0)) continue;
    for (const f of fields) {
      const cell = f.querySelector('.bui-field__cell') || f;
      const r = cell.getBoundingClientRect();
      const overlap = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
      const gap = b.left >= r.right ? b.left - r.right : r.left >= b.right ? r.left - b.right : -1;
      if (overlap < Math.min(b.height, r.height) * 0.6 || gap < 0 || gap > 48) continue;
      const input = f.querySelector('input, textarea, [role="combobox"]');
      const fieldText = input ? parseFloat(win.getComputedStyle(input).fontSize) : NaN;
      const btnText = parseFloat(win.getComputedStyle(btn).fontSize);
      if (Math.abs(b.height - r.height) > 1 || (fieldText && btn.getAttribute('data-slot') !== 'icon-button' && btnText !== fieldText)) {
        add('D15', btn, `${describeEl(btn)} is ${Math.round(b.height)}px with ${btnText}px text beside a field of ${Math.round(r.height)}px with ${fieldText}px text`);
        break;
      }
      // the icons of the row are one size too (the icon of the button and the icon or the action of the field)
      const btnIcon = btn.querySelector('svg')?.getBoundingClientRect().width;
      const fieldIcon = f.querySelector('.bui-field__icon svg, .bui-field__action svg')?.getBoundingClientRect().width;
      if (btnIcon && fieldIcon && Math.abs(btnIcon - fieldIcon) > 1) {
        add('D15', btn, `${describeEl(btn)} has a ${Math.round(btnIcon)}px icon beside a field with a ${Math.round(fieldIcon)}px icon`);
        break;
      }
    }
  }

  // D15: buttons side by side in one row have one icon size (a button with a label and an icon button next to it, outside a ControlRow)
  {
    const seen = new Set();
    for (const btn of /** @type {any[]} */ ([...root.querySelectorAll('.bui-button')])) {
      if (!visible(btn, win) || btn.closest('.bui-field') || btn.closest('[data-constitution-example]') || seen.has(btn)) continue;
      const icon = btn.querySelector('svg')?.getBoundingClientRect().width;
      if (!icon) continue;
      const b = btn.getBoundingClientRect();
      for (const other of /** @type {any[]} */ ([...(btn.parentElement?.children || [])])) {
        if (other === btn || !other.matches?.('.bui-button') || !visible(other, win)) continue;
        const o = other.getBoundingClientRect();
        const otherIcon = other.querySelector('svg')?.getBoundingClientRect().width;
        const overlap = Math.min(b.bottom, o.bottom) - Math.max(b.top, o.top);
        const gap = b.left >= o.right ? b.left - o.right : o.left >= b.right ? o.left - b.right : -1;
        if (!otherIcon || overlap < Math.min(b.height, o.height) * 0.6 || gap < 0 || gap > 48 || Math.abs(icon - otherIcon) <= 1) continue;
        seen.add(btn); seen.add(other);
        add('D15', other, `${describeEl(other)} has a ${Math.round(otherIcon)}px icon beside a button with a ${Math.round(icon)}px icon; put them in a ControlRow`);
        break;
      }
    }
  }

  // U11: a disabled button next to empty fields (in the same form, dialog or card): the button should be active and the form should show the errors
  for (const btn of /** @type {any[]} */ ([...root.querySelectorAll('.bui-button')])) {
    if (!visible(btn, win) || btn.hasAttribute('data-loading') || btn.hasAttribute('data-loading-disabled') || !(btn.disabled || btn.hasAttribute('data-disabled')) || btn.getAttribute('data-variant') !== 'primary') continue;
    const scope = btn.closest('form, [role="dialog"], [data-slot="card"], section') || null;
    if (!scope) continue;
    const empty = [...scope.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea')].filter((i) => !i.disabled && !i.readOnly && !i.closest('[inert]') && visible(i, win) && i.value === '');
    if (empty.length) add('U11', btn, `${describeEl(btn)} is disabled while ${empty.length} field${empty.length === 1 ? ' is' : 's are'} empty`);
  }

  // D16: a link inside text has the color of the text and an underline (a link that is a whole list item is navigation); a link inside a card is checked like any other, only the hit area of a clickable card is not a link in text
  for (const a of /** @type {any[]} */ ([...root.querySelectorAll('a[href]')])) {
    if (!visible(a, win) || !a.parentElement || a.closest('nav, [role="navigation"], [role="tab"], [role="menu"], button, [data-slot="breadcrumbs"], .bui-breadcrumbs, [data-slot="card-hit"], .bui-card__hit, [data-constitution-example]')) continue;
    const item = a.closest('li, p, td, dd');
    if (!item || (item.tagName === 'LI' && a.textContent.trim() === item.textContent.trim())) continue;
    const own = win.getComputedStyle(a), around = win.getComputedStyle(a.parentElement);
    if (!`${own.textDecorationLine} ${own.textDecoration}`.includes('underline')) add('D16', a, `${describeEl(a)} in text has no underline`);
    else if (own.color !== around.color) add('D16', a, `${describeEl(a)} in text is not in the color of the text around it`);
  }

  // H2: the text right under a big heading is 16px or more (a 14px note under a 28px title looks detached and is easy to skip)
  for (const h of /** @type {any[]} */ ([...root.querySelectorAll('h1, h2, h3, [role="heading"]')])) {
    if (!visible(h, win) || h.closest('[data-constitution-example]')) continue;
    const headSize = parseFloat(win.getComputedStyle(h).fontSize);
    const next = h.nextElementSibling;
    if (!(headSize >= 24) || !next || !['P', 'DIV', 'SPAN'].includes(next.tagName) || !visible(next, win)) continue;
    const own = [...next.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    const size = parseFloat(win.getComputedStyle(next).fontSize);
    if (own.length >= 40 && size < 16) add('H2', next, `${describeEl(next)} is ${size}px under a ${headSize}px heading`);
  }

  // A9 structure: one h1, no skipped levels
  const headings = [...root.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')].filter((h) => visible(h, win));
  const level = (h) => Number(h.tagName[1]) || Number(h.getAttribute('aria-level')) || 2;
  if (headings.filter((h) => level(h) === 1).length > 1) add('A9', headings.find((h) => level(h) === 1), 'More than one h1');
  headings.forEach((h, i) => {
    const prev = i ? level(headings[i - 1]) : 0;
    if (i && level(h) > prev + 1) add('A9', h, `h${prev} is followed by h${level(h)}`);
  });

  // U1 one primary action per container
  const groups = new Map();
  for (const b of root.querySelectorAll('button[data-variant="primary"], a[data-variant="primary"]')) {
    if (!visible(b, win) || isDisabled(b)) continue;
    const scope = b.closest('[role="dialog"], .bui-card, form, section, article, main') || root;
    groups.set(scope, [...(groups.get(scope) || []), b]);
  }
  for (const [, buttons] of groups) if (buttons.length > 1) add('U1', buttons[1], `${buttons.length} primary buttons in one place`);

  // The rules marked check: partial: only the clear cases are found here (the markup that cannot be right); everything else about them still needs a review
  const live = [...root.querySelectorAll('*')].filter((el) => !el.closest('[data-constitution-banner], [data-constitution-example], script, style') && visible(el, win) && !isDisabled(el));
  for (const el of live) {
    const role = el.getAttribute('role');
    // A4 keyboard: a control that is not a real one has to be reached with a key, and nothing jumps the order
    if (/^(button|link|tab|menuitem|checkbox|switch|radio|option)$/.test(role || '') && !/^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName) && !el.hasAttribute('tabindex') && !el.closest('[role="listbox"], [role="menu"], [role="tablist"], [role="radiogroup"]')) add('A4', el, `${describeEl(el)} is a ${role} that the keyboard cannot reach (no tabindex); use a real button or link`);
    if (el.hasAttribute('tabindex') && Number(el.getAttribute('tabindex')) > 0) add('A4', el, `${describeEl(el)} has tabindex ${el.getAttribute('tabindex')}, which breaks the reading order`);
    // A10 dialogs: a dialog has a name
    if ((role === 'dialog' || role === 'alertdialog') && !nameOf(el)) add('A10', el, `${describeEl(el)} is a dialog without a name (aria-labelledby or aria-label)`);
    // A11 errors are described: a field marked invalid points to its message
    if (el.getAttribute('aria-invalid') === 'true' && (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || /^(combobox|textbox)$/.test(role || ''))) {
      const ids = `${el.getAttribute('aria-describedby') || ''} ${el.getAttribute('aria-errormessage') || ''}`.split(/\s+/).filter(Boolean);
      if (!ids.some((id) => doc.getElementById(id)?.textContent.trim())) add('A11', el, `${describeEl(el)} is invalid but no message describes it (aria-describedby)`);
    }
    // U7 links navigate: a link that goes nowhere is a button
    if (el.tagName === 'A' && !role && (!el.hasAttribute('href') || el.getAttribute('href') === '#' || /^javascript:/i.test(el.getAttribute('href')))) add('U7', el, `${describeEl(el)} is a link that goes nowhere; use a button for an action`);
    // U10 tooltips are hints: nothing to press inside
    if (role === 'tooltip' && el.querySelector('a, button, input, select, textarea, [tabindex]')) add('U10', el, `${describeEl(el)} is a tooltip with something to press inside it; a tooltip is a hint, put the control in the interface`);
  }

  // M4 a list of options is a sheet on a phone: no menu of options floats over the page while the window is narrower than 768px
  if (win.innerWidth < 768) {
    for (const menu of /** @type {any[]} */ ([...root.querySelectorAll('.bui-dropdown')])) {
      if (visible(menu, win) && menu.getBoundingClientRect().width > 0) add('M4', menu, `${describeEl(menu)} is a menu over the page on a phone; a list of options is a bottom sheet below 768px (Dropdown has sheet on by default)`);
    }
  }

  // M2 horizontal scroll
  const scroller = doc.documentElement;
  if (root === doc.body && scroller.scrollWidth > scroller.clientWidth + 1) add('M2', scroller, `the page scrolls sideways (${scroller.scrollWidth}px in ${scroller.clientWidth}px)`);

  return [...found.values()].map(({ id, notes, elements }) => ({ id, note: notes.join('; ') + (elements.length > notes.length ? ` and ${elements.length - notes.length} more` : ''), count: elements.length, elements }));
}
