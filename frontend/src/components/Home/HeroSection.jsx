import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";

function HeroSection() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <section className={`relative overflow-hidden min-h-[600px] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-[#FF9E00] via-orange-400 to-red-500'
    }`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl font-saiyan">
                {user ? `WELCOME BACK, WARRIOR!` : 'SUMMER SAIYAN SALE'}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed drop-shadow-lg max-w-2xl mx-auto lg:mx-0">
                {user 
                  ? `Ready to power up your training, ${user.displayName || 'Saiyan'}? Check out our latest gear and exclusive offers!`
                  : 'Power up your training with legendary gear! Up to 50% off battle equipment and capsule technology.'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-[#FFD700] to-[#3B4CCA] text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-saiyan font-bold text-base lg:text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl text-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/battle-gear"
                  className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-saiyan font-bold text-base lg:text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl text-center"
                >
                  View Collection
                </Link>
              </div>

              {/* User-specific actions */}
              {user && (
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                  <Link
                    to="/wishlist"
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg text-sm font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
                  >
                    💖 My Wishlist
                  </Link>
                  <Link
                    to="/order-history"
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg text-sm font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
                  >
                    📦 Order History
                  </Link>
                </div>
              )}
              
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full shadow-lg border-2 border-white animate-pulse"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-[#3B4CCA] rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg border-2 border-white"></div>
                </div>
                <span className="text-white/90 font-medium drop-shadow text-sm lg:text-base">
                  Collect all 7 Dragon Balls
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 order-first lg:order-last">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <img
                className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl shadow-2xl border-4 border-white/20 object-cover"
                src="https://res.cloudinary.com/dx8wt3el4/image/upload/v1761211841/Firefly_-photorealistic_shot_of_the_Capsule_Corporation_headquarters_from_Dragon_Ball_Z_a_ma_554083_eoqshv.jpg"
                alt="Capsule Corp Building"
                loading="eager"
              />
              
              {/* Animated decorations */}
              <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full shadow-xl border-4 border-white animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-xl border-4 border-white animate-bounce"></div>
              
              {/* Power level indicator */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;