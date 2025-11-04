import { useEffect, useMemo } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
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

  // ------------------ Sync theme globally ------------------
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      body.style.backgroundColor = "#0f172a"; // Match dark theme
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      body.style.backgroundColor = "#ffffff"; // Match light theme
    }
  }, [isDarkMode]);

  // ------------------ Handle Google OAuth Redirect (once on mount) ------------------
  useEffect(() => {
    handleRedirectResult().catch(err => {
      // Silent fail - error already handled in useGoogleAuth
    });
  }, [handleRedirectResult]);

  // ------------------ Prevent horizontal scroll ------------------
  useEffect(() => {
    // Ensure no initial scroll issues
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  // ------------------ App Layout ------------------
  return (
    <ErrorBoundary>
      <div className="app-root">
        <Navbar />
        <AnalyticsConsent />
        <RouteTracker />
        <main className="app-main">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;