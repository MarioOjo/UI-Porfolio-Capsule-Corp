import { useEffect, useState } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import { useTheme } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

function App() {
  const { handleRedirectResult } = useGoogleAuth();
  const { isDarkMode } = useTheme();
  const [appLoaded, setAppLoaded] = useState(false);
  const themeClass = isDarkMode ? 'dark' : 'light';

  usePerformanceMonitor('App');

  useEffect(() => {
    console.log('🚀 App component mounted');
    
    // Handle Google OAuth redirect result when app loads
    const handleAuthRedirect = async () => {
      return (
        <ErrorBoundary>
          <div className={`app-root flex flex-col ${themeClass}`} style={{ height: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <main
              className="app-main flex-1 flex flex-col w-full overflow-x-hidden"
              style={{ overflowY: 'auto', height: '100%' }}
            >
              <AnimatedRoutes />
            </main>
            <Footer className="mt-auto" />
          </div>
        </ErrorBoundary>
      );
    };
  }, [handleRedirectResult, themeClass]);

  // Add loading state if needed
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

  return (
    <ErrorBoundary>
      <div className={`app-root flex flex-col ${themeClass}`} style={{ height: '100vh', overflow: 'hidden' }}>
        <Navbar />
        <main
          className="app-main flex-1 flex flex-col w-full overflow-x-hidden"
          style={{ overflowY: 'auto', height: '100%' }}
        >
          <AnimatedRoutes />
        </main>
        <Footer className="mt-auto" />
      </div>
    </ErrorBoundary>
  );
}

export default App;