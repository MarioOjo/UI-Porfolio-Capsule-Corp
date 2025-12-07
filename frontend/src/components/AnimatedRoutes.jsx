import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AdminReviews from '../pages/Admin/AdminReviews';

// Lazy-load PageTransition (and thus framer-motion) so the motion runtime
// is only fetched when the transition component is rendered.
const PageTransition = lazy(() => import('./PageTransition'));

// Enhanced loading component
const LoadingSpinner = lazy(() => import('./LoadingSpinner'));

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const BattleGear = lazy(() => import('../pages/BattleGear'));
const Capsules = lazy(() => import('../pages/Capsules'));
const Training = lazy(() => import('../pages/Training'));
const Cart = lazy(() => import('../pages/Cart'));
const AuthPage = lazy(() => import('../pages/Auth/AuthPage'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const ProfileLayout = lazy(() => import('../pages/Profile/ProfileLayout'));
const ProfileDashboard = lazy(() => import('../pages/Profile/ProfileDashboard'));
const OrderHistory = lazy(() => import('../pages/Profile/OrderHistory'));
const AddressBook = lazy(() => import('../pages/Profile/AddressBook'));
const ProfileWishlist = lazy(() => import('../pages/Profile/ProfileWishlist'));
const ChangePassword = lazy(() => import('../pages/Profile/ChangePassword'));
const Returns = lazy(() => import('../pages/Profile/Returns'));
const OrderTracking = lazy(() => import('../pages/OrderTracking'));
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation'));
const ShippingInfo = lazy(() => import('../pages/ShippingInfo'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/Admin/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers'));

// Community & Special Pages (Commented out - pages not created yet)
// const Community = lazy(() => import('../pages/Community'));
// const Rewards = lazy(() => import('../pages/Rewards'));
// const BattleArena = lazy(() => import('../pages/BattleArena'));
// const DragonBallHunt = lazy(() => import('../pages/DragonBallHunt'));

const NotFound = lazy(() => import('../pages/NotFound'));

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();

  // Simple loading component
  const loadingComponent = (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <LoadingSpinner />
    </div>
  );

  // Route-specific wrapper for additional context
  const RouteWrapper = ({ children, routeType }) => (
    <div className={`route-${routeType} ${isDarkMode ? 'dark' : 'light'}`}>
      {children}
    </div>
  );

  return (
    <div className="w-full min-h-screen">
      {/* PageTransition is lazy-loaded. Suspense fallback will show while it loads. */}
      <Suspense fallback={loadingComponent}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={
              <RouteWrapper routeType="home">
                <Home />
              </RouteWrapper>
            } />
            
            <Route path="/products" element={
              <RouteWrapper routeType="products">
                <Products />
              </RouteWrapper>
            } />
            
            <Route path="/product/:slug" element={
              <RouteWrapper routeType="product-detail">
                <ProductDetail />
              </RouteWrapper>
            } />
            
            <Route path="/battle-gear" element={
              <RouteWrapper routeType="battle-gear">
                <BattleGear />
              </RouteWrapper>
            } />
            
            <Route path="/capsules" element={
              <RouteWrapper routeType="capsules">
                <Capsules />
              </RouteWrapper>
            } />
            
            <Route path="/training" element={
              <RouteWrapper routeType="training">
                <Training />
              </RouteWrapper>
            } />
            
            <Route path="/cart" element={
              <RouteWrapper routeType="cart">
                <Cart />
              </RouteWrapper>
            } />
            
            <Route path="/checkout" element={
              <RouteWrapper routeType="checkout">
                <Checkout />
              </RouteWrapper>
            } />
            
            <Route path="/wishlist" element={
              <RouteWrapper routeType="wishlist">
                <Wishlist />
              </RouteWrapper>
            } />
            
            <Route path="/contact" element={
              <RouteWrapper routeType="contact">
                <Contact />
              </RouteWrapper>
            } />
            
            <Route path="/about" element={
              <RouteWrapper routeType="about">
                <About />
              </RouteWrapper>
            } />
            
            <Route path="/auth" element={
              <RouteWrapper routeType="auth">
                <AuthPage />
              </RouteWrapper>
            } />

            {/* Community & Special Features - Commented out until pages are created
            <Route path="/community" element={
              <RouteWrapper routeType="community">
                <Community />
              </RouteWrapper>
            } />
            
            <Route path="/rewards" element={
              <RouteWrapper routeType="rewards">
                <Rewards />
              </RouteWrapper>
            } />
            
            <Route path="/battle-arena" element={
              <RouteWrapper routeType="battle-arena">
                <BattleArena />
              </RouteWrapper>
            } />
            
            <Route path="/dragon-ball-hunt" element={
              <RouteWrapper routeType="dragon-ball-hunt">
                <DragonBallHunt />
              </RouteWrapper>
            } />
            */}

            {/* Profile Routes */}
            <Route path="/profile" element={
              <RouteWrapper routeType="profile">
                <ProfileLayout />
              </RouteWrapper>
            }>
              <Route index element={<ProfileDashboard />} />
              <Route path="account" element={<Profile />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="address-book" element={<AddressBook />} />
              <Route path="wishlist" element={<ProfileWishlist />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="returns" element={<Returns />} />
            </Route>

            {/* Utility Routes */}
            <Route path="/track-order" element={
              <RouteWrapper routeType="tracking">
                <OrderTracking />
              </RouteWrapper>
            } />
            
            <Route path="/order-tracking" element={
              <RouteWrapper routeType="tracking">
                <OrderTracking />
              </RouteWrapper>
            } />
            
            <Route path="/order-confirmation" element={
              <RouteWrapper routeType="confirmation">
                <OrderConfirmation />
              </RouteWrapper>
            } />
            
            <Route path="/shipping-info" element={
              <RouteWrapper routeType="shipping">
                <ShippingInfo />
              </RouteWrapper>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RouteWrapper routeType="admin">
                <AdminDashboard />
              </RouteWrapper>
            } />
            
            <Route path="/admin/products" element={
              <RouteWrapper routeType="admin">
                <AdminProducts />
              </RouteWrapper>
            } />
            <Route path="/admin/orders" element={
              <RouteWrapper routeType="admin">
                <AdminOrders />
              </RouteWrapper>
            } />
            <Route path="/admin/users" element={
              <RouteWrapper routeType="admin">
                <AdminUsers />
              </RouteWrapper>
            } />
            <Route path="/admin/reviews" element={
              <RouteWrapper routeType="admin">
                <Suspense fallback={loadingComponent}>
                  <AdminReviews />
                </Suspense>
              </RouteWrapper>
            } />

              <Route path="/admin/contact-messages" element={
                <RouteWrapper routeType="admin">
                  <Suspense fallback={loadingComponent}>
                    {React.createElement(lazy(() => import('../pages/AdminContactMessages')))}
                  </Suspense>
                </RouteWrapper>
              } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <RouteWrapper routeType="not-found">
                <NotFound />
              </RouteWrapper>
            } />
          </Routes>
        </PageTransition>
      </Suspense>
    </div>
  );
};

export default AnimatedRoutes;