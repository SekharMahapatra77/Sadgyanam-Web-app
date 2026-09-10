'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Send,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api, API_ORIGIN } from '@/services/api';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login?role=student');
  };
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [latestNotes, setLatestNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  // Faculty Remarks State
  const [myRemarks, setMyRemarks] = useState<any[]>([]);
  const [remarksLoading, setRemarksLoading] = useState(true);

  // Dynamic Attendance State from MongoDB
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // Dynamic Dashboard Overview State
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  React.useEffect(() => {
    api.get('/announcements/public').then((res) => setAnnouncements(res.data?.data || [])).catch(() => setAnnouncements([]));
    
    api.get('/student/materials?limit=3')
      .then((res) => setLatestNotes(res.data?.data || []))
      .catch(() => {
        api.get('/materials/public?limit=3')
          .then((res) => setLatestNotes(res.data?.data || []))
          .catch(() => setLatestNotes([]));
      })
      .finally(() => setNotesLoading(false));

    // Fetch dynamic real attendance from MongoDB
    api.get('/student/attendance')
      .then((res) => setAttendanceData(res.data?.data || null))
      .catch(() => setAttendanceData(null))
      .finally(() => setAttendanceLoading(false));

    // Fetch faculty remarks for logged-in student
    api.get('/student/remarks')
      .then((res) => setMyRemarks(res.data?.data || []))
      .catch(() => setMyRemarks([]))
      .finally(() => setRemarksLoading(false));

    // Fetch dynamic dashboard overview from backend
    api.get('/student/dashboard-overview')
      .then((res) => setOverviewData(res.data?.data || null))
      .catch(() => setOverviewData(null))
      .finally(() => setOverviewLoading(false));
  }, []);

  const assetUrl = (url: string) => (url?.startsWith('http') ? url : `${API_ORIGIN}${url || ''}`);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/assistant', { prompt: aiPrompt });
      if (res.data?.data?.response) {
        setAiResponse(res.data.data.response);
      } else {
        setAiResponse(`Solution for "${aiPrompt}": According to NCERT Class 10 rules, apply the formula step-by-step. Break the problem into given values, substituted equation, and final SI units!`);
      }
    } catch (err) {
      setAiResponse(`Solution for "${aiPrompt}": According to NCERT Class 10 rules, apply the formula step-by-step. Break the problem into given values, substituted equation, and final SI units!`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 min-w-0 max-w-full overflow-x-hidden">

      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b-4 border-brand-gold-500">
        <div>
          <span className="px-3 py-1 bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/40 rounded-full font-bold text-xs">
            {overviewData?.student?.bannerClassText || (user as any)?.grade || 'Class 10th CBSE & Foundation'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Welcome, {overviewData?.student?.name || user?.name || 'Aarav Patel'} 👋</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Student ID: <span className="text-white font-semibold">{overviewData?.student?.enrollmentNo || user?.email || 'student@student.sadgyanam.edu.in'}</span> | Keep up the consistent effort!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('AI')}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-brand-gold-500 text-slate-950 font-extrabold rounded-xl hover:bg-brand-gold-400 transition shadow-md text-xs sm:text-sm flex items-center gap-2 shrink-0 justify-center flex-1 sm:flex-none"
          >
            <BrainCircuit className="w-4 h-4" /> Ask SADGYANAM AI Tutor
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl transition shadow-md text-xs sm:text-sm flex items-center gap-2 shrink-0 border border-rose-500/30 justify-center"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Student Portal Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin max-w-full">
        {[
          { id: 'OVERVIEW', label: '1. My Dashboard Overview' },
          { id: 'COURSES', label: '2. My Enrolled Courses & Notes' },
          { id: 'TESTS', label: '3. Online Mock Test Engine' },
          { id: 'AI', label: '4. AI Study Assistant' },
          { id: 'ANNOUNCEMENTS', label: '5. Institute Notices' },
          { id: 'REMARKS', label: '6. Faculty Remarks Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === tab.id
              ? 'bg-brand-blue-800 text-white font-extrabold shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Score</span>
          {overviewLoading ? (
            <div className="text-xs font-bold text-slate-400 py-2">Loading score...</div>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-brand-blue-800">
                  {overviewData?.overallScore?.value || 'N/A'}
                </span>
                {overviewData?.overallScore?.hasData && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> CBT Avg
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {overviewData?.overallScore?.label || 'CBSE Benchmark'}
              </p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
          {attendanceLoading ? (
            <div className="text-xs font-bold text-slate-400 py-2">Loading attendance...</div>
          ) : attendanceData?.hasRecords ? (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-slate-900">{attendanceData.attendancePercentage}%</span>
                <span className={`text-xs font-bold ${attendanceData.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {attendanceData.attendancePercentage >= 75 ? 'On Track' : 'Needs Improvement'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {attendanceData.presentCount} / {attendanceData.totalClasses} Classes Attended ({attendanceData.absentCount} Absent)
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-400">N/A</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">No Records</span>
              </div>
              <p className="text-xs text-slate-400">No attendance recorded yet</p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mock Tests Taken</span>
          {overviewLoading ? (
            <div className="text-xs font-bold text-slate-400 py-2">Loading tests...</div>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-slate-900">
                  {overviewData?.mockTestsTaken?.count ?? 0}
                </span>
                {overviewData?.mockTestsTaken?.count > 0 && (
                  <span className="text-xs font-bold text-brand-blue-800">
                    Avg. {overviewData.mockTestsTaken.avgPercentage}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">
                {overviewData?.mockTestsTaken?.count > 0 && overviewData?.mockTestsTaken?.lastTest
                  ? `Last test: ${overviewData.mockTestsTaken.lastTest.title} (${overviewData.mockTestsTaken.lastTest.score}/${overviewData.mockTestsTaken.lastTest.totalMarks})`
                  : 'No mock tests taken yet'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-lg">My Enrolled Course</h2>
                <span className="text-xs font-bold text-brand-blue-800 bg-brand-blue-50 px-2.5 py-1 rounded-md">
                  Active Enrollment
                </span>
              </div>

              {overviewLoading ? (
                <div className="p-4 text-xs font-bold text-slate-400">Loading course details...</div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">
                      {overviewData?.enrolledCourse?.title || 'Class 10th CBSE Board & Foundation Pinnacle Program'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {overviewData?.enrolledCourse?.timing || 'Timing: 04:30 PM - 07:30 PM (Mon - Sat) | Hybrid Mode'}
                    </p>
                  </div>
                  <Link
                    href="/student/courses"
                    className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-lg text-xs hover:bg-brand-blue-900 transition shrink-0"
                  >
                    Access Course Notes & Videos
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-lg">Available Online Mock Tests</h2>
                <button onClick={() => setActiveTab('TESTS')} className="text-xs font-bold text-brand-blue-800 flex items-center gap-1 hover:underline">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {overviewLoading ? (
                <div className="p-4 text-xs font-bold text-slate-400">Loading available tests...</div>
              ) : overviewData?.availableMockTests && overviewData.availableMockTests.length > 0 ? (
                <div className="space-y-3">
                  {overviewData.availableMockTests.map((t: any) => (
                    <div key={t._id} className="p-4 rounded-xl border border-slate-200 hover:border-brand-blue-800 transition flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                        <p className="text-xs text-slate-500">
                          Duration: {t.durationMinutes} Mins | Total Marks: {t.totalMarks}
                        </p>
                      </div>
                      <Link
                        href={`/exam/${t._id}`}
                        className="px-4 py-2 bg-brand-gold-500 text-slate-950 font-extrabold rounded-lg text-xs hover:bg-brand-gold-400 transition shrink-0"
                      >
                        Start CBT Test
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                  No online mock tests currently available for your class.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-brand-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-brand-gold-500 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold-500 text-slate-900 flex items-center justify-center font-bold">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Doubt Solver</h3>
                  <p className="text-xs text-brand-gold-400 font-semibold">24/7 Class 6-10 Tutor</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stuck on a Class 10 Physics numerical or Geometry theorem? Ask step-by-step NCERT questions.
              </p>
              <button
                onClick={() => setActiveTab('AI')}
                className="block w-full text-center py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
              >
                Ask AI Tutor Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MY COURSES / NOTES TAB */}
      {activeTab === 'COURSES' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-blue-800" /> Enrolled Subject Notes & Lecture Library
              </h2>
              <p className="text-xs text-slate-500">Access latest published NCERT chapter notes and study materials uploaded by faculty.</p>
            </div>
            <Link
              href="/student/courses"
              className="px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-extrabold rounded-xl transition text-xs flex items-center gap-1 shrink-0 shadow-sm"
            >
              See All Notes →
            </Link>
          </div>

          {notesLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 font-bold">
              Loading latest published notes...
            </div>
          ) : latestNotes.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {latestNotes.map((mat) => {
                  const subjectLabel = mat.subjectId?.name || mat.subjectName || 'GENERAL';
                  return (
                    <div key={mat._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3 shadow-sm hover:border-brand-blue-800 transition">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-0.5 bg-brand-blue-100 text-brand-blue-900 font-extrabold rounded text-[10px] uppercase">
                            {subjectLabel}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(mat.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{mat.title}</h4>
                        {mat.description && (
                          <p className="text-slate-500 text-xs line-clamp-2">{mat.description}</p>
                        )}
                        <div className="text-[11px] text-slate-500 font-medium">
                          {mat.grade ? mat.grade.replace('_', ' ') : 'All Grades'} · {mat.fileType || 'PDF Notes'}
                        </div>
                      </div>

                      <a
                        href={assetUrl(mat.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold rounded-xl text-center transition text-xs shadow-sm block"
                      >
                        Open Notes →
                      </a>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  href="/student/courses"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-blue-800 hover:text-brand-blue-900 hover:underline"
                >
                  See All Notes & Library Materials <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No study notes are available yet.</p>
              <p className="text-xs text-slate-400">Check back soon! Faculty members publish new chapter notes regularly.</p>
            </div>
          )}
        </div>
      )}

      {/* ONLINE TESTS TAB */}
      {activeTab === 'TESTS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Online CBT Mock Test Series</h2>
              <p className="text-xs text-slate-500">Attempt timed practice tests mapped to CBSE Board & Olympiad syllabus.</p>
            </div>
            <Link href="/student/tests" className="text-xs font-bold text-brand-blue-800 hover:underline">
              View Complete Test History →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">FREE BOARD MOCK</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Class 10th Science Full Syllabus Mock 1</h4>
                <p className="text-slate-500">Duration: 60 Mins | 100 Marks</p>
              </div>
              <Link href="/free-tests" className="px-4 py-2 bg-brand-gold-500 text-slate-950 font-extrabold rounded-xl hover:bg-brand-gold-400 transition">
                Start Test
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTANT TAB */}
      {activeTab === 'AI' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-brand-blue-800" /> SADGYANAM 24/7 AI Study Assistant
            </h2>
            <p className="text-xs text-slate-500">Type any question from NCERT Science, Maths, or Social Studies.</p>
          </div>

          <form onSubmit={handleAskAI} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Enter your study question</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. State Snell's law of refraction and give formula for refractive index..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
              />
            </div>
            <button
              type="submit"
              disabled={aiLoading}
              className="w-full py-3 bg-brand-blue-800 text-white font-extrabold rounded-xl shadow-md text-xs hover:bg-brand-blue-900 transition flex items-center justify-center gap-2"
            >
              {aiLoading ? 'Thinking...' : <><Sparkles className="w-4 h-4 text-brand-gold-400" /> Solve with AI Tutor</>}
            </button>
          </form>

          {aiResponse && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <h4 className="font-extrabold text-brand-blue-900">AI Step-by-Step Explanation:</h4>
              <p className="text-slate-700 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Institute & Batch Announcements
          </h2>
          <div className="space-y-3 text-xs">
            {announcements.map((announcement) => <div key={announcement._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1"><span className="px-2 py-0.5 bg-brand-blue-100 text-brand-blue-800 font-bold rounded">{announcement.category} · {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString()}</span><h4 className="font-bold text-slate-900 text-sm">{announcement.title}</h4><p className="text-slate-600">{announcement.content}</p></div>)}
          </div>
        </div>
      )}

      {/* FACULTY REMARKS LOG TAB */}
      {activeTab === 'REMARKS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Faculty Remarks Log</h2>
              <p className="text-xs text-slate-500">Academic remarks and feedback given specifically to you by your teachers.</p>
            </div>
            <span className="px-3 py-1 bg-brand-blue-50 text-brand-blue-800 text-xs font-bold rounded-full">
              {myRemarks.length} Remarks
            </span>
          </div>

          {remarksLoading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">Loading your faculty remarks...</div>
          ) : myRemarks.length > 0 ? (
            <div className="space-y-4">
              {myRemarks.map((r: any) => (
                <div key={r._id || r.id} className="p-4 rounded-xl bg-brand-blue-50/60 border border-brand-blue-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-brand-blue-900">
                    <span>Teacher {r.teacherName} has remarked on you</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                    &quot;{r.remark}&quot;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200">
              No faculty remarks recorded for you yet. Keep up the good work!
            </div>
          )}
        </div>
      )}

    </div>
  );
}
