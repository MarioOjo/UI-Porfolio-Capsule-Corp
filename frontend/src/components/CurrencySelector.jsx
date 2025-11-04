import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import './CurrencySelector.css';

const CurrencySelector = ({ 
  size = 'normal', 
  showLabel = true,
  variant = 'default' 
}) => {
  const { currency, changeCurrency, getAvailableCurrencies } = useCurrency();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const available = getAvailableCurrencies();
  const themeClass = isDarkMode ? 'dark' : 'light';
  const currentCurrency = available.find(c => c.code === currency);

  // Flag images mapping
  const flagImages = {
    USD: 'https://flagcdn.com/us.svg',
    EUR: 'https://flagcdn.com/eu.svg',
    GBP: 'https://flagcdn.com/gb.svg',
    JPY: 'https://flagcdn.com/jp.svg',
    CAD: 'https://flagcdn.com/ca.svg',
    AUD: 'https://flagcdn.com/au.svg',
    CHF: 'https://flagcdn.com/ch.svg',
    CNY: 'https://flagcdn.com/cn.svg',
    INR: 'https://flagcdn.com/in.svg',
    BRL: 'https://flagcdn.com/br.svg',
    MXN: 'https://flagcdn.com/mx.svg',
    KRW: 'https://flagcdn.com/kr.svg',
    SGD: 'https://flagcdn.com/sg.svg',
    NZD: 'https://flagcdn.com/nz.svg',
    ZAR: 'https://flagcdn.com/za.svg',
    RUB: 'https://flagcdn.com/ru.svg',
    TRY: 'https://flagcdn.com/tr.svg',
    SEK: 'https://flagcdn.com/se.svg',
    NOK: 'https://flagcdn.com/no.svg',
    DKK: 'https://flagcdn.com/dk.svg',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (currencyCode) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'currency-selector-small';
      case 'large': return 'currency-selector-large';
      default: return 'currency-selector-normal';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'minimal': return 'currency-selector-minimal';
      case 'flags-only': return 'currency-selector-flags-only';
      default: return 'currency-selector-default';
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`currency-selector ${themeClass} ${getSizeClass()} ${getVariantClass()} ${isOpen ? 'open' : ''}`}
    >
      <button
        className="currency-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Change currency. Current: ${currentCurrency?.name}`}
      >
        <div className="currency-flag-container">
          <img 
            src={flagImages[currency] || 'https://flagcdn.com/un.svg'} 
            alt={`${currency} flag`}
            className="currency-flag"
            loading="lazy"
          />
        </div>

        <div className="currency-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path 
              d="M3 4.5L6 7.5L9 4.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="currency-dropdown">
          <div className="dropdown-backdrop"></div>
          <div className="dropdown-content">
            {available.map((currencyOption) => (
              <button
                key={currencyOption.code}
                className={`currency-option ${currency === currencyOption.code ? 'selected' : ''}`}
                onClick={() => handleCurrencySelect(currencyOption.code)}
              >
                <div className="option-flag-container">
                  <img 
                    src={flagImages[currencyOption.code] || 'https://flagcdn.com/un.svg'} 
                    alt={`${currencyOption.code} flag`}
                    className="option-flag"
                    loading="lazy"
                  />
                </div>

                {currency === currencyOption.code && (
                  <div className="option-check">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path 
                        d="M13.3334 4L6.00008 11.3333L2.66675 8" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;