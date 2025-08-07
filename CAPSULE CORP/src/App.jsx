import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomeHeader from "./components/Home/HomeHeader";
import HomeNavigation from "./components/Home/HomeNavigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import BattleGear from "./pages/BattleGear";
import Capsules from "./pages/Capsules";
import Training from "./pages/Training";
import Cart from "./pages/Cart";
import AuthPage from "./pages/Auth/AuthPage";

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <HomeHeader cartCount={cartCount} />
      <HomeNavigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products cartCount={cartCount} setCartCount={setCartCount} />} />
        <Route path="/battle-gear" element={<BattleGear />} />
        <Route path="/capsules" element={<Capsules />} />
        <Route path="/training" element={<Training />} />
        <Route path="/cart" element={<Cart cartCount={cartCount} setCartCount={setCartCount} />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;