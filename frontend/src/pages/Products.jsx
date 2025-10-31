import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
const ProductCard = lazy(() => import("../components/Product/ProductCard"));
import { useProducts } from "../hooks/useProducts";
import { useTheme } from "../contexts/ThemeContext";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const { isDarkMode } = useTheme();
  const themeClass = isDarkMode ? 'dark' : 'light';

  // Fetch products from backend via React Query
  const filters = useMemo(() => {
    const f = {};
    if (search.trim()) f.search = search.trim();
    if (selectedCategory && selectedCategory !== "all") f.category = selectedCategory;
    return f;
  }, [search, selectedCategory]);

  // Keep search and selectedCategory in sync with URL query params so links like
  // /products?category=Capsules or /products?search=term work when navigated from Navbar
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';
    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

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
      <div className={`min-h-0 bg-gradient-to-br ${themeClass === 'dark' ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">⚡</div>
            <h3 className={`text-2xl font-bold mb-4 font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              LOADING CAPSULES...
            </h3>
            <p className={themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Gathering legendary gear from the vault...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`min-h-0 bg-gradient-to-br ${themeClass === 'dark' ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className={`text-2xl font-bold mb-4 font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              CONNECTION ERROR
            </h3>
            <p className={themeClass === 'dark' ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
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
    <div className={`min-h-0 bg-gradient-to-br ${themeClass === 'dark' ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar / Filters */}
          <aside className="md:col-span-1">
            <div className="mb-6">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 font-saiyan ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}>CAPSULE CORP INVENTORY</h1>
              <p className={themeClass === 'dark' ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>Power up with authentic Z-Fighter equipment and legendary gear</p>
            </div>

            <div className={`rounded-2xl shadow-lg p-4 sm:p-6 ${themeClass === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <div className="relative w-full">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Dragon Balls, Gear..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>

                  <label className="text-sm font-semibold">Sort</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">Showing <span className="font-bold text-orange-600">{products.length}</span> products</p>
                </div>
              </form>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-3">
            {/* Featured banner */}
            {featuredProducts.length > 0 && (
              <section className="mb-8">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-center py-4 sm:py-6 mb-6 sm:mb-8 rounded-2xl shadow-lg kamehameha-glow">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-saiyan tracking-wide">⭐ LEGENDARY ITEMS ⭐</h2>
                  <p className="mt-2 opacity-90 text-sm sm:text-base">Ultra-rare gear for elite warriors</p>
                </div>
                <div className="mobile-grid">
                  <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} size="large" />
                    ))}
                  </Suspense>
                </div>
              </section>
            )}

            {/* Regular products list */}
            {regularProducts.length > 0 && (
              <section className="mb-8">
                {featuredProducts.length > 0 && (
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 font-saiyan">ALL CAPSULES</h2>
                )}
                <div className="mobile-grid">
                  <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
                    {regularProducts.map((product) => (
                      <ProductCard key={product.id} product={product} size="medium" />
                    ))}
                  </Suspense>
                </div>
              </section>
            )}

            {/* Battle Tip */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl mb-4">💡</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 font-saiyan">SAIYAN BATTLE TIP</h3>
              <p className="text-sm sm:text-base lg:text-lg opacity-90">Combine multiple items for devastating power combos! Mix training gear with battle equipment for maximum effectiveness.</p>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

export default Products;