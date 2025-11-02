import { useEffect, useState } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import { useTheme } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import RouteTracker from "./components/RouteTracker";
import AnalyticsConsent from "./components/AnalyticsConsent/AnalyticsConsent";

function App() {
  const { handleRedirectResult } = useGoogleAuth();
  const { isDarkMode } = useTheme();
  const [appLoaded, setAppLoaded] = useState(false);

  usePerformanceMonitor("App");

  // ------------------ Sync theme globally ------------------
  useEffect(() => {
    const root = document.documentElement; // <html> element
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ------------------ Handle Google OAuth Redirect ------------------
  useEffect(() => {
    console.log("🚀 App component mounted");

    const handleAuthRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (err) {
        console.error("Google redirect handling error:", err);
      } finally {
        setAppLoaded(true);
      }
    };

    handleAuthRedirect();
  }, [handleRedirectResult]);

  // ------------------ Loading State ------------------
  if (!appLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3B4CCA] mx-auto mb-4"></div>
          <p className="text-gray-600 font-saiyan">Loading Capsule Corp...</p>
        </div>
      </div>
    );
  }

  // ------------------ App Layout ------------------
  return (
    <ErrorBoundary>
      <div className="app-root flex flex-col min-h-screen">
        <Navbar />
        <AnalyticsConsent />
        <RouteTracker />
        <main className="app-main flex-1 flex flex-col w-full overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
