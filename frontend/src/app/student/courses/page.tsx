'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Download, FileText, Calendar, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api, API_ORIGIN } from '@/services/api';

export default function StudentCoursesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [materials, setMaterials] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/login?role=student');
  };
  const [loading, setLoading] = useState(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');

  useEffect(() => {
    api.get('/student/materials')
      .then((res) => setMaterials(res.data?.data || []))
      .catch(() => {
        api.get('/materials/public')
          .then((res) => setMaterials(res.data?.data || []))
          .catch(() => setMaterials([]));
      })
      .finally(() => setLoading(false));
  }, []);

  const assetUrl = (url: string) => (url?.startsWith('http') ? url : `${API_ORIGIN}${url || ''}`);

  const subjectsList = ['ALL', ...Array.from(new Set(materials.map((m) => m.subjectId?.name || m.subjectName || 'General')))];

  const filteredMaterials = selectedSubjectFilter === 'ALL'
    ? materials
    : materials.filter((m) => (m.subjectId?.name || m.subjectName || 'General') === selectedSubjectFilter);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Navigation back & Logout */}
        <div className="flex justify-between items-center">
          <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue-800 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Student Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {/* Page Title & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <div>
            <span className="px-3 py-1 bg-brand-blue-100 text-brand-blue-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider">
              Notes Library
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">All Study Notes</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Access notes and study materials uploaded by SADGYANAM faculty.
            </p>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700">
            Total Available Notes: <span className="text-brand-blue-800 text-sm font-black">{materials.length}</span>
          </div>
        </div>

        {/* Subject Filter Pills */}
        {subjectsList.length > 2 && (
          <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
            {subjectsList.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubjectFilter(subj)}
                className={`px-4 py-2 rounded-xl transition shrink-0 ${selectedSubjectFilter === subj
                    ? 'bg-brand-blue-800 text-white font-extrabold shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {subj}
              </button>
            ))}
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs font-bold text-slate-400">
            Loading study notes library...
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => {
              const subjectLabel = mat.subjectId?.name || mat.subjectName || 'General Science';
              return (
                <div
                  key={mat._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-brand-blue-100 text-brand-blue-900 font-extrabold rounded-lg text-[10px] uppercase">
                        {subjectLabel}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px]">
                        {mat.grade ? mat.grade.replace('_', ' ') : 'All Classes'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{mat.title}</h3>

                    {mat.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{mat.description}</p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-brand-blue-800" /> {mat.fileType || 'PDF Notes'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(mat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={assetUrl(mat.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-extrabold rounded-xl transition text-xs text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-brand-gold-400" /> Open / Download PDF
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">No study notes are available yet.</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No notes uploaded by faculty for this filter. Check back soon as new materials are published regularly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
