
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
