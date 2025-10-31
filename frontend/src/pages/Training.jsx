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
        setTrainingProducts(response.products || []);
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

  return (
    <div className="min-h-0 py-8 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-blue-100 dark:bg-slate-800 dark:border-slate-700 mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-capsule-accent to-capsule-orange rounded-full flex items-center justify-center border-4 border-white shadow-lg">
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
        <div className="rounded-2xl shadow-lg mb-12 bg-white border border-blue-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold font-saiyan mb-6 text-center text-[#3B4CCA] dark:text-white">
              THE SAIYAN WAY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaBolt className="text-5xl text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-saiyan mb-2 text-gray-900 dark:text-white">
                  SURPASS YOUR LIMITS
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Every Saiyan knows that true strength comes from pushing beyond what seems possible.
                </p>
              </div>

              <div className="text-center">
                <FaRocket className="text-5xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-saiyan mb-2 text-gray-900 dark:text-white">
                  CONSTANT EVOLUTION
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Growth never stops. Each battle, each training session makes you stronger.
                </p>
              </div>

              <div className="text-center">
                <FaMedal className="text-5xl text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-saiyan mb-2 text-gray-900 dark:text-white">
                  LEGENDARY STATUS
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Transform from ordinary warrior to legend with the right training and determination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <FaDumbbell className="text-red-500 text-3xl mr-4" />
              <h3 className="text-xl font-bold font-saiyan text-[#3B4CCA] dark:text-white">STRENGTH TRAINING</h3>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Build incredible physical power with gravity chambers, weighted training gear, and resistance equipment.
            </p>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Gravity multipliers up to 500x</li>
              <li>• Adjustable training weights</li>
              <li>• Power level monitoring</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <FaBolt className="text-yellow-500 text-3xl mr-4" />
              <h3 className="text-xl font-bold font-saiyan text-[#3B4CCA] dark:text-white">KI MASTERY</h3>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Master energy manipulation and spiritual power with specialized ki training equipment.</p>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Ki-responsive training orbs</li>
              <li>• Meditation platforms</li>
              <li>• Energy focus crystals</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <FaClock className="text-purple-500 text-3xl mr-4" />
              <h3 className="text-xl font-bold font-saiyan text-[#3B4CCA] dark:text-white">TIME TRAINING</h3>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Accelerate your training with time manipulation chambers and temporal training methods.</p>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Hyperbolic Time Chamber access</li>
              <li>• Time dilation training</li>
              <li>• Accelerated recovery systems</li>
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-saiyan text-[#3B4CCA] dark:text-white">TRAINING EQUIPMENT</h2>
            <Link to="/products?category=training" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-saiyan font-bold">VIEW ALL GEAR</Link>
          </div>

          {trainingProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaDumbbell className="text-6xl mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-bold mb-2 font-saiyan text-gray-500 dark:text-gray-400">LOADING TRAINING GEAR...</h3>
              <p className="text-gray-400 dark:text-gray-500">Preparing legendary equipment</p>
            </div>
          )}
        </div>

        {/* Warning Section */}
        <div className="rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="p-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-red-500 text-3xl mr-4" />
              <h3 className="text-2xl font-bold font-saiyan text-red-800 dark:text-white">TRAINING SAFETY WARNING</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-3 font-saiyan text-red-800 dark:text-white">EXTREME TRAINING HAZARDS</h4>
                <ul className="space-y-2 text-red-700 dark:text-red-200">
                  <li>• Gravity chambers can cause serious injury or death</li>
                  <li>• Time chamber training is mentally exhausting</li>
                  <li>• Always have senzu beans for emergency healing</li>
                  <li>• Never train alone in extreme conditions</li>
                  <li>• Respect your physical and mental limits</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-3 font-saiyan text-red-800 dark:text-white">RECOMMENDED PREPARATION</h4>
                <ul className="space-y-2 text-red-700 dark:text-red-200">
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