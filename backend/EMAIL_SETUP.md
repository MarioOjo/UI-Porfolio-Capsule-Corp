# Email Configuration Guide

The contact form can send emails using Nodemailer. Email configuration is **optional** - the contact form will still save messages to the database even without email configured.

## Quick Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to `.env` file**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=support@yourdomain.com
```

4. **Restart the server** - you should see:
```
✅ Email service initialized successfully
```

## Other Email Providers

### Outlook / Office 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### SendGrid (Production Recommended)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASS=your-mailgun-password
```

## How It Works

When a user submits the contact form:

1. **Message saved to database** (always happens)
2. **Admin notification email sent** - You receive the contact details
3. **Customer confirmation email sent** - User gets auto-reply confirming receipt

## Testing

Test the contact form at: `http://localhost:3000/contact`

## Troubleshooting

### "Email service not configured" warning
- This is normal if you haven't set up email
- Contact form still works, just won't send emails

### "Email service initialization failed"
- Check your EMAIL_USER and EMAIL_PASS are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Check firewall isn't blocking outgoing SMTP connections

### Emails not arriving
- Check spam folder
- Verify EMAIL_TO address is correct
- Check server logs for error messages

## Production Tips

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Don't use personal Gmail** for production
3. **Monitor email delivery** rates
4. **Set up SPF/DKIM** records for better deliverability
