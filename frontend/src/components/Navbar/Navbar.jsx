      {/* Mobile horizontal category bar (Evetech style, DBZ colors) */}
      <nav className="mobile-category-bar">
        <ul className="mobile-category-list">
          <li>
            <Link to="/products" className="nav-products-link">
              <span role="img" aria-label="products">🛒</span> Products
            </Link>
          </li>
          <li>
            <Link to="/products?category=Battle%20Gear" className="nav-battle-gear-link">
              <span role="img" aria-label="battle gear">⚔️</span> Battle Gear
            </Link>
          </li>
          <li>
            <Link to="/products?category=Capsules" className="nav-capsules-link">
              <span role="img" aria-label="capsules">🏠</span> Capsules
            </Link>
          </li>
          <li>
            <Link to="/products?category=Training" className="nav-training-link">
              <span role="img" aria-label="training">💪</span> Training
            </Link>
          </li>
          <li>
            <Link to="/products?category=Vehicles" className="nav-vehicles-link">
              <span role="img" aria-label="vehicles">🚗</span> Vehicles
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" className="nav-track-order-link">
              <span role="img" aria-label="track order">📦</span> Track Order
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-contact-link">
              <span role="img" aria-label="contact">📞</span> Contact
            </Link>
          </li>
          <li>
            <Link to="/cart" className="nav-cart-link">
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
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import Price from "../../components/Price";
import { useCurrency } from '../../contexts/CurrencyContext';
import CapsuleCorpLogo from "../../components/CapsuleLogo";
import CurrencySelector from "../../components/CurrencySelector";
import './Navbar.css';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  // Use global theme context
  const { isDarkMode, toggleDarkMode } = useTheme();

  const { user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const navRef = useRef(null);

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
  { label: '🚗 Vehicles', to: '/products?category=Vehicles' },
  ];

  // Theme toggling handled by ThemeProvider

  // Handle search with debounce
  useEffect(() => {
    if (search.trim() && search.trim().length >= 2) {
      // TODO: Implement searchProducts logic here if needed
      // Example: fetch products from API and setSearchResults
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
      // Close any active desktop submenu when clicking outside the nav
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
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

  // toggleDarkMode comes from ThemeContext

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const { formatPrice } = useCurrency();

  return (
    <div ref={navRef}>
      {/* Desktop / large screens - Evetech-like layout: left icons/logo, centered search pill, right controls */}
  <header className="navbar-desktop">{/* darker base to match the Evetech top strip */}
  <div className="navbar-desktop-container">
          {/* Left: CapsuleCorpLogo only, with correct font/style */}
          <div className="navbar-logo">
            <CapsuleCorpLogo variant="white" size="md" />
          </div>

          {/* Center: Search pill */}
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper" ref={searchRef}>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Search for products, capsules or categories"
                  className="search-input"
                  aria-label="Search products"
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results-panel">
                    {searchResults.map(p => (
                      <Link key={p.id} to={`/product/${p.slug}`} className="search-result-item" onClick={() => { setShowSearchResults(false); setSearch(""); }}>
                        <img src={p.image} alt={p.name} className="search-result-image" />
                        <div>
                          <div className="search-result-name">{p.name}</div>
                          <div className="search-result-price"><Price value={p.price} /></div>
                        </div>
                      </Link>
                    ))}
                    <div className="search-view-all">
                      <button onClick={handleSearchSubmit} className="search-view-all-button">View all results →</button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right: Controls */}
          <div className="user-controls">
            <div className="currency-selector-wrapper">
              <CurrencySelector showLabel={false} size="small" />
            </div>
            <button onClick={toggleDarkMode} className="theme-toggle-button">
              {isDarkMode ? <FaMoon /> : <FaSun />}
            </button>
            {/* User controls: Log Out, Wishlist, Cart, Profile, Dark/Light toggle */}
            {user ? (
              <>
                {/* Profile dropdown */}
                <div className="profile-dropdown-wrapper">
                  <button className="profile-button" onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}>
                    <img src={user.photoURL || '/default-avatar.png'} alt="avatar" className="profile-avatar" />
                    <span>Log Out</span>
                  </button>
                  {activeMenu === 'profile' && (
                    <div className="dropdown-menu profile-dropdown">
                      <div className="font-bold mb-2">Welcome<br />{user.displayName || user.name || user.email}</div>
                      <Link to="/profile" className="dropdown-link">My Profile</Link>
                      <Link to="/profile/account" className="dropdown-link">Account Info</Link>
                      <Link to="/profile/address-book" className="dropdown-link">Address Book</Link>
                      <Link to="/profile/order-history" className="dropdown-link">Order History</Link>
                      <Link to="/profile/change-password" className="dropdown-link">Change Password</Link>
                      <Link to="/profile/returns" className="dropdown-link">Return Requests</Link>
                      <button onClick={handleLogout} className="dropdown-link logout-button">Log Out</button>
                    </div>
                  )}
                </div>
                {/* Wishlist dropdown */}
                <div className="wishlist-dropdown-wrapper">
                  <button className="wishlist-button" onClick={() => setActiveMenu(activeMenu === 'wishlist' ? null : 'wishlist')}>
                    <FaHeart />
                  </button>
                  {activeMenu === 'wishlist' && (
                    <div className="dropdown-menu wishlist-dropdown">
                      <div className="font-bold mb-2 flex justify-between items-center">Wishlist <Link to="/wishlist" className="text-xs px-2 py-1 rounded bg-gray-200">View Full Wishlist</Link></div>
                      {wishlistItems.length === 0 ? (
                        <div className="text-gray-500 text-center py-6">No items in wishlist.</div>
                      ) : (
                        <div className="wishlist-items-list">
                          {wishlistItems.map(item => (
                            <div key={item.id} className="dropdown-item">
                              <img src={item.image} alt={item.name} className="dropdown-item-image" />
                              <div className="dropdown-item-content">
                                <div className="dropdown-item-name">{item.name}</div>
                                <div className="dropdown-item-price"><Price value={item.price} /></div>
                              </div>
                              <button onClick={() => removeFromWishlist(item.id)} className="dropdown-action-button"><FaTimes /></button>
                              <button onClick={() => navigate(`/product/${item.slug}`)} className="dropdown-secondary-action"><FaShoppingCart /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Cart dropdown */}
                <div className="cart-dropdown-wrapper">
                  <button className="cart-button" onClick={() => setActiveMenu(activeMenu === 'cart' ? null : 'cart')}>
                    <FaShoppingCart />
                    {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
                  </button>
                  {activeMenu === 'cart' && (
                    <div className="dropdown-menu cart-dropdown">
                      <div className="font-bold mb-2 flex justify-between items-center">Cart <Link to="/cart" className="text-xs px-2 py-1 rounded bg-gray-200">View Full Cart</Link></div>
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center py-6">
                          <FaShoppingCart className="text-4xl text-gray-400 mb-2" />
                          <span className="text-gray-500">Your Cart is Empty.</span>
                        </div>
                      ) : (
                        <div className="cart-items-list">
                          {cartItems.map(item => (
                            <div key={item.id} className="dropdown-item">
                              <img src={item.image} alt={item.name} className="dropdown-item-image" />
                              <div className="dropdown-item-content">
                                <div className="dropdown-item-name">{item.name}</div>
                                <div className="dropdown-item-price"><Price value={item.price} /></div>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="dropdown-action-button"><FaTimes /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Dark/Light toggle */}
                <button onClick={toggleDarkMode} className="theme-toggle-button">
                  {isDarkMode ? <FaMoon /> : <FaSun />}
                </button>
              </>
            ) : (
              <div className="auth-links-wrapper">
                <Link to="/auth" className="auth-link">Login</Link>
                <Link to="/auth?tab=signup" className="auth-link">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Secondary category navigation (desktop) */}
      {/* Secondary dark category bar */}
  <nav className="secondary-nav">
        <div className="secondary-nav-container">
          <ul className="secondary-nav-list">
            {mobileMenuItems.map(item => (
              <li key={item.label}>
                <Link to={item.to} className="secondary-nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile sticky bottom bar */}
      <nav className="mobile-bottom-bar">
        <div className="mobile-bottom-container">
            <Link to={user ? "/profile" : "/auth"} className="mobile-bottom-item mobile-bottom-profile">
              <div className="mobile-bottom-icon">
                <FaUser />
              </div>
              <span>{user ? 'Profile' : 'Login'}</span>
            </Link>
            <Link to="/products" className="mobile-bottom-item mobile-bottom-explore">
              <div className="mobile-bottom-icon">
                <FaSearch />
              </div>
              <span>Explore</span>
            </Link>
            <Link to="/cart" className="mobile-bottom-item mobile-bottom-cart">
              <div className="mobile-bottom-icon">
                <FaShoppingCart />
              </div>
              <span>Cart</span>
              {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
            </Link>
            {/* mobile bottom toggle removed to avoid duplicate toggles when logged in; use header toggle only */}
            <Link to="/notifications" className="mobile-bottom-item mobile-bottom-alerts">
              <div className="mobile-bottom-icon">
                <FaHeart />
              </div>
              <span>Alerts</span>
              {/* Example notification dot */}
              <span className="notification-dot"></span>
            </Link>
        </div>
      </nav>

      {/* Mobile header with hamburger */}
      {/* Make the outer header wrapper non-interactive so decorative background/gradient doesn't block clicks
          Interactive controls inside are explicitly made pointer-events-auto so they still receive input */}
  <header className="mobile-header">
        <div className="mobile-header-interactive">
          <CapsuleCorpLogo variant="white" size="sm" text={false} />
        </div>
        <form onSubmit={handleSearchSubmit} className="mobile-header-interactive">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search.trim() && setShowSearchResults(true)}
              placeholder="Search..."
              className="mobile-search-input"
              aria-label="Search products"
            />
            <button type="submit" className="mobile-menu-button">
              <FaSearch />
            </button>
          </div>
        </form>
        <button
          className="mobile-menu-button"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars />
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
    </div>
  );
}

export default Navbar;