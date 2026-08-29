'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, BookOpen, User, PhoneCall, Award, ChevronDown, GraduationCap, Users, ShieldCheck, UserCheck as TeacherIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all duration-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold-500 shadow-md bg-white p-0.5">
              <Image
                src="/branding/sadgyanam-logo.png"
                alt="SADGYANAM Logo"
                width={48}
                height={48}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-brand-blue-800 group-hover:text-brand-blue-600 transition">
                SADGYANAM
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-600">
                Experience the True Knowledge
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6 text-xs xl:text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-brand-blue-800 transition">Home</Link>
            <Link href="/faculty" className="hover:text-brand-blue-800 transition">Faculty</Link>
            <Link href="/results" className="hover:text-brand-blue-800 transition">Results</Link>
            <Link href="/free-tests" className="hover:text-brand-blue-800 transition flex items-center gap-1 text-brand-gold-600 font-bold whitespace-nowrap">
              <Award className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" /> Free Mock Test
            </Link>
            <Link href="/scholarship-test" className="hover:text-brand-blue-800 transition whitespace-nowrap">Scholarship</Link>
            <Link href="/contact" className="hover:text-brand-blue-800 transition">Contact</Link>
          </div>

          {/* Action CTAs & Portal Logins */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 pl-3 xl:pl-4 border-l border-slate-200 shrink-0">
            {user ? (
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href={
                    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                      ? '/admin/dashboard'
                      : user.role === 'TEACHER'
                        ? '/teacher/dashboard'
                        : user.role === 'PARENT'
                          ? '/parent/dashboard'
                          : '/student/dashboard'
                  }
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-brand-blue-800 rounded-xl hover:bg-brand-blue-900 transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  <User className="w-4 h-4 shrink-0" /> {user.role} Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1.5 border border-rose-200 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" /> Logout
                </button>
              </div>
            ) : (
              <>
                {/* Multi-Role Portal Login Dropdown */}
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold text-brand-blue-800 border border-brand-blue-800/30 hover:border-brand-blue-800 rounded-xl transition flex items-center gap-1.5 bg-brand-blue-50/50 hover:bg-brand-blue-50 whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                    <span>Portal Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {loginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Select Login Panel
                      </div>

                      <Link
                        href="/login?role=student"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-brand-blue-50 hover:text-brand-blue-800 transition"
                      >
                        <GraduationCap className="w-4 h-4 text-brand-blue-700 shrink-0" />
                        <div>
                          <div>Student Login</div>
                          <div className="text-[10px] text-slate-400 font-normal">Student tests & AI tutor</div>
                        </div>
                      </Link>

                      <Link
                        href="/login?role=parent"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                      >
                        <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div>Parent Login</div>
                          <div className="text-[10px] text-slate-400 font-normal">Progress & report portal</div>
                        </div>
                      </Link>

                      <Link
                        href="/login?role=teacher"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition"
                      >
                        <TeacherIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div>Teacher Login</div>
                          <div className="text-[10px] text-slate-400 font-normal">Faculty & test generator</div>
                        </div>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <Link
                          href="/login?role=admin"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-amber-50 hover:text-amber-900 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <div>Admin Login</div>
                            <div className="text-[10px] text-slate-400 font-normal">Institute management</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/admission"
                  className="px-3.5 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm font-bold text-white bg-brand-gold-500 hover:bg-brand-gold-600 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" /> Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-brand-blue-800 p-2"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 font-semibold text-slate-700 shadow-xl">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Home</Link>
          <Link href="/courses" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Courses (6th - 10th)</Link>
          <Link href="/faculty" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Faculty</Link>
          <Link href="/results" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Results & Rankers</Link>
          <Link href="/free-tests" onClick={() => setIsOpen(false)} className="block py-2 text-brand-gold-600 font-bold">Free Mock Test</Link>
          <Link href="/scholarship-test" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Scholarship Test</Link>
          <Link href="/admission" onClick={() => setIsOpen(false)} className="block py-2 text-brand-blue-800 font-bold">Online Admission</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block py-2 hover:text-brand-blue-800">Contact Us</Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={
                    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                      ? '/admin/dashboard'
                      : user.role === 'TEACHER'
                        ? '/teacher/dashboard'
                        : user.role === 'PARENT'
                          ? '/parent/dashboard'
                          : '/student/dashboard'
                  }
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-brand-blue-800 rounded-xl"
                >
                  Go to {user.role} Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
                  Portal Logins:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <Link
                    href="/login?role=student"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    🎓 Student Login
                  </Link>
                  <Link
                    href="/login?role=parent"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    👨‍👩‍👧 Parent Login
                  </Link>
                  <Link
                    href="/login?role=teacher"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    👨‍🏫 Teacher Login
                  </Link>
                  <Link
                    href="/login?role=admin"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 px-3 bg-brand-gold-500 text-slate-900 rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    👑 Admin Login
                  </Link>
                </div>
                <Link
                  href="/admission"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 mt-2 text-sm font-bold text-white bg-brand-gold-500 rounded-xl shadow-md"
                >
                  Apply for Admission
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

