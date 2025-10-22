import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaHeart,
  FaTimes,
  FaMoon,
  FaSun,
  FaBars,
  FaCapsules
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import Price from "../../components/Price";
import { useCurrency } from '../../contexts/CurrencyContext';
import CapsuleCorpLogo from "../../components/CapsuleLogo";
import CurrencySelector from "../../components/CurrencySelector";

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

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('capsule-theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle search with debounce
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
      const timeoutId = setTimeout(searchProducts, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [search]);

  // Clicks outside dropdowns
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

  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.error(e); }
  };

  const handleSearchSubmit = (e) => {
    e && e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const { formatPrice } = useCurrency();

  return (
    <>
      {/* Desktop / large screens */}
      <header className="hidden sm:block bg-[#3B4CCA] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <CapsuleCorpLogo variant="white" size="md" to="/" />
          </div>

          {/* Center: Search */}
          <div className="flex-1 px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Find Dragon Balls..."
                  className="w-full px-4 py-3 rounded-full pr-12 bg-white text-gray-800 shadow-sm focus:outline-none"
                  aria-label="Search products"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                  <FaSearch />
                </button>

                {showSearchResults && searchResults.length > 0 && (
                  <div className="popover-panel absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl z-50">
                    {searchResults.map(p => (
                      <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center p-3 hover:bg-gray-50" onClick={() => { setShowSearchResults(false); setSearch(""); }}>
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg mr-3 object-cover" />
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-600"><Price value={p.price} /></div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-3 text-center border-t">
                      <button onClick={handleSearchSubmit} className="text-[#3B4CCA]">View all results →</button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4">
            <CurrencySelector showLabel={false} size="small" />
            <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-white/10">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Profile / Auth */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-2">
                <FaUser />
                <span className="hidden md:inline">{user.name || 'Account'}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth" className="uppercase tracking-wider text-sm">Sign In</Link>
                <Link to="/auth?tab=signup" className="uppercase tracking-wider text-sm">Register</Link>
              </div>
            )}

            {/* Settings / quick action */}
            <button className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow">
              <FaCapsules />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-[#FF9E00] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile sticky bottom bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg py-2">
        <div className="flex justify-between max-w-md mx-auto px-4">
          <Link to={user ? "/profile" : "/auth"} className="flex flex-col items-center text-center text-xs text-[#3B4CCA]">
            <FaUser />
            <span>{user ? 'Profile' : 'Login'}</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center text-center text-xs text-[#3B4CCA]">
            <FaSearch />
            <span>Explore</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-center text-xs text-[#3B4CCA] relative">
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartCount}</span>}
          </Link>
          <button onClick={toggleDarkMode} className="flex flex-col items-center text-center text-xs text-[#3B4CCA]">
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile header with hamburger */}
      <header className="sm:hidden px-4 py-3 bg-[#3B4CCA] flex items-center justify-between">
        <CapsuleCorpLogo variant="white" size="sm" to="/" />
        <div className="flex-1 mx-3" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg text-sm"
                aria-label="Search products"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile slide-over menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="grid gap-3">
              {mobileMenuItems.map(i => (
                <Link key={i.label} to={i.to} className="py-3 text-center rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 text-[#3B4CCA]" onClick={() => setMobileMenuOpen(false)}>
                  {i.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;