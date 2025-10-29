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
  FaCaretDown
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  // ThemeToggle handles theme context internally
  const { user, logout } = useAuth();
  const { cartItems, removeFromCart, getCartCount } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Desktop submenu items for Products
  const desktopProductsSubmenu = [
    { label: 'All Products', to: '/products' },
    { label: 'Battle Gear', to: '/products?category=Battle%20Gear', emoji: '⚔️' },
    { label: 'Capsules', to: '/products?category=Capsules', emoji: '🏠' },
    { label: 'Training', to: '/products?category=Training', emoji: '💪' },
    { label: 'Tech', to: '/products?category=Tech', emoji: '📡' },
    { label: 'Consumables', to: '/products?category=Consumables', emoji: '🍃' },
    { label: 'Vehicles', to: '/products?category=Vehicles', emoji: '🚗' },
  ];

  const otherLinks = [
    { label: "Track Order", to: "/order-tracking", emoji: "📦" },
    { label: "Contact", to: "/contact", emoji: "📞" }
  ];

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setActiveDropdown(prev => prev === 'cart' ? null : prev);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setActiveDropdown(prev => prev === 'wishlist' ? null : prev);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setActiveDropdown(prev => prev === 'profile' ? null : prev);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try { 
      await logout(); 
      setActiveDropdown(null);
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <div ref={navRef}>
      {/* Desktop Navigation - Evetech Style */}
      <header className="navbar-desktop">
        <div className="navbar-desktop-container">
          {/* Left: Logo */}
          <div className="navbar-logo">
            <CapsuleCorpLogo variant="white" size="md" />
          </div>

          {/* Center: Search - Evetech Style Pill */}
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper" ref={searchRef}>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setShowSearchResults(true)}
                  placeholder="Search for products, capsules or categories..."
                  className="search-input"
                  aria-label="Search products"
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results-panel">
                    {searchResults.map(product => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.slug}`} 
                        className="search-result-item"
                        onClick={() => { 
                          setShowSearchResults(false); 
                          setSearch(""); 
                        }}
                      >
                        <img src={product.image} alt={product.name} className="search-result-image" />
                        <div className="search-result-info">
                          <div className="search-result-name">{product.name}</div>
                          <div className="search-result-price">
                            <Price value={product.price} />
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="search-view-all">
                      <button 
                        onClick={handleSearchSubmit} 
                        className="search-view-all-button"
                      >
                        View all results →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right: User Controls */}
          <div className="user-controls">
            <div className="currency-selector-wrapper">
              <CurrencySelector showLabel={false} size="small" />
            </div>
            <ThemeToggle className="theme-toggle-button" />
            {user ? (
              <div className="logged-in-icons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={handleLogout} className="logout-button">Log Out</button>
                  {/* Wishlist - Heart icon directly next to Log Out */}
                  <div className="dropdown-wrapper" ref={wishlistRef} style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                      className="icon-button wishlist-button"
                      onClick={() => toggleDropdown('wishlist')}
                    >
                      <FaHeart />
                      {wishlistCount > 0 && (
                        <span className="notification-badge">{wishlistCount}</span>
                      )}
                    </button>
                    {activeDropdown === 'wishlist' && (
                      <div className="dropdown-menu wishlist-dropdown">
                        <div className="dropdown-header">
                          <span>Wishlist</span>
                          <Link 
                            to="/wishlist" 
                            className="view-all-link"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View All
                          </Link>
                        </div>
                        
                        {wishlistItems.length === 0 ? (
                          <div className="dropdown-empty">No items in wishlist</div>
                        ) : (
                          <div className="dropdown-items">
                            {wishlistItems.slice(0, 5).map(item => (
                              <div key={item.id} className="dropdown-item">
                                <img src={item.image} alt={item.name} className="dropdown-item-image" />
                                <div className="dropdown-item-content">
                                  <div className="dropdown-item-name">{item.name}</div>
                                  <div className="dropdown-item-price">
                                    <Price value={item.price} />
                                  </div>
                                </div>
                                <div className="dropdown-item-actions">
                                  <button 
                                    onClick={() => navigate(`/product/${item.slug}`)}
                                    className="action-button secondary"
                                  >
                                    <FaShoppingCart />
                                  </button>
                                  <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="action-button remove"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className="auth-divider">|</span>
                {/* Cart */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="dropdown-wrapper" ref={cartRef} style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                      className="icon-button cart-button"
                      onClick={() => toggleDropdown('cart')}
                    >
                      <FaShoppingCart />
                      {cartCount > 0 && (
                        <span className="notification-badge">{cartCount}</span>
                      )}
                    </button>
                    
                    {activeDropdown === 'cart' && (
                      <div className="dropdown-menu cart-dropdown">
                        <div className="dropdown-header">
                          <span>Shopping Cart</span>
                          <Link 
                            to="/cart" 
                            className="view-all-link"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View Cart
                          </Link>
                        </div>
                        
                        {cartItems.length === 0 ? (
                          <div className="dropdown-empty">
                            <FaShoppingCart className="empty-icon" />
                            <span>Your cart is empty</span>
                          </div>
                        ) : (
                          <>
                            <div className="dropdown-items">
                              {cartItems.slice(0, 5).map(item => (
                                <div key={item.id} className="dropdown-item">
                                  <img src={item.image} alt={item.name} className="dropdown-item-image" />
                                  <div className="dropdown-item-content">
                                    <div className="dropdown-item-name">{item.name}</div>
                                    <div className="dropdown-item-price">
                                      <Price value={item.price} />
                                    </div>
                                    <div className="dropdown-item-quantity">Qty: {item.quantity}</div>
                                  </div>
                                  <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="action-button remove"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="dropdown-footer">
                              <div className="cart-total">
                                Total: <Price value={cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)} />
                              </div>
                              <Link 
                                to="/checkout" 
                                className="checkout-button"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Checkout
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className="auth-divider">|</span>
                {/* Profile Dropdown */}
                <div className="dropdown-wrapper" ref={profileRef} style={{ display: 'flex', alignItems: 'center' }}>
                  <button 
                    className="profile-button"
                    onClick={() => toggleDropdown('profile')}
                  >
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="profile-avatar" 
                    />
                    <span className="profile-name">
                      {user.displayName || user.name || 'Profile'}
                    </span>
                    <FaCaretDown className="dropdown-chevron" />
                  </button>
                  
                  {activeDropdown === 'profile' && (
                    <div className="dropdown-menu profile-dropdown">
                      <div className="profile-welcome">
                        Welcome, {user.displayName || user.name || user.email}
                      </div>
                      <Link to="/profile" className="dropdown-link">My Profile</Link>
                      <Link to="/profile/account" className="dropdown-link">Account Info</Link>
                      <Link to="/profile/address-book" className="dropdown-link">Address Book</Link>
                      <Link to="/profile/order-history" className="dropdown-link">Order History</Link>
                      <Link to="/profile/change-password" className="dropdown-link">Change Password</Link>
                      <Link to="/profile/returns" className="dropdown-link">Return Requests</Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-link logout-button">
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* NOT LOGGED IN STATE - Evetech Style */
              <div className="auth-controls">
                <button 
                  onClick={() => navigate('/auth')}
                  className="auth-link login-link"
                >
                  Login
                </button>
                <span className="auth-divider">|</span>
                <button 
                  onClick={() => navigate('/auth?tab=signup')}
                  className="auth-link register-link"
                >
                  Register
                </button>
                <span className="auth-divider">|</span>
                {/* Wishlist icon hidden when not logged in */}
                <button 
                  onClick={() => navigate('/auth')}
                  className="icon-button cart-button"
                >
                  <FaShoppingCart />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar - Evetech Style Categories */}
      <nav className="secondary-nav">
        <div className="secondary-nav-container">
          <ul className="secondary-nav-list">
            {/* Products with Dropdown */}
            <li 
              className="nav-item with-dropdown"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link" type="button">
                <span>Products</span>
                <FaCaretDown className="dropdown-chevron" />
              </button>
              
              {activeDropdown === 'products' && (
                <div className="nav-dropdown products-dropdown">
                  {desktopProductsSubmenu.map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="dropdown-link"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.emoji && <span className="dropdown-emoji">{item.emoji}</span>}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Other Navigation Links */}
            {otherLinks.map(link => (
              <li key={link.label} className="nav-item">
                <Link to={link.to} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {/* MOBILE HEADER & NAVIGATION: Only visible on small screens */}
      <header className="mobile-header block md:hidden">
        <div className="mobile-header-container flex flex-col items-center justify-center py-3">
          <button 
            className="mobile-menu-button absolute left-4 top-4 bg-neutral-900 rounded-full p-2 shadow-md"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars className="text-white text-xl" />
          </button>
          <div className="mobile-logo flex justify-center items-center w-full">
            {/* Capsule Corp logo icon only, centered */}
            <span className="flex justify-center items-center w-16 h-16 rounded-full bg-neutral-900 shadow-lg">
              <CapsuleCorpLogo variant="white" size="sm" />
            </span>
          </div>
          {/* Centered, compact search bar below logo, no magnifying glass icon */}
          <form onSubmit={handleSearchSubmit} className="mobile-search-form w-full flex justify-center mt-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="mobile-search-input rounded-full px-4 py-2 w-10/12 bg-neutral-800 text-white placeholder-gray-400 border-none shadow-md focus:outline-none"
              aria-label="Search products"
            />
          </form>
        </div>
      </header>
      {/* Mobile Bottom Navigation - Evetech Style, only on small screens */}
      <nav className="mobile-bottom-nav-evetech fixed bottom-0 left-0 w-full z-50 flex justify-center items-center bg-neutral-900 rounded-t-2xl shadow-lg py-2 px-2 gap-2 md:hidden" style={{boxShadow:'0 -2px 16px rgba(0,0,0,0.25)'}}>
        <div className="flex flex-1 justify-evenly items-center gap-1">
          {/* Currency Selector - ensure visible and functional on mobile */}
          <div className="nav-btn flex items-center justify-center">
            <CurrencySelector showLabel={true} size="medium" className="w-full text-xs bg-neutral-800 text-white rounded-lg px-2 py-1" />
          </div>
          {/* Theme Toggle */}
          <div className="nav-btn">
            <ThemeToggle className="theme-toggle-mobile" />
          </div>
          {/* Login/Register */}
          {!user && (
            <>
              <button onClick={() => navigate('/auth')} className="nav-btn text-white text-xs font-bold px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all">Login</button>
              <button onClick={() => navigate('/auth?tab=signup')} className="nav-btn text-white text-xs font-bold px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all">Register</button>
            </>
          )}
          {/* Cart */}
          <button onClick={() => navigate('/cart')} className="nav-btn relative text-white px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all flex items-center">
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1">{cartCount}</span>}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel mt-4 w-[95vw] max-w-sm rounded-2xl bg-neutral-900 shadow-2xl border border-neutral-800 p-0" style={{animation:'slideDown .3s cubic-bezier(.4,2,.6,1)'}} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header flex items-center justify-between px-4 py-3 border-b border-neutral-800 rounded-t-2xl bg-neutral-900">
              <h3 className="text-lg font-bold text-white">Menu</h3>
              <button 
                className="mobile-menu-close text-neutral-400 hover:text-white text-xl p-2 rounded-full bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobile-menu-content px-4 py-2">
              {user && (
                <div className="mobile-user-info flex items-center gap-3 py-2">
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt="Profile" 
                    className="mobile-user-avatar w-10 h-10 rounded-full border border-neutral-700" 
                  />
                  <div className="mobile-user-details">
                    <div className="mobile-user-name text-sm font-bold text-white">
                      {user.displayName || user.name || user.email}
                    </div>
                    <div className="mobile-user-email text-xs text-neutral-400">{user.email}</div>
                  </div>
                </div>
              )}
              <nav className="mobile-menu-nav flex flex-col gap-1 mt-2">
                <Link to="/" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/products" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                <div className="mobile-menu-section text-xs text-neutral-400 mt-2 mb-1">Categories</div>
                {desktopProductsSubmenu.map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="mobile-menu-link category py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.emoji && <span className="mobile-menu-emoji mr-1">{item.emoji}</span>}
                    {item.label}
                  </Link>
                ))}
                <div className="mobile-menu-section text-xs text-neutral-400 mt-2 mb-1">Support</div>
                {otherLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.emoji && <span className="mobile-menu-emoji mr-1">{link.emoji}</span>}
                    {link.label}
                  </Link>
                ))}
                <div className="mobile-menu-section text-xs text-neutral-400 mt-2 mb-1">Account</div>
                {user ? (
                  <>
                    <Link to="/profile" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                    <Link to="/profile/order-history" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Order History</Link>
                    <Link to="/wishlist" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-menu-link logout py-2 px-3 rounded-lg text-white bg-red-700 hover:bg-red-600 text-sm font-semibold">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/auth?tab=signup" className="mobile-menu-link py-2 px-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </>
                )}
              </nav>
              <div className="mobile-menu-footer mt-3 flex justify-center">
                <ThemeToggle className="theme-toggle-mobile" label={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;