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
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
}

interface Article {
  id: string;
  title: string;
  website: string;
  snippet: string;
  url: string;
  icon: string;
}

const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Complete Guide to Tying a Perfect Tie",
    channel: "Fashion Academy",
    duration: "12:45",
    views: "2.1M",
    thumbnail: "🎥",
  },
  {
    id: "2",
    title: "4 Easy Tie Knots for Beginners",
    channel: "Style Tips Channel",
    duration: "8:32",
    views: "1.5M",
    thumbnail: "🎬",
  },
  {
    id: "3",
    title: "How to Tie Every Knot in 10 Minutes",
    channel: "Quick Learn",
    duration: "10:15",
    views: "3.2M",
    thumbnail: "📺",
  },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Complete Guide to Tie Knots",
    website: "Fashion Blog",
    snippet:
      "Learn all the classic and modern tie knots with step-by-step instructions and images...",
    url: "#",
    icon: "📄",
  },
  {
    id: "2",
    title: "Mastering the Four-in-Hand Knot",
    website: "Style Guide",
    snippet: "A detailed tutorial on the most versatile and popular tie knot used in business...",
    url: "#",
    icon: "📝",
  },
  {
    id: "3",
    title: "Tie Knots for Different Occasions",
    website: "Men's Fashion",
    snippet:
      "Choose the right tie knot for casual, business, and formal events...",
    url: "#",
    icon: "📖",
  },
];

const MOCK_SUMMARY = `# How to Tie a Tie: Complete Guide

## Tools You'll Need
- A tie
- A mirror (optional but helpful)

## Time Required
5-10 minutes to learn, 30 seconds to execute once mastered

## Difficulty Level
Beginner-friendly

## Step-by-Step Instructions

### 1. Drape the Tie
Start with the tie around your neck, wide end on your right side, hanging about 12 inches lower than the narrow end.

### 2. Cross the Tie
Cross the wide end over the narrow end, making an X shape.

### 3. Wrap Around
Wrap the wide end around behind the narrow end from right to left.

### 4. Bring Forward
Bring the wide end back across the front from left to right.

### 5. Pull Up Through Neck
Pull the wide end up through the loop around your neck.

### 6. Thread Through Knot
Pull the wide end down through the knot you've created in front.

### 7. Tighten
Hold the narrow end and slide the knot up to tighten. Adjust until the tip of the wide end reaches your belt buckle.

## Tips for Success
- Practice makes perfect
- Use a mirror to check symmetry
- The narrow end should hide behind the wide end
- Keep the knot tight but not strangling
`;

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState<"videos" | "articles">("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [query]);

  const handleShare = () => {
    const text = `Check out this HowTo guide: ${query}\n\n${MOCK_SUMMARY}`;
    if (navigator.share) {
      navigator.share({
        title: `How to ${query}`,
        text: text,
      });
    } else {
      alert("Share copied to clipboard!");
    }
  };

  const handleFollowUp = () => {
    if (followUpQuery.trim()) {
      setFollowUpAnswer(
        `# Follow-up: ${followUpQuery}\n\nBased on the previous guide, here's additional information about "${followUpQuery}"...`
      );
      setFollowUpQuery("");
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
        {/* Loading State */}
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

            {/* Skeleton Loaders */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted rounded-lg h-24 shimmer-skeleton"
                ></div>
              ))}
            </div>
          </div>
        ) : (
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
              <div className="prose prose-sm max-w-none dark:prose-invert text-foreground whitespace-pre-line text-base leading-relaxed">
                {MOCK_SUMMARY.split("\n")
                  .slice(0, 15)
                  .join("\n")}
              </div>
              <button className="mt-4 text-primary hover:underline font-medium text-sm">
                Read Full Guide →
              </button>
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
                    Videos ({MOCK_VIDEOS.length})
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
                    Articles ({MOCK_ARTICLES.length})
                  </span>
                </button>
              </div>
            </div>

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4 animate-slideUp">
                {MOCK_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="bg-card border border-input hover:border-primary hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary/20 transition">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground hover:text-primary transition line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {video.channel}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-foreground/50">
                          <span>⏱ {video.duration}</span>
                          <span>👁 {video.views} views</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <Play className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div className="space-y-4 animate-slideUp">
                {MOCK_ARTICLES.map((article) => (
                  <div
                    key={article.id}
                    className="bg-card border border-input hover:border-primary hover:shadow-md rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="text-2xl flex-shrink-0">
                        {article.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground hover:text-primary transition line-clamp-2">
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
                  </div>
                ))}
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
                  placeholder="E.g., 'What if I have a clip-on tie?'"
                  className="flex-1 bg-background border border-input rounded-lg px-4 py-2 outline-none focus:border-primary transition"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={!followUpQuery.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium px-6 py-2 rounded-lg transition"
                >
                  Ask
                </button>
              </div>
              {followUpAnswer && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4 text-sm text-foreground whitespace-pre-line">
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
        )}
      </main>
    </div>
  );
}
