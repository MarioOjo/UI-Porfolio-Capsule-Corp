import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

/**
 * Enhanced ThemeProvider with system preference detection, 
 * persistence, and advanced theme management
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference first
    try {
      const saved = localStorage.getItem('capsule-theme');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
    }
    
    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light mode
    return false;
  });

  const [isSystemPreferred, setIsSystemPreferred] = useState(() => {
    // Check if current theme matches system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches === isDarkMode;
    }
    return false;
  });

  // Apply theme to document and persist changes
  useEffect(() => {
    // Save to localStorage
    try {
      localStorage.setItem('capsule-theme', JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
    
    // Apply classes and attributes to document
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
    
    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(isDarkMode);
    
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      setIsSystemPreferred(e.matches === isDarkMode);
      
      // Optional: Auto-switch to system theme when it changes
      // if (isSystemPreferred) {
      //   setIsDarkMode(e.matches);
      // }
    };
    
    // Set initial value
    setIsSystemPreferred(mediaQuery.matches === isDarkMode);
    
    // Add event listener
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isDarkMode]);

  // Update mobile browser theme color
  const updateMetaThemeColor = useCallback((dark) => {
    const themeColor = dark ? '#0f172a' : '#3b4cca'; // slate-900 vs capsule blue
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = themeColor;
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
    setIsSystemPreferred(false); // User manually changed, no longer following system
  }, []);

  const setDarkMode = useCallback((dark) => {
    setIsDarkMode(dark);
    setIsSystemPreferred(false); // User manually changed, no longer following system
  }, []);

  const enableDarkMode = useCallback(() => {
    setDarkMode(true);
  }, [setDarkMode]);

  const enableLightMode = useCallback(() => {
    setDarkMode(false);
  }, [setDarkMode]);

  const followSystemPreference = useCallback(() => {
    if (window.matchMedia) {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemIsDark);
      setIsSystemPreferred(true);
    }
  }, []);

  // Get theme information for components
  const getThemeInfo = useCallback(() => {
    return {
      mode: isDarkMode ? 'dark' : 'light',
      icon: isDarkMode ? 'moon' : 'sun',
      label: isDarkMode ? 'Dark Mode' : 'Light Mode',
      oppositeLabel: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      systemPreferred: isSystemPreferred,
    };
  }, [isDarkMode, isSystemPreferred]);

  // Theme cycling function (light -> dark -> system -> light)
  const cycleTheme = useCallback(() => {
    if (isSystemPreferred) {
      // Currently following system, switch to light
      enableLightMode();
    } else if (isDarkMode) {
      // Currently dark, switch to system
      followSystemPreference();
    } else {
      // Currently light, switch to dark
      enableDarkMode();
    }
  }, [isDarkMode, isSystemPreferred, enableLightMode, enableDarkMode, followSystemPreference]);

  const contextValue = {
    // State
    isDarkMode,
    isSystemPreferred,
    
    // Core actions
    toggleDarkMode,
    setDarkMode,
    enableDarkMode,
    enableLightMode,
    followSystemPreference,
    cycleTheme,
    
    // Derived values
    theme: isDarkMode ? 'dark' : 'light',
    themeClass: isDarkMode ? 'dark' : 'light',
    themeInfo: getThemeInfo(),
    
    // Helpers for conditional styling
    isLight: !isDarkMode,
    isDark: isDarkMode,
    
    // For Tailwind CSS
    themeColor: isDarkMode ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use theme context
 * @returns {{
 *   isDarkMode: boolean,
 *   isSystemPreferred: boolean,
 *   toggleDarkMode: () => void,
 *   setDarkMode: (dark: boolean) => void,
 *   enableDarkMode: () => void,
 *   enableLightMode: () => void,
 *   followSystemPreference: () => void,
 *   cycleTheme: () => void,
 *   theme: 'dark' | 'light',
 *   themeClass: string,
 *   themeInfo: Object,
 *   isLight: boolean,
 *   isDark: boolean,
 *   themeColor: string
 * }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Higher Order Component for class components (if needed)
 */
export function withTheme(Component) {
  return function WrappedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
}

/**
 * Hook for conditional styling based on theme
 * @param {string} lightValue - Value for light theme
 * @param {string} darkValue - Value for dark theme
 * @returns {string} The appropriate value based on current theme
 */
export function useThemeValue(lightValue, darkValue) {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkValue : lightValue;
}

/**
 * Hook for conditional CSS classes based on theme
 * @param {string} lightClass - CSS class for light theme
 * @param {string} darkClass - CSS class for dark theme
 * @returns {string} The appropriate CSS class based on current theme
 */
export function useThemeClass(lightClass, darkClass) {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkClass : lightClass;
}

export default ThemeContext;