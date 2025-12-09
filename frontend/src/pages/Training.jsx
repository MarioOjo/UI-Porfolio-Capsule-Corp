import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import { FaDumbbell, FaBolt, FaMedal, FaRocket, FaClock, FaShieldAlt } from 'react-icons/fa';

function Training() {
  const { isDarkMode } = useTheme();
  const [trainingProducts, setTrainingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainingProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch('/api/products?category=Training');
        // Handle both { products: [...] } and direct array responses
        const productsList = Array.isArray(response) ? response : (response.products || []);
        setTrainingProducts(productsList);
      } catch (err) {
        console.error('Error fetching Training products:', err);
        setError('Failed to load Training products');
        setTrainingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingProducts();
  }, []);

  // Use CSS variables for consistent theming
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
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      brand: isDarkMode ? 'text-white' : 'text-[#3B4CCA]'
    },
    warning: isDarkMode 
      ? 'bg-red-900/20 text-red-200' 
      : 'bg-red-50 text-red-700'
  };

  return (
    <div className={`min-h-0 py-8 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white to-orange-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaDumbbell className="text-orange-600 text-2xl sm:text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-saiyan text-center mb-4 leading-tight">
              SAIYAN TRAINING GEAR
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 text-center max-w-3xl mx-auto leading-relaxed">
              Push beyond your limits with legendary training equipment designed for warriors who refuse to accept defeat!
            </p>
          </div>
        </div>

        {/* Training Philosophy */}
        <div className={`rounded-2xl shadow-lg mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan mb-6 text-center ${themeClasses.text.brand}`}>
              THE SAIYAN WAY
            </h2>
            <div className="mobile-grid gap-6 sm:gap-8">
              <div className="text-center">
                <FaBolt className="text-4xl sm:text-5xl text-yellow-500 mx-auto mb-4" />
                <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-2 ${themeClasses.text.primary}`}>
                  SURPASS YOUR LIMITS
                </h3>
                <p className={themeClasses.text.secondary}>
                  Every Saiyan knows that true strength comes from pushing beyond what seems possible.
                </p>
              </div>
              <div className="text-center">
                <FaRocket className="text-4xl sm:text-5xl text-blue-500 mx-auto mb-4" />
                <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-2 ${themeClasses.text.primary}`}>
                  CONSTANT EVOLUTION
                </h3>
                <p className={themeClasses.text.secondary}>
                  Growth never stops. Each battle, each training session makes you stronger.
                </p>
              </div>
              <div className="text-center">
                <FaMedal className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
                <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-2 ${themeClasses.text.primary}`}>
                  LEGENDARY STATUS
                </h3>
                <p className={themeClasses.text.secondary}>
                  Transform from ordinary warrior to legend with the right training and determination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Categories */}
        <div className="mobile-grid gap-6 mb-8 sm:mb-12">
          <div className={`p-4 sm:p-6 rounded-xl ${themeClasses.card} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaDumbbell className="text-red-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
              <h3 className={`text-lg sm:text-xl font-bold font-saiyan ${themeClasses.text.brand}`}>
                STRENGTH TRAINING
              </h3>
            </div>
            <p className={`${themeClasses.text.secondary} mb-4`}>
              Build incredible physical power with gravity chambers, weighted training gear, and resistance equipment.
            </p>
            <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
              <li>• Gravity multipliers up to 500x</li>
              <li>• Adjustable training weights</li>
              <li>• Power level monitoring</li>
            </ul>
          </div>

          <div className={`p-4 sm:p-6 rounded-xl ${themeClasses.card} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaBolt className="text-yellow-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
              <h3 className={`text-lg sm:text-xl font-bold font-saiyan ${themeClasses.text.brand}`}>
                KI MASTERY
              </h3>
            </div>
            <p className={`${themeClasses.text.secondary} mb-4`}>
              Master energy manipulation and spiritual power with specialized ki training equipment.
            </p>
            <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
              <li>• Ki-responsive training orbs</li>
              <li>• Meditation platforms</li>
              <li>• Energy focus crystals</li>
            </ul>
          </div>

          <div className={`p-4 sm:p-6 rounded-xl ${themeClasses.card} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaClock className="text-purple-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
              <h3 className={`text-lg sm:text-xl font-bold font-saiyan ${themeClasses.text.brand}`}>
                TIME TRAINING
              </h3>
            </div>
            <p className={`${themeClasses.text.secondary} mb-4`}>
              Accelerate your training with time manipulation chambers and temporal training methods.
            </p>
            <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
              <li>• Hyperbolic Time Chamber access</li>
              <li>• Time dilation training</li>
              <li>• Accelerated recovery systems</li>
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan ${themeClasses.text.brand}`}>
              TRAINING EQUIPMENT
            </h2>
            <Link
              to="/products?category=training"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-saiyan font-bold text-sm sm:text-base whitespace-nowrap"
            >
              VIEW ALL GEAR
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                LOADING TRAINING GEAR...
              </h3>
              <p className={themeClasses.text.muted}>
                Preparing legendary equipment
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaDumbbell className={`text-6xl mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                FAILED TO LOAD GEAR
              </h3>
              <p className={themeClasses.text.muted}>
                Please try again later
              </p>
            </div>
          ) : trainingProducts.length > 0 ? (
            <div className="mobile-grid gap-6">
              {trainingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaDumbbell className={`text-6xl mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                NO TRAINING GEAR AVAILABLE
              </h3>
              <p className={themeClasses.text.muted}>
                Check back soon for new equipment
              </p>
            </div>
          )}
        </div>

        {/* Warning Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 ${themeClasses.warning}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-red-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
              <h3 className={`text-xl sm:text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                TRAINING SAFETY WARNING
              </h3>
            </div>
            <div className="mobile-grid gap-6 sm:gap-8">
              <div>
                <h4 className={`text-base sm:text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                  EXTREME TRAINING HAZARDS
                </h4>
                <ul className="space-y-2">
                  <li>• Gravity chambers can cause serious injury or death</li>
                  <li>• Time chamber training is mentally exhausting</li>
                  <li>• Always have senzu beans for emergency healing</li>
                  <li>• Never train alone in extreme conditions</li>
                  <li>• Respect your physical and mental limits</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-base sm:text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                  RECOMMENDED PREPARATION
                </h4>
                <ul className="space-y-2">
                  <li>• Start with lower gravity/weight settings</li>
                  <li>• Have medical support on standby</li>
                  <li>• Mental preparation is as important as physical</li>
                  <li>• Train progressively - patience brings results</li>
                  <li>• Remember: "A true warrior fights not because he hates what is in front of him, but because he loves what is behind him"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Training;