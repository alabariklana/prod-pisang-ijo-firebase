'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import Head from 'next/head';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <title>Dashboard Admin - Pisang Ijo Evi Makassar</title>
        <meta name="description" content="Panel admin untuk mengelola pesanan, menu, blog, dan data pelanggan Pisang Ijo Evi. Area khusus admin untuk mengatur bisnis dessert khas Makassar." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Dashboard Admin - Pisang Ijo Evi" />
        <meta property="og:description" content="Panel admin untuk mengelola bisnis Pisang Ijo Evi." />
        <meta property="og:url" content="https://pisangijoevi.web.id/dashboard" />
      </Head>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </>
  );
}
