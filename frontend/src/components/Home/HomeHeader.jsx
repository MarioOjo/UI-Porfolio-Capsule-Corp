// HomeHeader.js (Enhanced DBZ Version)
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaShoppingCart, 
  FaSearch, 
  FaHeart, 
  FaMoon, 
  FaSun,
  FaBolt,
  FaDragon,
  FaTimes,
  FaCog
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { apiFetch } from "../../utils/api";
import CurrencySelector from "../CurrencySelector";
import HomeNavigation from "./HomeNavigation";
import "./HomeHeader.css";

function HomeHeader() {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currency } = useCurrency();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const navLinks = [
    { name: "Home", to: "/", description: "Capsule Corp Headquarters" },
    { name: "Products", to: "/products", description: "Browse All Gear" },
    { name: "Battle Gear", to: "/battle-gear", description: "Combat Equipment", badge: "HOT" },
    { name: "Capsules", to: "/capsules", description: "Portable Storage" },
    { name: "Training", to: "/training", description: "Power Up" },
    { name: "Track Order", to: "/track-order", description: "Scouter Tracking" },
    { name: "Contact", to: "/contact", description: "Reach Capsule Corp" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && mobileMenuOpen) {
        handleMobileMenuClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) handleMobileMenuClose();
        if (searchOpen) setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    setLiveMessage(newState ? "Menu opened" : "Menu closed");
    
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setLiveMessage("Menu closed");
    document.body.style.overflow = 'unset';
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchRef.current?.querySelector('input')?.focus();
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Logged out successfully!");
      handleMobileMenuClose();
    } catch (error) {
      showError("Failed to logout");
    }
  };

  const handleQuickLinkClick = () => {
    handleMobileMenuClose();
    setSearchOpen(false);
  };

  return (
    <>
      {/* Screen-reader live region for menu open/close announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
      
      {/* ---------- Desktop Header ---------- */}
      <header 
        className={`home-header-desktop ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : 'light'}`}
        role="banner"
      >
        {/* Top Promotion Bar */}
        <div className="header-promo-bar">
          <div className="header-container">
            <div className="promo-content">
              <FaBolt className="promo-icon" />
              <span className="promo-text">
                🚀 FREE Instant Transmission Delivery on Orders Over 5000 Zeni!
              </span>
              <FaBolt className="promo-icon" />
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="header-main">
          <div className="header-container">
            {/* Logo */}
            <Link 
              to="/" 
              className="header-logo focus-outline"
              aria-label="Capsule Corp - Home"
            >
              <FaDragon className="logo-icon" />
              <div className="logo-text">
                <span className="logo-main">CAPSULE</span>
                <span className="logo-accent">CORP</span>
              </div>
              <div className="logo-glow"></div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav" aria-label="Main navigation">
              <HomeNavigation />
            </nav>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Search */}
              <div 
                ref={searchRef}
                className={`search-container ${searchOpen ? 'open' : ''}`}
              >
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for legendary gear..."
                    aria-label="Search products"
                    className="search-input"
                  />
                  <button 
                    type="submit" 
                    className="search-submit focus-outline"
                    aria-label="Submit search"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>

              <button 
                onClick={handleSearchToggle}
                className="header-action-btn search-toggle focus-outline"
                aria-label="Toggle search"
              >
                <FaSearch />
              </button>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="header-action-btn theme-toggle focus-outline"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>

              {/* Currency Selector */}
              <div className="currency-selector-wrapper">
                <CurrencySelector />
              </div>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="user-menu-wrapper">
                  <Link 
                    to="/profile" 
                    className="header-action-btn user-btn focus-outline"
                    aria-label="Your profile"
                  >
                    <FaUser />
                    <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || 'Warrior'}!</span>
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="header-action-btn auth-btn focus-outline"
                  aria-label="Sign in or register"
                >
                  <FaUser />
                  <span>Login</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="header-action-btn wishlist-btn focus-outline"
                aria-label="Your wishlist"
              >
                <FaHeart />
                {wishlistCount > 0 && (
                  <span className="action-badge">{wishlistCount > 99 ? '99+' : wishlistCount}</span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="header-action-btn cart-btn focus-outline"
                aria-label="Shopping cart"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="action-badge cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Mobile Header ---------- */}
      <header 
        className={`home-header-mobile ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : 'light'}`}
        role="banner"
      >
        <div className="mobile-header-container">
          {/* Logo */}
          <Link 
            to="/" 
            className="mobile-logo focus-outline"
            aria-label="Capsule Corp - Home"
          >
            <FaDragon className="logo-icon" />
            <span className="logo-text">CAPSULE CORP</span>
          </Link>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            {/* Search Toggle */}
            <button 
              onClick={handleSearchToggle}
              className="mobile-action-btn focus-outline"
              aria-label="Search products"
            >
              <FaSearch />
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="mobile-action-btn cart-btn focus-outline"
              aria-label="Shopping cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="mobile-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={handleMobileMenuToggle}
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''} focus-outline`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="mobile-search-container">
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for legendary gear..."
                aria-label="Search products"
                className="mobile-search-input"
                ref={input => input?.focus()}
              />
              <button 
                type="submit" 
                className="mobile-search-submit focus-outline"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
              <button 
                type="button"
                onClick={() => setSearchOpen(false)}
                className="mobile-search-close focus-outline"
                aria-label="Close search"
              >
                <FaTimes />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-overlay" 
            onClick={handleMobileMenuClose}
            aria-hidden="true"
          />
          <div 
            ref={menuRef}
            className="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            {/* Menu Header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-user">
                {isAuthenticated ? (
                  <>
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user?.name || 'Z-Fighter'}</div>
                      <div className="user-email">{user?.email}</div>
                    </div>
                  </>
                ) : (
                  <div className="guest-welcome">
                    <FaBolt className="welcome-icon" />
                    <span>Welcome, Warrior!</span>
                  </div>
                )}
              </div>
              <button 
                onClick={handleMobileMenuClose}
                className="mobile-menu-close focus-outline"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mobile-menu-nav" aria-label="Mobile navigation">
              <ul className="mobile-nav-list">
                {navLinks.map((link, index) => (
                  <li key={link.to} className="mobile-nav-item">
                    <Link
                      to={link.to}
                      onClick={handleQuickLinkClick}
                      className="mobile-nav-link focus-outline"
                    >
                      <span className="nav-link-content">
                        <span className="nav-link-name">{link.name}</span>
                        <span className="nav-link-desc">{link.description}</span>
                      </span>
                      {link.badge && (
                        <span className="nav-link-badge">{link.badge}</span>
                      )}
                      <div className="nav-link-glow"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Menu Footer */}
            <div className="mobile-menu-footer">
              <div className="mobile-menu-actions">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="mobile-action-large focus-outline"
                >
                  {isDarkMode ? (
                    <>
                      <FaSun />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FaMoon />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                {/* Currency Selector */}
                <div className="mobile-action-large currency-selector-mobile">
                  <FaCog />
                  <CurrencySelector size="small" />
                </div>

                {/* Auth Actions */}
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="mobile-action-large focus-outline"
                      onClick={handleQuickLinkClick}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="mobile-action-large logout-btn focus-outline"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="mobile-auth-buttons">
                    <Link 
                      to="/auth?tab=login" 
                      className="mobile-auth-btn login-btn focus-outline"
                      onClick={handleQuickLinkClick}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth?tab=register" 
                      className="mobile-auth-btn register-btn focus-outline"
                      onClick={handleQuickLinkClick}
                    >
                      Join Us
                    </Link>
                  </div>
                )}

                {/* Wishlist */}
                <Link 
                  to="/wishlist" 
                  className="mobile-action-large focus-outline"
                  onClick={handleQuickLinkClick}
                >
                  <FaHeart />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="mobile-action-badge">{wishlistCount}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header Spacer */}
      <div className="header-spacer"></div>
    </>
  );
}

export default HomeHeader;