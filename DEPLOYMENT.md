# 🚀 Deployment Guide - Firebase App Hosting

Panduan lengkap untuk mendeploy aplikasi Pisang Ijo ke Firebase App Hosting.

## 📋 Prerequisites

1. **Firebase CLI** harus terinstall:
   ```bash
   npm install -g firebase-tools
   ```

2. **Google Cloud Project** dengan Firebase enabled
3. **GitHub Repository** (untuk continuous deployment)
4. **Environment Variables** yang sudah dikonfigurasi

## 🔧 Setup Environment Variables

### 1. Persiapkan Environment Variables
Sebelum deployment, pastikan Anda memiliki semua environment variables yang diperlukan:

#### Required Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `MONGO_URL`
- `BREVO_API_KEY`
- `GCS_SERVICE_ACCOUNT_KEY_BASE64`

#### Optional Variables:
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_FACEBOOK_APP_ID`

### 2. Encode Service Account Key
Jalankan script untuk encode service account key ke base64:

```bash
npm run encode-key
```

## 🚀 Deployment Steps

### Step 1: Login ke Firebase
```bash
firebase login
```

### Step 2: Initialize Firebase (jika belum dilakukan)
```bash
firebase init
```
Pilih:
- ✅ App Hosting
- ✅ Project: `certain-haiku-475408-f6`

### Step 3: Set Environment Variables di Firebase Console

**PENTING:** Karena format baru App Hosting, environment variables harus di-set melalui Firebase Console, bukan CLI.

1. **Buka Firebase Console**: https://console.firebase.google.com/
2. **Pilih Project**: certain-haiku-475408-f6
3. **Buka App Hosting** di sidebar kiri
4. **Pilih aplikasi Anda** atau create new app
5. **Buka tab "Environment"** atau "Configuration"

**Set Environment Variables berikut:**

#### Public Variables (Environment Variables):
```
NEXT_PUBLIC_FIREBASE_API_KEY = your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID = your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = your-measurement-id (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your-maps-api-key (optional)
NEXT_PUBLIC_FACEBOOK_APP_ID = your-facebook-app-id (optional)
```

#### Secret Variables (Secrets):
```
MONGO_URL = mongodb+srv://username:password@cluster.mongodb.net/database
BREVO_API_KEY = your-brevo-api-key
GCS_SERVICE_ACCOUNT_KEY_BASE64 = your-base64-encoded-service-account-key
```

**Note:** GCS configuration sudah hard-coded dalam apphosting.yaml karena sudah diketahui nilainya.

### Step 4: Connect Repository ke Firebase App Hosting
1. Push code ke GitHub repository
2. Di Firebase Console, buka **App Hosting**
3. Klik **Get Started** atau **Create New App**
4. Connect repository GitHub Anda
5. Pilih branch `main` atau `master`
6. Konfigurasi akan otomatis detect dari `apphosting.yaml`

### Step 5: Deploy
```bash
firebase deploy --only apphosting
```

## 🔄 Continuous Deployment

Setelah setup awal, setiap push ke branch main akan otomatis trigger deployment baru.

## 📊 Monitoring

### 1. Check Deployment Status
```bash
firebase apphosting:deployments:list
```

### 2. View Logs
```bash
firebase apphosting:deployments:logs <deployment-id>
```

### 3. Firebase Console
Monitor melalui [Firebase Console](https://console.firebase.google.com/):
- App Hosting dashboard
- Functions logs
- Performance monitoring

## 🛠 Troubleshooting

### Build Errors
1. **Missing Environment Variables**
   ```bash
   firebase apphosting:env:list
   firebase apphosting:secrets:list
   ```

2. **Dependencies Issues**
   - Pastikan `package.json` memiliki semua dependencies
   - Check Node.js version compatibility

3. **Memory Issues**
   - Optimize images dan assets
   - Check bundle size dengan `npm run build`

### Runtime Errors
1. **Database Connection**
   - Verify MongoDB connection string
   - Check network configuration

2. **Storage Issues**
   - Verify GCS service account permissions
   - Check bucket configuration

3. **Environment Variables**
   - Pastikan semua required vars sudah di-set
   - Check variable names (case-sensitive)

## 🔐 Security Checklist

- [ ] Environment variables di-set dengan aman
- [ ] Service account keys tidak di-commit ke git
- [ ] Firebase Security Rules dikonfigurasi
- [ ] CORS settings untuk API endpoints
- [ ] Rate limiting untuk API calls

## 📈 Performance Optimization

1. **Static Assets**
   - Images di-optimize dan di-compress
   - Use Next.js Image component
   - Configure proper caching headers

2. **Bundle Size**
   - Analyze dengan `npm run build`
   - Code splitting dan lazy loading
   - Remove unused dependencies

3. **Database**
   - Index MongoDB collections
   - Optimize queries
   - Use connection pooling

## 🆘 Support

Jika mengalami masalah:
1. Check logs: `firebase apphosting:deployments:logs`
2. Verify environment variables
3. Check Firebase Console untuk error details
4. Review documentation: https://firebase.google.com/docs/app-hosting

---

## 📝 Quick Commands Reference

```bash
# Deploy
firebase deploy --only apphosting

# Set environment variable
firebase apphosting:env:set KEY="value"

# Set secret
firebase apphosting:secrets:set SECRET_KEY

# List deployments
firebase apphosting:deployments:list

# View logs
firebase apphosting:deployments:logs <deployment-id>

# Local development
npm run dev

# Build for production
npm run build

# Check environment setup
npm run check-env
```