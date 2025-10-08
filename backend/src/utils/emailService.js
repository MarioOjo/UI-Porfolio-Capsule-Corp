const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email transporter with configuration from environment variables
   */
  async initialize() {
    try {
      // Check if email is configured
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.warn('⚠️  Email service not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactNotification(contactData) {
    if (!this.initialized) {
      console.warn('Email service not initialized, skipping email send');
      return false;
    }

    try {
      const { name, email, subject, message } = contactData;

      const mailOptions = {
        from: `"Capsule Corp Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `[Capsule Corp Contact] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3B4CCA 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #3B4CCA; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
              .message-box { background: white; padding: 15px; border-left: 4px solid #3B4CCA; border-radius: 5px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🚀 New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Capsule Corporation Support System</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">📝 Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="label">👤 Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">📧 Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">💬 Message:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="footer">
                  <p>Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>
                  <p>Reply directly to this email to respond to ${name}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
New Contact Form Submission - Capsule Corp

Subject: ${subject}
Name: ${name}
Email: ${email}

Message:
${message}

---
Received at ${new Date().toLocaleString()}
Reply to: ${email}
        `.trim(),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact notification email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send contact notification:', error.message);
      return false;
    }
  }

  /**
   * Send auto-reply confirmation to customer
   */
  async sendCustomerConfirmation(contactData) {
    if (!this.initialized) {
      return false;
    }

    try {
      const { name, email, subject } = contactData;

      const mailOptions = {
        from: `"Capsule Corp Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Re: ${subject} - We received your message!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3B4CCA 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .message { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
              .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
              .btn { display: inline-block; background: #3B4CCA; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">⚡ Power Level Confirmed!</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Message Received at Capsule Corp HQ</p>
              </div>
              <div class="content">
                <div class="message">
                  <p>Hi <strong>${name}</strong>,</p>
                  
                  <p>Thanks for contacting Capsule Corporation! We've received your message about:</p>
                  
                  <p style="background: #eff6ff; padding: 15px; border-left: 4px solid #3B4CCA; margin: 20px 0;">
                    <strong>"${subject}"</strong>
                  </p>
                  
                  <p>Our legendary Z-Fighter support team has been notified and will respond within <strong>24 hours</strong>.</p>
                  
                  <p>In the meantime, feel free to browse our latest gear and power-ups:</p>
                  
                  <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/products" class="btn">
                      🚀 Browse Products
                    </a>
                  </div>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                  <strong>Need immediate assistance?</strong><br>
                  📞 Call us: +1 (555) CAPSULE<br>
                  📧 Email: capsulecorp.8999@gmail.com
                </p>
              </div>
              <div class="footer">
                <p style="margin: 0;"><strong>Capsule Corporation</strong></p>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">Empowering Earth's Warriors Since 1985</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Hi ${name},

Thanks for contacting Capsule Corporation! We've received your message about "${subject}".

Our legendary Z-Fighter support team has been notified and will respond within 24 hours.

In the meantime, feel free to browse our latest gear and power-ups at:
${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/products

Need immediate assistance?
Phone: +1 (555) CAPSULE
Email: capsulecorp.8999@gmail.com

---
Capsule Corporation
Empowering Earth's Warriors Since 1985
        `.trim(),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Customer confirmation email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send customer confirmation:', error.message);
      return false;
    }
  }

  /**
   * Send order status update notification to customer
   */
  async sendOrderStatusUpdate(customerEmail, customerName, orderNumber, newStatus, trackingNumber = null) {
    if (!this.initialized) {
      console.warn('Email service not initialized, skipping status update email');
      return false;
    }

    try {
      const statusEmojis = {
        pending: '🕐',
        processing: '📦',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌'
      };

      const statusMessages = {
        pending: 'Your order has been received and is awaiting processing.',
        processing: 'Your order is being prepared for shipment!',
        shipped: 'Your order is on its way to you!',
        delivered: 'Your order has been delivered. Enjoy your Capsule Corp gear!',
        cancelled: 'Your order has been cancelled.'
      };

      const statusColors = {
        pending: '#EAB308',
        processing: '#3B82F6',
        shipped: '#A855F7',
        delivered: '#10B981',
        cancelled: '#EF4444'
      };

      const trackingSection = trackingNumber ? `
        <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #A855F7; margin: 0 0 10px 0;">🚛 Tracking Information</h3>
          <p style="margin: 5px 0;"><strong>Tracking Number:</strong> <span style="font-family: monospace; background: white; padding: 5px 10px; border-radius: 5px;">${trackingNumber}</span></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #6B7280;">You can track your package using this number with your carrier.</p>
        </div>
      ` : '';

      const mailOptions = {
        from: `"Capsule Corp Orders" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `${statusEmojis[newStatus]} Order ${orderNumber} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FF6B35 0%, #3B4CCA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #E5E7EB; }
              .status-badge { background: ${statusColors[newStatus]}; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; margin: 10px 0; }
              .order-number { background: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .btn { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { background: #1F2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">${statusEmojis[newStatus]} Order Status Update</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Capsule Corporation</p>
              </div>
              <div class="content">
                <p>Hi <strong>${customerName}</strong>,</p>
                
                <p>Great news! Your order status has been updated:</p>
                
                <div style="text-align: center;">
                  <span class="status-badge">${newStatus.toUpperCase()}</span>
                </div>
                
                <p style="font-size: 16px; color: #6B7280;">${statusMessages[newStatus]}</p>
                
                <div class="order-number">
                  <p style="margin: 0; color: #6B7280; font-size: 14px;">Order Number</p>
                  <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; font-family: monospace; color: #FF6B35;">${orderNumber}</p>
                </div>
                
                ${trackingSection}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/track-order" class="btn">
                    Track Your Order
                  </a>
                </div>
                
                <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                  <strong>Questions?</strong> Contact our support team anytime.<br>
                  📧 capsulecorp.8999@gmail.com | 📞 +1 (555) CAPSULE
                </p>
              </div>
              <div class="footer">
                <p style="margin: 0;"><strong>Capsule Corporation</strong></p>
                <p style="margin: 5px 0; opacity: 0.8;">Empowering Earth's Warriors</p>
                <p style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.7;">
                  This is an automated notification. Please do not reply to this email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
${statusEmojis[newStatus]} ORDER STATUS UPDATE - Capsule Corporation

Hi ${customerName},

Your order status has been updated to: ${newStatus.toUpperCase()}

${statusMessages[newStatus]}

Order Number: ${orderNumber}

${trackingNumber ? `
Tracking Information:
Tracking Number: ${trackingNumber}
You can track your package using this number with your carrier.
` : ''}

Track your order anytime at:
${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/track-order

Questions? Contact our support team:
Email: capsulecorp.8999@gmail.com
Phone: +1 (555) CAPSULE

---
Capsule Corporation
Empowering Earth's Warriors
        `.trim(),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Order status update email sent to ${customerEmail}:`, info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send order status update:', error.message);
      return false;
    }
  }
}

// Export singleton instance
const emailService = new EmailService();
module.exports = emailService;
