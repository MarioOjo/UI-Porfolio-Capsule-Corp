// Product data for Capsule Corp store
export const featuredProducts = [
  {
    id: 1,
    name: "Saiyan Battle Armor",
    slug: "saiyan-battle-armor",
    description: "Elite battle armor worn by the legendary Saiyan warriors. Provides exceptional protection while maintaining flexibility for high-speed combat.",
    category: "Battle Gear",
    price: 299.00,
    originalPrice: 399.00,
    powerLevel: 9000,
    image: "/api/placeholder/400/400",
    gallery: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/300",
      "/api/placeholder/400/350"
    ],
    inStock: true,
    stock: 15,
    featured: true,
    tags: ["KAMEHAMEHA TESTED", "SAIYAN APPROVED"],
    specifications: {
      "Material": "Ultra-light Saiyan Composite",
      "Defense Rating": "9000 PL",
      "Weight": "2.5 kg",
      "Size Range": "XS - XXXL",
      "Special Features": "Self-repairing nano-fibers"
    }
  },
  {
    id: 2,
    name: "Gravity Chamber",
    slug: "gravity-chamber",
    description: "Advanced training facility capable of generating up to 500x Earth's gravity. Perfect for intensive Saiyan training regimens.",
    category: "Training",
    price: 15999.00,
    powerLevel: 50000,
    image: "/api/placeholder/400/400",
    gallery: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/300",
      "/api/placeholder/400/350"
    ],
    inStock: true,
    stock: 2,
    featured: true,
    tags: ["OVER 9000!", "LEGENDARY"],
    specifications: {
      "Max Gravity": "500x Earth Gravity",
      "Power Consumption": "50,000 kW",
      "Dimensions": "10m x 10m x 10m",
      "Safety Rating": "Saiyan Elite",
      "Warranty": "10 years Capsule Corp"
    }
  },
  {
    id: 3,
    name: "Elite Scouter",
    slug: "elite-scouter",
    description: "State-of-the-art power level detection device with enhanced range and accuracy. Features real-time battle analysis.",
    category: "Tech",
    price: 1299.00,
    powerLevel: 1000000,
    image: "/api/placeholder/400/400",
    gallery: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/300",
      "/api/placeholder/400/350"
    ],
    inStock: true,
    stock: 25,
    featured: true,
    tags: ["TECH ADVANCED", "BATTLE READY"],
    specifications: {
      "Detection Range": "1,000,000 PL",
      "Accuracy": "99.9%",
      "Battery Life": "72 hours continuous",
      "Communication Range": "500 km",
      "Special Features": "Explosion-resistant housing"
    }
  }
];

export const allProducts = [
  ...featuredProducts,
  {
    id: 4,
    name: "Senzu Beans (3-Pack)",
    slug: "senzu-beans-3-pack",
    description: "Magical healing beans that restore health and energy instantly. Essential for any serious warrior.",
    category: "Consumables",
    price: 999.00,
    powerLevel: 8000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 50,
    featured: false,
    tags: ["HEALING", "RARE"],
    specifications: {
      "Quantity": "3 beans per pack",
      "Effect": "Full health restoration",
      "Shelf Life": "Indefinite",
      "Origin": "Korin's Tower",
      "Rarity": "Extremely Rare"
    }
  },
  {
    id: 5,
    name: "Dragon Radar",
    slug: "dragon-radar",
    description: "Capsule Corp's famous Dragon Ball detection device. Locate all seven Dragon Balls with pinpoint accuracy.",
    category: "Tech",
    price: 2499.00,
    powerLevel: 5000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 8,
    featured: false,
    tags: ["LEGENDARY", "BULMA DESIGNED"],
    specifications: {
      "Detection Range": "Global",
      "Accuracy": "1m precision",
      "Power Source": "Capsule Battery",
      "Display": "3D Holographic",
      "Creator": "Dr. Brief"
    }
  },
  {
    id: 6,
    name: "Weighted Training Gi",
    slug: "weighted-training-gi",
    description: "Ultra-heavy training clothing designed to increase strength and speed through constant resistance training.",
    category: "Training",
    price: 599.00,
    powerLevel: 3500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 30,
    featured: false,
    tags: ["TRAINING", "HEAVY"],
    specifications: {
      "Weight": "100kg base weight",
      "Material": "Reinforced Earth Cotton",
      "Adjustability": "10kg - 500kg",
      "Durability": "Battle-tested",
      "Sizes": "All Saiyan sizes"
    }
  },
  {
    id: 7,
    name: "Capsule Container Set",
    slug: "capsule-container-set",
    description: "Standard Capsule Corp storage containers. Store anything from vehicles to entire buildings!",
    category: "Tech",
    price: 199.00,
    powerLevel: 1000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 100,
    featured: false,
    tags: ["STORAGE", "CONVENIENT"],
    specifications: {
      "Capacity": "Variable (up to house-sized)",
      "Quantity": "12 capsules",
      "Activation": "Push-button release",
      "Technology": "Hoi-Poi Capsule Tech",
      "Colors": "Assorted"
    }
  },
  {
    id: 8,
    name: "Power Pole",
    slug: "power-pole",
    description: "Legendary extending staff with unlimited reach. Perfect for reaching high places or combat situations.",
    category: "Battle Gear",
    price: 799.00,
    powerLevel: 6500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: false,
    stock: 0,
    featured: false,
    tags: ["LEGENDARY", "UNIQUE"],
    specifications: {
      "Length": "Extends infinitely",
      "Material": "Sacred Wood",
      "Weight": "Varies with length",
      "Origin": "Korin's Tower",
      "Status": "One of a kind"
    }
  },
  {
    id: 9,
    name: "Saiyan Pod",
    slug: "saiyan-pod",
    description: "Authentic Saiyan space travel pod. Features life support, navigation, and defensive capabilities.",
    category: "Tech",
    price: 49999.00,
    powerLevel: 25000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 1,
    featured: false,
    tags: ["SPACE TRAVEL", "LAST ONE"],
    specifications: {
      "Max Speed": "Light speed capable",
      "Range": "Intergalactic",
      "Occupancy": "1 Saiyan",
      "Defense": "Meteor-resistant hull",
      "Fuel": "Energy core (included)"
    }
  }
];

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
  return allProducts.filter(product => product.featured);
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