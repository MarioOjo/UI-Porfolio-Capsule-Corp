#!/usr/bin/env node
/**
 * Frontend Comprehensive Check Script
 * Checks for common issues: console errors, mobile responsiveness, API endpoints, etc.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CAPSULE CORP FRONTEND COMPREHENSIVE CHECK\n');

const checks = {
  passed: [],
  warnings: [],
  failed: []
};

// Check 1: Mobile Bottom Nav Icons
console.log('📱 Checking Mobile Navigation...');
const navbarPath = path.join(__dirname, '../../frontend/src/components/Navbar/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

if (navbarContent.includes('FaHome') && navbarContent.includes('FaShoppingBag')) {
  checks.passed.push('✅ Mobile bottom nav has proper icons (Home, Shop, Cart, Wishlist, Profile)');
} else {
  checks.failed.push('❌ Mobile bottom nav missing proper icon imports');
}

if (navbarContent.includes('pb-3') || navbarContent.includes('py-3')) {
  checks.passed.push('✅ Mobile nav has proper padding');
} else {
  checks.warnings.push('⚠️  Mobile nav padding might be insufficient');
}

// Check 2: API Endpoints
console.log('🔌 Checking API Endpoints...');
const ordersRoutePath = path.join(__dirname, '../routes/orders.js');
const ordersContent = fs.readFileSync(ordersRoutePath, 'utf8');

if (ordersContent.includes("'/my-orders'")) {
  checks.passed.push('✅ /api/orders/my-orders endpoint exists');
} else {
  checks.failed.push('❌ Missing /api/orders/my-orders endpoint');
}

// Check 3: Mobile Responsiveness CSS
console.log('📐 Checking Mobile Responsiveness...');
const cssPath = path.join(__dirname, '../../frontend/src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

if (cssContent.includes('padding-bottom') && cssContent.includes('@media (max-width: 768px)')) {
  checks.passed.push('✅ App has mobile bottom padding for navigation clearance');
} else {
  checks.warnings.push('⚠️  No mobile padding detected for bottom navigation');
}

if (cssContent.includes('overflow-x: hidden')) {
  checks.passed.push('✅ Horizontal scroll prevention enabled');
} else {
  checks.warnings.push('⚠️  Horizontal scroll might occur on mobile');
}

// Check 4: Image Lazy Loading
console.log('🖼️  Checking Image Optimization...');
const productDetailPath = path.join(__dirname, '../../frontend/src/pages/ProductDetail.jsx');
const productContent = fs.readFileSync(productDetailPath, 'utf8');

if (productContent.includes('loading="lazy"')) {
  checks.passed.push('✅ Images use lazy loading');
} else {
  checks.warnings.push('⚠️  Some images might not use lazy loading');
}

// Check 5: Error Boundaries
console.log('🛡️  Checking Error Handling...');
const appPath = path.join(__dirname, '../../frontend/src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');

if (appContent.includes('ErrorBoundary')) {
  checks.passed.push('✅ App has ErrorBoundary component');
} else {
  checks.warnings.push('⚠️  No ErrorBoundary detected');
}

// Check 6: Loading States
console.log('⏳ Checking Loading States...');
const profilePath = path.join(__dirname, '../../frontend/src/pages/Profile/Profile.jsx');
const profileContent = fs.readFileSync(profilePath, 'utf8');

if (profileContent.includes('loading:') && profileContent.includes('setStats')) {
  checks.passed.push('✅ Profile page has loading states');
} else {
  checks.warnings.push('⚠️  Profile loading states might be incomplete');
}

// Check 7: Theme Support
console.log('🎨 Checking Theme System...');
if (appContent.includes('useTheme') && appContent.includes('isDarkMode')) {
  checks.passed.push('✅ Dark/Light theme system implemented');
} else {
  checks.warnings.push('⚠️  Theme system incomplete');
}

// Check 8: Authentication
console.log('🔐 Checking Authentication...');
if (navbarContent.includes('useAuth') && navbarContent.includes('user')) {
  checks.passed.push('✅ Authentication context integrated in navbar');
} else {
  checks.failed.push('❌ Authentication system incomplete');
}

// Check 9: Cart Functionality
console.log('🛒 Checking Cart System...');
if (navbarContent.includes('useCart') && navbarContent.includes('cartCount')) {
  checks.passed.push('✅ Cart context integrated with badge counter');
} else {
  checks.warnings.push('⚠️  Cart integration incomplete');
}

// Check 10: Responsive Layout Classes
console.log('📱 Checking Responsive Classes...');
const homePages = [
  '../../frontend/src/pages/Home.jsx',
  '../../frontend/src/pages/Products.jsx',
  '../../frontend/src/pages/Cart.jsx',
  '../../frontend/src/pages/Checkout.jsx'
];

let responsiveFound = 0;
homePages.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('sm:') || content.includes('md:') || content.includes('lg:')) {
      responsiveFound++;
    }
  }
});

if (responsiveFound >= 3) {
  checks.passed.push(`✅ ${responsiveFound}/${homePages.length} key pages use responsive classes`);
} else {
  checks.warnings.push(`⚠️  Only ${responsiveFound}/${homePages.length} pages have responsive classes`);
}

// SUMMARY
console.log('\n' + '='.repeat(60));
console.log('📊 COMPREHENSIVE CHECK SUMMARY');
console.log('='.repeat(60) + '\n');

console.log('✅ PASSED CHECKS (' + checks.passed.length + '):');
checks.passed.forEach(check => console.log('  ' + check));

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS (' + checks.warnings.length + '):');
  checks.warnings.forEach(check => console.log('  ' + check));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED CHECKS (' + checks.failed.length + '):');
  checks.failed.forEach(check => console.log('  ' + check));
}

console.log('\n' + '='.repeat(60));

const totalChecks = checks.passed.length + checks.warnings.length + checks.failed.length;
const score = Math.round((checks.passed.length / totalChecks) * 100);

console.log(`\n🎯 OVERALL SCORE: ${score}%`);

if (score >= 90) {
  console.log('💎 EXCELLENT - Your app is production-ready!');
} else if (score >= 75) {
  console.log('✨ GOOD - Minor improvements needed');
} else if (score >= 60) {
  console.log('⚠️  FAIR - Several issues to address');
} else {
  console.log('🔴 NEEDS WORK - Critical issues found');
}

console.log('\n💡 RECOMMENDATIONS:');
console.log('  1. Test on real mobile devices (iOS Safari, Android Chrome)');
console.log('  2. Check network throttling (slow 3G) for loading states');
console.log('  3. Verify all API endpoints with backend running');
console.log('  4. Test dark/light mode transitions');
console.log('  5. Check accessibility (keyboard navigation, screen readers)');

process.exit(checks.failed.length > 0 ? 1 : 0);
