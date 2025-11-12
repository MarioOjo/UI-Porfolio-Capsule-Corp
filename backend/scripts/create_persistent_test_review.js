// Script to create a persistent test review for admin confirmation
const db = require('../src/config/database');
const ReviewModel = require('../src/models/ReviewModel');

(async () => {
  await db.initialize();
  // Pick an existing product and user
  const [productRow] = await db.executeQuery('SELECT id FROM products LIMIT 1');
  const [userRow] = await db.executeQuery('SELECT id FROM users LIMIT 1');
  const productId = productRow?.id || 1;
  const userId = userRow?.id || 1;

  // Create a test review
  const review = await ReviewModel.create({
    productId,
    userId,
    rating: 5,
    title: 'Persistent Test Review',
    comment: 'This review was created for admin confirmation. It will not be deleted automatically.',
    verifiedPurchase: true
  });
  console.log('✅ Persistent test review created:', review);
  await db.closeConnection();
})();
