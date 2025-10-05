import { useState } from 'react';
import { FaGlobe, FaCheck } from 'react-icons/fa';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector = ({ showLabel = true, size = 'medium' }) => {
  const { currency, currencyInfo, changeCurrency, getAvailableCurrencies, getAllCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [showRestricted, setShowRestricted] = useState(false);

  const availableCurrencies = getAvailableCurrencies();
  const allCurrencies = getAllCurrencies();
  const restrictedCurrencies = allCurrencies.filter(c => !c.available);

  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-5 py-3'
  };

  const handleCurrencyChange = (currencyCode) => {
    const selectedCurrency = allCurrencies.find(c => c.code === currencyCode);
    if (selectedCurrency?.available) {
      changeCurrency(currencyCode);
      setIsOpen(false);
    } else {
      setShowRestricted(true);
    }
  };

  return (
    <div className="relative">
      {/* Currency Button - simplified to flag-only in the navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-lg transition-all duration-150 flex items-center justify-center text-lg leading-none p-2 bg-white border-2 border-gray-200 shadow-sm`}
        aria-label={`Currency: ${currencyInfo.code}`}
        title={`${currencyInfo.code} - ${currencyInfo.name}`}
      >
        <span className="text-2xl">{currencyInfo.flag}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="popover-panel popover-no-clip absolute right-0 mt-2 w-80 max-w-[95%] bg-white rounded-lg shadow-2xl border-2 border-gray-200 z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaGlobe />
                Select Your Currency & Region
              </h3>
              <p className="text-xs opacity-90 mt-1">Prices will be converted automatically</p>
            </div>

            {/* Available Currencies */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Available Regions
              </p>
              {availableCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors ${
                    currency === curr.code ? 'bg-orange-100 border-2 border-orange-500' : 'border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-none">
                      <span className="text-3xl">{curr.flag}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800">{curr.symbol} {curr.code}</p>
                      <p className="text-xs text-gray-500">{curr.country}</p>
                    </div>
                    {currency === curr.code && (
                      <FaCheck className="text-orange-500 text-lg" />
                    )}
                  </div>
                </button>
              ))}
            

              {/* Restricted Currencies */}
              {restrictedCurrencies.length > 0 && (
                <div className="border-t-2 border-gray-200 mt-2 pt-2 bg-gray-50 -mx-2 px-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    ⚠️ Temporarily Unavailable
                  </p>
                  {restrictedCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setShowRestricted(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-none">
                          <span className="text-3xl grayscale">{curr.flag}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-600">{curr.symbol} {curr.code}</p>
                          <p className="text-xs text-red-500">Coming Soon!</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-3 border-t-2 border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                💡 Exchange rates updated daily
              </p>
            </div>
          </div>
        </>
      )}

      {/* Restricted Region Modal */}
      {showRestricted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
              <div className="text-6xl mb-3">⚠️</div>
              <h2 className="text-2xl font-bold">Region Temporarily Unavailable!</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="font-bold text-yellow-800 mb-2">🐉 Dragon Ball Alert!</p>
                <p className="text-sm text-yellow-700">
                  {restrictedCurrencies[0]?.restriction || 'This region is currently experiencing intense battles. Instant Transmission unavailable!'}
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Why can't I shop from this region?</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Goku's Instant Transmission has a cooldown period</li>
                  <li>The Hyperbolic Time Chamber is under maintenance</li>
                  <li>We're upgrading our Dragon Radar network</li>
                  <li>Payment processing requires Senzu Bean verification</li>
                </ul>
                <p className="mt-4 font-semibold text-orange-600">
                  ✨ Good news: We're working on expanding to your region soon!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-4 flex gap-3">
              <button
                onClick={() => setShowRestricted(false)}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Got It!
              </button>
              <button
                onClick={() => {
                  setShowRestricted(false);
                  setIsOpen(true);
                }}
                className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors font-semibold"
              >
                Choose Available Region
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
