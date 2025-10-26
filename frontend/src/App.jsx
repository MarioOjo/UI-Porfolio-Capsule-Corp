import { useEffect, useState } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

function App() {
  const { handleRedirectResult } = useGoogleAuth();
  const [appLoaded, setAppLoaded] = useState(false);
  
  usePerformanceMonitor('App');

  useEffect(() => {
    console.log('🚀 App component mounted');
    
    // Handle Google OAuth redirect result when app loads
    const handleAuthRedirect = async () => {
      try {
        await handleRedirectResult();
        console.log('✅ Google OAuth redirect handled');
      } catch (error) {
        console.error('❌ Google OAuth redirect error:', error);
      } finally {
        setAppLoaded(true);
      }
    };

    handleAuthRedirect();

    // Cleanup function
    return () => {
      console.log('🔄 App component unmounting');
    };
  }, [handleRedirectResult]);

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
      <div className="min-h-screen flex flex-col bg-white">
        {/* Debug overlay - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-0 left-0 z-50 bg-yellow-500 text-black text-xs px-2 py-1 rounded-br">
            🚧 Dev Mode
          </div>
        )}
        
        <Navbar />
        
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        
        <Footer className="mt-auto" />
      </div>
    </ErrorBoundary>
  );
}

export default App;