require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const BROKEN_IMAGE_FRAGMENT = 'v1759096629/d3_xdolmn.jpg';

const LEGACY_FIXES = {
  'senzu-bean-pack-10': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg'],
    category: 'Battle Gear',
  },
  'gravity-training-room': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg'],
    category: 'Training',
  },
  'weighted-training-gi': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759702012/Firefly___-Photorealistic_product_shot_of_Goku_s_iconic_training_gi_from_Dragon_Ball_Z_displ_365151_aeikcp.jpg'],
    category: 'Training',
  },
  'power-level-scouter': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg'],
    category: 'Battle Gear',
  },
  'storage-capsule-1': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap_msdrji.jpg'],
    category: 'Capsules',
  },
  'vehicle-capsule-3': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1761681794/cap_sert_slcyw4.png'],
    category: 'Capsules',
  },
  'capsule-house-5': {
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg',
    gallery: ['https://res.cloudinary.com/dx8wt3el4/image/upload/v1759697461/the_one_cap2_dbpkb5.jpg'],
    category: 'Capsules',
  },
};

const VEHICLE_UPSERTS = [
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
  },
];

const APPLY = process.argv.includes('--apply');

async function normalizeLegacyProducts() {
  const products = await Product.find({});
  let updateCount = 0;

  for (const product of products) {
    const fix = LEGACY_FIXES[product.slug];
    if (!fix) continue;

    const image = String(product.image || '');
    const gallery = Array.isArray(product.gallery) ? product.gallery : [];
    const hasBrokenImage = image.includes(BROKEN_IMAGE_FRAGMENT);
    const hasBrokenGallery = gallery.some((g) => String(g).includes(BROKEN_IMAGE_FRAGMENT));
    const categoryMismatch = fix.category && product.category !== fix.category;

    if (!hasBrokenImage && !hasBrokenGallery && !categoryMismatch) continue;

    updateCount += 1;
    console.log(`- normalize ${product.slug}`);

    if (APPLY) {
      product.image = fix.image;
      product.gallery = fix.gallery;
      if (fix.category) product.category = fix.category;
      product.updated_at = new Date();
      await product.save();
    }
  }

  return updateCount;
}

async function ensureVehiclesCatalog() {
  const existingVehicleCount = await Product.countDocuments({ category: 'Vehicles' });

  let upsertCount = 0;
  for (const candidate of VEHICLE_UPSERTS) {
    const exists = await Product.findOne({ slug: candidate.slug });
    if (exists) continue;

    upsertCount += 1;
    console.log(`- add missing vehicle ${candidate.slug}`);

    if (APPLY) {
      await Product.create({ ...candidate, created_at: new Date(), updated_at: new Date() });
    }
  }

  return { existingVehicleCount, upsertCount };
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to MongoDB (${APPLY ? 'APPLY' : 'DRY RUN'})`);

  const normalized = await normalizeLegacyProducts();
  const vehicleResult = await ensureVehiclesCatalog();

  console.log('\nSummary');
  console.log(`- legacy products to normalize: ${normalized}`);
  console.log(`- existing Vehicles category products: ${vehicleResult.existingVehicleCount}`);
  console.log(`- missing vehicle products to add: ${vehicleResult.upsertCount}`);
  console.log(`- mode: ${APPLY ? 'APPLY' : 'DRY RUN (no writes)'}`);

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error('Normalization failed:', error.message || error);
  process.exit(1);
});
