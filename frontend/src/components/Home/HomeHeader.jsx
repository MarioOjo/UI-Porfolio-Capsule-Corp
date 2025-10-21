import { FaBars } from "react-icons/fa";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <>
      {/* Desktop/Large screens */}
      <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg overflow-visible hidden sm:block">
        <div className="max-w-6xl mx-auto px-4 py-4 overflow-visible">
          {/* ...existing code for desktop header... */}
          {/* ...existing code... */}
        </div>
      </header>

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
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Find Dragon Balls..."
                className="w-full px-4 py-2 rounded-xl pr-10 focus:border-yellow-400 focus:outline-none transition-all duration-300 bg-white/90 text-sm"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-white transition-colors p-1"
              >
                <FaSearch className="text-lg" />
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
          </div>
        )}
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
    </>
  );
}

export default HomeHeader;
