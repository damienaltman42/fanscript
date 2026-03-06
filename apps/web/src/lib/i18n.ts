export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
] as const;

export type LangCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export function detectBrowserLanguage(): LangCode {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  const supported = SUPPORTED_LANGUAGES.map(l => l.code) as string[];
  return (supported.includes(browserLang) ? browserLang : 'en') as LangCode;
}

export function getLangFromStorage(): LangCode {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('fanscript_lang') as LangCode) || detectBrowserLanguage();
}

export function saveLangToStorage(lang: LangCode) {
  if (typeof window !== 'undefined') localStorage.setItem('fanscript_lang', lang);
}
