// Simple mock products for SAFE_MODE operation (no database required)
// Keep minimal fields used by frontend: id, name, price, image, slug, category, featured

const mockProducts = [
  {
    id: 1,
    name: 'Saiyan Battle Armor',
    price: 199.99,
  image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    slug: 'saiyan-battle-armor',
    category: 'Battle Gear',
    featured: true
  },
  {
    id: 2,
    name: 'Capsule Housing Unit',
    price: 499.0,
  image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    slug: 'capsule-housing-unit',
    category: 'Capsules',
    featured: true
  },
  {
    id: 3,
    name: 'Gravity Training Capsule',
    price: 899.5,
  image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    slug: 'gravity-training-capsule',
    category: 'Training',
    featured: false
  },
  {
    id: 4,
    name: 'Senzu Bean Pack (10)',
    price: 59.99,
  image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    slug: 'senzu-bean-pack-10',
    category: 'Technology',
    featured: false
  }
];

module.exports = mockProducts;
