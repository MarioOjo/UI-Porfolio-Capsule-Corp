# 🚀 Automated Database Sync Tool

**One command to sync your local database structure to Railway production!**

## 🎯 Quick Start

```powershell
# From repo root
.\scripts\quick-sync.ps1
```

This generates a SQL file that you then execute in TablePlus. **No MySQL client tools needed!**

## 📋 Prerequisites

1. ✅ **Node.js** (already installed)
2. ✅ **TablePlus** for Railway database access  
3. ✅ **Local MySQL** running with your dev database

## 🔄 The Workflow

### 1. Make changes to local database
```sql
-- Example: Add a new column
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
```

### 2. Test locally
```bash
cd backend
npm run dev
# Test your changes work
```

### 3. Generate sync script
```powershell
.\scripts\quick-sync.ps1
```

### 4. Apply in TablePlus
1. Open TablePlus
2. Connect to Railway database (gondola.proxy.rlwy.net:38169)
3. Open the generated SQL file
4. Execute the entire script
5. Check verification queries at the bottom

## 📁 Generated Files

Files are saved to `backend/sql/backups/`:

- `auto_sync_YYYY-MM-DDTHH-mm-ss.sql` - Complete sync script with CREATE TABLE statements

## 🛡️ Safety Features

- ✅ Uses `IF NOT EXISTS` for tables (won't break existing data)
- ✅ Reads from your local `.env` file automatically  
- ✅ Includes verification queries
- ✅ Safe to run multiple times
- ✅ No manual credentials needed

## 🎨 Example Output

```
🚀 Database Sync Script Generator

📡 Connecting to local database...
✅ Connected

📋 Fetching table structures...
✅ Found 29 tables

   Processing: users
   Processing: products
   Processing: orders
   ... (all 29 tables)

✅ Sync script generated!

📄 File: backend\sql\backups\auto_sync_2025-11-11T15-52-53.sql
📊 Size: 24.53 KB

📋 Next steps:
   1. Open TablePlus
   2. Connect to Railway database
   3. Open this file and execute it
   4. Check verification queries at the bottom

🎉 Done!
```

## 📝 What Gets Synced

- ✅ **All 29 table structures** from your local database
- ✅ **Column definitions** (data types, constraints, defaults)
- ✅ **Indexes** (primary keys, foreign keys, indexes)
- ✅ **Table relationships** (foreign keys)
- ✅ **Admin role updates** (sets admin@capsulecorp.com, mario@capsulecorp.com)

**NOT synced:**
- ❌ **Data** (existing records stay intact)
- ❌ **Table data** (only structure is synced)

## 🤔 Common Scenarios

### Adding a new table locally
```sql
CREATE TABLE my_new_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
```

Then run:
```powershell
.\scripts\quick-sync.ps1
```

The generated script will include your new table!

### Adding a column to existing table
```sql
ALTER TABLE users ADD COLUMN newsletter BOOLEAN DEFAULT 0;
```

Then run:
```powershell
.\scripts\quick-sync.ps1
```

The generated script will recreate the full table structure with your new column.

### After running migrations
```bash
cd backend
node scripts/migrate.js
# Then sync to production
cd ..
.\scripts\quick-sync.ps1
```

## 🚨 If Something Goes Wrong

The script uses `IF NOT EXISTS`, so it won't overwrite existing tables. But always:

1. **Create a backup in TablePlus first** (Tools → Export → SQL)
2. **Test the sync script locally** on a test database
3. **Apply to production** only after verification

To manually backup production:
```bash
# In TablePlus: Tools → Export → SQL → Save as production_backup.sql
```

## 💡 Pro Tips

1. **Always test locally first** before syncing to production
   ```bash
   cd backend
   npm run dev
   # Test all features work
   ```

2. **Commit changes before syncing**
   ```powershell
   git add -A
   git commit -m "Add new feature"
   .\scripts\quick-sync.ps1
   ```

3. **Keep your local database current** - it's the source of truth
   ```bash
   node backend/scripts/migrate.js  # Run migrations
   .\scripts\quick-sync.ps1          # Sync to production
   ```

4. **Check TablePlus after sync**
   - Verify table counts match (should have 29 tables)
   - Check admin users exist
   - Run the verification queries at bottom of sync script

## 🔗 Related Files

- `backend/scripts/generate-sync.js` - The script that generates SQL
- `backend/sql/backups/` - Generated sync scripts saved here
- `backend/.env` - Database credentials (automatically read)
- `backend/sql/SYNC_PRODUCTION.sql` - Manual sync (if you prefer)

## 📞 Need Help?

If you see errors:
1. Check the generated SQL file in `backend/sql/backups/`
2. Make sure TablePlus is connected to Railway (test the connection)
3. Verify your local database is running (`mysql.server status` or check services)
4. Check verification queries in the generated SQL show expected results

## ⚡ Why This Method?

**No MySQL client tools needed!** The old method required `mysqldump` and `mysql` command-line tools. This new method:
- ✅ Uses Node.js (already installed)
- ✅ Reads your `.env` automatically
- ✅ Generates clean SQL you can review
- ✅ Works on any machine with Node.js
- ✅ No extra software to install

You just generate the SQL, review it, and execute in TablePlus!
