import { FaRocket, FaShieldAlt, FaStar, FaUsers, FaClock, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";

function FeaturesSection() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      icon: FaRocket,
      title: "Instant Transmission Shipping",
      description: "Get your gear delivered faster than Goku's teleportation",
      gradient: "from-[#3B4CCA] to-blue-600",
      stats: "2-day delivery",
      link: "/products"
    },
    {
      icon: FaShieldAlt,
      title: "Battle-Tested Quality", 
      description: "Every product survives planet-destroying explosions",
      gradient: "from-[#FF9E00] to-red-500",
      stats: "99.9% survival rate",
      link: "/products?category=Battle Gear"
    },
    {
      icon: FaStar,
      title: "Legendary Support",
      description: "24/7 customer service by Z-Fighter experts",
      gradient: "from-[#FFD700] to-yellow-500",
      stats: "4.9/5 rating",
      link: "/contact"
    }
  ];

  // Additional features for authenticated users
  const userFeatures = [
    {
      icon: FaUsers,
      title: "Saiyan Community",
      description: "Connect with fellow warriors and share training tips",
      gradient: "from-purple-500 to-purple-600",
      stats: "50K+ members",
      link: "/profile"
    },
    {
      icon: FaClock,
      title: "Order Tracking",
      description: "Real-time updates on your capsule deliveries",
      gradient: "from-green-500 to-green-600", 
      stats: "Live updates",
      link: "/profile/orders"
    },
    {
      icon: FaPhoneAlt,
      title: "Priority Support",
      description: "VIP customer service for registered warriors",
      gradient: "from-red-500 to-red-600",
      stats: "< 1min response",
      link: "/contact"
    }
  ];

  const displayFeatures = user ? [...features, ...userFeatures] : features;

  return (
    <section className={`py-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`} id="features">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className={`text-4xl font-bold mb-4 font-saiyan ${
            isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'
          }`}>
            {user ? 'Your Saiyan Benefits' : 'Why Choose Capsule Corp?'}
          </h3>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {user 
              ? 'As a registered warrior, you get access to exclusive benefits and premium features'
              : 'Join the ranks of legendary warriors who trust Capsule Corp technology'
            }
          </p>
        </div>

        <div className={`grid grid-cols-1 ${
          user ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'
        } gap-8 lg:gap-12`}>
          {displayFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link 
                key={feature.title} 
                to={feature.link}
                className="text-center group block"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 relative`}>
                  <IconComponent className="text-white text-2xl" />
                  
                  {/* Stats badge */}
                  <div className="absolute -bottom-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {feature.stats}
                  </div>
                </div>
                
                <h4 className={`text-xl lg:text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h4>
                
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'
                } font-semibold text-sm`}>
                  Learn More →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="text-center mt-16">
            <div className={`inline-block p-8 rounded-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600' 
                : 'bg-white border border-gray-200'
            } shadow-xl`}>
              <h4 className={`text-2xl font-bold mb-4 font-saiyan ${
                isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'
              }`}>
                Ready to Join the Elite?
              </h4>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create an account to unlock exclusive benefits and premium features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth?tab=signup"
                  className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded-xl font-bold hover:from-[#FF9E00] hover:to-[#3B4CCA] transition-all shadow-lg"
                >
                  Create Account
                </a>
                <a
                  href="/auth"
                  className={`border-2 px-8 py-3 rounded-xl font-bold transition-all ${
                    isDarkMode
                      ? 'border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-gray-900'
                      : 'border-[#3B4CCA] text-[#3B4CCA] hover:bg-[#3B4CCA] hover:text-white'
                  }`}
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesSection;