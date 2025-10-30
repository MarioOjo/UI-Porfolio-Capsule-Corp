import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import { FaShieldAlt, FaFireAlt, FaFistRaised, FaEye, FaBolt, FaUserShield } from 'react-icons/fa';

function BattleGear() {
  const { isDarkMode } = useTheme();
  const themeClass = isDarkMode ? 'dark' : 'light';
  const [battleGearProducts, setBattleGearProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBattleGearProducts = async () => {
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
    };

    fetchBattleGearProducts();
  }, []);

  return (
    <div className={`min-h-screen py-8 bg-gradient-to-br ${themeClass === 'dark' ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-12 ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-capsule-accent to-capsule-orange rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaShieldAlt className="text-red-600 text-3xl" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white font-saiyan text-center mb-4">
              LEGENDARY BATTLE GEAR
            </h1>
            <p className="text-xl text-red-100 text-center max-w-3xl mx-auto">
              Arm yourself with the finest combat equipment in the universe. From Saiyan armor to energy weapons - gear fit for legends!
            </p>
          </div>
        </div>

        {/* Battle Philosophy */}
        <div className={`rounded-2xl shadow-lg mb-12 ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="p-8">
            <h2 className={`text-3xl font-bold font-saiyan mb-6 text-center ${themeClass === 'dark' ? 'text-white' : 'text-[#3B4CCA]'}`}>
              THE WARRIOR'S CODE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaFistRaised className="text-5xl text-red-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  HONOR IN BATTLE
                </h3>
                <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  A true warrior's strength comes not just from power, but from the nobility of their cause.
                </p>
              </div>
              <div className="text-center">
                <FaUserShield className="text-5xl text-blue-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  PROTECT THE INNOCENT
                </h3>
                <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  The strongest warriors use their power to defend those who cannot defend themselves.
                </p>
              </div>
              <div className="text-center">
                <FaBolt className="text-5xl text-yellow-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${themeClass === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  NEVER GIVE UP
                </h3>
                <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Even when facing impossible odds, a warrior's spirit burns brightest in the darkest hour.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gear Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`p-6 rounded-xl ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-blue-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-[#3B4CCA]'}`}>
                ARMOR & DEFENSE
              </h3>
            </div>
            <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Advanced protective gear including battle armor, energy shields, and defensive accessories.
            </p>
            <ul className={`text-sm space-y-1 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Saiyan battle armor series</li>
              <li>• Energy barrier generators</li>
              <li>• Combat boots and gloves</li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaFireAlt className="text-red-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-[#3B4CCA]'}`}>
                WEAPONS & TOOLS
              </h3>
            </div>
            <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              High-tech weaponry and combat tools designed for elite warriors and defenders.
            </p>
            <ul className={`text-sm space-y-1 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Energy blade weapons</li>
              <li>• Power gauntlets</li>
              <li>• Legendary artifacts</li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaEye className="text-green-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-[#3B4CCA]'}`}>
                TACTICAL GEAR
              </h3>
            </div>
            <p className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Advanced tactical equipment for reconnaissance, analysis, and strategic advantage.
            </p>
            <ul className={`text-sm space-y-1 ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Elite Scouter technology</li>
              <li>• Battle analysis systems</li>
              <li>• Communication devices</li>
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-[#3B4CCA]'}`}>
              WARRIOR EQUIPMENT
            </h2>
            <Link
              to="/products?category=battle-gear"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-saiyan font-bold"
            >
              VIEW ALL GEAR
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FaShieldAlt className={`text-6xl mx-auto mb-4 animate-spin ${themeClass === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                LOADING BATTLE GEAR...
              </h3>
              <p className={`${themeClass === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Preparing legendary equipment
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaShieldAlt className={`text-6xl mx-auto mb-4 ${themeClass === 'dark' ? 'text-red-600' : 'text-red-400'}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClass === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                FAILED TO LOAD GEAR
              </h3>
              <p className={`${themeClass === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {error}
              </p>
            </div>
          ) : battleGearProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {battleGearProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaShieldAlt className={`text-6xl mx-auto mb-4 ${themeClass === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${themeClass === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                NO BATTLE GEAR FOUND
              </h3>
              <p className={`${themeClass === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                No equipment available at this time
              </p>
            </div>
          )}
        </div>

        {/* Legend Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-500 ${themeClass === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
          <div className="p-8">
            <div className="flex items-center mb-4">
              <FaBolt className="text-yellow-500 text-3xl mr-4" />
              <h3 className={`text-2xl font-bold font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-yellow-800'}`}>
                LEGENDARY WARRIOR WISDOM
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-yellow-800'}`}>
                  GOKU'S TEACHINGS
                </h4>
                <ul className={`space-y-2 ${themeClass === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  <li>• "Power comes in response to a need, not a desire"</li>
                  <li>• "I am the hope of the omniverse!"</li>
                  <li>• "The enemy's greatest disadvantage is their arrogance"</li>
                  <li>• "Sometimes the strongest people aren't born to be the strongest"</li>
                  <li>• "I don't fight for good, and I don't fight for evil. I fight for fun!"</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-yellow-800'}`}>
                  VEGETA'S PRIDE
                </h4>
                <ul className={`space-y-2 ${themeClass === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  <li>• "I am the Prince of all Saiyans!"</li>
                  <li>• "Strength is the only thing that matters in this world"</li>
                  <li>• "I will not let you destroy my world!"</li>
                  <li>• "There is no such thing as a free lunch"</li>
                  <li>• "I've reserved something special for you... a technique you can't deflect!"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BattleGear;