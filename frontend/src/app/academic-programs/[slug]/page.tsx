'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  CheckCircle,
  PhoneCall,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { api } from '@/services/api';

interface ProgramData {
  _id?: string;
  title: string;
  slug: string;
  grade?: string;
  category?: string;
  bio?: string;
  content: string;
  highlights?: string[];
  image?: string;
}

const FALLBACK_PROGRAMS: Record<string, ProgramData> = {
  'class-10-cbse-board-foundation': {
    title: 'Class 10th CBSE Board & Foundation',
    slug: 'class-10-cbse-board-foundation',
    grade: 'Class 10th',
    category: 'Academic Board & Foundation',
    bio: 'Pinnacle 1-Year Board & Foundation Program for Class 10th.',
    content:
      'Comprehensive 1-year mastery program covering Class 10th Board Exam syllabus in depth along with Foundation JEE/NEET problem-solving techniques.',
    highlights: [
      'Daily Live & Offline Classes by Senior Faculty',
      '24/7 AI Doubt Solver & Performance Analytics',
      'Previous 10-Year Board Paper Bank with Solutions',
      'Bi-Weekly CBT Pattern Mock Tests',
    ],
  },
  'class-9-board-olympiad-batch': {
    title: 'Class 9th Board & Olympiad Batch',
    slug: 'class-9-board-olympiad-batch',
    grade: 'Class 9th',
    category: 'Board & Olympiad Track',
    bio: 'Specialized foundation program preparing students for Class 9th school exams, IJSO, PRMO, and early JEE/NEET building blocks.',
    content:
      'Specialized foundation program preparing students for Class 9th school exams, IJSO, PRMO, and early JEE/NEET building blocks.',
    highlights: [
      'Conceptual Physics & Chemistry Lab Modules',
      'Advanced Mathematics Problem Solving for PRMO',
      'Weekly Olympiad Pattern Quiz Engine',
    ],
  },
  'class-8-junior-science-olympiad': {
    title: 'Class 8th Junior Science Olympiad',
    slug: 'class-8-junior-science-olympiad',
    grade: 'Class 8th',
    category: 'Junior Olympiad Track',
    bio: 'Build robust analytical skills and scientific temper with our Class 8th foundation program.',
    content:
      'Build robust analytical skills and scientific temper with our Class 8th foundation program designed for future top rankers.',
    highlights: [
      'Interactive 3D Visual Concepts',
      'Mental Ability & Logical Speed Calculation Tricks',
      'Monthly Parent-Teacher Mentorship Meetings',
    ],
  },
};

export default function AcademicProgramDetailPage() {
  const params = useParams();
  const slugParam = (params?.slug as string) || '';

  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProgram() {
      if (!slugParam) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotFound(false);
      try {
        const res = await api.get(`/academic-programs/${slugParam}`);
        if (res.data?.data) {
          setProgram(res.data.data);
        } else if (FALLBACK_PROGRAMS[slugParam]) {
          setProgram(FALLBACK_PROGRAMS[slugParam]);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (FALLBACK_PROGRAMS[slugParam]) {
          setProgram(FALLBACK_PROGRAMS[slugParam]);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-blue-800 animate-spin" />
          <p className="text-sm font-bold text-slate-600">Loading Academic Program details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !program) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 max-w-lg w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Academic Program Not Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The requested Academic Program does not exist or may have been updated.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> View All Coaching Programs
          </Link>
        </div>
      </div>
    );
  }

  const safeHighlights = Array.isArray(program.highlights) && program.highlights.length > 0
    ? program.highlights
    : [
      'Structured Board & Competitive Foundation Curriculum',
      'Experienced Senior Faculty & Mentors',
      'Personalized Parent Dashboards & Progress Reports',
    ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home Page
        </Link>

        {/* Banner */}
        <div className="bg-gradient-to-br from-brand-blue-950 via-brand-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-6 border border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand-gold-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> {program.grade || 'Class 10th'}
            </span>
            <span className="px-3 py-1 rounded-full bg-brand-blue-800/80 text-brand-gold-300 font-bold text-xs border border-brand-blue-700">
              {program.category || 'Academic Program'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">{program.title}</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">{program.bio || program.content}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-blue-800" /> Program Overview & Curriculum Details
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {program.content}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Program Highlights</h2>
              <ul className="space-y-3 text-xs font-medium text-slate-700">
                {safeHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column Action Box */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl border-2 border-brand-gold-500/80 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-3 text-center">
              <span className="px-3 py-1 bg-brand-gold-100 text-brand-gold-900 font-extrabold text-[11px] rounded-full uppercase">
                Academic Session 2026-27
              </span>
              <h3 className="text-xl font-black text-slate-900 pt-2">Enroll Your Child</h3>
              <p className="text-xs text-slate-500">
                Admissions open for Class 6th to 10th. Get free counseling and trial demo classes.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/admission"
                className="w-full py-3.5 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Apply for Admission Now
              </Link>
              <Link
                href="/book-demo"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-gold-500" /> Book Free Demo Class
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
