// The corner follows the size of the object (D21): bigger is rounder, between the limits, and a given radius wins
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from '../src/components/Card.jsx';
import { radiusFor, FIT } from '../src/fit-radius.js';

describe('radiusFor', () => {
  test('a bigger object is rounder, within the limits', () => {
    expect(radiusFor(20, 20)).toBe(FIT.min);
    expect(radiusFor(100, 100)).toBe(16);
    expect(radiusFor(380, 466)).toBeGreaterThan(radiusFor(177, 341));
    expect(radiusFor(177, 341)).toBeGreaterThan(radiusFor(100, 100));
    expect(radiusFor(2000, 2000)).toBe(FIT.max);
  });
  test('the smaller side decides', () => {
    expect(radiusFor(1000, 76)).toBe(radiusFor(76, 76));
  });
});

describe('Card radius', () => {
  test('a fixed radius is set on the card and is not measured', () => {
    const { container } = render(<Card radius={10}>x</Card>);
    expect(container.firstChild.style.getPropertyValue('--bui-card-radius')).toBe('10px');
  });
  test('by default the card measures itself', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild.style.getPropertyValue('--bui-card-radius')).toMatch(/px$/);
  });
});
