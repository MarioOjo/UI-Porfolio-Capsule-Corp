import { Link } from "react-router-dom";
import { FaRocket, FaClock, FaMapMarkerAlt, FaShippingFast, FaArrowLeft } from "react-icons/fa";

function ShippingInfo() {
  return (
    <div className="min-h-0 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/cart"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-orange-600 transition-colors font-saiyan mb-6"
        >
          <FaArrowLeft />
          <span>BACK TO CART</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 font-saiyan mb-3">
            DELIVERY TIMELINES
          </h1>
          <p className="text-gray-600 text-lg">
            Capsule Corp Instant Transmission & Standard Delivery
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Shipping Methods */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FaRocket className="text-4xl text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-800 font-saiyan">
                SHIPPING METHODS
              </h2>
            </div>

            <div className="space-y-6">
              {/* Instant Transmission */}
              <div className="border-2 border-orange-400 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 font-saiyan">
                      ⚡ INSTANT TRANSMISSION
                    </h3>
                    <p className="text-sm text-orange-600 font-medium">Express Delivery</p>
                  </div>
                  <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    1-2 Days
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Goku-powered delivery! Your capsules arrive faster than a Kamehameha. 
                  Perfect for urgent battles and training sessions.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800">Delivery Fee:</span>
                  <span className="text-orange-600 font-bold">$49.99</span>
                </div>
              </div>

              {/* Standard Shipping */}
              <div className="border-2 border-blue-400 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 font-saiyan">
                      🚀 STANDARD CAPSULE DELIVERY
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">Free on orders $500+</p>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    5-7 Days
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Regular Capsule Corp courier service. Reliable and safe, delivered by our 
                  trusted capsule fleet across all of Earth.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800">Delivery Fee:</span>
                  <span className="text-green-600 font-bold">FREE (orders $500+)</span>
                  <span className="text-gray-600">or $25.99</span>
                </div>
              </div>

              {/* Pickup */}
              <div className="border-2 border-purple-400 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-purple-700 font-saiyan">
                      🏢 CAPSULE CORP PICKUP
                    </h3>
                    <p className="text-sm text-purple-600 font-medium">West City HQ</p>
                  </div>
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Same Day
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Visit Bulma at Capsule Corp headquarters! Pick up your order directly 
                  and maybe get a tour of our latest inventions.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800">Pickup Fee:</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Times */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FaClock className="text-4xl text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-800 font-saiyan">
                PROCESSING TIMES
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">⚡ In-Stock Capsules</h3>
                  <span className="text-green-600 font-bold text-sm">1-2 Business Days</span>
                </div>
                <p className="text-sm text-gray-600">
                  Ready to ship! Items currently in our West City warehouse.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">🔧 Custom Battle Gear</h3>
                  <span className="text-orange-600 font-bold text-sm">5-10 Business Days</span>
                </div>
                <p className="text-sm text-gray-600">
                  Personalized Saiyan armor and custom modifications require extra prep time.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">🚀 Special Orders</h3>
                  <span className="text-purple-600 font-bold text-sm">2-4 Weeks</span>
                </div>
                <p className="text-sm text-gray-600">
                  Advanced tech like Gravity Chambers and Space Pods need Dr. Brief's approval.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">🐉 Dragon Radar Tech</h3>
                  <span className="text-red-600 font-bold text-sm">4-6 Weeks</span>
                </div>
                <p className="text-sm text-gray-600">
                  Ultra-rare technology. Bulma herself oversees production. Worth the wait!
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-blue-900 text-white rounded-xl p-4">
              <h4 className="font-bold mb-2 flex items-center space-x-2">
                <span>📝</span>
                <span className="font-saiyan">IMPORTANT NOTE</span>
              </h4>
              <p className="text-sm text-blue-100">
                Processing times start AFTER payment confirmation. Orders placed after 6:00 PM EST, 
                on weekends, or during Galactic holidays will be processed the next business day.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Regions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FaMapMarkerAlt className="text-4xl text-green-500" />
            <h2 className="text-3xl font-bold text-gray-800 font-saiyan">
              DELIVERY ZONES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-300">
              <div className="text-4xl mb-3">🏙️</div>
              <h3 className="font-bold text-gray-800 mb-2 font-saiyan">MAIN CITIES</h3>
              <p className="text-sm text-gray-600 mb-2">
                West City, East City, Central City, North Capital, South City
              </p>
              <div className="text-green-600 font-bold">FREE Shipping Available</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
              <div className="text-4xl mb-3">🏔️</div>
              <h3 className="font-bold text-gray-800 mb-2 font-saiyan">REMOTE AREAS</h3>
              <p className="text-sm text-gray-600 mb-2">
                Mountains, Islands, Deserts, Training Grounds
              </p>
              <div className="text-orange-600 font-bold">Additional Fees May Apply</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-gray-800 mb-2 font-saiyan">INTERNATIONAL</h3>
              <p className="text-sm text-gray-600 mb-2">
                Other Planets, Namek, King Kai's Planet
              </p>
              <div className="text-purple-600 font-bold">Contact for Quote</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-2xl shadow-lg p-8 border-2 border-orange-400">
          <h2 className="text-3xl font-bold text-white font-saiyan mb-6 text-center">
            ❓ FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2">Can I track my capsule delivery?</h3>
              <p className="text-blue-100 text-sm">
                Yes! Once shipped, you'll receive a tracking number via Scouter notification. 
                Track your order in real-time as it travels across Earth.
              </p>
            </div>

            <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2">What if I'm not home for delivery?</h3>
              <p className="text-blue-100 text-sm">
                Our couriers will leave your capsules in Capsule Form at a safe location, or 
                deliver to your nearest Capsule Corp partner location for pickup.
              </p>
            </div>

            <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2">Do you deliver during tournaments?</h3>
              <p className="text-blue-100 text-sm">
                We do our best! However, deliveries may be delayed during World Martial Arts 
                Tournaments or if there's an alien invasion. Safety first!
              </p>
            </div>

            <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
              <h3 className="font-bold text-orange-300 mb-2">Can I expedite my order?</h3>
              <p className="text-blue-100 text-sm">
                Absolutely! Choose Instant Transmission delivery at checkout. We'll get Goku on it ASAP!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions about delivery? Our Capsule Corp support team is here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105"
            >
              CONTACT SUPPORT
            </Link>
            <Link
              to="/cart"
              className="bg-gray-800 text-white px-8 py-3 rounded-xl font-saiyan font-bold transition-all hover:bg-gray-700"
            >
              BACK TO CART
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>⭐ Capsule Corp - Delivering Innovation Since Age 712 ⭐</p>
          <p className="mt-2">* Delivery times are estimates and may vary based on location, stock availability, and galactic conditions.</p>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfo;
