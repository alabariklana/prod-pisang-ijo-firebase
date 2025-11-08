'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardLoginPage() {
  const { user, loading, error, signInWithGoogle, signInWithEmailPassword } = useAuth();
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' or 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [useRedirect, setUseRedirect] = useState(true); // Default to redirect (more reliable)

  useEffect(() => {
    console.log('📍 Dashboard page - loading:', loading, ', user:', user?.email || 'null');
    if (!loading && user) {
      console.log('✅ Redirect ke /dashboard/home');
      router.push('/dashboard/home');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async (forceRedirect = false) => {
    try {
      const shouldUseRedirect = forceRedirect || useRedirect;
      
      if (shouldUseRedirect) {
        setIsRedirecting(true);
      }
      
      await signInWithGoogle(shouldUseRedirect);
      
      // If popup was successful, redirect to home
      if (!shouldUseRedirect) {
        toast.success('Login berhasil!');
        router.push('/dashboard/home');
      }
    } catch (error) {
      setIsRedirecting(false);
      
      if (error?.code === 'auth/unauthorized-email') {
        toast.error(`Email "${error.userEmail}" tidak memiliki akses admin`);
      } else if (error?.code === 'auth/popup-closed-by-user') {
        toast.error('Login dibatalkan');
      } else if (error?.code === 'auth/popup-blocked') {
        toast.error('Popup diblokir browser. Mencoba dengan redirect...');
        setUseRedirect(true);
        setTimeout(() => handleGoogleSignIn(true), 1000);
      } else if (error?.code === 'auth/cancelled-popup-request') {
        return;
      } else {
        toast.error('Login gagal. Silakan coba lagi.');
      }
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailPassword(email, password);
      toast.success('Login berhasil!');
      router.push('/dashboard/home');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/unauthorized-email') {
        toast.error(`Email "${error.userEmail}" tidak memiliki akses admin`);
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error('Email atau password salah');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('Akun tidak ditemukan');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Terlalu banyak percobaan. Silakan coba lagi nanti');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Format email tidak valid');
      } else {
        toast.error('Login gagal. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">
            {isRedirecting ? 'Mengarahkan ke Google...' : 'Loading...'}
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-600 text-sm font-medium mb-2">Authentication Error:</p>
              <p className="text-red-700 text-sm">{error}</p>
              
              {error.includes('unauthorized-domain') && (
                <div className="mt-3 text-xs text-red-600">
                  <p className="font-medium">Action Required:</p>
                  <p>Please add this domain to Firebase Console:</p>
                  <code className="bg-red-100 px-2 py-1 rounded text-xs block mt-1 break-all">
                    prod-pisang-ijo-firebase--pisang-ijo-evi.asia-southeast1.hosted.app
                  </code>
                </div>
              )}
              
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">PJ</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl text-green-700 mb-2">
              Dashboard Admin
            </CardTitle>
            <CardDescription className="text-base">
              Login dengan Google untuk mengakses dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login Method Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setLoginMethod('google')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'google'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Email & Password
            </button>
          </div>

          {/* Google Sign In */}
          {loginMethod === 'google' && (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isRedirecting}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-3 h-12 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                variant="outline"
              >
                {isRedirecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    <span className="font-medium">Mengarahkan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium">Sign in with Google</span>
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Gunakan akun Google yang terdaftar sebagai admin
              </p>
              
              {/* Toggle untuk gunakan redirect jika popup bermasalah */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="useRedirect"
                  checked={useRedirect}
                  onChange={(e) => setUseRedirect(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="useRedirect" className="text-xs text-gray-600 cursor-pointer">
                  Gunakan redirect jika popup tidak bekerja
                </label>
              </div>
            </div>
          )}

          {/* Email & Password Sign In */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 transition-all hover:scale-105 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Hanya admin yang memiliki akses ke dashboard ini
              </p>
            </form>
          )}
          
          <div className="text-center pt-4 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}