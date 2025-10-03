import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import ProductCard from "../components/Product/ProductCard";
import { apiFetch } from "../utils/api";

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Sync search state with URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search') || "";
    setSearch(searchParam);
  }, [searchParams]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Battle Gear", label: "⚔️ Battle Gear" },
    { value: "Training", label: "💪 Training" },
    { value: "Technology", label: "📡 Technology" },
    { value: "Capsules", label: "🧪 Capsules" }
  ];

  const sortOptions = [
    { value: "featured", label: "Featured First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "power-high", label: "Power Level: High to Low" },
    { value: "power-low", label: "Power Level: Low to High" },
    { value: "name", label: "Name A-Z" }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let apiPath = '/api/products';
        const params = new URLSearchParams();
        
        // Add filters to API call
        if (search.trim()) {
          params.append('search', search.trim());
        }
        
        if (selectedCategory !== "all") {
          params.append('category', selectedCategory);
        }
        
        if (sortBy === "featured") {
          params.append('featured', 'true');
        }
        
        if (params.toString()) {
          apiPath += '?' + params.toString();
        }
        
        const response = await apiFetch(apiPath);
        let fetchedProducts = response.products || [];
        
        // Sort products locally since backend doesn't handle all sort options
        const sortedProducts = [...fetchedProducts].sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price;
            case "price-high":
              return b.price - a.price;
            case "power-high":
              return (b.power_level || 0) - (a.power_level || 0);
            case "power-low":
              return (a.power_level || 0) - (b.power_level || 0);
            case "name":
              return a.name.localeCompare(b.name);
            case "featured":
            default:
              return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.power_level || 0) - (a.power_level || 0);
          }
        });
        
        setProducts(sortedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, sortBy]);

  const featuredProducts = products.filter(product => product.featured);
  const regularProducts = products.filter(product => !product.featured);

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-saiyan">LOADING CAPSULES...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-800 mb-2 font-saiyan">ERROR</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-saiyan hover:bg-red-700 transition-all"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Products Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Search Results Indicator */}
            {search.trim() && (
              <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
                <h2 className="text-lg font-bold text-blue-800 font-saiyan">
                  🔍 SEARCH RESULTS FOR: "{search.trim()}"
                </h2>
                <p className="text-blue-600 text-sm mt-1">
                  {products.length} {products.length === 1 ? 'item' : 'items'} found
                </p>
              </div>
            )}

            {/* Category Filter Indicator */}
            {selectedCategory !== 'all' && (
              <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg">
                <h2 className="text-lg font-bold text-orange-800 font-saiyan">
                  📂 CATEGORY: {selectedCategory.toUpperCase()}
                </h2>
                <p className="text-orange-600 text-sm mt-1">
                  {products.length} {products.length === 1 ? 'item' : 'items'} in this category
                </p>
              </div>
            )}

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
          <section className="mb-8 sm:mb-12">
            {featuredProducts.length > 0 && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 font-saiyan">
                ALL CAPSULES
              </h2>
            )}
            <div className="mobile-grid">
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl">
          <div className="text-3xl sm:text-4xl mb-4">💡</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 font-saiyan">SAIYAN BATTLE TIP</h3>
          <p className="text-sm sm:text-base lg:text-lg opacity-90">
            Combine multiple items for devastating power combos! Mix training gear with battle equipment for maximum effectiveness.
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;