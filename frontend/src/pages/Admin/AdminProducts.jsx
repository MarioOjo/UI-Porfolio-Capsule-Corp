import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaArrowLeft, FaBox } from 'react-icons/fa';
import { apiFetch } from '../../utils/api';
import Price from '../../components/Price';

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useNotifications();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/products');
        // Handle paginated { products: [...], pagination: {...} }, { products: [...] }, or direct array
        const productsList = Array.isArray(response) ? response : (response.products || response.data || []);
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showError]);

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

  // Create product via API (multipart/form-data when images present)
  const createProduct = async (productData) => {
    try {
      const fd = new FormData();
      fd.append('name', productData.name);
      
      // Auto-generate slug from name if not provided
      const slug = productData.slug || productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      fd.append('slug', slug);
      
      fd.append('description', productData.description);
      fd.append('price', String(productData.price));
      fd.append('category', productData.category);
      fd.append('stock', String(productData.stock));
      fd.append('power_level', String(productData.powerLevel || 0));
      fd.append('in_stock', productData.inStock ? '1' : '0');

      // append gallery URLs if any
      fd.append('gallery', JSON.stringify(productData.imageUrls || []));

      // append files
      if (productData.imageFiles && productData.imageFiles.length) {
        for (const file of productData.imageFiles) {
          fd.append('images', file);
        }
      }

      const body = await apiFetch('/api/admin/products', { method: 'POST', body: fd });
      if (body?.product) {
        setProducts(prev => [body.product, ...prev]);
        showSuccess('Product created successfully');
      } else {
        showSuccess('Product created');
      }
    } catch (err) {
      showError(err.message || 'Failed to create product');
      console.error('Create product error', err);
      throw err;
    }
  };

  const updateProduct = async (productData) => {
    try {
      const fd = new FormData();
      fd.append('name', productData.name);
      
      // Auto-generate slug from name if not provided
      const slug = productData.slug || productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      fd.append('slug', slug);
      
      fd.append('description', productData.description);
      fd.append('price', String(productData.price));
      fd.append('category', productData.category);
      fd.append('stock', String(productData.stock));
      fd.append('power_level', String(productData.powerLevel || 0));
      fd.append('in_stock', productData.inStock ? '1' : '0');
      fd.append('gallery', JSON.stringify(productData.imageUrls || productData.gallery || []));

      if (productData.imageFiles && productData.imageFiles.length) {
        for (const file of productData.imageFiles) {
          fd.append('images', file);
        }
      }

      const body = await apiFetch(`/api/admin/products/${productData.id}`, { method: 'PUT', body: fd });
      if (body?.product) {
        setProducts(prev => prev.map(p => (p.id === body.product.id ? body.product : p)));
        showSuccess('Product updated successfully');
      } else {
        showSuccess('Product updated');
      }
    } catch (err) {
      showError(err.message || 'Failed to update product');
      console.error('Update product error', err);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      await apiFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productId));
      showSuccess('Product deleted successfully');
    } catch (err) {
      showError(err.message || 'Failed to delete product');
      console.error('Delete product error', err);
    }
  };

  // Add Product Modal Component
  const AddProductModal = ({ onSave, onCancel }) => {
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
    const [imageUrls, setImageUrls] = useState([]);
    const [errors, setErrors] = useState({});

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
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Product name is required.';
      if (!formData.description.trim()) newErrors.description = 'Description is required.';
      if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Valid price required.';
      if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) newErrors.stock = 'Valid stock required.';
      if (!formData.category) newErrors.category = 'Category required.';
      if (imageFiles.length === 0 && imageUrls.length === 0) newErrors.images = 'At least one image is required.';
      
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      
      // Generate slug from product name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      onSave({
        ...formData,
        slug, // Add auto-generated slug
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        powerLevel: parseInt(formData.powerLevel) || 0,
        imageFiles: imageFiles,
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="add-product-title">
        <div 
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
        >
          <h3 id="add-product-title" className="text-2xl font-bold text-gray-800 font-saiyan mb-6">ADD NEW PRODUCT</h3>
          
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
                  <option value="Capsules">Capsules</option>
                  <option value="Technology">Technology</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Weapons">Weapons</option>
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

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">
                IMAGE (file upload or drag-and-drop) — you can select multiple
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Or paste an image URL below and click "Add to Gallery". You can also drag-and-drop images into this modal.
              </p>
              
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

              {/* File Previews */}
              {imageFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-saiyan text-gray-700 mb-2">Uploaded Files:</p>
                  <div className="flex flex-wrap gap-2">
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
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Previews */}
              {imageUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-saiyan text-gray-700 mb-2">Gallery URLs:</p>
                  <div className="flex flex-wrap gap-2">
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
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                ADD PRODUCT
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Product Modal Component
  const EditProductModal = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || 'Battle Gear',
      stock: product?.stock || '',
      powerLevel: product?.powerLevel || product?.power_level || '',
      inStock: product?.inStock !== undefined ? product.inStock : product?.in_stock || true
    });
    
    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState(product?.gallery || []);
    const [errors, setErrors] = useState({});

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
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Product name is required.';
      if (!formData.description.trim()) newErrors.description = 'Description is required.';
      if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Valid price required.';
      if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) newErrors.stock = 'Valid stock required.';
      if (!formData.category) newErrors.category = 'Category required.';
      // Images are optional for updates - you can update other fields without changing images
      
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      
      // Generate slug from product name if name changed, otherwise use existing slug
      const slug = formData.name !== product?.name 
        ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : product.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      onSave({
        ...product,
        ...formData,
        slug, // Add auto-generated slug
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        powerLevel: parseInt(formData.powerLevel) || 0,
        imageFiles: imageFiles,
        imageUrls: imageUrls,
        gallery: imageUrls
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

    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="edit-product-title">
        <div 
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
        >
          <h3 id="edit-product-title" className="text-2xl font-bold text-gray-800 font-saiyan mb-6">EDIT PRODUCT</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields same as AddProductModal but with existing values */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">PRODUCT NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                  <option value="Capsules">Capsules</option>
                  <option value="Technology">Technology</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Weapons">Weapons</option>
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
                id="inStockEdit"
                checked={formData.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="inStockEdit" className="text-sm font-saiyan text-gray-700">
                IN STOCK
              </label>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">
                ADD/UPDATE IMAGES (optional for updates)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add new images or paste URLs below. Existing images will be preserved unless replaced.
              </p>
              
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
                  Add URL
                </button>
              </div>

              {/* File Previews */}
              {imageFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-saiyan text-gray-700 mb-2">New Files to Upload:</p>
                  <div className="flex flex-wrap gap-2">
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
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Gallery URLs */}
              {imageUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-saiyan text-gray-700 mb-2">Current Gallery:</p>
                  <div className="flex flex-wrap gap-2">
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
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errors.images && <div className="text-red-600 text-xs mt-1">{errors.images}</div>}

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
  };

  // Main component JSX
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 font-saiyan">PRODUCT MANAGEMENT</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all font-saiyan"
          >
            <FaPlus /> ADD PRODUCT
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl font-saiyan text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Create your first product to get started!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-saiyan hover:scale-105 transition-all"
            >
              <FaPlus className="inline mr-2" /> ADD FIRST PRODUCT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {product.mainImage || (product.gallery && product.gallery[0]) ? (
                      <img 
                        src={product.mainImage || product.gallery[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="text-4xl text-gray-400" />
                      </div>
                    )}
                    {!product.in_stock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Price value={product.price} className="text-xl font-bold text-blue-600 font-saiyan" />
                      <span className="text-sm text-gray-500">
                        Stock: <span className="font-bold">{product.stock || 0}</span>
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowEditModal(true);
                        }}
                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-saiyan text-sm"
                      >
                        <FaEdit /> EDIT
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-saiyan text-sm"
                      >
                        <FaTrash /> DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {/* Modals */}
        {showAddModal && (
          <AddProductModal
            onSave={async (productData) => {
              try {
                await createProduct(productData);
                setShowAddModal(false);
              } catch (e) {
                // error already shown via notifications
              }
            }}
            onCancel={() => setShowAddModal(false)}
          />
        )}

        {showEditModal && editingProduct && (
          <EditProductModal
            product={editingProduct}
            onSave={async (productData) => {
              try {
                await updateProduct(productData);
                setShowEditModal(false);
                setEditingProduct(null);
              } catch (e) {
                // error already shown via notifications
              }
            }}
            onCancel={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AdminProducts;