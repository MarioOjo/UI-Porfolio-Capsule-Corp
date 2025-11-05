import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext();

// Supported currencies with metadata
export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    region: 'North America',
    available: true
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    country: 'South Africa',
    flag: '🇿🇦',
    locale: 'en-ZA',
    region: 'Africa',
    available: true
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    flag: '🇪🇺',
    locale: 'de-DE',
    region: 'Europe',
    available: true
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    flag: '🇬🇧',
    locale: 'en-GB',
    region: 'Europe',
    available: true
  },
  // Future currencies (DBZ-themed restricted)
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    country: 'Japan',
    flag: '🇯🇵',
    locale: 'ja-JP',
    region: 'Asia',
    available: false,
    restriction: 'Majin Buu turned everyone into chocolate! Instant Transmission unavailable.'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    flag: '🇦🇺',
    locale: 'en-AU',
    region: 'Oceania',
    available: false,
    restriction: 'Frieza is currently destroying this sector. Check back after Goku arrives!'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    country: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    region: 'North America',
    available: false,
    restriction: 'The Hyperbolic Time Chamber is under maintenance. Delivery time unknown!'
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Try to get from localStorage, default to USD
    try {
      const saved = localStorage.getItem('capsule_currency');
      return saved && CURRENCIES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    ZAR: 18.50,    // 1 USD = 18.50 ZAR (approximate)
    EUR: 0.92,     // 1 USD = 0.92 EUR (approximate)
    GBP: 0.79,     // 1 USD = 0.79 GBP (approximate)
    JPY: 149.50,   // Future
    AUD: 1.52,     // Future
    CAD: 1.36      // Future
  });

  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('capsule_location');
      return saved ? JSON.parse(saved) : {
        country: 'United States',
        countryCode: 'US',
        region: 'North America'
      };
    } catch {
      return {
        country: 'United States',
        countryCode: 'US',
        region: 'North America'
      };
    }
  });

  const [ratesLoading, setRatesLoading] = useState(false);
  const [lastRatesUpdate, setLastRatesUpdate] = useState(null);

  // Save currency preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('capsule_currency', currency);
    } catch (error) {
      console.warn('Failed to save currency preference:', error);
    }
  }, [currency]);

  // Save location preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('capsule_location', JSON.stringify(location));
    } catch (error) {
      console.warn('Failed to save location preference:', error);
    }
  }, [location]);

  // Detect user location on first load (optional)
  useEffect(() => {
    const detectLocation = async () => {
      const saved = localStorage.getItem('capsule_location_detected');
      if (saved) return; // Already detected

      try {
        // Use IP geolocation API (free tier)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          const detectedCurrency = getCurrencyForCountry(data.country_code);
          if (CURRENCIES[detectedCurrency]?.available) {
            setCurrency(detectedCurrency);
            setLocation({
              country: data.country_name,
              countryCode: data.country_code,
              region: data.continent_code
            });
            localStorage.setItem('capsule_location_detected', 'true');
          }
        }
      } catch (error) {
        // Silent fail - default USD is already set
      }
    };

    detectLocation();
  }, []);

  // Helper to get currency code for country
  const getCurrencyForCountry = useCallback((countryCode) => {
    const currencyMap = {
      'US': 'USD',
      'ZA': 'ZAR',
      'GB': 'GBP',
      'JP': 'JPY',
      'AU': 'AUD',
      'CA': 'CAD',
      // EU countries
      'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
      'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR',
      'IE': 'EUR', 'FI': 'EUR', 'GR': 'EUR', 'SE': 'EUR',
      'DK': 'EUR', 'NO': 'EUR'
    };
    return currencyMap[countryCode] || 'USD';
  }, []);

  // Convert price from USD to selected currency
  const convertPrice = useCallback((priceInUSD) => {
    if (typeof priceInUSD !== 'number' || isNaN(priceInUSD)) {
      console.warn('Invalid price provided to convertPrice:', priceInUSD);
      return 0;
    }
    
    const rate = exchangeRates[currency] || 1;
    return priceInUSD * rate;
  }, [currency, exchangeRates]);

  // Format price with currency symbol
  const formatPrice = useCallback((priceInUSD, options = {}) => {
    const convertedPrice = convertPrice(priceInUSD);
    const currencyInfo = CURRENCIES[currency];
    
    if (!currencyInfo) {
      return `$${convertedPrice.toFixed(2)}`;
    }

    try {
      const formatted = new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: options.decimals ?? 2,
        maximumFractionDigits: options.decimals ?? 2,
        ...options
      }).format(convertedPrice);

      return formatted;
    } catch (error) {
      // Fallback formatting
      return `${currencyInfo.symbol}${convertedPrice.toFixed(options.decimals ?? 2)}`;
    }
  }, [currency, convertPrice]);

  // Format price without currency symbol (just number)
  const formatPriceNumber = useCallback((priceInUSD, decimals = 2) => {
    const convertedPrice = convertPrice(priceInUSD);
    const currencyInfo = CURRENCIES[currency];
    
    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(convertedPrice);
    } catch (error) {
      return convertedPrice.toFixed(decimals);
    }
  }, [currency, convertPrice]);

  // Change currency
  const changeCurrency = useCallback((newCurrency) => {
    if (CURRENCIES[newCurrency] && CURRENCIES[newCurrency].available) {
      setCurrency(newCurrency);
      
      // Update location info
      const currencyInfo = CURRENCIES[newCurrency];
      setLocation({
        country: currencyInfo.country,
        countryCode: newCurrency === 'EUR' ? 'EU' : getCurrencyForCountry(currencyInfo.country),
        region: currencyInfo.region
      });
      
      return true;
    }
    return false;
  }, [getCurrencyForCountry]);

  // Fetch live exchange rates (optional enhancement)
  const fetchLiveRates = useCallback(async () => {
    if (ratesLoading) return;
    
    setRatesLoading(true);
    try {
      // Using a free exchange rate API (you might need to sign up for an API key)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates) {
        const newRates = {};
        Object.keys(CURRENCIES).forEach(currencyCode => {
          if (data.rates[currencyCode]) {
            newRates[currencyCode] = data.rates[currencyCode];
          }
        });
        
        setExchangeRates(prev => ({ ...prev, ...newRates }));
        setLastRatesUpdate(new Date().toISOString());
        
        // Save to localStorage
        try {
          localStorage.setItem('capsule_exchange_rates', JSON.stringify({
            rates: { ...exchangeRates, ...newRates },
            lastUpdated: new Date().toISOString()
          }));
        } catch (error) {
          console.warn('Failed to save exchange rates:', error);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using cached rates:', error);
    } finally {
      setRatesLoading(false);
    }
  }, [ratesLoading, exchangeRates]);

  // Load cached exchange rates on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('capsule_exchange_rates');
      if (cached) {
        const { rates, lastUpdated } = JSON.parse(cached);
        if (rates) {
          setExchangeRates(prev => ({ ...prev, ...rates }));
          setLastRatesUpdate(lastUpdated);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached exchange rates:', error);
    }
  }, []);

  // Expose a tiny dev helper so you can call window.__capsule.changeCurrency('ZAR') in the browser console
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.MODE === 'development') {
      window.__capsule = window.__capsule || {};
      window.__capsule.changeCurrency = changeCurrency;
      window.__capsule.currency = currency;
      window.__capsule.currencyInfo = CURRENCIES[currency];
      window.__capsule.exchangeRates = exchangeRates;
      window.__capsule.formatPrice = formatPrice;
    }
  }, [currency, changeCurrency, exchangeRates, formatPrice]);

  // Get available currencies (only the ones available)
  const getAvailableCurrencies = useCallback(() => {
    return Object.values(CURRENCIES).filter(c => c.available);
  }, []);

  // Get all currencies (including restricted ones)
  const getAllCurrencies = useCallback(() => {
    return Object.values(CURRENCIES);
  }, []);

  // Update exchange rates (could be called from API)
  const updateExchangeRates = useCallback((newRates) => {
    setExchangeRates(prev => ({ ...prev, ...newRates }));
  }, []);

  // Check if currency is available
  const isCurrencyAvailable = useCallback((currencyCode) => {
    return CURRENCIES[currencyCode]?.available || false;
  }, []);

  // Get currency by code
  const getCurrencyInfo = useCallback((currencyCode) => {
    return CURRENCIES[currencyCode] || null;
  }, []);

  const value = {
    // State
    currency,
    currencyInfo: CURRENCIES[currency],
    location,
    exchangeRates,
    ratesLoading,
    lastRatesUpdate,
    
    // Conversion & Formatting
    convertPrice,
    formatPrice,
    formatPriceNumber,
    
    // Currency Management
    changeCurrency,
    setLocation,
    getAvailableCurrencies,
    getAllCurrencies,
    updateExchangeRates,
    fetchLiveRates,
    isCurrencyAvailable,
    getCurrencyInfo,
    
    // Constants
    CURRENCIES,
    
    // Helper functions
    getCurrencyForCountry
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

// Hook for conditional currency formatting in components
export const useCurrencyFormat = () => {
  const { formatPrice, formatPriceNumber, convertPrice } = useCurrency();
  
  return {
    formatPrice,
    formatPriceNumber,
    convertPrice,
    // Short aliases for common use
    fp: formatPrice,
    fpn: formatPriceNumber,
    cp: convertPrice
  };
};

export default CurrencyContext;