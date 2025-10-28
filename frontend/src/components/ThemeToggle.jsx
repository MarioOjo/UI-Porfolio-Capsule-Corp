import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle({ className = '', label = false }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <button
      onClick={toggleDarkMode}
      className={`theme-toggle-btn ${className}`.trim()}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FaMoon /> : <FaSun />}
      {label && (
        <span className="theme-toggle-label">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
