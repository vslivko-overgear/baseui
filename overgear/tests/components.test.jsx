// The components of the Overgear sublibrary (overgear/components): what each one guarantees by itself, so no page and no browser check has to.
// The pay bar keeps the room it takes (overgear/tools/check/paybar.mjs measured it page by page); the cashback tag explains itself and ends with the mark of the coins.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { PayBar, PayBarContent, CashbackTag, money } from '../index.jsx';

const room = () => document.documentElement.style.getPropertyValue('--og-paybar-room');

describe('PayBar', () => {
  test('a pinned bar gives the page the room it takes while it is there, and takes it back when it goes', () => {
    const { unmount } = render(<PayBar amount={89} action="Add to cart" onClick={() => {}} />);
    expect(room()).toMatch(/^\d+px$/);
    expect(document.querySelector('.og-paybar[data-pinned]')).not.toBeNull();
    unmount();
    expect(room()).toBe('');
  });
  test('an inline bar (the foot of a panel) takes no room of the page', () => {
    render(<PayBar inline amount={89} action="Secure checkout" onClick={() => {}} />);
    expect(room()).toBe('');
    expect(document.querySelector('.og-paybar--inline[data-pinned]')).toBeNull();
  });
  test('it shows the price, the bonus of the price and one primary button', async () => {
    let paid = 0;
    render(<PayBarContent amount={1234.5} action="Pay" onClick={() => { paid++; }} />);
    expect(screen.getByText(money(1234.5))).toBeInTheDocument();
    expect(screen.getByText('+12.35')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Pay' }));
    expect(paid).toBe(1);
  });
});

describe('CashbackTag', () => {
  test('it explains itself (it is a hint) and the mark of the coins comes after the amount', () => {
    const { container } = render(<CashbackTag label="+0.89" />);
    const tag = container.querySelector('[data-slot="hint"] .bui-badge--warning-light .og-cbtag');
    expect(tag).not.toBeNull();
    expect(tag.firstChild.nodeType).toBe(Node.TEXT_NODE);
    expect(tag.lastChild.tagName.toLowerCase()).toBe('svg');
  });
});

describe('the pages use the components of the sublibrary', () => {
  const dir = 'overgear/example';
  const sources = readdirSync(dir).filter((f) => f.endsWith('.jsx')).map((f) => [f, readFileSync(join(dir, f), 'utf8')]);
  test('no page draws a pay bar or a cashback tag of its own', () => {
    for (const [f, text] of sources) {
      expect(text, `${f}: a pay bar of its own`).not.toMatch(/className="og-paybar(?:__in)?"/);
      expect(text, `${f}: a cashback tag of its own`).not.toMatch(/<Badge[^>]*cashbackOf\(/);
    }
  });
  test('a pinned pay bar is for a phone: a page draws it only when it is one', () => {
    for (const [f, text] of sources) {
      for (const m of text.matchAll(/<PayBar (?!inline)[^>]*>/g)) {
        const before = text.slice(Math.max(0, m.index - 60), m.index);
        expect(before, `${f}: ${m[0].slice(0, 40)}`).toMatch(/mobile( && [^&]+)? && $|mobile && !!?[\w.]+ && $/);
      }
    }
  });
  test('the example keeps no rule of its own for the bar or the tag', () => {
    const css = readFileSync(join(dir, 'example.css'), 'utf8');
    expect(css).not.toMatch(/\.og-paybar(?:__\w+)? \{/);
    expect(css).not.toMatch(/--og-paybar-h/);
    expect(css).not.toMatch(/\.og-cbtag \{/);
  });
});
