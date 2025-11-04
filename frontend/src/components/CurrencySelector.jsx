import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

/**
 * CurrencySelector
 * Props:
 * - size: 'small' | 'normal' (controls text sizing)
 * - showLabel: boolean (whether to show a visual label)
 */
const CurrencySelector = ({ size = 'normal', showLabel = true }) => {
  const { currency, changeCurrency, getAvailableCurrencies } = useCurrency();

  const available = getAvailableCurrencies();

  return (
    <div className={`flex items-center gap-2 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
      {showLabel && (
        <label className="sr-only md:not-sr-only">Currency</label>
      )}

      <select
        aria-label="Select currency"
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
        className={`rounded-md border px-2 py-1 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
      >
        {available.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code} — {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
