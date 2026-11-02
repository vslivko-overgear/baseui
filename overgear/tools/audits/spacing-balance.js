// Overgear's spacing audit adds OG2 to the shared layout checks.
import { spacingBalance as baseSpacingBalance } from '../../../tools/audits/spacing-balance.js';

export function listingBalance(root = document.body) {
  const win = root.ownerDocument.defaultView;
  const out = [];
  for (const listing of root.querySelectorAll('[data-slot="product-listing"][data-has-more]')) {
    const rect = listing.getBoundingClientRect();
    const style = win.getComputedStyle(listing);
    if (listing.closest('[data-spacing-ignore]') || rect.width <= 0 || rect.height <= 0 || style.visibility === 'hidden' || style.display === 'none') continue;
    const grid = listing.querySelector('[role="list"]');
    if (!grid) continue;
    const tracks = win.getComputedStyle(grid).gridTemplateColumns.trim();
    if (!tracks || tracks === 'none') continue;
    const columns = tracks.split(/\s+/).length;
    const count = grid.querySelectorAll('[role="listitem"]').length;
    if (count % columns !== 0) out.push({
      id: 'OG2', kind: 'rows', element: listing, selector: `${listing.tagName.toLowerCase()}[product-listing]`,
      gap: count, around: `${columns}`, suggestion: 'show a multiple of the columns while more products are coming',
    });
  }
  return out;
}

export function spacingBalance(root = document.body) {
  return [...baseSpacingBalance(root), ...listingBalance(root)];
}
