'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CustomerSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValid, setReferralValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const validateReferralCode = async (code) => {
    if (!code) {
      setReferralValid(null);
      return;
    }

    try {
      const response = await fetch('/api/member/validate-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: code })
      });
      
      const data = await response.json();
      setReferralValid(data.valid ? data.message : null);
      
      if (!data.valid) {
        toast.error(data.message || 'Kode referral tidak valid');
      }
    } catch (error) {
      console.error('Error validating referral:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Kata sandi tidak cocok');
      return;
    }

    setLoading(true);
    try {
      // Create user account
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      // Create member with signup bonus and referral
      try {
        const memberResponse = await fetch('/api/member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            name, 
            action: 'signup',
            referralCode: referralCode || null
          })
        });
        
        const memberData = await memberResponse.json();
        if (memberData.success) {
          toast.success('🎉 Selamat! Kamu dapat 30 poin welcome bonus!');
        }
      } catch (memberError) {
        console.warn('Member creation error:', memberError);
      }

      // Send welcome email via API route
      try {
        const response = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        if (!data.success) {
          console.warn('Welcome email not sent:', data.error);
        }
      } catch (emailError) {
        console.warn('Email sending error:', emailError);
      }

      router.push('/member');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create member with signup bonus
      try {
        const memberResponse = await fetch('/api/member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: result.user.email,
            name: result.user.displayName || 'Pelanggan',
            action: 'signup',
            referralCode: referralCode || null
          })
        });
        
        const memberData = await memberResponse.json();
        if (memberData.success) {
          toast.success('🎉 Selamat! Kamu dapat 30 poin welcome bonus!');
        }
      } catch (memberError) {
        console.warn('Member creation error:', memberError);
      }

      // Send welcome email for new Google users
      try {
        const response = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: result.user.displayName || 'Pelanggan', 
            email: result.user.email 
          })
        });
        
        const data = await response.json();
        if (!data.success) {
          console.warn('Welcome email not sent:', data.error);
        }
      } catch (emailError) {
        console.warn('Email sending error:', emailError);
      }

      router.push('/member');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      toast.error('Pendaftaran dengan Google gagal. Silakan coba lagi.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#EBDEC5' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>Daftar Pelanggan</h1>
        <p className="text-sm text-gray-600 mb-6">Buat akun baru untuk memesan lebih mudah.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Kata Sandi</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" />
          </div>
          <div>
            <label className="block text-sm mb-1">Konfirmasi Kata Sandi</label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Ulangi kata sandi" />
          </div>
          <div>
            <label className="block text-sm mb-1">Kode Referral (Opsional)</label>
            <Input 
              type="text" 
              value={referralCode} 
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              onBlur={(e) => validateReferralCode(e.target.value)}
              placeholder="Masukkan kode referral dari teman" 
            />
            {referralValid && (
              <p className="text-xs mt-1 text-green-600">✓ {referralValid}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#214929' }}>
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">atau</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <Button 
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-3"
          variant="outline"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-medium">
            {googleLoading ? 'Memproses...' : 'Daftar dengan Google'}
          </span>
        </Button>

        <div className="mt-6 text-sm text-center">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline" style={{ color: '#214929' }}>Masuk</Link>
        </div>
      </div>
    </div>
  );
}