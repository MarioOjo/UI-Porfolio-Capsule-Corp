// Comprehensive country list with shipping support
export const COUNTRIES = [
  // North America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America', currency: 'USD', shipping: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America', currency: 'CAD', shipping: true },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America', currency: 'MXN', shipping: true },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', currency: 'GBP', shipping: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', currency: 'CHF', shipping: true },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', currency: 'SEK', shipping: true },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe', currency: 'NOK', shipping: true },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe', currency: 'DKK', shipping: true },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', currency: 'EUR', shipping: true },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe', currency: 'PLN', shipping: true },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe', currency: 'EUR', shipping: true },
  
  // Asia
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', currency: 'JPY', shipping: true },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', currency: 'CNY', shipping: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', currency: 'KRW', shipping: true },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', currency: 'INR', shipping: true },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', currency: 'SGD', shipping: true },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia', currency: 'HKD', shipping: true },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'Asia', currency: 'TWD', shipping: true },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', currency: 'THB', shipping: true },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', currency: 'MYR', shipping: true },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', currency: 'IDR', shipping: true },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia', currency: 'PHP', shipping: true },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', currency: 'VND', shipping: true },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', currency: 'AED', shipping: true },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', currency: 'SAR', shipping: true },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East', currency: 'ILS', shipping: true },
  
  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', currency: 'AUD', shipping: true },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', currency: 'NZD', shipping: true },
  
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', currency: 'ZAR', shipping: true },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa', currency: 'EGP', shipping: true },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', currency: 'NGN', shipping: true },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa', currency: 'KES', shipping: true },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa', currency: 'GHS', shipping: true },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa', currency: 'MAD', shipping: true },
  
  // South America
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America', currency: 'BRL', shipping: true },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America', currency: 'ARS', shipping: true },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America', currency: 'CLP', shipping: true },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America', currency: 'COP', shipping: true },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'South America', currency: 'PEN', shipping: true },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'South America', currency: 'VES', shipping: true },
];

// Group countries by region for easier selection
export const COUNTRIES_BY_REGION = COUNTRIES.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {});

// Get countries that support a specific currency
export function getCountriesByCurrency(currencyCode) {
  return COUNTRIES.filter(c => c.currency === currencyCode);
}

// Get all unique regions
export const REGIONS = [...new Set(COUNTRIES.map(c => c.region))];

// Helper to find country by code
export function getCountryByCode(code) {
  return COUNTRIES.find(c => c.code === code);
}

// Helper to find country by name
export function getCountryByName(name) {
  return COUNTRIES.find(c => c.name === name);
}
