# Google OAuth Setup Guide for Capsule Corp

This guide will help you set up Google OAuth authentication using Firebase for your Capsule Corp application.

## Prerequisites
- Google account
- Firebase project (free tier is sufficient)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `capsule-corp-auth` (or any name you prefer)
4. Accept Firebase terms and click "Continue"
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click on "Get started" if prompted
3. Go to the "Sign-in method" tab
4. Find "Google" in the providers list and click on it
5. Toggle the "Enable" switch
6. Enter your project's support email (can be your email)
7. Click "Save"

## Step 3: Add Web App

1. In your Firebase project dashboard, click on the gear icon (Project settings)
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Enter app nickname: `Capsule Corp Web App`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"

## Step 4: Get Configuration

After registering your app, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-ABC123DEF4"
};
```

## Step 5: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbc123...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
```

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings > Authorized domains
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `your-app.com`)

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the login/signup page
3. Click the "Continue with Google" button
4. Sign in with your Google account
5. You should be redirected back to your app and logged in

## Troubleshooting

### Common Issues:

1. **"Configuration object is invalid"**
   - Check that all environment variables are set correctly
   - Make sure there are no trailing spaces in your `.env` file

2. **"Popup blocked"**
   - Allow popups in your browser settings
   - The app will show an error message and suggest allowing popups

3. **"Unauthorized domain"**
   - Add your domain to the authorized domains list in Firebase Console

4. **"API key not valid"**
   - Double-check your API key in the Firebase Console
   - Make sure you're using the web API key, not other types

### Development vs Production:

- For development, use `localhost` as authorized domain
- For production, add your actual domain
- You can use the same Firebase project for both environments

## Security Considerations

1. Never commit your actual Firebase config to public repositories
2. Use environment variables for all sensitive data
3. Enable App Check for additional security in production
4. Regularly review your Firebase usage and security rules

## Next Steps

Once Google OAuth is working:
1. You can add other sign-in providers (Facebook, Twitter, etc.)
2. Implement custom user profiles
3. Add role-based access control
4. Set up Firebase Security Rules
5. Implement email verification

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Review Firebase Console logs
3. Consult Firebase documentation: https://firebase.google.com/docs/auth
4. Check your network connection and firewall settings