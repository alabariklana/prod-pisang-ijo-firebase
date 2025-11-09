# Security Notice - Firebase API Key

## ⚠️ IMPORTANT SECURITY ALERT

The Firebase API key in this repository has been identified as publicly exposed. 

**IMMEDIATE ACTIONS TAKEN:**
1. API Key has been regenerated in Google Cloud Console
2. Old compromised key has been disabled
3. New key is now configured with proper restrictions

## 🔒 Security Measures Implemented:

### API Key Restrictions Applied:
- **Application restrictions**: HTTP referrers (web sites)
- **Allowed referrers**:
  - https://pisangijoevi.web.id/*
  - https://*.pisangijoevi.web.id/*
  - https://pisang-ijo-evi.firebaseapp.com/*
  - https://*.firebase.app/*
  - http://localhost:3000/* (development only)

### API Restrictions:
- Firebase Authentication API
- Firebase Realtime Database API  
- Firebase Storage API
- Cloud Firestore API

### Additional Security:
- Environment variables properly configured
- Sensitive keys moved to Firebase App Hosting secrets
- Repository security scanning enabled

## 🚨 If You Received This Alert:

**Google Cloud Security Alert is LEGITIMATE**. The API key was indeed exposed in:
- GitHub repository: `prod-pisang-ijo-firebase`
- File: `apphosting.yaml`
- Commit: Various commits containing the key

**Actions Completed:**
1. ✅ API Key regenerated
2. ✅ Old key disabled
3. ✅ New key configured with restrictions
4. ✅ Repository updated with new secure configuration
5. ✅ Firebase security rules reviewed

## 📝 Prevention Measures:
- Never commit API keys directly to version control
- Use environment variables for all sensitive data
- Implement proper API key restrictions
- Regular security audits of repositories
- Enable GitHub secret scanning

## 📞 Contact:
If you have concerns about this security incident, please contact the development team immediately.

**Last Updated:** November 9, 2025
**Status:** RESOLVED - New secure configuration deployed