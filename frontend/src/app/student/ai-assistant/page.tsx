'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Send, Sparkles, BookOpen, CheckCircle2, ArrowLeft, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

export default function AIAssistantPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login?role=student');
  };

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello Aarav! I am your SADGYANAM AI Study Tutor. Ask me anything about Class 10th Physics, Chemistry, Biology, Mathematics, or Mental Ability!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userQ = prompt.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userQ }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/assistant', {
        prompt: userQ,
        grade: 'Class 10th',
        subject: 'Science & Maths',
      });

      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error connecting to SADGYANAM AI Service. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Navigation & Logout Bar */}
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

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg flex items-center gap-4 border-b-4 border-brand-gold-500">
        <div className="w-12 h-12 rounded-2xl bg-brand-gold-500 text-slate-900 flex items-center justify-center font-bold shrink-0">
          <BrainCircuit className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black">SADGYANAM AI Study Assistant</h1>
          <p className="text-xs text-brand-gold-400 font-medium">
            24/7 Educational Tutor tailored for Class 6th to 10th School & Olympiad Preparation
          </p>
        </div>
      </div>

      {/* Chat Box Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-blue-800 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 font-bold text-xs text-brand-blue-800 mb-2 border-b border-slate-200 pb-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold-500" /> SADGYANAM AI Tutor
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 text-xs px-4 py-3 rounded-2xl animate-pulse font-medium">
                SADGYANAM AI is generating step-by-step educational solution...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex gap-3">
          <input
            type="text"
            placeholder="e.g. Explain lens formula and solve a sample concave mirror problem for Class 10 Science..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-gold-500 text-slate-900 font-bold rounded-xl hover:bg-brand-gold-400 transition shadow-md flex items-center gap-2 text-sm"
          >
            Ask AI <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
