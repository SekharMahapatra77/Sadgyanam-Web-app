'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Clock, FileText, Play, CheckCircle, Sparkles, Filter, Lock } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

interface MockTest {
  _id: string;
  title: string;
  targetClass: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  description: string;
  pdfUrl?: string;
}

const FALLBACK_FREE_TESTS: MockTest[] = [
  {
    _id: 'free_test_class10_maths',
    title: 'Class 10th Real Numbers & Polynomials Mock Challenge',
    targetClass: 'Class 10th',
    subject: 'Mathematics',
    durationMinutes: 30,
    totalMarks: 40,
    questionCount: 15,
    description: 'Test your grasp on Euclid division, prime factorization, and zeroes of quadratic polynomials.',
  },
  {
    _id: 'free_test_class10_science',
    title: 'Class 10th Chemical Reactions & Equations Practice',
    targetClass: 'Class 10th',
    subject: 'Science',
    durationMinutes: 30,
    totalMarks: 40,
    questionCount: 15,
    description: 'Master balancing chemical equations, oxidation-reduction, and displacement reactions.',
  },
  {
    _id: 'free_test_class9_science',
    title: 'Class 9th Matter in Our Surroundings & Motion',
    targetClass: 'Class 9th',
    subject: 'Science',
    durationMinutes: 25,
    totalMarks: 35,
    questionCount: 12,
    description: 'Evaluate your understanding of physical states of matter, latent heat, and distance-time graphs.',
  },
  {
    _id: 'free_test_class8_maths',
    title: 'Class 8th Rational Numbers & Linear Equations',
    targetClass: 'Class 8th',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 30,
    questionCount: 12,
    description: 'Solve one-variable linear equations and properties of rational numbers.',
  },
  {
    _id: 'free_test_class7_science',
    title: 'Class 7th Nutrition in Plants & Heat Test',
    targetClass: 'Class 7th',
    subject: 'Science',
    durationMinutes: 20,
    totalMarks: 25,
    questionCount: 10,
    description: 'Photosynthesis mechanisms, autotrophic nutrition, and thermal conductivity fundamentals.',
  },
  {
    _id: 'free_test_class6_mat',
    title: 'Class 6th Mental Ability & Logical Reasoning Demo',
    targetClass: 'Class 6th',
    subject: 'Mental Ability',
    durationMinutes: 20,
    totalMarks: 25,
    questionCount: 10,
    description: 'Fun and analytical puzzle challenge for young minds starting foundation preparation.',
  },
];

export default function FreeTestsPage() {
  const { user } = useAuthStore();
  const [tests, setTests] = useState<MockTest[]>(FALLBACK_FREE_TESTS);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  useEffect(() => {
    async function fetchFreeTests() {
      try {
        const res = await api.get('/tests/public/free');
        if (res.data?.data && res.data.data.length > 0) {
          setTests(res.data.data);
        }
      } catch (err) {
        console.log('Using default mock tests...');
      }
    }
    fetchFreeTests();
  }, []);

  const filteredTests = selectedClass === 'ALL'
    ? tests
    : tests.filter((t) => t.targetClass === selectedClass);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-100 border border-brand-gold-300 text-brand-gold-900 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-brand-gold-600" /> Free CBT Mock Test Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Practice Real Board & Olympiad <span className="text-brand-blue-800">Mock Tests</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Experience SADGYANAM's real NTA-style online computer-based test platform. Instant score reports, subject-wise analytics, and detailed step-by-step solutions!
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {['ALL', 'Class 10th', 'Class 9th', 'Class 8th', 'Class 7th', 'Class 6th'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedClass === cls
                  ? 'bg-brand-blue-800 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cls === 'ALL' ? 'All Classes' : cls}
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue-50 text-brand-blue-800 border border-brand-blue-100">
                    {test.targetClass}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold-50 text-brand-gold-700 border border-brand-gold-200">
                    {test.subject}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{test.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{test.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center text-xs">
                  <div>
                    <div className="text-slate-400 font-medium text-[10px]">Duration</div>
                    <div className="font-bold text-slate-800 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-brand-blue-800" /> {test.durationMinutes} m
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium text-[10px]">Questions</div>
                    <div className="font-bold text-slate-800 flex items-center justify-center gap-1">
                      <FileText className="w-3 h-3 text-brand-blue-800" /> {test.questionCount} Q
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium text-[10px]">Marks</div>
                    <div className="font-bold text-slate-800 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {test.totalMarks} M
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                {test.pdfUrl && (
                  <a
                    href={test.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs border border-slate-300"
                  >
                    <FileText className="w-4 h-4 text-brand-blue-800" /> Download Test Paper PDF
                  </a>
                )}
                {user ? (
                  <Link
                    href={`/exam/${test._id}`}
                    className="w-full py-3 bg-brand-blue-800 text-white font-bold rounded-xl hover:bg-brand-blue-900 transition shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Free Test Now
                  </Link>
                ) : (
                  <Link
                    href="/login?role=student"
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <Lock className="w-4 h-4" /> Login Student Panel to Attempt
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards Footer */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 text-center">
            Why Students Practice on SADGYANAM CBT Test Engine?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-brand-blue-800 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold-500" /> Real Exam Interface
              </div>
              <p className="text-slate-600">Simulates NTA and CBSE online exam interfaces with timers, question palette, and review flags.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-brand-blue-800 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Instant Score Card
              </div>
              <p className="text-slate-600">Get immediate evaluation with accuracy graphs, speed per question, and negative marking check.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-brand-blue-800 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-gold-600" /> AI Step-by-Step Solutions
              </div>
              <p className="text-slate-600">Our AI Study Assistant explains incorrect answers step-by-step for complete doubt clearance.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
