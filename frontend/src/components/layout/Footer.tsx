'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';

interface ProgramItem {
  _id?: string;
  title: string;
  slug: string;
}

const DEFAULT_PROGRAMS: ProgramItem[] = [
  { title: 'Class 10th CBSE Board & Foundation', slug: 'class-10-cbse-board-foundation' },
  { title: 'Class 9th Board & Olympiad Batch', slug: 'class-9-board-olympiad-batch' },
  { title: 'Class 8th Junior Science Olympiad', slug: 'class-8-junior-science-olympiad' },
  { title: 'Class 7th Foundation Program', slug: 'class-7-foundation-program' },
  { title: 'Class 6th Young Scholars Track', slug: 'class-6-young-scholars-track' },
];

export const Footer = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await api.get('/academic-programs/public');
        if (res.data?.data && res.data.data.length > 0) {
          setPrograms(res.data.data);
        }
      } catch (err) {
        // Fallback to default programs
      }
    }
    loadPrograms();
  }, []);

  return (
    <footer className="bg-brand-blue-900 text-slate-300 pt-16 pb-8 border-t-4 border-brand-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden border border-brand-gold-500">
                <Image
                  src="/branding/sadgyanam-logo.png"
                  alt="SADGYANAM Coaching Center Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">SADGYANAM</h3>
                <p className="text-xs text-brand-gold-400 font-bold uppercase tracking-widest">
                  Experience the True Knowledge
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premier Coaching Institute for Class 6th to Class 10th students. Delivering academic excellence in CBSE/ICSE Board exams, Olympiads, NTSE, and Foundation JEE/NEET.
            </p>
            <div className="flex items-center gap-2 text-brand-gold-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" /> ISO Certified & Government Registered Coaching Institute
            </div>
          </div>

          {/* Academic Programs (Dynamic Footer) */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-l-4 border-brand-gold-500 pl-3">
              Academic Programs
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-400">
              {programs.map((prog, idx) => (
                <li key={prog._id || idx}>
                  <Link href={`/academic-programs/${prog.slug}`} className="hover:text-brand-gold-400 transition">
                    {prog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-l-4 border-brand-gold-500 pl-3">
              Student & Parent Corner
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-400">
              <li><Link href="/free-tests" className="hover:text-brand-gold-400 transition">Free Mock Test Engine</Link></li>
              <li><Link href="/scholarship-test" className="hover:text-brand-gold-400 transition">Scholarship Exam Portal</Link></li>
              <li><Link href="/results" className="hover:text-brand-gold-400 transition">Top Rankers & Success Stories</Link></li>
              <li><Link href="/login" className="hover:text-brand-gold-400 transition">Student Login</Link></li>
              <li><Link href="/login" className="hover:text-brand-gold-400 transition">Parent Portal</Link></li>
              <li><Link href="/book-demo" className="hover:text-brand-gold-400 transition">Book Free Demo Class</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-l-4 border-brand-gold-500 pl-3">
              Institute Contacts
            </h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <span>SADGYANAM Main Campus, Knowledge Hub Sector, Near City Square, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold-500 shrink-0" />
                <span>+91 98765 43210 / +91 98765 43211</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold-500 shrink-0" />
                <span>admissions@sadgyanam.edu.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 SADGYANAM Coaching Center. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium">Built with Excellence for Class 6th to 10th Education.</p>
        </div>
      </div>
    </footer>
  );
};
