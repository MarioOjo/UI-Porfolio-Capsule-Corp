import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaHeart,
  FaTimes,
  FaBars,
  FaCaretDown
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Price from "../../components/Price";
import CapsuleCorpLogo from "../../components/CapsuleLogo";
import CurrencySelector from "../../components/CurrencySelector";
import './Navbar.css';
import { resolveImageSrc } from '../../utils/images';

// Enhanced Image Component for Navbar
const NavbarImage = ({ item, size = 120, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    if (item?.image) {
      setCurrentSrc(resolveImageSrc(item, size));
    }
  }, [item, size]);

  const handleError = () => {
    if (!imageError && item?.image) {
      // First try the original image directly
      setCurrentSrc(item.image);
      setImageError(true);
    } else {
      // Final fallback - show placeholder
      setCurrentSrc("");
    }
  };

  if (!currentSrc || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold rounded`}>
        {item?.name ? (
          <span className="text-xs">{item.name.charAt(0)}</span>
        ) : (
          <FaShoppingCart className="text-xs" />
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={item?.name || "Product image"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { user, logout, isAdmin } = useAuth();
  const { cartItems, removeFromCart, getCartCount, getCartTotal } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const profileRef = useRef(null);
  const navRef = useRef(null);

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

  // Close dropdowns/search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchResults(false);
      if (cartRef.current && !cartRef.current.contains(e.target) && activeDropdown === 'cart') setActiveDropdown(null);
      if (wishlistRef.current && !wishlistRef.current.contains(e.target) && activeDropdown === 'wishlist') setActiveDropdown(null);
      if (profileRef.current && !profileRef.current.contains(e.target) && activeDropdown === 'profile') setActiveDropdown(null);
      if (navRef.current && !navRef.current.contains(e.target) && activeDropdown === 'products') setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    const body = document.body;
    const onKey = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };

    if (mobileMenuOpen) {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
    }

    document.addEventListener('keydown', onKey);
    return () => {
      body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try { 
      await logout(); 
      setActiveDropdown(null); 
    } catch (e) { 
      console.error('Logout error:', e); 
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

  const toggleDropdown = (name) => setActiveDropdown(prev => prev === name ? null : name);
  
  // Enhanced cart calculations
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const wishlistCount = getWishlistCount();

  // Enhanced cart item removal with better UX
  const [removingItem, setRemovingItem] = useState(null);

  const handleRemoveFromCart = async (e, itemId, itemName) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set removing state for visual feedback
    setRemovingItem(itemId);
    
    try {
      await removeFromCart(itemId);
      
      // Visual feedback complete - item will disappear from list
      setTimeout(() => {
        setRemovingItem(null);
      }, 300);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setRemovingItem(null);
      // Optionally show error notification
    }
  };

  return (
    <div ref={navRef}>
      {/* Desktop Navigation */}
      <header className="navbar-desktop bg-neutral-900 text-white">
        <div className="navbar-desktop-container flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="navbar-logo">
            <CapsuleCorpLogo variant="white" size="md" />
          </div>

          {/* Search */}
          <div className="search-container flex-1 mx-4">
            <form onSubmit={handleSearchSubmit} className="search-form relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Search for products, capsules or categories..."
                className="search-input w-full rounded-full px-4 py-2 text-black"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-black">
                <FaSearch />
              </button>
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results-panel absolute w-full bg-white text-black rounded-lg shadow-lg mt-1 z-50">
                  {searchResults.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.slug}`} 
                      className="search-result-item flex items-center p-2 hover:bg-gray-100" 
                      onClick={() => { setShowSearchResults(false); setSearch(""); }}
                    >
                      <NavbarImage 
                        item={p}
                        size={80}
                        className="w-12 h-12 object-cover mr-2 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{p.name}</div>
                        <div className="text-sm text-green-600 font-medium">
                          <Price value={parseFloat(p.price) || 0} />
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="text-center py-2 border-t">
                    <button onClick={handleSearchSubmit} className="text-blue-600 font-semibold text-sm">
                      View all results →
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* User Controls */}
          <div className="user-controls flex items-center gap-4">
            <CurrencySelector showLabel={false} size="small" />
            <ThemeToggle />

            {user ? (
              <div className="logged-in-icons flex items-center gap-4">
                {/* Wishlist */}
                <div className="relative" ref={wishlistRef}>
                  <button 
                    className="icon-button" 
                    onClick={() => toggleDropdown('wishlist')} 
                    aria-haspopup="true" 
                    aria-expanded={activeDropdown === 'wishlist'}
                  >
                    <FaHeart />
                    {wishlistCount > 0 && <span className="notification-badge">{wishlistCount}</span>}
                  </button>
                  {activeDropdown === 'wishlist' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="dropdown-header flex justify-between px-4 py-3 font-bold border-b border-neutral-300">
                        <span>Wishlist</span>
                        <Link 
                          to="/wishlist" 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View All
                        </Link>
                      </div>
                      {wishlistItems.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No items in wishlist</div>
                      ) : (
                        wishlistItems.slice(0, 5).map(item => (
                          <div key={item.id} className="dropdown-item flex items-center p-3 border-b border-neutral-200 hover:bg-gray-50">
                            <NavbarImage 
                              item={item}
                              size={60}
                              className="w-10 h-10 object-cover rounded mr-3 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{item.name}</div>
                              <div className="text-green-600 font-semibold text-sm">
                                <Price value={parseFloat(item.price) || 0} />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <button 
                                onClick={() => {
                                  navigate(`/product/${item.slug}`);
                                  setActiveDropdown(null);
                                }} 
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Add to cart"
                              >
                                <FaShoppingCart className="text-sm"/>
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.id)} 
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove from wishlist"
                              >
                                <FaTimes className="text-sm"/>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative" ref={cartRef}>
                  <button 
                    className="icon-button" 
                    onClick={() => toggleDropdown('cart')} 
                    aria-haspopup="true" 
                    aria-expanded={activeDropdown==='cart'}
                  >
                    <FaShoppingCart/>
                    {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
                  </button>
                  {activeDropdown === 'cart' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-80 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="dropdown-header flex justify-between px-4 py-3 font-bold border-b border-neutral-300">
                        <span>Shopping Cart</span>
                        <Link 
                          to="/cart" 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View Cart
                        </Link>
                      </div>
                      {cartItems.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <FaShoppingCart className="text-3xl text-gray-300 mx-auto mb-2" />
                          <p>Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-80 overflow-y-auto">
                            {cartItems.slice(0, 5).map(item => (
                              <div 
                                key={item.id} 
                                className={`dropdown-item flex items-center p-3 border-b border-neutral-200 hover:bg-gray-50 transition-all ${
                                  removingItem === item.id ? 'removing' : ''
                                }`}
                              >
                                <NavbarImage 
                                  item={item}
                                  size={80}
                                  className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{item.name}</div>
                                  <div className="text-green-600 font-semibold text-sm">
                                    <Price value={parseFloat(item.price) || 0} />
                                  </div>
                                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                </div>
                                <button 
                                  onClick={(e) => handleRemoveFromCart(e, item.id, item.name)} 
                                  disabled={removingItem === item.id}
                                  className={`text-red-600 hover:text-red-800 hover:bg-red-50 p-2 ml-2 flex-shrink-0 rounded transition-all ${
                                    removingItem === item.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  title="Remove from cart"
                                >
                                  {removingItem === item.id ? (
                                    <div className="animate-spin">⌛</div>
                                  ) : (
                                    <FaTimes className="text-sm"/>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 border-t">
                            <div className="flex justify-between items-center mb-3 font-bold">
                              <span>Subtotal:</span>
                              <span className="text-green-600">
                                <Price value={cartTotal} />
                              </span>
                            </div>
                            <Link 
                              to="/checkout" 
                              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors font-medium"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Checkout Now
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button 
                    className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-2 rounded-lg transition-colors" 
                    onClick={() => toggleDropdown('profile')} 
                    aria-haspopup="true" 
                    aria-expanded={activeDropdown==='profile'}
                  >
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <span className="max-w-32 truncate">{user.displayName || user.name || 'Profile'}</span>
                    <FaCaretDown className="text-sm"/>
                  </button>
                  {activeDropdown === 'profile' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="p-4 font-bold border-b border-neutral-300 bg-gray-50">
                        Welcome, {user.displayName || user.name || user.email}
                      </div>
                      <div className="py-2">
                        <Link to="/profile" className="dropdown-link" onClick={() => setActiveDropdown(null)}>
                          <FaUser className="dropdown-emoji" />
                          My Profile
                        </Link>
                        {isAdmin && (
                          <>
                            <Link to="/admin" className="dropdown-link" onClick={() => setActiveDropdown(null)}>
                              <span className="dropdown-emoji">⚡</span>
                              Admin Dashboard
                            </Link>
                            <div className="dropdown-divider"></div>
                          </>
                        )}
                        <Link to="/profile/order-history" className="dropdown-link" onClick={() => setActiveDropdown(null)}>
                          <span className="dropdown-emoji">📦</span>
                          Order History
                        </Link>
                        <Link to="/profile/address-book" className="dropdown-link" onClick={() => setActiveDropdown(null)}>
                          <span className="dropdown-emoji">🏠</span>
                          Address Book
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to="/profile/change-password" className="dropdown-link" onClick={() => setActiveDropdown(null)}>
                          <span className="dropdown-emoji">🔒</span>
                          Change Password
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-link logout-button w-full text-left"
                        >
                          <span className="dropdown-emoji">🚪</span>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/auth')} 
                  className="hover:text-orange-400 transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800"
                >
                  Login
                </button>
                <span className="text-gray-400">|</span>
                <button 
                  onClick={() => navigate('/auth?tab=signup')} 
                  className="hover:text-orange-400 transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation (desktop categories) */}
      <nav className="secondary-nav bg-neutral-800 text-white hidden md:block">
        <div className="secondary-nav-container flex justify-center px-4 py-1">
          <ul className="flex gap-4">
            <li 
              className="relative" 
              onMouseEnter={() => setActiveDropdown('products')} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 hover:bg-neutral-700 rounded-lg transition-colors">
                Products <FaCaretDown/>
              </button>
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-60 bg-neutral-900 rounded-lg shadow-lg mt-1 z-50 border border-neutral-700">
                  {desktopProductsSubmenu.map(item => (
                    <Link 
                      key={item.label} 
                      to={item.to} 
                      className="block px-4 py-3 hover:bg-neutral-700 transition-colors border-b border-neutral-700 last:border-b-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.emoji && <span className="mr-3">{item.emoji}</span>}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            {otherLinks.map(link => (
              <li key={link.label}>
                <Link 
                  to={link.to} 
                  className="px-3 py-2 hover:bg-neutral-700 rounded-lg transition-colors block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="mobile-header block md:hidden bg-neutral-900 text-white relative">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(true)} 
            aria-label="Open menu" 
            aria-expanded={mobileMenuOpen} 
            aria-controls="mobile-menu-panel" 
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <FaBars className="text-xl"/>
          </button>
          <div className="flex justify-center items-center flex-1">
            <CapsuleCorpLogo variant="white" size="sm"/>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <CurrencySelector showLabel={false} size="small"/>
          </div>
        </div>
        <form onSubmit={handleSearchSubmit} className="px-4 py-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full px-4 py-2 bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </form>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 w-full flex justify-evenly items-center bg-neutral-900 text-white py-2 px-2 gap-2 md:hidden rounded-t-2xl shadow-lg border-t border-neutral-700">
        {!user ? (
          <>
            <button 
              onClick={() => navigate('/auth')} 
              className="px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-xs flex-1 text-center"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/auth?tab=signup')} 
              className="px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-xs flex-1 text-center"
            >
              Register
            </button>
          </>
        ) : null}
        <button 
          onClick={() => navigate('/cart')} 
          className="relative px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center justify-center flex-1"
        >
          <FaShoppingCart className="text-lg"/>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start" onClick={() => setMobileMenuOpen(false)}>
          <div 
            id="mobile-menu-panel" 
            role="dialog" 
            aria-modal="true" 
            aria-label="Main menu" 
            className="mobile-menu-panel w-[95%] max-w-sm mt-4 bg-neutral-900 rounded-2xl shadow-2xl p-4 border border-neutral-700" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg">Menu</h3>
              <button 
                type="button" 
                onClick={() => setMobileMenuOpen(false)} 
                aria-label="Close menu" 
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <FaTimes/>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <Link to="/" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-menu-emoji">🏠</span>
                Home
              </Link>
              <Link to="/products" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-menu-emoji">🛍️</span>
                All Products
              </Link>

              <div className="mobile-menu-section">Categories</div>
              {desktopProductsSubmenu.map(item => (
                <Link 
                  key={item.label} 
                  to={item.to} 
                  className="mobile-menu-link category" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-menu-emoji">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}

              <div className="mobile-menu-section">Support</div>
              {otherLinks.map(link => (
                <Link 
                  key={link.label} 
                  to={link.to} 
                  className="mobile-menu-link" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-menu-emoji">{link.emoji}</span>
                  {link.label}
                </Link>
              ))}

              <div className="mobile-menu-section">Account</div>
              {user ? (
                <>
                  <Link to="/profile" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mobile-menu-emoji">👤</span>
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                      <span className="mobile-menu-emoji">⚡</span>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile/order-history" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mobile-menu-emoji">📦</span>
                    Order History
                  </Link>
                  <Link to="/wishlist" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mobile-menu-emoji">❤️</span>
                    Wishlist
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="mobile-menu-link logout"
                  >
                    <span className="mobile-menu-emoji">🚪</span>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mobile-menu-emoji">🔑</span>
                    Login
                  </Link>
                  <Link to="/auth?tab=signup" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mobile-menu-emoji">📝</span>
                    Register
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-4 flex justify-center">
              <ThemeToggle label={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;