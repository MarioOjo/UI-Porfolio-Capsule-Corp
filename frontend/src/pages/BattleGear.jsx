import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import { FaShieldAlt, FaFireAlt, FaFistRaised, FaEye, FaBolt, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';

function BattleGear() {
  const { isDarkMode } = useTheme();
  const [battleGearProducts, setBattleGearProducts] = useState([]);
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
      brand: isDarkMode ? 'text-red-400' : 'text-[#3B4CCA]'
    }
  };

  const fetchBattleGearProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/api/products?category=Battle Gear');
      setBattleGearProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching Battle Gear products:', err);
      setError('Failed to load Battle Gear products');
      setBattleGearProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBattleGearProducts();
  }, [fetchBattleGearProducts]);

  const battlePhilosophy = [
    {
      icon: FaFistRaised,
      title: "HONOR IN BATTLE",
      description: "A true warrior's strength comes not just from power, but from the nobility of their cause.",
      color: "text-red-500"
    },
    {
      icon: FaUserShield,
      title: "PROTECT THE INNOCENT",
      description: "The strongest warriors use their power to defend those who cannot defend themselves.",
      color: "text-blue-500"
    },
    {
      icon: FaBolt,
      title: "NEVER GIVE UP",
      description: "Even when facing impossible odds, a warrior's spirit burns brightest in the darkest hour.",
      color: "text-yellow-500"
    }
  ];

  const gearCategories = [
    {
      icon: FaShieldAlt,
      title: "ARMOR & DEFENSE",
      description: "Advanced protective gear including battle armor, energy shields, and defensive accessories.",
      color: "text-blue-500",
      features: [
        "Saiyan battle armor series",
        "Energy barrier generators",
        "Combat boots and gloves"
      ]
    },
    {
      icon: FaFireAlt,
      title: "WEAPONS & TOOLS",
      description: "High-tech weaponry and combat tools designed for elite warriors and defenders.",
      color: "text-red-500",
      features: [
        "Energy blade weapons",
        "Power gauntlets",
        "Legendary artifacts"
      ]
    },
    {
      icon: FaEye,
      title: "TACTICAL GEAR",
      description: "Advanced tactical equipment for reconnaissance, analysis, and strategic advantage.",
      color: "text-green-500",
      features: [
        "Elite Scouter technology",
        "Battle analysis systems",
        "Communication devices"
      ]
    }
  ];

  const legendaryWisdom = {
    goku: [
      "Power comes in response to a need, not a desire",
      "I am the hope of the omniverse!",
      "The enemy's greatest disadvantage is their arrogance",
      "Sometimes the strongest people aren't born to be the strongest",
      "I don't fight for good, and I don't fight for evil. I fight for fun!"
    ],
    vegeta: [
      "I am the Prince of all Saiyans!",
      "Strength is the only thing that matters in this world",
      "I will not let you destroy my world!",
      "There is no such thing as a free lunch",
      "I've reserved something special for you... a technique you can't deflect!"
    ]
  };

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white to-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaShieldAlt className="text-red-600 text-2xl sm:text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-saiyan text-center mb-3 sm:mb-4 leading-tight">
              LEGENDARY BATTLE GEAR
            </h1>
            <p className="text-lg sm:text-xl text-red-100 text-center max-w-3xl mx-auto leading-relaxed">
              Arm yourself with the finest combat equipment in the universe. From Saiyan armor to energy weapons - gear fit for legends!
            </p>
          </div>
        </div>

        {/* Battle Philosophy */}
        <div className={`rounded-2xl shadow-lg mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan mb-4 sm:mb-6 text-center ${themeClasses.text.brand}`}>
              THE WARRIOR'S CODE
            </h2>
            <div className="mobile-grid gap-6 sm:gap-8">
              {battlePhilosophy.map((philosophy, index) => (
                <div key={index} className="text-center">
                  <philosophy.icon className={`text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 ${philosophy.color}`} />
                  <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-2 ${themeClasses.text.primary}`}>
                    {philosophy.title}
                  </h3>
                  <p className={themeClasses.text.secondary}>
                    {philosophy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gear Categories */}
        <div className="mobile-grid gap-6 mb-8 sm:mb-12">
          {gearCategories.map((category, index) => (
            <div key={index} className={`p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all ${themeClasses.card}`}>
              <div className="flex items-center mb-3 sm:mb-4">
                <category.icon className={`text-2xl sm:text-3xl mr-3 sm:mr-4 ${category.color}`} />
                <h3 className={`text-lg sm:text-xl font-bold font-saiyan ${themeClasses.text.brand}`}>
                  {category.title}
                </h3>
              </div>
              <p className={`${themeClasses.text.secondary} mb-3 sm:mb-4`}>
                {category.description}
              </p>
              <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan ${themeClasses.text.brand}`}>
              WARRIOR EQUIPMENT
            </h2>
            <Link
              to="/products?category=battle-gear"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-saiyan font-bold text-sm sm:text-base kamehameha-glow"
            >
              VIEW ALL GEAR
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                LOADING BATTLE GEAR...
              </h3>
              <p className={themeClasses.text.muted}>
                Preparing legendary equipment
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className={`text-4xl sm:text-6xl mx-auto mb-4 text-red-500`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                FAILED TO LOAD GEAR
              </h3>
              <p className={`${themeClasses.text.muted} mb-4`}>
                {error}
              </p>
              <button
                onClick={fetchBattleGearProducts}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
              >
                TRY AGAIN
              </button>
            </div>
          ) : battleGearProducts.length > 0 ? (
            <div className="mobile-grid gap-6">
              {battleGearProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaShieldAlt className={`text-4xl sm:text-6xl mx-auto mb-4 ${themeClasses.text.muted}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClasses.text.muted}`}>
                NO BATTLE GEAR FOUND
              </h3>
              <p className={themeClasses.text.muted}>
                No equipment available at this time
              </p>
            </div>
          )}
        </div>

        {/* Legend Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-500 mb-8 ${
          isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
        }`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-3 sm:mb-4">
              <FaBolt className="text-yellow-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
              <h3 className={`text-xl sm:text-2xl font-bold font-saiyan ${
                isDarkMode ? 'text-white' : 'text-yellow-800'
              }`}>
                LEGENDARY WARRIOR WISDOM
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
                }`}>
                  GOKU'S TEACHINGS
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {legendaryWisdom.goku.map((wisdom, index) => (
                    <li key={index} className={`flex items-start space-x-2 text-sm sm:text-base ${
                      isDarkMode ? 'text-yellow-200' : 'text-yellow-700'
                    }`}>
                      <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                      <span className="italic">"{wisdom}"</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
                }`}>
                  VEGETA'S PRIDE
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {legendaryWisdom.vegeta.map((wisdom, index) => (
                    <li key={index} className={`flex items-start space-x-2 text-sm sm:text-base ${
                      isDarkMode ? 'text-yellow-200' : 'text-yellow-700'
                    }`}>
                      <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                      <span className="italic">"{wisdom}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className={`rounded-2xl p-4 sm:p-6 ${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } shadow-lg border-2 border-red-500`}>
            <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-3 sm:mb-4 ${themeClasses.text.primary}`}>
              READY TO BECOME A LEGEND?
            </h3>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${themeClasses.text.secondary}`}>
              Equip yourself with battle-tested gear trusted by Earth's mightiest warriors
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/products?category=battle-gear"
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-saiyan font-bold hover:scale-105 transition-all kamehameha-glow text-sm sm:text-base"
              >
                SHOP BATTLE GEAR
              </Link>
              <Link
                to="/training"
                className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-saiyan font-bold hover:bg-gray-700 transition-all text-sm sm:text-base"
              >
                TRAIN LIKE A SAIYAN
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className={`mt-6 sm:mt-8 rounded-xl p-3 sm:p-4 ${
          isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
        } border`}>
          <div className="flex items-start space-x-2">
            <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className={`font-bold text-sm sm:text-base ${
                isDarkMode ? 'text-red-400' : 'text-red-800'
              }`}>
                BATTLE GEAR SAFETY WARNING
              </h4>
              <p className={`text-xs sm:text-sm mt-1 ${
                isDarkMode ? 'text-red-300' : 'text-red-700'
              }`}>
                All battle gear requires proper training and certification. Use only in designated training areas or authorized combat scenarios. Capsule Corp is not responsible for misuse or unauthorized modifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
BattleGear.displayName = 'BattleGearPage';

export default BattleGear;