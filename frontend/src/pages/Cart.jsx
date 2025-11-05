import { Link, useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaMinus, 
  FaPlus, 
  FaTrash, 
  FaArrowLeft, 
  FaShieldAlt, 
  FaRocket, 
  FaClock, 
  FaExclamationTriangle,
  FaBox,
  FaSyncAlt,
  FaGift
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Price from "../components/Price";
import { resolveImageSrc } from "../utils/images";
import Breadcrumb from "../components/Breadcrumb";
import { useState, useCallback } from "react";

// Enhanced Image Component for Cart
const CartImage = ({ item, size = 160, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");

  // Initialize image source
  useState(() => {
    if (item?.image) {
      setCurrentSrc(resolveImageSrc(item, size));
    }
  });

  const handleError = () => {
    if (!imageError && item?.image) {
      // First try the original image directly
      setCurrentSrc(item.image);
      setImageError(true);
    } else {
      // Final fallback - show placeholder
      setCurrentSrc("");
    }
  };

  if (!currentSrc || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold rounded-xl`}>
        {item?.name ? (
          <>
            <FaBox className="text-sm mr-1" />
            <span className="text-xs">{item.name.charAt(0)}</span>
          </>
        ) : (
          <FaBox className="text-sm" />
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={item?.name || "Product image"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    getCartStats,
    loading: cartLoading,
    validateCart
  } = useCart();
  const { user, authInitialized } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

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

  // Enhanced cart statistics
  const cartStats = getCartStats();
  const { total, hasFreeShipping, freeShippingRemaining, freeShippingProgress } = cartStats;
  const shippingCost = hasFreeShipping ? 0 : 25.99;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shippingCost + tax;

  // Enhanced handlers with loading states
  const handleRemoveFromCart = useCallback(async (itemId, itemName) => {
    setRemovingItem(itemId);
    try {
      await removeFromCart(itemId);
    } finally {
      setRemovingItem(null);
    }
  }, [removeFromCart]);

  const handleUpdateQuantity = useCallback(async (itemId, newQuantity) => {
    setUpdatingItem(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } finally {
      setUpdatingItem(null);
    }
  }, [updateQuantity]);

  const handleClearCart = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  }, [clearCart]);

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const handleValidateCart = useCallback(() => {
    validateCart();
  }, [validateCart]);

  // Quick actions for quantity
  const quickQuantityOptions = [1, 2, 3, 5, 10];

  // Loading state while auth initializes or cart is loading
  if (!authInitialized || cartLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`text-lg ${themeClasses.text.primary}`}>Loading your capsule collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan ${themeClasses.text.primary}`}>
              CAPSULE CART
            </h1>
            <p className={`text-sm sm:text-base mt-2 ${themeClasses.text.secondary}`}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your capsule collection
              {total > 0 && ` • ${getCartTotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })} total`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <button
                onClick={handleValidateCart}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Validate cart items"
              >
                <FaSyncAlt className="text-xs" />
                <span>Validate</span>
              </button>
            )}
            
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center space-x-2 transition-colors font-saiyan text-sm sm:text-base px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-slate-700 text-blue-400 hover:text-orange-400 hover:bg-slate-600' 
                  : 'bg-white text-blue-600 hover:text-orange-600 border border-gray-300'
              }`}
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">CONTINUE SHOPPING</span>
              <span className="sm:hidden">BACK</span>
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className={`rounded-2xl shadow-lg p-8 sm:p-12 text-center ${themeClasses.card}`}>
            <FaShoppingCart className={`text-4xl sm:text-6xl mx-auto mb-4 sm:mb-6 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-saiyan ${themeClasses.text.primary}`}>
              YOUR CART IS EMPTY
            </h2>
            <p className={`mb-6 sm:mb-8 max-w-md mx-auto ${themeClasses.text.secondary}`}>
              Ready to power up? Your capsule collection awaits legendary gear and battle equipment!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
              >
                EXPLORE CAPSULES
              </Link>
              <Link
                to="/products?category=Battle+Gear"
                className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-saiyan font-bold transition-all hover:scale-105 border-2 text-sm sm:text-base ${
                  isDarkMode 
                    ? 'border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white' 
                    : 'border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white'
                }`}
              >
                BATTLE GEAR
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${themeClasses.card} ${
                    removingItem === item.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 overflow-hidden">
                        <CartImage 
                          item={item}
                          size={160}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            to={`/product/${item.slug || item.id}`}
                            className={`text-base sm:text-lg font-bold hover:text-orange-600 transition-colors font-saiyan line-clamp-2 flex-1 ${
                              isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-800 hover:text-orange-600'
                            }`}
                          >
                            {item.name}
                          </Link>
                          {/* Remove Button - Mobile */}
                          <button
                            onClick={() => handleRemoveFromCart(item.id, item.name)}
                            disabled={removingItem === item.id}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 sm:hidden flex-shrink-0 disabled:opacity-50"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            {removingItem === item.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            ) : (
                              <FaTrash className="text-sm" />
                            )}
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
                        
                        {/* Quick Quantity Options - Mobile */}
                        <div className="flex flex-wrap gap-1 mt-2 sm:hidden">
                          {quickQuantityOptions.map(qty => (
                            <button
                              key={qty}
                              onClick={() => handleUpdateQuantity(item.id, qty)}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                item.quantity === qty
                                  ? 'bg-orange-500 text-white'
                                  : isDarkMode
                                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {qty}
                            </button>
                          ))}
                        </div>
                        
                        {/* Mobile: Quantity and Price */}
                        <div className="flex items-center justify-between mt-3 sm:hidden">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItem === item.id}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              }`}
                            >
                              {updatingItem === item.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <FaMinus className="text-xs" />
                              )}
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItem === item.id}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              }`}
                            >
                              {updatingItem === item.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <FaPlus className="text-xs" />
                              )}
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
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItem === item.id}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              }`}
                            >
                              {updatingItem === item.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <FaMinus className="text-xs" />
                              )}
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItem === item.id}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600' 
                                  : 'bg-gray-200 hover:bg-orange-200'
                              }`}
                            >
                              {updatingItem === item.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <FaPlus className="text-xs" />
                              )}
                            </button>
                          </div>
                          
                          {/* Quick Quantity Options - Desktop */}
                          <div className="flex gap-1">
                            {quickQuantityOptions.map(qty => (
                              <button
                                key={qty}
                                onClick={() => handleUpdateQuantity(item.id, qty)}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  item.quantity === qty
                                    ? 'bg-orange-500 text-white'
                                    : isDarkMode
                                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {qty}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden sm:block text-right min-w-24">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 font-saiyan">
                          <Price value={parseFloat(item.price) * item.quantity} />
                        </div>
                        <div className={`text-sm ${themeClasses.text.muted}`}>
                          <Price value={parseFloat(item.price)} /> each
                        </div>
                      </div>

                      {/* Desktop: Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        disabled={removingItem === item.id}
                        className="hidden sm:flex text-red-500 hover:text-red-700 transition-colors p-2 disabled:opacity-50 items-center justify-center w-10 h-10"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        {removingItem === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm py-2 px-4 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear All Items
                </button>
                
                <div className="flex-1"></div>
                
                <Link
                  to="/products"
                  className={`text-center py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                    themeClasses.button.secondary
                  }`}
                >
                  Continue Shopping
                </Link>
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
                    <span className={themeClasses.text.secondary}>Items ({cartItems.length}):</span>
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
                    <span className={themeClasses.text.secondary}>Tax (8%):</span>
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
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <FaGift className="text-orange-500 text-sm" />
                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                          Free Shipping at $500!
                        </span>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={themeClasses.text.muted}>
                          ${freeShippingRemaining.toFixed(2)} away
                        </span>
                        <span className={themeClasses.text.muted}>
                          {freeShippingProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${
                        isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                          style={{ width: `${freeShippingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {hasFreeShipping && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <FaGift className="text-green-500 text-sm" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          🎉 You've unlocked FREE shipping!
                        </span>
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

                {!user && (
                  <p className={`text-center text-xs ${themeClasses.text.muted} mb-3`}>
                    Sign in for faster checkout and order tracking
                  </p>
                )}

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