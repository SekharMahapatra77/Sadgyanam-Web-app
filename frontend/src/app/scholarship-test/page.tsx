'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, CheckCircle2, PhoneCall, Sparkles, Send, GraduationCap, Clock, FileText } from 'lucide-react';
import { api } from '@/services/api';

export default function ScholarshipTestPage() {
  const [formData, setFormData] = useState({
    name: 'Student Name',
    phone: '',
    email: '',
    targetClass: 'Class 10th',
    schoolName: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/leads/inquire', {
        ...formData,
        inquiryType: 'SCHOLARSHIP',
        source: 'SCHOLARSHIP_TEST',
        notes: `Registered for SNSE 2026 Scholarship Exam for ${formData.targetClass}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check phone & email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brand-blue-950 via-brand-blue-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-md">
              <Award className="w-4 h-4" /> SNSE 2026 Scholarship Exam
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              SADGYANAM National <span className="text-brand-gold-400">Scholarship Exam</span>
            </h1>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Win up to <strong>100% Scholarship</strong> on tuition fees for Class 6th to 10th CBSE/ICSE Board & Olympiad Foundation coaching programs. Identify your academic talent today!
            </p>

            {/* Key Test Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs font-bold">
              <div>
                <div className="text-brand-gold-400 text-lg font-black">Up to 100%</div>
                <div className="text-slate-400 text-[11px]">Fee Waiver Tiers</div>
              </div>
              <div>
                <div className="text-brand-gold-400 text-lg font-black">Online / Offline</div>
                <div className="text-slate-400 text-[11px]">Exam Mode Choice</div>
              </div>
              <div>
                <div className="text-brand-gold-400 text-lg font-black">₹0 Fee</div>
                <div className="text-slate-400 text-[11px]">Free Registration</div>
              </div>
              <div>
                <div className="text-brand-gold-400 text-lg font-black">₹5 Lakhs+</div>
                <div className="text-slate-400 text-[11px]">Cash Reward Pool</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship Reward Tiers */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Scholarship Tiers & Reward Structure</h2>
            <p className="text-xs text-slate-600 font-medium">Scholarships awarded on performance in Science, Maths, & Mental Ability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-brand-gold-500 shadow-xl space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-brand-gold-500 text-slate-950 font-black text-xs flex items-center justify-center">1</div>
              <h3 className="font-extrabold text-lg text-slate-900">Rank 1 to 5</h3>
              <div className="text-3xl font-black text-brand-gold-600">100% OFF</div>
              <p className="text-xs text-slate-600">Full 1-Year Tuition Fee Waiver + Gold Medal & Merit Certificate</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue-100 text-brand-blue-800 font-black text-xs flex items-center justify-center">2</div>
              <h3 className="font-extrabold text-lg text-slate-900">Rank 6 to 20</h3>
              <div className="text-3xl font-black text-brand-blue-800">75% OFF</div>
              <p className="text-xs text-slate-600">75% Tuition Fee Scholarship + Silver Medal & Certificate</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">3</div>
              <h3 className="font-extrabold text-lg text-slate-900">Rank 21 to 50</h3>
              <div className="text-3xl font-black text-emerald-600">50% OFF</div>
              <p className="text-xs text-slate-600">50% Tuition Fee Scholarship + Bronze Medal & Certificate</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center">4</div>
              <h3 className="font-extrabold text-lg text-slate-900">Rank 51 to 200</h3>
              <div className="text-3xl font-black text-slate-700">25% OFF</div>
              <p className="text-xs text-slate-600">25% Tuition Fee Scholarship + Certificate of Merit</p>
            </div>
          </div>
        </div>

        {/* Exam Pattern & Registration Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Exam Details Left Column */}
          <div className="lg:col-span-7 space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">SNSE Exam Pattern & Syllabus</h2>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-brand-blue-800 shrink-0" />
                <div>
                  <div className="text-slate-900 font-bold text-sm">Exam Duration & Questions</div>
                  <div className="text-slate-500">60 Minutes | 40 Multiple Choice Questions (MCQs)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <FileText className="w-5 h-5 text-brand-blue-800 shrink-0" />
                <div>
                  <div className="text-slate-900 font-bold text-sm">Subject Weightage</div>
                  <div className="text-slate-500">Science: 15 Qs | Mathematics: 15 Qs | Mental Ability (MAT): 10 Qs</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Calendar className="w-5 h-5 text-brand-blue-800 shrink-0" />
                <div>
                  <div className="text-slate-900 font-bold text-sm">Upcoming Exam Dates</div>
                  <div className="text-slate-500">Slot A: Every Sunday at 10:00 AM (Online & Offline)</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Target Grades Covered:</h3>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-blue-900">
                <span className="px-3 py-1 bg-brand-blue-50 rounded-xl border border-brand-blue-100">Class 6th</span>
                <span className="px-3 py-1 bg-brand-blue-50 rounded-xl border border-brand-blue-100">Class 7th</span>
                <span className="px-3 py-1 bg-brand-blue-50 rounded-xl border border-brand-blue-100">Class 8th</span>
                <span className="px-3 py-1 bg-brand-blue-50 rounded-xl border border-brand-blue-100">Class 9th</span>
                <span className="px-3 py-1 bg-brand-blue-50 rounded-xl border border-brand-blue-100">Class 10th</span>
              </div>
            </div>
          </div>

          {/* Registration Form Right Column */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border-2 border-brand-gold-500 shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-gold-100 text-brand-gold-900 text-[11px] font-black uppercase">
                Free Registration
              </div>
              <h3 className="text-xl font-black text-slate-900">Register for SNSE 2026</h3>
              <p className="text-xs text-slate-500">Fill in details to receive exam link & admit code.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-base">Registration Successful!</h4>
                <p className="text-xs leading-relaxed">
                  Thank you <strong>{formData.name}</strong>! Your SNSE 2026 hall ticket and exam link have been registered. Our counsellor will reach out via WhatsApp/Call shorty.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs"
                >
                  Register Another Student
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                  >
                    <option value="Class 6th">Class 6th</option>
                    <option value="Class 7th">Class 7th</option>
                    <option value="Class 8th">Class 8th</option>
                    <option value="Class 9th">Class 9th</option>
                    <option value="Class 10th">Class 10th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current School Name</label>
                  <input
                    type="text"
                    placeholder="e.g. DPS Public School"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl shadow-lg hover:shadow-xl transition text-xs flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Register Free For SNSE 2026</>}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
