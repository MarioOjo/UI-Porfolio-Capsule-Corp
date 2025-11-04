import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaBoxOpen, 
  FaShieldAlt, 
  FaCapsules, 
  FaDumbbell, 
  FaTruck, 
  FaEnvelope, 
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSearch,
  FaBolt,
  FaDragon
} from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import "./HomeNavigation.css";

const navLinks = [
  { 
    name: "Home", 
    to: "/", 
    icon: <FaHome />,
    description: "Capsule Corp Headquarters"
  },
  { 
    name: "Products", 
    to: "/products", 
    icon: <FaBoxOpen />,
    description: "Browse All Gear"
  },
  { 
    name: "Battle Gear", 
    to: "/battle-gear", 
    icon: <FaShieldAlt />,
    description: "Combat Equipment",
    badge: "HOT"
  },
  { 
    name: "Capsules", 
    to: "/capsules", 
    icon: <FaCapsules />,
    description: "Portable Storage"
  },
  { 
    name: "Training", 
    to: "/training", 
    icon: <FaDumbbell />,
    description: "Power Up"
  },
  { 
    name: "Track Order", 
    to: "/track-order", 
    icon: <FaTruck />,
    description: "Scouter Tracking"
  },
  { 
    name: "Contact", 
    to: "/contact", 
    icon: <FaEnvelope />,
    description: "Reach Capsule Corp"
  }
];

function HomeNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  const { getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const cartItemsCount = getCartCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchQuery === "") {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchRef.current?.querySelector('input')?.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Search for:', searchQuery);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleQuickAction = (action) => {
    // Handle quick actions like theme toggle
    if (action === 'theme') {
      toggleTheme();
    }
  };

  return (
    <>
      <nav 
        ref={menuRef}
        className={`home-navigation ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : 'light'}`}
      >
        {/* Top Bar */}
        <div className="nav-top-bar">
          <div className="nav-container">
            <span className="nav-promo-text">
              ⚡ FREE Energy Delivery on Orders Over 5000 Zeni!
            </span>
            <div className="nav-top-actions">
              <button 
                onClick={() => handleQuickAction('theme')}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              {isAuthenticated ? (
                <NavLink to="/profile" className="user-greeting">
                  <FaUser className="mr-1" />
                  Hi, {user?.name?.split(' ')[0] || 'Warrior'}!
                </NavLink>
              ) : (
                <div className="auth-links">
                  <NavLink to="/login" className="auth-link">Sign In</NavLink>
                  <span className="auth-separator">|</span>
                  <NavLink to="/register" className="auth-link">Register</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="nav-main">
          <div className="nav-container">
            {/* Logo */}
            <NavLink to="/" className="nav-logo">
              <FaDragon className="logo-icon" />
              <span className="logo-text">
                CAPSULE<span className="logo-accent">CORP</span>
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="desktop-nav-container">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link-desktop ${isActive ? 'active' : ''}`
                  }
                  title={link.description}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-text">{link.name}</span>
                  {link.badge && (
                    <span className="nav-badge">{link.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="nav-actions">
              {/* Search */}
              <div ref={searchRef} className={`search-container ${searchOpen ? 'open' : ''}`}>
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <input
                    type="text"
                    placeholder="Search for legendary gear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-submit">
                    <FaSearch />
                  </button>
                </form>
              </div>

              <button 
                onClick={handleSearchToggle}
                className="nav-action-btn search-toggle"
                aria-label="Search"
              >
                <FaSearch />
              </button>

              {/* Cart with badge */}
              <NavLink to="/cart" className="nav-action-btn cart-btn">
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </NavLink>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={handleToggleMenu}
                className="nav-action-btn mobile-menu-toggle"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {/* User Info */}
            <div className="mobile-user-info">
              {isAuthenticated ? (
                <>
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-details">
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

            {/* Mobile Navigation Links */}
            <div className="mobile-nav-links">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link-mobile ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  <div className="mobile-nav-content">
                    <span className="mobile-nav-text">{link.name}</span>
                    <span className="mobile-nav-desc">{link.description}</span>
                  </div>
                  {link.badge && (
                    <span className="mobile-nav-badge">{link.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="mobile-actions">
              {!isAuthenticated && (
                <div className="mobile-auth-buttons">
                  <NavLink 
                    to="/login" 
                    className="mobile-auth-btn login-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="mobile-auth-btn register-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Us
                  </NavLink>
                </div>
              )}
              <div className="mobile-theme-toggle">
                <button 
                  onClick={toggleTheme}
                  className="theme-toggle-mobile"
                >
                  {isDarkMode ? (
                    <>
                      <span>☀️</span> Light Mode
                    </>
                  ) : (
                    <>
                      <span>🌙</span> Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div 
            className="mobile-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="nav-spacer"></div>
    </>
  );
}

export default HomeNavigation;