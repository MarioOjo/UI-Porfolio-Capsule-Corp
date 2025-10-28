-- Full seed script: Update all 18 products with complete data for local development
UPDATE products SET
  name = 'Saiyan Battle Armor',
  slug = 'saiyan-battle-armor',
  description = 'Advanced light-weight Saiyan armor produced by Capsule Corp. Reinforced plating and adaptive fit.',
  category = 'Battle Gear',
  price = 299.00,
  original_price = 399.00,
  power_level = 9000,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg"]',
  in_stock = 1,
  stock = 15,
  featured = 1,
  tags = '["KAMEHAMEHA TESTED","SAIYAN APPROVED"]',
  specifications = '{"weight": "2.5 kg", "defense": "9000+", "material": "Saiyan Steel"}'
WHERE slug = 'saiyan-battle-armor';

UPDATE products SET
  name = 'Dragon Radar Mark VII',
  slug = 'dragon-radar-mark-vii',
  description = 'Latest model of the legendary Dragon Radar. Enhanced range and precision.',
  category = 'Technology',
  price = 899.99,
  original_price = 1299.99,
  power_level = 5000,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_sr.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_sr.jpg"]',
  in_stock = 1,
  stock = 8,
  featured = 1,
  tags = '["BULMA DESIGNED","QUANTUM ENHANCED"]',
  specifications = '{"range": "Global", "battery": "Solar powered"}'
WHERE slug = 'dragon-radar-mark-vii';

UPDATE products SET
  name = 'Gravity Chamber (Personal)',
  slug = 'gravity-chamber-personal',
  description = 'Train like Vegeta with this personal gravity chamber. Adjustable up to 500x Earth gravity.',
  category = 'Training',
  price = 15999.99,
  original_price = 19999.99,
  power_level = 8500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610689/Firefly-Photo.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610689/Firefly-Photo.jpg"]',
  in_stock = 1,
  stock = 25,
  featured = 1,
  tags = '["VEGETA APPROVED","EXTREME TRAINING"]',
  specifications = '{"size": "10m x 10m x 10m", "power": "Fusion reactor"}'
WHERE slug = 'gravity-chamber-personal';

UPDATE products SET
  name = 'Senzu Bean Pack (12 count)',
  slug = 'senzu-bean-pack',
  description = 'Mystical beans that restore energy and health instantly. Pack of 12.',
  category = 'Consumables',
  price = 249.99,
  original_price = 299.99,
  power_level = 0,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759696846/scouter_noikel.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759696846/scouter_noikel.jpg"]',
  in_stock = 1,
  stock = 25,
  featured = 1,
  tags = '["KORIN GROWN","INSTANT HEALING"]',
  specifications = '{"count": "12", "expiry": "Never expires"}'
WHERE slug = 'senzu-bean-pack';

UPDATE products SET
  name = 'Power Scouter Elite',
  slug = 'power-scouter-elite',
  description = 'Advanced combat scouter with holographic display and encrypted comms.',
  category = 'Technology',
  price = 599.99,
  original_price = 799.99,
  power_level = 1500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759701936/Firefly-Photo.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759701936/Firefly-Photo.jpg"]',
  in_stock = 1,
  stock = 20,
  featured = 1,
  tags = '["FRIEZA TECH","COMBAT READY"]',
  specifications = '{"range": "10km", "features": "Voice command"}'
WHERE slug = 'power-scouter-elite';

UPDATE products SET
  name = 'Weighted Training Clothes',
  slug = 'weighted-training-clothes',
  description = 'Ultra-heavy training outfit for serious martial artists. Adjustable weights.',
  category = 'Training',
  price = 499.99,
  original_price = 499.99,
  power_level = 2000,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759696925/nimb_bgpromo.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759696925/nimb_bgpromo.jpg"]',
  in_stock = 1,
  stock = 18,
  featured = 1,
  tags = '["TURTLE HERMIT","STRENGTH TRAINING"]',
  specifications = '{"sizes": "S-XXXL", "comfort": "Breathable"}'
WHERE slug = 'weighted-training-clothes';

UPDATE products SET
  name = 'Flying Nimbus Cloud',
  slug = 'flying-nimbus-cloud',
  description = 'Magical flying cloud that only the pure of heart can ride. Includes cloud care kit.',
  category = 'Transportation',
  price = 2999.99,
  original_price = 3999.99,
  power_level = 1000,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759709896/Firefly-Photo.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759709896/Firefly-Photo.jpg"]',
  in_stock = 1,
  stock = 10,
  featured = 1,
  tags = '["PURE HEART ONLY","ECO FRIENDLY"]',
  specifications = '{"fuel": "None required", "speed": "Mach 1.5"}'
WHERE slug = 'flying-nimbus-cloud';

UPDATE products SET
  name = 'Kaio-ken Training Manual',
  slug = 'kaio-ken-training-manual',
  description = 'Comprehensive guide to the Kaio-ken technique. Includes training schedule and safety tips.',
  category = 'Training',
  price = 149.99,
  original_price = 199.99,
  power_level = 500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759709088/Firefly-Photo.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759709088/Firefly-Photo.jpg"]',
  in_stock = 1,
  stock = 30,
  featured = 1,
  tags = '["KING KAI APPROVED","ADVANCED TECHNIQUE"]',
  specifications = '{"pages": "50", "safety": "High risk warning"}'
WHERE slug = 'kaio-ken-training-manual';

