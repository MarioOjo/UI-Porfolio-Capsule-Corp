import { Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { usePerformanceMonitor } from "./hooks/usePerformance";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import HomeHeader from "./components/Home/HomeHeader";
import HomeNavigation from "./components/Home/HomeNavigation";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const BattleGear = lazy(() => import("./pages/BattleGear"));
const Capsules = lazy(() => import("./pages/Capsules"));
const Training = lazy(() => import("./pages/Training"));
const Cart = lazy(() => import("./pages/Cart"));
const AuthPage = lazy(() => import("./pages/Auth/AuthPage"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const OrderHistory = lazy(() => import("./pages/Profile/OrderHistory"));
const AddressBook = lazy(() => import("./pages/Profile/AddressBook"));
const ChangePassword = lazy(() => import("./pages/Profile/ChangePassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { handleRedirectResult } = useGoogleAuth();
  usePerformanceMonitor('App');

  useEffect(() => {
    // Handle Google OAuth redirect result when app loads
    handleRedirectResult();
  }, [handleRedirectResult]);

  const loadingComponent = (
    <LoadingSpinner 
      size="large" 
      text="Powering up Capsule Corp systems..." 
      fullScreen 
    />
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        <HomeNavigation />
        
        <main className="flex-1">
          <Suspense fallback={loadingComponent}>
            <Routes>
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
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;