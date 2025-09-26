import { Link, useNavigate } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt, FaMinus, FaPlus, FaTrash, FaTimes, FaUserCircle, FaBox, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { searchProducts } from "../../data/products.js";

function HomeHeader() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const { user, logout } = useAuth();
  const { showSuccess } = useNotifications();
  const { cartItems, updateQuantity, removeFromCart, getCartCount, getCartTotal } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const profileRef = useRef(null);
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Handle search
  useEffect(() => {
    if (search.trim()) {
      const results = searchProducts(search);
      setSearchResults(results.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [search]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartPreview(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setShowWishlistPreview(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <FaCapsules className="text-[#3B4CCA] text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white font-saiyan">CAPSULE CORP.</h1>
          </Link>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Find Dragon Balls..."
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur border-2 border-white/20 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors"
                >
                  <FaSearch className="text-lg" />
                </button>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#FFD700]/30 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="flex items-center p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearch("");
                        }}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3 border border-[#3B4CCA]/20"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#3B4CCA] text-sm font-saiyan">{product.name}</h4>
                          <p className="text-xs text-gray-600">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="p-3 text-center border-t border-[#FFD700]/30 bg-gradient-to-r from-blue-50 to-orange-50">
                      <button 
                        onClick={handleSearchSubmit}
                        className="text-[#3B4CCA] hover:text-[#FFD700] font-saiyan text-sm font-bold transition-colors"
                      >
                        VIEW ALL RESULTS →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Icon with Dropdown */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  className="flex items-center relative"
                  aria-label="Profile Menu"
                >
                  <FaUser className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                </button>
              ) : (
                <div
                  onClick={() => navigate('/auth')}
                  className="text-white text-xl cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Login or Signup"
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/auth')}
                >
                  <FaUser />
                </div>
              )}

              {/* Profile Dropdown */}
              {user && showProfileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border-2 border-[#FFD700]/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-r from-[#3B4CCA] to-blue-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-2 border-white shadow">
                        <FaUserCircle className="text-[#3B4CCA] text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-bold font-saiyan text-sm">
                          {user.firstName || 'CAPSULE'} {user.lastName || 'USER'}
                        </p>
                        <p className="text-blue-100 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-[#3B4CCA] hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all font-saiyan text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaUserCircle className="mr-3 text-lg" />
                      MY PROFILE
                    </Link>

                    <Link
                      to="/order-history"
                      className="flex items-center px-4 py-3 text-[#3B4CCA] hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all font-saiyan text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaBox className="mr-3 text-lg" />
                      ORDER HISTORY
                    </Link>

                    <Link
                      to="/address-book"
                      className="flex items-center px-4 py-3 text-[#3B4CCA] hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all font-saiyan text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaMapMarkerAlt className="mr-3 text-lg" />
                      ADDRESS BOOK
                    </Link>

                    <Link
                      to="/change-password"
                      className="flex items-center px-4 py-3 text-[#3B4CCA] hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all font-saiyan text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaLock className="mr-3 text-lg" />
                      CHANGE PASSWORD
                    </Link>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all font-saiyan text-sm"
                    >
                      <FaSignOutAlt className="mr-3 text-lg" />
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Auth Actions */}
            {user ? (
              <>
                {/* Wishlist with Preview */}
                <div className="relative" ref={wishlistRef}>
                  <button
                    onClick={() => setShowWishlistPreview(!showWishlistPreview)}
                    onMouseEnter={() => setShowWishlistPreview(true)}
                    className="flex items-center relative"
                    aria-label="Wishlist"
                  >
                    <FaHeart className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-pulse">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Wishlist Preview Dropdown */}
                  {showWishlistPreview && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-[#FFD700]/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-red-50">
                        <h3 className="font-bold text-[#3B4CCA] font-saiyan">WISHLIST</h3>
                        <p className="text-sm text-gray-600">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</p>
                      </div>
                      
                      {wishlistItems.length === 0 ? (
                        <div className="p-6 text-center">
                          <FaHeart className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Your wishlist is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-64 overflow-y-auto">
                            {wishlistItems.slice(0, 4).map((item) => (
                              <div key={item.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg mr-3"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-[#3B4CCA] text-sm">{item.name}</h4>
                                  <p className="text-xs text-gray-600">${item.price}</p>
                                </div>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  aria-label="Remove from wishlist"
                                >
                                  <FaTimes className="text-sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 border-t border-gray-100 text-center">
                            <Link
                              to="/wishlist"
                              className="block w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-saiyan text-sm"
                              onClick={() => setShowWishlistPreview(false)}
                            >
                              VIEW FULL WISHLIST
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                  aria-label="Sign In"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                  aria-label="Register"
                >
                  REGISTER
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#FFD700] transition-all duration-300 bg-gradient-to-br from-orange-400 to-yellow-500 hover:scale-105"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDarkMode ? "Super Saiyan Mode (Light)" : "Base Form (Dark)"}
            >
              {isDarkMode ? (
                // Super Saiyan Goku (Light Mode) - Blonde hair
                <div className="w-full h-full flex items-center justify-center text-xl">
                  👱‍♂️
                </div>
              ) : (
                // Base Goku (Dark Mode) - Black hair  
                <div className="w-full h-full flex items-center justify-center text-xl">
                  👨‍🦱
                </div>
              )}
            </button>

            {/* Cart with Preview */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setShowCartPreview(!showCartPreview)}
                onMouseEnter={() => setShowCartPreview(true)}
                className="flex items-center relative"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Preview Dropdown */}
              {showCartPreview && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-[#FFD700]/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50">
                    <h3 className="font-bold text-[#3B4CCA] font-saiyan">CAPSULE CART</h3>
                    <p className="text-sm text-gray-600">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <div className="p-6 text-center">
                      <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {cartItems.slice(0, 4).map((item) => (
                          <div key={item.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#3B4CCA] text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-600">${item.price} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-[#3B4CCA] transition-colors p-1"
                                aria-label="Decrease quantity"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-[#3B4CCA] transition-colors p-1"
                                aria-label="Increase quantity"
                              >
                                <FaPlus className="text-xs" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                                aria-label="Remove item"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-[#3B4CCA]">Total:</span>
                          <span className="font-bold text-[#3B4CCA] text-lg">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <Link
                          to="/cart"
                          className="block w-full py-2 bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white rounded-lg hover:from-[#2A3B9A] hover:to-[#E88900] transition-all font-saiyan text-sm text-center"
                          onClick={() => setShowCartPreview(false)}
                        >
                          VIEW FULL CART
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
