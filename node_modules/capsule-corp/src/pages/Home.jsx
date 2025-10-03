import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationContext";
import useSEO from "../hooks/useSEO";
import HeroSection from "../components/Home/HeroSection";
import ProductCarousel from "../components/Home/ProductCarousel";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import FeaturesSection from "../components/Home/FeaturesSection";

function Home() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { showSuccess } = useNotifications();

  // SEO optimization for homepage
  useSEO({
    title: "Capsule Corp - Premium Dragon Ball Z Tech & Gear",
    description: "Official Capsule Corporation store. Shop premium Dragon Ball Z technology, battle gear, training equipment, and capsules. Powered by Bulma's genius inventions!",
    keywords: "Dragon Ball Z, Capsule Corp, anime merchandise, battle gear, training equipment, tech gadgets, DBZ, Bulma, Vegeta",
    url: window.location.href,
    type: "website"
  });

  // Welcome message for authenticated users
  useEffect(() => {
    if (user) {
      const hasShownWelcome = sessionStorage.getItem('welcomeShown');
      if (!hasShownWelcome) {
        showSuccess(`Welcome back, ${user.displayName || user.email}! 🐉`, {
          duration: 4000
        });
        sessionStorage.setItem('welcomeShown', 'true');
      }
    }
  }, [user, showSuccess]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <HeroSection />
      <ProductCarousel />
      <FeaturedProducts />
      <FeaturesSection />
    </div>
  );
}

export default Home;