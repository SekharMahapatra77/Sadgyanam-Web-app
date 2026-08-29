'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  PhoneCall,
  Sparkles,
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader2,
  Download,
} from 'lucide-react';
import { api } from '@/services/api';

interface CourseData {
  _id?: string;
  title: string;
  slug: string;
  shortBio?: string;
  targetClass?: string;
  boardType?: string;
  grade?: string;
  category?: string;
  description: string;
  subjects?: string[];
  price?: number;
  fee?: number;
  durationMonths?: number;
  duration?: string;
  features?: string[];
  pdfUrl?: string;
  thumbnail?: string;
}

const FALLBACK_COURSES: Record<string, CourseData> = {
  'class-10-cbse-board-foundation': {
    _id: 'c10',
    title: 'Class 10th CBSE Board & Foundation JEE/NEET Batch',
    slug: 'class-10-cbse-board-foundation',
    targetClass: 'Class 10th',
    boardType: 'CBSE / ICSE',
    description:
      'Comprehensive 1-year mastery program covering Class 10th Board Exam syllabus in depth along with Foundation JEE/NEET problem-solving techniques.',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'Mental Ability'],
    price: 24999,
    durationMonths: 12,
    features: [
      'Daily 2 Hours Interactive Live & Offline Classes',
      '24/7 AI Study Assistant & Doubt Solving',
      'Chapter-wise Practice Question Banks with 10-Year Board Papers',
      'Bi-Weekly CBT Pattern Mock Tests with NTA Engine',
      'Personalized Progress Reports for Parents',
    ],
  },
  'class-9-board-olympiad-batch': {
    _id: 'c9',
    title: 'Class 9th Board & Junior Science Olympiad Batch',
    slug: 'class-9-board-olympiad-batch',
    targetClass: 'Class 9th',
    boardType: 'CBSE / ICSE',
    description:
      'Specialized foundation program preparing students for Class 9th school exams, IJSO, PRMO, and early JEE/NEET building blocks.',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Logical Reasoning'],
    price: 21999,
    durationMonths: 12,
    features: [
      'Conceptual Physics & Chemistry Lab Modules',
      'Advanced Mathematics Problem Solving for PRMO',
      'Weekly Olympiad Pattern Quiz Engine',
      'Printed Workbooks & Practice Sheets',
    ],
  },
  'class-8-junior-science-olympiad': {
    _id: 'c8',
    title: 'Class 8th Junior Science & Maths Olympiad Program',
    slug: 'class-8-junior-science-olympiad',
    targetClass: 'Class 8th',
    boardType: 'CBSE / ICSE',
    description:
      'Build robust analytical skills and scientific temper with our Class 8th foundation program designed for future top rankers.',
    subjects: ['Mathematics', 'Science', 'Mental Ability'],
    price: 18999,
    durationMonths: 12,
    features: [
      'Interactive 3D Visual Concepts',
      'Mental Ability & Logical Speed Calculation Tricks',
      'Monthly Parent-Teacher Mentorship Meetings',
      'Free Access to CBT Mock Engine',
    ],
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const slugParam = (params?.slug as string) || '';

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      if (!slugParam) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotFound(false);
      try {
        const res = await api.get(`/courses/${slugParam}`);
        if (res.data?.data) {
          setCourse(res.data.data);
        } else if (FALLBACK_COURSES[slugParam]) {
          setCourse(FALLBACK_COURSES[slugParam]);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (FALLBACK_COURSES[slugParam]) {
          setCourse(FALLBACK_COURSES[slugParam]);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-blue-800 animate-spin" />
          <p className="text-sm font-bold text-slate-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 max-w-lg w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Course Not Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The academic course you are looking for does not exist or may have been unpublished by the administrator.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Explore All Available Courses
          </Link>
        </div>
      </div>
    );
  }

  // Safe array dereferencing
  const safeSubjects = Array.isArray(course.subjects) ? course.subjects : ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const safeFeatures = Array.isArray(course.features) && course.features.length > 0
    ? course.features
    : [
        'Daily 2 Hours Interactive Live & Offline Classes',
        '24/7 AI Study Assistant & Doubt Solving',
        'Chapter-wise Practice Question Banks with 10-Year Board Papers',
        'Bi-Weekly CBT Pattern Mock Tests',
      ];

  const displayPrice = course.price ?? course.fee ?? 24999;
  const displayClass = course.targetClass || (course.grade ? course.grade.replace('_', ' ') : 'Class 10th');
  const displayBoard = course.boardType || course.category || 'CBSE / ICSE';
  const displayDuration = course.durationMonths ? `${course.durationMonths} Months` : course.duration || '12 Months';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back to All Academic Courses
        </Link>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-brand-blue-950 via-brand-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-6 border border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand-gold-500 text-slate-950 font-black text-xs uppercase">
              {displayClass}
            </span>
            <span className="px-3 py-1 rounded-full bg-brand-blue-800/80 text-brand-gold-300 font-bold text-xs border border-brand-blue-700">
              {displayBoard}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">{course.title}</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-brand-blue-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold-400" />
              <span>{displayDuration} Program</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-gold-400" />
              <span>Board & Olympiad Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold-400" />
              <span>Includes AI Tutor Access</span>
            </div>
          </div>
        </div>

        {/* Details Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Specs Left Column */}
          <div className="lg:col-span-8 space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            {/* Subjects */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">Subjects Covered</h2>
              <div className="flex flex-wrap gap-2">
                {safeSubjects.map((sub, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                    📚 {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Program Key Highlights</h2>
              <ul className="space-y-3 text-xs font-medium text-slate-700">
                {safeFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course PDF Document if available */}
            {course.pdfUrl && (
              <div className="p-5 rounded-2xl bg-brand-blue-50 border border-brand-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue-800 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-brand-blue-900 text-xs">Course Syllabus & Curriculum PDF</h4>
                    <p className="text-[11px] text-slate-500">Download complete chapter breakdown & brochure</p>
                  </div>
                </div>
                <a
                  href={course.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>
            )}
          </div>

          {/* Pricing & CTA Right Column */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl border-2 border-brand-gold-500/80 shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Program Fee</span>
              <div className="text-4xl font-black text-slate-900">₹{displayPrice.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-emerald-600 font-bold">Includes study material, test series & AI tutor</p>
            </div>

            <div className="space-y-3 pt-2">
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
