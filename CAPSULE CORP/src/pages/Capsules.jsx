import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getProductsByCategory } from '../data/products.js';
import ProductCard from '../components/Product/ProductCard';
import { FaCapsules, FaRocket, FaHome, FaCar, FaCogs } from 'react-icons/fa';

function Capsules() {
  const { isDarkMode } = useTheme();
  const [capsuleProducts, setCapsuleProducts] = useState([]);

  useEffect(() => {
    const products = getProductsByCategory('Capsules');
    setCapsuleProducts(products);
  }, []);

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaCapsules className="text-[#3B4CCA] text-3xl" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white font-saiyan text-center mb-4">
              CAPSULE TECHNOLOGY
            </h1>
            <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
              Revolutionary Hoi-Poi Capsule technology - store anything from motorcycles to entire houses in portable capsules!
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaRocket className="text-[#3B4CCA] text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                SPACE TECH
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Advanced compression technology originally developed for space exploration missions.
            </p>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaHome className="text-[#FF9E00] text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                PORTABLE LIVING
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Carry entire homes, workshops, and facilities wherever your adventures take you.
            </p>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaCogs className="text-green-500 text-3xl mr-4" />
              <h3 className={`text-xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                INSTANT SETUP
              </h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Deploy complex structures and vehicles in seconds with our one-touch activation system.
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              CAPSULE PRODUCTS
            </h2>
            <Link
              to="/products?category=capsules"
              className="px-6 py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold"
            >
              VIEW ALL CAPSULES
            </Link>
          </div>

          {capsuleProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capsuleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCapsules className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                LOADING CAPSULES...
              </h3>
              <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Preparing capsule inventory
              </p>
            </div>
          )}
        </div>

        {/* Technology Info */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="p-8">
            <h3 className={`text-2xl font-bold font-saiyan mb-6 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              HOI-POI CAPSULE TECHNOLOGY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  HOW IT WORKS
                </h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Advanced molecular compression technology</li>
                  <li>• Quantum storage matrix maintains object integrity</li>
                  <li>• One-button activation for instant deployment</li>
                  <li>• Unlimited storage duration with no degradation</li>
                  <li>• Compatible with virtually any object or structure</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-3 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SAFETY FEATURES
                </h4>
                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Fail-safe mechanisms prevent accidental activation</li>
                  <li>• Biometric locks for secure capsule access</li>
                  <li>• Emergency extraction protocols</li>
                  <li>• Environmental protection for stored items</li>
                  <li>• 99.99% success rate over millions of uses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Capsules;