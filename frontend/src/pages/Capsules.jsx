import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import { FaCapsules, FaRocket, FaHome, FaCogs, FaShieldAlt, FaBolt, FaSyncAlt } from 'react-icons/fa';

function Capsules() {
  const { isDarkMode } = useTheme();
  const [capsuleProducts, setCapsuleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-blue-50 to-orange-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-blue-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      brand: isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'
    }
  };

  const fetchCapsuleProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/api/products?category=Capsules');
      setCapsuleProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching Capsule products:', err);
      setError('Failed to load Capsule products');
      setCapsuleProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapsuleProducts();
  }, [fetchCapsuleProducts]);

  const features = [
    {
      icon: FaRocket,
      title: "SPACE TECH",
      description: "Advanced compression technology originally developed for space exploration missions.",
      color: "from-[#3B4CCA] to-blue-600",
      iconColor: "text-[#3B4CCA]"
    },
    {
      icon: FaHome,
      title: "PORTABLE LIVING",
      description: "Carry entire homes, workshops, and facilities wherever your adventures take you.",
      color: "from-[#FF9E00] to-orange-500",
      iconColor: "text-[#FF9E00]"
    },
    {
      icon: FaCogs,
      title: "INSTANT SETUP",
      description: "Deploy complex structures and vehicles in seconds with our one-touch activation system.",
      color: "from-green-500 to-green-600",
      iconColor: "text-green-500"
    }
  ];

  const technologyInfo = {
    howItWorks: [
      "Advanced molecular compression technology",
      "Quantum storage matrix maintains object integrity",
      "One-button activation for instant deployment",
      "Unlimited storage duration with no degradation",
      "Compatible with virtually any object or structure"
    ],
    safetyFeatures: [
      "Fail-safe mechanisms prevent accidental activation",
      "Biometric locks for secure capsule access",
      "Emergency extraction protocols",
      "Environmental protection for stored items",
      "99.99% success rate over millions of uses"
    ]
  };

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaCapsules className="text-[#3B4CCA] text-2xl sm:text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-saiyan text-center mb-3 sm:mb-4 leading-tight">
              CAPSULE TECHNOLOGY
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 text-center max-w-3xl mx-auto leading-relaxed">
              Revolutionary Hoi-Poi Capsule technology - store anything from motorcycles to entire houses in portable capsules!
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mobile-grid gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <div key={index} className={`rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all ${themeClasses.card}`}>
              <div className="flex items-center mb-3 sm:mb-4">
                <feature.icon className={`text-2xl sm:text-3xl mr-3 sm:mr-4 ${feature.iconColor}`} />
                <h3 className={`text-lg sm:text-xl font-bold font-saiyan ${themeClasses.text.brand}`}>
                  {feature.title}
                </h3>
              </div>
              <p className={themeClasses.text.secondary}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan ${themeClasses.text.brand}`}>
              CAPSULE PRODUCTS
            </h2>
            <Link
              to="/products?category=capsules"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold text-sm sm:text-base kamehameha-glow"
            >
              VIEW ALL CAPSULES
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                LOADING CAPSULES...
              </h3>
              <p className={themeClasses.text.muted}>
                Preparing capsule inventory
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaCapsules className={`text-6xl mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                FAILED TO LOAD CAPSULES
              </h3>
              <p className={`${themeClasses.text.muted} mb-4`}>
                {error}
              </p>
              <button
                onClick={fetchCapsuleProducts}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
              >
                TRY AGAIN
              </button>
            </div>
          ) : capsuleProducts.length > 0 ? (
            <div className="mobile-grid gap-6">
              {capsuleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCapsules className={`text-6xl mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                NO CAPSULES AVAILABLE
              </h3>
              <p className={themeClasses.text.muted}>
                Check back soon for new capsule technology
              </p>
            </div>
          )}
        </div>

        {/* Technology Info */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 ${themeClasses.card}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className={`text-xl sm:text-2xl font-bold font-saiyan mb-4 sm:mb-6 ${themeClasses.text.brand}`}>
              HOI-POI CAPSULE TECHNOLOGY
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <FaBolt className="text-yellow-500 text-lg sm:text-xl mr-2" />
                  <h4 className={`text-lg font-bold font-saiyan ${themeClasses.text.primary}`}>
                    HOW IT WORKS
                  </h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {technologyInfo.howItWorks.map((item, index) => (
                    <li key={index} className={`flex items-start space-x-2 text-sm sm:text-base ${themeClasses.text.secondary}`}>
                      <FaSyncAlt className="text-blue-500 mt-1 flex-shrink-0 text-xs sm:text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <FaShieldAlt className="text-green-500 text-lg sm:text-xl mr-2" />
                  <h4 className={`text-lg font-bold font-saiyan ${themeClasses.text.primary}`}>
                    SAFETY FEATURES
                  </h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {technologyInfo.safetyFeatures.map((item, index) => (
                    <li key={index} className={`flex items-start space-x-2 text-sm sm:text-base ${themeClasses.text.secondary}`}>
                      <FaShieldAlt className="text-green-500 mt-1 flex-shrink-0 text-xs sm:text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Innovation Timeline */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-slate-600">
              <h4 className={`text-lg font-bold font-saiyan mb-4 sm:mb-6 text-center ${themeClasses.text.brand}`}>
                CAPSULE CORP INNOVATION TIMELINE
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className={`p-3 sm:p-4 rounded-lg ${
                  isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                }`}>
                  <div className="text-2xl sm:text-3xl mb-2">🚀</div>
                  <div className={`font-bold text-sm sm:text-base ${themeClasses.text.primary}`}>Age 550</div>
                  <div className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}>First Capsule Prototype</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}>
                  <div className="text-2xl sm:text-3xl mb-2">🏠</div>
                  <div className={`font-bold text-sm sm:text-base ${themeClasses.text.primary}`}>Age 650</div>
                  <div className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}>Home Capsule System</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${
                  isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
                }`}>
                  <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                  <div className={`font-bold text-sm sm:text-base ${themeClasses.text.primary}`}>Age 712</div>
                  <div className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}>Instant Deployment Tech</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className={`rounded-2xl p-6 sm:p-8 ${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } shadow-lg border-2 border-orange-400`}>
            <h3 className={`text-xl sm:text-2xl font-bold font-saiyan mb-3 sm:mb-4 ${themeClasses.text.primary}`}>
              READY TO REVOLUTIONIZE YOUR STORAGE?
            </h3>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${themeClasses.text.secondary}`}>
              Join millions of satisfied customers using Capsule Corp technology worldwide
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/products?category=capsules"
                className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-saiyan font-bold hover:scale-105 transition-all kamehameha-glow text-sm sm:text-base"
              >
                SHOP CAPSULES
              </Link>
              <Link
                to="/contact"
                className="bg-gray-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-saiyan font-bold hover:bg-gray-700 transition-all text-sm sm:text-base"
              >
                CONTACT EXPERT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
Capsules.displayName = 'CapsulesPage';

export default Capsules;