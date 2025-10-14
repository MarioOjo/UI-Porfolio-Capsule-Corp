import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const Price = ({ value = 0, decimals, className = '' }) => {
  const { formatPrice } = useCurrency();

  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;

  return (
    <span className={className}>
      {formatPrice(Number(value), { decimals })}
    </span>
  );
};

export default Price;
