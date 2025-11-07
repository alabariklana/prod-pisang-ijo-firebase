# 🍌 Pisang Ijo - Catering Website

Sebuah website catering modern yang dibangun dengan Next.js untuk development dan testing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (untuk authentication)
- MongoDB (untuk database)

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dengan konfigurasi Firebase dan database Anda.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   http://localhost:3000

## 📋 Features

- 🍽️ Menu katalog dengan kategori
- 👤 User authentication (Google & Email/Password)
- 🛒 Sistem pemesanan
- 📊 Dashboard admin
- 📝 Blog system
- 💰 Points & reward system
- 📧 Newsletter integration

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Authentication:** Firebase Auth
- **Database:** MongoDB
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Maps:** Google Maps API
- **Email:** Brevo/Sendinblue

## 📁 Project Structure

```
pisang-ijo/
├── app/                    # Next.js pages & API routes
│   ├── dashboard/         # Admin dashboard
│   ├── api/              # API endpoints
│   └── ...               # Public pages
├── components/           # React components
├── contexts/            # React contexts
├── lib/                 # Utilities & configurations
└── public/              # Static assets
```

## 🔧 Development

- **Dev server:** `npm run dev`
- **Linting:** `npm run lint`

## 📖 Documentation

- [Development Setup Guide](./DEV_SETUP.md) - Detailed setup instructions
- Environment variables template: `.env.example`

## 🔒 Environment Variables

Required variables untuk development (lihat `.env.example`):

- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `MONGO_URL` - MongoDB connection string
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps (optional)
- `NEXT_PUBLIC_FACEBOOK_APP_ID` - Facebook integration (optional)

## 🐛 Troubleshooting

**Firebase auth/invalid-api-key error:**
- Pastikan Firebase API key benar di `.env.local`
- Restart development server

**MongoDB connection error:**
- Check MongoDB running & connection string
- Verify `MONGO_URL` di `.env.local`

Lihat [DEV_SETUP.md](./DEV_SETUP.md) untuk troubleshooting lengkap.

## 📝 Notes

- Project ini dikonfigurasi untuk development only
- File `.env.local` tidak di-commit untuk keamanan
- Tidak ada konfigurasi deployment (pure development project)
# prod-pisang-ijo-firebase
