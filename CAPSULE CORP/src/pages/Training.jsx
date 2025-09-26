import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getProductsByCategory } from '../data/products.js';
import ProductCard from '../components/Product/ProductCard';
import { FaDumbbell, FaBolt, FaMedal, FaRocket, FaClock, FaShieldAlt } from 'react-icons/fa';

function Training() {
  const { isDarkMode } = useTheme();
  const [trainingProducts, setTrainingProducts] = useState([]);

  useEffect(() => {
    const products = getProductsByCategory('Training');
    setTrainingProducts(products);
  }, []);

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaDumbbell className="text-orange-600 text-3xl" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white font-saiyan text-center mb-4">
              SAIYAN TRAINING GEAR
            </h1>
            <p className="text-xl text-orange-100 text-center max-w-3xl mx-auto">
              Push beyond your limits with legendary training equipment designed for warriors who refuse to accept defeat!
            </p>
          </div>
        </div>

        {/* Training Philosophy */}
        <div className={`rounded-2xl shadow-lg mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="p-8">
            <h2 className={`text-3xl font-bold font-saiyan mb-6 text-center ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              THE SAIYAN WAY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaBolt className="text-5xl text-yellow-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SURPASS YOUR LIMITS
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Every Saiyan knows that true strength comes from pushing beyond what seems possible.
                </p>
              </div>
              <div className="text-center">
                <FaRocket className="text-5xl text-blue-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  CONSTANT EVOLUTION
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Growth never stops. Each battle, each training session makes you stronger.
                </p>
              </div>
              <div className="text-center">
                <FaMedal className="text-5xl text-orange-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  LEGENDARY STATUS
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Transform from ordinary warrior to legend with the right training and determination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaDumbbell className="text-red-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                STRENGTH TRAINING
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Build incredible physical power with gravity chambers, weighted training gear, and resistance equipment.
            </p>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Gravity multipliers up to 500x</li>
              <li>• Adjustable training weights</li>
              <li>• Power level monitoring</li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaBolt className="text-yellow-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                KI MASTERY
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Master energy manipulation and spiritual power with specialized ki training equipment.
            </p>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Ki-responsive training orbs</li>
              <li>• Meditation platforms</li>
              <li>• Energy focus crystals</li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center mb-4">
              <FaClock className="text-purple-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                TIME TRAINING
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Accelerate your training with time manipulation chambers and temporal training methods.
            </p>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Hyperbolic Time Chamber access</li>
              <li>• Time dilation training</li>
              <li>• Accelerated recovery systems</li>
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              TRAINING EQUIPMENT
            </h2>
            <Link
              to="/products?category=training"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-saiyan font-bold"
            >
              VIEW ALL GEAR
            </Link>
          </div>

          {trainingProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaDumbbell className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                LOADING TRAINING GEAR...
              </h3>
              <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Preparing legendary equipment
              </p>
            </div>
          )}
        </div>

        {/* Warning Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="p-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-red-500 text-3xl mr-4" />
              <h3 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                TRAINING SAFETY WARNING
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                  EXTREME TRAINING HAZARDS
                </h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                  <li>• Gravity chambers can cause serious injury or death</li>
                  <li>• Time chamber training is mentally exhausting</li>
                  <li>• Always have senzu beans for emergency healing</li>
                  <li>• Never train alone in extreme conditions</li>
                  <li>• Respect your physical and mental limits</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                  RECOMMENDED PREPARATION
                </h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
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