const database = require('../src/config/database');

async function addAddressColumns() {
  try {
    await database.initialize();
    console.log('✅ Database connected\n');

    const columns = [
      { name: 'full_name', type: 'VARCHAR(255)', default: "''" },
      { name: 'phone', type: 'VARCHAR(50)', default: "''" },
      { name: 'type', type: 'VARCHAR(50)', default: "'home'" },
      { name: 'is_default', type: 'BOOLEAN', default: '0' }
    ];

    for (const col of columns) {
      try {
        await database.executeQuery(
          `ALTER TABLE user_addresses ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default}`
        );
        console.log(`✅ Added column: ${col.name}`);
      } catch (error) {
        if (error.message.includes('Duplicate column')) {
          console.log(`⚠️  Column ${col.name} already exists`);
        } else {
          console.error(`❌ Error adding ${col.name}:`, error.message);
        }
      }
    }

    console.log('\n✅ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAddressColumns();
