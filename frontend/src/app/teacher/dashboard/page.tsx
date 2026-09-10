'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  FileText,
  Video,
  ClipboardList,
  MessageSquare,
  AlertCircle,
  Bell,
  Clock,
  User,
  PlusCircle,
  CheckCircle2,
  X,
  Sparkles,
  Send,
  Trash2,
  Edit3,
  Filter,
  Search,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';
import { PortalSidebarDrawer } from '@/components/portal/PortalSidebarDrawer';
import { PortalMobileHeader } from '@/components/portal/PortalMobileHeader';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login?role=teacher');
  };
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const todayStr = new Date().toISOString().split('T')[0];

  // Global Class / Grade filter state
  const [selectedClass, setSelectedClass] = useState('Class 10th');

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>({
    todayLectures: [],
    assignedBatchesCount: 0,
    needsAttentionList: [],
  });
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Attendance Module State
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [studentsAttendance, setStudentsAttendance] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState('');

  // Needs Attention Module State
  const [needsAttentionList, setNeedsAttentionList] = useState<any[]>([]);
  const [attentionLoading, setAttentionLoading] = useState(false);
  const [addAttentionModal, setAddAttentionModal] = useState(false);
  const [selectedStudentForAttention, setSelectedStudentForAttention] = useState('');
  const [attentionReason, setAttentionReason] = useState('');
  const [editingAttentionId, setEditingAttentionId] = useState<string | null>(null);

  // Remarks Module State
  const [remarksList, setRemarksList] = useState<any[]>([]);
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remarkStudentId, setRemarkStudentId] = useState('');
  const [remarkText, setRemarkText] = useState('');
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);

  // Timetable / Lectures Module State
  const [timetableDate, setTimetableDate] = useState(todayStr);
  const [lecturesList, setLecturesList] = useState<any[]>([]);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [lectureModal, setLectureModal] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    classGrade: 'Class 10th',
    subject: 'Physics',
    date: todayStr,
    startTime: '04:30 PM',
    endTime: '06:00 PM',
    notes: '',
  });

  // Real admitted students list for dropdowns
  const [realStudents, setRealStudents] = useState<any[]>([]);

  // AI Generator Form
  const [topic, setTopic] = useState('Light - Reflection & Refraction');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Doubts Queue State
  const [doubts, setDoubts] = useState([
    { id: 'd1', student: 'Aarav Patel', class: 'Class 10th', question: 'How to calculate refractive index when speed of light in medium is given?', status: 'PENDING' },
    { id: 'd2', student: 'Rohan Sharma', class: 'Class 9th', question: 'What is difference between distance and displacement in curved paths?', status: 'PENDING' },
  ]);

  // Fetch Overview Data
  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await api.get('/teacher/overview');
      if (res.data?.data) {
        setOverviewData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch teacher overview:', err);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  // Fetch Real Students for Dropdowns
  const fetchRealStudents = useCallback(async (classGrade?: string) => {
    try {
      const queryClass = classGrade || selectedClass;
      const res = await api.get(`/teacher/students?classGrade=${encodeURIComponent(queryClass)}`);
      setRealStudents(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  }, [selectedClass]);

  // Fetch Attendance for Attendance Marker
  const fetchAttendance = useCallback(async () => {
    setAttendanceLoading(true);
    try {
      const res = await api.get(
        `/teacher/attendance?classGrade=${encodeURIComponent(selectedClass)}&date=${attendanceDate}`
      );
      if (res.data?.data?.students) {
        setStudentsAttendance(res.data.data.students);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedClass, attendanceDate]);

  // Fetch Needs Attention List
  const fetchNeedsAttention = useCallback(async () => {
    setAttentionLoading(true);
    try {
      const res = await api.get(`/teacher/needs-attention?classGrade=${encodeURIComponent(selectedClass)}`);
      setNeedsAttentionList(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch needs attention:', err);
    } finally {
      setAttentionLoading(false);
    }
  }, [selectedClass]);

  // Fetch Remarks List
  const fetchRemarks = useCallback(async () => {
    setRemarksLoading(true);
    try {
      const res = await api.get(`/teacher/remarks?classGrade=${encodeURIComponent(selectedClass)}`);
      setRemarksList(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch remarks:', err);
    } finally {
      setRemarksLoading(false);
    }
  }, [selectedClass]);

  // Fetch Timetable Lectures
  const fetchLectures = useCallback(async () => {
    setLecturesLoading(true);
    try {
      const res = await api.get(
        `/teacher/lectures?date=${timetableDate}&classGrade=${encodeURIComponent(selectedClass)}`
      );
      setLecturesList(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch lectures:', err);
    } finally {
      setLecturesLoading(false);
    }
  }, [timetableDate, selectedClass]);

  // Initial Load & tab trigger effect
  useEffect(() => {
    fetchOverview();
    fetchRealStudents();
  }, [fetchOverview, fetchRealStudents]);

  useEffect(() => {
    if (activeTab === 'ATTENDANCE') fetchAttendance();
    if (activeTab === 'ATTENTION') fetchNeedsAttention();
    if (activeTab === 'REMARKS') fetchRemarks();
    if (activeTab === 'CLASSES') fetchLectures();
  }, [activeTab, selectedClass, attendanceDate, timetableDate, fetchAttendance, fetchNeedsAttention, fetchRemarks, fetchLectures]);

  // Handlers for Attendance
  const toggleAttendanceStatus = (studentId: string) => {
    setStudentsAttendance((prev) =>
      prev.map((s) =>
        (s.id === studentId || s.studentId === studentId)
          ? { ...s, status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
          : s
      )
    );
    setAttendanceSaved(false);
  };

  const handleSaveAttendance = async () => {
    try {
      const records = studentsAttendance.map((s) => ({
        studentId: s.studentId || s.id,
        status: s.status,
      }));

      await api.post('/teacher/attendance', {
        classGrade: selectedClass,
        date: attendanceDate,
        records,
      });

      setAttendanceSaved(true);
      setAttendanceMessage(
        `✓ Attendance saved for ${selectedClass} on ${attendanceDate}! (${studentsAttendance.filter((s) => s.status === 'PRESENT').length}/${studentsAttendance.length} Present)`
      );
      setTimeout(() => setAttendanceSaved(false), 4000);
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save attendance');
    }
  };

  // Handlers for Needs Attention
  const handleSaveNeedsAttention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAttention || !attentionReason) return;

    try {
      if (editingAttentionId) {
        await api.put(`/teacher/needs-attention/${editingAttentionId}`, {
          reason: attentionReason,
        });
      } else {
        await api.post('/teacher/needs-attention', {
          studentId: selectedStudentForAttention,
          reason: attentionReason,
          classGrade: selectedClass,
        });
      }

      setAddAttentionModal(false);
      setSelectedStudentForAttention('');
      setAttentionReason('');
      setEditingAttentionId(null);
      fetchNeedsAttention();
      fetchOverview();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save record');
    }
  };

  const handleRemoveAttention = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student from Needs Attention?')) return;
    try {
      await api.delete(`/teacher/needs-attention/${id}`);
      fetchNeedsAttention();
      fetchOverview();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove student');
    }
  };

  // Handlers for Remarks
  const handleSaveRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkStudentId || !remarkText) return;

    try {
      if (editingRemarkId) {
        await api.put(`/teacher/remarks/${editingRemarkId}`, { remark: remarkText });
      } else {
        await api.post('/teacher/remarks', {
          studentId: remarkStudentId,
          remark: remarkText,
          classGrade: selectedClass,
        });
      }

      setRemarkModal(false);
      setRemarkStudentId('');
      setRemarkText('');
      setEditingRemarkId(null);
      fetchRemarks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save remark');
    }
  };

  const handleDeleteRemark = async (id: string) => {
    if (!confirm('Delete this remark?')) return;
    try {
      await api.delete(`/teacher/remarks/${id}`);
      fetchRemarks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete remark');
    }
  };

  // Handlers for Timetable & Lectures
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLectureId) {
        await api.put(`/teacher/lectures/${editingLectureId}`, lectureForm);
      } else {
        await api.post('/teacher/lectures', lectureForm);
      }

      setLectureModal(false);
      setEditingLectureId(null);
      setLectureForm({
        title: '',
        classGrade: selectedClass,
        subject: 'Physics',
        date: timetableDate,
        startTime: '04:30 PM',
        endTime: '06:00 PM',
        notes: '',
      });
      fetchLectures();
      fetchOverview();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save lecture');
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm('Delete this scheduled lecture?')) return;
    try {
      await api.delete(`/teacher/lectures/${id}`);
      fetchLectures();
      fetchOverview();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lecture');
    }
  };

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-questions', {
        topic,
        targetClass: selectedClass,
        subject: 'Science',
        count: 3,
      });
      if (res.data?.data?.questions) {
        setGeneratedQuestions(res.data.data.questions);
      } else {
        setGeneratedQuestions([
          { questionText: `State Snell's law of refraction for topic: ${topic}.`, optionA: 'sin i / sin r = constant', optionB: 'sin i * sin r = 1', optionC: 'i = r', optionD: 'None', correctOption: 'A' },
          { questionText: 'What is the focal length of a plane mirror?', optionA: 'Zero', optionB: 'Infinity', optionC: '20 cm', optionD: '-10 cm', correctOption: 'B' },
        ]);
      }
    } catch (err) {
      setGeneratedQuestions([
        { questionText: `State Snell's law of refraction for topic: ${topic}.`, optionA: 'sin i / sin r = constant', optionB: 'sin i * sin r = 1', optionC: 'i = r', optionD: 'None', correctOption: 'A' },
        { questionText: 'What is the focal length of a plane mirror?', optionA: 'Zero', optionB: 'Infinity', optionC: '20 cm', optionD: '-10 cm', correctOption: 'B' },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const teacherModules = [
    { id: 'OVERVIEW', name: '1. Dashboard Overview', icon: BookOpen },
    { id: 'ATTENDANCE', name: '2. Batch Attendance Marker', icon: CheckSquare },
    { id: 'TEST_BUILDER', name: '3. AI Test & Question Builder', icon: PlusCircle },
    { id: 'ATTENTION', name: '4. "Needs Attention" List', icon: AlertCircle },
    { id: 'REMARKS', name: '5. Academic Teacher Remarks', icon: FileText },
    { id: 'CLASSES', name: '6. Timetable & Lectures', icon: Calendar },
    { id: 'STUDENTS', name: '7. Student Directory', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row min-w-0 max-w-full overflow-x-hidden">
      {/* Teacher Sidebar */}
      <PortalSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        title="SADGYANAM FACULTY"
        subtitle={user?.name || 'Educator Portal'}
        items={teacherModules}
        activeTab={activeTab}
        onSelectTab={(id) => setActiveTab(id)}
        handleLogout={handleLogout}
        logoutText="Logout Faculty"
        activeColorClass="bg-brand-blue-800 text-white font-extrabold shadow-sm scale-[1.01]"
        badgeText="Faculty Portal"
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Mobile Header Bar */}
        <PortalMobileHeader
          portalTitle="SADGYANAM FACULTY"
          userName={user?.name || 'Faculty Member'}
          userRole="Educator"
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto min-w-0 w-full max-w-full">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border-b-4 border-brand-gold-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-brand-gold-500/20 text-brand-gold-400 font-bold text-xs rounded-full border border-brand-gold-500/40">
              Senior Academic Faculty Member
            </span>
            <h1 className="text-2xl font-black mt-1">Welcome, {user?.name || 'Faculty Educator'} 👨‍🏫</h1>
            <p className="text-xs text-slate-300">
              {user?.email || 'teacher@sadgyanam.edu.in'} • Real Database Synchronized
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Global Class Selector */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Filter className="w-3.5 h-3.5 text-brand-gold-400" />
              <span className="text-xs text-slate-300 font-bold">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  fetchRealStudents(e.target.value);
                }}
                className="bg-slate-900 text-white font-extrabold text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value="Class 10th">Class 10th</option>
                <option value="Class 9th">Class 9th</option>
                <option value="Class 8th">Class 8th</option>
                <option value="Class 7th">Class 7th</option>
                <option value="Class 6th">Class 6th</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('TEST_BUILDER')}
              className="px-4 py-2 bg-brand-gold-500 text-slate-950 font-extrabold rounded-xl text-xs hover:bg-brand-gold-400 transition shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> AI Test Generator
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Batches</span>
                <div className="text-3xl font-black text-slate-900">
                  {overviewData.assignedBatchesCount || 2} Batches
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {overviewData.assignedBatches?.map((b: any) => b.name).join(', ') || 'Class 10th & 9th Batches'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Lectures</span>
                <div className="text-3xl font-black text-brand-blue-800">
                  {overviewData.todayLectures?.length || 0} Scheduled
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {overviewData.todayLectures?.length > 0
                    ? overviewData.todayLectures.map((l: any) => l.startTime).join(', ')
                    : 'No lectures scheduled for today'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Needs Attention</span>
                <div className="text-3xl font-black text-rose-600">
                  {overviewData.needsAttentionCount || 0} Students
                </div>
                <p className="text-xs text-slate-400">Requires academic follow-up</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Remarks</span>
                <div className="text-3xl font-black text-indigo-600">
                  {remarksList.length || 0} Recorded
                </div>
                <p className="text-xs text-slate-400">Feedback for students & parents</p>
              </div>
            </div>

            {/* Today's Lectures Quick Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-blue-800" />
                  <h2 className="font-extrabold text-slate-900 text-lg">Today&apos;s Live & Classroom Lectures</h2>
                </div>
                <button onClick={() => setActiveTab('CLASSES')} className="text-xs font-bold text-brand-blue-800 hover:underline">
                  Manage Schedule →
                </button>
              </div>

              {overviewData.todayLectures?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {overviewData.todayLectures.map((lec: any) => (
                    <div key={lec._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span className="text-brand-blue-900">{lec.title}</span>
                        <span className="px-2 py-0.5 bg-brand-gold-100 text-brand-gold-900 rounded">{lec.startTime} - {lec.endTime}</span>
                      </div>
                      <p className="text-slate-500 font-medium">{lec.classGrade} · {lec.subject}</p>
                      {lec.notes && <p className="text-slate-400 italic">Notes: {lec.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-xl">
                  No lectures scheduled for today date ({todayStr}). Click "Manage Schedule" to add new lectures.
                </div>
              )}
            </div>

            {/* Needs Attention Alert List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h2 className="font-extrabold text-slate-900 text-lg">Students Needing Academic Attention</h2>
                </div>
                <button onClick={() => setActiveTab('ATTENTION')} className="text-xs font-bold text-brand-blue-800 hover:underline">
                  Manage List →
                </button>
              </div>

              {overviewData.needsAttentionList?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {overviewData.needsAttentionList.map((item: any) => (
                    <div key={item._id} className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.studentId?.name || 'Student'} ({item.classGrade})</h4>
                        <p className="text-slate-600">Enrollment: {item.studentId?.enrollmentNo || 'N/A'}</p>
                        <p className="font-semibold text-rose-700 mt-1">Issue: {item.reason}</p>
                      </div>
                      <button
                        onClick={() => {
                          setRemarkStudentId(item.studentId?._id || item.studentId);
                          setRemarkModal(true);
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold shrink-0 shadow-sm hover:bg-rose-700 transition"
                      >
                        Add Remark
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-xl">
                  No students currently flagged in Needs Attention list.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Batch Attendance Marker</h2>
                <p className="text-xs text-slate-500">
                  Mark daily attendance for real admitted students from Student Management.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                />
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition"
                >
                  Save Attendance
                </button>
              </div>
            </div>

            {attendanceSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center shadow-sm">
                {attendanceMessage}
              </div>
            )}

            {attendanceLoading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">
                Loading class students from database...
              </div>
            ) : studentsAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Roll / Enrollment No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Attendance Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {studentsAttendance.map((student) => (
                      <tr key={student.id || student.studentId} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{student.rollNo}</td>
                        <td className="p-3 font-bold text-slate-900">{student.name}</td>
                        <td className="p-3 font-semibold text-slate-500">{student.grade || selectedClass}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 font-extrabold rounded-full ${
                              student.status === 'PRESENT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleAttendanceStatus(student.id || student.studentId)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 transition"
                          >
                            Mark as {student.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No admitted students found for {selectedClass}.</p>
                <p className="text-xs text-slate-400">
                  When Admin admits a student in Student Management or Admission Portal, they will appear here automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI TEST BUILDER TAB */}
        {activeTab === 'TEST_BUILDER' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold-500" /> AI Question & Test Draft Generator
              </h2>
              <p className="text-xs text-slate-500">Draft customized practice questions for your subjects.</p>
            </div>

            <form onSubmit={handleGenerateQuestions} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic / Chapter Name</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-3 bg-brand-blue-800 text-white font-extrabold rounded-xl hover:bg-brand-blue-900 transition flex items-center justify-center gap-2"
              >
                {aiLoading ? 'Generating Questions...' : <><Sparkles className="w-4 h-4 text-brand-gold-400" /> Draft Questions with AI</>}
              </button>
            </form>

            {generatedQuestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-sm">Generated Question Drafts:</h3>
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <p className="font-bold text-slate-900">Q{idx + 1}: {q.questionText}</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>A) {q.optionA}</div>
                      <div>B) {q.optionB}</div>
                      <div>C) {q.optionC}</div>
                      <div>D) {q.optionD}</div>
                    </div>
                    <div className="text-emerald-700 font-bold pt-1">Correct Answer: {q.correctOption}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEEDS ATTENTION TAB */}
        {activeTab === 'ATTENTION' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" /> "Needs Attention" Student Tracker
                </h2>
                <p className="text-xs text-slate-500">Flag admitted students requiring academic or attendance follow-up (Saved in MongoDB).</p>
              </div>
              <button
                onClick={() => {
                  setEditingAttentionId(null);
                  setSelectedStudentForAttention('');
                  setAttentionReason('');
                  setAddAttentionModal(true);
                }}
                className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition shadow-md"
              >
                + Add Student to Attention List
              </button>
            </div>

            {attentionLoading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">Loading Needs Attention data...</div>
            ) : needsAttentionList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {needsAttentionList.map((item) => (
                  <div key={item._id} className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{item.studentName}</h4>
                      <p className="text-slate-600">Class: {item.classGrade} | Roll: {item.enrollmentNo}</p>
                      <p className="font-semibold text-rose-800">Issue: {item.reason}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingAttentionId(item._id);
                          setSelectedStudentForAttention(item.studentId?._id || item.studentId || '');
                          setAttentionReason(item.reason);
                          setAddAttentionModal(true);
                        }}
                        className="p-1.5 hover:bg-rose-100 rounded-lg text-slate-700"
                        title="Edit Reason"
                      >
                        <Edit3 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveAttention(item._id)}
                        className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-700"
                        title="Remove Student"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No students in Needs Attention list for {selectedClass}.</p>
                <p className="text-xs text-slate-400">Click "+ Add Student to Attention List" to flag a real student.</p>
              </div>
            )}
          </div>
        )}

        {/* REMARKS TAB */}
        {activeTab === 'REMARKS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue-800" /> Academic Teacher Remarks Log
                </h2>
                <p className="text-xs text-slate-500">Record academic performance feedback for real admitted students.</p>
              </div>
              <button
                onClick={() => {
                  setEditingRemarkId(null);
                  setRemarkStudentId('');
                  setRemarkText('');
                  setRemarkModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md"
              >
                + Add Academic Remark
              </button>
            </div>

            {remarksLoading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">Loading academic remarks from DB...</div>
            ) : remarksList.length > 0 ? (
              <div className="space-y-3 text-xs">
                {remarksList.map((r) => (
                  <div key={r._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Student: {r.studentName} ({r.classGrade})</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-normal">{new Date(r.date).toLocaleDateString()}</span>
                        <button
                          onClick={() => {
                            setEditingRemarkId(r._id);
                            setRemarkStudentId(r.studentId?._id || r.studentId || '');
                            setRemarkText(r.remark);
                            setRemarkModal(true);
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRemark(r._id)}
                          className="p-1 hover:bg-rose-100 rounded text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 italic">"{r.remark}"</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Teacher: {r.teacherName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No academic remarks recorded for {selectedClass}.</p>
                <p className="text-xs text-slate-400">Click "+ Add Academic Remark" to write feedback for a student.</p>
              </div>
            )}
          </div>
        )}

        {/* TIMETABLE & LECTURES TAB */}
        {activeTab === 'CLASSES' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-blue-800" /> Built-in Timetable & Lecture Calendar
                </h2>
                <p className="text-xs text-slate-500">Manage and schedule live or classroom lectures backed by MongoDB.</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <input
                  type="date"
                  value={timetableDate}
                  onChange={(e) => setTimetableDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                />
                <button
                  onClick={() => {
                    setEditingLectureId(null);
                    setLectureForm({
                      title: '',
                      classGrade: selectedClass,
                      subject: 'Physics',
                      date: timetableDate,
                      startTime: '04:30 PM',
                      endTime: '06:00 PM',
                      notes: '',
                    });
                    setLectureModal(true);
                  }}
                  className="px-4 py-2 bg-brand-blue-800 text-white font-extrabold rounded-xl hover:bg-brand-blue-900 transition shadow-md"
                >
                  + Add Lecture
                </button>
              </div>
            </div>

            {lecturesLoading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">Loading lecture schedule...</div>
            ) : lecturesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {lecturesList.map((lec) => (
                  <div key={lec._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex justify-between items-start shadow-sm">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-brand-blue-100 text-brand-blue-900 font-extrabold rounded text-[10px] uppercase">
                        {lec.subject} · {lec.classGrade}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{lec.title}</h4>
                      <p className="text-slate-600 font-semibold flex items-center gap-1 text-xs">
                        <Clock className="w-3.5 h-3.5 text-brand-gold-600" /> {lec.startTime} - {lec.endTime} ({lec.date})
                      </p>
                      {lec.notes && <p className="text-slate-500 italic">Notes: {lec.notes}</p>}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingLectureId(lec._id);
                          setLectureForm({
                            title: lec.title,
                            classGrade: lec.classGrade,
                            subject: lec.subject,
                            date: lec.date,
                            startTime: lec.startTime,
                            endTime: lec.endTime,
                            notes: lec.notes || '',
                          });
                          setLectureModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600"
                        title="Edit Lecture"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lec._id)}
                        className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No lectures scheduled for {timetableDate}.</p>
                <p className="text-xs text-slate-400">Click "+ Add Lecture" to create a new timetable entry.</p>
              </div>
            )}
          </div>
        )}

        {/* STUDENT DIRECTORY TAB */}
        {activeTab === 'STUDENTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-blue-800" /> Admitted Student Directory ({selectedClass})
                </h2>
                <p className="text-xs text-slate-500">Real database students admitted via Admin Portal or Admission Portal.</p>
              </div>
            </div>

            {realStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Enrollment No</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email / Contact</th>
                      <th className="p-3">Class Grade</th>
                      <th className="p-3">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {realStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{s.enrollmentNo}</td>
                        <td className="p-3 font-bold text-slate-900">{s.name}</td>
                        <td className="p-3">{s.email || s.phone || 'N/A'}</td>
                        <td className="p-3 font-semibold text-slate-500">{s.grade}</td>
                        <td className="p-3 font-extrabold text-brand-blue-800">{s.attendancePercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No admitted students found in database for {selectedClass}.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>

      {/* ADD / EDIT NEEDS ATTENTION MODAL */}
      {addAttentionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingAttentionId ? 'Edit Needs Attention Reason' : 'Add Student to Needs Attention'}
              </h3>
              <button onClick={() => setAddAttentionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNeedsAttention} className="space-y-4 text-xs">
              {!editingAttentionId && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Real Admitted Student</label>
                  <select
                    required
                    value={selectedStudentForAttention}
                    onChange={(e) => setSelectedStudentForAttention(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                  >
                    <option value="">-- Choose Student --</option>
                    {realStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.enrollmentNo})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue / Reason Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Low test scores in Science numericals, missed 3 consecutive lectures..."
                  value={attentionReason}
                  onChange={(e) => setAttentionReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 text-white font-black rounded-xl shadow-md text-xs hover:bg-rose-700 transition"
              >
                {editingAttentionId ? 'Update Record' : 'Save & Flag Student'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REMARK MODAL */}
      {remarkModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingRemarkId ? 'Edit Academic Remark' : 'Add Academic Student Remark'}
              </h3>
              <button onClick={() => setRemarkModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRemark} className="space-y-4 text-xs">
              {!editingRemarkId && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                  <select
                    required
                    value={remarkStudentId}
                    onChange={(e) => setRemarkStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-white"
                  >
                    <option value="">-- Choose Student --</option>
                    {realStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.enrollmentNo})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Feedback Note</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter observation regarding student's performance, attendance, or homework..."
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-800 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl shadow-md text-xs hover:bg-brand-blue-900 transition"
              >
                Save Academic Remark
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LECTURE SCHEDULE MODAL */}
      {lectureModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingLectureId ? 'Edit Timetable Lecture' : 'Schedule New Timetable Lecture'}
              </h3>
              <button onClick={() => setLectureModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Light Reflection & Spherical Mirrors Numerical Class"
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={lectureForm.classGrade}
                    onChange={(e) => setLectureForm({ ...lectureForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="Class 10th">Class 10th</option>
                    <option value="Class 9th">Class 9th</option>
                    <option value="Class 8th">Class 8th</option>
                    <option value="Class 7th">Class 7th</option>
                    <option value="Class 6th">Class 6th</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics"
                    value={lectureForm.subject}
                    onChange={(e) => setLectureForm({ ...lectureForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={lectureForm.date}
                    onChange={(e) => setLectureForm({ ...lectureForm, date: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-bold bg-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="04:30 PM"
                    value={lectureForm.startTime}
                    onChange={(e) => setLectureForm({ ...lectureForm, startTime: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="06:00 PM"
                    value={lectureForm.endTime}
                    onChange={(e) => setLectureForm({ ...lectureForm, endTime: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Notes / Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bring Physics Exemplar workbook"
                  value={lectureForm.notes}
                  onChange={(e) => setLectureForm({ ...lectureForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl shadow-md text-xs hover:bg-brand-blue-900 transition"
              >
                {editingLectureId ? 'Save Changes' : 'Schedule Lecture'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
