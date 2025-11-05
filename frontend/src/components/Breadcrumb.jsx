import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaBolt, FaHome, FaDragon } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import './Breadcrumb.css';

function Breadcrumb({ 
  separator = <FaChevronRight className="separator-icon" />, 
  rootLabel = "HOME BASE",
  showIcons = true 
}) {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { pathname } = location;
  const pathnames = pathname.split("/").filter(x => x);

  const themeClass = isDarkMode ? 'dark' : 'light';

  // Enhanced route name mapping with DBZ theme
  const getDisplayName = (name) => {
    const nameMap = {
      'products': 'LEGENDARY GEAR',
      'battle-gear': 'BATTLE EQUIPMENT',
      'capsules': 'CAPSULE TECHNOLOGY',
      'training': 'TRAINING GROUNDS',
      'cart': 'CAPSULE CART',
      'wishlist': 'WARRIOR WISHLIST',
      'checkout': 'MISSION CHECKOUT',
      'profile': 'WARRIOR PROFILE',
      'auth': 'AUTHENTICATION',
      'contact': 'CONTACT CORP',
      'about': 'ABOUT CAPSULE CORP',
      'order-tracking': 'SCOUTER TRACKING',
      'order-history': 'BATTLE RECORDS',
      'address-book': 'LOCATION DATA',
      'change-password': 'SECURITY UPDATE',
      'returns': 'MISSION RETURNS',
      'admin': 'CORPORATE CONTROL'
    };

    const decodedName = decodeURIComponent(name.replace(/-/g, ' '));
    return nameMap[decodedName] || decodedName.toUpperCase();
  };

  // Get icon for specific routes
  const getRouteIcon = (name) => {
    const iconMap = {
      '': <FaHome className="breadcrumb-icon" />,
      'products': <FaDragon className="breadcrumb-icon" />,
      'battle-gear': <FaBolt className="breadcrumb-icon" />,
      'capsules': <span className="breadcrumb-icon">💊</span>,
      'training': <span className="breadcrumb-icon">💪</span>,
      'cart': <span className="breadcrumb-icon">📦</span>,
      'wishlist': <span className="breadcrumb-icon">❤️</span>,
      'profile': <span className="breadcrumb-icon">👤</span>
    };
    return iconMap[name] || <FaBolt className="breadcrumb-icon" />;
  };

  return (
    <nav className={`breadcrumb-nav ${themeClass}`} aria-label="Breadcrumb">
      <div className="breadcrumb-container">
        {/* Energy Trail Effect */}
        <div className="breadcrumb-energy-trail"></div>
        
        <ol className="breadcrumb-list">
          {/* Root/Home Item */}
          <li className="breadcrumb-item root-item">
            <Link to="/" className="breadcrumb-link root-link">
              {showIcons && <FaHome className="breadcrumb-icon home-icon" />}
              <span className="breadcrumb-text saiyan-body-sm">{rootLabel}</span>
              <div className="link-glow"></div>
            </Link>
          </li>

          {/* Dynamic Path Items */}
          {pathnames.map((name, idx) => {
            const routeTo = `/${pathnames.slice(0, idx + 1).join("/")}`;
            const isLast = idx === pathnames.length - 1;
            const displayName = getDisplayName(name);

            return (
              <li 
                key={routeTo} 
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
                data-index={idx}
              >
                {/* Separator with Animation */}
                <span className="breadcrumb-separator">
                  {separator}
                  <div className="separator-glow"></div>
                </span>

                {/* Breadcrumb Link/Text */}
                {isLast ? (
                  <span className="breadcrumb-current">
                    {showIcons && getRouteIcon(name)}
                    <span className="breadcrumb-text saiyan-body-sm current-text">
                      {displayName}
                    </span>
                    {/* Active Indicator */}
                    <div className="active-indicator"></div>
                  </span>
                ) : (
                  <Link to={routeTo} className="breadcrumb-link">
                    {showIcons && getRouteIcon(name)}
                    <span className="breadcrumb-text saiyan-body-sm">
                      {displayName}
                    </span>
                    <div className="link-glow"></div>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>

        {/* Progress Indicator */}
        <div className="breadcrumb-progress">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(pathnames.length / (pathnames.length + 1)) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </nav>
  );
}

export default Breadcrumb;