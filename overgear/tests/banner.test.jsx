import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ConstitutionBanner as BaseBanner } from '../../src/components/ConstitutionBanner.jsx';
import { ConstitutionBanner } from '../index.jsx';
import { rule } from '../constitution/rules.js';

describe('Overgear constitution banner', () => {
  test('shows shared and store violations with the store documentation link', () => {
    render(<ConstitutionBanner defaultOpen violations={['A1', 'OG3']} />);
    expect(screen.getByText(rule('A1').do)).toBeInTheDocument();
    expect(screen.getByText(rule('OG3').do)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the constitution' })).toHaveAttribute('href', 'https://baseuikit.vercel.app/overgear/CONSTITUTION.md');
  });
  test('the shared banner does not silently accept store ids', () => {
    expect(() => render(<BaseBanner violations={['OG3']} />)).toThrow(/Unknown/);
  });
});
