# 🚀 Automated Database Sync Tool

This PowerShell script automatically syncs your local database structure to Railway production with one command.

## 📋 Prerequisites

1. **MySQL Client Tools** installed (mysqldump and mysql commands)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or via Chocolatey: `choco install mysql`

2. **Railway Database** credentials configured in the script
   - Already configured with your Railway credentials

## 🎯 Usage

### Basic Sync (with safety prompts)
```powershell
.\scripts\sync-to-production.ps1
```

This will:
1. ✅ Backup production database
2. ✅ Export local schema
3. ✅ Generate sync script
4. ✅ Ask for confirmation
5. ✅ Apply changes to production

### Dry Run (preview without changes)
```powershell
.\scripts\sync-to-production.ps1 -DryRun
```

This generates the sync files but **doesn't apply** them. Use this to:
- See what changes would be made
- Review the generated SQL
- Test the script safely

### Skip Backup (faster, but risky)
```powershell
.\scripts\sync-to-production.ps1 -SkipBackup
```

⚠️ **Not recommended** unless you're sure!

## 📁 Generated Files

All files are saved to `backend/sql/backups/`:

- `production_backup_YYYYMMDD_HHMMSS.sql` - Production database backup
- `local_schema_YYYYMMDD_HHMMSS.sql` - Your local database schema
- `sync_script_YYYYMMDD_HHMMSS.sql` - The actual sync script

## 🔄 Typical Workflow

1. **Make changes to local database**
   ```bash
   # Example: Add a new column
   ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
   ```

2. **Test locally**
   ```bash
   npm run dev
   # Test your changes work
   ```

3. **Sync to production**
   ```powershell
   .\scripts\sync-to-production.ps1
   ```

4. **Verify production**
   - Test your production app
   - Check Railway logs
   - Verify data integrity

## 🛡️ Safety Features

- ✅ **Automatic backups** before any changes
- ✅ **Confirmation prompt** before applying
- ✅ **Dry run mode** for testing
- ✅ **Keeps last 10 backups** automatically
- ✅ **Detailed logging** of all operations

## 🚨 If Something Goes Wrong

### Restore from backup
```powershell
mysql -h gondola.proxy.rlwy.net -P 38169 -u root -p railway < backend\sql\backups\production_backup_YYYYMMDD_HHMMSS.sql
```

### Manual sync via TablePlus
1. Open the generated sync script: `backend/sql/backups/sync_script_YYYYMMDD_HHMMSS.sql`
2. Connect to Railway database in TablePlus
3. Review the SQL
4. Execute manually

## 📝 What Gets Synced

- ✅ **Table structures** (CREATE TABLE)
- ✅ **Column definitions** (data types, constraints)
- ✅ **Indexes** (primary keys, foreign keys, indexes)
- ✅ **Triggers** (if any)
- ✅ **Stored procedures** (if any)

**NOT synced:**
- ❌ **Data** (existing records stay intact)
- ❌ **User accounts** (MySQL users)
- ❌ **Privileges** (database permissions)

## 🎨 Example Output

```
🚀 Railway Production Database Sync Tool
=========================================

🔍 Checking prerequisites...
   ✅ mysqldump found
   ✅ mysql client found

📦 Step 1: Backing up production database...
   ✅ Backup saved: backend\sql\backups\production_backup_20250111_143022.sql (145.3 KB)

📤 Step 2: Dumping local database schema...
   ✅ Local schema exported: backend\sql\backups\local_schema_20250111_143022.sql

🔧 Step 3: Generating sync script...
   ✅ Sync script generated: backend\sql\backups\sync_script_20250111_143022.sql

🚀 Step 4: Applying changes to production...
   ⚠️  WARNING: This will modify your production database!
   📦 Backup saved at: backend\sql\backups\production_backup_20250111_143022.sql

   Type 'YES' to continue: YES

   📡 Connecting to Railway production database...
   ✅ Sync script applied successfully!

🎉 SYNC COMPLETE!
```

## 🤔 Common Issues

### "mysqldump not found"
**Solution:** Install MySQL client tools
```powershell
choco install mysql
```

### "Access denied for user"
**Solution:** Check credentials in the script (lines 21-28)

### "Table already exists"
**Solution:** The script handles this automatically with `IF NOT EXISTS`

### Sync is too slow
**Solution:** Use `-SkipBackup` flag (but have a recent backup!)

## 💡 Pro Tips

1. **Always dry run first** when making major changes
   ```powershell
   .\scripts\sync-to-production.ps1 -DryRun
   ```

2. **Commit changes before syncing**
   ```bash
   git add -A
   git commit -m "Add new feature"
   .\scripts\sync-to-production.ps1
   ```

3. **Keep backups** - the script keeps last 10 automatically

4. **Test locally first** - never sync untested changes

## 📞 Need Help?

If the script fails:
1. Check the error message
2. Review generated SQL in `backend/sql/backups/`
3. Try manual sync via TablePlus
4. Restore from backup if needed

## 🔗 Related Files

- `backend/sql/SYNC_PRODUCTION.sql` - Manual sync script (backup method)
- `backend/sql/VERIFY_AFTER_SYNC.sql` - Verification queries
- `backend/scripts/audit_local_database.js` - Database health check
