import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaArrowLeft, FaShieldAlt, FaRocket, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Price from "../components/Price";
import { resolveImageSrc } from "../utils/images";
import Breadcrumb from "../components/Breadcrumb";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user, authInitialized } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-blue-50 to-orange-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-blue-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-800',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: isDarkMode 
        ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800' 
        : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700',
      secondary: isDarkMode 
        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const total = getCartTotal();
  const hasFreeShipping = total > 500;
  const shippingCost = hasFreeShipping ? 0 : 25.99;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shippingCost + tax;

  // Loading state while auth initializes
  if (!authInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan ${themeClasses.text.primary}`}>
              CAPSULE CART
            </h1>
            <p className={`text-sm sm:text-base mt-2 ${themeClasses.text.secondary}`}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your capsule collection
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 transition-colors font-saiyan text-sm sm:text-base ${
              isDarkMode ? 'text-blue-400 hover:text-orange-400' : 'text-blue-600 hover:text-orange-600'
            }`}
          >
            <FaArrowLeft />
            <span className="hidden sm:inline">CONTINUE SHOPPING</span>
            <span className="sm:hidden">BACK</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={`rounded-2xl shadow-lg p-8 sm:p-12 text-center ${themeClasses.card}`}>
            <FaShoppingCart className={`text-4xl sm:text-6xl mx-auto mb-4 sm:mb-6 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-saiyan ${themeClasses.text.primary}`}>
              YOUR CART IS EMPTY
            </h2>
            <p className={`mb-6 sm:mb-8 ${themeClasses.text.secondary}`}>
              Ready to power up? Start adding some legendary gear to your collection!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
            >
              EXPLORE CAPSULES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${themeClasses.card}`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={resolveImageSrc(item, 80)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            try { e.target.onerror = null; } catch {}
<<<<<<< Updated upstream
                            try { e.target.onerror = null; } catch {}
=======
>>>>>>> Stashed changes
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.image-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className={`image-fallback w-full h-full bg-gradient-to-br from-[#3B4CCA] to-blue-600 hidden items-center justify-center p-2 ${
                          isDarkMode ? 'from-slate-700 to-slate-800' : ''
                        }`}>
                          <span className="text-white font-bold text-xs text-center">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            to={`/product/${item.slug || item.id}`}
                            className={`text-base sm:text-lg font-bold hover:text-orange-600 transition-colors font-saiyan line-clamp-2 ${
                              isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-800 hover:text-orange-600'
                            }`}
                          >
                            {item.name}
                          </Link>
                          {/* Remove Button - Mobile */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 sm:hidden flex-shrink-0"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                        
                        <p className={`text-xs sm:text-sm mt-1 ${themeClasses.text.secondary}`}>
                          {item.category}
                        </p>
                        
                        {item.powerLevel && (
                          <div className="flex items-center mt-2">
                            <span className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Power Level: </span>
                            <span className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 ml-1">
                              {Number(item.powerLevel || item.power_level || 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                        
                        {/* Mobile: Quantity and Price */}
                        <div className="flex items-center justify-between mt-3 sm:hidden">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              } ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              }`}
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-600 dark:text-orange-400 font-saiyan">
                              <Price value={parseFloat(item.price) * item.quantity} />
                            </div>
                            <div className={`text-xs ${themeClasses.text.muted}`}>
                              <Price value={parseFloat(item.price)} /> each
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Quantity Controls */}
                      <div className="hidden sm:flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isDarkMode 
                              ? 'bg-slate-700 hover:bg-slate-600' 
                              : 'bg-gray-200 hover:bg-orange-200'
                          } ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isDarkMode 
                              ? 'bg-slate-700 hover:bg-slate-600' 
                              : 'bg-gray-200 hover:bg-orange-200'
                          }`}
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden sm:block text-right">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 font-saiyan">
                          <Price value={parseFloat(item.price) * item.quantity} />
                        </div>
                        <div className={`text-sm ${themeClasses.text.muted}`}>
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
              <div className="text-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm"
                >
                  Clear All Items
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 ${themeClasses.card}`}>
                <h3 className={`text-xl sm:text-2xl font-bold font-saiyan mb-4 sm:mb-6 ${themeClasses.text.primary}`}>
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className={themeClasses.text.secondary}>Subtotal:</span>
                    <span className={`font-bold ${themeClasses.text.primary}`}>
                      <Price value={total} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className={themeClasses.text.secondary}>Shipping:</span>
                    <span className={`font-bold ${hasFreeShipping ? 'text-green-500' : themeClasses.text.primary}`}>
                      {hasFreeShipping ? 'FREE' : <Price value={shippingCost} />}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className={themeClasses.text.secondary}>Tax:</span>
                    <span className={`font-bold ${themeClasses.text.primary}`}>
                      <Price value={tax} />
                    </span>
                  </div>
                  <hr className={`border-gray-200 dark:border-slate-600`} />
                  <div className="flex justify-between items-center text-lg sm:text-xl">
                    <span className={`font-bold ${themeClasses.text.primary}`}>Total:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400 font-saiyan">
                      <Price value={finalTotal} />
                    </span>
                  </div>

                  {/* Free Shipping Progress */}
                  {!hasFreeShipping && total > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={themeClasses.text.muted}>
                          {((500 - total) > 0 ? `$${(500 - total).toFixed(2)}` : '$0')} away from free shipping!
                        </span>
                        <span className={themeClasses.text.muted}>
                          {Math.min((total / 500) * 100, 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${
                        isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className={`w-full py-3 sm:py-4 rounded-xl font-saiyan font-bold text-sm sm:text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl mb-3 ${
                    themeClasses.button.primary
                  }`}
                >
                  {user ? 'PROCEED TO CHECKOUT' : 'LOGIN TO CHECKOUT'}
                </button>

                <Link
                  to="/products"
                  className={`block w-full text-center py-2 sm:py-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                    themeClasses.button.secondary
                  }`}
                >
                  Continue Shopping
                </Link>

                {/* Security Features */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-600">
                  <h4 className={`font-bold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                    <FaShieldAlt className="text-blue-500" />
                    Secure Checkout
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className={`flex items-center gap-2 ${themeClasses.text.muted}`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Capsule Corp Encryption</span>
                    </div>
                    <div className={`flex items-center gap-2 ${themeClasses.text.muted}`}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Saiyan-Grade Security</span>
                    </div>
                    <div className={`flex items-center gap-2 ${themeClasses.text.muted}`}>
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Dragon Ball Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Notice Section */}
        {cartItems.length > 0 && (
          <div className={`mt-6 sm:mt-8 rounded-2xl shadow-lg p-4 sm:p-6 border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 border-orange-500' 
              : 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 border-orange-400'
          }`}>
            <div className="flex items-start space-x-3 mb-4">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-saiyan mb-1 sm:mb-2">
                  CAPSULE CORP ALERT
                </h3>
                <p className="text-blue-200 text-xs sm:text-sm italic">
                  Read this carefully before your legendary purchase!
                </p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-blue-100">
              <div className="bg-blue-950/50 rounded-lg p-3 sm:p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className="text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-orange-300">Reservation Policy:</span>
                    <p className="mt-1">Placing an order or adding an item to your capsule collection does not reserve the item or lock the price. Items are only secured once your payment has been received and processed by our Earth Defense systems.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-3 sm:p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <FaRocket className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-green-300">Instant Transmission Delivery:</span>
                    <p className="mt-1">FREE delivery on eligible capsules is only available to main cities and training grounds. Remote locations may require additional Senzu Bean courier fees.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-3 sm:p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <FaClock className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-purple-300">Hyperbolic Time Processing:</span>
                    <p className="mt-1">Orders placed after business hours (6:00 PM EST), on weekends, or during Galactic holidays will be processed the following business day.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 rounded-lg p-3 sm:p-4 border border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold text-base">📦</span>
                  <div>
                    <span className="font-semibold text-yellow-300">Power Level Preparation Time:</span>
                    <p className="mt-1">
                      <Link to="/shipping-info" className="text-orange-300 hover:text-orange-400 underline font-medium">
                        Click here to view current estimated lead times
                      </Link>
                      {" "}for order processing and capsule preparation.
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

// Add display name for better debugging
Cart.displayName = 'CartPage';

export default Cart;