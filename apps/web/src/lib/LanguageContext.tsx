'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LangCode, getLangFromStorage, saveLangToStorage } from './i18n';
import { loadTranslations, get } from './translations';

interface LangContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (path: string) => string;
  ready: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (path) => path,
  ready: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');
  const [translations, setTranslations] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const loadLang = useCallback(async (l: LangCode) => {
    setReady(false);
    const t = await loadTranslations(l);
    setTranslations(t);
    setLangState(l);
    setReady(true);
  }, []);

  useEffect(() => {
    const stored = getLangFromStorage();
    loadLang(stored);
  }, []);

  const setLang = useCallback((l: LangCode) => {
    saveLangToStorage(l);
    loadLang(l);
  }, [loadLang]);

  const t = useCallback((path: string): string => {
    if (!translations) return path;
    return get(translations, path);
  }, [translations]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, ready }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
