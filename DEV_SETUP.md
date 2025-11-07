# 🚀 Development Setup Guide

## Prerequisites
- Node.js 18+ 
- npm atau yarn
- Firebase project (untuk authentication)
- MongoDB (untuk database)

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` dengan konfigurasi Anda:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   # ... dst
   ```

### 3. Start Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:3000

## 🔧 Configuration Details

### Firebase Setup
1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication dengan Google dan Email/Password
3. Copy Web App configuration ke `.env.local`
4. Tambahkan `localhost` ke Authorized domains

### Google Cloud Platform Setup
1. Buat project di [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Cloud Storage API
3. Buat bucket bernama `pisang-ijo-assets`
4. Set bucket permissions (public read jika ingin akses langsung)
5. Buat Service Account dan download JSON key
6. Encode JSON key ke base64: `base64 -i service-account.json`
7. Masukkan hasil encode ke `GCS_SERVICE_ACCOUNT_KEY_BASE64`

### MongoDB Setup
- Local: `mongodb://localhost:27017/pisang-ijo-dev`
- Cloud: MongoDB Atlas connection string

### Google Maps (Optional)
- Dapatkan API key dari [Google Cloud Console](https://console.cloud.google.com/)
- Enable Maps JavaScript API

## 📁 Project Structure
```
pisang-ijo/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── contexts/           # React contexts (Auth, etc)
├── lib/                # Utility libraries
├── public/             # Static assets
├── .env.local          # Environment variables (not committed)
└── .env.example        # Environment template
```

## 🛠 Available Scripts
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint

## 🔍 Troubleshooting

### Firebase Error: auth/invalid-api-key
- Pastikan `NEXT_PUBLIC_FIREBASE_API_KEY` benar di `.env.local`
- Restart development server setelah mengubah environment variables

### MongoDB Connection Error
- Pastikan MongoDB berjalan (jika local)
- Check connection string di `MONGO_URL`

### GCP Storage Error
- Pastikan `GCS_SERVICE_ACCOUNT_KEY_BASE64` valid
- Check bucket name dan permissions
- Verify project ID benar

### Image Upload Issues
- Check `USE_GCS` setting di `.env.local`
- Verify bucket permissions untuk write access
- Check `ALLOW_LOCAL_FALLBACK` jika ingin fallback ke local

### Images Not Loading
- Images dari GCS dapat diakses via: `http://localhost:3000/api/images/[path]`
- Check browser network tab untuk error details
- Verify `GCS_PUBLIC_READ` setting

### Missing Environment Variables
- Check `.env.local` file exists
- Pastikan semua required variables ada
- Restart dev server

## 📝 Notes
- File `.env.local` tidak di-commit ke git untuk keamanan
- Gunakan `.env.example` sebagai template
- Project ini pure development - tidak ada deployment config