// Product data for Capsule Corp store
// Synced with database products
import { CLOUDINARY_BASE } from '../utils/images';

export const allProducts = [
  {
    id: 80,
    name: "Hyperbolic Time Chamber Pass",
    slug: "hyperbolic-time-chamber-pass",
    description: "Exclusive pass granting access to the legendary Hyperbolic Time Chamber for advanced training.",
    category: "Training",
    price: 999.99,
    originalPrice: 1299.99,
    powerLevel: 10000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg","https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png"],
    inStock: true,
    stock: 50,
    featured: true,
    tags: ["ADVANCED TRAINING","LIMITED ACCESS"],
    specifications: {
          "duration": "1 year",
          "location": "Capsule Corp HQ"
    }
  },
  {
    id: 26,
    name: "Dragon Radar Mark VII",
    slug: "dragon-radar-mark-vii",
    description: "Latest model of the legendary Dragon Radar. Enhanced range and precision.",
    category: "Technology",
    price: 899.99,
    originalPrice: 1299.99,
    powerLevel: 5000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg"],
    inStock: true,
    stock: 8,
    featured: true,
    tags: ["BULMA DESIGNED","QUANTUM ENHANCED"],
    specifications: {
          "range": "Global",
          "battery": "Solar powered"
    }
  },
  {
    id: 27,
    name: "Gravity Chamber (Personal)",
    slug: "gravity-chamber-personal",
    description: "Train like Vegeta with this personal gravity chamber. Adjustable up to 500x Earth gravity.",
    category: "Training",
    price: 15999.99,
    originalPrice: 19999.99,
    powerLevel: 8500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg"],
    inStock: true,
    stock: 25,
    featured: true,
    tags: ["VEGETA APPROVED","EXTREME TRAINING"],
    specifications: {
          "size": "10m x 10m x 10m",
          "power": "Fusion reactor"
    }
  },
  {
    id: 28,
    name: "Senzu Bean Pack (12 count)",
    slug: "senzu-bean-pack",
    description: "Mystical beans that restore energy and health instantly. Pack of 12.",
    category: "Consumables",
    price: 249.99,
    originalPrice: 299.99,
    powerLevel: 0,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg"],
    inStock: true,
    stock: 25,
    featured: true,
    tags: ["KORIN GROWN","INSTANT HEALING"],
    specifications: {
          "count": "12",
          "expiry": "Never expires"
    }
  },
  {
    id: 29,
    name: "Power Scouter Elite",
    slug: "power-scouter-elite",
    description: "Advanced combat scouter with holographic display and encrypted comms.",
    category: "Technology",
    price: 599.99,
    originalPrice: 799.99,
    powerLevel: 1500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg"],
    inStock: true,
    stock: 20,
    featured: true,
    tags: ["FRIEZA TECH","COMBAT READY"],
    specifications: {
          "range": "10km",
          "features": "Voice command"
    }
  },
  {
    id: 30,
    name: "Weighted Training Clothes",
    slug: "weighted-training-clothes",
    description: "Ultra-heavy training outfit for serious martial artists. Adjustable weights.",
    category: "Training",
    price: 499.99,
    originalPrice: 499.99,
    powerLevel: 2000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg"],
    inStock: true,
    stock: 18,
    featured: true,
    tags: ["TURTLE HERMIT","STRENGTH TRAINING"],
    specifications: {
          "sizes": "S-XXXL",
          "comfort": "Breathable"
    }
  },
  {
    id: 31,
    name: "Flying Nimbus Cloud",
    slug: "flying-nimbus-cloud",
    description: "Magical flying cloud that only the pure of heart can ride. Includes cloud care kit.",
    category: "Transportation",
    price: 2999.99,
    originalPrice: 3999.99,
    powerLevel: 1000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699245/nimb_rbgqmo.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699245/nimb_rbgqmo.jpg","https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699421/nimb3_vqyt06.jpg"],
    inStock: true,
    stock: 10,
    featured: true,
    tags: ["PURE HEART ONLY","ECO FRIENDLY"],
    specifications: {
          "fuel": "None required",
          "speed": "Mach 1.5"
    }
  },
  {
    id: 32,
    name: "Kaio-ken Training Manual",
    slug: "kaio-ken-training-manual",
    description: "Comprehensive guide to the Kaio-ken technique. Includes training schedule and safety tips.",
    category: "Training",
    price: 149.99,
    originalPrice: 199.99,
    powerLevel: 500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700988/Firefly__-Photorealistic_image_of_an_advanced_Kaio-ken_training_manual_projecting_a_glowing_r_64817_trah8h.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700988/Firefly__-Photorealistic_image_of_an_advanced_Kaio-ken_training_manual_projecting_a_glowing_r_64817_trah8h.jpg"],
    inStock: true,
    stock: 30,
    featured: true,
    tags: ["KING KAI APPROVED","ADVANCED TECHNIQUE"],
    specifications: {
          "pages": "50",
          "safety": "High risk warning"
    }
  },
  {
    id: 33,
    name: "Capsule Corp Motorcycle",
    slug: "capsule-corp-motorcycle",
    description: "High-speed motorcycle with Capsule Corp engineering. Electric engine, GPS, and anti-theft.",
    category: "Vehicles",
    price: 4999.99,
    originalPrice: 5999.99,
    powerLevel: 1200,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1761684146/superojo420_CAPSULE_CORP_Motorcycle_from_dragon_ball_z_with_High-TECH_enginee_67c32a5c-f67d-4b10-ab49-e243258b9003_vsw6qy.png",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1761684146/superojo420_CAPSULE_CORP_Motorcycle_from_dragon_ball_z_with_High-TECH_enginee_67c32a5c-f67d-4b10-ab49-e243258b9003_vsw6qy.png"],
    inStock: true,
    stock: 5,
    featured: true,
    tags: ["TURBO BOOST","GPS"],
    specifications: {
          "engine": "Electric",
          "features": "Turbo boost, GPS, anti-theft"
    }
  },
  {
    id: 34,
    name: "Capsule Corp Jet",
    slug: "capsule-corp-jet",
    description: "Personal jet for fast travel. Stealth mode, autopilot, luxury seating.",
    category: "Vehicles",
    price: 29999.99,
    originalPrice: 34999.99,
    powerLevel: 3000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1761661022/Unoriginal_Entertainer_A_medium_sized_Personal_jet_for_fast_travel._Stealth_mode__autopi_8f4c07f0-a326-450c-839a-63d2eb002510_rvwgno.png",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1761661022/Unoriginal_Entertainer_A_medium_sized_Personal_jet_for_fast_travel._Stealth_mode__autopi_8f4c07f0-a326-450c-839a-63d2eb002510_rvwgno.png"],
    inStock: true,
    stock: 2,
    featured: true,
    tags: ["STEALTH MODE","AUTOPILOT"],
    specifications: {
          "engine": "Fusion",
          "features": "Stealth, autopilot, luxury seating"
    }
  },
  {
    id: 35,
    name: "Capsule Corp Boat",
    slug: "capsule-corp-boat",
    description: "Luxury boat with Capsule Corp tech. Solar powered, party mode, GPS.",
    category: "Vehicles",
    price: 7999.99,
    originalPrice: 11999.99,
    powerLevel: 1500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1761660516/Unoriginal_Entertainer_A_Luxury_boat_with_Capsule_Corp_tech_for_dragon_ball_z_._Solar_po_e822bab0-1f3f-419d-988e-67fa98f7f7c9_1_d1gzqz.png",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1761660516/Unoriginal_Entertainer_A_Luxury_boat_with_Capsule_Corp_tech_for_dragon_ball_z_._Solar_po_e822bab0-1f3f-419d-988e-67fa98f7f7c9_1_d1gzqz.png"],
    inStock: true,
    stock: 6,
    featured: true,
    tags: ["SOLAR POWER","PARTY MODE"],
    specifications: {
          "engine": "Solar",
          "features": "Auto-pilot, party mode, GPS"
    }
  },
  {
    id: 36,
    name: "Vehicle Capsule Set",
    slug: "vehicle-capsule-set",
    description: "Collection of 5 vehicle capsules. Includes car, bike, boat, jet, and ATV.",
    category: "Capsules",
    price: 11999.99,
    originalPrice: 19999.99,
    powerLevel: 3500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png"],
    inStock: true,
    stock: 5,
    featured: true,
    tags: ["COMPLETE SET","ALL TERRAIN"],
    specifications: {
          "capsule energy": "Special",
          "license": "Universal"
    }
  },
  {
    id: 37,
    name: "Camping Capsule Deluxe",
    slug: "camping-capsule-deluxe",
    description: "Ultimate camping solution. Includes tent, kitchen, shower, and generator.",
    category: "Capsules",
    price: 1499.99,
    originalPrice: 1999.99,
    powerLevel: 1200,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697460/the_one_cap3_qjt0dq.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697460/the_one_cap3_qjt0dq.jpg"],
    inStock: true,
    stock: 15,
    featured: true,
    tags: ["OUTDOOR ADVENTURE","SURVIVAL READY"],
    specifications: {
          "setup": "Instant",
          "weight": "0.5kg capsule"
    }
  },
  {
    id: 38,
    name: "Workshop Capsule",
    slug: "workshop-capsule",
    description: "Portable workshop with all tools included. 20 sqm workspace, solar powered.",
    category: "Capsules",
    price: 3299.99,
    originalPrice: 4299.99,
    powerLevel: 1800,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700646/Firefly__-Photorealistic_extreme_close-up_of_a_single_Capsule_Corporation_house_capsule._The_592405_-_REF_axvghb.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700646/Firefly__-Photorealistic_extreme_close-up_of_a_single_Capsule_Corporation_house_capsule._The_592405_-_REF_axvghb.jpg"],
    inStock: true,
    stock: 10,
    featured: true,
    tags: ["MECHANIC READY","COMPLETE TOOLS"],
    specifications: {
          "size": "20 sqm workshop",
          "power": "Solar powered"
    }
  },
  {
    id: 39,
    name: "Restaurant Capsule",
    slug: "restaurant-capsule",
    description: "Fully equipped restaurant in a capsule. Fine dining, robot chefs, multi-cultural cuisine.",
    category: "Capsules",
    price: 12999.99,
    originalPrice: 19999.99,
    powerLevel: 4200,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697463/the_one_cap4_gwlqiz.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697463/the_one_cap4_gwlqiz.jpg"],
    inStock: true,
    stock: 6,
    featured: true,
    tags: ["FINE DINING","ROBOT STAFF"],
    specifications: {
          "cuisine": "Multi-cultural",
          "hygiene": "Auto-sanitize"
    }
  },
  {
    id: 20,
    name: "House Capsule Pro",
    slug: "house-capsule-pro",
    description: "Portable house that expands instantly. 3 bedrooms, warranty included.",
    category: "Capsules",
    price: 4999.99,
    originalPrice: 5999.99,
    powerLevel: 2500,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg"],
    inStock: true,
    stock: 8,
    featured: true,
    tags: ["INSTANT HOME","CAPSULE TECH"],
    specifications: {
          "rooms": "3 bedrooms",
          "warranty": "15 years"
    }
  },
  {
    id: 21,
    name: "Laboratory Capsule",
    slug: "laboratory-capsule",
    description: "Portable scientific laboratory. Quantum storage, fusion reactor, safety certified.",
    category: "Capsules",
    price: 7499.99,
    originalPrice: 9999.99,
    powerLevel: 3800,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg"],
    inStock: true,
    stock: 6,
    featured: true,
    tags: ["RESEARCH GRADE","SAFETY CERTIFIED"],
    specifications: {
          "data": "Quantum storage",
          "power": "Fusion reactor",
          "safety": "Level 4 containment"
    }
  },
  {
    id: 19,
    name: "Potara Earrings",
    slug: "potara-earrings",
    description: "Legendary fusion earrings. Grants fusion ability when worn by two people.",
    category: "Accessories",
    price: 499.99,
    originalPrice: 599.99,
    powerLevel: 0,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg"],
    inStock: true,
    stock: 50,
    featured: true,
    tags: ["FUSION ITEM","LEGENDARY"],
    specifications: {
          "material": "Mystic gold",
          "origin": "Supreme Kai"
    }
  },
  {
    id: 1,
    name: "Saiyan Battle Armor",
    slug: "saiyan-battle-armor",
    description: "Advanced light-weight Saiyan armor produced by Capsule Corp. Reinforced plating and adaptive fit.",
    category: "Battle Gear",
    price: 299,
    originalPrice: 399,
    powerLevel: 9000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg"],
    inStock: true,
    stock: 15,
    featured: true,
    tags: ["KAMEHAMEHA TESTED","SAIYAN APPROVED"],
    specifications: {
          "weight": "2.5 kg",
          "defense": "9000+",
          "material": "Saiyan Steel"
    }
  },
  {
    id: 3,
    name: "Elite Scouter",
    slug: "elite-scouter",
    description: "Scouter with real-time analysis, long-range detection, and tamper-proof shell.",
    category: "Technology",
    price: 599.99,
    originalPrice: 799.99,
    powerLevel: 5000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg"],
    inStock: true,
    stock: 8,
    featured: true,
    tags: ["BULMA DESIGNED","QUANTUM ENHANCED"],
    specifications: {
          "range": "Global",
          "battery": "Solar powered"
    }
  }
];

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
