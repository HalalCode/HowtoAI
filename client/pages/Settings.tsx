import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Mail } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showVideosOnly, setShowVideosOnly] = useState(false);
  const [showArticlesOnly, setShowArticlesOnly] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-input shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-lg transition"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
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
          <div className="bg-card border border-input rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Language</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Choose your preferred language
              </p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground outline-none focus:border-primary transition"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>

          {/* Content Filters Section */}
          <div className="bg-card border border-input rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Content Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVideosOnly}
                  onChange={(e) => setShowVideosOnly(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-foreground">Show only videos</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArticlesOnly}
                  onChange={(e) => setShowArticlesOnly(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-foreground">Show only articles</span>
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
