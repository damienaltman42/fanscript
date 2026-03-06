import type { LangCode } from './i18n';

// Lazy-load translations
const loaders: Record<LangCode, () => Promise<any>> = {
  en: () => import('../messages/en').then(m => m.default),
  fr: () => import('../messages/fr').then(m => m.default),
  es: () => import('../messages/es').then(m => m.default),
  it: () => import('../messages/it').then(m => m.default),
  de: () => import('../messages/de').then(m => m.default),
  pt: () => import('../messages/pt').then(m => m.default),
  zh: () => import('../messages/zh').then(m => m.default),
  ja: () => import('../messages/ja').then(m => m.default),
};

const cache: Partial<Record<LangCode, any>> = {};

export async function loadTranslations(lang: LangCode): Promise<any> {
  if (cache[lang]) return cache[lang];
  const t = await loaders[lang]();
  cache[lang] = t;
  return t;
}

// Deep get with dot notation: get(t, 'auth.login.title')
export function get(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? path;
}
