"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Locale, t as translate, dateLocale as getDateLocale, paymentMethodLabel as getPaymentMethodLabel } from "./i18n";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dateLocale: string;
  paymentMethodLabel: (method: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      router.refresh();
    },
    [router]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback((key: string) => translate(locale, key), [locale]);
  const dateLocale = getDateLocale(locale);
  const paymentMethodLabel = useCallback(
    (method: string) => getPaymentMethodLabel(locale, method),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dateLocale, paymentMethodLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
