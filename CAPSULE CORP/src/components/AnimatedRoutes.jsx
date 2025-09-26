import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import PageTransition from './PageTransition';
import LoadingSpinner from './LoadingSpinner';

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
const Profile = lazy(() => import('../pages/Profile/Profile'));
const OrderHistory = lazy(() => import('../pages/Profile/OrderHistory'));
const AddressBook = lazy(() => import('../pages/Profile/AddressBook'));
const ChangePassword = lazy(() => import('../pages/Profile/ChangePassword'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AnimatedRoutes = () => {
  const location = useLocation();

  const loadingComponent = (
    <LoadingSpinner 
      size="large" 
      text="Powering up Capsule Corp systems..." 
      fullScreen 
    />
  );

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Suspense fallback={loadingComponent}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/battle-gear" element={<BattleGear />} />
              <Route path="/capsules" element={<Capsules />} />
              <Route path="/training" element={<Training />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/address-book" element={<AddressBook />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedRoutes;