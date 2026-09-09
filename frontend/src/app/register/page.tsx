'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, Eye, EyeOff, UserPlus, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';

function RegisterContent() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register-admin', {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      setSuccessMsg(res.data?.message || 'Admin registration successful! Redirecting to login...');

      setTimeout(() => {
        router.push('/login?role=admin');
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-xl w-full bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-white p-1 border-2 border-brand-gold-500 shadow-md flex items-center justify-center">
            <Image
              src="/branding/sadgyanam-logo.png"
              alt="SADGYANAM Official Logo"
              width={72}
              height={72}
              className="object-contain w-full h-full"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Admin Registration
          </h2>
          <p className="text-xs text-brand-gold-600 font-bold uppercase tracking-widest">
            SADGYANAM Management Portal
          </p>
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-brand-blue-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">Management Portal</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold-100 text-brand-gold-800 border border-brand-gold-300">
                Admin Account
              </span>
            </div>
            <p className="text-slate-600 mt-1">Create an administrative account to manage courses, admissions, & system operations.</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center shadow-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center shadow-sm">
            {successMsg}
          </div>
        )}

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@sadgyanam.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-blue-800 text-white font-bold rounded-xl hover:bg-brand-blue-900 transition shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              'Creating Admin Account...'
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Register
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600 font-medium">
              Already have an account?{' '}
              <Link
                href="/login?role=admin"
                className="font-bold text-brand-blue-800 hover:text-brand-blue-900 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500">Loading Admin Registration...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
