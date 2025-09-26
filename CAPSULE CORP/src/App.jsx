import { useEffect } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";
import HomeHeader from "./components/Home/HomeHeader";
import HomeNavigation from "./components/Home/HomeNavigation";
import Footer from "./components/Footer";

function App() {
  const { handleRedirectResult } = useGoogleAuth();
  usePerformanceMonitor('App');

  useEffect(() => {
    // Handle Google OAuth redirect result when app loads
    handleRedirectResult();
  }, [handleRedirectResult]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        <HomeNavigation />
        
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;