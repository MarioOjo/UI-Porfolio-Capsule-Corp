import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HomeHeader from '../HomeHeader';
import { BrowserRouter } from 'react-router-dom';

// Minimal context providers mocks
const Providers = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

// Mock app hooks that would otherwise try to use Firebase or network
vi.mock('../../../AuthContext', () => ({
  useAuth: () => ({ user: null, logout: () => {} }),
}));
vi.mock('../../../contexts/NotificationContext', () => ({
  useNotifications: () => ({ showSuccess: () => {}, showError: () => {} }),
}));
vi.mock('../../../contexts/CartContext', () => ({
  useCart: () => ({ cartItems: [], getCartCount: () => 0, getCartTotal: () => 0 }),
}));
vi.mock('../../../contexts/WishlistContext', () => ({
  useWishlist: () => ({ wishlistItems: [], getWishlistCount: () => 0 }),
}));
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleDarkMode: () => {} }),
}));
vi.mock('../../../contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    currency: 'USD',
    currencyInfo: { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    changeCurrency: () => {},
    getAvailableCurrencies: () => ([{ code: 'USD', available: true, flag: '🇺🇸', symbol: '$', country: 'United States' }]),
    getAllCurrencies: () => ([{ code: 'USD', available: true, flag: '🇺🇸', symbol: '$', country: 'United States' }]),
    formatPrice: (v) => `$${v}`
  }),
}));

describe('HomeHeader mobile menu', () => {
  beforeEach(() => {
    // ensure viewport size is mobile
    global.innerWidth = 375;
  });

  it('toggles menu and updates aria-live', async () => {
    render(<HomeHeader />, { wrapper: Providers });
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toBeInTheDocument();

  // open menu
  await userEvent.click(toggle);
  // The toggle reference points to the button that was clicked. Assert its expanded state
  expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // aria-live region should indicate opened
    const live = await screen.findByText(/menu opened/i);
    expect(live).toBeInTheDocument();

    // press Escape to close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
  // Assert the original toggle is now collapsed
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const closedLive = await screen.findByText(/menu closed/i);
    expect(closedLive).toBeInTheDocument();
  });
});
