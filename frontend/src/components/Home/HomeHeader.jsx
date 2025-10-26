// HomeHeader.js (updated with CSS classes)
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaHeart, FaMoon, FaSun } from "react-icons/fa";
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
  // ... (all your existing state and logic remains the same)

  return (
    <>
      {/* Screen-reader live region for menu open/close announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="menu-live">{liveMessage}</div>
      
      {/* ---------- Desktop Header ---------- */}
      <header className="hidden md:block bg-white shadow-sm relative z-50 theme-transition">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer focus-outline"
            onClick={() => console.log('Logo clicked')}
          >
            <img src="/images/CAPSULE CORP IMG.svg" alt="Capsule Corp" className="w-12 h-12 object-contain" />
          </Link>

          {/* Center: desktop navigation */}
          <div className="flex-1 mx-6">
            <HomeNavigation />
          </div>

          {/* Right: desktop actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleDarkMode} 
              aria-label="Toggle theme" 
              className="p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <Link 
                to="/profile" 
                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
                onClick={() => console.log('Profile clicked')}
              >
                <FaUser /> <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
                onClick={() => console.log('Login clicked')}
              >
                <FaUser /> <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            <Link 
              to="/wishlist" 
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
              onClick={() => console.log('Wishlist clicked')}
            >
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="notification-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
              onClick={() => console.log('Cart clicked')}
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="notification-badge bg-[#FF9E00]">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Mobile Header ---------- */}
      <header className="block md:hidden bg-white shadow-md relative z-50 theme-transition">
        <div className="px-3 py-2 flex items-center justify-between">
          {/* Logo (left) */}
          <Link 
            to="/" 
            className="flex items-center cursor-pointer focus-outline"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none cursor-text focus-outline theme-transition"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer p-1 focus-outline"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Hamburger menu */}
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={handleMobileMenuToggle}
            className="p-2 relative w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect className={`hamburger-line top ${mobileMenuOpen ? 'open' : ''}`} x="3" y="5" width="18" height="2.2" rx="1" fill="currentColor" />
              <rect className={`hamburger-line middle ${mobileMenuOpen ? 'open' : ''}`} x="3" y="11" width="18" height="2.2" rx="1" fill="currentColor" />
              <rect className={`hamburger-line bottom ${mobileMenuOpen ? 'open' : ''}`} x="3" y="17" width="18" height="2.2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay fixed inset-0 z-50 bg-white overflow-auto" aria-modal="true" role="dialog">
            <div className="px-4 pt-6 pb-36" ref={menuRef}>
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  onClick={() => {
                    console.log('Mobile menu logo clicked');
                    setMobileMenuOpen(false);
                  }}
                  className="cursor-pointer focus-outline"
                >
                  <img src="/images/CAPSULE CORP IMG.svg" alt="Capsule Corp" className="w-12 h-12 object-contain" />
                </Link>
                <button 
                  onClick={() => {
                    console.log('Close mobile menu clicked');
                    setMobileMenuOpen(false);
                  }} 
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors focus-outline theme-transition" 
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-capsule-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M20 4L4 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <ul className="flex flex-col gap-3">
                  {navLinks.map(link => (
                    <li key={link.to} className="relative overflow-hidden mobile-menu-link">
                      <div className="hover-translate">
                        <Link
                          to={link.to}
                          onClick={() => {
                            console.log('Mobile menu link clicked:', link.name);
                            setMobileMenuOpen(false);
                          }}
                          className="block px-4 py-5 text-lg text-[#111827] font-semibold bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm border-l-4 border-transparent hover:border-l-4 hover:border-[#3B4CCA] transition-all cursor-pointer focus-outline theme-transition"
                        >
                          <span className="uppercase text-sm text-gray-500 block mb-1">Category</span>
                          <span className="text-xl">{link.name}</span>
                        </Link>
                      </div>
                      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#3B4CCA] to-transparent opacity-30" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky bottom action bar */}
            <div className="mobile-bottom-bar fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-2 z-50 theme-transition">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                {/* Left group: profile and auth links */}
                <div className="flex items-center gap-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors focus-outline theme-transition"
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
                        className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors focus-outline theme-transition"
                        onClick={() => {
                          console.log('Mobile bottom login clicked');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors focus-outline theme-transition"
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

                {/* Center group: theme + currency */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1 theme-transition">
                  <button 
                    onClick={handleToggleDarkMode} 
                    className="p-1 text-sm cursor-pointer hover:bg-gray-200 rounded transition-colors focus-outline theme-transition"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
                  </button>
                  <div className="w-28">
                    <CurrencySelector size="small" showLabel={false} />
                  </div>
                </div>

                {/* Right group: cart and wishlist */}
                <div className="flex items-center gap-4">
                  <Link 
                    to="/cart" 
                    className="relative p-1 cursor-pointer hover:text-blue-600 transition-colors focus-outline theme-transition"
                    onClick={() => {
                      console.log('Mobile bottom cart clicked');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaShoppingCart className="text-xl" />
                    {cartCount > 0 && (
                      <span className="notification-badge bg-[#FF9E00]">{cartCount}</span>
                    )}
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="p-1 cursor-pointer hover:text-blue-600 transition-colors focus-outline theme-transition"
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