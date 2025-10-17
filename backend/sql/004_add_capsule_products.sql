-- Migration: Add Capsule Category Products
-- Description: Adds products specifically for the Capsules category page

INSERT INTO capsule_products (
    id, name, slug, description, category, price, original_price, power_level,
    image, gallery, in_stock, stock, featured, tags, specifications
) VALUES
(13, 'House Capsule Pro', 'house-capsule-pro',
 'Portable house that expands from a small capsule into a fully furnished 3-bedroom home. Perfect for adventures or emergency shelter.',
 'Capsules', 4999.99, 6999.99, 2500,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096735/house_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096735/house_capsule.jpg"]',
 1, 8, 1,
 '["INSTANT HOME", "CAPSULE TECH"]',
 '{"rooms": "3 bedrooms", "size": "150 sqm", "utilities": "Full kitchen & bath", "setup_time": "5 seconds", "warranty": "5 years"}'),

(14, 'Vehicle Capsule Set', 'vehicle-capsule-set',
 'Collection of 5 vehicle capsules including motorcycle, car, boat, airplane, and submarine. Travel anywhere in style!',
 'Capsules', 8999.99, 11999.99, 3500,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096745/vehicle_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096745/vehicle_capsule.jpg"]',
 1, 5, 1,
 '["COMPLETE SET", "ALL TERRAIN"]',
 '{"vehicles": "5 types", "fuel": "Capsule energy", "speed": "Varies by vehicle", "maintenance": "Self-maintaining", "license": "Universal permit included"}'),

(15, 'Camping Capsule Deluxe', 'camping-capsule-deluxe',
 'Ultimate camping solution in capsule form. Includes tent, cooking equipment, sleeping gear, and survival tools.',
 'Capsules', 1499.99, 1999.99, 1200,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096755/camping_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096755/camping_capsule.jpg"]',
 1, 15, 0,
 '["OUTDOOR ADVENTURE", "SURVIVAL READY"]',
 '{"capacity": "4 people", "weather": "All conditions", "equipment": "Complete set", "weight": "0.5kg capsule", "setup": "Instant"}'),

(16, 'Workshop Capsule', 'workshop-capsule',
 'Portable workshop with all tools and equipment needed for mechanical work. Includes workbench, tools, and parts storage.',
 'Capsules', 3299.99, 4299.99, 1800,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096765/workshop_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096765/workshop_capsule.jpg"]',
 1, 10, 0,
 '["MECHANIC READY", "COMPLETE TOOLS"]',
 '{"size": "20 sqm workshop", "tools": "Professional grade", "power": "Solar powered", "ventilation": "Built-in", "organization": "Smart storage"}'),

(17, 'Restaurant Capsule', 'restaurant-capsule',
 'Fully equipped restaurant that deploys from a capsule. Includes kitchen, dining area, and serving staff robots.',
 'Capsules', 12999.99, 15999.99, 4200,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096775/restaurant_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096775/restaurant_capsule.jpg"]',
 1, 3, 1,
 '["FINE DINING", "ROBOT STAFF"]',
 '{"capacity": "50 diners", "cuisine": "Multi-cultural", "staff": "5 robot chefs", "service": "24/7 operation", "hygiene": "Auto-sanitizing"}'),

(18, 'Laboratory Capsule', 'laboratory-capsule',
 'Portable scientific laboratory with advanced equipment for research and experimentation. Safety protocols included.',
 'Capsules', 7499.99, 9999.99, 3800,
 'https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096785/lab_capsule.jpg',
 '["https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096785/lab_capsule.jpg"]',
 1, 6, 0,
 '["RESEARCH GRADE", "SAFETY CERTIFIED"]',
 '{"equipment": "Advanced scientific", "safety": "Level 4 containment", "power": "Fusion reactor", "data": "Quantum storage", "certification": "Galactic standard"}'
)

ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    original_price = VALUES(original_price),
    image = VALUES(image),
    gallery = VALUES(gallery),
    stock = VALUES(stock),
    updated_at = CURRENT_TIMESTAMP;