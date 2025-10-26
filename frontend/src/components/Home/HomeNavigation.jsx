import React from 'react';
import { NavLink } from "react-router-dom";
import { FaHome, FaBoxOpen, FaShieldAlt, FaCapsules, FaDumbbell, FaTruck, FaEnvelope, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";

const navLinks = [
  { name: "Home", to: "/", icon: <FaHome /> },
  { name: "Products", to: "/products", icon: <FaBoxOpen /> },
  { name: "Battle Gear", to: "/battle-gear", icon: <FaShieldAlt /> },
  { name: "Capsules", to: "/capsules", icon: <FaCapsules /> },
  { name: "Training", to: "/training", icon: <FaDumbbell /> },
  { name: "Track Order", to: "/track-order", icon: <FaTruck /> },
  { name: "Contact", to: "/contact", icon: <FaEnvelope /> },
  { name: "Cart", to: "/cart", icon: <FaShoppingCart /> },
];

function HomeNavigation() {
  const [open, setOpen] = useState(false);

  const handleToggleMenu = () => {
    console.log('🍔 Mobile menu toggled:', !open);
    setOpen(!open);
  };

  const handleLinkClick = (linkName) => {
    console.log('🔗 Navigation link clicked:', linkName);
    setOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#3B4CCA]/20 shadow-sm w-full relative z-40">
      {/* Hamburger toggle for mobile */}
      <div className="xs:hidden flex items-center justify-between px-4 py-2">
        <button 
          className="p-2 text-[#3B4CCA] cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Toggle navigation" 
          onClick={handleToggleMenu}
        >
          <span className="sr-only">Menu</span>
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Collapsible menu for mobile */}
      {open && (
        <div className="xs:hidden flex flex-col gap-2 px-4 py-2 bg-white border-t border-[#3B4CCA]/10 shadow-lg animate-slide-down absolute top-full left-0 right-0 z-50">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors hover:bg-blue-50 text-[#3B4CCA] text-base cursor-pointer ${
                  isActive ? "bg-blue-100 font-bold" : ""
                }`
              }
              onClick={() => handleLinkClick(link.name)}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden xs:flex items-center space-x-4 sm:space-x-8 py-4 px-4 justify-center">
        {navLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 font-medium transition-colors border-b-2 border-transparent hover:text-[#3B4CCA] hover:border-[#3B4CCA] cursor-pointer whitespace-nowrap shrink-0 text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-blue-50 ${
                isActive ? "text-[#3B4CCA] border-[#3B4CCA] font-bold bg-blue-50" : "text-gray-700"
              }`
            }
            onClick={() => console.log('💻 Desktop nav clicked:', link.name)}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default HomeNavigation;