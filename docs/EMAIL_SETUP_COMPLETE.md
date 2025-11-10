# 📧 Capsule Corp Email Configuration - COMPLETE SETUP

## ✅ STATUS: FULLY OPERATIONAL

**Domain:** capsulecorps.dev  
**Sending Domain:** send.capsulecorps.dev  
**Email Service:** Resend  
**DNS Provider:** names.com  
**Last Verified:** November 10, 2025

---

## 🎯 Current Configuration

### DNS Records (Verified ✅)

| Type | Host | Answer | Priority | Status |
|------|------|--------|----------|--------|
| **MX** | send.capsulecorps.dev | feedback-smtp.eu-west-1.amazonses.com | 10 | ✅ LIVE |
| **TXT** | send.capsulecorps.dev | v=spf1 include:amazonses.com ~all | - | ✅ LIVE |
| **TXT** | resend._domainkey.capsulecorps.dev | p=MIGfMA0GC... (DKIM) | - | ✅ LIVE |
| **TXT** | _dmarc.capsulecorps.dev | v=DMARC1; p=none; | - | ✅ LIVE |

### Backend Configuration

**File:** `backend/src/utils/emailService.js`
```javascript
from: 'Capsule Corp <noreply@send.capsulecorps.dev>'
```

**Environment Variables:**
```env
RESEND_API_KEY=re_h7R9erU6_KMFZhRdXVfyZ9YUg9MDbipBh
EMAIL_TO=capsulecorp.8999@gmail.com
FRONTEND_URL=https://porfolio-app-ub7q.onrender.com
```

---

## 📨 Email Functions

### 1. Contact Form Emails
- **Admin Notification** → capsulecorp.8999@gmail.com
- **Customer Confirmation** → user's email
- **Template:** Branded with Capsule Corp design

### 2. Password Reset Emails
- **Function:** `sendPasswordResetEmail(to, token)`
- **Link Expiry:** 1 hour
- **Template:** Secure reset link with instructions

### 3. Order Notifications (Future)
- Ready to implement when needed
- Uses same verified domain

---

## 🧪 Testing

**Test Script:** `backend/scripts/test_email.js`

```bash
node backend/scripts/test_email.js
```

**Test Results:**
- ✅ Basic email sending: Working
- ✅ Admin notifications: Working
- ✅ Customer confirmations: Working

---

## 🔍 Verification Commands

### Check DNS Records:
```powershell
# SPF Record
nslookup -type=TXT send.capsulecorps.dev 8.8.8.8

# MX Record
nslookup -type=MX send.capsulecorps.dev 8.8.8.8

# DKIM Record
nslookup -type=TXT resend._domainkey.capsulecorps.dev 8.8.8.8

# DMARC Record
nslookup -type=TXT _dmarc.capsulecorps.dev 8.8.8.8
```

### Online Tools:
- https://mxtoolbox.com/SuperTool.aspx
- https://dnschecker.org
- https://resend.com/domains (dashboard)

---

## 📋 Email Addresses Available

After verification, you can use any address at `send.capsulecorps.dev`:

- `noreply@send.capsulecorps.dev` ✅ (currently used)
- `support@send.capsulecorps.dev`
- `contact@send.capsulecorps.dev`
- `admin@send.capsulecorps.dev`
- `orders@send.capsulecorps.dev`

---

## 🚨 Troubleshooting

### Issue: Emails not sending
**Check:**
1. Verify RESEND_API_KEY in .env
2. Check DNS records are still live
3. Check Resend dashboard for domain status
4. Run test script to verify

### Issue: Emails going to spam
**Solutions:**
1. DNS records properly configured (already done ✅)
2. DKIM, SPF, DMARC all present (already done ✅)
3. Warm up sending domain (send gradually)
4. Monitor sender reputation

### Issue: DNS records not propagating
**Wait:** 15 minutes to 48 hours
**Check:** Use dnschecker.org for global status
**Fix:** Verify exact values in names.com DNS manager

---

## 📚 Documentation

- **Resend Docs:** https://resend.com/docs
- **Names.com DNS:** https://www.names.com/support/dns
- **Email Standards:** RFC 5321, RFC 5322

---

## 🎯 Next Steps (Optional)

### Add Order Confirmation Emails:
```javascript
async function sendOrderConfirmation(orderData) {
  const { email, order_number, items, total } = orderData;
  // Implement branded order confirmation
}
```

### Add Shipping Notifications:
```javascript
async function sendShippingUpdate(orderData, tracking) {
  // Implement shipping notification
}
```

### Add Marketing Emails:
```javascript
async function sendNewsletter(subscribers, content) {
  // Implement newsletter sending
}
```

---

## ✅ Current Status Summary

| Feature | Status |
|---------|--------|
| DNS Configuration | ✅ Complete |
| Domain Verification | ✅ Verified |
| Contact Form Emails | ✅ Working |
| Password Reset | ✅ Working |
| Customer Confirmations | ✅ Working |
| Branded Templates | ✅ Implemented |
| Error Handling | ✅ Implemented |

**Last Updated:** November 10, 2025  
**Maintained By:** Capsule Corp Development Team
