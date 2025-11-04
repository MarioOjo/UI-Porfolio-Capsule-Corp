// LoadingSpinner.js
import { FaBolt, FaDragon } from "react-icons/fa";

const LoadingSpinner = ({ size = "medium", text = "Loading...", fullScreen = false, theme = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xlarge: "text-xl"
  };

  const themeConfig = {
    default: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-500"
    },
    dbz: {
      bg: "bg-orange-100",
      text: "text-orange-600", 
      border: "border-orange-500"
    },
    capsule: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-500"
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.default;

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Icon */}
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 rounded-full ${currentTheme.border} border-4 opacity-30`}></div>
        <div className={`absolute inset-0 rounded-full ${currentTheme.border} border-4 border-t-transparent animate-spin`}></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {theme === 'dbz' ? (
            <FaDragon className={`${currentTheme.text} ${size === 'small' ? 'text-sm' : 'text-lg'}`} />
          ) : (
            <FaBolt className={`${currentTheme.text} ${size === 'small' ? 'text-sm' : 'text-lg'}`} />
          )}
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className={`mt-4 ${currentTheme.text} ${textSizes[size]} font-semibold saiyan-body-base`}>
          {text}
        </div>
      )}

      {/* Pulsing Dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 ${currentTheme.bg} rounded-full animate-pulse`}
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;