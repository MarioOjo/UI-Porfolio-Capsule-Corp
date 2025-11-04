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
    setOpen(!open);
  };

  const handleLinkClick = (linkName) => {
    setOpen(false);
  };

  return (
    <nav className="home-navigation">
      {/* Hamburger toggle for mobile */}
      <div className="xs:hidden flex items-center justify-between px-4 py-2">
        <button 
          className="mobile-menu-button p-2 text-[#3B4CCA] cursor-pointer"
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
        <div className="mobile-menu-dropdown xs:hidden flex flex-col gap-2 px-4 py-2">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `nav-link-mobile ${isActive ? 'active' : ''}`
              }
              onClick={() => handleLinkClick(link.name)}
            >
              <span className="icon">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Desktop navigation */}
      <div className="desktop-nav-container">
        {navLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `nav-link-desktop ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default HomeNavigation;