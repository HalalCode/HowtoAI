import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mic, Search } from "lucide-react";
import { useI18n } from "@/i18n/context";

const trendingSearchesEnglish = [
  "How to tie a tie",
  "How to cook rice",
  "How to change a tire",
  "How to fix a leaky faucet",
  "How to bake a cake",
  "How to learn guitar",
  "How to start a garden",
  "How to meditate",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50 dark:from-background dark:via-background dark:to-blue-950/20 flex flex-col items-center justify-center px-4 py-8">
      {/* Navigation Header */}
      <nav className="absolute top-0 right-0 left-0 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="text-2xl font-bold text-primary">
          🧠 {t("app.name")}
        </Link>
        <div className="flex gap-4">
          <Link
            to="/saved"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            {t("home.saved")}
          </Link>
          <Link
            to="/settings"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            {t("home.settings")}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full max-w-2xl space-y-8 animate-fadeIn">
        {/* Logo and Tagline */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="text-6xl md:text-7xl animate-bounce" style={{animationDelay: '0s'}}>
              🧠
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Search Section */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-10 blur transition"></div>
            <div className="relative flex items-center gap-3 bg-card border border-input rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
              <Search className="w-5 h-5 text-primary flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("home.searchPlaceholder")}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/40 text-base"
              />
              <button
                onClick={handleMicClick}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isListening
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-foreground/60 hover:bg-primary/10 hover:text-primary"
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Validation Feedback */}
          {query && !isValidQuery(query) && (
            <p className="text-xs text-destructive/80 text-center">
              Please enter a meaningful "How to..." question (at least 3 characters and 2 words)
            </p>
          )}

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={!isValidQuery(query)}
            title={!isValidQuery(query) ? "Please enter a valid 'How to...' question (at least 3 characters, 2+ words)" : ""}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* Trending Searches */}
        <div className="space-y-4 animate-slideUp">
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide px-2">
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(search)}
                className="px-4 py-2 bg-card border border-input hover:border-primary hover:bg-primary/5 rounded-full text-sm text-foreground/80 hover:text-primary transition-all duration-200 whitespace-nowrap"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-foreground/50">
        <p>✨ Powered by AI and the best tutorials online</p>
      </div>
    </div>
  );
}
