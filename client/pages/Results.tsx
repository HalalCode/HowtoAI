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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchResponse, Video, Article } from "@shared/api";
import { useI18n } from "@/i18n/context";
import { Language } from "@/i18n/translations";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState<"videos" | "articles">("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [useStepView, setUseStepView] = useState(true);

  const [data, setData] = useState<SearchResponse | null>(null);

  // Parse summary into steps
  const parseStepsFromSummary = (summary: string): string[] => {
    // Split by "Step X:" pattern
    const stepPattern = /Step\s+\d+:/gi;
    const parts = summary.split(stepPattern);

    // Filter out empty strings and trim whitespace
    const parsedSteps = parts
      .map(part => part.trim())
      .filter(part => part.length > 0);

    // If no steps found, return the whole summary as one step
    if (parsedSteps.length === 0) {
      return [summary];
    }

    return parsedSteps;
  };

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
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&language=${language}`);

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
      // Parse steps from the summary
      const parsedSteps = parseStepsFromSummary(responseData.summary);
      setSteps(parsedSteps);
      setCurrentStepIndex(0);
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

  const handlePreviousStep = () => {
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
  };

  const handleNextStep = () => {
    setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1));
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
          language: language,
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t("results.resultsFor")} <span className="text-foreground/90">{query}</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <div className="text-4xl animate-bounce" style={{animationDuration: '2s'}}>✨</div>
              </div>
              <p className="text-lg text-foreground/70 font-medium">
                {t("results.finding")}
              </p>
              <p className="text-sm text-foreground/50">
                {t("results.analyzingTutorials")}
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 dark:bg-slate-800/50 rounded-lg h-24 shimmer-skeleton"
                ></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-4 backdrop-blur-md">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <div>
              <p className="text-foreground font-bold mb-2 text-lg">
                {error.includes("Invalid") ? t("results.errorTitle") : t("results.searchError")}
              </p>
              <p className="text-foreground/70 text-sm">{error}</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t("results.tryAnotherSearch")}
              </button>
              {data && (
                <button
                  onClick={() => fetchResults()}
                  className="px-6 py-2 bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-foreground rounded-lg font-bold hover:border-purple-500/50 transition-all duration-300"
                >
                  {t("results.retry")}
                </button>
              )}
            </div>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-fadeIn">
            {/* AI Summary Card with Step Navigation */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-300 group-hover:blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/20 to-white/10 dark:from-slate-900/70 dark:to-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Zap className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                      {t("results.aiSummary")}
                    </h2>
                    <p className="text-sm text-foreground/70">
                      {t("results.generatedUsing")}
                    </p>
                  </div>
                </div>

                {/* Step Card */}
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 md:p-10 min-h-64 md:min-h-72 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50 rounded-full mb-6">
                        <span className="text-sm font-bold text-blue-300">
                          Step {currentStepIndex + 1} of {steps.length}
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                        {steps[currentStepIndex]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStepIndex === 0}
                    className="p-3 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/30 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-foreground transition-all duration-300 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div className="h-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIndex === steps.length - 1}
                    className="p-3 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/30 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-foreground transition-all duration-300 flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Jump to Step */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                        index === currentStepIndex
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                          : "bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-foreground hover:border-purple-500/50 hover:bg-white/30"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/20 dark:border-white/10">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`py-3 px-2 font-bold text-sm border-b-2 transition-all duration-300 ${
                    activeTab === "videos"
                      ? "border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                      : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    {t("results.videos")} ({data.videos.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`py-3 px-2 font-bold text-sm border-b-2 transition-all duration-300 ${
                    activeTab === "articles"
                      ? "border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                      : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {t("results.articles")} ({data.articles.length})
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
                      className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/20 dark:hover:bg-slate-700/70 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group flex gap-4 p-4 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20"
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
                    {t("results.noVideos")}
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
                      className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/20 dark:hover:bg-slate-700/70 rounded-xl p-4 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-purple-500/20"
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
                    {t("results.noArticles")}
                  </p>
                )}
              </div>
            )}

            {/* Follow-up Section */}
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                {t("results.followUpQuestion")}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={followUpQuery}
                  onChange={(e) => setFollowUpQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFollowUp()}
                  placeholder={t("results.followUpPlaceholder")}
                  className="flex-1 bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:border-purple-500/50 text-foreground placeholder:text-foreground/50 transition-all duration-300"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={!followUpQuery.trim() || isFollowUpLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
                >
                  {isFollowUpLoading ? t("results.askingButton") : t("results.askButton")}
                </button>
              </div>
              {followUpAnswer && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 mt-4 text-sm text-foreground whitespace-pre-wrap">
                  {followUpAnswer}
                </div>
              )}
            </div>

            {/* Save & Share Buttons */}
            <div className="flex gap-3 sticky bottom-6 bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-white/10 justify-center shadow-2xl">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  isSaved
                    ? "bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/30"
                    : "bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 text-foreground hover:border-pink-500/50 hover:bg-white/30 dark:hover:bg-white/20"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? t("results.saved") : t("results.save")}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:border-blue-500/50 hover:bg-white/30 dark:hover:bg-white/20 text-foreground rounded-lg font-bold transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                {t("results.share")}
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
