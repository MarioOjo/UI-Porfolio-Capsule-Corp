#!/usr/bin/env node
/**
 * Test Email Service Script
 * Tests the Resend email functionality with verified domain
 */

require('dotenv').config();
const { sendEmail, sendContactNotification, sendCustomerConfirmation } = require('../src/utils/emailService');

async function testEmailService() {
  console.log('🧪 Testing Capsule Corp Email Service...\n');

  try {
    // Test 1: Basic Email Send
    console.log('📧 Test 1: Sending basic test email...');
    await sendEmail({
      to: process.env.EMAIL_TO || 'capsulecorp.8999@gmail.com',
      subject: '✅ Test Email from Capsule Corp',
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>🚀 Email Service Test Successful!</h2>
          <p>Your Resend integration is working correctly with:</p>
          <ul>
            <li>Domain: <strong>send.capsulecorps.dev</strong></li>
            <li>From: <strong>noreply@send.capsulecorps.dev</strong></li>
            <li>DNS: <strong>Fully Verified</strong> ✅</li>
          </ul>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    console.log('✅ Basic email sent successfully!\n');

    // Test 2: Contact Form Admin Notification
    console.log('📧 Test 2: Sending contact notification email...');
    await sendContactNotification({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Email Service Test',
      message: 'This is a test message to verify the contact form email system is working correctly.'
    });
    console.log('✅ Contact notification sent successfully!\n');

    // Test 3: Customer Confirmation
    console.log('📧 Test 3: Sending customer confirmation email...');
    await sendCustomerConfirmation({
      name: 'Test User',
      email: process.env.EMAIL_TO || 'capsulecorp.8999@gmail.com',
      subject: 'Email Service Test'
    });
    console.log('✅ Customer confirmation sent successfully!\n');

    console.log('🎉 ALL EMAIL TESTS PASSED!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Basic email sending: Working');
    console.log('   ✅ Admin notifications: Working');
    console.log('   ✅ Customer confirmations: Working');
    console.log('   ✅ Verified domain: send.capsulecorps.dev');
    console.log('\n💡 Your contact form is ready to use!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    if (error.message.includes('API key')) {
      console.error('\n💡 Tip: Make sure RESEND_API_KEY is set in your .env file');
    }
    if (error.message.includes('domain')) {
      console.error('\n💡 Tip: Make sure send.capsulecorps.dev is verified in Resend dashboard');
    }
    process.exit(1);
  }
}

// Run the test
testEmailService();
