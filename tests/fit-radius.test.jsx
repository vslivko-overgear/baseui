// The corner follows the size of the object (D21): bigger is rounder, between the limits, and a given radius wins
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from '../src/components/Card.jsx';
import { radiusFor, FIT } from '../src/fit-radius.js';

describe('radiusFor', () => {
  test('a bigger object is rounder, within the limits', () => {
    expect(radiusFor(20, 20)).toBe(FIT.min);
    expect(radiusFor(100, 100)).toBe(22);
    expect(radiusFor(76, 200)).toBe(20);
    expect(radiusFor(380, 466)).toBeGreaterThan(radiusFor(177, 341));
    expect(radiusFor(177, 341)).toBeGreaterThan(radiusFor(100, 100));
    expect(radiusFor(2000, 2000)).toBe(FIT.max);
  });
  test('small objects are rounder in proportion than big ones (the curve is not a line)', () => {
    expect(radiusFor(76, 76) / 76).toBeGreaterThan(radiusFor(302, 302) / 302 * 2);
  });
  test('the radius is always even', () => {
    for (let side = 1; side <= 2000; side += 7) expect(radiusFor(side, side) % 2).toBe(0);
    expect(radiusFor(177, 341)).toBe(26);
    expect(radiusFor(240, 375)).toBe(28);
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
