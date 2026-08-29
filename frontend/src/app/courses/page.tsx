'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    CheckCircle2,
    GraduationCap,
    ArrowRight,
    Loader2,
    AlertCircle,
} from 'lucide-react';

import { api } from '@/services/api';

interface Course {
    _id: string;
    title: string;
    slug: string;
    grade: string;
    category?: string;
    description?: string;
    duration?: string;
    fee?: number;
    features?: string[];
}

const gradeLabels: Record<string, string> = {
    CLASS_6: 'Class 6th',
    CLASS_7: 'Class 7th',
    CLASS_8: 'Class 8th',
    CLASS_9: 'Class 9th',
    CLASS_10: 'Class 10th',
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await api.get('/courses');

                setCourses(response.data?.data || []);
            } catch (err) {
                console.error('Failed to load courses:', err);
                setError('Unable to load courses right now. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Hero */}
            <section className="gradient-hero text-white border-b-4 border-brand-gold-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

                    <div className="max-w-3xl">

                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/20 border border-brand-gold-500/40 text-brand-gold-400 font-bold text-xs uppercase tracking-wider">
                            <GraduationCap className="w-4 h-4" />
                            Academic Programs
                        </div>

                        <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
                            Coaching Programs for{' '}
                            <span className="text-brand-gold-400">
                                Classes 6th to 10th
                            </span>
                        </h1>

                        <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                            Build strong academic fundamentals with structured board
                            preparation, Olympiad guidance and competitive foundation
                            programs designed for Classes 6th to 10th.
                        </p>

                    </div>

                </div>
            </section>

            {/* Courses */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Section heading */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">

                    <div>
                        <span className="text-xs font-extrabold tracking-widest uppercase text-brand-gold-600 bg-brand-gold-100 px-3 py-1 rounded-full">
                            Available Programs
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-brand-blue-900">
                            Choose Your Academic Track
                        </h2>

                        <p className="mt-2 text-slate-600 text-sm">
                            Select a program based on your class and academic goals.
                        </p>
                    </div>

                    {!loading && !error && (
                        <div className="text-sm font-semibold text-slate-500">
                            {courses.length} program{courses.length !== 1 ? 's' : ''} available
                        </div>
                    )}

                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">

                        <Loader2 className="w-10 h-10 text-brand-blue-800 animate-spin" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading coaching programs...
                        </p>

                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />

                        <h3 className="mt-4 font-bold text-red-900">
                            Unable to load courses
                        </h3>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 px-5 py-2.5 rounded-lg bg-brand-blue-800 text-white text-sm font-bold hover:bg-brand-blue-900 transition"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* Empty */}
                {!loading && !error && courses.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />

                        <h3 className="mt-4 text-xl font-bold text-slate-900">
                            No courses available
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Coaching programs will appear here once they are published.
                        </p>

                    </div>
                )}

                {/* Course cards */}
                {!loading && !error && courses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

                        {courses.map((course) => (

                            <article
                                key={course._id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm card-hover overflow-hidden flex flex-col"
                            >

                                {/* Card top */}
                                <div className="bg-gradient-to-br from-brand-blue-900 to-brand-blue-700 p-6 text-white">

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-bold">
                                            {gradeLabels[course.grade] || course.grade}
                                        </span>

                                        {course.category && (
                                            <span className="text-xs font-semibold text-brand-gold-400">
                                                {course.category}
                                            </span>
                                        )}

                                    </div>

                                    <div className="mt-6 w-12 h-12 rounded-xl bg-brand-gold-500 flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-slate-900" />
                                    </div>

                                    <h3 className="mt-5 text-xl font-extrabold leading-snug">
                                        {course.title}
                                    </h3>

                                </div>

                                {/* Card body */}
                                <div className="p-6 flex-1 flex flex-col">

                                    {course.description && (
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {course.description}
                                        </p>
                                    )}

                                    {/* Features */}
                                    {course.features && course.features.length > 0 && (
                                        <ul className="mt-5 space-y-2.5">

                                            {course.features.slice(0, 4).map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-xs text-slate-700"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}

                                        </ul>
                                    )}

                                    {/* Bottom */}
                                    <div className="mt-auto pt-6">

                                        <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">

                                            <div>

                                                {course.duration && (
                                                    <p className="text-xs text-slate-500">
                                                        Duration: {course.duration}
                                                    </p>
                                                )}

                                                {typeof course.fee === 'number' && (
                                                    <p className="mt-1 text-lg font-black text-brand-blue-800">
                                                        ₹{course.fee.toLocaleString('en-IN')}
                                                    </p>
                                                )}

                                            </div>

                                            <Link
                                                href={`/courses/${course.slug}`}
                                                className="px-4 py-2.5 rounded-lg bg-brand-blue-800 text-white text-xs font-bold hover:bg-brand-blue-900 transition flex items-center gap-2"
                                            >
                                                View Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white border-2 border-brand-gold-500 shadow-xl">

                    <div className="max-w-3xl">

                        <span className="inline-block px-3 py-1 bg-brand-gold-500 text-slate-900 font-extrabold text-xs rounded-full">
                            ADMISSIONS OPEN 2026-27
                        </span>

                        <h2 className="mt-4 text-3xl sm:text-4xl font-black">
                            Not sure which program is right for your child?
                        </h2>

                        <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                            Talk to our academic counselors and get guidance based on
                            your child's class, current preparation and academic goals.
                        </p>

                        <Link
                            href="/admission"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 rounded-xl bg-brand-gold-500 text-slate-900 font-black text-sm hover:bg-brand-gold-400 transition"
                        >
                            Get Free Counseling
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}