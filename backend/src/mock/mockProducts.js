// Simple mock products for SAFE_MODE operation (no database required)
// Keep minimal fields used by frontend: id, name, price, image, slug, category, featured

const mockProducts = [
  {
    id: 1,
    name: 'Saiyan Battle Armor',
    price: 199.99,
    image: 'https://via.placeholder.com/300x300?text=Armor',
    slug: 'saiyan-battle-armor',
    category: 'Battle Gear',
    featured: true
  },
  {
    id: 2,
    name: 'Capsule Housing Unit',
    price: 499.0,
    image: 'https://via.placeholder.com/300x300?text=Capsule+House',
    slug: 'capsule-housing-unit',
    category: 'Capsules',
    featured: true
  },
  {
    id: 3,
    name: 'Gravity Training Capsule',
    price: 899.5,
    image: 'https://via.placeholder.com/300x300?text=Gravity+Room',
    slug: 'gravity-training-capsule',
    category: 'Training',
    featured: false
  },
  {
    id: 4,
    name: 'Senzu Bean Pack (10)',
    price: 59.99,
    image: 'https://via.placeholder.com/300x300?text=Senzu+Beans',
    slug: 'senzu-bean-pack-10',
    category: 'Technology',
    featured: false
  }
];

module.exports = mockProducts;
