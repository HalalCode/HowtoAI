import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Heart,
  Share2,
  Search,
  Zap,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { SearchResponse, Video, Article } from "@shared/api";
import { useI18n } from "@/i18n/context";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState<"videos" | "articles">("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const [data, setData] = useState<SearchResponse | null>(null);

  const isValidQuery = (q: string): boolean => {
    const trimmed = q.trim();
    if (trimmed.length < 3) return false;
    const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
    if (words.length < 2) return false;
    if (/^[a-zA-Z0-9]{1,2}$/.test(trimmed)) return false;
    return true;
  };

  useEffect(() => {
    if (query && !isValidQuery(query)) {
      setError(
        "Invalid search query. Please enter a meaningful 'How to...' question (at least 3 characters and 2 words)."
      );
      setIsLoading(false);
      return;
    }

    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : { error: "Invalid response format" };

      if (!response.ok) {
        throw new Error(
          responseData.error || `HTTP ${response.status}: Failed to fetch results`
        );
      }

      setData(responseData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch results. Please try again."
      );
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const text = `Check out this HowTo guide: How to ${query}\n\n${data.summary}`;
    if (navigator.share) {
      navigator.share({
        title: `How to ${query}`,
        text: text,
      });
    } else {
      alert("Summary copied! Share it with: " + text.substring(0, 50) + "...");
    }
  };

  const handleFollowUp = async () => {
    if (!followUpQuery.trim() || !data) return;

    try {
      setIsFollowUpLoading(true);
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalQuery: query,
          followUpQuery: followUpQuery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get follow-up answer");
      }

      const result = await response.json();
      setFollowUpAnswer(`## ${followUpQuery}\n\n${result.answer}`);
      setFollowUpQuery("");
    } catch (err) {
      console.error("Follow-up error:", err);
      setFollowUpAnswer(
        "Error getting follow-up answer. Please try again later."
      );
    } finally {
      setIsFollowUpLoading(false);
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
            <h1 className="text-lg font-semibold text-foreground">
              Results for: <span className="text-primary">How to {query}</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <div className="text-4xl animate-bounce">✨</div>
              </div>
              <p className="text-lg text-foreground/70">
                Finding the best tutorials…
              </p>
              <p className="text-sm text-foreground/50">
                Our AI is analyzing top videos and articles
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted rounded-lg h-24 shimmer-skeleton"
                ></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
            <div>
              <p className="text-foreground font-medium mb-2">
                {error.includes("Invalid") ? "Invalid Search Query" : "Search Error"}
              </p>
              <p className="text-foreground/70 text-sm">{error}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Try Another Search
              </button>
              {data && (
                <button
                  onClick={() => fetchResults()}
                  className="px-6 py-2 bg-card border border-input text-foreground rounded-lg font-medium hover:border-primary transition"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-fadeIn">
            {/* AI Summary Card */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    AI Summary
                  </h2>
                  <p className="text-sm text-foreground/60">
                    Generated using the top tutorials
                  </p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-foreground whitespace-pre-wrap text-base leading-relaxed">
                {data.summary}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-input">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`py-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === "videos"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Videos ({data.videos.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`py-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === "articles"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Articles ({data.articles.length})
                  </span>
                </button>
              </div>
            </div>

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4 animate-slideUp">
                {data.videos.length > 0 ? (
                  data.videos.map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card border border-input hover:border-primary hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 cursor-pointer group flex gap-4 p-4"
                    >
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition overflow-hidden">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Play className="w-6 h-6 text-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {video.channel}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-foreground/50">
                          {video.duration !== "N/A" && (
                            <span>⏱ {video.duration}</span>
                          )}
                          {video.views !== "N/A" && (
                            <span>👁 {video.views} views</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <Play className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-center text-foreground/60 py-8">
                    No videos found
                  </p>
                )}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div className="space-y-4 animate-slideUp">
                {data.articles.length > 0 ? (
                  data.articles.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card border border-input hover:border-primary hover:shadow-md rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="text-2xl flex-shrink-0 mt-1">📄</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-foreground/60 mt-1">
                            {article.website}
                          </p>
                          <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                            {article.snippet}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-center text-foreground/60 py-8">
                    No articles found
                  </p>
                )}
              </div>
            )}

            {/* Follow-up Section */}
            <div className="bg-card border border-input rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Ask a Follow-up Question
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={followUpQuery}
                  onChange={(e) => setFollowUpQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFollowUp()}
                  placeholder="Ask a follow-up question…"
                  className="flex-1 bg-background border border-input rounded-lg px-4 py-2 outline-none focus:border-primary transition"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={!followUpQuery.trim() || isFollowUpLoading}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium px-6 py-2 rounded-lg transition"
                >
                  {isFollowUpLoading ? "…" : "Ask"}
                </button>
              </div>
              {followUpAnswer && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4 text-sm text-foreground whitespace-pre-wrap">
                  {followUpAnswer}
                </div>
              )}
            </div>

            {/* Save & Share Buttons */}
            <div className="flex gap-3 sticky bottom-6 bg-background/80 backdrop-blur p-4 rounded-lg border border-input justify-center">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isSaved
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card border border-input text-foreground hover:border-secondary"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-input hover:border-primary text-foreground rounded-lg font-medium transition"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
