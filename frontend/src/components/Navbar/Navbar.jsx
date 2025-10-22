  // Helper for mobile bottom bar icons
  const mobileBottomIcons = [
    { icon: <FaUser className="text-xl" />, to: user ? "/profile" : "/auth", label: user ? "Profile" : "Login" },
    { icon: <FaShoppingCart className="text-xl" />, to: "/cart", label: "Cart" },
    { icon: isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />, action: toggleDarkMode, label: isDarkMode ? "Light" : "Dark" },
    // Add currency selector as a button (could be a modal or dropdown in future)
    { icon: <span className="font-bold text-base">ZA</span>, to: "#", label: "Currency" },
    // Auth actions
    ...(!user ? [
      { icon: <span className="font-bold text-base">LOGIN</span>, to: "/auth", label: "Login" },
      { icon: <span className="font-bold text-base">REGISTER</span>, to: "/auth?tab=signup", label: "Register" }
    ] : [])
  ];
  // Product categories/items for mobile menu
  const mobileMenuItems = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Battle Gear", to: "/products?category=Battle%20Gear" },
    { label: "Capsules", to: "/products?category=Capsules" },
    { label: "Training", to: "/products?category=Training" },
    { label: "Track Order", to: "/order-tracking" },
    { label: "Contact", to: "/contact" },
    { label: "Cart", to: "/cart" },
  ];
import { Link, useNavigate } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt, FaMinus, FaPlus, FaTrash, FaTimes, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import Price from "../../components/Price";
import { useCurrency } from '../../contexts/CurrencyContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
<<<<<<< HEAD:frontend/src/components/Navbar/Navbar.jsx
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
=======
    <>
      {/* Desktop/Large screens */}
      <header className="max-w-6xl mx-auto px-4 py-4 overflow-visible hidden sm:block">
        <div className="flex items-center justify-between min-w-0">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
              <FaCapsules className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-[#3B4CCA] font-saiyan">CAPSULE CORP.</h1>
          </Link>
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Search for Dragon Ball Z gear..."
                  className="w-full px-4 py-3 border-2 border-[#3B4CCA]/20 rounded-xl pr-12 focus:border-[#3B4CCA] focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors p-1"
                >
                  <FaSearch className="text-lg" />
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
          {/* Right Side Icons (unchanged) */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* ...existing code for icons, profile, cart, etc... */}
            {/* ...existing code... */}
          </div>
        </div>
      </header>

      {/* Sticky Bottom Bar for Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg py-2 flex justify-center items-center">
        <div className="flex gap-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-100 to-orange-100 shadow-xl border border-[#3B4CCA]/20 mx-auto">
          {/* Profile Icon */}
          <Link to={user ? "/profile" : "/auth"} aria-label={user ? "Profile" : "Login"} className="flex flex-col items-center text-[#3B4CCA]">
            <FaUser className="text-xl" />
            <span className="text-xs">{user ? "Profile" : "Login"}</span>
          </Link>
          {/* Login/Register (if not logged in) */}
          {!user && (
            <Link to="/auth?tab=signup" aria-label="Register" className="flex flex-col items-center text-[#3B4CCA]">
              <span className="font-bold text-base">REGISTER</span>
              <span className="text-xs">Register</span>
            </Link>
          )}
          {/* Cart Icon */}
          <Link to="/cart" aria-label="Cart" className="flex flex-col items-center text-[#3B4CCA] relative">
            <FaShoppingCart className="text-xl" />
            <span className="text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Currency Selector */}
          <button className="flex flex-col items-center text-[#3B4CCA]" aria-label="Currency">
            <span className="font-bold text-base">ZA</span>
            <span className="text-xs">Currency</span>
          </button>
          {/* Light/Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="flex flex-col items-center text-[#3B4CCA]" aria-label={isDarkMode ? "Light Mode" : "Dark Mode"}>
            {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            <span className="text-xs">{isDarkMode ? "Light" : "Dark"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile/Small screens */}
      <header className="sm:hidden px-4 py-2 bg-[#3B4CCA] flex items-center justify-between relative">
        {/* Logo only */}
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <FaCapsules className="text-white text-lg" />
          </div>
        </Link>
        {/* Enlarged Search Bar */}
        <div className="flex-1 mx-4">
>>>>>>> capsule-corp-:CAPSULE CORP/src/components/Navbar/Navbar.jsx
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
<<<<<<< HEAD:frontend/src/components/Navbar/Navbar.jsx
                placeholder="Search..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#3B4CCA]/20 rounded-xl pr-10 sm:pr-12 focus:border-[#3B4CCA] focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
=======
                placeholder="Find Dragon Balls..."
                className="w-full px-4 py-2 rounded-xl pr-10 focus:border-yellow-400 focus:outline-none transition-all duration-300 bg-white/90 text-sm"
>>>>>>> capsule-corp-:CAPSULE CORP/src/components/Navbar/Navbar.jsx
                aria-label="Search products"
              />
              <button
                type="submit"
<<<<<<< HEAD:frontend/src/components/Navbar/Navbar.jsx
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors p-1"
=======
                className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-white transition-colors p-1"
>>>>>>> capsule-corp-:CAPSULE CORP/src/components/Navbar/Navbar.jsx
              >
                <FaSearch className="text-sm sm:text-lg" />
              </button>
            </div>
          </form>
        </div>
        {/* Hamburger Menu */}
        <button
          className="ml-2 p-2 rounded-xl bg-white text-[#3B4CCA] shadow-lg"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>

        {/* Hamburger Dropdown Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex flex-col" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white rounded-t-2xl shadow-xl mx-2 mt-16 pb-4 pt-6 flex flex-col items-center" style={{ minHeight: '60vh' }} onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-6 p-2 rounded-xl bg-[#3B4CCA] text-white"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes className="text-xl" />
              </button>
<<<<<<< HEAD:frontend/src/components/Navbar/Navbar.jsx

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
                aria-label="Login"
              >
                LOGIN
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
=======
              <nav className="w-full flex flex-col gap-4 mt-6">
                {mobileMenuItems.map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="w-full text-center py-3 rounded-xl font-saiyan text-lg text-[#3B4CCA] bg-gradient-to-r from-blue-50 to-orange-50 shadow hover:bg-orange-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
>>>>>>> capsule-corp-:CAPSULE CORP/src/components/Navbar/Navbar.jsx
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;