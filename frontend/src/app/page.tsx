'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Users,
  ShieldCheck,
  Star,
  Zap,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/services/api';

export default function HomePage() {
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    grade: 'CLASS_10',
    targetExam: 'CBSE Boards & Foundation',
    city: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads/inquire', leadForm);
      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">

      {/* --- HERO SECTION --- */}
      <section className="relative gradient-hero text-white pt-16 pb-24 overflow-hidden border-b-4 border-brand-gold-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EAB308_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/20 border border-brand-gold-500/40 text-brand-gold-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-brand-gold-400" />
                Specialized Coaching for Classes 6th to 10th
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Build a Strong Academic Foundation With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
                  SADGYANAM
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Expert Guidance. Structured Preparation. Proven Results in CBSE/ICSE Board Exams, Olympiads & Foundation JEE/NEET.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/courses"
                  className="px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-brand-gold-500 hover:bg-brand-gold-400 shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 text-base"
                >
                  <BookOpen className="w-5 h-5" /> Explore Courses
                </Link>
                <Link
                  href="/free-tests"
                  className="px-7 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2 text-base"
                >
                  <Award className="w-5 h-5 text-brand-gold-400" /> Take Free Mock Test
                </Link>
              </div>

              {/* Trust Badge Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-700/60 max-w-xl">
                <div>
                  <p className="text-2xl font-black text-brand-gold-400">98.6%</p>
                  <p className="text-xs text-slate-400 font-medium">Top Board Score</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-gold-400">5000+</p>
                  <p className="text-xs text-slate-400 font-medium">Class 6-10 Alumni</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-gold-400">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Concept Clarity</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Brand Identity */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center space-y-6">

                {/* Official Logo Banner */}
                <div className="w-28 h-28 mx-auto rounded-full bg-white p-1 border-4 border-brand-gold-500 shadow-xl flex items-center justify-center">
                  <Image
                    src="/branding/sadgyanam-logo.png"
                    alt="SADGYANAM Official Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                    priority
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">SADGYANAM</h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-gold-400">
                    Experience the True Knowledge
                  </p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl text-left space-y-2 border border-slate-700/50 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold-400 shrink-0" />
                    <span>Class 6th, 7th, 8th, 9th & 10th Batches</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold-400 shrink-0" />
                    <span>Daily Homework & Olympiad DPPs</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold-400 shrink-0" />
                    <span>Live Parent Progress Tracking Portal</span>
                  </div>
                </div>

                <Link
                  href="/admission"
                  className="w-full py-3 block text-center font-bold text-slate-900 bg-brand-gold-500 rounded-xl hover:bg-brand-gold-400 transition text-sm shadow-md"
                >
                  Enroll Your Child Now For Demo Classes
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- COURSES SECTION (CLASSES 6TH TO 10TH) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold tracking-widest uppercase text-brand-gold-600 bg-brand-gold-100 px-3 py-1 rounded-full">
            Targeted Academic Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue-900">
            Coaching Programs for Classes 6th - 10th
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Meticulously designed syllabus combining NCERT board excellence with competitive foundation preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1: Class 10 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-brand-blue-50 text-brand-blue-800 text-xs font-bold rounded-lg border border-brand-blue-100">
                  CLASS 10TH
                </span>
                <span className="text-xs font-bold text-brand-gold-600 bg-brand-gold-100 px-2.5 py-0.5 rounded-full">
                  1-Year Regular
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Class 10th Board & Foundation Pinnacle
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Complete mastery over Maths, Science, Social Studies & English for 95%+ Board score, plus NTSE & Olympiad preparation.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full NCERT + Exemplar Coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Weekly Board Pattern Tests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Foundation JEE/NEET Pre-requisites
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block line-through">₹28,000</span>
                <span className="text-lg font-black text-brand-blue-800">₹22,500 <span className="text-xs font-normal text-slate-500">/yr</span></span>
              </div>
              <Link
                href="/courses/class-10-cbse-board-foundation"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-blue-800 rounded-lg hover:bg-brand-blue-900 transition"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Card 2: Class 9 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-brand-blue-50 text-brand-blue-800 text-xs font-bold rounded-lg border border-brand-blue-100">
                  CLASS 9TH
                </span>
                <span className="text-xs font-bold text-brand-gold-600 bg-brand-gold-100 px-2.5 py-0.5 rounded-full">
                  1-Year Regular
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Class 9th Board & Olympiad Success
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Build deep conceptual understanding in Physics, Chemistry, Biology & Algebra early for competitive edge.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Science & Maths Core Modules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> IMO & NSO Special Sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Regular Doubt Solving Classes
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block line-through">₹24,000</span>
                <span className="text-lg font-black text-brand-blue-800">₹19,500 <span className="text-xs font-normal text-slate-500">/yr</span></span>
              </div>
              <Link
                href="/courses"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-blue-800 rounded-lg hover:bg-brand-blue-900 transition"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Card 3: Classes 6-8 Foundation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-brand-blue-50 text-brand-blue-800 text-xs font-bold rounded-lg border border-brand-blue-100">
                  CLASSES 6TH - 8TH
                </span>
                <span className="text-xs font-bold text-brand-gold-600 bg-brand-gold-100 px-2.5 py-0.5 rounded-full">
                  Junior Track
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Classes 6, 7 & 8 Junior Olympiad Track
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Ignite curiosity and analytical thinking with fun, structured learning in Science, Maths, and Mental Aptitude.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Visual Learning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Logical Aptitude Booster
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Homi Bhabha & IMO Guidance
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block line-through">₹20,000</span>
                <span className="text-lg font-black text-brand-blue-800">₹16,000 <span className="text-xs font-normal text-slate-500">/yr</span></span>
              </div>
              <Link
                href="/courses"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-blue-800 rounded-lg hover:bg-brand-blue-900 transition"
              >
                View Details
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- WHY SADGYANAM SECTION --- */}
      <section className="bg-brand-blue-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-brand-blue-900">
              Why Parents & Students Choose SADGYANAM
            </h2>
            <p className="text-slate-600 text-sm">
              We combine discipline, academic rigor, and technology to empower every middle school student.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-blue-50 flex items-center justify-center text-brand-blue-800">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Expert Subject Faculty</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Experienced educators specializing in Class 6 to 10 pedagogy and board exam scoring techniques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-blue-50 flex items-center justify-center text-brand-blue-800">
                <BrainCircuit className="w-6 h-6 text-brand-gold-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI Doubt Assistant</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                24/7 instant step-by-step doubt resolution for Maths and Science problems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-blue-50 flex items-center justify-center text-brand-blue-800">
                <Award className="w-6 h-6 text-brand-blue-800" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Regular Board Mock Tests</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Weekly chapter tests & full-length board mock exams with rank & percentile reports.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-blue-50 flex items-center justify-center text-brand-blue-800">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Parent Progress Portal</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Live attendance updates, marks analysis, and teacher remarks accessible to parents anytime.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SCHOLARSHIP BANNER --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-brand-gold-500">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3.5 py-1 bg-brand-gold-500 text-slate-900 font-extrabold text-xs rounded-full inline-block">
              🎓 SADGYANAM SCHOLARSHIP TEST 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Win Up To 100% Scholarship On Coaching Fees!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Test your Science, Maths & Logical Reasoning preparation. Top performers in Class 6 to 10 win merit scholarships.
            </p>
          </div>

          <Link
            href="/scholarship-test"
            className="px-8 py-4 bg-brand-gold-500 text-slate-900 font-black rounded-xl hover:bg-brand-gold-400 transition shadow-xl shrink-0 text-base flex items-center gap-2"
          >
            Register for Scholarship Test <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* --- ADMISSION INQUIRY LEAD FORM --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-50 text-brand-blue-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" /> Admissions Open for 2026-27 Batch
            </div>
            <h2 className="text-3xl font-extrabold text-brand-blue-900">
              Book a Free Counseling Session & Counseling Demo
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fill out the inquiry form and our senior academic counselor will guide you on the ideal batch, syllabus roadmap, and fee options for your child.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-500" />
                <span>Free Diagnostic Test for Class 6th - 10th Students</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-500" />
                <span>One-on-One Faculty Interaction</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-500" />
                <span>Sample Study Material & Workbook Demonstration</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Submitted Successfully!</h3>
                <p className="text-slate-600 text-sm">
                  Our SADGYANAM academic counselor will call you within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Request Academic Call</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Patel"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Class *</label>
                    <select
                      value={leadForm.grade}
                      onChange={(e) => setLeadForm({ ...leadForm, grade: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    >
                      <option value="CLASS_10">Class 10th</option>
                      <option value="CLASS_9">Class 9th</option>
                      <option value="CLASS_8">Class 8th</option>
                      <option value="CLASS_7">Class 7th</option>
                      <option value="CLASS_6">Class 6th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Branch City"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-blue-800 text-white font-bold rounded-xl hover:bg-brand-blue-900 transition shadow-md text-sm"
                >
                  {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
