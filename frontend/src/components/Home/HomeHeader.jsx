import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { apiFetch } from "../../utils/api";
import CurrencySelector from "../CurrencySelector";
import CapsuleLogo from "../CapsuleLogo";
import CapsuleImg from "../../../public/images/CAPSULE CORP IMG.svg";
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
    <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg overflow-visible w-full">
      <div className="max-w-6xl mx-auto px-2 py-2 flex items-center justify-between w-full">
        {/* Hamburger menu for mobile */}
        <button className="block xs:hidden p-2 text-white" aria-label="Open menu" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          <FaBars className="text-2xl" />
        </button>
        {/* Logo image only, no text */}
        <Link to="/" className="flex items-center justify-center w-12 h-12">
          <img src={CapsuleImg} alt="Capsule Corp Logo" className="w-12 h-12 object-contain" />
        </Link>
        {/* Floating search bar */}
        <div className="flex-1 mx-2 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Search..."
                className="w-full px-3 py-2 bg-white/90 backdrop-blur border-2 border-white/20 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all text-sm"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3B4CCA] hover:text-[#FFD700] transition-colors"
              >
                <FaSearch className="text-base" />
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
        {/* Actions: login/profile, cart, wishlist, theme, currency selector in collapsible menu */}
        <div className="flex items-center gap-2 xs:gap-4">
          {/* Currency selector in collapsible menu (mobile) */}
          <div className="block xs:hidden">
            <CurrencySelector size="large" showLabel={true} />
          </div>
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-white hover:text-[#FFD700] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>
          {/* Profile/Login */}
          {user ? (
            <Link to="/profile" className="p-2 text-white flex items-center gap-1" aria-label="Profile">
              <FaUser className="text-xl" />
              <span className="hidden xs:inline">Profile</span>
            </Link>
          ) : (
            <Link to="/auth" className="p-2 text-white flex items-center gap-1" aria-label="Login">
              <FaUser className="text-xl" />
              <span className="hidden xs:inline">Login</span>
            </Link>
          )}
          {/* Wishlist */}
          <Link to="/wishlist" className="p-2 text-white flex items-center gap-1 relative" aria-label="Wishlist">
            <FaHeart className="text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-pulse">
                {wishlistCount}
              </span>
            )}
            <span className="hidden xs:inline">Wishlist</span>
          </Link>
          {/* Cart */}
          <Link to="/cart" className="p-2 text-white flex items-center gap-1 relative" aria-label="Cart">
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF9E00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
            <span className="hidden xs:inline">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
