import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import ProductCard from "../components/Product/ProductCard";
import { allProducts, searchProducts, getProductsByCategory } from "../data/products.js";

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(allProducts);
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Battle Gear", label: "⚔️ Battle Gear" },
    { value: "Training", label: "💪 Training" },
    { value: "Tech", label: "📡 Tech" },
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

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = allProducts;

    // Search filter
    if (search.trim()) {
      filteredProducts = searchProducts(search);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        product => product.category === selectedCategory
      );
    }

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "power-high":
          return b.powerLevel - a.powerLevel;
        case "power-low":
          return a.powerLevel - b.powerLevel;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return b.featured - a.featured || b.powerLevel - a.powerLevel;
      }
    });

    setProducts(sortedProducts);
  }, [search, selectedCategory, sortBy]);

  const featuredProducts = products.filter(product => product.featured);
  const regularProducts = products.filter(product => !product.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-saiyan">
            CAPSULE CORP INVENTORY
          </h1>
          <p className="text-gray-600 text-lg">
            Power up with authentic Z-Fighter equipment and legendary gear
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Dragon Balls, Scouters, Battle Gear..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-w-[200px]"
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
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-w-[200px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing <span className="font-bold text-orange-600">{products.length}</span> products
              {search && (
                <span> for "<span className="font-medium">{search}</span>"</span>
              )}
              {selectedCategory !== "all" && (
                <span> in <span className="font-medium">{selectedCategory}</span></span>
              )}
            </p>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-center py-4 mb-8 rounded-2xl shadow-lg kamehameha-glow">
              <h2 className="text-3xl font-bold font-saiyan tracking-wide">
                ⭐ LEGENDARY ITEMS ⭐
              </h2>
              <p className="mt-2 opacity-90">Ultra-rare gear for elite warriors</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  size="large"
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Products */}
        {regularProducts.length > 0 && (
          <section className="mb-12">
            {featuredProducts.length > 0 && (
              <h2 className="text-2xl font-bold text-gray-800 mb-8 font-saiyan">
                ALL CAPSULES
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  size="medium"
                />
              ))}
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center shadow-xl">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-2xl font-bold mb-4 font-saiyan">SAIYAN BATTLE TIP</h3>
          <p className="text-lg opacity-90">
            Combine multiple items for devastating power combos! Mix training gear with battle equipment for maximum effectiveness.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Products;