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
  const [darkMode, setDarkMode] = useState(false);
  const [showVideosOnly, setShowVideosOnly] = useState(false);
  const [showArticlesOnly, setShowArticlesOnly] = useState(false);
  const [showLanguageSaved, setShowLanguageSaved] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setAppLanguage(newLanguage as Language);
    setShowLanguageSaved(true);
    setTimeout(() => setShowLanguageSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-input shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link
              to="/"
              className="p-2 hover:bg-muted rounded-lg transition"
              title="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <Link
            to="/saved"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            Saved
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6 animate-fadeIn">
          {/* Dark Mode Section */}
          <div className="bg-card border border-input rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">Dark Mode</h3>
                  <p className="text-sm text-foreground/60">
                    Switch app theme
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
          <div className="bg-card border border-input rounded-lg p-6 space-y-4 relative">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Language</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Choose your preferred language
              </p>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground outline-none focus:border-primary transition"
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
              <div className="absolute top-6 right-6 bg-secondary text-secondary-foreground px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4" />
                Saved
              </div>
            )}
          </div>

          {/* Content Filters Section */}
          <div className="bg-card border border-input rounded-lg p-6 space-y-4">
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
          <div className="bg-card border border-input rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Send Feedback
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Help us improve HowTo AI
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition">
                Send
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-foreground/50">
              HowTo AI v1.0 • Made with ❤️
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
