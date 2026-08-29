'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, PhoneCall, Send, Calendar, Clock, GraduationCap } from 'lucide-react';
import { api } from '@/services/api';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetClass: 'Class 10th',
    preferredSubject: 'Science & Maths',
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
        inquiryType: 'DEMO',
        source: 'DEMO_BOOKING',
        notes: `Free 3-Day Demo Class Request for ${formData.targetClass} (${formData.preferredSubject})`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo booking failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-100 border border-brand-gold-300 text-brand-gold-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-brand-gold-600" /> Free 3-Day Classroom & Online Trial
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Book a <span className="text-brand-blue-800">Free Demo Class</span>
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience SADGYANAM's interactive teaching methodology, live doubt solving, and animated study materials with zero obligation.
          </p>
        </div>

        {/* Demo Booking Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-8">
          
          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-black">Demo Class Confirmed!</h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
                Thank you <strong>{formData.name}</strong>! Your 3-day free demo pass for <strong>{formData.targetClass}</strong> has been reserved. Our academic coordinator will call <strong>{formData.phone}</strong> to confirm your batch slot.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="px-6 py-3 bg-brand-blue-800 text-white rounded-xl font-bold text-xs shadow-md inline-block"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                  >
                    <option value="Class 6th">Class 6th</option>
                    <option value="Class 7th">Class 7th</option>
                    <option value="Class 8th">Class 8th</option>
                    <option value="Class 9th">Class 9th</option>
                    <option value="Class 10th">Class 10th</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Demo Subject Focus</label>
                <select
                  value={formData.preferredSubject}
                  onChange={(e) => setFormData({ ...formData, preferredSubject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                >
                  <option value="Science & Maths">Science & Mathematics Combined</option>
                  <option value="Physics & Chemistry">Physics & Chemistry Focus</option>
                  <option value="Mathematics & Mental Ability">Mathematics & Mental Ability</option>
                  <option value="Olympiad Foundation">Olympiad Foundation Special</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl shadow-xl transition text-xs flex items-center justify-center gap-2"
              >
                {loading ? 'Reserving Seat...' : <><Send className="w-4 h-4" /> Reserve Free 3-Day Demo Seat</>}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
