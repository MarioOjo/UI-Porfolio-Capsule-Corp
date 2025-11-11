# 🎯 Your New Database Sync Workflow

## The Problem You Had
You were manually keeping Railway production database in sync with your local dev database using SQL scripts in TablePlus. Every time you made local changes, you had to manually update production.

## The Solution  
**Automated sync in one command!**

## How to Use

### Every time you make local database changes:

```powershell
# 1. Make your changes locally
# (migrations, ALTER TABLE, CREATE TABLE, etc.)

# 2. Test locally
cd backend
npm run dev
# Test everything works

# 3. Generate sync script
cd ..
.\scripts\quick-sync.ps1

# 4. Apply in TablePlus
# - Open TablePlus
# - Connect to Railway
# - Execute the generated SQL file
# - Done!
```

## What It Does

1. **Reads your local database** (all 29 tables)
2. **Generates CREATE TABLE statements** with `IF NOT EXISTS`
3. **Creates a SQL file** you can review and execute in TablePlus
4. **Sets admin roles** automatically
5. **Includes verification queries** to confirm sync worked

## Key Benefits

✅ **No mysqldump needed** - uses Node.js only  
✅ **Automatic credentials** - reads from your `.env`  
✅ **Safe** - review SQL before applying  
✅ **Fast** - generates in seconds  
✅ **Repeatable** - run as many times as needed  

## Files Generated

Every sync creates:
```
backend/sql/backups/auto_sync_2025-11-11T15-52-53.sql
```

This file contains:
- All 29 table CREATE statements
- Admin role updates
- Verification queries

## Example Workflow

```powershell
# Add a new feature locally
cd backend
node scripts/migrate.js
# or manually: ALTER TABLE users ADD COLUMN...

# Test it
npm run dev

# Sync to production
cd ..
.\scripts\quick-sync.ps1

# Apply in TablePlus
# Copy generated file path
# Open in TablePlus
# Execute
```

## Important Notes

- **Local is source of truth** - your local database structure will be synced to production
- **Data is NOT synced** - only table structures (columns, indexes, etc.)
- **Safe to run multiple times** - uses `IF NOT EXISTS`
- **Review SQL first** - always check the generated file before applying

## Verification

After applying in TablePlus, check the verification queries at the bottom:

```sql
-- Should show 29 tables
SHOW TABLES;

-- Should show admin users
SELECT * FROM users WHERE role = 'admin';

-- Should show table counts
SELECT COUNT(*) FROM orders;
```

## Next Steps

1. **Try it now**: `.\scripts\quick-sync.ps1`
2. **Apply the generated SQL** in TablePlus
3. **Verify** your production database matches local
4. **Use this workflow** every time you make local database changes

## Questions?

See `scripts/SYNC_README.md` for full documentation.

---

**You're now set up for easy database syncing! 🚀**

No more manual SQL queries. Just run `quick-sync.ps1` and apply in TablePlus.
