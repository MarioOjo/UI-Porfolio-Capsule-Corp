async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
      <h2>🔒 Capsule Corp Password Reset</h2>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#3B4CCA;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
      <hr>
      <small>If you did not request this, please ignore this email.</small>
    </div>
  `;
  return sendEmail({ to, subject: 'Capsule Corp Password Reset', html });
}


let resend = null;
if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
}

async function sendEmail({ to, subject, html, reply_to }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }
  return resend.emails.send({
    from: 'Capsule Corp <noreply@send.capsulecorps.dev>', // Verified sender domain
    to,
    subject,
    html,
    reply_to
  });
}

async function sendContactNotification(contactData) {
  const { name, email, subject, message } = contactData;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
      <h2>🚀 New Contact Form Submission</h2>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <small>Received at ${new Date().toLocaleString()}</small>
    </div>
  `;
  return sendEmail({
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `[Capsule Corp Contact] ${subject}`,
    html,
    reply_to: email
  });
}

async function sendCustomerConfirmation(contactData) {
  const { name, email, subject } = contactData;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9fafb; border-radius:8px;">
      <div style="text-align:center; margin-bottom:20px;">
        <h1 style="color:#3B4CCA; margin:0;">🚀 Capsule Corp</h1>
      </div>
      <div style="background:#fff; padding:30px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color:#1f2937; margin-top:0;">Thanks for reaching out, ${name}! 👋</h2>
        <p style="color:#4b5563; line-height:1.6;">
          We've received your message about "<strong>${subject}</strong>" and our Z-Fighter support team will respond within 24 hours.
        </p>
        <div style="background:#eff6ff; border-left:4px solid #3B4CCA; padding:15px; margin:20px 0; border-radius:4px;">
          <p style="margin:0; color:#1e40af;">
            <strong>💡 Pro Tip:</strong> Check your spam folder if you don't see our response in your inbox!
          </p>
        </div>
        <p style="color:#4b5563; line-height:1.6;">
          In the meantime, feel free to explore our products or check your order status.
        </p>
        <div style="text-align:center; margin:30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://capsulecorps.dev'}" 
             style="background:#3B4CCA; color:#fff; padding:12px 30px; border-radius:6px; text-decoration:none; display:inline-block; font-weight:bold;">
            Visit Capsule Corp
          </a>
        </div>
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">
        <p style="color:#6b7280; font-size:14px; line-height:1.5;">
          <strong>Need immediate assistance?</strong><br>
          📧 Email: <a href="mailto:support@send.capsulecorps.dev" style="color:#3B4CCA;">support@send.capsulecorps.dev</a><br>
          🌐 Website: <a href="${process.env.FRONTEND_URL || 'https://capsulecorps.dev'}" style="color:#3B4CCA;">capsulecorps.dev</a>
        </p>
      </div>
      <p style="text-align:center; color:#9ca3af; font-size:12px; margin-top:20px;">
        © ${new Date().getFullYear()} Capsule Corp. All rights reserved.<br>
        Powering the future with Capsule Technology 🎯
      </p>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: '✅ We received your message - Capsule Corp',
    html,
  });
}

module.exports = { sendEmail, sendContactNotification, sendCustomerConfirmation };
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
