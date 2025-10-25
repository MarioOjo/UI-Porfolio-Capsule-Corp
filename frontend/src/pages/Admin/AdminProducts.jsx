import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaArrowLeft } from 'react-icons/fa';
import { apiFetch } from '../../utils/api.js';
import Price from '../../components/Price';

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
    if (window.confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone!')) {
      try {
        await apiFetch(`/api/products/${productId}`, { method: 'DELETE' });
        setProducts(products.filter(p => p.id !== productId));
        // Success notification could be added here
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('❌ Failed to delete product. Please try again.');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      let response;
      // If a file was provided from the edit modal, send multipart/form-data
      if (updatedProduct.imageFiles && updatedProduct.imageFiles.length) {
        const form = new FormData();
        form.append('name', updatedProduct.name);
        form.append('slug', updatedProduct.slug);
        form.append('description', updatedProduct.description);
        form.append('category', updatedProduct.category);
        form.append('price', String(updatedProduct.price));
        form.append('original_price', String(updatedProduct.originalPrice || updatedProduct.price));
        form.append('power_level', String(updatedProduct.powerLevel || 0));
        form.append('in_stock', updatedProduct.inStock ? '1' : '0');
        form.append('stock', String(updatedProduct.stock));
        form.append('featured', updatedProduct.featured ? '1' : '0');
        form.append('tags', JSON.stringify(updatedProduct.tags || []));
        form.append('specifications', JSON.stringify(updatedProduct.specifications || {}));
        // append multiple files
        updatedProduct.imageFiles.forEach((f) => form.append('images', f));
        if (updatedProduct.gallery && updatedProduct.gallery.length) {
          form.append('gallery', JSON.stringify(updatedProduct.gallery));
        }

        response = await apiFetch(`/api/products/${updatedProduct.id}`, {
          method: 'PUT',
          body: form
        });
      } else {
        response = await apiFetch(`/api/products/${updatedProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: updatedProduct.name,
            slug: updatedProduct.slug,
            description: updatedProduct.description,
            category: updatedProduct.category,
            price: updatedProduct.price,
            original_price: updatedProduct.originalPrice || updatedProduct.price,
            power_level: updatedProduct.powerLevel,
            image: updatedProduct.image || updatedProduct.imageUrl,
            gallery: updatedProduct.gallery || [],
            in_stock: updatedProduct.inStock,
            stock: updatedProduct.stock,
            featured: updatedProduct.featured || false,
            tags: updatedProduct.tags || [],
            specifications: updatedProduct.specifications || {}
          })
        });
      }
      
      // Update local state with the updated product
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? response.product : p
      ));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('❌ Failed to update product. Please try again.');
    }
  };

  const handleAddProduct = async (newProductData) => {
    try {
      let response;
      if (newProductData.imageFiles && newProductData.imageFiles.length) {
        const form = new FormData();
        form.append('name', newProductData.name);
        form.append('slug', newProductData.name.toLowerCase().replace(/\s+/g, '-'));
        form.append('description', newProductData.description);
        form.append('category', newProductData.category);
        form.append('price', String(newProductData.price));
        form.append('original_price', String(newProductData.price));
        form.append('power_level', String(newProductData.powerLevel || 0));
        form.append('in_stock', newProductData.inStock ? '1' : '0');
        form.append('stock', String(newProductData.stock));
        form.append('featured', '0');
        form.append('tags', JSON.stringify([]));
        form.append('specifications', JSON.stringify({}));
        // append multiple files
        newProductData.imageFiles.forEach((f) => form.append('images', f));
        // append existing imageUrls from gallery
        if (newProductData.imageUrls && newProductData.imageUrls.length) {
          form.append('gallery', JSON.stringify(newProductData.imageUrls));
        }
        response = await apiFetch('/api/products', {
          method: 'POST',
          body: form
        });
      } else {
        response = await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: newProductData.name,
            slug: newProductData.name.toLowerCase().replace(/\s+/g, '-'),
            description: newProductData.description,
            category: newProductData.category,
            price: newProductData.price,
            original_price: newProductData.price,
            power_level: newProductData.powerLevel,
            image: newProductData.imageUrls?.[0] || 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg',
            gallery: newProductData.imageUrls?.length ? newProductData.imageUrls : ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg'],
            in_stock: newProductData.inStock,
            stock: newProductData.stock,
            featured: false,
            tags: [],
            specifications: {}
          })
        });
      }
      
      setProducts([...products, response.product]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('❌ Failed to add product. Please try again.');
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
                        <Price value={parseFloat(product.price || 0)} />
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // Track multiple URLs
  const [errors, setErrors] = useState({});
  // Drag-and-drop support
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      setImageFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Real-time validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Valid price required.';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) newErrors.stock = 'Valid stock required.';
    if (!formData.category) newErrors.category = 'Category required.';
    if (imageFiles.length === 0 && imageUrls.length === 0) newErrors.images = 'At least one image is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      powerLevel: parseInt(formData.powerLevel) || 0,
      imageFiles: imageFiles,
      imageUrl: imageUrls.length ? imageUrls[0] : imageUrl, // Use first URL from list or single URL
      imageUrls: imageUrls
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveUrl = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onDrop={handleDrop} onDragOver={handleDragOver}>
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
            />
            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter product description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
            {errors.description && <div className="text-red-600 text-xs mt-1">{errors.description}</div>}
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
              />
              {errors.price && <div className="text-red-600 text-xs mt-1">{errors.price}</div>}
            </div>
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">STOCK</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-saiyan"
              />
              {errors.stock && <div className="text-red-600 text-xs mt-1">{errors.stock}</div>}
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
              >
                <option value="Battle Gear">Battle Gear</option>
                <option value="Training">Training</option>
                <option value="Technology">Technology</option>
                <option value="Capsules">Capsules</option>
              </select>
              {errors.category && <div className="text-red-600 text-xs mt-1">{errors.category}</div>}
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

          {/* Image upload / URL */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">IMAGE (file upload) — you can select multiple</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Or paste an image URL below and click "Add to Gallery".</p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                <div>
                  <label className="block text-sm font-saiyan text-gray-700 mb-2">IMAGE (file upload or drag-and-drop) — you can select multiple</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or paste an image URL below and click "Add to Gallery". You can also drag-and-drop images into this modal.</p>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add to Gallery
                    </button>
                  </div>
                  {errors.images && <div className="text-red-600 text-xs mt-1">{errors.images}</div>}

                  {/* File previews */}
                  {imageFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {imageFiles.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gallery URL previews */}
                  {imageUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {imageUrls.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`gallery-${idx}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUrl(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState(product.gallery || []); // Initialize with existing gallery

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
      image: imageUrls.length ? imageUrls[0] : product.image, // Use first gallery image as main
      imageFiles: imageFiles,
      gallery: imageUrls, // Send managed gallery list
      imageUrls: imageUrls,
      featured: product.featured || false,
      tags: product.tags || [],
      specifications: product.specifications || {}
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveUrl = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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

          {/* Image upload / URL */}
          <div>
            <label className="block text-sm font-saiyan text-gray-700 mb-2">MANAGE GALLERY — Add or Remove Images</label>
            
            {/* Current gallery preview */}
            {imageUrls.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-saiyan text-gray-700 mb-2">Current Gallery ({imageUrls.length} images):</p>
                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10 text-sm font-bold"
                      >
                        ×
                      </button>
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover" />
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-75 text-white text-xs text-center py-1">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="block text-sm font-saiyan text-gray-700 mb-2">Upload files (multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])}
              className="w-full"
            />

            {/* File previews */}
            {imageFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-saiyan text-gray-700 mb-2">Files to upload:</p>
                <div className="grid grid-cols-3 gap-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative border border-gray-300 rounded-lg p-2 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-600 truncate pr-6">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">Or paste an image URL below and click "Add to Gallery".</p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add to Gallery
              </button>
            </div>
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