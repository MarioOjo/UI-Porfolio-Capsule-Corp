const Product = require('../../models/Product');

class ProductModel {
  static async findAll(options = {}) {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = -1 } = options;
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments()
    ]);
    
    return {
      products: products.map(this._normalize),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id) {
    let product;
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else if (!isNaN(id)) {
      product = await Product.findOne({ legacyId: id });
    }
    
    // Fallback for string legacy IDs
    if (!product && !isNaN(parseInt(id))) {
      product = await Product.findOne({ legacyId: parseInt(id) });
    }

    return product ? this._normalize(product) : null;
  }

  static async findBySlug(slug) {
    const product = await Product.findOne({ slug });
    return product ? this._normalize(product) : null;
  }

  static async findByCategory(category, options = {}) {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = -1 } = options;
    const skip = (page - 1) * limit;
    
    const filter = { category };
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    return {
      products: products.map(this._normalize),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async search(searchTerm, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;
    
    const regex = new RegExp(searchTerm, 'i');
    const filter = {
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { tags: regex }
      ]
    };
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    return {
      products: products.map(this._normalize),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async create(productData) {
    const {
      name,
      slug,
      description,
      category = 'Accessories',
      price = 0,
      original_price,
      power_level = 0,
      image,
      gallery = [],
      in_stock = true,
      stock = 0,
      featured = false,
      tags = [],
      specifications = {}
    } = productData;

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      original_price,
      power_level,
      image: image || productData.mainImage,
      gallery,
      in_stock,
      stock,
      featured,
      tags,
      specifications,
      created_at: new Date(),
      updated_at: new Date()
    });

    return this._normalize(product);
  }

  static async update(id, productData) {
    const updates = { updated_at: new Date() };
    
    // Map fields
    if (productData.name !== undefined) updates.name = productData.name;
    if (productData.slug !== undefined) updates.slug = productData.slug;
    if (productData.description !== undefined) updates.description = productData.description;
    if (productData.category !== undefined) updates.category = productData.category;
    if (productData.price !== undefined) updates.price = productData.price;
    if (productData.original_price !== undefined) updates.original_price = productData.original_price;
    if (productData.power_level !== undefined) updates.power_level = productData.power_level;
    if (productData.image !== undefined) updates.image = productData.image;
    if (productData.mainImage !== undefined && !updates.image) updates.image = productData.mainImage;
    if (productData.gallery !== undefined) updates.gallery = productData.gallery;
    if (productData.in_stock !== undefined) updates.in_stock = productData.in_stock;
    if (productData.stock !== undefined) updates.stock = productData.stock;
    if (productData.featured !== undefined) updates.featured = productData.featured;
    if (productData.tags !== undefined) updates.tags = productData.tags;
    if (productData.specifications !== undefined) updates.specifications = productData.specifications;

    let product;
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndUpdate(id, updates, { new: true });
    } else if (!isNaN(id)) {
      product = await Product.findOneAndUpdate({ legacyId: id }, updates, { new: true });
    }

    if (!product) throw new Error(`Product with id ${id} not found`);
    return this._normalize(product);
  }

  static async delete(id) {
    let result;
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Product.findByIdAndDelete(id);
    } else if (!isNaN(id)) {
      result = await Product.findOneAndDelete({ legacyId: id });
    }
    return !!result;
  }

  static async remove(id) {
    return this.delete(id);
  }

  static async getFeatured() {
    const products = await Product.find({ featured: true }).sort({ created_at: -1 });
    return products.map(this._normalize);
  }

  static async removeImage(id, imageUrl) {
    let product;
    // Find the product first
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else if (!isNaN(id)) {
      product = await Product.findOne({ legacyId: id });
    }

    if (!product) throw new Error('Product not found');

    // Filter the gallery
    product.gallery = product.gallery.filter(url => url !== imageUrl);
    await product.save();
    return true;
  }

  static _normalize(product) {
    if (!product) return null;
    return {
      id: product._id.toString(),
      legacyId: product.legacyId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price,
      original_price: product.original_price,
      power_level: product.power_level,
      image: product.image,
      gallery: product.gallery || [],
      in_stock: product.in_stock,
      stock: product.stock,
      featured: product.featured,
      tags: product.tags || [],
      specifications: product.specifications || {},
      created_at: product.created_at,
      updated_at: product.updated_at
    };
  }
}

module.exports = ProductModel;
