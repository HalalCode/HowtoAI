import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mic, Search } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { translations } from "@/i18n/translations";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t, language } = useI18n();

  useEffect(() => {
    // Initialize speech recognition if available
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const isValidQuery = (q: string): boolean => {
    const trimmed = q.trim();
    // Must be at least 3 characters for a meaningful question
    if (trimmed.length < 3) return false;
    // Check if it contains at least 2 words (for a reasonable question)
    const words = trimmed.split(/\s+/).filter(w => w.length > 1);
    if (words.length < 2) return false;
    // Prevent single letter or number gibberish
    if (/^[a-zA-Z0-9]{1,2}$/.test(trimmed)) return false;
    return true;
  };

  const handleSearch = (searchQuery: string = query) => {
    if (isValidQuery(searchQuery)) {
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-900/10 dark:from-background dark:via-slate-950 dark:to-purple-950/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 right-0 left-0 z-40 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300">
          🧠 {t("app.name")}
        </Link>
        <div className="flex gap-6">
          <Link
            to="/saved"
            className="text-sm font-semibold text-foreground/80 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
          >
            {t("home.saved")}
          </Link>
          <Link
            to="/settings"
            className="text-sm font-semibold text-foreground/80 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
          >
            {t("home.settings")}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-3xl space-y-12 animate-fadeIn">
          {/* Logo and Tagline */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="text-8xl md:text-9xl animate-bounce drop-shadow-lg" style={{animationDelay: '0s', animationDuration: '3s'}}>
                🧠
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                {t("home.title")}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 font-medium">
                {t("home.subtitle")}
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative group">
              {/* Animated Border Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

              {/* Glass Card */}
              <div className="relative flex items-center gap-4 bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-6 py-5 shadow-2xl hover:shadow-3xl hover:bg-white/20 dark:hover:bg-slate-900/70 transition-all duration-300 group">
                <Search className="w-6 h-6 text-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" style={{
                  backgroundImage: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("home.searchPlaceholder")}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/50 text-lg font-medium"
                />
                <button
                  onClick={handleMicClick}
                  className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 font-semibold ${
                    isListening
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-110"
                      : "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-foreground hover:from-blue-400 hover:to-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Validation Feedback */}
            {query && !isValidQuery(query) && (
              <p className="text-sm text-destructive/90 text-center font-medium animate-pulse">
                ⚠️ {t("home.invalidQuery")}
              </p>
            )}

            {/* Search Button */}
            <div className="relative group/btn overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-100 group-hover/btn:opacity-90 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover/btn:opacity-100 blur-lg transition-opacity duration-300"></div>
              <button
                onClick={() => handleSearch()}
                disabled={!isValidQuery(query)}
                title={!isValidQuery(query) ? t("home.invalidQuery") : ""}
                className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-2xl hover:shadow-3xl disabled:shadow-none"
              >
                <Search className="w-5 h-5" />
                {t("home.searchButton")}
              </button>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="space-y-6 animate-slideUp">
            <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest px-2">
              ✨ {t("home.trendingSearches")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {(translations[language]?.home?.trendingList || []).map((search, index) => (
                <div
                  key={index}
                  className="group/trend relative overflow-hidden rounded-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover/trend:opacity-100 blur-lg transition-opacity duration-300"></div>
                  <button
                    onClick={() => handleTrendingClick(search)}
                    className="relative px-5 py-2.5 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/20 dark:hover:bg-slate-700/70 rounded-full text-sm font-semibold text-foreground/90 hover:text-foreground transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    {search}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 text-center text-sm text-foreground/60 font-medium backdrop-blur-sm bg-black/5 dark:bg-white/5 border-t border-white/10">
        <p>{t("home.poweredBy")}</p>
      </div>
    </div>
  );
}