UPDATE products SET
  name = 'Capsule Corp Motorcycle',
  slug = 'capsule-corp-motorcycle',
  description = 'High-speed motorcycle with Capsule Corp engineering. Electric engine, GPS, and anti-theft.',
  category = 'Vehicles',
  price = 4999.99,
  original_price = 5999.99,
  power_level = 1200,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/motorcycle.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/motorcycle.jpg"]',
  in_stock = 1,
  stock = 5,
  featured = 1,
  tags = '["TURBO BOOST","GPS"]',
  specifications = '{"engine": "Electric", "features": "Turbo boost, GPS, anti-theft"}'
WHERE slug = 'capsule-corp-motorcycle';

UPDATE products SET
  name = 'Capsule Corp Jet',
  slug = 'capsule-corp-jet',
  description = 'Personal jet for fast travel. Stealth mode, autopilot, luxury seating.',
  category = 'Vehicles',
  price = 29999.99,
  original_price = 34999.99,
  power_level = 3000,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/jet.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/jet.jpg"]',
  in_stock = 1,
  stock = 2,
  featured = 1,
  tags = '["STEALTH MODE","AUTOPILOT"]',
  specifications = '{"engine": "Fusion", "features": "Stealth, autopilot, luxury seating"}'
WHERE slug = 'capsule-corp-jet';

UPDATE products SET
  name = 'Capsule Corp Boat',
  slug = 'capsule-corp-boat',
  description = 'Luxury boat with Capsule Corp tech. Solar powered, party mode, GPS.',
  category = 'Vehicles',
  price = 7999.99,
  original_price = 11999.99,
  power_level = 1500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/boat.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1700000000/boat.jpg"]',
  in_stock = 1,
  stock = 6,
  featured = 1,
  tags = '["SOLAR POWER","PARTY MODE"]',
  specifications = '{"engine": "Solar", "features": "Auto-pilot, party mode, GPS"}'
WHERE slug = 'capsule-corp-boat';

UPDATE products SET
  name = 'House Capsule Pro',
  slug = 'house-capsule-pro',
  description = 'Portable house that expands instantly. 3 bedrooms, warranty included.',
  category = 'Capsules',
  price = 4999.99,
  original_price = 5999.99,
  power_level = 2500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/house.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/house.jpg"]',
  in_stock = 1,
  stock = 8,
  featured = 1,
  tags = '["INSTANT HOME","CAPSULE TECH"]',
  specifications = '{"rooms": "3 bedrooms", "warranty": "15 years"}'
WHERE slug = 'house-capsule-pro';

UPDATE products SET
  name = 'Vehicle Capsule Set',
  slug = 'vehicle-capsule-set',
  description = 'Collection of 5 vehicle capsules. Includes car, bike, boat, jet, and ATV.',
  category = 'Capsules',
  price = 11999.99,
  original_price = 19999.99,
  power_level = 3500,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/vehicles.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/vehicles.jpg"]',
  in_stock = 1,
  stock = 5,
  featured = 1,
  tags = '["COMPLETE SET","ALL TERRAIN"]',
  specifications = '{"capsule energy": "Special", "license": "Universal"}'
WHERE slug = 'vehicle-capsule-set';

UPDATE products SET
  name = 'Camping Capsule Deluxe',
  slug = 'camping-capsule-deluxe',
  description = 'Ultimate camping solution. Includes tent, kitchen, shower, and generator.',
  category = 'Capsules',
  price = 1499.99,
  original_price = 1999.99,
  power_level = 1200,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/camping.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/camping.jpg"]',
  in_stock = 1,
  stock = 15,
  featured = 1,
  tags = '["OUTDOOR ADVENTURE","SURVIVAL READY"]',
  specifications = '{"setup": "Instant", "weight": "0.5kg capsule"}'
WHERE slug = 'camping-capsule-deluxe';

UPDATE products SET
  name = 'Workshop Capsule',
  slug = 'workshop-capsule',
  description = 'Portable workshop with all tools included. 20 sqm workspace, solar powered.',
  category = 'Capsules',
  price = 3299.99,
  original_price = 4299.99,
  power_level = 1800,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/workshop.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/workshop.jpg"]',
  in_stock = 1,
  stock = 10,
  featured = 1,
  tags = '["MECHANIC READY","COMPLETE TOOLS"]',
  specifications = '{"size": "20 sqm workshop", "power": "Solar powered"}'
WHERE slug = 'workshop-capsule';

UPDATE products SET
  name = 'Restaurant Capsule',
  slug = 'restaurant-capsule',
  description = 'Fully equipped restaurant in a capsule. Fine dining, robot chefs, multi-cultural cuisine.',
  category = 'Capsules',
  price = 12999.99,
  original_price = 19999.99,
  power_level = 4200,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/restaurant.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/restaurant.jpg"]',
  in_stock = 1,
  stock = 6,
  featured = 1,
  tags = '["FINE DINING","ROBOT STAFF"]',
  specifications = '{"cuisine": "Multi-cultural", "hygiene": "Auto-sanitize"}'
WHERE slug = 'restaurant-capsule';

UPDATE products SET
  name = 'Laboratory Capsule',
  slug = 'laboratory-capsule',
  description = 'Portable scientific laboratory. Quantum storage, fusion reactor, safety certified.',
  category = 'Capsules',
  price = 7499.99,
  original_price = 9999.99,
  power_level = 3800,
  image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/lab.jpg',
  gallery = '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1700000000/lab.jpg"]',
  in_stock = 1,
  stock = 6,
  featured = 1,
  tags = '["RESEARCH GRADE","SAFETY CERTIFIED"]',
  specifications = '{"data": "Quantum storage", "power": "Fusion reactor", "safety": "Level 4 containment"}'
WHERE slug = 'laboratory-capsule';
