import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaHeart, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { apiFetch } from "../../utils/api";
import CurrencySelector from "../CurrencySelector";
import HomeNavigation from "./HomeNavigation";

function HomeHeader() {
  // shared state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

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
      const timeoutId = setTimeout(searchProducts, 600);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 Search submitted:', search);
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  const handleToggleDarkMode = () => {
    console.log('🌙 Toggling dark mode');
    toggleDarkMode();
  };

  const handleMobileMenuToggle = () => {
    console.log('📱 Mobile menu toggled:', !mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Accessibility: focus trap and Escape handling for mobile menu
  const menuRef = useRef(null);
  const lastFocusedEl = useRef(null);
  const [liveMessage, setLiveMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!mobileMenuOpen) return;
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
      if (e.key === 'Tab') {
        // focus trap
        const focusable = menuRef.current ? menuRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])') : [];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (mobileMenuOpen) {
      // lock body scroll
      document.body.style.overflow = 'hidden';
      lastFocusedEl.current = document.activeElement;
      // focus first focusable element inside menu
      setTimeout(() => {
        const focusable = menuRef.current ? menuRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])') : [];
        if (focusable.length) focusable[0].focus();
      }, 50);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      if (lastFocusedEl.current && lastFocusedEl.current.focus) lastFocusedEl.current.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // announce open/close for screen readers
  useEffect(() => {
    if (mobileMenuOpen) setLiveMessage('Menu opened');
    else setLiveMessage('Menu closed');
  }, [mobileMenuOpen]);

  // Nav links (kept in sync with HomeNavigation)
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "Battle Gear", to: "/battle-gear" },
    { name: "Capsules", to: "/capsules" },
    { name: "Training", to: "/training" },
    { name: "Track Order", to: "/track-order" },
    { name: "Contact", to: "/contact" },
    { name: "Cart", to: "/cart" },
  ];

  return (
    <>
      {/* Screen-reader live region for menu open/close announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="menu-live">{liveMessage}</div>
      
      {/* ---------- Desktop Header (preserve original desktop state) ---------- */}
      <header className="hidden md:block bg-white shadow-sm relative z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => console.log('Logo clicked')}
          >
            <img src="/images/CAPSULE CORP IMG.svg" alt="Capsule Corp" className="w-12 h-12 object-contain" />
          </Link>

          {/* Center: desktop navigation (keeps original desktop layout) */}
          <div className="flex-1 mx-6">
            <HomeNavigation />
          </div>

          {/* Right: desktop actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleDarkMode} 
              aria-label="Toggle theme" 
              className="p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <Link 
                to="/profile" 
                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                onClick={() => console.log('Profile clicked')}
              >
                <FaUser /> <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                onClick={() => console.log('Login clicked')}
              >
                <FaUser /> <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            <Link 
              to="/wishlist" 
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
              onClick={() => console.log('Wishlist clicked')}
            >
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{wishlistCount}</span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
              onClick={() => console.log('Cart clicked')}
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9E00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Mobile Header (Evetech-like) ---------- */}
      <header className="block md:hidden bg-white shadow-md relative z-50">
        <div className="px-3 py-2 flex items-center justify-between">
          {/* Logo (left) - image only */}
          <Link 
            to="/" 
            className="flex items-center cursor-pointer"
            onClick={() => console.log('Mobile logo clicked')}
          >
            <img src="/images/CAPSULE CORP IMG.svg" alt="Capsule Corp" className="w-10 h-10 object-contain" />
          </Link>

          {/* Search (center) */}
          <div className="flex-1 px-3" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none cursor-text"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer p-1"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Hamburger (right) - animated with simple CSS */}
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={handleMobileMenuToggle}
            className="p-2 relative w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded transition-colors"
          >
            {/* CSS hamburger that morphs to X using transforms and opacity */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect className={`hamburger-line top ${mobileMenuOpen ? 'open' : ''}`} x="3" y="5" width="18" height="2.2" rx="1" fill="currentColor" />
              <rect className={`hamburger-line middle ${mobileMenuOpen ? 'open' : ''}`} x="3" y="11" width="18" height="2.2" rx="1" fill="currentColor" />
              <rect className={`hamburger-line bottom ${mobileMenuOpen ? 'open' : ''}`} x="3" y="17" width="18" height="2.2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay (full screen) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white overflow-auto mobile-menu-overlay" aria-modal="true" role="dialog">
            <div className="px-4 pt-6 pb-36" ref={menuRef}>
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  onClick={() => {
                    console.log('Mobile menu logo clicked');
                    setMobileMenuOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <img src="/images/CAPSULE CORP IMG.svg" alt="Capsule Corp" className="w-12 h-12 object-contain" />
                </Link>
                <button 
                  onClick={() => {
                    console.log('Close mobile menu clicked');
                    setMobileMenuOpen(false);
                  }} 
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors" 
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-[#FFD700]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M20 4L4 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                {/* Evetech-like tattoo dropdown style for product items */}
                <ul className="flex flex-col gap-3">
                  {navLinks.map(link => (
                    <li key={link.to} className="relative overflow-hidden">
                      <div className="hover-translate">
                        <Link
                          to={link.to}
                          onClick={() => {
                            console.log('Mobile menu link clicked:', link.name);
                            setMobileMenuOpen(false);
                          }}
                          className="block px-4 py-5 text-lg text-[#111827] font-semibold bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm border-l-4 border-transparent hover:border-l-4 hover:border-[#3B4CCA] transition-all cursor-pointer"
                        >
                          <span className="uppercase text-sm text-gray-500 block mb-1">Category</span>
                          <span className="text-xl">{link.name}</span>
                        </Link>
                      </div>
                      {/* decorative tattoo line */}
                      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#3B4CCA] to-transparent opacity-30" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky bottom action bar */}
            <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-2 z-50 mobile-bottom-bar">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                {/* Left group: profile icon, login text, register text (compact) */}
                <div className="flex items-center gap-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      console.log('Mobile bottom profile clicked');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaUser className="text-xl" />
                  </Link>
                  {!user && (
                    <>
                      <Link 
                        to="/auth" 
                        className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          console.log('Mobile bottom login clicked');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          console.log('Mobile bottom register clicked');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>

                {/* Center group: encased theme + currency */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                  <button 
                    onClick={handleToggleDarkMode} 
                    className="p-1 text-sm cursor-pointer hover:bg-gray-200 rounded transition-colors"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
                  </button>
                  <div className="w-28">
                    <CurrencySelector size="small" showLabel={false} />
                  </div>
                </div>

                {/* Right group: cart icon only and wishlist icon only */}
                <div className="flex items-center gap-4">
                  <Link 
                    to="/cart" 
                    className="relative p-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      console.log('Mobile bottom cart clicked');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaShoppingCart className="text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-[#FF9E00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="p-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      console.log('Mobile bottom wishlist clicked');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaHeart className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default HomeHeader;