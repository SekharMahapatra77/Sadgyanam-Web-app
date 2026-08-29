'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import { api } from '@/services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetClass: 'Class 10th',
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
        inquiryType: 'CONTACT',
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-50 border border-brand-blue-200 text-brand-blue-800 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-brand-gold-500" /> We are here to help
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact <span className="text-brand-blue-800">SADGYANAM</span> Institute
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Have questions regarding Class 6th to 10th admissions, batch timings, scholarships, or mock test series? Get in touch with our expert academic counselors.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue-50 text-brand-blue-800 flex items-center justify-center border border-brand-blue-100">
              <MapPin className="w-7 h-7 text-brand-blue-800" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Main Campus Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SADGYANAM Coaching Center, Knowledge Hub Sector, Near City Square, Main Metro Road, India
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gold-50 text-brand-gold-800 flex items-center justify-center border border-brand-gold-200">
              <Phone className="w-7 h-7 text-brand-gold-600" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Phone & WhatsApp Helpline</h3>
            <div className="text-xs text-slate-600 space-y-1 font-semibold">
              <p>+91 98765 43210 (Admissions)</p>
              <p>+91 98765 43211 (Student Support)</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Official Email Addresses</h3>
            <div className="text-xs text-slate-600 space-y-1 font-semibold">
              <p>admissions@sadgyanam.edu.in</p>
              <p>support@sadgyanam.edu.in</p>
            </div>
          </div>
        </div>

        {/* Contact Form & Office Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Send Us a Direct Message</h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-lg">Message Received!</h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  Thank you <strong>{formData.name}</strong>. Our academic team will respond to your query at <strong>{formData.email}</strong> or call <strong>{formData.phone}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Class / Grade</label>
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Inquiry / Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements, course details, or demo class requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Office Hours & Visiting Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-blue-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-brand-gold-400" />
                <h3 className="text-xl font-bold">Campus Visiting Hours</h3>
              </div>
              
              <div className="space-y-3 text-xs border-t border-brand-blue-800 pt-4">
                <div className="flex justify-between py-1 border-b border-brand-blue-800/50">
                  <span className="text-slate-300 font-semibold">Monday - Saturday:</span>
                  <span className="font-bold text-brand-gold-400">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-blue-800/50">
                  <span className="text-slate-300 font-semibold">Sunday:</span>
                  <span className="font-bold text-brand-gold-400">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-300 font-semibold">National Holidays:</span>
                  <span className="font-bold text-slate-400">By Appointment</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-blue-950/60 border border-brand-blue-700/50 text-xs space-y-2">
                <div className="font-bold text-brand-gold-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Free Personal Academic Counseling
                </div>
                <p className="text-slate-300">
                  Parents and students are welcome to visit our campus for personal 1-on-1 counseling with our HODs.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
