import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../src/templates/registry.js';
import { TEMPLATE_COMPONENTS } from '../src/templates/index.jsx';
import { auditConstitution } from '../src/constitution/audit.js';

describe('templates', () => {
  it('every template of the registry has a component, and the other way round', () => {
    expect(TEMPLATES.map((t) => t.id).sort()).toEqual(Object.keys(TEMPLATE_COMPONENTS).sort());
    for (const t of TEMPLATES) expect(TEMPLATE_CATEGORIES).toContain(t.category);
  });

  it.each(TEMPLATES.map((t) => [t.id]))('%s renders a page with text and no period at the end of a sentence', (id) => {
    const Template = TEMPLATE_COMPONENTS[id];
    const { container, unmount } = render(<Template />);
    expect(container.textContent.trim().length).toBeGreaterThan(20);
    const broken = auditConstitution(container).filter((v) => v.id === 'C6');
    expect(broken).toEqual([]);
    unmount();
  });
});
