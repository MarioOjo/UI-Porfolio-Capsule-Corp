import { useEffect } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Navbar from "./components/Navbar/Navbar";
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
  <Navbar />
        
        <main className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </main>
        
        <Footer className="mt-auto" />
      </div>
    </ErrorBoundary>
  );
}

export default App;