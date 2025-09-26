# 🔥 Firebase Setup Instructions

## Quick Setup Guide:

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name: "capsule-corp-auth"
4. Disable Google Analytics (optional)
5. Click "Create project"

## Enable Authentication:
1. Go to "Authentication" in sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google"
5. Toggle "Enable"
6. Enter your support email
7. Click "Save"

## Get Config:
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon "</>"
4. Register app name: "Capsule Corp"
5. Copy the config object

## Update .env file:
Replace the values in your .env file with the real Firebase config values.

## Test Setup:
After updating .env with real values:
1. Restart your dev server (Ctrl+C, then npm run dev)
2. Go to /auth page
3. Click "Continue with Google"
4. Should open Google sign-in popup

## Troubleshooting:
- Make sure localhost:3001 is added to authorized domains in Firebase
- Check browser console for specific error messages
- Ensure all env variables are correctly set

## Demo Mode:
For testing without real Firebase setup, we can create a mock implementation.