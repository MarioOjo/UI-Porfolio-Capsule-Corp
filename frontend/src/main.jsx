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

      // Debug helper: expose and optionally log the resolved API base.
      // This helps confirm whether the app is using a runtime `env.json`, a
      // build-time `VITE_API_BASE`, or falling back to same-origin.
      try {
        const runtime = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {};
        const resolvedApiBase = runtime.VITE_API_BASE || import.meta.env.VITE_API_BASE || '';
        // Expose on window for quick inspection and automated checks
        if (typeof window !== 'undefined') window.__API_BASE_DEBUG__ = resolvedApiBase;
        // Only log in development, on localhost, or when explicitly requested
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const shouldLog = (process.env.NODE_ENV === 'development') || (params && params.get('debugApi') === '1') || (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost');
        if (shouldLog) {
          // eslint-disable-next-line no-console
          console.info('[DEBUG] Resolved API base:', resolvedApiBase || '(empty — using same-origin)');
        }
      } catch (e) {
        // ignore debug helper errors
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
        </QueryClientProvider>
      </StrictMode>
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap app', e);
    // Fallback: try to render anyway so devs can see console errors
    createRoot(document.getElementById('root')).render(
      <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
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

  // Optional cursor debug helper: enable when ?cursorDebug=1 is present or
  // when window.__CURSOR_DEBUG__ === true. This helper highlights the topmost
  // element under the cursor and logs the top elements. Disabled by default.
  try {
    const params = new URLSearchParams(window.location.search || '');
    const enableCursorDebug = params.get('cursorDebug') === '1' || window.__CURSOR_DEBUG__ === true;
    if (enableCursorDebug) {
      import('./utils/cursorDebug').then(({ default: enable, enableCursorDebug: namedEnable }) => {
        const fn = namedEnable || enable;
        try { fn({ log: true, color: 'magenta' }); } catch (e) { console.warn('cursorDebug failed', e); }
      }).catch(e => console.warn('Could not load cursorDebug', e));
    }
  } catch (e) {
    // ignore
  }

  // Optional overlay debug helper: enable with ?overlayDebug=1 (log-only)
  // or ?overlayFix=1 (log + temporarily set pointer-events:none on visible fixed backdrops)
  try {
    const params2 = new URLSearchParams(window.location.search || '');
    const enableOverlayDebug = params2.get('overlayDebug') === '1' || window.__OVERLAY_DEBUG__ === true;
    const enableOverlayFix = params2.get('overlayFix') === '1' || window.__OVERLAY_FIX__ === true;
    if (enableOverlayDebug || enableOverlayFix) {
      import('./utils/overlayDebug').then(({ default: enable }) => {
        try { enable({ log: true, fix: enableOverlayFix, outlineColor: 'magenta' }); } catch (e) { console.warn('overlayDebug failed', e); }
      }).catch(e => console.warn('Could not load overlayDebug', e));
    }
  } catch (e) {
    // ignore
  }
}