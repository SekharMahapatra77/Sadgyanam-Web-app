'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Trophy, Star, CheckCircle2, PhoneCall, Sparkles, Filter } from 'lucide-react';
import { api } from '@/services/api';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  useEffect(() => { api.get('/results/public').then((res) => setResults(res.data?.data || [])).catch(() => setResults([])); }, []);

  const filteredRankers = filter === 'ALL' ? results : results.filter((r) => r.class === filter);
  const highest = results.find((r) => r.category === 'HIGHEST_BOARD_SCORE');
  const above95 = results.filter((r) => r.category === 'STUDENTS_ABOVE_95').length;
  const maths = results.find((r) => r.category === 'PERFECT_MATHS_SCORES');
  const olympiad = results.filter((r) => r.category === 'OLYMPIAD_RANKS').length;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-100 border border-brand-gold-300 text-brand-gold-900 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-brand-gold-600" /> Academic Excellence & Rankers Hall of Fame
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Hall of <span className="text-brand-blue-800">Champions</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Celebrating the extraordinary achievements of SADGYANAM students in CBSE & ICSE Board Exams, NTSE, PRMO, and Junior Science Olympiads.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-blue-800">{highest?.value || highest?.percentage || '-'}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highest Board Score</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-gold-600">{above95 || '-'}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Above 95%</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">{maths?.value || maths?.mathsScore || '-'}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perfect Maths Scores</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">{olympiad || '-'}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Olympiad Ranks</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {['ALL', ...Array.from(new Set(results.map((result) => result.class)))].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${filter === cat
                ? 'bg-brand-blue-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {cat === 'ALL' ? 'All Achievements' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Ranker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRankers.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-brand-gold-100 border border-brand-gold-300 text-brand-gold-900 text-[10px] font-bold">
                      {student.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{student.studentName}</h3>
                    <p className="text-xs font-semibold text-slate-500">{student.class}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{student.school}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-brand-blue-800">{student.percentage || student.marks || student.value || '-'}</div>
                    <div className="text-xs font-bold text-emerald-600">{student.cityRank || student.olympiadRank || student.boardScore}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
                  {student.subjectScore || student.mathsScore || student.olympiadName || student.badge || 'Verified achievement'}
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    "{student.testimonial || 'SADGYANAM verified achievement.'}"
                  </p>
                </div>
              </div>

              <div className="p-4 bg-brand-blue-50/50 border-t border-slate-100 text-[11px] text-brand-blue-900 font-bold flex items-center justify-between">
                <span>SADGYANAM Verified Result</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Admission CTA */}
        <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Be the Next Top Ranker with SADGYANAM</h3>
            <p className="text-sm text-slate-300 font-medium">
              Admissions open for Class 6th to Class 10th CBSE/ICSE Board & Olympiad Batches.
            </p>
          </div>
          <Link
            href="/admission"
            className="px-8 py-4 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl transition shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-slate-950" /> Enroll Now For Next Session
          </Link>
        </div>

      </div>
    </div>
  );
}
