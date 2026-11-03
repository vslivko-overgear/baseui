import { existsSync, readFileSync } from 'node:fs';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { AGENT_DEFAULTS, AGENT_PROTOCOL, CATEGORIES, RULES, RULES_BY_ID, rule } from '../src/constitution/rules.js';
import { auditConstitution, contrastRatio } from '../src/constitution/audit.js';
import { auditTabs } from '../src/constitution/audit-tabs.js';
import { Button, ConstitutionBanner, Tabs } from '../src/index.jsx';
import { useState } from 'react';
import { CHECKS } from '../tools/check/manifest.mjs';

describe('constitution', () => {
  // The constitution: its data is consistent, the audit finds what it claims to, the banner shows it.
  describe('rules', () => {
    test('ids are unique and belong to a category', () => {
      expect(new Set(RULES.map((r) => r.id)).size).toBe(RULES.length);
      for (const r of RULES) expect(CATEGORIES.some((c) => c.id === r.category && r.id.startsWith(c.id))).toBe(true);
    });
    test('every rule says what to do and what not to do, and why', () => {
      for (const r of RULES) {
        expect(['must', 'should']).toContain(r.level);
        expect(['auto', 'partial', 'tool', 'review']).toContain(r.check);
        for (const key of ['title', 'do', 'dont', 'why', 'source']) expect(r[key], `${r.id}.${key}`).toBeTruthy();
        expect(r.dont.startsWith('Do not ') || r.dont.startsWith('Do not'), `${r.id} dont starts with "Do not"`).toBe(true);
        expect(r.signals.length, `${r.id} signals`).toBeGreaterThan(0);
      }
    });
    test('a rule checked by a tool names a tool that exists', () => {
      for (const r of RULES.filter((x) => x.check === 'tool')) expect(existsSync(r.tool), r.tool).toBe(true);
    });
    test('rule() throws on an unknown id', () => {
      expect(rule('A1').title).toBe('Text contrast');
      expect(() => rule('Z9')).toThrow(/Unknown/);
    });
    test('the protocol asks for an answer warning, a banner at the top and no refusal', () => {
      const text = AGENT_PROTOCOL.join(' ');
      expect(text).toMatch(/begin with a warning/);
      expect(text).toMatch(/ConstitutionBanner/);
      expect(text).toMatch(/at the very top/);
      expect(text).toMatch(/do not refuse/);
    });
  });

  describe('contrastRatio', () => {
    test('black on white is 21:1, same color is 1:1', () => {
      expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 0);
      expect(contrastRatio({ r: 9, g: 9, b: 9 }, { r: 9, g: 9, b: 9 })).toBe(1);
    });
  });

  describe('auditConstitution', () => {
    const audit = (html, options) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = auditConstitution(host, { touch: false, ...options });
      host.remove();
      return Object.fromEntries(found.map((f) => [f.id, f]));
    };
    test('finds light gray text on white (A1) and tiny text (H2)', () => {
      const found = audit('<p style="color:#bbbbbb;font-size:16px">Faint</p><p style="color:#171717;font-size:10px">Tiny</p>');
      expect(found.A1.note).toMatch(/contrast 1\.\d:1/);
      expect(found.H2.note).toMatch(/10px/);
    });
    test('accepts text with enough contrast, large text at 3:1 and disabled text', () => {
      const found = audit('<p style="color:#5f6877">Secondary</p><h2 style="color:#8a8f99;font-size:28px">Large</h2><button disabled style="color:#babfca">Off</button>');
      expect(found.A1).toBeUndefined();
    });
    test('uses the background behind the text', () => {
      expect(audit('<div style="background:#171717"><p style="color:#ffffff">On dark</p></div>').A1).toBeUndefined();
      expect(audit('<div style="background:#171717"><p style="color:#222222">Dark on dark</p></div>').A1).toBeDefined();
    });
    test('finds an image without alt (A7) and accepts an empty alt', () => {
      expect(audit('<img src="a.png">').A7).toBeDefined();
      expect(audit('<img src="a.png" alt="">').A7).toBeUndefined();
    });
    test('finds an input without a label (A6); a label, aria-label or wrapping label is enough', () => {
      expect(audit('<input placeholder="Email">').A6.note).toMatch(/placeholder is not one/);
      expect(audit('<label for="e">Email</label><input id="e">').A6).toBeUndefined();
      expect(audit('<input aria-label="Email">').A6).toBeUndefined();
      expect(audit('<label>Email <input></label>').A6).toBeUndefined();
    });
    test('finds a button with no name (A6)', () => {
      expect(audit('<button><svg></svg></button>').A6).toBeDefined();
      expect(audit('<button aria-label="Close"><svg></svg></button>').A6).toBeUndefined();
    });
    test('finds a skipped heading level and a second h1 (A9)', () => {
      expect(audit('<h1>A</h1><h3>B</h3>').A9.note).toMatch(/h1 is followed by h3/);
      expect(audit('<h1>A</h1><h1>B</h1>').A9.note).toMatch(/More than one h1/);
      expect(audit('<h1>A</h1><h2>B</h2><h3>C</h3>').A9).toBeUndefined();
    });
    test('finds several primary buttons in one place (U1)', () => {
      expect(audit('<section><button data-variant="primary">A</button><button data-variant="primary">B</button></section>').U1).toBeDefined();
      expect(audit('<section><button data-variant="primary">A</button><button data-variant="secondary">B</button></section>').U1).toBeUndefined();
    });
    test('entries carry the elements and a count', () => {
      const found = audit('<img src="a"><img src="b">');
      expect(found.A7.count).toBe(2);
      expect(found.A7.elements).toHaveLength(2);
    });
    test('a page made of the system passes the rules it can check', () => {
      const { container } = render(
        <main>
          <h1>Title</h1>
          <Button variant="primary" label="Save changes" />
          <Button variant="secondary" label="Cancel" />
        </main>,
      );
      const found = auditConstitution(container, { touch: false });
      expect(found.map((f) => f.id)).toEqual([]);
    });
  });

  describe('the rules the audit finds in part (check: partial)', () => {
    const audit = (html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = auditConstitution(host, { touch: false });
      host.remove();
      return Object.fromEntries(found.map((f) => [f.id, f]));
    };
    test('A4: a custom control with no tabindex, and a positive tabindex', () => {
      expect(audit('<div role="button">Open</div>').A4).toBeTruthy();
      expect(audit('<button tabindex="3">Open</button>').A4).toBeTruthy();
      expect(audit('<div role="button" tabindex="0">Open</div><button>Open</button><a href="/x">Go</a>').A4).toBeUndefined();
    });
    test('A10: a dialog needs a name', () => {
      expect(audit('<div role="dialog"><p>Hello</p></div>').A10).toBeTruthy();
      expect(audit('<div role="dialog" aria-labelledby="t"><h2 id="t">Delete 3 files?</h2></div>').A10).toBeUndefined();
    });
    test('A11: an invalid field points to its message', () => {
      expect(audit('<label>Email <input aria-invalid="true"></label>').A11).toBeTruthy();
      expect(audit('<label>Email <input aria-invalid="true" aria-describedby="e"></label><p id="e">Enter an address like name@site.com</p>').A11).toBeUndefined();
    });
    test('U7: a link that goes nowhere is a button', () => {
      expect(audit('<a href="#">Delete</a>').U7).toBeTruthy();
      expect(audit('<a href="javascript:void(0)">Delete</a>').U7).toBeTruthy();
      expect(audit('<a href="/orders">Orders</a><a href="#section">Jump</a>').U7).toBeUndefined();
    });
    test('U10: nothing to press inside a tooltip', () => {
      expect(audit('<div role="tooltip">Pay now <button>Pay</button></div>').U10).toBeTruthy();
      expect(audit('<div role="tooltip">Copies the link</div>').U10).toBeUndefined();
    });
    test('the system fields, dialogs and links pass them', async () => {
      const { TextInput, Dialog, Link } = await import('../src/index.jsx');
      const { container } = render(
        <main>
          <h1>Page</h1>
          <TextInput label="Email" status="error" caption="Enter an address like name@site.com" defaultValue="x" />
          <Dialog open title="Delete 3 files?" onOpenChange={() => {}}><p>This cannot be undone</p></Dialog>
          <Link href="/orders">Orders</Link>
        </main>,
      );
      const found = auditConstitution(document.body, { touch: false }).map((f) => f.id).filter((id) => ['A4', 'A10', 'A11', 'U7', 'U10'].includes(id));
      expect(found).toEqual([]);
      expect(container).toBeTruthy();
    });
  });

  describe('ConstitutionBanner', () => {
    test('renders nothing without violations', () => {
      const { container } = render(<ConstitutionBanner violations={[]} />);
      expect(container).toBeEmptyDOMElement();
    });
    test('names the rules and links to the constitution', () => {
      render(<ConstitutionBanner violations={['A1', { id: 'H2', note: 'Captions are 10px' }]} />);
      const banner = screen.getByRole('region', { name: 'Design constitution warning' });
      expect(banner).toHaveTextContent('2 rules of the design constitution are broken');
      expect(banner).toHaveTextContent('A1 · H2');
      expect(screen.getByRole('link', { name: 'Read the constitution' })).toHaveAttribute('href', expect.stringContaining('constitution'));
    });
    test('details open to the Do and Don’t lines and the note', async () => {
      render(<ConstitutionBanner violations={[{ id: 'A5', note: 'outline: none on buttons' }]} />);
      expect(screen.queryByText(/outline: none on buttons/)).toBeNull();
      await userEvent.click(screen.getByRole('button', { name: 'Details' }));
      expect(screen.getByText('outline: none on buttons')).toBeInTheDocument();
      expect(screen.getByText(RULES_BY_ID.A5.do)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Hide details' })).toHaveAttribute('aria-expanded', 'true');
    });
    test('cannot be dismissed: there is no close button', () => {
      render(<ConstitutionBanner violations={['A1']} defaultOpen />);
      expect(screen.queryByRole('button', { name: /close|dismiss/i })).toBeNull();
    });
    test('an unknown id is an error', () => {
      expect(() => render(<ConstitutionBanner violations={['Z9']} />)).toThrow(/Unknown/);
    });
    test('audit adds what the page breaks, without the banner auditing itself', async () => {
      render(
        <div>
          <ConstitutionBanner audit violations={['D1']} />
          <img src="x.png" />
        </div>,
      );
      await waitFor(() => expect(screen.getByRole('region')).toHaveTextContent('A7'), { timeout: 3000 });
      expect(screen.getByRole('region')).toHaveTextContent('D1');
      expect(screen.getByRole('region')).not.toHaveTextContent('2 rules'.replace('2', '9'));
    });
  });

  describe('usage guidance', () => {
    test('every key of USAGE is an exported component, and every entry has Do and Don’t lines', async () => {
      const { USAGE } = await import('../src/usage.js');
      const lib = await import('../src/index.jsx');
      const names = new Set([...Object.keys(lib), 'Typeahead', 'Dropdown', 'Token', 'TokenGroup', 'Selector', 'Switch', 'TextInput', 'Dialog', 'Checkbox', 'CheckboxGroup']);
      for (const [name, u] of Object.entries(USAGE)) {
        expect(names.has(name), `${name} is not a component`).toBe(true);
        expect(u.do.length, `${name} do`).toBeGreaterThan(0);
        expect(u.dont.length, `${name} dont`).toBeGreaterThan(0);
        for (const t of [...u.do, ...u.dont]) expect(t.length, `${name}: ${t}`).toBeGreaterThan(10);
      }
    });
    test('usageOf() finds the usage of a component by its name, and describe() does not carry it', async () => {
      const { Button, Card, Badge } = await import('../src/index.jsx');
      const { usageOf } = await import('../src/usage.js');
      expect(usageOf(Button).do.join(' ')).toMatch(/single|one primary/i);
      expect(usageOf(Card).dont.join(' ')).toMatch(/Nest a card/);
      expect(usageOf(Badge).dont.length).toBeGreaterThan(2);
      expect(Button.__docgenInfo.usage).toBeUndefined();
    });
    test('the components people reach for first have guidance', async () => {
      const lib = await import('../src/index.jsx');
      const { usageOf } = await import('../src/usage.js');
      for (const n of ['Button', 'IconButton', 'Card', 'Banner', 'Badge', 'Dialog', 'AlertDialog', 'Selector', 'TextInput', 'Switch', 'Table', 'Tabs', 'Toast'.replace('Toast', 'ToastProvider'), 'Tooltip', 'ProgressBar']) {
        expect(usageOf(lib[n]), n).toBeTruthy();
      }
    });
  });

  describe('H5: primary for the main text', () => {
    // jsdom does not resolve var(); the token is set on the page and the text uses its value, as the browser computes it
    const withTokens = (html) => {
      document.documentElement.style.setProperty('--baseui-text-and-icon-secondary', 'rgb(95, 104, 119)');
      document.documentElement.style.setProperty('--baseui-text-and-icon-primary', 'rgb(23, 23, 23)');
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    const long = 'You can change or cancel it at any time before then. We will send a receipt to your email after each payment.';
    test('finds a paragraph set in Secondary', () => {
      const found = withTokens(`<p style="color: rgb(95, 104, 119); font-size: 16px">${long}</p>`);
      expect(found.H5.note).toMatch(/main text in Secondary/);
    });
    test('accepts the same paragraph in Primary, and a short note or a caption in Secondary', () => {
      expect(withTokens(`<p style="color: rgb(23, 23, 23); font-size: 16px">${long}</p>`).H5).toBeUndefined();
      expect(withTokens('<p style="color: rgb(95, 104, 119); font-size: 14px">Billed monthly</p>').H5).toBeUndefined();
      expect(withTokens(`<p style="color: rgb(95, 104, 119); font-size: 12px">${long}</p>`).H5).toBeUndefined();
      expect(withTokens(`<span class="field-caption" style="color: rgb(95, 104, 119); font-size: 14px">${long}</span>`).H5).toBeUndefined();
    });
    test('the rule and the agent default exist', () => {
      expect(RULES_BY_ID.H5.level).toBe('must');
      expect(AGENT_DEFAULTS.some((d) => d.id === 'typography')).toBe(true);
    });
  });

  describe('C6: no period after the last sentence', () => {
    const audit = (html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    test('finds a line of text that ends with a period', () => {
      expect(audit('<p>Changes saved.</p>').C6.count).toBe(1);
      expect(audit('<ul><li>One thing.</li><li>Another thing.</li></ul>').C6.count).toBe(2);
    });
    test('accepts periods between sentences, a question mark, an ellipsis and an abbreviation', () => {
      expect(audit('<p>Your plan renews on 1 March. You can cancel at any time</p>').C6).toBeUndefined();
      expect(audit('<p>Delete this file?</p><p>Loading…</p><p>Wait...</p><p>Things like e.g.</p><p>1 октября 2026 г.</p>').C6).toBeUndefined();
    });
    test('leaves code, preformatted text and marked examples alone', () => {
      expect(audit('<pre>npm install.</pre><code>a.b.</code><p data-constitution-example="">Changes saved.</p>').C6).toBeUndefined();
    });
    test('the rule and its agent default exist', () => {
      expect(RULES_BY_ID.C6.check).toBe('auto');
      expect(AGENT_DEFAULTS.some((d) => d.id === 'punctuation')).toBe(true);
    });
    test('no text of the rules, the usage guidance or the component docs ends with a period', async () => {
      const { RULES } = await import('../src/constitution/rules.js');
      const { USAGE } = await import('../src/usage.js');
      const ends = (t) => /[^.\s]\.$/.test(t.trim()) && !/(\be\.g|\bi\.e|\betc|\.\.)\.?$/i.test(t.trim());
      for (const r of RULES) for (const k of ['do', 'dont', 'why']) expect(ends(r[k]), `${r.id}.${k}`).toBe(false);
      for (const [name, u] of Object.entries(USAGE)) for (const t of [...u.do, ...u.dont]) expect(ends(t), `${name}: ${t}`).toBe(false);
      const lib = await import('../src/index.jsx');
      for (const [name, c] of Object.entries(lib)) {
        const info = c && c.__docgenInfo;
        if (!info) continue;
        expect(ends(info.description), `${name} description`).toBe(false);
        for (const [p, v] of Object.entries(info.props)) expect(ends(v.description || ''), `${name}.${p}`).toBe(false);
      }
    });
  });

  describe('D11: Secondary background on Primary or Surface', () => {
    const audit = (html) => {
      const root = document.documentElement.style;
      root.setProperty('--baseui-background-primary', 'rgb(255, 255, 255)');
      root.setProperty('--baseui-background-secondary', 'rgb(239, 242, 246)');
      root.setProperty('--baseui-extensions-background-surface', 'rgb(34, 34, 34)');
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    const secondary = 'background-color: rgb(239, 242, 246)';
    test('finds a Secondary element on Secondary', () => {
      expect(audit(`<div style="${secondary}"><div style="${secondary}">x</div></div>`).D11.note).toMatch(/background-secondary on/);
    });
    test('accepts Secondary on Primary and on Surface', () => {
      expect(audit(`<div style="background-color: rgb(255, 255, 255)"><div style="${secondary}">x</div></div>`).D11).toBeUndefined();
      expect(audit(`<div style="background-color: rgb(34, 34, 34)"><div style="${secondary}">x</div></div>`).D11).toBeUndefined();
    });
  });

  describe('D13: a count is a counter', () => {
    const audit = (html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    test('finds a count in the label of a segment, a tab and a token', () => {
      expect(audit('<span data-slot="segmented-label">All 48</span>').D13).toBeTruthy();
      expect(audit('<span data-slot="tab-label">Inbox (3)</span>').D13).toBeTruthy();
      expect(audit('<span data-slot="token-label">Open 12</span>').D13).toBeTruthy();
      expect(audit('<span data-slot="token-label">Open 5+</span>').D13).toBeTruthy();
    });
    test('accepts the number in the name of a game, and a label without a count', () => {
      expect(audit('<span data-slot="token-label">Diablo 4</span><span data-slot="token-label">Counter Strike 2</span><span data-slot="tab-label">Destiny 2</span><span data-slot="token-label">EA Sports FC 27</span>').D13).toBeUndefined();
      expect(audit('<span data-slot="segmented-label">All</span><span data-slot="segmented-counter">48</span>').D13).toBeUndefined();
      expect(audit('<span data-slot="tab-label">Step 2 of 3</span>').D13).toBeUndefined();
    });
  });

  describe('U11: no disabled button for empty fields', () => {
    const audit = (html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    const form = (button) => `<form><label>Email <input type="email" value=""></label>${button}</form>`;
    test('finds a disabled primary button beside an empty field', () => {
      expect(audit(form('<button class="bui-button" data-variant="primary" disabled>Log in</button>')).U11.note).toMatch(/disabled while 1 field is empty/);
    });
    test('accepts an active button, a disabled secondary one, and a filled field', () => {
      expect(audit(form('<button class="bui-button" data-variant="primary">Log in</button>')).U11).toBeUndefined();
      expect(audit(form('<button class="bui-button" data-variant="secondary" disabled>Back</button>')).U11).toBeUndefined();
      expect(audit('<form><input value="a@b.c"><button class="bui-button" data-variant="primary" disabled>Log in</button></form>').U11).toBeUndefined();
    });
  });

  describe('D16: links are text-colored and underlined', () => {
    const audit = (html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.append(host);
      const found = Object.fromEntries(auditConstitution(host, { touch: false }).map((f) => [f.id, f]));
      host.remove();
      return found;
    };
    test('finds a link in text without an underline, or in another color', () => {
      expect(audit('<p>Read the <a href="#" style="text-decoration: none">terms</a></p>').D16.note).toMatch(/no underline/);
      expect(audit('<p style="color: rgb(0, 0, 0)">Read the <a href="#" style="text-decoration: underline; color: rgb(0, 0, 255)">terms</a></p>').D16.note).toMatch(/not in the color/);
    });
    test('accepts an underlined link in the color of the text, and a navigation list item', () => {
      expect(audit('<p style="color: rgb(0, 0, 0)">Read the <a href="#" style="text-decoration: underline; color: rgb(0, 0, 0)">terms</a></p>').D16).toBeUndefined();
      expect(audit('<ul><li><a href="#" style="text-decoration: none">About us</a></li></ul>').D16).toBeUndefined();
    });
  });

  describe('Link', () => {
    test('is underlined by default', async () => {
      const { Link } = await import('../src/components/Link.jsx');
      const { container } = render(<Link href="#">x</Link>);
      expect(container.querySelector('a').className).toContain('bui-link--always');
    });
  });

  describe('D17: tabs change only what is below them', () => {
    const items = [{ value: 'a', label: 'A', content: <h2>Page A</h2> }, { value: 'b', label: 'B', content: <h2>Page B</h2> }];
    const Good = () => {
      const [v, setV] = useState('a');
      return (
        <main>
          <h1>Showcase</h1>
          <Tabs label="Pages" value={v} onValueChange={setV} items={items} />
        </main>
      );
    };
    const Bad = () => {
      const [v, setV] = useState('a');
      return (
        <main>
          <h1>{v === 'a' ? 'Page A' : 'Page B'}</h1>
          <Tabs label="Pages" value={v} onValueChange={setV} items={items.map(({ content, ...i }) => i)} />
          <p>{v}</p>
        </main>
      );
    };
    test('a page whose heading is above the tabs and whose panels are below passes', async () => {
      const { container } = render(<Good />);
      expect(await auditTabs(container, { settle: 20 })).toEqual([]);
      expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    });
    test('a heading above the tabs that follows the tab is found, and the first tab is put back', async () => {
      const { container } = render(<Bad />);
      const found = await auditTabs(container, { settle: 20 });
      expect(found).toHaveLength(1);
      expect(found[0].id).toBe('D17');
      expect(found[0].note).toMatch(/"B"/);
      expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    });
  });
});

describe('checks', () => {
  // The rules, the checks that find them and the defaults that serve them stay in step: a rule marked `auto` is found by the audit and the audit finds only rules marked
  // `auto` or `tool`; a script named by a rule is one that tools/check/all.mjs runs, and every script it runs belongs to a rule; a default for agents names rules that exist.
  const read = (path) => readFileSync(path, 'utf8');
  const idsFound = (path) => new Set([...read(path).matchAll(/\badd\('([A-Z]+\d+)'/g)].map((m) => m[1]));
  const runners = CHECKS.map((c) => c.script).filter((s) => s.startsWith('tools/'));   // the shared checks; those of a sublibrary are tested in its own directory

  describe('rules and their checks', () => {
    test('a rule marked auto or partial is found by the audit, and the audit finds nothing else', () => {
      const found = new Set([...idsFound('src/constitution/audit.js'), ...idsFound('src/constitution/audit-tabs.js')]);
      const auto = new Set(RULES.filter((r) => r.check === 'auto' || r.check === 'partial').map((r) => r.id));
      // D17 is marked tool: its script is the one that presses the tabs (audit-tabs.js)
      const viaTool = new Set(RULES.filter((r) => r.check === 'tool' && found.has(r.id)).map((r) => r.id));
      expect([...auto].filter((id) => !found.has(id)), 'auto rules the audit never reports').toEqual([]);
      expect([...found].filter((id) => !auto.has(id) && !viaTool.has(id)), 'ids the audit reports that are not auto rules').toEqual([]);
    });

    test('every script a rule names exists and is run by tools/check/all.mjs', () => {
      for (const r of RULES) {
        for (const tool of [r.check === 'tool' && r.tool, ...(r.tools || [])].filter(Boolean)) {
          expect(existsSync(tool), `${r.id}: ${tool}`).toBe(true);
          expect(runners, `${r.id}: ${tool} is not run by all.mjs`).toContain(tool);
        }
      }
    });

    test('every script all.mjs runs belongs to a rule', () => {
      const named = new Set(RULES.flatMap((r) => [r.tool, ...(r.tools || [])]).filter(Boolean));
      // the audit of the constitution runs on every rule marked auto, and its fixtures keep it honest: neither has a `tool` of its own
      for (const script of runners.filter((s) => !['tools/check/constitution.mjs', 'tools/check/fixtures.mjs'].includes(s))) expect(named.has(script), `${script} serves no rule`).toBe(true);
    });

    test('the list of the checks names scripts that exist, each once, with a cost and the files it watches', () => {
      expect(new Set(CHECKS.map((c) => c.name)).size).toBe(CHECKS.length);
      for (const c of CHECKS) {
        expect(existsSync(c.script), `${c.name}: ${c.script}`).toBe(true);
        expect(c.cost, `${c.name} has no cost`).toBeGreaterThan(0);
        expect(c.touches?.length, `${c.name} watches no file`).toBeGreaterThan(0);
      }
    });

    test('a rule names its extra scripts only as a list', () => {
      for (const r of RULES) if (r.tools) expect(Array.isArray(r.tools), r.id).toBe(true);
    });
  });

  describe('defaults for agents', () => {
    test('every default names the rules it serves, and they exist', () => {
      for (const d of AGENT_DEFAULTS) {
        expect(d.rules?.length, `${d.id} names no rule`).toBeGreaterThan(0);
        for (const id of d.rules) expect(RULES_BY_ID[id], `${d.id}: ${id}`).toBeTruthy();
      }
    });
  });
});

describe('retired rules', () => {
  test('a retired id is not a rule, and the documents list it', async () => {
    const { RETIRED, RULES: ALL } = await import('../src/constitution/rules.js');
    const { readFileSync } = await import('node:fs');
    const doc = readFileSync('CONSTITUTION.md', 'utf8');
    for (const id of Object.keys(RETIRED)) {
      expect(ALL.some((r) => r.id === id), id).toBe(false);
      expect(doc).toContain(`\`${id}\``);
    }
  });
});
