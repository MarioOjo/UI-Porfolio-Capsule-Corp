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


const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }
  return resend.emails.send({
    from: 'onboarding@resend.dev', // Or your verified sender
    to,
    subject,
    html,
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
  });
}

module.exports = { sendEmail, sendContactNotification };
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
