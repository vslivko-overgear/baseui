import { ConstitutionBanner as BaseBanner } from '../src/components/ConstitutionBanner.jsx';
import { APPLICABLE_RULES } from './constitution/rules.js';

/** The shared banner, explicitly scoped to baseui plus Overgear rules. */
export function ConstitutionBanner({ href = 'https://baseuikit.vercel.app/overgear/CONSTITUTION.md', ...props }) {
  return <BaseBanner {...props} rules={APPLICABLE_RULES} href={href} />;
}
