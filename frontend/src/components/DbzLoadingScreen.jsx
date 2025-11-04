// DBZLoadingScreen.js
import { FaBolt, FaDragon, FaShieldAlt, FaCapsules, FaDumbbell, FaShoppingCart, FaUser, FaCog, FaUsers, FaCrown, FaFistRaised, FaSearch } from "react-icons/fa";

const DBZLoadingScreen = ({ title, message, type, user, isDarkMode }) => {
  const getLoadingIcon = () => {
    const icons = {
      energy: <FaBolt className="text-yellow-400" />,
      scouter: <FaSearch className="text-blue-400" />,
      battle: <FaShieldAlt className="text-red-500" />,
      capsule: <FaCapsules className="text-green-400" />,
      training: <FaDumbbell className="text-purple-400" />,
      cart: <FaShoppingCart className="text-orange-400" />,
      secure: <FaShieldAlt className="text-green-500" />,
      wishlist: <FaUser className="text-pink-400" />,
      auth: <FaUser className="text-blue-400" />,
      profile: <FaUser className="text-indigo-400" />,
      admin: <FaCog className="text-gray-400" />,
      community: <FaUsers className="text-purple-500" />,
      arena: <FaFistRaised className="text-red-500" />,
      dragon: <FaDragon className="text-orange-500" />,
      default: <FaBolt className="text-yellow-400" />
    };
    return icons[type] || icons.default;
  };

  const getBackgroundClass = () => {
    return isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' 
      : 'bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100';
  };

  const getTextClass = () => {
    return isDarkMode ? 'text-white' : 'text-gray-900';
  };

  const getSubtextClass = () => {
    return isDarkMode ? 'text-gray-300' : 'text-gray-600';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getBackgroundClass()} transition-colors duration-300`}>
      <div className="text-center max-w-md mx-4">
        {/* Animated Icon */}
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="text-6xl animate-pulse">
              {getLoadingIcon()}
            </div>
            <div className="absolute inset-0 text-6xl animate-ping opacity-20">
              {getLoadingIcon()}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${getTextClass()} saiyan-title-lg`}>
          {title}
        </h1>

        {/* Message */}
        <p className={`text-lg mb-6 ${getSubtextClass()} saiyan-body-base`}>
          {message}
        </p>

        {/* User Greeting */}
        {user && (
          <div className="mb-6">
            <p className={`text-sm ${getSubtextClass()} saiyan-body-sm`}>
              Welcome back, <span className="font-semibold text-yellow-400">{user.displayName || user.name || 'Warrior'}</span>!
            </p>
          </div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Power Level Indicator */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full animate-pulse"
              style={{
                width: '65%',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            ></div>
          </div>
          <p className={`text-xs ${getSubtextClass()} saiyan-body-xs`}>
            CHARGING KI ENERGY: 65%
          </p>
        </div>

        {/* Fun DBZ-themed Tips */}
        <div className="mt-6">
          <p className={`text-xs ${getSubtextClass()} saiyan-body-xs italic`}>
            {type === 'products' && "💡 Pro tip: Use the scouter to filter by power level!"}
            {type === 'battle-gear' && "⚔️ Remember: True strength comes from within!"}
            {type === 'capsules' && "🏠 Portable homes and vehicles at your fingertips!"}
            {type === 'training' && "💪 Push beyond your limits to achieve new forms!"}
            {type === 'cart' && "📦 Your legendary gear is being prepared for delivery!"}
            {type === 'auth' && "🔐 Secure authentication for elite warriors only!"}
            {!['products', 'battle-gear', 'capsules', 'training', 'cart', 'auth'].includes(type) && 
             "✨ Capsule Corp: Innovating for a better tomorrow!"}
          </p>
        </div>

        {/* Dragon Ball Collector Hint */}
        <div className="mt-4">
          <p className={`text-xs ${getSubtextClass()} saiyan-body-xs`}>
            Collect all 7 Dragon Balls for exclusive rewards! 🐉
          </p>
        </div>
      </div>
    </div>
  );
};

export default DBZLoadingScreen;