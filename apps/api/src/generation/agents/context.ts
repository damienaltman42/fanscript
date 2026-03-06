export type SupportedLanguage =
  | 'en' | 'fr' | 'es' | 'it' | 'de' | 'pt' | 'zh' | 'ja';

export type Platform =
  | 'OnlyFans' | 'Fansly' | 'Twitter/X' | 'Instagram' | 'TikTok' | 'Patreon';

export type UserPlan = 'FREE' | 'PRO' | 'BUSINESS';

export type NsfwLevel = 1 | 2 | 3 | 4 | 5;
// 1 = suggestive/allusive, no explicit
// 2 = flirty, sensual, clearly sexual suggestion
// 3 = explicitly sexual language, no hard limits
// 4 = very explicit, graphic detail
// 5 = no limits, anything goes

export interface GenerationContext {
  userId: string;
  plan: UserPlan;
  language: SupportedLanguage;
  platform: Platform;
  niche: string;
  tone: string;
  nsfwLevel: NsfwLevel;
  creatorName?: string;
}

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  de: 'German',
  pt: 'Portuguese',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
};

export const MODEL_BY_PLAN: Record<UserPlan, string> = {
  FREE: 'gpt-4o-mini',
  PRO: 'gpt-4o',
  BUSINESS: 'gpt-4.1',
};

export const VARIATIONS_BY_PLAN: Record<UserPlan, number> = {
  FREE: 3,
  PRO: 5,
  BUSINESS: 8,
};
