// Optional product entry. The baseui entry point never imports Overgear.
export { ConstitutionBanner } from './ConstitutionBanner.jsx';
export { RULES, APPLICABLE_RULES, RULES_BY_ID, CONSTITUTION_VERSION, rule } from './constitution/rules.js';

// The components of the sublibrary, on top of baseui: what every product of Overgear draws the same way
export { CashbackMark, CashbackTag, CASHBACK, CASHBACK_HINT, cashbackOf } from './components/cashback.jsx';
export { PayBar, PayBarContent } from './components/paybar.jsx';
export { money } from './components/money.js';
