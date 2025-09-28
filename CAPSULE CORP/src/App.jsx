import { Routes, Route } from "react-router-dom";
import HomeHeader from "./components/Home/HomeHeader";
import HomeNavigation from "./components/Home/HomeNavigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import BattleGear from "./pages/BattleGear";
import Capsules from "./pages/Capsules";
import Training from "./pages/Training";
import Cart from "./pages/Cart";
import AuthPage from "./pages/Auth/AuthPage";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile/Profile";
import OrderHistory from "./pages/Profile/OrderHistory";
import AddressBook from "./pages/Profile/AddressBook";
import ChangePassword from "./pages/Profile/ChangePassword";

function App() {
  return (
    <>
      <HomeHeader />
      <HomeNavigation />
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;