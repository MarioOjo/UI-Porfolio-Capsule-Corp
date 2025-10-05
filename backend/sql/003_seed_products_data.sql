-- Migration: Seed capsule_products table with initial data
-- Description: Populates the capsule_products table with Capsule Corp store products

INSERT INTO capsule_products (
    id, name, slug, description, category, price, original_price, power_level,
    image, gallery, in_stock, stock, featured, tags, specifications
) VALUES
(1, 'Saiyan Battle Armor', 'saiyan-battle-armor', 
 'Elite battle armor worn by the legendary Saiyan warriors. Provides exceptional protection while maintaining flexibility for high-speed combat.',
 'Battle Gear', 299.00, 399.00, 9000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg", "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/c2_zaswlx.jpg"]',
 1, 15, 1,
 '["KAMEHAMEHA TESTED", "SAIYAN APPROVED"]',
 '{"material": "Saiyan Steel", "weight": "2.5 kg", "durability": "99%", "flexibility": "High", "defense": "9000+"}'),

(2, 'Dragon Radar Mark VII', 'dragon-radar-mark-vii',
 'Latest model of the legendary Dragon Ball detector. Enhanced with quantum scanning technology for pinpoint accuracy.',
 'Technology', 899.99, 1299.99, 5000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610849/dragonrader_srs7e7.jpg"]',
 1, 8, 1,
 '["BULMA DESIGNED", "QUANTUM ENHANCED"]',
 '{"range": "Global", "accuracy": "99.9%", "battery": "Solar powered", "display": "Holographic", "dimensions": "15cm x 10cm"}'),

(3, 'Gravity Chamber (Personal)', 'gravity-chamber-personal',
 'Train like Vegeta with this personal gravity chamber. Adjustable from 1x to 100x Earth gravity for the ultimate training experience.',
 'Training', 15999.99, 19999.99, 8500,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759166389/Firefly_-Photorealistic_wide-angle_interior_view_of_a_Dragon_Ball_Z_gravity_chamber._The_cha_106501_pnmqzo.jpg"]',
 1, 3, 1,
 '["VEGETA APPROVED", "EXTREME TRAINING"]',
 '{"gravity_range": "1x - 100x Earth", "size": "10m x 10m x 10m", "power": "Fusion reactor", "safety": "Emergency shutoff", "warranty": "Lifetime"}'),

(4, 'Senzu Bean Pack (12 count)', 'senzu-bean-pack',
 'Mystical beans that restore full health and energy. Perfect for post-training recovery or emergency healing.',
 'Consumables', 249.99, 299.99, 0,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759610771/Firefly_-Photorealistic_product_shot_of_a_Senzu_Bean_Pack_12_Count._The_beans_are_contain_881582_gagzvx.jpg"]',
 1, 25, 1,
 '["KORIN GROWN", "INSTANT HEALING"]',
 '{"count": "12 beans", "effects": "Full HP/Energy restore", "expiry": "Never expires", "origin": "Korin Tower", "storage": "Cool, dry place"}'),

(5, 'Capsule Storage System', 'capsule-storage-system',
 'Revolutionary storage technology that can compress anything into a small capsule. Includes 50 empty capsules.',
 'Technology', 1299.99, 1599.99, 3000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096678/i1_qjwjxh.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096678/i1_qjwjxh.jpg"]',
 1, 12, 1,
 '["BULMA TECH", "SPACE SAVING"]',
 '{"capacity": "Unlimited", "capsules_included": "50", "compression_ratio": "1:1000000", "compatibility": "Universal", "warranty": "10 years"}'),

(6, 'Power Scouter Elite', 'power-scouter-elite',
 'Advanced combat scouter with power level detection, tactical analysis, and communication features.',
 'Technology', 599.99, 799.99, 1500,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759608406/scouter_noike1.jpg"]',
 1, 20, 0,
 '["FRIEZA TECH", "COMBAT READY"]',
 '{"max_detection": "Over 9000", "range": "10km", "features": "Voice command", "durability": "Shatter resistant", "compatibility": "Universal"}'),

