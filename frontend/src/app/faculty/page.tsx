'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, BookOpen, GraduationCap, Star, CheckCircle, Sparkles, PhoneCall } from 'lucide-react';

const FACULTY = [
  {
    id: 1,
    name: 'Dr. Rajesh Sharma',
    title: 'Senior Physics & Science Master Educator',
    qualification: 'Ph.D. in Physics, Ex-FIITJEE Senior Faculty',
    experience: '16+ Years Experience',
    specialization: 'Class 9th & 10th Physics, Olympiad (NSEP, IJSO), Foundation JEE',
    rating: '4.9/5 (1200+ Students)',
    image: '/branding/sadgyanam-logo.png', // fallback logo badge
    bio: 'Renowned expert in conceptual physics for secondary school students. Known for making complex physics concepts simple through interactive experiments.',
    achievements: ['Guided 45+ IJSO Stage 1 Selects', 'Author of 3 Foundation Physics Books', '100% Board Pass Result Record'],
  },
  {
    id: 2,
    name: 'Er. Ananya Verma',
    title: 'Head of Mathematics Department',
    qualification: 'B.Tech IIT Delhi (Electrical)',
    experience: '12+ Years Experience',
    specialization: 'Class 8th to 10th Maths, PRMO, RMO & NTSE Mathematics',
    rating: '4.9/5 (1500+ Students)',
    image: '/branding/sadgyanam-logo.png',
    bio: 'Passionate mathematician specializing in speed calculation techniques, algebraic geometry, and analytical problem solving for school students.',
    achievements: ['PRMO Mentor Certificate', 'Produced 8 NTSE Rankers in 2025', 'Class 10th Board 100/100 Mentor'],
  },
  {
    id: 3,
    name: 'Dr. Sunita Deshmukh',
    title: 'Chief Chemistry Specialist',
    qualification: 'M.Sc., Ph.D. Chemistry (DU)',
    experience: '14+ Years Experience',
    specialization: 'Class 9th & 10th Chemistry, NSEC & Foundation NEET',
    rating: '4.8/5 (1100+ Students)',
    image: '/branding/sadgyanam-logo.png',
    bio: 'Specialist in organic and inorganic foundation chemistry. Focuses on molecular visualization and memory mnemonics for quick retention.',
    achievements: ['Ex-Aakash Senior Faculty', '30+ State Olympiad Winners', 'Excellence in Teaching Award 2024'],
  },
  {
    id: 4,
    name: 'Prof. Vikramaditya Singh',
    title: 'Junior Science & Mental Ability Mentor',
    qualification: 'M.Sc. Mathematics & B.Ed',
    experience: '10+ Years Experience',
    specialization: 'Class 6th & 7th Science & Maths, MAT, Mental Ability',
    rating: '4.9/5 (950+ Students)',
    image: '/branding/sadgyanam-logo.png',
    bio: 'Expert in developing logical reasoning, spatial intelligence, and scientific thinking in young scholars of classes 6th to 8th.',
    achievements: ['JSTSE Mentor Expert', 'Created 500+ Logic Puzzles', 'Junior Foundation Pioneer'],
  },
  {
    id: 5,
    name: 'Meenakshi Sundaram',
    title: 'Social Science & Humanities Faculty',
    qualification: 'M.A. History, B.Ed (Gold Medalist)',
    experience: '11+ Years Experience',
    specialization: 'Class 9th & 10th SST (History, Civics, Geography, Economics)',
    rating: '4.8/5 (800+ Students)',
    image: '/branding/sadgyanam-logo.png',
    bio: 'Transforms Social Science into engaging stories and map-pointing strategies, ensuring students achieve top marks in CBSE Board exams.',
    achievements: ['CBSE Evaluation Specialist', '98% Average SST Score in Boards', 'Interactive Mind Mapping Creator'],
  },
  {
    id: 6,
    name: 'Er. Rohan Kulkarni',
    title: 'Biology & Environmental Science Mentor',
    qualification: 'B.Tech Biotechnology (NIT Rourkela)',
    experience: '8+ Years Experience',
    specialization: 'Class 8th to 10th Biology & Medical Foundation',
    rating: '4.9/5 (900+ Students)',
    image: '/branding/sadgyanam-logo.png',
    bio: 'Uses 3D animated diagrams and practical life-science demonstrations to nurture budding doctors and biologists.',
    achievements: ['NEET Foundation Pioneer', 'Junior Biology Olympiad Trainer', 'Top Rated Educator 2025'],
  },
];

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-50 border border-brand-blue-200 text-brand-blue-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-brand-gold-500" /> World-Class Master Educators
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Meet the Masters of <span className="text-brand-blue-800">SADGYANAM</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Our faculty consists of experienced IITians, Ph.D. scholars, and renowned authors dedicated to empowering Class 6th to 10th students with deep conceptual understanding and exam mastery.
          </p>
        </div>

        {/* Key Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-brand-blue-900 text-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-gold-500 text-slate-950 rounded-2xl shrink-0 font-black text-xl">15+</div>
            <div>
              <h4 className="font-bold text-sm text-brand-gold-400">Avg Experience</h4>
              <p className="text-xs text-slate-300">Years of proven teaching</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-gold-500 text-slate-950 rounded-2xl shrink-0 font-black text-xl">100%</div>
            <div>
              <h4 className="font-bold text-sm text-brand-gold-400">Personal Attention</h4>
              <p className="text-xs text-slate-300">Small batch sizes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-gold-500 text-slate-950 rounded-2xl shrink-0 font-black text-xl">500+</div>
            <div>
              <h4 className="font-bold text-sm text-brand-gold-400">Olympiad Ranks</h4>
              <p className="text-xs text-slate-300">National level selections</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-gold-500 text-slate-950 rounded-2xl shrink-0 font-black text-xl">24x7</div>
            <div>
              <h4 className="font-bold text-sm text-brand-gold-400">Doubt Support</h4>
              <p className="text-xs text-slate-300">In-person & AI assistant</p>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FACULTY.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Card Header & Avatar */}
              <div className="p-6 bg-gradient-to-br from-brand-blue-900 via-brand-blue-800 to-slate-900 text-white relative">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-brand-gold-400 shrink-0 shadow-md">
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-brand-gold-400 transition">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-brand-gold-300 font-semibold">{teacher.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{teacher.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <GraduationCap className="w-4 h-4 text-brand-blue-800 shrink-0" />
                      <span>{teacher.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-brand-gold-700">
                      <Award className="w-4 h-4 text-brand-gold-600 shrink-0" />
                      <span>{teacher.experience}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {teacher.bio}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Specializations & Subjects:
                    </span>
                    <p className="text-xs font-semibold text-brand-blue-900 bg-brand-blue-50 p-2.5 rounded-xl border border-brand-blue-100">
                      {teacher.specialization}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Mentorship Achievements:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      {teacher.achievements.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/book-demo"
                    className="w-full py-2.5 text-center text-xs font-bold text-brand-blue-800 bg-slate-100 hover:bg-brand-blue-800 hover:text-white rounded-xl transition"
                  >
                    Book Demo Class with Faculty
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bottom Banner */}
        <div className="bg-gradient-to-r from-brand-gold-500 via-amber-500 to-brand-gold-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Want to Learn from India's Top Mentors?</h3>
            <p className="text-sm font-semibold text-slate-900">
              Join SADGYANAM for Class 6th - 10th CBSE/ICSE Board & Olympiad Foundation batches.
            </p>
          </div>
          <Link
            href="/admission"
            className="px-8 py-4 bg-brand-blue-900 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:bg-brand-blue-950 transition shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-brand-gold-400" /> Apply For Admission
          </Link>
        </div>

      </div>
    </div>
  );
}
