import { FaRocket, FaShieldAlt, FaStar } from "react-icons/fa";

function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" id="features">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3B4CCA] to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <FaRocket className="text-white text-2xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Instant Transmission Shipping</h4>
            <p className="text-gray-600 leading-relaxed">Get your gear delivered faster than Goku's teleportation</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF9E00] to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Battle-Tested Quality</h4>
            <p className="text-gray-600 leading-relaxed">Every product survives planet-destroying explosions</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <FaStar className="text-white text-2xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Legendary Support</h4>
            <p className="text-gray-600 leading-relaxed">24/7 customer service by Z-Fighter experts</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;