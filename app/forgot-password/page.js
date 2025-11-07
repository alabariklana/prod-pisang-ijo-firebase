'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email /*, { url: window.location.origin }*/);
      setSent(true);
      // Use a non-enumerating message regardless of existence
      toast.success('Jika email terdaftar, kami telah mengirim link reset kata sandi.');
    } catch (err) {
      console.error(err);
      // Show the same message to avoid leaking whether the email exists
      toast.success('Jika email terdaftar, kami telah mengirim link reset kata sandi.');
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#EBDEC5' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: '#214929' }}>Lupa Kata Sandi</h1>
        <p className="text-sm text-gray-600 mb-6">Masukkan email Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" />
          </div>
          <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#214929' }}>
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </Button>
        </form>

        {sent && (
          <div className="mt-4 text-sm text-green-700">
            Cek email Anda untuk tautan pengaturan ulang kata sandi.
          </div>
        )}

        <div className="mt-6 text-sm text-center">
          <Link href="/login" className="underline" style={{ color: '#214929' }}>Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}
