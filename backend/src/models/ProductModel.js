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
        FROM capsule_products 
        ORDER BY created_at DESC
      `;
      
      const [results] = await pool.execute(query);
      
      // Parse JSON fields
      return results.map(product => ({
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      }));
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
        FROM capsule_products 
        WHERE id = ?
      `;
      
      const [results] = await pool.execute(query, [id]);
      
      if (results.length === 0) {
        return null;
      }
      
      const product = results[0];
      
      // Parse JSON fields
      return {
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      };
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
        FROM capsule_products 
        WHERE slug = ?
      `;
      
      const [results] = await pool.execute(query, [slug]);
      
      if (results.length === 0) {
        return null;
      }
      
      const product = results[0];
      
      // Parse JSON fields
      return {
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      };
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
        FROM capsule_products 
        WHERE category = ?
        ORDER BY created_at DESC
      `;
      
      const [results] = await pool.execute(query, [category]);
      
      // Parse JSON fields
      return results.map(product => ({
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      }));
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
        FROM capsule_products 
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
      
      // Parse JSON fields
      return results.map(product => ({
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  static async create(productData) {
    try {
      const pool = dbConnection.getPool();
      const {
        name,
        slug,
        description,
        category,
        price,
        original_price,
        power_level,
        image,
        gallery = [],
        in_stock = true,
        stock = 0,
        featured = false,
        tags = [],
        specifications = {}
      } = productData;

      const query = `
        INSERT INTO capsule_products (
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
        in_stock ? 1 : 0,
        stock,
        featured ? 1 : 0,
        JSON.stringify(tags),
        JSON.stringify(specifications)
      ];

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
      const {
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
        specifications
      } = productData;

      const query = `
        UPDATE capsule_products SET
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
        JSON.stringify(gallery || []),
        in_stock ? 1 : 0,
        stock,
        featured ? 1 : 0,
        JSON.stringify(tags || []),
        JSON.stringify(specifications || {}),
        id
      ];

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
      const query = 'DELETE FROM capsule_products WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
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
        FROM capsule_products 
        WHERE featured = 1
        ORDER BY created_at DESC
      `;
      
      const [results] = await pool.execute(query);
      
      // Parse JSON fields
      return results.map(product => ({
        ...product,
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        in_stock: Boolean(product.in_stock),
        featured: Boolean(product.featured)
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
}

module.exports = ProductModel;