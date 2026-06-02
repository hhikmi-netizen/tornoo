"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Translations } from "./translations";
import type { Lang } from "@/types";

interface I18nContextValue {
  lang: Lang;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>;
  setLang: (l: Lang) => void;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("tornoo-lang") as Lang | null;
    if (saved && saved in translations) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("tornoo-lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang, isRtl: lang === "ar" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
