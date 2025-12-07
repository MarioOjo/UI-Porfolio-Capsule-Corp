# Backend Scripts

Utility and maintenance scripts for the Capsule Corp backend.

## Active Scripts

- **`check_products.js`** - Verify products table data integrity
- **`print_capsules.js`** - Display capsule products from database
- **`reset_admin_password.js`** - Reset admin user password
- **`seed_admin_roles.js`** - Initialize admin roles in database
- **`migrate_returns.js`** - Create returns and return_items tables
- **`debug_db.js`** - Database inspection and debugging tool

## Legacy/Recovery Scripts

- **`replace_capsules.js`** - Historical script for capsule product recovery
  - Creates backup table `capsule_products_backup_20251027`
  - Restores capsules with IDs 13-18 from October 2025 snapshot
  - **Status**: Keep for emergency data recovery, but consider outdated for regular use
  - **Note**: Backup table may not exist in current database

## Usage

Run scripts from the `backend/` directory:

```bash
node scripts/script_name.js
```

Most scripts require `.env` configuration with database credentials.
