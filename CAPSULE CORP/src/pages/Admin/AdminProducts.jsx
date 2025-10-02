import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaArrowLeft } from 'react-icons/fa';
import { apiFetch } from '../../utils/api.js';

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const isAdmin = user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com';
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch('/api/products');
        setProducts(response.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      const isAdmin = user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com';
      if (isAdmin) {
        fetchProducts();
      }
    }
  }, [user]);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const productName = product.name || '';
    const productDescription = product.description || '';
    const productCategory = product.category || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || productCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p && p.category).filter(Boolean))];

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiFetch(`/api/products/${productId}`, { method: 'DELETE' });
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await apiFetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          description: updatedProduct.description,
          category: updatedProduct.category,
          price: updatedProduct.price,
          original_price: updatedProduct.originalPrice || updatedProduct.price,
          power_level: updatedProduct.powerLevel,
          image: updatedProduct.image,
          gallery: updatedProduct.gallery || [],
          in_stock: updatedProduct.inStock,
          stock: updatedProduct.stock,
          featured: updatedProduct.featured || false,
          tags: updatedProduct.tags || [],
          specifications: updatedProduct.specifications || {}
        })
      });
      
      // Update local state with the updated product
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? response.product : p
      ));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleAddProduct = async (newProductData) => {
    try {
      const response = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: newProductData.name,
          slug: newProductData.name.toLowerCase().replace(/\s+/g, '-'),
          description: newProductData.description,
          category: newProductData.category,
          price: newProductData.price,
          original_price: newProductData.price,
          power_level: newProductData.powerLevel,
          image: newProductData.image || 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg',
          gallery: [newProductData.image || 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg'],
          in_stock: newProductData.inStock,
          stock: newProductData.stock,
          featured: false,
          tags: [],
          specifications: {}
        })
      });
      
      setProducts([...products, response.product]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
    }
  };

  const getStockStatus = (product) => {
    const inStock = product.inStock || product.in_stock;
    const stock = product.stock;
    
    if (!inStock) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock <= 5) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-saiyan">CHECKING AUTHENTICATION...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com';
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 font-saiyan mb-4">ACCESS DENIED</h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-saiyan hover:bg-blue-700"
          >
            GO HOME
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-saiyan">LOADING PRODUCTS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin')}
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-white font-saiyan">PRODUCT MANAGEMENT</h1>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2"
            >
              <FaPlus />
              <span>ADD PRODUCT</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={product.image} 
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/api/placeholder/48/48';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 font-saiyan">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              PL: {(product.powerLevel || product.power_level || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-saiyan">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/product/${product.slug}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Product"
                          >
                            <FaEye />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal 
          onSave={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal 
          product={editingProduct}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Add Product Modal Component
function AddProductModal({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Battle Gear',
    stock: '',
    powerLevel: '',
    inStock: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      powerLevel: parseInt(formData.powerLevel) || 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 font-saiyan mb-6">ADD NEW PRODUCT</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">PRODUCT NAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter product name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter product description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              required
            />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">PRICE ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">STOCK</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              />
            </div>
          </div>

          {/* Category and Power Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              >
                <option value="Battle Gear">Battle Gear</option>
                <option value="Training">Training</option>
                <option value="Technology">Technology</option>
                <option value="Capsules">Capsules</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">POWER LEVEL</label>
              <input
                type="number"
                value={formData.powerLevel}
                onChange={(e) => handleChange('powerLevel', e.target.value)}
                placeholder="9000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
              />
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inStockAdd"
              checked={formData.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="inStockAdd" className="text-sm font-saiyan text-gray-700">
              IN STOCK
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-saiyan font-bold hover:bg-gray-400 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
            >
              CREATE PRODUCT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Product Modal Component
function EditProductModal({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    powerLevel: product.powerLevel || product.power_level || 0,
    inStock: product.inStock !== undefined ? product.inStock : product.in_stock
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      powerLevel: parseInt(formData.powerLevel),
      originalPrice: product.originalPrice || product.original_price || formData.price,
      slug: product.slug,
      image: product.image,
      gallery: product.gallery || [],
      featured: product.featured || false,
      tags: product.tags || [],
      specifications: product.specifications || {}
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 font-saiyan mb-6">EDIT PRODUCT</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">PRODUCT NAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              required
            />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">PRICE ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">STOCK</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              />
            </div>
          </div>

          {/* Category and Power Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
                required
              >
                <option value="Battle Gear">Battle Gear</option>
                <option value="Training">Training</option>
                <option value="Technology">Technology</option>
                <option value="Capsules">Capsules</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">POWER LEVEL</label>
              <input
                type="number"
                value={formData.powerLevel}
                onChange={(e) => handleChange('powerLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
              />
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="inStock" className="text-sm font-saiyan text-gray-700">
              IN STOCK
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-saiyan font-bold hover:bg-gray-400 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
            >
              UPDATE PRODUCT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProducts;