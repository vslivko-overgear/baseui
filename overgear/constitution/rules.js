// Product rules for Overgear only. Add new store rules here with a stable OG-prefixed id.
// Shared accessibility, tokens and component rules remain in src/constitution/rules.js.
import { RULES as BASE_RULES } from '../../src/constitution/rules.js';

export const CONSTITUTION_VERSION = '1.0';
export const RULES = [
  {
    id: 'OG1', legacyId: 'U12', category: 'U', level: 'should', title: 'Screens of a bottom bar, empty states',
    do: 'On a phone the root screen of each tab of the bottom bar has no site header and no footer: the bar is the navigation. A login prompt or an empty screen with nothing else to show takes the whole screen and stands in the middle. Put a list of the few settings a visitor can change (currency, language, support) right under the login button',
    dont: 'Do not repeat the site header and footer on the tab screens, show recommendations on an empty cart, or open a login prompt in the middle of a screen that is otherwise empty',
    why: 'A tab is a place of its own; an empty state is for one next step',
    source: 'Mobile patterns: tab bar; Material and HIG navigation', check: 'review',
    signals: ['remove the header', 'remove the footer', 'stretch the block', 'remove the recommendations'],
  },
  {
    id: 'OG2', legacyId: 'U13', category: 'U', level: 'should', title: 'Product listings',
    do: 'Lay products in a ProductListing of ProductCards: the cards take the whole width of a row, the columns reflow, and the listing always shows whole rows (only the last row may be short, when there is nothing more). After the first rows put a "Show more" button (the default) or an endless scroll, chosen by setting. Keep the gap between cards of a dense listing at 4px on a phone',
    dont: 'Do not lay product cards in a grid of your own, leave a row half full while more products are coming, or paginate by default: pagination is a setting and is not used unless it is asked for',
    why: 'A row with a hole at its end looks like a mistake, and a page number is a place people have to remember',
    source: 'Marketplace patterns: listing, load more', check: 'tool', tool: 'overgear/tools/check/spacing.mjs',
    signals: ['listing of products', 'catalog of items', 'show more', 'infinite scroll', 'pagination in the listing'],
  },
  {
    id: 'OG3', legacyId: 'U14', category: 'U', level: 'should', title: 'Catalog and listing are two things',
    do: 'Keep the catalog and the listings apart, in the routes and in the code. The catalog is a classifier of the pages (groups, games, kinds of offers): it has no products and leads to a listing. A listing is the shop: filters, sort and the products in a ProductListing. The Catalog button of the header and of the bottom bar opens the catalog; a row of the catalog opens a listing',
    dont: 'Do not open a listing from the Catalog button, or put products on a page of the catalog, or make a listing out of the classifier of the pages',
    why: 'A person who browses and a person who buys need different pages, and a catalog that is a listing hides the structure of the shop',
    source: 'E-commerce navigation: category pages and product listing pages', check: 'review',
    signals: ['catalog page', 'classifier of the pages', 'category page', 'open the catalog'],
  },
];

// Explicit opt-in: the shared library never imports this module.
export const APPLICABLE_RULES = [...BASE_RULES, ...RULES];
export const RULES_BY_ID = Object.fromEntries(APPLICABLE_RULES.map((r) => [r.id, r]));

export function rule(id) {
  const found = RULES_BY_ID[id];
  if (!found) throw new Error(`Unknown Overgear constitution rule "${id}"`);
  return found;
}
