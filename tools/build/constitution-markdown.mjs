// Formatting shared by the baseui and product-specific documentation generators.
// This module knows no product rules.
import { dontBody } from '../../src/constitution/rules.js';
const CHECK = { auto: 'found by `auditConstitution()`', tool: 'found by a script', review: 'needs a review' };

export function ruleMarkdown(r) {
  return [
    `### ${r.id} ${r.title} (${r.level})`,
    '',
    `- **Do:** ${r.do}`,
    `- **Don't:** ${dontBody(r)}`,
    `- **Why:** ${r.why}`,
    `- **Source:** ${r.source}; ${CHECK[r.check]}${r.tool ? ` (\`${r.tool}\`)` : ''}`,
    `- **Requests that lead here:** ${r.signals.join('; ')}`,
    '',
  ];
}
