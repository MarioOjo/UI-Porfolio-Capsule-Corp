// Helper to robustly parse JSON fields for a product
function parseProductFields(product) {
  try {
    // Safely parse gallery field
    if (product.gallery && typeof product.gallery === 'string') {
      if (product.gallery.trim().startsWith('[') || product.gallery.trim().startsWith('{')) {
        product.gallery = JSON.parse(product.gallery);
      } else {
        product.gallery = [product.gallery];
      }
    } else if (!product.gallery) {
      product.gallery = [];
    }
    // Safely parse tags field
    if (product.tags && typeof product.tags === 'string') {
      if (product.tags.trim().startsWith('[')) {
        product.tags = JSON.parse(product.tags);
      } else {
        product.tags = [product.tags];
      }
    } else if (!product.tags) {
      product.tags = [];
    }
    // Safely parse specifications field
    if (product.specifications && typeof product.specifications === 'string') {
      if (product.specifications.trim().startsWith('{')) {
        product.specifications = JSON.parse(product.specifications);
      } else {
        product.specifications = {};
      }
    } else if (!product.specifications) {
      product.specifications = {};
    }
    product.in_stock = Boolean(product.in_stock);
    product.featured = Boolean(product.featured);
    return product;
  } catch (parseError) {
    console.warn(`⚠️ JSON parse error for product ${product.id}:`, parseError.message);
    product.gallery = Array.isArray(product.gallery) ? product.gallery : [];
    product.tags = Array.isArray(product.tags) ? product.tags : [];
    product.specifications = typeof product.specifications === 'object' ? product.specifications : {};
    product.in_stock = Boolean(product.in_stock);
    product.featured = Boolean(product.featured);
    return product;
  }
  // Remove a product by ID
}

// ...existing code...
const dbConnection = require('../config/database');

