const fs = require('fs');
const path = require('path');

// Read database products
const dbProducts = JSON.parse(fs.readFileSync('database_products.json', 'utf8'));

// Generate JS file content
const header = `// Product data for Capsule Corp store
// Synced with database products
import { CLOUDINARY_BASE } from '../utils/images';

export const allProducts = [`;

const footer = `];

// Featured products are those with featured: true
export const featuredProducts = allProducts.filter(product => product.featured);

export const getProductById = (id) => {
  return allProducts.find(product => product.id === parseInt(id));
};

export const getProductBySlug = (slug) => {
  return allProducts.find(product => product.slug === slug);
};

export const getProductsByCategory = (category) => {
  return allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedProducts = () => {
  return featuredProducts;
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Alias for compatibility
export const products = allProducts;
`;

// Convert database products to JS format
const productsJS = dbProducts.products.map((p, index) => {
  // Parse JSON strings
  const gallery = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : (p.gallery || [p.image]);
  const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []);
  const specs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : (p.specifications || {});
  
  return `  {
    id: ${p.id},
    name: "${p.name}",
    slug: "${p.slug}",
    description: "${p.description.replace(/"/g, '\\"')}",
    category: "${p.category}",
    price: ${parseFloat(p.price)},
    ${p.original_price ? `originalPrice: ${parseFloat(p.original_price)},\n    ` : ''}powerLevel: ${p.power_level || 0},
    image: "${p.image}",
    gallery: ${JSON.stringify(gallery)},
    inStock: ${p.in_stock},
    stock: ${p.stock},
    featured: ${p.featured},
    tags: ${JSON.stringify(tags)},
    specifications: ${JSON.stringify(specs, null, 6).replace(/\n/g, '\n    ')}
  }`;
}).join(',\n');

// Write the file
const fullContent = header + '\n' + productsJS + '\n' + footer;
fs.writeFileSync('frontend/src/data/products.js', fullContent, 'utf8');

console.log(`✅ Generated products.js with ${dbProducts.products.Count} products!`);
console.log('File: frontend/src/data/products.js');
