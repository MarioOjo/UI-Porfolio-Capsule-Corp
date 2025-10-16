import { Link, useNavigate } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt, FaMinus, FaPlus, FaTrash, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import Price from "../../components/Price";
import { useCurrency } from '../../contexts/CurrencyContext';

function Navbar() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('capsule-theme');
    return saved ? JSON.parse(saved) : false;
  });
  
  const { user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('capsule-theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NOTE: removed scroll-lock behavior (was causing header/content clipping and nested scrollbars on some platforms).
  // Floating panels use z-index and absolute positioning; we avoid toggling global classes to prevent layout side-effects.

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const { formatPrice } = useCurrency();

  return (
  <header className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden p-4">
      <div className="flex items-center justify-between min-w-0 gap-2 sm:gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-700 rounded-full flex items-center justify-center">
            <FaCapsules className="text-white text-base sm:text-lg" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#3B4CCA] font-saiyan hidden xs:block">CAPSULE CORP</h1>
        </Link>

        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 lg:mx-8 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Search..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#3B4CCA]/20 rounded-xl pr-10 sm:pr-12 focus:border-[#3B4CCA] focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors p-1"
              >
                <FaSearch className="text-sm sm:text-lg" />
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="popover-panel absolute top-full left-0 right-0 mt-2 bg-white/90 border-2 border-[#3B4CCA]/30 rounded-xl z-[100] max-w-full popover-no-clip">
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
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600"><Price value={product.price} /></p>
                      </div>
                    </Link>
                  ))}
                  <div className="p-3 text-center border-t border-gray-100">
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-[#3B4CCA] hover:text-[#FFD700] font-saiyan text-sm"
                    >
                      VIEW ALL RESULTS →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#3B4CCA]/20 hover:border-[#FFD700] transition-all duration-300 bg-gradient-to-br from-orange-400 to-yellow-500 shrink-0"
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

          {/* Profile Icon */}
          <Link 
            to={user ? "/profile" : "/auth"} 
            aria-label={user ? "Profile" : "Login or Signup"}
            className="relative"
          >
            <FaUser className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
          </Link>
          
          {/* Auth Actions */}
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                aria-label="Logout"
              >
                LOGOUT
              </button>

              {/* Wishlist with Preview */}
              <div className="relative" ref={wishlistRef}>
                <button
                  onClick={() => setShowWishlistPreview(!showWishlistPreview)}
                  className="flex items-center relative"
                  aria-label="Wishlist"
                >
                  <FaHeart className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Wishlist Preview Dropdown */}
                {showWishlistPreview && (
                  <div className="popover-panel absolute top-full right-0 mt-2 w-80 max-w-[95%] bg-white/90 border-2 border-[#3B4CCA]/30 rounded-xl z-50 popover-no-clip">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-red-50">
                      <h3 className="font-bold text-gray-800 font-saiyan">WISHLIST</h3>
                      <p className="text-sm text-gray-600">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</p>
                    </div>
                    
                    {wishlistItems.length === 0 ? (
                      <div className="p-6 text-center">
                        <FaHeart className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Your wishlist is empty</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          {wishlistItems.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-600"><Price value={item.price} /></p>
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
                className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                aria-label="Sign In"
              >
                SIGN IN
              </Link>
              <Link
                to="/auth?tab=signup"
                className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                aria-label="Register"
              >
                REGISTER
              </Link>
            </>
          )}

          {/* Cart with Preview */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setShowCartPreview(!showCartPreview)}
              className="flex items-center relative"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Preview Dropdown */}
              {showCartPreview && (
              <div className="popover-panel absolute top-full right-0 mt-2 w-80 max-w-[95%] bg-white/90 border-2 border-[#3B4CCA]/30 rounded-xl z-50 popover-no-clip">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50">
                  <h3 className="font-bold text-gray-800 font-saiyan">CAPSULE CART</h3>
                  <p className="text-sm text-gray-600">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div>
                      {cartItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
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
                        <span className="font-bold text-gray-800">Total:</span>
                        <span className="font-bold text-[#3B4CCA] text-lg"><Price value={getCartTotal()} /></span>
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
    </header>
  );
}

export default Navbar;