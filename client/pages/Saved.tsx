import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { useState, useEffect } from "react";
import { getSavedTutorials, deleteTutorial, SavedTutorial } from "@/lib/saved-tutorials";

export default function Saved() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [savedItems, setSavedItems] = useState<SavedTutorial[]>([]);

  useEffect(() => {
    const saved = getSavedTutorials();
    setSavedItems(saved);
  }, []);

  const handleDelete = (id: string) => {
    deleteTutorial(id);
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const getEmoji = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("tie")) return "👔";
    if (titleLower.includes("cook") || titleLower.includes("recipe")) return "🍚";
    if (titleLower.includes("tire") || titleLower.includes("car")) return "🔧";
    if (titleLower.includes("fix") || titleLower.includes("repair")) return "🛠️";
    if (titleLower.includes("build") || titleLower.includes("make")) return "🔨";
    if (titleLower.includes("paint") || titleLower.includes("draw")) return "🎨";
    if (titleLower.includes("garden") || titleLower.includes("plant")) return "🌱";
    if (titleLower.includes("workout") || titleLower.includes("exercise")) return "💪";
    return "📚";
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600 dark:from-pink-400 dark:to-red-400">
              <Heart className="w-6 h-6 inline mr-2" style={{
                backgroundImage: 'linear-gradient(135deg, #ec4899, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }} />
              {t("saved.myTutorials")}
            </h1>
          </div>
          <Link
            to="/settings"
            className="text-sm font-semibold text-foreground/80 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
          >
            {t("settings.settings")}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {MOCK_SAVED.length > 0 ? (
          <div className="grid gap-4 animate-fadeIn">
            {MOCK_SAVED.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/20 dark:hover:bg-slate-700/70 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition">
                    {item.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t("saved.savedDate")} {item.dateSaved}
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all duration-300 flex-shrink-0 font-bold"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <p className="text-foreground/70 text-xl font-semibold">
              {t("saved.noSaved")}
            </p>
            <p className="text-foreground/50 text-sm mt-2">
              {t("saved.noSavedDesc")}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("saved.startExploring")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
