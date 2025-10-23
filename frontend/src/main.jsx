import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ReviewProvider } from './contexts/ReviewContext'
import { CurrencyProvider } from './contexts/CurrencyContext'

// Performance monitoring for development
if (process.env.NODE_ENV === 'development') {
  // Log render performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(`⚡ ${entry.name}: ${Math.round(entry.duration)}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ['measure'] });
}

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
        // eslint-disable-next-line no-console
        console.warn('Could not load /env.json runtime config', e);
      }
    }

    createRoot(document.getElementById('root')).render(
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
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StrictMode>
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap app', e);
    // Fallback: try to render anyway so devs can see console errors
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    );
  }
}

bootstrap();

// Development-only helpers
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Expose QueryClient for manual debugging (if queryClient exists)
  try {
    // eslint-disable-next-line no-undef
    if (typeof queryClient !== 'undefined') window.__QUERY_CLIENT = queryClient;
  } catch (e) {
    // ignore
  }

  // Programmatically invalidate + refetch featured products to populate cache on startup
  import('./hooks/useProducts').then(({ productKeys }) => {
    (async () => {
      try {
        const key = productKeys.list({ featured: true });
        // eslint-disable-next-line no-undef
        if (typeof queryClient !== 'undefined') {
          await queryClient.invalidateQueries({ queryKey: key });
          await queryClient.refetchQueries({ queryKey: key, active: true });
          // eslint-disable-next-line no-console
          console.log('[DEV] triggered featured products invalidate+refetch', key);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[DEV] featured refetch failed', err);
      }
    })();
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.warn('[DEV] could not import productKeys for dev refetch', err);
  });
}