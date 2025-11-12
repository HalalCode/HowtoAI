import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-900/10 dark:from-background dark:via-slate-950 dark:to-purple-950/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="text-center space-y-8 px-4 max-w-2xl">
        <div className="space-y-4">
          <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-bounce" style={{animationDuration: '3s'}}>
            404
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Oops! Page not found
          </h1>
          <p className="text-xl text-foreground/70 max-w-lg mx-auto">
            We couldn't find the page you're looking for. Don't worry, let's get you back on track.
          </p>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
          <p className="text-foreground/60 mb-6">
            The path <code className="bg-white/20 dark:bg-white/10 px-3 py-1 rounded text-pink-500 font-mono text-sm">{location.pathname}</code> doesn't exist
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
