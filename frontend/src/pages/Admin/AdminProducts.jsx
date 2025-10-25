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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      
      onSave({
        ...formData,
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
        >
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
      if (imageFiles.length === 0 && imageUrls.length === 0) newErrors.images = 'At least one image is required.';
      
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      
      onSave({
        ...product,
        ...formData,
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
        >
          <h3 className="text-2xl font-bold text-gray-800 font-saiyan mb-6">EDIT PRODUCT</h3>
          
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

            {/* ... other form fields same as AddProductModal ... */}

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
          <h1 className="text-3xl font-bold text-gray-800 font-saiyan">Admin Products</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Products table and other content will go here */}
        
        {/* Modals */}
        {showAddModal && (
          <AddProductModal
            onSave={(productData) => {
              // Handle save logic
              console.log('Saving product:', productData);
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        )}

        {showEditModal && editingProduct && (
          <EditProductModal
            product={editingProduct}
            onSave={(productData) => {
              // Handle update logic
              console.log('Updating product:', productData);
              setShowEditModal(false);
              setEditingProduct(null);
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