import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
<<<<<<< HEAD:frontend/src/pages/Products.jsx
import ProductCard from "../components/Product/ProductCard";
import { useProducts } from "../hooks/useProducts";
=======
import { Suspense, lazy } from "react";
const ProductCard = lazy(() => import("../components/Product/ProductCard"));
import { apiFetch } from "../utils/api";
>>>>>>> capsule-corp-:CAPSULE CORP/src/pages/Products.jsx

function Products() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from backend via React Query
  const filters = useMemo(() => {
    const f = {};
    if (search.trim()) f.search = search.trim();
    if (selectedCategory !== "all") f.category = selectedCategory;
    return f;
  }, [search, selectedCategory]);

  const { data: fetchedProducts = [], isLoading, isError, error } = useProducts(filters);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Battle Gear", label: "⚔️ Battle Gear" },
    { value: "Training", label: "💪 Training" },
    { value: "Tech", label: "📡 Tech" },
    { value: "Capsules", label: "🏠 Capsules" },
    { value: "Consumables", label: "🍃 Consumables" }
  ];

  const sortOptions = [
    { value: "featured", label: "Featured First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "power-high", label: "Power Level: High to Low" },
    { value: "power-low", label: "Power Level: Low to High" },
    { value: "name", label: "Name A-Z" }
  ];

  // Sort products client-side
  const products = useMemo(() => {
    if (!fetchedProducts || fetchedProducts.length === 0) return [];
    
    const sorted = [...fetchedProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "power-high":
          return (b.power_level || 0) - (a.power_level || 0);
        case "power-low":
          return (a.power_level || 0) - (b.power_level || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          // Featured first, then by power level
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.power_level || 0) - (a.power_level || 0);
      }
    });
    return sorted;
  }, [fetchedProducts, sortBy]);

  const featuredProducts = products.filter(product => product.featured);
  const regularProducts = products.filter(product => !product.featured);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">⚡</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              LOADING CAPSULES...
            </h3>
            <p className="text-gray-600">Gathering legendary gear from the vault...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              CONNECTION ERROR
            </h3>
            <p className="text-gray-600 mb-6">
              {error?.message || "Failed to load products. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105"
            >
              RETRY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-saiyan">
            CAPSULE CORP INVENTORY
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Power up with authentic Z-Fighter equipment and legendary gear
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Dragon Balls, Gear..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm sm:text-base touch-target"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm sm:text-base touch-target"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-bold text-orange-600">{products.length}</span> products
              {search && (
                <span className="hidden sm:inline"> for "<span className="font-medium">{search}</span>"</span>
              )}
              {selectedCategory !== "all" && (
                <span className="hidden sm:inline"> in <span className="font-medium">{selectedCategory}</span></span>
              )}
            </p>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-center py-4 sm:py-6 mb-6 sm:mb-8 rounded-2xl shadow-lg kamehameha-glow">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-saiyan tracking-wide">
                ⭐ LEGENDARY ITEMS ⭐
              </h2>
              <p className="mt-2 opacity-90 text-sm sm:text-base">Ultra-rare gear for elite warriors</p>
            </div>
            <div className="mobile-grid">
              <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    size="large"
                  />
                ))}
              </Suspense>
            </div>
          </section>
        )}

        {/* Regular Products */}
        {regularProducts.length > 0 && (
          <section className="mb-8 sm:mb-12">
            {featuredProducts.length > 0 && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 font-saiyan">
                ALL CAPSULES
              </h2>
            )}
            <div className="mobile-grid">
              <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
                {regularProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    size="medium"
                  />
                ))}
              </Suspense>
            </div>
          </section>
        )}

        {/* No Results */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              NO CAPSULES FOUND
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortBy("featured");
              }}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Battle Tip */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl">
          <div className="text-3xl sm:text-4xl mb-4">💡</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 font-saiyan">SAIYAN BATTLE TIP</h3>
          <p className="text-sm sm:text-base lg:text-lg opacity-90">
            Combine multiple items for devastating power combos! Mix training gear with battle equipment for maximum effectiveness.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Products;