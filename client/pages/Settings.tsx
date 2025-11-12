import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Mail, Check } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Language } from "@/i18n/translations";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  ar: "العربية",
};

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage: setAppLanguage, t } = useI18n();
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return true; // Default to dark mode
  });
  const [showVideosOnly, setShowVideosOnly] = useState(false);
  const [showArticlesOnly, setShowArticlesOnly] = useState(false);
  const [showLanguageSaved, setShowLanguageSaved] = useState(false);

  useEffect(() => {
    // Ensure page is visible and document is properly initialized
    document.documentElement.style.display = 'block';
    document.body.style.display = 'block';

    // Apply dark mode on mount and when it changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    // Ensure page stays visible when language changes
    document.documentElement.style.display = 'block';
    document.body.style.display = 'block';
  }, [language]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    try {
      setAppLanguage(newLanguage as Language);
      setShowLanguageSaved(true);
      setTimeout(() => setShowLanguageSaved(false), 2000);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-900/10 dark:from-background dark:via-slate-950 dark:to-purple-950/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link
              to="/"
              className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{t("settings.settings")}</h1>
          </div>
          <Link
            to="/saved"
            className="text-sm font-semibold text-foreground/80 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300"
          >
            {t("saved.myTutorials")}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6 animate-fadeIn">
          {/* Dark Mode Section */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{t("settings.darkMode")}</h3>
                  <p className="text-sm text-foreground/60">
                    {t("settings.switchTheme")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-9" : "translate-x-1"
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4 relative shadow-lg hover:shadow-xl transition-all duration-300">
            <div>
              <h3 className="font-semibold text-foreground mb-2">{t("settings.language")}</h3>
              <p className="text-sm text-foreground/60 mb-4">
                {t("settings.chooseLanguage")}
              </p>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-white/20 dark:bg-slate-700/50 border border-white/20 dark:border-white/10 rounded-lg px-4 py-2 text-foreground dark:text-white outline-none focus:border-purple-500/50 focus:dark:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer font-medium"
                style={{
                  colorScheme: darkMode ? 'dark' : 'light',
                } as React.CSSProperties}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            {showLanguageSaved && (
              <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
                <Check className="w-4 h-4" />
                {t("settings.saved")}
              </div>
            )}
          </div>

          {/* Content Filters Section */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="font-semibold text-foreground">{t("settings.contentFilters")}</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVideosOnly}
                  onChange={(e) => setShowVideosOnly(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-foreground">{t("settings.showVideosOnly")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArticlesOnly}
                  onChange={(e) => setShowArticlesOnly(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-foreground">{t("settings.showArticlesOnly")}</span>
              </label>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("settings.sendFeedback")}
                  </h3>
                  <p className="text-sm text-foreground/60">
                    {t("settings.helpImprove")}
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30">
                {t("settings.send")}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-foreground/50">
              {t("settings.madeWith")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
