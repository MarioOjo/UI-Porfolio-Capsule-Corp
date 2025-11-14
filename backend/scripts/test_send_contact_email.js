
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { sendContactNotification, sendCustomerConfirmation } = require('../src/utils/emailService');

(async () => {
  // Simulate contact form submission
  const contactData = {
    name: 'Test User',
    email: 'capsulecorp.8999@gmail.com',
    subject: 'Test Contact Form',
    message: 'This is a test message from the Capsule Corp contact form.'
  };
  try {
    // Send notification to admin
    await sendContactNotification(contactData);
    // Send confirmation to user
    await sendCustomerConfirmation(contactData);
    console.log('✅ Test emails sent successfully.');
  } catch (err) {
    console.error('❌ Error sending test emails:', err);
  }
})();