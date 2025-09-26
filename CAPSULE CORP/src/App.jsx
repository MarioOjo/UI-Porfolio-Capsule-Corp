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
      </Routes>
      <Footer />
    </>
  );
}

export default App;