(7, 'Weighted Training Clothes', 'weighted-training-clothes',
 'Ultra-heavy training outfit used by martial arts masters. Adjustable weight from 10kg to 200kg.',
 'Training', 399.99, 499.99, 2000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"]',
 1, 18, 0,
 '["TURTLE HERMIT", "STRENGTH TRAINING"]',
 '{"weight_range": "10kg - 200kg", "material": "Weighted fabric", "sizes": "S-XXXL", "adjustment": "Magnetic weights", "comfort": "Breathable"}'),

(8, 'Flying Nimbus Cloud', 'flying-nimbus-cloud',
 'Magical flying cloud that responds only to those pure of heart. Eco-friendly transportation solution.',
 'Transportation', 2999.99, 3999.99, 4000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096703/l1_oy8ib9.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096703/l1_oy8ib9.jpg"]',
 1, 5, 0,
 '["PURE HEART ONLY", "ECO FRIENDLY"]',
 '{"speed": "Mach 1.5", "altitude": "Unlimited", "fuel": "None required", "requirement": "Pure heart", "warranty": "Eternal"}'),

(9, 'Kaio-ken Training Manual', 'kaio-ken-training-manual',
 'Comprehensive guide to the legendary Kaio-ken technique. Includes safety protocols and power multiplication theory.',
 'Training', 149.99, 199.99, 1000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"]',
 1, 30, 0,
 '["KING KAI APPROVED", "ADVANCED TECHNIQUE"]',
 '{"pages": "500", "difficulty": "Expert", "prerequisites": "Advanced Ki control", "safety": "High risk warning", "language": "Universal"}'),

(10, 'Fusion Dance Tutorial Set', 'fusion-dance-tutorial-set',
 'Complete video series teaching the legendary Fusion Dance technique. Includes practice mats and timing guides.',
 'Training', 299.99, 399.99, 6000,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg"]',
 1, 10, 0,
 '["GOTEN & TRUNKS", "FUSION MASTERY"]',
 '{"videos": "50 tutorials", "duration": "30 minutes", "success_rate": "Variable", "requirements": "Perfect synchronization", "includes": "Practice mats"}'),

(11, 'Time Chamber Access Pass', 'time-chamber-access-pass',
 'One-year access to the Hyperbolic Time Chamber. One day outside equals one year inside for intensive training.',
 'Training', 9999.99, 12999.99, 9500,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168531/pass_s6htfv.png", "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759168435/Firefly_-A_futuristic_fantasy_temple_standing_in_a_limitless_white_dimension._The_temple_has_921029_hgswg6.jpg"]',
 1, 2, 0,
 '["KAMI CERTIFIED", "TIME DILATION"]',
 '{"duration": "1 year access", "time_ratio": "1:365", "capacity": "2 people max", "survival_gear": "Included", "emergency_exit": "24/7 available"}'),

(12, 'Dragon Ball Replica Set', 'dragon-ball-replica-set',
 'Perfect replicas of all seven Dragon Balls. Great for collectors and cosplay. Note: Does not summon actual dragon.',
 'Collectibles', 199.99, 299.99, 100,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096735/p1_eycfko.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096735/p1_eycfko.jpg"]',
 1, 50, 0,
 '["COLLECTOR ITEM", "COSPLAY PERFECT"]',
 '{"count": "7 balls", "material": "Crystal glass", "diameter": "7.5cm", "stars": "Hand painted", "warning": "Not functional"}')

ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    original_price = VALUES(original_price),
    image = VALUES(image),
    gallery = VALUES(gallery),
    stock = VALUES(stock),
    updated_at = CURRENT_TIMESTAMP;

-- Ensure Potara Earrings exists with the glowing image
INSERT INTO capsule_products (id, name, slug, description, category, price, original_price, power_level, image, gallery, in_stock, stock, featured, tags, specifications)
VALUES (
    19,
    'Potara Earrings',
    'potara-earrings',
    'Ancient mystical artifacts used by the Supreme Kais. Perfect for fusion and ultimate power.',
    'Battle Gear',
    999.00,
    1499.00,
    10000,
    'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_glowing.jpg',
    '["https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_glowing.jpg", "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg", "https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_macro.jpg"]',
    1,
    5,
    0,
    '[]',
    '{}'
)
ON DUPLICATE KEY UPDATE
    image = VALUES(image),
    gallery = VALUES(gallery),
    stock = VALUES(stock),
    updated_at = CURRENT_TIMESTAMP;