require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// All 20 original products from MySQL
const allProducts = [
  {
    name: 'Hyperbolic Time Chamber Pass',
    slug: 'hyperbolic-time-chamber-pass',
    description: 'Exclusive pass granting access to the legendary Hyperbolic Time Chamber for advanced training.',
    price: 999.99,
    original_price: 1299.99,
    category: 'Training',
    power_level: 10000,
    stock: 50,
    featured: true,
    tags: ['ADVANCED TRAINING', 'LIMITED ACCESS'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg', 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png'],
    in_stock: true
  },
  {
    name: 'Dragon Radar Mark VII',
    slug: 'dragon-radar-mark-vii',
    description: 'Latest model of the legendary Dragon Radar. Enhanced range and precision.',
    price: 899.99,
    original_price: 1299.99,
    category: 'Technology',
    power_level: 5000,
    stock: 8,
    featured: true,
    tags: ['BULMA DESIGNED', 'QUANTUM ENHANCED'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg'],
    in_stock: true
  },
  {
    name: 'Gravity Chamber (Personal)',
    slug: 'gravity-chamber-personal',
    description: 'Train like Vegeta with this personal gravity chamber. Adjustable up to 500x Earth gravity.',
    price: 15999.99,
    original_price: 19999.99,
    category: 'Training',
    power_level: 8500,
    stock: 25,
    featured: true,
    tags: ['VEGETA APPROVED', 'EXTREME TRAINING'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg'],
    in_stock: true
  },
  {
    name: 'Senzu Bean Pack (12 count)',
    slug: 'senzu-bean-pack',
    description: 'Mystical beans that restore energy and health instantly. Pack of 12.',
    price: 249.99,
    original_price: 299.99,
    category: 'Consumables',
    power_level: 0,
    stock: 25,
    featured: true,
    tags: ['KORIN GROWN', 'INSTANT HEALING'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg'],
    in_stock: true
  },
  {
    name: 'Power Scouter Elite',
    slug: 'power-scouter-elite',
    description: 'Advanced combat scouter with holographic display and encrypted comms.',
    price: 599.99,
    original_price: 799.99,
    category: 'Technology',
    power_level: 1500,
    stock: 20,
    featured: true,
    tags: ['FRIEZA TECH', 'COMBAT READY'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg'],
    in_stock: true
  },
  {
    name: 'Weighted Training Clothes',
    slug: 'weighted-training-clothes',
    description: 'Ultra-heavy training outfit for serious martial artists. Adjustable weights.',
    price: 499.99,
    category: 'Training',
    power_level: 2000,
    stock: 18,
    featured: true,
    tags: ['TURTLE HERMIT', 'STRENGTH TRAINING'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg'],
    in_stock: true
  },
  {
    name: 'Flying Nimbus Cloud',
    slug: 'flying-nimbus-cloud',
    description: 'Magical flying cloud that only the pure of heart can ride. Includes cloud care kit.',
    price: 2999.99,
    original_price: 3999.99,
    category: 'Transportation',
    power_level: 1000,
    stock: 10,
    featured: true,
    tags: ['PURE HEART ONLY', 'ECO FRIENDLY'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699245/nimb_rbgqmo.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699245/nimb_rbgqmo.jpg', 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759699421/nimb3_vqyt06.jpg'],
    in_stock: true
  },
  {
    name: 'Kaio-ken Training Manual',
    slug: 'kaio-ken-training-manual',
    description: 'Comprehensive guide to the Kaio-ken technique. Includes training schedule and safety tips.',
    price: 149.99,
    original_price: 199.99,
    category: 'Training',
    power_level: 500,
    stock: 30,
    featured: true,
    tags: ['KING KAI APPROVED', 'ADVANCED TECHNIQUE'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700988/Firefly__-Photorealistic_image_of_an_advanced_Kaio-ken_training_manual_projecting_a_glowing_r_64817_trah8h.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700988/Firefly__-Photorealistic_image_of_an_advanced_Kaio-ken_training_manual_projecting_a_glowing_r_64817_trah8h.jpg'],
    in_stock: true
  },
  {
    name: 'Capsule Corp Motorcycle',
    slug: 'capsule-corp-motorcycle',
    description: 'High-speed motorcycle with Capsule Corp engineering. Electric engine, GPS, and anti-theft.',
    price: 4999.99,
    original_price: 5999.99,
    category: 'Vehicles',
    power_level: 1200,
    stock: 5,
    featured: true,
    tags: ['TURBO BOOST', 'GPS'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1761684146/superojo420_CAPSULE_CORP_Motorcycle_from_dragon_ball_z_with_High-TECH_enginee_67c32a5c-f67d-4b10-ab49-e243258b9003_vsw6qy.png',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1761684146/superojo420_CAPSULE_CORP_Motorcycle_from_dragon_ball_z_with_High-TECH_enginee_67c32a5c-f67d-4b10-ab49-e243258b9003_vsw6qy.png'],
    in_stock: true
  },
  {
    name: 'Capsule Corp Jet',
    slug: 'capsule-corp-jet',
    description: 'Personal jet for fast travel. Stealth mode, autopilot, luxury seating.',
    price: 29999.99,
    original_price: 34999.99,
    category: 'Vehicles',
    power_level: 3000,
    stock: 2,
    featured: true,
    tags: ['STEALTH MODE', 'AUTOPILOT'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1761661022/Unoriginal_Entertainer_A_medium_sized_Personal_jet_for_fast_travel._Stealth_mode__autopi_8f4c07f0-a326-450c-839a-63d2eb002510_rvwgno.png',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1761661022/Unoriginal_Entertainer_A_medium_sized_Personal_jet_for_fast_travel._Stealth_mode__autopi_8f4c07f0-a326-450c-839a-63d2eb002510_rvwgno.png'],
    in_stock: true
  },
  {
    name: 'Capsule Corp Boat',
    slug: 'capsule-corp-boat',
    description: 'Luxury boat with Capsule Corp tech. Solar powered, party mode, GPS.',
    price: 7999.99,
    original_price: 11999.99,
    category: 'Vehicles',
    power_level: 1500,
    stock: 6,
    featured: true,
    tags: ['SOLAR POWER', 'PARTY MODE'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1761660516/Unoriginal_Entertainer_A_Luxury_boat_with_Capsule_Corp_tech_for_dragon_ball_z_._Solar_po_e822bab0-1f3f-419d-988e-67fa98f7f7c9_1_d1gzqz.png',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1761660516/Unoriginal_Entertainer_A_Luxury_boat_with_Capsule_Corp_tech_for_dragon_ball_z_._Solar_po_e822bab0-1f3f-419d-988e-67fa98f7f7c9_1_d1gzqz.png'],
    in_stock: true
  },
  {
    name: 'Vehicle Capsule Set',
    slug: 'vehicle-capsule-set',
    description: 'Collection of 5 vehicle capsules. Includes car, bike, boat, jet, and ATV.',
    price: 11999.99,
    original_price: 19999.99,
    category: 'Capsules',
    power_level: 3500,
    stock: 5,
    featured: true,
    tags: ['COMPLETE SET', 'ALL TERRAIN'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png'],
    in_stock: true
  },
  {
    name: 'Camping Capsule Deluxe',
    slug: 'camping-capsule-deluxe',
    description: 'Ultimate camping solution. Includes tent, kitchen, shower, and generator.',
    price: 1499.99,
    original_price: 1999.99,
    category: 'Capsules',
    power_level: 1200,
    stock: 15,
    featured: true,
    tags: ['OUTDOOR ADVENTURE', 'SURVIVAL READY'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697460/the_one_cap3_qjt0dq.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697460/the_one_cap3_qjt0dq.jpg'],
    in_stock: true
  },
  {
    name: 'Workshop Capsule',
    slug: 'workshop-capsule',
    description: 'Portable workshop with all tools included. 20 sqm workspace, solar powered.',
    price: 3299.99,
    original_price: 4299.99,
    category: 'Capsules',
    power_level: 1800,
    stock: 10,
    featured: true,
    tags: ['MECHANIC READY', 'COMPLETE TOOLS'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700646/Firefly__-Photorealistic_extreme_close-up_of_a_single_Capsule_Corporation_house_capsule._The_592405_-_REF_axvghb.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759700646/Firefly__-Photorealistic_extreme_close-up_of_a_single_Capsule_Corporation_house_capsule._The_592405_-_REF_axvghb.jpg'],
    in_stock: true
  },
  {
    name: 'Restaurant Capsule',
    slug: 'restaurant-capsule',
    description: 'Fully equipped restaurant in a capsule. Fine dining, robot chefs, multi-cultural cuisine.',
    price: 12999.99,
    original_price: 19999.99,
    category: 'Capsules',
    power_level: 4200,
    stock: 6,
    featured: true,
    tags: ['FINE DINING', 'ROBOT STAFF'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697463/the_one_cap4_gwlqiz.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697463/the_one_cap4_gwlqiz.jpg'],
    in_stock: true
  },
  {
    name: 'House Capsule Pro',
    slug: 'house-capsule-pro',
    description: 'Portable house that expands instantly. 3 bedrooms, warranty included.',
    price: 4999.99,
    original_price: 5999.99,
    category: 'Capsules',
    power_level: 2500,
    stock: 8,
    featured: true,
    tags: ['INSTANT HOME', 'CAPSULE TECH'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg'],
    in_stock: true
  },
  {
    name: 'Laboratory Capsule',
    slug: 'laboratory-capsule',
    description: 'Portable scientific laboratory. Quantum storage, fusion reactor, safety certified.',
    price: 7499.99,
    original_price: 9999.99,
    category: 'Capsules',
    power_level: 3800,
    stock: 6,
    featured: true,
    tags: ['RESEARCH GRADE', 'SAFETY CERTIFIED'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg'],
    in_stock: true
  },
  {
    name: 'Potara Earrings',
    slug: 'potara-earrings',
    description: 'Legendary fusion earrings. Grants fusion ability when worn by two people.',
    price: 499.99,
    original_price: 599.99,
    category: 'Accessories',
    power_level: 0,
    stock: 50,
    featured: true,
    tags: ['FUSION ITEM', 'LEGENDARY'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg'],
    in_stock: true
  },
  {
    name: 'Saiyan Battle Armor',
    slug: 'saiyan-battle-armor',
    description: 'Advanced light-weight Saiyan armor produced by Capsule Corp. Reinforced plating and adaptive fit.',
    price: 299,
    original_price: 399,
    category: 'Battle Gear',
    power_level: 9000,
    stock: 15,
    featured: true,
    tags: ['KAMEHAMEHA TESTED', 'SAIYAN APPROVED'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg'],
    in_stock: true
  },
  {
    name: 'Elite Scouter',
    slug: 'elite-scouter',
    description: 'Scouter with real-time analysis, long-range detection, and tamper-proof shell.',
    price: 599.99,
    original_price: 799.99,
    category: 'Technology',
    power_level: 5000,
    stock: 8,
    featured: true,
    tags: ['BULMA DESIGNED', 'QUANTUM ENHANCED'],
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg'],
    in_stock: true
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Seeding all 20 original products...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared\n');

    // Create all products
    console.log('📦 Creating products...');
    const createdProducts = [];
    for (const productData of allProducts) {
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`   ✓ Created: ${product.name} ($${product.price})`);
    }
    console.log(`\n✅ Created ${createdProducts.length} products\n`);

    // Summary
    console.log('📊 SEEDING SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Total Products:  ${createdProducts.length}`);
    console.log(`⭐ Featured:        ${createdProducts.filter(p => p.featured).length}`);
    console.log(`💰 Price Range:     $${Math.min(...createdProducts.map(p => p.price))} - $${Math.max(...createdProducts.map(p => p.price))}`);
    console.log('═══════════════════════════════════════\n');

    console.log('✨ Product seeding completed successfully!\n');

  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  } finally {
    console.log('🔌 Database connection closed');
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedProducts();
