/**
 * Review System Test Script
 * Tests all review endpoints and functionality
 */

const ReviewModel = require('../src/models/ReviewModel');

async function testReviewSystem() {
  console.log('\n🧪 TESTING REVIEW SYSTEM\n');
  console.log('='.repeat(50));
  const db = require('../src/config/database');
  await db.initialize();
  console.log('Active DB:', db.getResolvedConfig());
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Pick an existing product and user from the database to avoid FK issues
  const productRow = await db.executeQuery('SELECT id FROM products LIMIT 1');
  const userRow = await db.executeQuery('SELECT id FROM users LIMIT 1');
  const testProductId = productRow[0]?.id || 1;
  const testUserId = userRow[0]?.id || 1;
  let createdReviewId = null;
  
  // Test 1: Fetch reviews for a product
  try {
    console.log('\n1️⃣ Testing fetchReviews...');
    const reviews = await ReviewModel.findByProductId(testProductId);
    console.log(`   ✅ Fetched ${reviews.length} reviews for product ${testProductId}`);
    results.passed++;
    results.tests.push({ name: 'Fetch Reviews', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to fetch reviews: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Fetch Reviews', status: 'FAIL', error: error.message });
  }
  
  // Test 2: Get average rating
  try {
    console.log('\n2️⃣ Testing getAverageRating...');
    const stats = await ReviewModel.getAverageRating(testProductId);
    console.log(`   ✅ Average rating: ${stats.averageRating}, Total: ${stats.totalReviews}`);
    results.passed++;
    results.tests.push({ name: 'Get Average Rating', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to get average rating: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Get Average Rating', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Get rating distribution
  try {
    console.log('\n3️⃣ Testing getRatingDistribution...');
    const distribution = await ReviewModel.getRatingDistribution(testProductId);
    console.log(`   ✅ Distribution:`, distribution);
    results.passed++;
    results.tests.push({ name: 'Get Rating Distribution', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to get rating distribution: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Get Rating Distribution', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Create a review
  try {
    console.log('\n4️⃣ Testing createReview...');
    const newReview = await ReviewModel.create({
      productId: testProductId,
      userId: testUserId,
      rating: 5,
      title: 'Test Review - Automated Test',
      comment: 'This is a test review created by the automated test script. Please ignore.',
      verifiedPurchase: true
    });
    createdReviewId = newReview.id;
    console.log(`   ✅ Created review with ID: ${createdReviewId}`);
    results.passed++;
    results.tests.push({ name: 'Create Review', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to create review: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Create Review', status: 'FAIL', error: error.message });
  }
  
  // Test 5: Update review
  if (createdReviewId) {
    try {
      console.log('\n5️⃣ Testing updateReview...');
      const updated = await ReviewModel.update(createdReviewId, testUserId, {
        rating: 4,
        title: 'Updated Test Review',
        comment: 'This review has been updated by the automated test script.'
      });
      console.log(`   ✅ Updated review ID: ${updated.id}`);
      results.passed++;
      results.tests.push({ name: 'Update Review', status: 'PASS' });
    } catch (error) {
      console.log(`   ❌ Failed to update review: ${error.message}`);
      results.failed++;
      results.tests.push({ name: 'Update Review', status: 'FAIL', error: error.message });
    }
  }
  
  // Test 6: Get user review
  try {
    console.log('\n6️⃣ Testing getUserReview...');
    const userReview = await ReviewModel.getUserReview(testUserId, testProductId);
    if (userReview) {
      console.log(`   ✅ Found user review: "${userReview.title}"`);
    } else {
      console.log(`   ✅ No review found for this user (expected if no review exists)`);
    }
    results.passed++;
    results.tests.push({ name: 'Get User Review', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to get user review: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Get User Review', status: 'FAIL', error: error.message });
  }
  
  // Test 7: Mark review as helpful
  if (createdReviewId) {
    try {
      console.log('\n7️⃣ Testing markHelpful...');
      const result = await ReviewModel.markHelpful(createdReviewId, testUserId + 1); // Different user
      console.log(`   ✅ Marked as helpful: ${result.success}, Helpful count: ${result.helpful}`);
      results.passed++;
      results.tests.push({ name: 'Mark Helpful', status: 'PASS' });
    } catch (error) {
      console.log(`   ❌ Failed to mark as helpful: ${error.message}`);
      results.failed++;
      results.tests.push({ name: 'Mark Helpful', status: 'FAIL', error: error.message });
    }
  }
  
  // Test 8: Sorting reviews
  try {
    console.log('\n8️⃣ Testing review sorting...');
    const recentReviews = await ReviewModel.findByProductId(testProductId, { sortBy: 'recent' });
    const helpfulReviews = await ReviewModel.findByProductId(testProductId, { sortBy: 'helpful' });
    console.log(`   ✅ Recent sort: ${recentReviews.length} reviews`);
    console.log(`   ✅ Helpful sort: ${helpfulReviews.length} reviews`);
    results.passed++;
    results.tests.push({ name: 'Review Sorting', status: 'PASS' });
  } catch (error) {
    console.log(`   ❌ Failed to sort reviews: ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'Review Sorting', status: 'FAIL', error: error.message });
  }
  
  // Test 9: Delete review (cleanup)
  if (createdReviewId) {
    try {
      console.log('\n9️⃣ Testing deleteReview (cleanup)...');
      const deleted = await ReviewModel.delete(createdReviewId, testUserId);
      console.log(`   ✅ Deleted test review: ${deleted}`);
      results.passed++;
      results.tests.push({ name: 'Delete Review', status: 'PASS' });
    } catch (error) {
      console.log(`   ❌ Failed to delete review: ${error.message}`);
      results.failed++;
      results.tests.push({ name: 'Delete Review', status: 'FAIL', error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📝 Total:  ${results.passed + results.failed}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Review system is working correctly.');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED. Please check the errors above.');
    console.log('\nFailed tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
  }
  
  console.log('\n');
  
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
testReviewSystem().catch(error => {
  console.error('\n❌ Fatal error running tests:', error);
  process.exit(1);
});
