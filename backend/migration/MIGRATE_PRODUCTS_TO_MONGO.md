# Migration mapping: Products (SQL -> MongoDB)

This document describes a recommended mapping and steps to migrate the `products` SQL table into a MongoDB `products` collection, preserving the original SQL id in `legacyId` for a smooth, reversible cutover.

Goals
- Preserve `legacyId` (original numeric SQL `id`) to allow adapters to resolve products by existing ids.
- Keep the document shape compatible with the backend adapter (`backend/adapters/productReader.js`).
- Support Relational Migrator (Atlas) bulk load + CDC, or a simple Node-based transform/import for one-off migrations.

Field mapping

SQL column -> Mongo document field
- id -> legacyId (Number)
- name -> name (String)
- slug -> slug (String)
- description -> description (String)
- category -> category (String)
- price -> price (Number)
- original_price -> original_price (Number)
- power_level -> power_level (Number)
- image -> image (String)
- gallery -> gallery (Array of String) — store as JSON array
- in_stock -> in_stock (Boolean)
- stock -> stock (Number)
- featured -> featured (Boolean)
- tags -> tags (Array of String) — parse JSON string if necessary
- specifications -> specifications (Object) — parse JSON string
- created_at -> created_at (Date)
- updated_at -> updated_at (Date)

Collection name
- Use `products` (same as table name) to keep collection predictable.

Indexing
- Create index on `legacyId` (unique if your import guarantees one-to-one): `{ legacyId: 1 }`.
- Create index on `slug`: `{ slug: 1 }`.

Option A — Use MongoDB Relational Migrator (Atlas)
1. In Atlas, choose "From a Relational Database" migration.
2. Point the migrator at your SQL DB (MySQL/Postgres/SQL Server). Provide a staging/testing copy first.
3. Configure mapping for the `products` table:
   - Map `id` -> `legacyId` (ensure type preserved as Number).
   - Map JSON/text columns (`gallery`, `tags`, `specifications`) to JSON/arrays in Mongo. If your migrator cannot parse JSON inside strings, map them as strings and run a transform step after import.
4. Run initial bulk load into a test Atlas cluster.
5. Enable CDC (ongoing sync) to capture changes during validation.
6. Validate documents in Atlas and run sample API reads using the `USE_MONGO_FOR_PRODUCTS` flag.

Option B — Node.js transform + mongoimport (one-off or repeated)
1. Export SQL products to JSON (or CSV then JSON). Example (MySQL):
   - `SELECT id AS legacyId, name, slug, description, category, price, original_price, power_level, image, gallery, in_stock, stock, featured, tags, specifications, created_at, updated_at FROM products` and output as JSON rows.
2. Run a Node script to transform rows into the desired document shape (parse JSON fields, convert dates, booleans, numbers). Example snippet:

```js
// transform-products.js
const fs = require('fs');
const rows = JSON.parse(fs.readFileSync('products-export.json','utf8'));
const docs = rows.map(r => ({
  legacyId: Number(r.legacyId),
  name: r.name,
  slug: r.slug,
  description: r.description,
  category: r.category,
  price: r.price ? Number(r.price) : 0,
  original_price: r.original_price ? Number(r.original_price) : null,
  power_level: r.power_level ? Number(r.power_level) : 0,
  image: r.image || null,
  gallery: Array.isArray(r.gallery) ? r.gallery : (r.gallery ? JSON.parse(r.gallery) : []),
  in_stock: Boolean(r.in_stock),
  stock: r.stock ? Number(r.stock) : 0,
  featured: Boolean(r.featured),
  tags: Array.isArray(r.tags) ? r.tags : (r.tags ? JSON.parse(r.tags) : []),
  specifications: r.specifications ? JSON.parse(r.specifications) : {},
  created_at: r.created_at ? new Date(r.created_at) : new Date(),
  updated_at: r.updated_at ? new Date(r.updated_at) : new Date()
}));
fs.writeFileSync('products-for-mongo.json', JSON.stringify(docs));
```

3. Import to Atlas/mongo:
   - `mongoimport --uri "${MONGO_URI}" --collection products --file products-for-mongo.json --jsonArray`
4. Create indexes after import (legacyId, slug).

Cutover checklist (high level)
- Run migration into a test cluster and validate.
- Enable CDC (if using Relational Migrator) or run periodic sync for changes until cutover.
- Deploy backend with `MONGO_URI` and `USE_MONGO_FOR_PRODUCTS=1` to staging; validate reads.
- Compare API results side-by-side (SQL vs Mongo) for sample product ids.
- When confident, enable Mongo reads in production for a subset of traffic or endpoints.
- Once everything is validated, consider moving writes to Mongo or keep SQL as authoritative and keep CDC until you decommission SQL.

Notes & pitfalls
- If `gallery`, `tags`, or `specifications` are stored as JSON strings in SQL, ensure they are parsed into arrays/objects in Mongo.
- Preserve timestamps and timezone info correctly.
- Decide whether to make `legacyId` unique — useful for guaranteed lookups but if you will also use `_id` as main identifier in future, allow both.
- If you use the Relational Migrator, test mapping of types like `DECIMAL` -> `Decimal128` vs `Number` depending on precision needs.

If you'd like, I can generate a small Node migration script in this repo that connects to your SQL DB (using existing `backend/src/config/database`) and writes transformed docs to your configured `MONGO_URI`. This can be run safely against a staging DB.
