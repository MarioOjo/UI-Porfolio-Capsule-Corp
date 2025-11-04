import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ReviewProvider } from './contexts/ReviewContext'
import { CurrencyProvider } from './contexts/CurrencyContext'

// Ensure runtime config is fetched before hydrating the app. This lets the
// same build be deployed to multiple environments and pick up the backend
// URL at runtime without rebuilding.
async function bootstrap() {
  try {
    if (typeof window !== 'undefined') {
      // Default runtime config placeholder
      window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};
      try {
        const resp = await fetch('/env.json', { cache: 'no-cache' });
        if (resp.ok) {
          const json = await resp.json().catch(() => null);
          if (json && typeof json === 'object') {
            window.__RUNTIME_CONFIG__ = Object.assign({}, window.__RUNTIME_CONFIG__, json);
          }
        }
      } catch (e) {
        // ignore - runtime config is optional
      }
    }

    // Ensure proper DOM setup before rendering
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    // Apply critical CSS fixes before React hydration
    const applyCriticalFixes = () => {
      // Prevent double scrollbars
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      
      // Ensure proper height for mobile
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      
      // Add base classes for CSS to work with
      document.documentElement.classList.add('light'); // Default theme
    };

    applyCriticalFixes();

    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <NotificationProvider>
                <CurrencyProvider>
                  <AuthProvider>
                    <ReviewProvider>
                      <CartProvider>
                        <WishlistProvider>
                          <App />
                        </WishlistProvider>
                      </CartProvider>
                    </ReviewProvider>
                  </AuthProvider>
                </CurrencyProvider>
              </NotificationProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    );
  } catch (e) {
    // Fallback: try to render anyway so devs can see console errors
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      );
    }
  }
}

bootstrap();