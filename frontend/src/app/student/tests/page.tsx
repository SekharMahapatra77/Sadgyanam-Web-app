'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Clock, ArrowLeft, Play, FileText, CheckCircle2, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function StudentTestsPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login?role=student');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue-800 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Student CBT Test Series Engine</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Class 10th CBSE Board & Foundation Mock Tests</p>
          </div>
          <Link
            href="/free-tests"
            className="px-4 py-2 bg-brand-gold-500 text-slate-950 rounded-xl font-extrabold text-xs shadow-sm hover:bg-brand-gold-400 transition"
          >
            Explore Public Mock Engine
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'test_demo_10', title: 'Class 10th Real Numbers Board Mock Test', duration: '30 mins', marks: '40 Marks', status: 'Available' },
            { id: 'free_test_class10_science', title: 'Class 10th Chemical Reactions Test', duration: '30 mins', marks: '40 Marks', status: 'Available' },
            { id: 'free_test_class9_science', title: 'Class 9th Physics & Motion Challenge', duration: '25 mins', marks: '35 Marks', status: 'Completed (Score: 32/35)' },
          ].map((test, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition flex flex-col justify-between space-y-4">
              <div>
                <div className="p-2.5 rounded-xl bg-brand-gold-50 text-brand-gold-700 w-fit mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{test.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-semibold">
                  <span>⏱ {test.duration}</span>
                  <span>📝 {test.marks}</span>
                </div>
                <div className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                  {test.status}
                </div>
              </div>

              <Link
                href={`/exam/${test.id}`}
                className="w-full py-2.5 bg-brand-blue-800 text-white rounded-xl font-bold text-xs hover:bg-brand-blue-900 transition text-center flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Launch Test Now
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
