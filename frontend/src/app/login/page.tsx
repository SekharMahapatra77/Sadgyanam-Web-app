'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, UserCheck, GraduationCap, Users, ShieldCheck, UserCheck as TeacherIcon, Eye, EyeOff, User, Phone, UserPlus, LogIn } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

type RoleType = 'student' | 'parent' | 'teacher' | 'admin';
type ModeType = 'login' | 'register';

interface RoleConfig {
  id: RoleType;
  label: string;
  badge: string;
  icon: any;
  defaultEmail: string;
  dashboardPath: string;
  color: string;
  activeColor: string;
  description: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'student',
    label: 'Student Panel',
    badge: 'Student Portal',
    icon: GraduationCap,
    defaultEmail: 'student@sadgyanam.edu.in',
    dashboardPath: '/student/dashboard',
    color: 'border-brand-blue-800 text-brand-blue-800',
    activeColor: 'bg-brand-blue-800 text-white',
    description: 'Access tests, AI study assistant, courses, & progress reports',
  },
  {
    id: 'parent',
    label: 'Parent Panel',
    badge: 'Parent Portal',
    icon: Users,
    defaultEmail: 'parent@sadgyanam.edu.in',
    dashboardPath: '/parent/dashboard',
    color: 'border-emerald-600 text-emerald-700',
    activeColor: 'bg-emerald-700 text-white',
    description: 'Track your child\'s attendance, test scores, & teacher feedback',
  },
  {
    id: 'teacher',
    label: 'Teacher Panel',
    badge: 'Faculty Portal',
    icon: TeacherIcon,
    defaultEmail: 'teacher@sadgyanam.edu.in',
    dashboardPath: '/teacher/dashboard',
    color: 'border-indigo-600 text-indigo-700',
    activeColor: 'bg-indigo-700 text-white',
    description: 'Manage batches, generate AI test papers, & grade assignments',
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    badge: 'Management Portal',
    icon: ShieldCheck,
    defaultEmail: 'admin@sadgyanam.edu.in',
    dashboardPath: '/admin/dashboard',
    color: 'border-brand-gold-600 text-slate-900',
    activeColor: 'bg-brand-gold-500 text-slate-950 font-bold',
    description: 'System administration, lead management, & institute analytics',
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const initialRoleParam = (searchParams.get('role')?.toLowerCase() as RoleType) || 'student';
  const initialModeParam = (searchParams.get('mode')?.toLowerCase() as ModeType) || 'login';

  const isValidRole = ROLES.some((r) => r.id === initialRoleParam);
  const [activeRole, setActiveRole] = useState<RoleType>(isValidRole ? initialRoleParam : 'student');
  const [mode, setMode] = useState<ModeType>(initialModeParam === 'register' ? 'register' : 'login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState('CLASS_10');
  const [board, setBoard] = useState('CBSE');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const currentRoleConfig = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')?.toLowerCase() as RoleType;
    const modeFromUrl = searchParams.get('mode')?.toLowerCase() as ModeType;

    if (roleFromUrl && ROLES.some((r) => r.id === roleFromUrl)) {
      setActiveRole(roleFromUrl);
    }

    if (modeFromUrl === 'register' || modeFromUrl === 'login') {
      setMode(modeFromUrl);
    }
  }, [searchParams]);

  const handleRoleSwitch = (role: RoleType) => {
    setActiveRole(role);
    setError('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: ModeType) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);

      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'TEACHER') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'PARENT') {
        router.push('/parent/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: activeRole.toUpperCase(),
        grade: activeRole === 'student' ? grade : undefined,
        board: activeRole === 'student' ? board : undefined,
      });

      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      setSuccessMsg('Registration successful! Redirecting to your panel dashboard...');

      setTimeout(() => {
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'TEACHER') {
          router.push('/teacher/dashboard');
        } else if (user.role === 'PARENT') {
          router.push('/parent/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = currentRoleConfig.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-xl w-full bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-8">
        
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
            SADGYANAM Portal Login
          </h2>
          <p className="text-xs text-brand-gold-600 font-bold uppercase tracking-widest">
            Experience the True Knowledge
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase text-center tracking-wider mb-2">
            Target Login Panel Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSwitch(role.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? `${role.activeColor} shadow-md scale-[1.02]`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{role.label.replace(' Panel', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-brand-blue-800 shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{currentRoleConfig.badge}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold-100 text-brand-gold-800 border border-brand-gold-300">
                Authorized Portal Access
              </span>
            </div>
            <p className="text-slate-600 mt-1">{currentRoleConfig.description}</p>
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

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {currentRoleConfig.label} Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder={currentRoleConfig.defaultEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-blue-800 text-white font-bold rounded-xl hover:bg-brand-blue-900 transition shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <UserCheck className="w-4 h-4" /> Login to {currentRoleConfig.badge}
              </>
            )}
          </button>

          {activeRole === 'admin' && (
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 font-medium">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register?role=admin"
                  className="font-bold text-brand-blue-800 hover:text-brand-blue-900 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500">Loading Portal Login...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

