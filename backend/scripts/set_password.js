const bcrypt = require('bcrypt');
const db = require('../src/config/database');

async function setPassword() {
    try {
        await db.initialize();
        
        const email = process.argv[2] || 'mario@capsulecorp.com';
        const password = process.argv[3] || 'Mario2025!';
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await db.executeQuery(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [hashedPassword, email]
        );
        
        console.log(`✅ Password updated for: ${email}`);
        console.log(`   New password: ${password}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.closeConnection();
        process.exit(0);
    }
}

setPassword();
