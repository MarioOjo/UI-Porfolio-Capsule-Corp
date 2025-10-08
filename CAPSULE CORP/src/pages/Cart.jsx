import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../AuthContext";
import Price from "../components/Price";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-saiyan">
              CAPSULE CART
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your capsule collection
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-orange-600 transition-colors font-saiyan text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span className="hidden sm:inline">CONTINUE SHOPPING</span>
            <span className="sm:hidden">BACK</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              YOUR CART IS EMPTY
            </h2>
            <p className="text-gray-600 mb-8">
              Ready to power up? Start adding some legendary gear to your collection!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
            >
              EXPLORE CAPSULES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient background with text if image fails
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.image-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="image-fallback w-full h-full bg-gradient-to-br from-[#3B4CCA] to-blue-600 hidden items-center justify-center p-2">
                          <span className="text-white font-bold text-xs text-center">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      {/* Product Info - Full Width on Mobile */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-lg sm:text-xl font-bold text-gray-800 hover:text-orange-600 transition-colors font-saiyan line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {/* Remove Button - Top Right on Mobile */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 sm:hidden flex-shrink-0"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">{item.category}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs sm:text-sm text-gray-600">Power Level: </span>
                          <span className="text-xs sm:text-sm font-bold text-orange-600 ml-1">
                            {Number(item.powerLevel || item.power_level || 0).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Mobile: Quantity and Price Below */}
                        <div className="flex items-center justify-between mt-4 sm:hidden">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors touch-target"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors touch-target"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-xl font-bold text-orange-600 font-saiyan">
                              <Price value={parseFloat(item.price) * item.quantity} />
                            </div>
                            <div className="text-xs text-gray-600">
                              <Price value={parseFloat(item.price)} /> each
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Quantity Controls */}
                      <div className="hidden sm:flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden sm:block text-right">
                        <div className="text-2xl font-bold text-orange-600 font-saiyan">
                            <Price value={parseFloat(item.price) * item.quantity} />
                          </div>
                          <div className="text-sm text-gray-600">
                            <Price value={parseFloat(item.price)} /> each
                          </div>
                      </div>

                      {/* Desktop: Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="hidden sm:block text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="text-center pt-4">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition-colors font-medium"
                >
                  Clear All Items
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-saiyan">
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold"><Price value={total} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Power Level Bonus:</span>
                    <span className="font-bold text-blue-600">Applied</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-orange-600 font-saiyan">
                      <Price value={total} />
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-xl font-saiyan font-bold text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl mb-4"
                >
                  {user ? 'PROCEED TO CHECKOUT' : 'SIGN IN TO CHECKOUT'}
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">🛡️ Secure Checkout</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>✅ Capsule Corp Encryption</div>
                    <div>✅ Saiyan-Grade Security</div>
                    <div>✅ Dragon Ball Warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Notice Section - DBZ Themed */}
        {cartItems.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-2xl shadow-lg p-6 border-2 border-orange-400">
            <div className="flex items-start space-x-3 mb-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-xl font-bold text-white font-saiyan mb-2">CAPSULE CORP ALERT</h3>
                <p className="text-blue-200 text-sm italic">Read this carefully before your legendary purchase!</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-blue-100">
              <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <span className="text-orange-400 font-bold">⚠️</span>
                  <div>
                    <span className="font-semibold text-orange-300">Reservation Policy:</span>
                    <p className="mt-1">Placing an order or adding an item to your capsule collection does not reserve the item or lock the price. Items are only secured once your payment has been received and processed by our Earth Defense systems.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">🚀</span>
                  <div>
                    <span className="font-semibold text-green-300">Instant Transmission Delivery:</span>
                    <p className="mt-1">FREE delivery on eligible capsules is only available to main cities and training grounds. Remote locations may require additional Senzu Bean courier fees. Delivery charges are calculated based on your coordinates and shown before final confirmation.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">⏰</span>
                  <div>
                    <span className="font-semibold text-purple-300">Hyperbolic Time Processing:</span>
                    <p className="mt-1">Orders placed after business hours (6:00 PM EST), on weekends, or during Galactic holidays will be processed the following business day. Our Capsule Corp engineers need rest too!</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">📦</span>
                  <div>
                    <span className="font-semibold text-yellow-300">Power Level Preparation Time:</span>
                    <p className="mt-1">
                      <Link to="/shipping-info" className="text-orange-300 hover:text-orange-400 underline font-medium">
                        Click here to view current estimated lead times
                      </Link>
                      {" "}for order processing and capsule preparation. High-power items may require additional charging time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-700/50 text-center">
              <p className="text-xs text-blue-300">
                ⭐ Capsule Corp - Serving Earth's Warriors Since Age 712 ⭐
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;