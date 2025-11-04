import { useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationContext";
import useSEO from "../hooks/useSEO";
import HeroSection from "../components/Home/HeroSection";
import ProductCarousel from "../components/Home/ProductCarousel";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import FeaturesSection from "../components/Home/FeaturesSection";

function Home() {
  const { user, authInitialized } = useAuth();
  const { isDarkMode } = useTheme();
  const { showSuccess } = useNotifications();

  // SEO optimization for homepage
  useSEO({
    title: "Capsule Corp - Premium Dragon Ball Z Tech & Gear",
    description: "Official Capsule Corporation store. Shop premium Dragon Ball Z technology, battle gear, training equipment, and capsules. Powered by Bulma's genius inventions!",
    keywords: "Dragon Ball Z, Capsule Corp, anime merchandise, battle gear, training equipment, tech gadgets, DBZ, Bulma, Vegeta, Goku, Saiyan gear",
    image: "/assets/images/capsule-corp-og.jpg",
    url: window.location.href,
    type: "website"
  });

  // Welcome message for authenticated users - memoized to prevent unnecessary re-renders
  const showWelcomeMessage = useCallback(() => {
    if (user && authInitialized) {
      const hasShownWelcome = sessionStorage.getItem('welcomeShown');
      if (!hasShownWelcome) {
        const userName = user.displayName || user.email?.split('@')[0] || 'Warrior';
        showSuccess(`Welcome back, ${userName}! Ready to power up? 🐉`, {
          duration: 4000,
          position: 'top-center'
        });
        sessionStorage.setItem('welcomeShown', 'true');
        
        // Clear welcome flag after 24 hours
        setTimeout(() => {
          sessionStorage.removeItem('welcomeShown');
        }, 24 * 60 * 60 * 1000);
      }
    }
  }, [user, authInitialized, showSuccess]);

  useEffect(() => {
    showWelcomeMessage();
  }, [showWelcomeMessage]);

  // Performance optimization: Preload critical images
  useEffect(() => {
    const preloadImages = [
      '/assets/images/hero-background.jpg',
      '/assets/images/capsule-corp-logo.png'
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Theme-based styling for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900' 
      : 'bg-gradient-to-br from-blue-50 via-orange-50 to-amber-50',
    container: isDarkMode 
      ? 'text-white' 
      : 'text-gray-900'
  };

  // Error boundary fallback for component failures
  const renderSection = (SectionComponent, sectionName) => (
    <section 
      className="w-full" 
      aria-label={sectionName}
      data-section={sectionName.toLowerCase().replace(/\s+/g, '-')}
    >
      <SectionComponent />
    </section>
  );

  return (
    <div 
      className={`min-h-0 w-full overflow-x-hidden ${themeClasses.background} ${themeClasses.container}`}
      role="main"
      aria-label="Capsule Corp Homepage"
    >
      <div className="app-main">
        <div 
          className="flex flex-col gap-6 sm:gap-8 lg:gap-12"
          data-page="home"
        >
          {renderSection(HeroSection, "Hero Section")}
          {renderSection(ProductCarousel, "Featured Products Carousel")}
          {renderSection(FeaturedProducts, "Featured Products Grid")}
          {renderSection(FeaturesSection, "Company Features")}
          
          {/* Performance monitoring marker */}
          <div 
            data-perf-marker="homepage-loaded" 
            className="sr-only"
            aria-hidden="true"
          >
            Homepage fully loaded and rendered
          </div>
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
Home.displayName = 'HomePage';

export default Home;