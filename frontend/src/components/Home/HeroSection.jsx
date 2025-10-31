import { useNavigate } from "react-router-dom"; // Add this import
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import './HeroSection.css';

function HeroSection() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this hook

  const handleShopNow = () => {
    console.log('🛍️ Shop Now clicked - navigating to /products');
    navigate('/products');
  };

  const handleWishlist = () => {
    console.log('💖 Wishlist clicked');
    navigate('/wishlist');
  };

  const handleOrderHistory = () => {
    console.log('📦 Order History clicked');
    navigate('/order-history');
  };

  return (
    <section className="section">
      <div className="overlayDark"></div>
      <div className="overlayFade"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="space-y-6 lg:space-y-8">
              <h1 className="title">
                {user ? `WELCOME BACK, WARRIOR!` : 'SUMMER SAIYAN SALE'}
              </h1>
              <p className="subtitle">
                {user 
                  ? `Ready to power up your training, ${user.displayName || 'Saiyan'}? Check out our latest gear and exclusive offers!`
                  : 'Power up your training with legendary gear! Up to 50% off battle equipment and capsule technology.'
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleShopNow}
                  className="primaryBtn kamehameha-glow"
                >
                  Shop Now
                </button>
              </div>

              {user && (
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                  <button onClick={handleWishlist} className="smallBtn kamehameha-glow">💖 My Wishlist</button>
                  <button onClick={handleOrderHistory} className="smallBtn kamehameha-glow">📦 Order History</button>
                </div>
              )}

              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
                <div className="flex space-x-3">
                  <div className="pulseOrb"></div>
                  <div className="redOrb"></div>
                  <div className="blueOrb"></div>
                  <div className="greenOrb"></div>
                </div>
                <span className="collectText">Collect all 7 Dragon Balls</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-first lg:order-last">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <img
                className="heroImage"
                src="https://res.cloudinary.com/dx8wt3el4/image/upload/v1761211841/Firefly_-photorealistic_shot_of_the_Capsule_Corporation_headquarters_from_Dragon_Ball_Z_a_ma_554083_eoqshv.jpg"
                alt="Capsule Corp Building"
                loading="eager"
              />

              <div className="decorationAccent"></div>
              <div className="decorationRed"></div>
            </div>
          </div>
        </div>
      </div>

      {/* debug button removed - no dev-only nav button present anymore */}
    </section>
  );
}

export default HeroSection;