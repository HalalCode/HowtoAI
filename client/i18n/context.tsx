import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, Language } from "./translations";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    const lang = (stored as Language) || "en";
    // Validate that the language exists in translations
    return (lang in translations ? lang : "en") as Language;
  });

  const setLanguage = useCallback((lang: Language) => {
    // Validate language exists before setting
    if (lang in translations) {
      setLanguageState(lang);
      localStorage.setItem("language", lang);
    } else {
      console.warn(`Language ${lang} not found in translations, defaulting to English`);
      setLanguageState("en");
      localStorage.setItem("language", "en");
    }
  }, []);

  // Get translation value by dot-notation key (e.g., "home.title")
  const t = useCallback((key: string): string => {
    try {
      const keys = key.split(".");
      let value: any = translations[language];

      if (!value) {
        console.warn(`Language ${language} not found in translations`);
        return key;
      }

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key; // Fallback to key if not found
        }
      }

      return typeof value === "string" ? value : key;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
