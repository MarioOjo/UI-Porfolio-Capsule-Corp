import { Link, useNavigate } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt, FaMinus, FaPlus, FaTrash, FaTimes, FaUserCircle, FaBox, FaMapMarkerAlt, FaLock, FaUserShield, FaMoon, FaSun } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { apiFetch } from "../../utils/api";
import CurrencySelector from "../CurrencySelector";

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
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const profileRef = useRef(null);
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Handle search
  useEffect(() => {
    if (search.trim() && search.trim().length >= 2) {
      const searchProducts = async () => {
        try {
          const response = await apiFetch(`/api/products?search=${encodeURIComponent(search.trim())}&limit=5`);
          setSearchResults(response.products || []);
          setShowSearchResults(true);
        } catch (err) {
          console.error('Search error:', err);
          setSearchResults([]);
          setShowSearchResults(false);
        }
      };
      
      // Debounce search
      const timeoutId = setTimeout(searchProducts, 800);
      return () => clearTimeout(timeoutId);
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

  // Note: Scroll lock removed as it was causing content visibility issues
  // Dropdowns now use proper z-indexing instead

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg overflow-visible">
      <div className="max-w-6xl mx-auto px-2 py-2 sm:px-4 sm:py-4 overflow-visible">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 min-w-0 w-full">
          <Link to="/" className="flex items-center gap-2 xs:gap-3 w-full xs:w-auto">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <FaCapsules className="text-[#3B4CCA] text-lg xs:text-xl" />
            </div>
            <h1 className="text-base xs:text-lg sm:text-2xl font-bold text-white font-saiyan">CAPSULE CORP</h1>
          </Link>

          {/* Enhanced Search Bar */}
          <div className="w-full xs:flex-1 max-w-full xs:max-w-md mx-0 xs:mx-2 sm:mx-4 lg:mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Find Dragon Balls..."
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/90 backdrop-blur border-2 border-white/20 rounded-xl pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all text-sm sm:text-base"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors"
                >
                  <FaSearch className="text-base sm:text-lg" />
                </button>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="popover-panel absolute top-full left-0 right-0 mt-2 bg-white/90 border-2 border-[#FFD700]/40 rounded-xl z-50 popover-no-clip">
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
                          <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
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

          <div className="flex flex-wrap items-center gap-2 xs:gap-4 justify-end w-full xs:w-auto mt-2 xs:mt-0">
      {/* Currency Selector: show below navbar on mobile, inline on desktop */}
      <div className="block xs:hidden w-full px-2 py-2 bg-gradient-to-r from-[#3B4CCA] to-blue-600">
        <CurrencySelector size="large" showLabel={true} />
      </div>
      <div className="hidden xs:block absolute top-2 right-2">
        <CurrencySelector size="small" showLabel={false} />
      </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-white hover:text-[#FFD700] transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
            
            {/* Profile Icon with Dropdown */}
            <div 
              className="relative" 
              ref={profileRef}
            >
              {user ? (
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center relative p-2"
                  aria-label="Profile Menu"
                >
                  <FaUser className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                </button>
              ) : (
                <div
                  onClick={() => navigate('/auth')}
                  className="text-white text-xl cursor-pointer p-2"
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
                <div 
                  className="popover-panel absolute top-full right-0 mt-2 w-64 sm:w-72 bg-white/90 border-2 border-[#FFD700]/40 rounded-xl z-[80] popover-no-clip"
                >
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

                    {/* Admin Dashboard Link - Only for admins */}
                    {(user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com') && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all font-saiyan text-sm border-t border-gray-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <FaUserShield className="mr-3 text-lg" />
                        ADMIN DASHBOARD
                      </Link>
                    )}

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
                <div 
                  className="relative" 
                  ref={wishlistRef}
                >
                  <button
                    onClick={() => setShowWishlistPreview(!showWishlistPreview)}
                    className="flex items-center relative p-2"
                    aria-label="Wishlist"
                  >
                    <FaHeart className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-pulse">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Wishlist Preview Dropdown */}
                  {showWishlistPreview && (
                    <div 
                      className="popover-panel absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white/90 border-2 border-[#FFD700]/40 rounded-xl z-[70] popover-no-clip"
                    >
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
                  className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors font-saiyan tracking-wide px-3 py-2 rounded-lg xs:px-4 xs:py-2"
                  aria-label="Login"
                  style={{ minWidth: 80, textAlign: 'center' }}
                >
                  LOGIN
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="text-sm font-medium text-white hover:text-[#FFD700] transition-colors font-saiyan tracking-wide px-3 py-2 rounded-lg xs:px-4 xs:py-2"
                  aria-label="Register"
                  style={{ minWidth: 80, textAlign: 'center' }}
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
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                // Moon icon for dark mode
                <div className="w-full h-full flex items-center justify-center text-white">
                  <FaMoon className="text-lg" />
                </div>
              ) : (
                // Sun icon for light mode  
                <div className="w-full h-full flex items-center justify-center text-white">
                  <FaSun className="text-lg" />
                </div>
              )}
            </button>

            {/* Cart with Preview */}
            <div 
              className="relative" 
              ref={cartRef}
            >
              <button
                onClick={() => setShowCartPreview(!showCartPreview)}
                className="flex items-center relative p-2"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF9E00] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Preview Dropdown */}
              {showCartPreview && (
                <div 
                  className="popover-panel absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white/90 border-2 border-[#FFD700]/40 rounded-xl z-[70] popover-no-clip transform -translate-x-0"
                >
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
                      {cartItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#3B4CCA] text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
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
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-[#3B4CCA]">Total:</span>
                          <span className="font-bold text-[#3B4CCA] text-lg">{formatPrice(getCartTotal())}</span>
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
