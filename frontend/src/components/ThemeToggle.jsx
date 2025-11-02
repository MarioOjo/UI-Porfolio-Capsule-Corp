import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle({ className = '', label = false }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Optional: set CSS variables for toggle button
  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--toggle-bg', '#1F2937');
      root.style.setProperty('--toggle-color', '#F9FAFB');
    } else {
      root.style.setProperty('--toggle-bg', '#F3F4F6');
      root.style.setProperty('--toggle-color', '#111827');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className={`theme-toggle-btn ${className}`.trim()}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FaMoon /> : <FaSun />}
      {label && <span className="theme-toggle-label">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>}
    </button>
  );
}

export default ThemeToggle;
