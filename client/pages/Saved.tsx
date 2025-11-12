import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/context";

interface SavedItem {
  id: string;
  title: string;
  query: string;
  dateSaved: string;
  thumbnail: string;
}

const MOCK_SAVED: SavedItem[] = [
  {
    id: "1",
    title: "How to Tie a Tie",
    query: "tie a tie",
    dateSaved: "Today",
    thumbnail: "👔",
  },
  {
    id: "2",
    title: "How to Cook Rice",
    query: "cook rice",
    dateSaved: "Yesterday",
    thumbnail: "🍚",
  },
  {
    id: "3",
    title: "How to Change a Tire",
    query: "change a tire",
    dateSaved: "2 days ago",
    thumbnail: "🔧",
  },
];

export default function Saved() {
  const navigate = useNavigate();
  const { t } = useI18n();

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
            <h1 className="text-2xl font-bold text-foreground">
              <Heart className="w-6 h-6 inline mr-2 text-secondary" />
              {t("saved.myTutorials")}
            </h1>
          </div>
          <Link
            to="/settings"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
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
                className="bg-card border border-input hover:border-primary hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 cursor-pointer group"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-primary/20 transition">
                    {item.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition">
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
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition flex-shrink-0"
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
            <div className="text-4xl mb-4">📚</div>
            <p className="text-foreground/70 text-lg">
              No saved tutorials yet
            </p>
            <p className="text-foreground/50 text-sm mt-2">
              Save your favorite guides to access them later
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Start Exploring
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
