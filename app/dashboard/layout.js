'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import Head from 'next/head';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <title>Dashboard Admin - Pisang Ijo Evi Makassar | Panel Administrasi</title>
        <meta name="description" content="Portal administrasi lengkap untuk mengelola website Pisang Ijo Evi. Dashboard khusus admin untuk mengatur pesanan, menu, blog, inventori, analytics, dan customer management. Sistem manajemen bisnis dessert khas Makassar dengan fitur real-time monitoring, sales tracking, dan content management system terintegrasi." />
        <meta name="keywords" content="dashboard admin, panel administrasi, management system, pisang ijo evi, admin portal, business management, dessert business, makassar culinary, inventory management, sales tracking" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Dashboard Admin - Pisang Ijo Evi Makassar" />
        <meta property="og:description" content="Portal administrasi lengkap untuk mengelola bisnis Pisang Ijo Evi. Dashboard dengan fitur manajemen pesanan, inventori, dan analytics." />
        <meta property="og:url" content="https://pisangijoevi.web.id/dashboard" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pisangijoevi.web.id/dashboard" />
      </Head>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </>
  );
}
