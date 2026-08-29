'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, CheckCircle2, ShieldCheck, Award, Sparkles, Send, BookOpen, GraduationCap, Users } from 'lucide-react';
import { api } from '@/services/api';

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    phone: '',
    email: '',
    targetClass: 'Class 10th',
    boardType: 'CBSE',
    schoolName: '',
    notes: '',
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
        inquiryType: 'ADMISSION',
        source: 'WEBSITE_FORM',
        notes: `Admission application for ${formData.targetClass} (${formData.boardType}). Parent: ${formData.parentName}. Notes: ${formData.notes}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admission application failed. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-sm">
            <PhoneCall className="w-4 h-4" /> Academic Session 2026-27 Admissions Open
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-blue-950 tracking-tight">
            Online Admission & <span className="text-brand-gold-500">Enrollment Portal</span>
          </h1>
          <p className="text-base text-slate-700 max-w-3xl leading-relaxed font-medium">
            Secure your seat for Class 6th to Class 10th CBSE/ICSE Board & Olympiad Foundation coaching batches. Small batch sizes, expert faculty, and proven top results!
          </p>
        </div>

        {/* Admission Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border-2 border-brand-gold-500/60 shadow-2xl space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-900">Student Admission Form</h2>
              <p className="text-xs text-slate-500 font-medium">Please fill in student & parent details below.</p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-black">Admission Application Received!</h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
                  Congratulations <strong>{formData.name}</strong>! Your application for <strong>{formData.targetClass}</strong> has been registered. Our admission office will contact parent <strong>{formData.parentName}</strong> at <strong>{formData.phone}</strong> with batch timings & fee details.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Sharma"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
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
                      placeholder="parent@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Applying For Class</label>
                    <select
                      value={formData.targetClass}
                      onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    >
                      <option value="Class 6th">Class 6th (Young Scholars)</option>
                      <option value="Class 7th">Class 7th (Foundation Track)</option>
                      <option value="Class 8th">Class 8th (Junior Olympiad)</option>
                      <option value="Class 9th">Class 9th (Board & Olympiad)</option>
                      <option value="Class 10th">Class 10th (CBSE Board & Foundation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Board Affiliation</label>
                    <select
                      value={formData.boardType}
                      onChange={(e) => setFormData({ ...formData, boardType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                    >
                      <option value="CBSE">CBSE Board</option>
                      <option value="ICSE">ICSE Board</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current School Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi Public School"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Requirements / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific batch timing requests or scholarship exam scores..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl shadow-xl transition text-xs flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting Application...' : <><Send className="w-4 h-4" /> Submit Admission Application</>}
                </button>
              </form>
            )}
          </div>

          {/* Admission Benefits Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="text-xl font-black text-slate-900">Why Enroll at SADGYANAM?</h3>
              
              <ul className="space-y-4 text-xs font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Small Batch Size Guarantee</div>
                    <div className="text-slate-500">Maximum 25-30 students per batch for individual focus.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">24/7 AI Tutor & Doubt Engine</div>
                    <div className="text-slate-500">Instant step-by-step doubt solving on app.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Comprehensive Printed Study Modules</div>
                    <div className="text-slate-500">NCERT mapped theory + previous 10-year solved papers.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Parent Analytics Dashboard</div>
                    <div className="text-slate-500">Real-time attendance & test performance tracking.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-brand-blue-900 text-white p-6 rounded-3xl shadow-lg space-y-2 text-center">
              <Award className="w-8 h-8 text-brand-gold-400 mx-auto" />
              <h4 className="font-bold text-sm">Need Scholarship Info?</h4>
              <p className="text-xs text-slate-300">Take our free online scholarship exam & save up to 100% on tuition fees.</p>
              <div className="pt-2">
                <Link
                  href="/scholarship-test"
                  className="inline-block px-4 py-2 bg-brand-gold-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-brand-gold-400 transition"
                >
                  Explore Scholarship Exam
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
