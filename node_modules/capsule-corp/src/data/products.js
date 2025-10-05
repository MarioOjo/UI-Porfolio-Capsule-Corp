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
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg",
    gallery: [
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/c2_zaswlx.jpg"
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
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg"],
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
    name: "Potara Earrings",
    slug: "potara-earrings",
    description: "Ancient mystical artifacts used by the Supreme Kais. When two warriors each wear one earring, they undergo the perfect Metamoran Fusion, combining their power, skills, and knowledge into a single ultimate fighter. Features elegant gold plating and emerald-green gemstones that glow when fusion is activated.",
    category: "Battle Gear",
    price: 999.00,
    originalPrice: 1499.00,
    powerLevel: "Incalculable",
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg",
    gallery: [
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_glowing.jpg",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_macro.jpg"
    ],
    inStock: true,
    stock: 5,
    featured: true,
    tags: ["FUSION", "POTARA", "LEGENDARY"],
    specifications: {
      "Effect": "Perfect Metamoran Fusion",
      "Material": "Gold plating with emerald gemstones",
      "Compatibility": "Any two beings",
      "Rarity": "Extremely rare artifact",
      "Special Feature": "Perfect Fusion"
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg"],
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
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
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
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
  },
  // CAPSULE PRODUCTS
  {
    id: 10,
    name: "Vehicle Capsule - Flying Car",
    slug: "vehicle-capsule-flying-car",
    description: "Compact capsule containing a fully functional flying car. Perfect for quick transportation across West City.",
    category: "Capsules",
    price: 5999.00,
    powerLevel: 2500,
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
    inStock: true,
    stock: 12,
    featured: false,
    tags: ["TRANSPORT", "FLYING"],
    specifications: {
      "Vehicle Type": "2-seat Flying Car",
      "Max Speed": "300 km/h",
      "Fuel Type": "Capsule Energy Cell",
      "Range": "500 km per charge",
      "Special Features": "Auto-pilot, GPS"
    }
  },
  {
    id: 11,
    name: "House Capsule - Deluxe",
    slug: "house-capsule-deluxe",
    description: "Luxurious portable home in a capsule. Features 3 bedrooms, kitchen, and full amenities. Perfect for adventures!",
    category: "Capsules",
    price: 12999.00,
    powerLevel: 1500,
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
    inStock: true,
    stock: 5,
    featured: true,
    tags: ["HOME", "LUXURY"],
    specifications: {
      "Rooms": "3 bedrooms, 2 bathrooms",
      "Amenities": "Full kitchen, AC, WiFi",
      "Size": "150 sqm when deployed",
      "Setup Time": "30 seconds",
      "Power": "Solar + backup generator"
    }
  },
  {
    id: 12,
    name: "Motorcycle Capsule",
    slug: "motorcycle-capsule",
    description: "High-performance motorcycle stored in a convenient capsule. Zero to 100 in 2.5 seconds!",
    category: "Capsules",
    price: 2999.00,
    powerLevel: 3000,
  image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg",
  gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"],
    inStock: true,
    stock: 20,
    featured: false,
    tags: ["SPEED", "TRANSPORT"],
    specifications: {
      "Engine": "1200cc Capsule Motor",
      "Top Speed": "250 km/h",
      "Acceleration": "0-100 in 2.5s",
      "Fuel Efficiency": "Electric drive",
      "Special": "Anti-gravity stabilizers"
    }
  },
  {
    id: 13,
    name: "Camping Capsule Set",
    slug: "camping-capsule-set",
    description: "Complete camping setup in capsules. Includes tent, cooking equipment, and outdoor furniture.",
    category: "Capsules",
    price: 899.00,
    powerLevel: 500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 35,
    featured: false,
    tags: ["CAMPING", "OUTDOOR"],
    specifications: {
      "Includes": "Tent, chairs, table, stove",
      "Capacity": "4-person camping setup",
      "Weather Rating": "All-season",
      "Setup Time": "5 minutes total",
      "Weight": "2kg (all capsules)"
    }
  },
  {
    id: 14,
    name: "Boat Capsule - Speedboat",
    slug: "boat-capsule-speedboat",
    description: "High-speed boat capsule for water adventures. Hydrofoil technology for maximum performance.",
    category: "Capsules",
    price: 8999.00,
    powerLevel: 4000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 8,
    featured: false,
    tags: ["WATER", "SPEED"],
    specifications: {
      "Boat Type": "6-seat Speedboat",
      "Max Speed": "120 knots",
      "Length": "8 meters",
      "Features": "Hydrofoil, GPS, sonar",
      "Fuel": "Capsule marine engine"
    }
  },
  {
    id: 15,
    name: "Workshop Capsule",
    slug: "workshop-capsule",
    description: "Fully equipped mobile workshop. Contains all tools and equipment for mechanical repairs and inventions.",
    category: "Capsules",
    price: 15999.00,
    powerLevel: 2000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 3,
    featured: false,
    tags: ["WORKSHOP", "TOOLS"],
    specifications: {
      "Equipment": "Full tool set, 3D printer",
      "Power Tools": "Industrial grade",
      "Size": "20m x 15m workshop",
      "Special": "Holographic blueprints",
      "Power": "Fusion generator"
    }
  },
  // TRAINING PRODUCTS
  {
    id: 16,
    name: "Training Weights Set",
    slug: "training-weights-set",
    description: "Adjustable training weights used by legendary warriors. Can be set from 50kg to 1000kg per piece.",
    category: "Training",
    price: 1299.00,
    powerLevel: 5000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 25,
    featured: false,
    tags: ["STRENGTH", "ADJUSTABLE"],
    specifications: {
      "Weight Range": "50kg - 1000kg each",
      "Pieces": "Wrist, ankle weights (4 total)",
      "Material": "Dense metal composite",
      "Adjustment": "Mental control system",
      "Compatibility": "All species"
    }
  },
  {
    id: 17,
    name: "Hyperbolic Time Chamber Pass",
    slug: "hyperbolic-time-chamber-pass",
    description: "24-hour access pass to the legendary training dimension. 1 day = 1 year of training time!",
    category: "Training",
    price: 99999.00,
    powerLevel: 100000,
    // Testing image provided by user
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png",
    gallery: [
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg"
    ],
    inStock: true,
    stock: 2,
    featured: true,
    tags: ["TIME", "LEGENDARY"],
    specifications: {
      "Time Ratio": "1 day = 1 year training",
      "Capacity": "2 people maximum",
      "Environment": "Extreme conditions",
      "Gravity": "10x Earth gravity",
      "Warning": "Extremely dangerous"
    }
  },
  {
    id: 18,
    name: "Ki Training Orbs",
    slug: "ki-training-orbs",
    description: "Energy-responsive training orbs that help develop ki control and energy manipulation skills.",
    category: "Training",
    price: 799.00,
    powerLevel: 2500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 40,
    featured: false,
    tags: ["KI", "ENERGY"],
    specifications: {
      "Quantity": "Set of 12 orbs",
      "Response Type": "Ki-reactive",
      "Difficulty Levels": "Beginner to Master",
      "Material": "Energy crystal core",
      "Training Modes": "5 different modes"
    }
  },
  {
    id: 19,
    name: "Meditation Platform",
    slug: "meditation-platform",
    description: "Floating meditation platform that enhances mental training and ki focus. Used by masters across the universe.",
    category: "Training",
    price: 3999.00,
    powerLevel: 7500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 10,
    featured: false,
    tags: ["MEDITATION", "FLOATING"],
    specifications: {
      "Height": "Adjustable (1-50 meters)",
      "Material": "Anti-gravity stone",
      "Capacity": "2 people",
      "Power Source": "Natural ki absorption",
      "Stability": "Perfect balance system"
    }
  },
  {
    id: 20,
    name: "Power Level Analyzer",
    slug: "power-level-analyzer",
    description: "Advanced training device that measures and tracks your power level growth over time. Motivational progress tracking!",
    category: "Training",
    price: 1899.00,
    powerLevel: 8000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 15,
    featured: false,
    tags: ["ANALYSIS", "PROGRESS"],
    specifications: {
      "Max Reading": "10 million power level",
      "Accuracy": "99.99%",
      "Features": "Growth tracking, goals",
      "Display": "Holographic readout",
      "Data Storage": "Unlimited history"
    }
  },
  {
    id: 21,
    name: "Sparring Android",
    slug: "sparring-android",
    description: "AI-powered training android with adjustable difficulty. Perfect sparring partner that adapts to your level.",
    category: "Training",
    price: 25999.00,
    powerLevel: 15000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 4,
    featured: true,
    tags: ["AI", "SPARRING"],
    specifications: {
      "Power Range": "100 - 50,000 PL",
      "Combat Styles": "200+ martial arts",
      "Durability": "Battle-hardened frame",
      "Learning": "Adaptive AI system",
      "Safety": "Emergency shut-off"
    }
  },
  {
    id: 22,
    name: "Recovery Tank (Mini)",
    slug: "recovery-tank-mini",
    description: "Personal healing tank for post-training recovery. Accelerated healing with medical-grade fluids.",
    category: "Training",
    price: 8999.00,
    powerLevel: 3000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 6,
    featured: false,
    tags: ["HEALING", "RECOVERY"],
    specifications: {
      "Capacity": "Single person",
      "Healing Rate": "10x natural healing",
      "Fluid Type": "Bio-enhancement serum",
      "Treatment Time": "1-8 hours",
      "Size": "2m x 1m x 1m"
    }
  },
  // BATTLE GEAR PRODUCTS
  {
    id: 23,
    name: "Elite Battle Armor Mk II",
    slug: "elite-battle-armor-mk2",
    description: "Advanced evolution of Saiyan battle armor with enhanced protection and mobility systems. Perfect for elite warriors.",
    category: "Battle Gear",
    price: 2499.00,
    powerLevel: 15000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 8,
    featured: true,
    tags: ["ARMOR", "ELITE"],
    specifications: {
      "Defense Rating": "15,000 PL",
      "Material": "Reinforced Saiyan Composite",
      "Weight": "3.2 kg",
      "Special Features": "Energy absorption, self-repair",
      "Mobility": "Zero movement restriction"
    }
  },
  {
    id: 24,
    name: "Energy Blade",
    slug: "energy-blade",
    description: "Plasma-forged weapon capable of cutting through most materials. Adjustable energy output for training or combat.",
    category: "Battle Gear",
    price: 1899.00,
    powerLevel: 12000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 15,
    featured: false,
    tags: ["WEAPON", "ENERGY"],
    specifications: {
      "Blade Length": "Variable (0.5m - 2m)",
      "Energy Source": "Ki crystal core",
      "Cutting Power": "Molecular level",
      "Battery Life": "48 hours continuous",
      "Safety Lock": "Biometric activation"
    }
  },
  {
    id: 25,
    name: "Battle Gloves Pro",
    slug: "battle-gloves-pro",
    description: "Professional combat gloves with ki amplification technology. Increases punch power and energy attacks.",
    category: "Battle Gear",
    price: 699.00,
    powerLevel: 4500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 30,
    featured: false,
    tags: ["GLOVES", "KI BOOST"],
    specifications: {
      "Ki Amplification": "25% increase",
      "Material": "Flexible nano-armor",
      "Grip Enhancement": "Molecular adhesion",
      "Impact Resistance": "50,000 Newtons",
      "Sizes": "XS to XXXL"
    }
  },
  {
    id: 26,
    name: "Combat Boots Alpha",
    slug: "combat-boots-alpha",
    description: "Military-grade combat boots with anti-gravity assist and shock absorption. Built for the toughest battles.",
    category: "Battle Gear",
    price: 599.00,
    powerLevel: 3500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 25,
    featured: false,
    tags: ["BOOTS", "MOBILITY"],
    specifications: {
      "Anti-Gravity": "Hover up to 2m",
      "Shock Absorption": "99% impact reduction",
      "Speed Boost": "30% movement increase",
      "Durability": "Battle-tested titanium",
      "Comfort": "Memory foam interior"
    }
  },
  {
    id: 27,
    name: "Energy Shield Generator",
    slug: "energy-shield-generator",
    description: "Portable energy barrier system. Creates impenetrable shields to block attacks and projectiles.",
    category: "Battle Gear",
    price: 3499.00,
    powerLevel: 18000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 10,
    featured: true,
    tags: ["SHIELD", "DEFENSE"],
    specifications: {
      "Shield Strength": "18,000 PL resistance",
      "Coverage": "360° protection",
      "Duration": "30 minutes continuous",
      "Activation": "Instant deployment",
      "Portability": "Wrist-mounted device"
    }
  },
  {
    id: 28,
    name: "Warrior's Headband",
    slug: "warriors-headband",
    description: "Traditional warrior headband with mental focus enhancement. Increases concentration and battle awareness.",
    category: "Battle Gear",
    price: 299.00,
    powerLevel: 2000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 50,
    featured: false,
    tags: ["HEADBAND", "FOCUS"],
    specifications: {
      "Focus Enhancement": "50% concentration boost",
      "Material": "Sacred cloth fibers",
      "Battle Awareness": "Enhanced reflexes",
      "Durability": "Indestructible weave",
      "Tradition": "Worn by legendary warriors"
    }
  },
  {
    id: 29,
    name: "Power Gauntlets",
    slug: "power-gauntlets",
    description: "Heavy-duty gauntlets that multiply striking force. Perfect for devastating punches and energy channeling.",
    category: "Battle Gear",
    price: 1299.00,
    powerLevel: 8500,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 18,
    featured: false,
    tags: ["GAUNTLETS", "POWER"],
    specifications: {
      "Strike Multiplier": "5x force increase",
      "Energy Channeling": "Ki focus technology",
      "Weight": "10kg each",
      "Material": "Reinforced battle metal",
      "Special": "Shockwave generation"
    }
  },
  {
    id: 30,
    name: "Battle Cape of Heroes",
    slug: "battle-cape-heroes",
    description: "Iconic hero cape that provides wind resistance and dramatic flair. Enchanted with protective properties.",
    category: "Battle Gear",
    price: 799.00,
    powerLevel: 6000,
    image: "/api/placeholder/400/400",
    gallery: ["/api/placeholder/400/400"],
    inStock: true,
    stock: 12,
    featured: false,
    tags: ["CAPE", "HEROIC"],
    specifications: {
      "Protection": "Magical damage resistance",
      "Material": "Heroic fabric blend",
      "Wind Resistance": "Perfect aerodynamics",
      "Inspiration": "+100 morale boost",
      "Dramatic Effect": "Maximum coolness"
    }
  },
  {
    id: 31,
    name: "Elite Scouter Mk III",
    slug: "elite-scouter-mk3",
    description: "Latest generation scouter with advanced combat analysis and tactical overlay systems.",
    category: "Battle Gear",
    price: 1999.00,
    powerLevel: 2000000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096291/c1_a9za6g.jpg",
    gallery: ["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096291/c1_a9za6g.jpg"],
    inStock: true,
    stock: 20,
    featured: true,
    tags: ["SCOUTER", "ANALYSIS"],
    specifications: {
      "Max Detection": "2 million PL",
      "Combat Analysis": "Real-time tactics",
      "HUD Display": "Tactical overlay",
      "Communication": "Galactic range",
      "Durability": "Battle-hardened casing"
    }
  },
  {
    id: 32,
    name: "Fusion Earrings",
    slug: "fusion-earrings",
    description: "Mystical Potara earrings that enable temporary fusion with another warrior. Ultimate team technique!",
    category: "Battle Gear",
    price: 49999.00,
    powerLevel: 1000000,
    image: "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg",
    gallery: [
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759165120/Fusion_Style_Blue_Drop_Earrings_Anime_Inspired_Jewelry_Cosplay_Accessory_Gift_for_Anime_Fan_Blue_Orb_Earrings_-_Etsy_tcpjqs.jpg",
      "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759165286/Green_Faceted_Glass_Crystal_Ball_earrings_dangle_sphere_sparkling_wedding_transparent_best_for_summer_gift_for_her_Fashion_Stainless_steel_z9gwgg.jpg"
    ],
    inStock: false,
    stock: 0,
    featured: true,
    tags: ["FUSION", "LEGENDARY"],
    specifications: {
      "Fusion Duration": "Permanent (mortals: 1 hour)",
      "Power Multiplication": "Exponential increase",
      "Compatibility": "Any two beings",
      "Origin": "Supreme Kai technology",
      "Rarity": "Extremely rare artifact"
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