import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ReviewProvider } from './contexts/ReviewContext'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <ReviewProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </ReviewProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)