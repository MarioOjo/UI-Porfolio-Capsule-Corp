import React, { useState, useCallback } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useDebounce } from '../hooks/usePerformance';

const SearchAndFilter = ({ 
  products, 
  onFilteredProducts, 
  categories = [],
  priceRange = { min: 0, max: 10000 }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState([priceRange.min, priceRange.max]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceFilter[0] && product.price <= priceFilter[1]
    );

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'popularity':
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
          break;
        case 'newest':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onFilteredProducts(filtered);
  }, [products, debouncedSearchTerm, selectedCategory, priceFilter, sortBy, sortOrder, onFilteredProducts]);

  React.useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceFilter([priceRange.min, priceRange.max]);
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = 
    searchTerm || 
    selectedCategory !== 'all' || 
    priceFilter[0] !== priceRange.min || 
    priceFilter[1] !== priceRange.max;

  const { formatPrice } = useCurrency();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for Dragon Ball Z gear..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <div className="absolute left-3 top-3.5 text-gray-400">
          🔍
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          🔧 Filters
          <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
          >
            ✕ Clear All
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="rating-desc">Rating (High-Low)</option>
            <option value="popularity-desc">Most Popular</option>
            <option value="newest-desc">Newest First</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
                Price Range: {formatPrice(priceFilter[0])} - {formatPrice(priceFilter[1])}
              </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceFilter[0]}
                onChange={(e) => setPriceFilter([parseInt(e.target.value) || 0, priceFilter[1]])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Min"
              />
              <input
                type="number"
                value={priceFilter[1]}
                onChange={(e) => setPriceFilter([priceFilter[0], parseInt(e.target.value) || priceRange.max])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Quick Price Filters */}
          <div>
            <label className="block text-sm font-medium mb-2">Quick Price Filters</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: `Under ${formatPrice(100)}`, range: [0, 100] },
                { label: `${formatPrice(100)} - ${formatPrice(500)}`, range: [100, 500] },
                { label: `${formatPrice(500)} - ${formatPrice(1000)}`, range: [500, 1000] },
                { label: `Over ${formatPrice(1000)}`, range: [1000, priceRange.max] }
              ].map(filter => (
                <button
                  key={filter.label}
                  onClick={() => setPriceFilter(filter.range)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    priceFilter[0] === filter.range[0] && priceFilter[1] === filter.range[1]
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;