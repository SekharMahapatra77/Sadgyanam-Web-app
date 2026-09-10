'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Award,
  CheckCircle2,
  Calendar,
  CreditCard,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  PhoneCall,
  Send,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

export default function ParentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login?role=parent');
  };
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Dynamic Faculty Remarks State for Linked Children
  const [parentRemarks, setParentRemarks] = useState<any[]>([]);
  const [remarksLoading, setRemarksLoading] = useState(true);

  // Dynamic Parent Dashboard Overview State
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  const fetchOverview = (childId?: string) => {
    setOverviewLoading(true);
    const url = childId ? `/parent/dashboard-overview?studentId=${childId}` : '/parent/dashboard-overview';
    api.get(url)
      .then((res) => {
        setOverviewData(res.data?.data || null);
        if (res.data?.data?.selectedChild) {
          setSelectedChildId(res.data.data.selectedChild.id || res.data.data.selectedChild._id);
        }
      })
      .catch(() => setOverviewData(null))
      .finally(() => setOverviewLoading(false));
  };

  React.useEffect(() => {
    fetchOverview();
    api.get('/parent/remarks')
      .then((res) => setParentRemarks(res.data?.data || []))
      .catch(() => setParentRemarks([]))
      .finally(() => setRemarksLoading(false));
  }, []);

  const handleSelectChild = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const childId = e.target.value;
    setSelectedChildId(childId);
    fetchOverview(childId);
  };

  const handleSendCounselorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    try {
      await api.post('/parent/inquiries', {
        message: contactMsg.trim(),
        studentId: selectedChildId,
      });
      setContactSent(true);
      setContactMsg('');
      setTimeout(() => setContactSent(false), 5000);
    } catch (err: any) {
      console.error('Failed to submit parent inquiry:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 min-w-0 max-w-full overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl border-b-4 border-brand-gold-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <span className="px-3 py-1 bg-brand-gold-500/20 text-brand-gold-400 font-bold text-xs rounded-full border border-brand-gold-500/40">
            SADGYANAM Parent Monitoring Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Welcome, {user?.name || 'Parent'} 👋</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Parent Account: <span className="text-white font-semibold">{user?.email || 'parent@sadgyanam.edu.in'}</span>
            {overviewData?.selectedChild && (
              <>
                {' '}| Linked Child:{' '}
                <span className="font-bold text-brand-gold-400">
                  {overviewData.selectedChild.name}
                </span>{' '}
                ({overviewData.selectedChild.displayGrade} {overviewData.selectedChild.board})
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Multi-Child Selector */}
          {overviewData?.children && overviewData.children.length > 1 && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <span className="text-xs font-bold text-slate-200">Select Child:</span>
              <select
                value={selectedChildId}
                onChange={handleSelectChild}
                className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
              >
                {overviewData.children.map((c: any) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.name} ({c.displayGrade})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl transition shadow-md text-xs flex items-center gap-1.5 shrink-0 border border-rose-500/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Portal Tabs Header */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin max-w-full">
        {[
          { id: 'OVERVIEW', label: '1. Child Summary & Overview' },
          { id: 'REPORT', label: '2. Detailed Test History & Marks' },
          { id: 'REMARKS', label: '3. Faculty Remarks Log' },
          { id: 'CONTACT', label: '4. Contact Institute Counselor' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeTab === tab.id
                ? 'bg-brand-blue-800 text-white font-extrabold shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Linked Child Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Child Attendance</span>
          {overviewLoading ? (
            <div className="text-xs font-bold text-slate-400 py-2">Loading attendance...</div>
          ) : overviewData?.attendance?.hasRecords ? (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-slate-900">
                  {overviewData.attendance.attendancePercentage}%
                </span>
                <span className={`text-xs font-bold ${overviewData.attendance.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {overviewData.attendance.attendancePercentage >= 75 ? 'Present / On Track' : 'Needs Improvement'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {overviewData.attendance.presentCount} of {overviewData.attendance.totalClasses} Classes Attended ({overviewData.attendance.absentCount} Absent)
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-400">N/A</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">No Records</span>
              </div>
              <p className="text-xs text-slate-400">No attendance recorded yet for this child</p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Test Score</span>
          {overviewLoading ? (
            <div className="text-xs font-bold text-slate-400 py-2">Loading test scores...</div>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-brand-blue-800">
                  {overviewData?.averageTestScore?.value || 'N/A'}
                </span>
                {overviewData?.averageTestScore?.hasData && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> CBT Avg
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {overviewData?.averageTestScore?.hasData
                  ? `Based on ${overviewData.averageTestScore.count} completed CBT tests`
                  : 'No tests taken yet'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* OVERVIEW & REPORT TAB */}
      {(activeTab === 'OVERVIEW' || activeTab === 'REPORT') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg">
                {overviewData?.selectedChild?.name || 'Child'}&apos;s Test History & Academic Report Card
              </h2>
              <span className="text-xs font-bold text-brand-blue-800 bg-brand-blue-50 px-2.5 py-1 rounded-md">
                {overviewData?.selectedChild?.displayGrade || 'Class 10th'} {overviewData?.selectedChild?.board || 'CBSE'}
              </span>
            </div>

            {overviewLoading ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400">Loading test history...</div>
            ) : overviewData?.testHistory && overviewData.testHistory.length > 0 ? (
              <div className="space-y-3">
                {overviewData.testHistory.map((history: any) => (
                  <div key={history._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{history.testTitle}</h4>
                      <p className="text-xs text-slate-500">
                        Date: {new Date(history.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-brand-blue-800">
                        {history.score} / {history.totalMarks}
                      </span>
                      <span className="text-xs text-emerald-600 block font-bold">
                        Score: {history.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                No test attempts recorded for {overviewData?.selectedChild?.name || 'this child'} yet.
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg">
                Faculty Remarks
              </h2>
              <button onClick={() => setActiveTab('REMARKS')} className="text-xs font-bold text-brand-blue-800 hover:underline">
                View Log →
              </button>
            </div>

            {remarksLoading ? (
              <div className="p-4 text-center text-xs font-bold text-slate-400">Loading remarks...</div>
            ) : parentRemarks.length > 0 ? (
              <div className="space-y-3">
                {parentRemarks.slice(0, 3).map((r: any) => (
                  <div key={r._id || r.id} className="p-4 rounded-xl bg-brand-blue-50/60 border border-brand-blue-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-blue-900">
                      <span>Teacher {r.teacherName} (on {r.studentName})</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &quot;{r.remark}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 font-medium">
                No faculty remarks logged for your child yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* FACULTY REMARKS LOG TAB */}
      {activeTab === 'REMARKS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Faculty Remarks Log for Your Child</h2>
              <p className="text-xs text-slate-500">Official academic performance feedback provided by SADGYANAM faculty members.</p>
            </div>
            <span className="px-3 py-1 bg-brand-blue-50 text-brand-blue-800 text-xs font-bold rounded-full">
              {parentRemarks.length} Remarks Logged
            </span>
          </div>

          {remarksLoading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">Loading faculty remarks from DB...</div>
          ) : parentRemarks.length > 0 ? (
            <div className="space-y-4">
              {parentRemarks.map((r: any) => (
                <div key={r._id || r.id} className="p-5 rounded-2xl bg-brand-blue-50/60 border border-brand-blue-100 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-brand-blue-900">
                    <span>Teacher {r.teacherName} has remarked on student <span className="text-brand-gold-600 font-extrabold">{r.studentName}</span> ({r.classGrade}):</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium italic leading-relaxed pt-1">
                    &quot;{r.remark}&quot;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200">
              No faculty remarks logged for your child yet.
            </div>
          )}
        </div>
      )}


      {/* CONTACT COUNSELOR TAB */}
      {activeTab === 'CONTACT' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-brand-blue-800" /> Send Message to Institute Counselor
            </h2>
            <p className="text-xs text-slate-500">Request parent-teacher conference or submit academic inquiry.</p>
          </div>

          {contactSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
              ✓ Message delivered! An academic counselor will call you shortly.
            </div>
          )}

          <form onSubmit={handleSendCounselorMessage} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Message / Query</label>
              <textarea
                rows={4}
                required
                placeholder="Specify your request (e.g. Schedule PTM meeting with Science faculty)..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-blue-800 text-white font-extrabold rounded-xl shadow-md text-xs hover:bg-brand-blue-900 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-brand-gold-400" /> Send Inquiry to Management
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
