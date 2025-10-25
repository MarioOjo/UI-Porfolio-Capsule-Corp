      {/* Mobile horizontal category bar (Evetech style, DBZ colors) */}
      <nav className="sm:hidden w-full bg-[#0b1220] border-b z-40 overflow-x-auto">
        <ul className="flex items-center gap-2 py-2 px-2 text-xs font-saiyan text-white whitespace-nowrap">
          <li>
            <Link to="/products" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow hover:scale-105 transition">
              <span role="img" aria-label="products">🛒</span> Products
            </Link>
          </li>
          <li>
            <Link to="/products?category=Battle%20Gear" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 shadow hover:scale-105 transition">
              <span role="img" aria-label="battle gear">⚔️</span> Battle Gear
            </Link>
          </li>
          <li>
            <Link to="/products?category=Capsules" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 shadow hover:scale-105 transition">
              <span role="img" aria-label="capsules">🏠</span> Capsules
            </Link>
          </li>
          <li>
            <Link to="/products?category=Training" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow hover:scale-105 transition">
              <span role="img" aria-label="training">💪</span> Training
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 shadow hover:scale-105 transition">
              <span role="img" aria-label="track order">📦</span> Track Order
            </Link>
          </li>
          <li>
            <Link to="/contact" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow hover:scale-105 transition">
              <span role="img" aria-label="contact">📞</span> Contact
            </Link>
          </li>
          <li>
            <Link to="/cart" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow hover:scale-105 transition">
              <span role="img" aria-label="cart">🛒</span> Cart
            </Link>
          </li>
        </ul>
      </nav>
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
  // Improved dark mode: detect system preference on first load
  const getInitialTheme = () => {
    const saved = localStorage.getItem('capsule-theme');
    if (saved !== null) return JSON.parse(saved);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
  };
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

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

  // Desktop submenu state (for Products)
  const [activeMenu, setActiveMenu] = useState(null);

  const desktopProductsSubmenu = [
    { label: 'All Products', to: '/products' },
    { label: '⚔️ Battle Gear', to: '/products?category=Battle%20Gear' },
    { label: '🏠 Capsules', to: '/products?category=Capsules' },
    { label: '💪 Training', to: '/products?category=Training' },
    { label: '📡 Tech', to: '/products?category=Tech' },
    { label: '🍃 Consumables', to: '/products?category=Consumables' },
  ];

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('capsule-theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
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

  // Lock body scroll when mobile menu is open to avoid layout shifts and overlapping interactions
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [mobileMenuOpen]);

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
      {/* Desktop / large screens - Evetech-like layout: left icons/logo, centered search pill, right controls */}
  <header className="hidden sm:block bg-[#0f1724] text-white z-50">{/* darker base to match the Evetech top strip */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          {/* Left: CapsuleCorpLogo only, with correct font/style */}
          <div className="flex items-center gap-4">
            <CapsuleCorpLogo variant="white" size="md" />
          </div>

          {/* Center: Search pill */}
          <div className="flex-1 px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Search for products, capsules or categories"
                  className="w-full px-4 py-3 rounded-full pr-12 bg-white text-gray-800 shadow-sm focus:outline-none"
                  aria-label="Search products"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                  <FaSearch />
                </button>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="popover-panel absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl z-60">
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
            <div className={isDarkMode ? "text-white" : "text-gray-800"}>
              <CurrencySelector showLabel={false} size="small" />
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-white/10">
              {isDarkMode ? <FaMoon /> : <FaSun />}
            </button>
            {/* User controls: Log Out, Wishlist, Cart, Profile, Dark/Light toggle */}
            {user ? (
              <>
                {/* Profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 transition" onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}>
                    <img src={user.photoURL || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm">Log Out</span>
                  </button>
                  {activeMenu === 'profile' && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 p-4">
                      <div className="font-bold mb-2">Welcome<br />{user.displayName || user.name || user.email}</div>
                      <Link to="/profile" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100 font-medium">My Profile</Link>
                      <Link to="/profile/account" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100">Account Info</Link>
                      <Link to="/profile/address-book" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100">Address Book</Link>
                      <Link to="/profile/order-history" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100">Order History</Link>
                      <Link to="/profile/change-password" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100">Change Password</Link>
                      <Link to="/profile/returns" className="block mb-2 py-2 px-3 rounded hover:bg-gray-100">Return Requests</Link>
                      <button onClick={handleLogout} className="w-full mt-2 py-2 px-3 rounded bg-red-500 text-white font-bold hover:bg-red-600">Log Out</button>
                    </div>
                  )}
                </div>
                {/* Wishlist dropdown */}
                <div className="relative group">
                  <button className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 transition flex items-center" onClick={() => setActiveMenu(activeMenu === 'wishlist' ? null : 'wishlist')}>
                    <FaHeart className="text-xl" />
                  </button>
                  {activeMenu === 'wishlist' && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 p-4">
                      <div className="font-bold mb-2 flex justify-between items-center">Wishlist <Link to="/wishlist" className="text-xs px-2 py-1 rounded bg-gray-200">View Full Wishlist</Link></div>
                      {wishlistItems.length === 0 ? (
                        <div className="text-gray-500 text-center py-6">No items in wishlist.</div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {wishlistItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{item.name}</div>
                                <div className="text-xs text-gray-600"><Price value={item.price} /></div>
                              </div>
                              <button onClick={() => removeFromWishlist(item.id)} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                              <button onClick={() => navigate(`/product/${item.slug}`)} className="text-blue-500 hover:text-blue-700"><FaShoppingCart /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Cart dropdown */}
                <div className="relative group">
                  <button className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 transition flex items-center" onClick={() => setActiveMenu(activeMenu === 'cart' ? null : 'cart')}>
                    <FaShoppingCart className="text-xl" />
                    {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-[#FF9E00] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartCount}</span>}
                  </button>
                  {activeMenu === 'cart' && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 p-4">
                      <div className="font-bold mb-2 flex justify-between items-center">Cart <Link to="/cart" className="text-xs px-2 py-1 rounded bg-gray-200">View Full Cart</Link></div>
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center py-6">
                          <FaShoppingCart className="text-4xl text-gray-400 mb-2" />
                          <span className="text-gray-500">Your Cart is Empty.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{item.name}</div>
                                <div className="text-xs text-gray-600"><Price value={item.price} /></div>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Dark/Light toggle */}
                <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-white/10">
                  {isDarkMode ? <FaMoon /> : <FaSun />}
                </button>
              </>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/auth" className="uppercase tracking-wider text-sm">Login</Link>
                <Link to="/auth?tab=signup" className="uppercase tracking-wider text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Secondary category navigation (desktop) */}
      {/* Secondary dark category bar */}
      <nav className="hidden sm:block bg-[#0b1220] border-b z-40">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-3 py-3 text-sm text-gray-200 overflow-x-auto justify-center">
            {mobileMenuItems.map(item => {
              // Render Products as a simple link, no dropdown
              if (item.label === 'Products') {
                return (
                  <li key={item.label}>
                    <Link to={item.to} className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/6 transition-colors font-medium text-sm">
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link to={item.to} className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/6 transition-colors font-medium text-sm">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile sticky bottom bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg py-2">
        <div className="flex justify-between max-w-md mx-auto px-4">
            <Link to={user ? "/profile" : "/auth"} className="flex flex-col items-center text-center text-xs font-saiyan text-white">
              <div className="bg-[#FFD700] p-2 rounded-full shadow-lg mb-1">
                <FaUser className="text-[#3B4CCA] text-lg" />
              </div>
              <span>{user ? 'Profile' : 'Login'}</span>
            </Link>
            <Link to="/products" className="flex flex-col items-center text-center text-xs font-saiyan text-white">
              <div className="bg-[#3B4CCA] p-2 rounded-full shadow-lg mb-1">
                <FaSearch className="text-[#FFD700] text-lg" />
              </div>
              <span>Explore</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-center text-xs font-saiyan text-white relative">
              <div className="bg-[#FF9E00] p-2 rounded-full shadow-lg mb-1">
                <FaShoppingCart className="text-white text-lg" />
              </div>
              <span>Cart</span>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartCount}</span>}
            </Link>
            <button onClick={toggleDarkMode} className="flex flex-col items-center text-center text-xs font-saiyan text-white">
              <div className={`p-2 rounded-full shadow-lg mb-1 ${isDarkMode ? 'bg-[#3B4CCA]' : 'bg-[#FFD700]'}`}> 
                {isDarkMode ? <FaMoon className="text-[#FFD700] text-lg" /> : <FaSun className="text-[#3B4CCA] text-lg" />}
              </div>
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
            <Link to="/notifications" className="flex flex-col items-center text-center text-xs font-saiyan text-white relative">
              <div className="bg-red-500 p-2 rounded-full shadow-lg mb-1">
                <FaHeart className="text-white text-lg" />
              </div>
              <span>Alerts</span>
              {/* Example notification dot */}
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs"></span>
            </Link>
        </div>
      </nav>

      {/* Mobile header with hamburger */}
      {/* Make the outer header wrapper non-interactive so decorative background/gradient doesn't block clicks
          Interactive controls inside are explicitly made pointer-events-auto so they still receive input */}
      <header className="sm:hidden px-2 py-2 bg-gradient-to-r from-[#3B4CCA] via-[#FF9E00] to-[#3B4CCA] flex items-center justify-between z-50 shadow-md pointer-events-none">
        <div className="flex items-center pointer-events-auto">
          <CapsuleCorpLogo variant="white" size="sm" text={false} />
        </div>
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-2 pointer-events-auto">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search.trim() && setShowSearchResults(true)}
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-full text-sm bg-white text-gray-800 shadow focus:outline-none"
              aria-label="Search products"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FF9E00]">
              <FaSearch />
            </button>
          </div>
        </form>
        <button
          className="p-2 rounded-full bg-[#FFD700] text-[#3B4CCA] shadow-lg pointer-events-auto"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>
      </header>

      {/* Mobile slide-over menu with hamburger in submenu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="grid gap-3">
              <button className="flex items-center gap-2 justify-center py-3 rounded-lg bg-gradient-to-r from-blue-100 to-orange-100 text-[#3B4CCA] font-saiyan font-bold text-base mb-2" disabled>
                <FaBars className="text-xl" />
                MENU
              </button>
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