class ProductModel {
  static async findAll() {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
  FROM products 
        ORDER BY created_at DESC
      `;
      const [results] = await pool.execute(query);
      const parsed = results.map(parseProductFields);

      return parsed;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
  FROM products 
        WHERE id = ?
      `;
      const [results] = await pool.execute(query, [id]);
      if (results.length === 0) return null;
      return parseProductFields(results[0]);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  static async findBySlug(slug) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
  FROM products 
        WHERE slug = ?
      `;
      const [results] = await pool.execute(query, [slug]);
      if (results.length === 0) return null;
      return parseProductFields(results[0]);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  static async findByCategory(category) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
  FROM products 
        WHERE category = ?
        ORDER BY created_at DESC
      `;
      const [results] = await pool.execute(query, [category]);
      const parsed = results.map(parseProductFields);
      return parsed;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  static async search(searchTerm) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
  FROM products 
        WHERE 
          name LIKE ? OR 
          description LIKE ? OR 
          category LIKE ? OR
          tags LIKE ?
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN description LIKE ? THEN 2
            ELSE 3
          END,
          created_at DESC
      `;
      const searchPattern = `%${searchTerm}%`;
      const [results] = await pool.execute(query, [
        searchPattern, searchPattern, searchPattern, searchPattern,
        searchPattern, searchPattern
      ]);
      const parsed = results.map(parseProductFields);
      return parsed;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  static async create(productData) {
    try {
      const pool = dbConnection.getPool();
      
      // Extract and validate required fields with defaults
      const name = productData.name || '';
      const slug = productData.slug || '';
      const description = productData.description || '';
      const category = productData.category || 'Accessories';
      const price = parseFloat(productData.price) || 0;
      const original_price = productData.original_price ? parseFloat(productData.original_price) : null;
      const power_level = parseInt(productData.power_level) || 0;
      const image = productData.image || productData.mainImage || '';
      const gallery = Array.isArray(productData.gallery) ? productData.gallery : [];
      const in_stock = productData.in_stock === false ? 0 : 1;
      const stock = parseInt(productData.stock) || 0;
      const featured = productData.featured ? 1 : 0;
      const tags = Array.isArray(productData.tags) ? productData.tags : [];
      const specifications = typeof productData.specifications === 'object' && productData.specifications !== null 
        ? productData.specifications 
        : {};

      const query = `
        INSERT INTO products (
          name, slug, description, category, price, original_price,
          power_level, image, gallery, in_stock, stock, featured,
          tags, specifications, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        name,
        slug,
        description,
        category,
        price,
        original_price,
        power_level,
        image,
        JSON.stringify(gallery),
        in_stock,
        stock,
        featured,
        JSON.stringify(tags),
        JSON.stringify(specifications)
      ];

      // Validate no undefined values
      const hasUndefined = values.some(v => v === undefined);
      if (hasUndefined) {
        console.error('Product creation has undefined values:', values);
        throw new Error('Invalid product data: some required fields are undefined');
      }

      const [result] = await pool.execute(query, values);
      return this.findById(result.insertId);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      const pool = dbConnection.getPool();
      
      // Get existing product first to preserve fields not being updated
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      // Extract and validate fields with fallback to existing values
      const name = productData.name !== undefined ? productData.name : existing.name;
      const slug = productData.slug !== undefined ? productData.slug : existing.slug;
      const description = productData.description !== undefined ? productData.description : existing.description;
      const category = productData.category !== undefined ? productData.category : existing.category;
      const price = productData.price !== undefined ? parseFloat(productData.price) : existing.price;
      const original_price = productData.original_price !== undefined 
        ? (productData.original_price ? parseFloat(productData.original_price) : null)
        : existing.original_price;
      const power_level = productData.power_level !== undefined ? parseInt(productData.power_level) || 0 : existing.power_level;
      const image = productData.image !== undefined ? productData.image : (productData.mainImage || existing.image);
      const gallery = productData.gallery !== undefined 
        ? (Array.isArray(productData.gallery) ? productData.gallery : [])
        : existing.gallery;
      const in_stock = productData.in_stock !== undefined 
        ? (productData.in_stock ? 1 : 0)
        : (existing.in_stock ? 1 : 0);
      const stock = productData.stock !== undefined ? parseInt(productData.stock) || 0 : existing.stock;
      const featured = productData.featured !== undefined ? (productData.featured ? 1 : 0) : (existing.featured ? 1 : 0);
      const tags = productData.tags !== undefined 
        ? (Array.isArray(productData.tags) ? productData.tags : [])
        : existing.tags;
      const specifications = productData.specifications !== undefined 
        ? (typeof productData.specifications === 'object' ? productData.specifications : {})
        : existing.specifications;

      const query = `
        UPDATE products SET
          name = ?,
          slug = ?,
          description = ?,
          category = ?,
          price = ?,
          original_price = ?,
          power_level = ?,
          image = ?,
          gallery = ?,
          in_stock = ?,
          stock = ?,
          featured = ?,
          tags = ?,
          specifications = ?,
          updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        name,
        slug,
        description,
        category,
        price,
        original_price,
        power_level,
        image,
        JSON.stringify(gallery),
        in_stock,
        stock,
        featured,
        JSON.stringify(tags),
        JSON.stringify(specifications),
        id
      ];

      // Validate no undefined values
      const hasUndefined = values.some(v => v === undefined);
      if (hasUndefined) {
        console.error('Product update has undefined values:', values);
        throw new Error('Invalid product data: some fields are undefined');
      }

      await pool.execute(query, values);
      return this.findById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const pool = dbConnection.getPool();
      const query = 'DELETE FROM products WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Alias for delete method
  static async remove(id) {
    return this.delete(id);
  }

  static async getFeatured() {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id,
          name,
          slug,
          description,
          category,
          price,
          original_price,
          power_level,
          image,
          gallery,
          in_stock,
          stock,
          featured,
          tags,
          specifications,
          created_at,
          updated_at
        FROM products 
        WHERE featured = 1
        ORDER BY created_at DESC
      `;
      const [results] = await pool.execute(query);
      const parsed = results.map(parseProductFields);
      if ((!parsed || parsed.length === 0)) {
        try {
          const [legacy] = await pool.execute(query.replace(/capsule_products/g, 'products'));
          if (legacy && legacy.length) return legacy.map(parseProductFields);
        } catch (e) {}
      }
      return parsed;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
}

module.exports = ProductModel;

// Assign static aliases and methods after class definition and export
ProductModel.remove = ProductModel.delete;
ProductModel.removeImage = async function(id, imageUrl) {
  try {
    const pool = dbConnection.getPool();
    // Get current gallery
  const [results] = await pool.execute('SELECT gallery FROM products WHERE id = ?', [id]);
    if (!results.length) throw new Error('Product not found');
    let gallery = results[0].gallery;
    if (typeof gallery === 'string') gallery = JSON.parse(gallery);
    if (!Array.isArray(gallery)) gallery = [];
    gallery = gallery.filter(url => url !== imageUrl);
  await pool.execute('UPDATE products SET gallery = ? WHERE id = ?', [JSON.stringify(gallery), id]);
    return true;
  } catch (error) {
    console.error('Error removing image from gallery:', error);
    throw error;
  }
};

// Assign static aliases and methods after class definition and export
ProductModel.remove = ProductModel.delete;
ProductModel.removeImage = async function(id, imageUrl) {
  try {
    const pool = dbConnection.getPool();
    // Get current gallery
    const [results] = await pool.execute('SELECT gallery FROM capsule_products WHERE id = ?', [id]);
    if (!results.length) throw new Error('Product not found');
    let gallery = results[0].gallery;
    if (typeof gallery === 'string') gallery = JSON.parse(gallery);
    if (!Array.isArray(gallery)) gallery = [];
    gallery = gallery.filter(url => url !== imageUrl);
    await pool.execute('UPDATE capsule_products SET gallery = ? WHERE id = ?', [JSON.stringify(gallery), id]);
    return true;
  } catch (error) {
    console.error('Error removing image from gallery:', error);
    throw error;
  }
};