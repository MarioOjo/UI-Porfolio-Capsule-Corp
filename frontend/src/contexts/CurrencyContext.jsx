import { createContext, useContext, useState, useEffect } from 'react';

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
    const saved = localStorage.getItem('capsule_currency');
    return saved || 'USD';
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
    const saved = localStorage.getItem('capsule_location');
    return saved ? JSON.parse(saved) : {
      country: 'United States',
      countryCode: 'US',
      region: 'North America'
    };
  });

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem('capsule_currency', currency);
  }, [currency]);

  // Save location preference to localStorage
  useEffect(() => {
    localStorage.setItem('capsule_location', JSON.stringify(location));
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
  const getCurrencyForCountry = (countryCode) => {
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
      'IE': 'EUR', 'FI': 'EUR', 'GR': 'EUR'
    };
    return currencyMap[countryCode] || 'USD';
  };

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD) => {
    const rate = exchangeRates[currency] || 1;
    return priceInUSD * rate;
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD, options = {}) => {
    const convertedPrice = convertPrice(priceInUSD);
    const currencyInfo = CURRENCIES[currency];
    
    const formatted = new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: options.decimals ?? 2,
      maximumFractionDigits: options.decimals ?? 2,
      ...options
    }).format(convertedPrice);

    return formatted;
  };

  // Change currency
  const changeCurrency = (newCurrency) => {
    if (CURRENCIES[newCurrency]) {
      setCurrency(newCurrency);
      
      // Update location info
      const currencyInfo = CURRENCIES[newCurrency];
      setLocation({
        country: currencyInfo.country,
        countryCode: newCurrency === 'EUR' ? 'EU' : currencyInfo.country.substring(0, 2).toUpperCase(),
        region: currencyInfo.region
      });
    }
  };

  // Expose a tiny dev helper so you can call window.__capsule.changeCurrency('ZAR') in the browser console
  // and inspect current currency from the console: window.__capsule.currency
  // This is a development aid and harmless in production.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__capsule = window.__capsule || {};
      window.__capsule.changeCurrency = changeCurrency;
      window.__capsule.currency = currency;
      window.__capsule.currencyInfo = CURRENCIES[currency];
    }
    return () => {
      // keep it available across navigation in dev; don't remove
    };
  }, [currency, changeCurrency]);

  // Get available currencies (only the ones available)
  const getAvailableCurrencies = () => {
    return Object.values(CURRENCIES).filter(c => c.available);
  };

  // Get all currencies (including restricted ones)
  const getAllCurrencies = () => {
    return Object.values(CURRENCIES);
  };

  // Update exchange rates (could be called from API)
  const updateExchangeRates = (newRates) => {
    setExchangeRates(prev => ({ ...prev, ...newRates }));
  };

  const value = {
    currency,
    currencyInfo: CURRENCIES[currency],
    location,
    exchangeRates,
    convertPrice,
    formatPrice,
    changeCurrency,
    setLocation,
    getAvailableCurrencies,
    getAllCurrencies,
    updateExchangeRates,
    CURRENCIES
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

export default CurrencyContext;
