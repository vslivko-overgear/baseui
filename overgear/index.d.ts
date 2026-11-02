import type { ReactElement } from 'react';
import type { ConstitutionBannerProps } from '../types/index.d.ts';

export interface Rule {
  id: string;
  legacyId?: string;
  category: string;
  level: 'must' | 'should';
  title: string;
  do: string;
  dont: string;
  why: string;
  source: string;
  check: 'auto' | 'tool' | 'review';
  tool?: string;
  signals: string[];
}

/** Only Overgear's rules. */
export const RULES: Rule[];
/** Shared baseui rules followed by Overgear's rules. */
export const APPLICABLE_RULES: Rule[];
export const RULES_BY_ID: Record<string, Rule>;
export const CONSTITUTION_VERSION: string;
export function rule(id: string): Rule;
export function ConstitutionBanner(props: Omit<ConstitutionBannerProps, 'rules'>): ReactElement | null;
