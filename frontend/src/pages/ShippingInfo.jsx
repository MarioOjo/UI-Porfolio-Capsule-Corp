import { Link } from "react-router-dom";
import { FaRocket, FaClock, FaMapMarkerAlt, FaShippingFast, FaArrowLeft } from "react-icons/fa";

function ShippingInfo() {
  return (
    <div className="min-h-0 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Link
          to="/cart"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-orange-600 dark:text-blue-400 dark:hover:text-orange-400 transition-colors font-saiyan mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FaArrowLeft />
          <span>BACK TO CART</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white font-saiyan mb-3 leading-tight">
            DELIVERY TIMELINES
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Capsule Corp Instant Transmission & Standard Delivery
          </p>
        </div>

        {/* Main Content */}
        <div className="mobile-grid gap-6 mb-6 sm:mb-8">
          {/* Shipping Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <FaRocket className="text-3xl sm:text-4xl text-orange-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white font-saiyan">
                SHIPPING METHODS
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Instant Transmission */}
              <div className="border-2 border-orange-400 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-orange-700 dark:text-orange-300 font-saiyan">
                      ⚡ INSTANT TRANSMISSION
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Express Delivery</p>
                  </div>
                  <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    1-2 Days
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Goku-powered delivery! Your capsules arrive faster than a Kamehameha. 
                  Perfect for urgent battles and training sessions.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Delivery Fee:</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">$49.99</span>
                </div>
              </div>

              {/* Standard Shipping */}
              <div className="border-2 border-blue-400 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-300 font-saiyan">
                      🚀 STANDARD CAPSULE DELIVERY
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Free on orders $500+</p>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    5-7 Days
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Regular Capsule Corp courier service. Reliable and safe, delivered by our 
                  trusted capsule fleet across all of Earth.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Delivery Fee:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">FREE (orders $500+)</span>
                  <span className="text-gray-600 dark:text-gray-400">or $25.99</span>
                </div>
              </div>

              {/* Pickup */}
              <div className="border-2 border-purple-400 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300 font-saiyan">
                      🏢 CAPSULE CORP PICKUP
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">West City HQ</p>
                  </div>
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    Same Day
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Visit Bulma at Capsule Corp headquarters! Pick up your order directly 
                  and maybe get a tour of our latest inventions.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Pickup Fee:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Times */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <FaClock className="text-3xl sm:text-4xl text-blue-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white font-saiyan">
                PROCESSING TIMES
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border-l-4 border-green-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">⚡ In-Stock Capsules</h3>
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm whitespace-nowrap">1-2 Business Days</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ready to ship! Items currently in our West City warehouse.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border-l-4 border-yellow-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">🔧 Custom Battle Gear</h3>
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm whitespace-nowrap">5-10 Business Days</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Personalized Saiyan armor and custom modifications require extra prep time.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-l-4 border-purple-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">🚀 Special Orders</h3>
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-sm whitespace-nowrap">2-4 Weeks</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Advanced tech like Gravity Chambers and Space Pods need Dr. Brief's approval.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border-l-4 border-red-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">🐉 Dragon Radar Tech</h3>
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm whitespace-nowrap">4-6 Weeks</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ultra-rare technology. Bulma herself oversees production. Worth the wait!
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-blue-900 dark:bg-blue-800 text-white rounded-xl p-4">
              <h4 className="font-bold mb-2 flex items-center space-x-2">
                <span>📝</span>
                <span className="font-saiyan">IMPORTANT NOTE</span>
              </h4>
              <p className="text-sm text-blue-100 dark:text-blue-200">
                Processing times start AFTER payment confirmation. Orders placed after 6:00 PM EST, 
                on weekends, or during Galactic holidays will be processed the next business day.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Regions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <FaMapMarkerAlt className="text-3xl sm:text-4xl text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white font-saiyan">
              DELIVERY ZONES
            </h2>
          </div>

          <div className="mobile-grid gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border-2 border-green-300 dark:border-green-600">
              <div className="text-3xl sm:text-4xl mb-3">🏙️</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 font-saiyan text-lg sm:text-xl">MAIN CITIES</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                West City, East City, Central City, North Capital, South City
              </p>
              <div className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base">FREE Shipping Available</div>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-600">
              <div className="text-3xl sm:text-4xl mb-3">🏔️</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 font-saiyan text-lg sm:text-xl">REMOTE AREAS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Mountains, Islands, Deserts, Training Grounds
              </p>
              <div className="text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-base">Additional Fees May Apply</div>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-600">
              <div className="text-3xl sm:text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 font-saiyan text-lg sm:text-xl">INTERNATIONAL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Other Planets, Namek, King Kai's Planet
              </p>
              <div className="text-purple-600 dark:text-purple-400 font-bold text-sm sm:text-base">Contact for Quote</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 dark:from-blue-950 dark:via-purple-950 dark:to-blue-950 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-orange-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-saiyan mb-4 sm:mb-6 text-center">
            ❓ FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-blue-950/50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2 text-sm sm:text-base">Can I track my capsule delivery?</h3>
              <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm">
                Yes! Once shipped, you'll receive a tracking number via Scouter notification. 
                Track your order in real-time as it travels across Earth.
              </p>
            </div>

            <div className="bg-blue-950/50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2 text-sm sm:text-base">What if I'm not home for delivery?</h3>
              <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm">
                Our couriers will leave your capsules in Capsule Form at a safe location, or 
                deliver to your nearest Capsule Corp partner location for pickup.
              </p>
            </div>

            <div className="bg-blue-950/50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2 text-sm sm:text-base">Do you deliver during tournaments?</h3>
              <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm">
                We do our best! However, deliveries may be delayed during World Martial Arts 
                Tournaments or if there's an alien invasion. Safety first!
              </p>
            </div>

            <div className="bg-blue-950/50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2 text-sm sm:text-base">Can I expedite my order?</h3>
              <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm">
                Absolutely! Choose Instant Transmission delivery at checkout. We'll get Goku on it ASAP!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
            Still have questions about delivery? Our Capsule Corp support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 text-sm sm:text-base"
            >
              CONTACT SUPPORT
            </Link>
            <Link
              to="/cart"
              className="bg-gray-800 dark:bg-gray-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-saiyan font-bold transition-all hover:bg-gray-700 dark:hover:bg-gray-600 text-sm sm:text-base"
            >
              BACK TO CART
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p>⭐ Capsule Corp - Delivering Innovation Since Age 712 ⭐</p>
          <p className="mt-2">* Delivery times are estimates and may vary based on location, stock availability, and galactic conditions.</p>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfo;