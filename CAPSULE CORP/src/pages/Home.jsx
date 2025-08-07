import HeroSection from "../components/Home/HeroSection";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import FeaturesSection from "../components/Home/FeaturesSection";
import { useState } from "react";

function Home({ cartCount, setCartCount }) {
  // Optionally, you can lift cart state up to App and pass setCartCount here
  const handleAddToCart = () => {
    if (setCartCount) setCartCount(count => count + 1);
  };

  return (
    <>
      <HeroSection />
      <FeaturedProducts onAddToCart={handleAddToCart} />
      <FeaturesSection />
    </>
  );
}

export default Home;