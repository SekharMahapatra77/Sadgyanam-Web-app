'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Filter,
  PhoneCall,
  BrainCircuit,
  Award,
  FileText,
  CreditCard,
  Bell,
  Globe,
  TrendingUp,
  Search,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Edit,
  Trash2,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  Printer,
  Download,
  DollarSign,
  Layers,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react';
import { api, API_ORIGIN } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { PortalSidebarDrawer } from '@/components/portal/PortalSidebarDrawer';
import { PortalMobileHeader } from '@/components/portal/PortalMobileHeader';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login?role=admin');
  };
  const [metrics, setMetrics] = useState<any>(null);

  // Real Database Collections State
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [admissionsList, setAdmissionsList] = useState<any[]>([]);
  const [demoList, setDemoList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [parentsList, setParentsList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [mockTestsList, setMockTestsList] = useState<any[]>([]);
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [materialsList, setMaterialsList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [parentInquiriesList, setParentInquiriesList] = useState<any[]>([]);

  // UI & Loading State
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('ALL');

  // Deletion Confirmation Modal State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; type: string; name: string } | null>(null);

  // --- MODAL STATES ---
  // Student Form Modal State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    grade: 'CLASS_10',
    board: 'CBSE',
    targetExam: 'BOARD_EXAMS',
  });

  // Teacher Form Modal State
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    qualification: string;
    teachingSubject: string;
    monthlySalary: string | number;
  }>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    qualification: 'M.Sc. Physics / Educator',
    teachingSubject: 'Physics',
    monthlySalary: '25000',
  });

  // Teacher Salary Details & Payment History Modal State
  const [showTeacherSalaryModal, setShowTeacherSalaryModal] = useState(false);
  const [selectedTeacherForSalary, setSelectedTeacherForSalary] = useState<any>(null);
  const [paymentRecordForm, setPaymentRecordForm] = useState<{
    month: string;
    paidDate: string;
    paidAmount: string | number;
    notes: string;
  }>({
    month: 'August 2026',
    paidDate: new Date().toISOString().split('T')[0],
    paidAmount: '25000',
    notes: '',
  });

  // Edit Salary Modal State
  const [showEditSalaryModal, setShowEditSalaryModal] = useState(false);
  const [editingSalaryTeacherId, setEditingSalaryTeacherId] = useState<string | null>(null);
  const [newSalaryValue, setNewSalaryValue] = useState<number | string>('0');

  // Parent Form Modal State
  const [showParentModal, setShowParentModal] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [parentForm, setParentForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    occupation: 'Professional',
    alternatePhone: '',
    studentId: '',
  });

  // Course Form Modal State (Add / Edit)
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<{
    title: string;
    slug: string;
    shortBio: string;
    grade: string;
    category: string;
    description: string;
    price: string | number;
    durationMonths: string | number;
    features: string;
    subjects: string;
    thumbnail: string;
    pdfUrl: string;
    isPublished: boolean;
  }>({
    title: '',
    slug: '',
    shortBio: '',
    grade: 'CLASS_10',
    category: 'ACADEMIC_BOARDS',
    description: '',
    price: '24999',
    durationMonths: '12',
    features: 'Daily Live Classes, 24/7 AI Tutor, Bi-Weekly CBT Tests',
    subjects: 'Mathematics, Physics, Chemistry, Biology',
    thumbnail: '',
    pdfUrl: '',
    isPublished: true,
  });

  // Free Mock Test Form Modal State (Add / Edit)
  const [showMockTestModal, setShowMockTestModal] = useState(false);
  const [editingMockTestId, setEditingMockTestId] = useState<string | null>(null);
  const [mockTestForm, setMockTestForm] = useState({
    title: '',
    description: '',
    grade: 'CLASS_10',
    subjectName: 'Science',
    category: 'Full Syllabus Board Pattern Test',
    durationMinutes: 60,
    totalMarks: 100,
    pdfUrl: '',
    testUrl: '',
    isPublished: true,
  });

  // Academic Program Form Modal State (Add / Edit)
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programForm, setProgramForm] = useState({
    title: '',
    slug: '',
    grade: 'CLASS_10',
    category: 'Academic Board & Foundation',
    bio: '',
    content: '',
    highlights: 'NCERT Board Curriculum, Weekly CBT Tests, Parent Progress Portal',
    displayOrder: 1,
    isPublished: true,
  });

  // Manual Payment Form Modal State (Add)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    studentId: string;
    courseId: string;
    amount: string | number;
    totalCourseFee: string | number;
    discount: string | number;
    scholarship: string | number;
    paymentMethod: string;
    transactionId: string;
    notes: string;
  }>({
    studentId: '',
    courseId: '',
    amount: '10000',
    totalCourseFee: '25000',
    discount: '0',
    scholarship: '0',
    paymentMethod: 'CASH',
    transactionId: '',
    notes: 'Initial Installment',
  });

  // Printable Receipt Modal State
  const [receiptItem, setReceiptItem] = useState<any>(null);
  const [expandedPaymentGroupKey, setExpandedPaymentGroupKey] = useState<string | null>(null);

  // Study Material PDF Modal State (Add / Edit)
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    grade: 'CLASS_10',
    courseId: '',
    subjectName: 'Science',
    fileUrl: '',
    fileType: 'NOTES',
    isFree: true,
    isPublished: true,
  });
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', category: 'GENERAL', priority: 'NORMAL', isPublished: true });
  const [resultForm, setResultForm] = useState({ category: 'STUDENT_RESULTS', studentName: '', class: 'CLASS_10', photo: '', percentage: '', marks: '', cityRank: '', boardScore: '', subjectScore: '', mathsScore: '', olympiadName: '', olympiadRank: '', school: '', testimonial: '', badge: '', label: '', value: '', isPublished: true });
  const [editingResultId, setEditingResultId] = useState<string | null>(null);

  // AI Form State
  const [aiForm, setAiForm] = useState({
    topic: 'Light - Reflection & Refraction',
    targetClass: 'Class 10th',
    subject: 'Physics',
    count: 5,
  });
  const [generatedQs, setGeneratedQs] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Announcements State

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [
        analyticsRes,
        leadsRes,
        admissionsRes,
        demoRes,
        studentsRes,
        teachersRes,
        parentsRes,
        coursesRes,
        mockTestsRes,
        programsRes,
        paymentsRes,
        materialsRes,
        announcementsRes,
        resultsRes,
        parentInquiriesRes,
      ] = await Promise.allSettled([
        api.get('/admin/analytics'),
        api.get('/leads'),
        api.get('/admin/admissions'),
        api.get('/admin/demo-bookings'),
        api.get('/admin/students'),
        api.get('/admin/teachers'),
        api.get('/admin/parents'),
        api.get('/courses'),
        api.get('/admin/mock-tests'),
        api.get('/admin/academic-programs'),
        api.get('/admin/payments'),
        api.get('/admin/materials'),
        api.get('/admin/announcements'),
        api.get('/admin/results'),
        api.get('/admin/parent-inquiries'),
      ]);

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data?.data) setMetrics(analyticsRes.value.data.data);
      if (leadsRes.status === 'fulfilled' && leadsRes.value.data?.data) setLeadsList(leadsRes.value.data.data);
      if (admissionsRes.status === 'fulfilled' && admissionsRes.value.data?.data) setAdmissionsList(admissionsRes.value.data.data);
      if (demoRes.status === 'fulfilled' && demoRes.value.data?.data) setDemoList(demoRes.value.data.data);
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.data) setStudentsList(studentsRes.value.data.data);
      if (teachersRes.status === 'fulfilled' && teachersRes.value.data?.data) setTeachersList(teachersRes.value.data.data);
      if (parentsRes.status === 'fulfilled' && parentsRes.value.data?.data) setParentsList(parentsRes.value.data.data);
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.data) setCoursesList(coursesRes.value.data.data);
      if (mockTestsRes.status === 'fulfilled' && mockTestsRes.value.data?.data) setMockTestsList(mockTestsRes.value.data.data);
      if (programsRes.status === 'fulfilled' && programsRes.value.data?.data) setProgramsList(programsRes.value.data.data);
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.data?.data) setPaymentsList(paymentsRes.value.data.data);
      if (materialsRes.status === 'fulfilled' && materialsRes.value.data?.data) setMaterialsList(materialsRes.value.data.data);
      if (announcementsRes.status === 'fulfilled' && announcementsRes.value.data?.data) setAnnouncementsList(announcementsRes.value.data.data);
      if (resultsRes.status === 'fulfilled' && resultsRes.value.data?.data) setResultsList(resultsRes.value.data.data);
      if (parentInquiriesRes.status === 'fulfilled' && parentInquiriesRes.value.data?.data) setParentInquiriesList(parentInquiriesRes.value.data.data);
    } catch (err: any) {
      setErrorMsg('Failed to sync API data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LEAD & ADMISSION STATUS HANDLER ---
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      const updatedLead = res.data?.data;

      setLeadsList((prev) => prev.map((l) => (l._id === leadId ? (updatedLead || { ...l, status: newStatus }) : l)));
      setAdmissionsList((prev) => prev.map((a) => (a._id === leadId ? (updatedLead || { ...a, status: newStatus }) : a)));
      setDemoList((prev) => prev.map((d) => (d._id === leadId ? (updatedLead || { ...d, status: newStatus }) : d)));

      if (newStatus === 'APPROVED' || newStatus === 'ADMITTED') {
        showNotification('Admission Approved! Student account created automatically in Student Management.');
        // Refresh list to load newly converted student record
        const stdRes = await api.get('/admin/students');
        if (stdRes.data?.data) setStudentsList(stdRes.data.data);
      } else if (newStatus === 'REJECTED') {
        showNotification('Admission Application Rejected.');
      } else {
        showNotification(`Status updated to ${newStatus}`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // --- STUDENT CRUD ---
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (studentForm.password && studentForm.confirmPassword && studentForm.password !== studentForm.confirmPassword) {
        setErrorMsg('Password and Confirm Password do not match.');
        return;
      }
      if (editingStudentId) {
        const res = await api.put(`/admin/students/${editingStudentId}`, studentForm);
        setStudentsList((prev) => prev.map((s) => (s._id === editingStudentId ? (res.data?.data || { ...s, ...studentForm }) : s)));
        showNotification('Student profile & account updated!');
      } else {
        const res = await api.post('/admin/students', studentForm);
        if (res.data?.data) setStudentsList((prev) => [res.data.data, ...prev]);
        showNotification('New student registered!');
      }
      setShowStudentModal(false);
      setEditingStudentId(null);
      setStudentForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', grade: 'CLASS_10', board: 'CBSE', targetExam: 'BOARD_EXAMS' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save student.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await api.delete(`/admin/students/${id}`);
      setStudentsList((prev) => prev.filter((s) => s._id !== id));
      showNotification('Student record removed.');
    } catch (err: any) {
      setErrorMsg('Failed to delete student.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- TEACHER CRUD ---
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (teacherForm.password && teacherForm.confirmPassword && teacherForm.password !== teacherForm.confirmPassword) {
        setErrorMsg('Password and Confirm Password do not match.');
        return;
      }
      const payload = {
        ...teacherForm,
        monthlySalary: teacherForm.monthlySalary === '' ? 0 : Number(teacherForm.monthlySalary),
      };
      if (editingTeacherId) {
        const res = await api.put(`/admin/teachers/${editingTeacherId}`, payload);
        setTeachersList((prev) => prev.map((t) => (t._id === editingTeacherId ? (res.data?.data || { ...t, ...payload }) : t)));
        showNotification('Teacher profile & account updated!');
      } else {
        const res = await api.post('/admin/teachers', payload);
        if (res.data?.data) setTeachersList((prev) => [res.data.data, ...prev]);
        showNotification('New faculty added!');
      }
      setShowTeacherModal(false);
      setEditingTeacherId(null);
      setTeacherForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', qualification: 'M.Sc. Physics / Educator', teachingSubject: 'Physics', monthlySalary: '25000' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save teacher.');
    }
  };

  const handleUpdateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalaryTeacherId) return;
    try {
      const salaryNum = newSalaryValue === '' ? 0 : Number(newSalaryValue);
      const res = await api.patch(`/admin/teachers/${editingSalaryTeacherId}/salary`, { monthlySalary: salaryNum });
      if (res.data?.data) {
        setTeachersList((prev) => prev.map((t) => (t._id === editingSalaryTeacherId ? { ...t, monthlySalary: salaryNum } : t)));
        showNotification('Teacher monthly salary updated!');
      }
      setShowEditSalaryModal(false);
      setEditingSalaryTeacherId(null);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update salary.');
    }
  };

  const handleRecordSalaryPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForSalary) return;
    try {
      const payload = {
        ...paymentRecordForm,
        paidAmount: paymentRecordForm.paidAmount === '' ? 0 : Number(paymentRecordForm.paidAmount),
      };
      const res = await api.post(`/admin/teachers/${selectedTeacherForSalary._id}/salary-payment`, payload);
      if (res.data?.data) {
        const updatedTeacher = res.data.data;
        setTeachersList((prev) => prev.map((t) => (t._id === selectedTeacherForSalary._id ? updatedTeacher : t)));
        setSelectedTeacherForSalary(updatedTeacher);
        showNotification(`Salary payment recorded for ${paymentRecordForm.month}!`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to record salary payment.');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      await api.delete(`/admin/teachers/${id}`);
      setTeachersList((prev) => prev.filter((t) => t._id !== id));
      showNotification('Faculty record removed.');
    } catch (err: any) {
      setErrorMsg('Failed to delete teacher.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- PARENT CRUD ---
  const handleSaveParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (parentForm.password && parentForm.confirmPassword && parentForm.password !== parentForm.confirmPassword) {
        setErrorMsg('Password and Confirm Password do not match.');
        return;
      }
      if (editingParentId) {
        const res = await api.put(`/admin/parents/${editingParentId}`, parentForm);
        setParentsList((prev) => prev.map((p) => (p._id === editingParentId ? (res.data?.data || { ...p, ...parentForm }) : p)));
        showNotification('Parent information updated!');
      } else {
        const res = await api.post('/admin/parents', parentForm);
        if (res.data?.data) setParentsList((prev) => [res.data.data, ...prev]);
        showNotification('New parent account created!');
      }
      setShowParentModal(false);
      setEditingParentId(null);
      setParentForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', occupation: 'Professional', alternatePhone: '', studentId: '' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save parent.');
    }
  };

  const handleDeleteParent = async (id: string) => {
    try {
      await api.delete(`/admin/parents/${id}`);
      setParentsList((prev) => prev.filter((p) => p._id !== id));
      showNotification('Parent record removed.');
    } catch (err: any) {
      setErrorMsg('Failed to delete parent.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- COURSE CRUD ---
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...courseForm,
        price: courseForm.price === '' ? 0 : Number(courseForm.price),
        durationMonths: courseForm.durationMonths === '' ? 0 : Number(courseForm.durationMonths),
      };
      if (editingCourseId) {
        const res = await api.put(`/courses/${editingCourseId}`, payload);
        setCoursesList((prev) => prev.map((c) => (c._id === editingCourseId ? (res.data?.data || { ...c, ...payload }) : c)));
        showNotification('Course updated successfully!');
      } else {
        const res = await api.post('/courses', payload);
        if (res.data?.data) setCoursesList((prev) => [res.data.data, ...prev]);
        showNotification('New course created & published!');
      }
      setShowCourseModal(false);
      setEditingCourseId(null);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save course.');
    }
  };

  const handleTogglePublishCourse = async (courseId: string) => {
    try {
      const res = await api.patch(`/courses/${courseId}/publish`);
      setCoursesList((prev) => prev.map((c) => (c._id === courseId ? { ...c, isPublished: res.data?.data?.isPublished } : c)));
      showNotification('Course publish status toggled!');
    } catch (err: any) {
      setErrorMsg('Failed to update course publish status.');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      setCoursesList((prev) => prev.filter((c) => c._id !== id));
      showNotification('Course removed successfully.');
    } catch (err: any) {
      setErrorMsg('Failed to delete course.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- FREE MOCK TEST CRUD ---
  const handleSaveMockTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMockTestId) {
        const res = await api.put(`/admin/mock-tests/${editingMockTestId}`, mockTestForm);
        setMockTestsList((prev) => prev.map((m) => (m._id === editingMockTestId ? (res.data?.data || { ...m, ...mockTestForm }) : m)));
        showNotification('Free Mock Test updated!');
      } else {
        const res = await api.post('/admin/mock-tests', mockTestForm);
        if (res.data?.data) setMockTestsList((prev) => [res.data.data, ...prev]);
        showNotification('Free Mock Test created & synced!');
      }
      setShowMockTestModal(false);
      setEditingMockTestId(null);
    } catch (err: any) {
      setErrorMsg('Failed to save mock test.');
    }
  };

  const handleDeleteMockTest = async (id: string) => {
    try {
      await api.delete(`/admin/mock-tests/${id}`);
      setMockTestsList((prev) => prev.filter((m) => m._id !== id));
      showNotification('Mock test removed.');
    } catch (err: any) {
      setErrorMsg('Failed to delete mock test.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- ACADEMIC PROGRAM CRUD ---
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgramId) {
        const res = await api.put(`/admin/academic-programs/${editingProgramId}`, programForm);
        setProgramsList((prev) => prev.map((p) => (p._id === editingProgramId ? (res.data?.data || { ...p, ...programForm }) : p)));
        showNotification('Academic Program updated!');
      } else {
        const res = await api.post('/admin/academic-programs', programForm);
        if (res.data?.data) setProgramsList((prev) => [res.data.data, ...prev]);
        showNotification('Academic Program added to footer & portal!');
      }
      setShowProgramModal(false);
      setEditingProgramId(null);
    } catch (err: any) {
      setErrorMsg('Failed to save academic program.');
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await api.delete(`/admin/academic-programs/${id}`);
      setProgramsList((prev) => prev.filter((p) => p._id !== id));
      showNotification('Academic Program removed.');
    } catch (err: any) {
      setErrorMsg('Failed to delete academic program.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- MANUAL PAYMENTS CRUD ---
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...paymentForm,
        amount: paymentForm.amount === '' ? 0 : Number(paymentForm.amount),
        totalCourseFee: paymentForm.totalCourseFee === '' ? 0 : Number(paymentForm.totalCourseFee),
        discount: paymentForm.discount === '' ? 0 : Number(paymentForm.discount),
        scholarship: paymentForm.scholarship === '' ? 0 : Number(paymentForm.scholarship),
      };
      const res = editingPaymentId
        ? await api.put(`/admin/payments/${editingPaymentId}`, payload)
        : await api.post('/admin/payments', payload);
      if (res.data?.data) setPaymentsList((prev) => editingPaymentId ? prev.map((item) => item._id === editingPaymentId ? res.data.data : item) : [res.data.data, ...prev]);
      setShowPaymentModal(false);
      setEditingPaymentId(null);
      showNotification('Manual payment recorded successfully!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to record manual payment.');
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await api.delete(`/admin/payments/${id}`);
      setPaymentsList((prev) => prev.filter((p) => p._id !== id));
      showNotification('Payment record deleted.');
    } catch (err: any) {
      setErrorMsg('Failed to delete payment record.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // --- STUDY MATERIAL CRUD ---
  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(materialForm).forEach(([key, value]) => formData.append(key, String(value)));
      if (materialFile) formData.append('file', materialFile);
      if (editingMaterialId) {
        const res = await api.put(`/admin/materials/${editingMaterialId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMaterialsList((prev) => prev.map((m) => (m._id === editingMaterialId ? (res.data?.data || { ...m, ...materialForm }) : m)));
        showNotification('Study Material PDF updated!');
      } else {
        const res = await api.post('/admin/materials', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data?.data) setMaterialsList((prev) => [res.data.data, ...prev]);
        showNotification('Study Material PDF uploaded!');
      }
      setShowMaterialModal(false);
      setEditingMaterialId(null);
      setMaterialFile(null);
    } catch (err: any) {
      setErrorMsg('Failed to save study material.');
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editingAnnouncementId
        ? await api.put(`/admin/announcements/${editingAnnouncementId}`, announcementForm)
        : await api.post('/admin/announcements', announcementForm);
      const saved = res.data?.data;
      setAnnouncementsList((prev) => editingAnnouncementId ? prev.map((item) => item._id === editingAnnouncementId ? saved : item) : [saved, ...prev]);
      setAnnouncementForm({ title: '', content: '', category: 'GENERAL', priority: 'NORMAL', isPublished: true });
      setEditingAnnouncementId(null);
      showNotification('Announcement saved successfully.');
    } catch (err: any) { setErrorMsg(err.response?.data?.message || 'Failed to save announcement.'); }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try { await api.delete(`/admin/announcements/${id}`); setAnnouncementsList((prev) => prev.filter((item) => item._id !== id)); showNotification('Announcement deleted.'); }
    catch (err: any) { setErrorMsg(err.response?.data?.message || 'Failed to delete announcement.'); }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editingResultId ? await api.put(`/admin/results/${editingResultId}`, resultForm) : await api.post('/admin/results', resultForm);
      const saved = res.data?.data;
      setResultsList((prev) => editingResultId ? prev.map((item) => item._id === editingResultId ? saved : item) : [saved, ...prev]);
      setEditingResultId(null);
      setResultForm({ category: 'STUDENT_RESULTS', studentName: '', class: 'CLASS_10', photo: '', percentage: '', marks: '', cityRank: '', boardScore: '', subjectScore: '', mathsScore: '', olympiadName: '', olympiadRank: '', school: '', testimonial: '', badge: '', label: '', value: '', isPublished: true });
      showNotification('Result saved successfully.');
    } catch (err: any) { setErrorMsg(err.response?.data?.message || 'Failed to save result.'); }
  };

  const handleDeleteResult = async (id: string) => {
    try { await api.delete(`/admin/results/${id}`); setResultsList((prev) => prev.filter((item) => item._id !== id)); showNotification('Result deleted.'); }
    catch (err: any) { setErrorMsg(err.response?.data?.message || 'Failed to delete result.'); }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await api.delete(`/admin/materials/${id}`);
      setMaterialsList((prev) => prev.filter((m) => m._id !== id));
      showNotification('Study material PDF deleted.');
    } catch (err: any) {
      setErrorMsg('Failed to delete study material.');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  // AI Question Generation
  const handleGenerateAIQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-questions', aiForm);
      if (res.data?.data?.questions) setGeneratedQs(res.data.data.questions);
    } catch (err) {
      setGeneratedQs([
        { questionText: `State Snell's law of refraction for topic: ${aiForm.topic}.`, optionA: 'sin i / sin r = constant', optionB: 'sin i * sin r = 1', optionC: 'i = r', optionD: 'None', correctOption: 'A' },
        { questionText: `Find the focal length of a convex lens with power +5D.`, optionA: '+20 cm', optionB: '+50 cm', optionC: '-20 cm', optionD: '+10 cm', correctOption: 'A' },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/admin/parent-inquiries/${id}/status`, { status });
      if (res.data?.data) {
        setParentInquiriesList((prev) =>
          prev.map((item) => (item._id === id ? res.data.data : item))
        );
        showNotification('Parent inquiry status updated!');
      }
    } catch (err: any) {
      setErrorMsg('Failed to update inquiry status.');
    }
  };

  const adminModules = [
    { id: 'OVERVIEW', name: '1. Dashboard Overview', icon: BarChart3 },
    { id: 'STUDENTS', name: '2. Student Management', icon: Users },
    { id: 'TEACHERS', name: '3. Teacher Management', icon: GraduationCap },
    { id: 'PARENTS', name: '4. Parent Management', icon: UserCheck },
    { id: 'COURSES', name: '5. Course Manager', icon: BookOpen },
    { id: 'PROGRAMS', name: '6. Academic Programs', icon: Layers },
    { id: 'MOCKTESTS', name: '7. Free Mock Tests', icon: Award },
    { id: 'LEADS', name: '8. Leads CRM Funnel', icon: Filter },
    { id: 'ADMISSIONS', name: '9. Admissions Portal', icon: GraduationCap },
    { id: 'DEMO', name: '10. Demo Bookings', icon: PhoneCall },
    { id: 'PAYMENTS', name: '11. Fees & Manual Payments', icon: CreditCard },
    { id: 'MATERIALS', name: '12. Study Material PDF', icon: FileText },
    { id: 'AI', name: '13. AI Question Generator', icon: BrainCircuit },
    { id: 'ANNOUNCEMENTS', name: '14. Announcements', icon: Bell },
    { id: 'RESULTS', name: '15. Results Portal', icon: Award },
    { id: 'PARENT_INQUIRIES', name: "16. Parent's Inquiry Logs", icon: MessageSquare },
  ];

  // Calculate Real Revenue Collection from manual payments
  const totalManualRevenue = paymentsList
    .filter((p) => p.status === 'SUCCESS' || !p.status)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  const kpis = {
    students: studentsList.length || 0,
    teachers: teachersList.length || 0,
    courses: coursesList.length || 0,
    mockTests: mockTestsList.length || 0,
    programs: programsList.length || 0,
    admissions: admissionsList.length || 0,
    revenue: totalManualRevenue,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row min-w-0 max-w-full overflow-x-hidden">
      {/* Sidebar Navigation */}
      <PortalSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        title="SADGYANAM ADMIN"
        subtitle={user?.name || 'Super Administrator'}
        items={adminModules}
        activeTab={activeTab}
        onSelectTab={(id) => {
          setActiveTab(id);
          setSearchQuery('');
          setInquiryTypeFilter('ALL');
        }}
        handleLogout={handleLogout}
        logoutText="Logout Admin"
        headerIcon={<GraduationCap className="w-5 h-5 text-brand-gold-400 shrink-0" />}
        badgeText="Master Admin"
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Mobile Header Bar */}
        <PortalMobileHeader
          portalTitle="SADGYANAM ADMIN"
          userName={user?.name || 'Administrator'}
          userRole="Super Admin"
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto min-w-0 w-full max-w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="px-3 py-1 bg-brand-gold-100 text-brand-gold-900 text-[10px] font-black uppercase rounded-full border border-brand-gold-300">
              Master Admin Operations Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Welcome, {user?.name || 'Administrator'} 👑</h1>
            <p className="text-xs text-slate-500">
              {user?.email || 'admin@sadgyanam.edu.in'} • Real-Time Dynamic Institute Operations Suite
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Database
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>

            {activeTab === 'STUDENTS' && (
              <button
                onClick={() => {
                  setEditingStudentId(null);
                  setStudentForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', grade: 'CLASS_10', board: 'CBSE', targetExam: 'BOARD_EXAMS' });
                  setShowStudentModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            )}

            {activeTab === 'TEACHERS' && (
              <button
                onClick={() => {
                  setEditingTeacherId(null);
                  setTeacherForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', qualification: 'M.Sc. Physics / Educator', teachingSubject: 'Physics', monthlySalary: '25000' });
                  setShowTeacherModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Faculty
              </button>
            )}

            {activeTab === 'PARENTS' && (
              <button
                onClick={() => {
                  setEditingParentId(null);
                  setParentForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', occupation: 'Professional', alternatePhone: '', studentId: studentsList[0]?._id || '' });
                  setShowParentModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Parent
              </button>
            )}

            {activeTab === 'COURSES' && (
              <button
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseForm({
                    title: '',
                    slug: '',
                    shortBio: '',
                    grade: 'CLASS_10',
                    category: 'ACADEMIC_BOARDS',
                    description: '',
                    price: '24999',
                    durationMonths: '12',
                    features: 'Daily Live Classes, 24/7 AI Tutor, Bi-Weekly CBT Tests',
                    subjects: 'Mathematics, Physics, Chemistry, Biology',
                    thumbnail: '',
                    pdfUrl: '',
                    isPublished: true,
                  });
                  setShowCourseModal(true);
                }}
                className="px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Add Course
              </button>
            )}

            {activeTab === 'PROGRAMS' && (
              <button
                onClick={() => {
                  setEditingProgramId(null);
                  setProgramForm({
                    title: '',
                    slug: '',
                    grade: 'CLASS_10',
                    category: 'Academic Board & Foundation',
                    bio: '',
                    content: '',
                    highlights: 'NCERT Board Curriculum, Weekly CBT Tests, Parent Progress Portal',
                    displayOrder: programsList.length + 1,
                    isPublished: true,
                  });
                  setShowProgramModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Add Academic Program
              </button>
            )}

            {activeTab === 'MOCKTESTS' && (
              <button
                onClick={() => {
                  setEditingMockTestId(null);
                  setMockTestForm({
                    title: '',
                    description: '',
                    grade: 'CLASS_10',
                    subjectName: 'Science',
                    category: 'Full Syllabus Board Pattern Test',
                    durationMinutes: 60,
                    totalMarks: 100,
                    pdfUrl: '',
                    testUrl: '',
                    isPublished: true,
                  });
                  setShowMockTestModal(true);
                }}
                className="px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Add Free Mock Test
              </button>
            )}

            {activeTab === 'PAYMENTS' && (
              <button
                onClick={() => {
                  setPaymentForm({
                    studentId: studentsList[0]?._id || '',
                    courseId: coursesList[0]?._id || '',
                    amount: '10000',
                    totalCourseFee: '25000',
                    discount: '0',
                    scholarship: '0',
                    paymentMethod: 'CASH',
                    transactionId: '',
                    notes: 'Manual Fee Receipt',
                  });
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Record Manual Payment
              </button>
            )}

            {activeTab === 'MATERIALS' && (
              <button
                onClick={() => {
                  setEditingMaterialId(null);
                  setMaterialForm({
                    title: '',
                    description: '',
                    grade: 'CLASS_10',
                    courseId: '',
                    subjectName: 'Science',
                    fileUrl: '',
                    fileType: 'NOTES',
                    isFree: true,
                    isPublished: true,
                  });
                  setShowMaterialModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Upload className="w-4 h-4" /> Upload Study Material PDF
              </button>
            )}
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-brand-blue-800">{kpis.students}</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> Live</span>
                </div>
                <p className="text-xs text-slate-400">Classes 6th to 10th</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Faculty</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-slate-900">{kpis.teachers}</span>
                  <span className="text-xs font-bold text-slate-500">Educators</span>
                </div>
                <p className="text-xs text-slate-400">Science & Maths Experts</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fee Collections</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-emerald-600">₹{kpis.revenue.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-bold text-emerald-600">Manual Ledger</span>
                </div>
                <p className="text-xs text-slate-400">Sum of Verified Cash/UPI Receipts</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Leads & Inquiries</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-brand-gold-600">{leadsList.length}</span>
                  <span className="text-xs font-bold text-brand-blue-800">Live CRM</span>
                </div>
                <p className="text-xs text-slate-400">Inquiries & Applications</p>
              </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-blue-800" /> Recent Admission & Demo Leads
                </h2>
                <button onClick={() => setActiveTab('LEADS')} className="text-xs font-bold text-brand-blue-800 hover:underline">
                  Manage Leads CRM →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Inquiry Type</th>
                      <th className="p-3">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {leadsList.slice(0, 5).map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                        <td className="p-3">{lead.phone}</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-brand-blue-50 text-brand-blue-800 font-bold rounded">{lead.grade || 'Class 10th'}</span></td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 font-bold rounded-lg ${lead.inquiryType === 'DEMO' ? 'bg-purple-100 text-purple-900' : 'bg-brand-blue-100 text-brand-blue-900'}`}>
                            {lead.inquiryType || 'ADMISSION'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={lead.status || 'NEW'}
                            onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs focus:ring-1 focus:ring-brand-blue-800"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="DEMO_SCHEDULED">DEMO_SCHEDULED</option>
                            <option value="ADMITTED">ADMITTED (Auto-Create Student)</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. STUDENT MANAGEMENT TAB */}
        {activeTab === 'STUDENTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-blue-800" /> Student Management Directory
                </h2>
                <p className="text-xs text-slate-500">Real-time Student CRUD & Auto Admission conversion records.</p>
              </div>

              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue-800 w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Enrollment No</th>
                    <th className="p-3">Grade & Board</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentsList
                    .filter((s) => {
                      const name = s.userId?.name || s.name || '';
                      return name.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((std) => {
                      const hasAccount = Boolean(std.userId || std.accountStatus === 'Created');
                      return (
                        <tr key={std._id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{std.userId?.name || std.name}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{std.userId?.email || std.email || 'No email set'}</div>
                            <div className="text-[11px] text-slate-400">{std.userId?.phone || std.phone || 'No phone set'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 font-extrabold text-[11px] rounded-full border ${
                              hasAccount ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {hasAccount ? '✓ Created' : '• Not Created'}
                            </span>
                          </td>
                          <td className="p-3"><span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono font-bold rounded-md">{std.enrollmentNo || 'SAD-STD-101'}</span></td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg">{std.grade || 'CLASS_10'} ({std.board || 'CBSE'})</span>
                          </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingStudentId(std._id);
                              setStudentForm({
                                name: std.userId?.name || std.name || '',
                                email: std.userId?.email || std.email || '',
                                phone: std.userId?.phone || std.phone || '',
                                password: '',
                                confirmPassword: '',
                                grade: std.grade || 'CLASS_10',
                                board: std.board || 'CBSE',
                                targetExam: std.targetExam || 'BOARD_EXAMS',
                              });
                              setShowStudentModal(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem({ id: std._id, type: 'STUDENT', name: std.userId?.name || std.name || 'Student' })}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TEACHER MANAGEMENT TAB */}
        {activeTab === 'TEACHERS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-blue-800" /> Faculty Management Directory
                </h2>
                <p className="text-xs text-slate-500">Manage institute faculty members, teaching subjects, monthly salaries & payment history.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue-800 w-full sm:w-64"
                />
                <button
                  onClick={() => {
                    setEditingTeacherId(null);
                    setTeacherForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', qualification: 'M.Sc. Physics / Educator', teachingSubject: 'Physics', monthlySalary: '25000' });
                    setShowTeacherModal(true);
                  }}
                  className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Faculty
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Faculty Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Teaching Subject</th>
                    <th className="p-3">Qualification</th>
                    <th className="p-3">Monthly Salary</th>
                    <th className="p-3">Current Month Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {teachersList
                    .filter((t) => (t.userId?.name || t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.teachingSubject || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((tech) => {
                      const isPaid = tech.currentMonthSalaryStatus === 'PAID';
                      const hasAccount = Boolean(tech.userId || tech.accountStatus === 'Created');
                      return (
                        <tr key={tech._id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{tech.userId?.name || tech.name}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{tech.userId?.email || tech.email || 'No email set'}</div>
                            <div className="text-[11px] text-slate-400">{tech.userId?.phone || tech.phone || 'No phone set'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 font-extrabold text-[11px] rounded-full border ${
                              hasAccount ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {hasAccount ? '✓ Created' : '• Not Created'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-brand-blue-50 text-brand-blue-900 font-bold rounded-lg border border-brand-blue-200">
                              {tech.teachingSubject || 'General Educator'}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{tech.qualification || 'M.Sc. Physics'}</td>
                          <td className="p-3 font-extrabold text-emerald-700">
                            ₹{(tech.monthlySalary || 0).toLocaleString('en-IN')} / mo
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 font-extrabold text-[11px] rounded-full border ${
                              isPaid ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {isPaid ? '✓ PAID' : '• UNPAID'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedTeacherForSalary(tech);
                                setPaymentRecordForm({
                                  month: 'August 2026',
                                  paidDate: new Date().toISOString().split('T')[0],
                                  paidAmount: String(tech.monthlySalary ?? 25000),
                                  notes: '',
                                });
                                setShowTeacherSalaryModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition text-[11px] inline-flex items-center gap-1 border border-emerald-200"
                            >
                              <DollarSign className="w-3.5 h-3.5" /> Payments & History
                            </button>
                            <button
                              onClick={() => {
                                setEditingSalaryTeacherId(tech._id);
                                setNewSalaryValue(String(tech.monthlySalary ?? 0));
                                setShowEditSalaryModal(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition text-[11px] inline-flex items-center gap-1 border border-slate-300"
                            >
                              Edit Salary
                            </button>
                            <button
                              onClick={() => {
                                setEditingTeacherId(tech._id);
                                setTeacherForm({
                                  name: tech.userId?.name || tech.name || '',
                                  email: tech.userId?.email || tech.email || '',
                                  phone: tech.userId?.phone || tech.phone || '',
                                  password: '',
                                  confirmPassword: '',
                                  qualification: tech.qualification || '',
                                  teachingSubject: tech.teachingSubject || 'Physics',
                                  monthlySalary: String(tech.monthlySalary ?? 25000),
                                });
                                setShowTeacherModal(true);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg transition"
                              title="Edit Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmItem({ id: tech._id, type: 'TEACHER', name: tech.userId?.name || tech.name || 'Faculty' })}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition"
                              title="Delete Faculty"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PARENT MANAGEMENT TAB */}
        {activeTab === 'PARENTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-blue-800" /> Parent Guardian Directory
                </h2>
                <p className="text-xs text-slate-500">Manage registered parent guardians, occupation, and linked student accounts.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search parents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue-800 w-full sm:w-64"
                />
                <button
                  onClick={() => {
                    setEditingParentId(null);
                    setParentForm({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      confirmPassword: '',
                      occupation: 'Professional',
                      alternatePhone: '',
                      studentId: studentsList[0]?._id || '',
                    });
                    setShowParentModal(true);
                  }}
                  className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Parent
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Parent Name</th>
                    <th className="p-3">Linked Student</th>
                    <th className="p-3">Occupation</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {parentsList
                    .filter((p) => (p.userId?.name || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.occupation || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((par) => {
                      const firstChild = par.children && par.children.length > 0 ? par.children[0] : null;
                      const childName = firstChild?.userId?.name || firstChild?.name || 'Unlinked';
                      const childGrade = firstChild?.grade || '';
                      return (
                        <tr key={par._id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{par.userId?.name || par.name}</td>
                          <td className="p-3">
                            {firstChild ? (
                              <span className="px-2.5 py-1 bg-brand-gold-50 text-slate-900 font-bold rounded-lg border border-brand-gold-300">
                                🎓 {childName} {childGrade ? `(${childGrade})` : ''}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal italic">No student linked</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{par.occupation || 'Professional'}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{par.userId?.email || par.email}</div>
                            <div className="text-[11px] text-slate-400">{par.userId?.phone || par.phone}</div>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingParentId(par._id);
                                setParentForm({
                                  name: par.userId?.name || par.name || '',
                                  email: par.userId?.email || par.email || '',
                                  phone: par.userId?.phone || par.phone || '',
                                  password: '',
                                  confirmPassword: '',
                                  occupation: par.occupation || '',
                                  alternatePhone: par.alternatePhone || '',
                                  studentId: firstChild?._id || '',
                                });
                                setShowParentModal(true);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmItem({ id: par._id, type: 'PARENT', name: par.userId?.name || par.name || 'Parent' })}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. COURSE MANAGEMENT TAB */}
        {activeTab === 'COURSES' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-blue-800" /> Admin Course Manager
                </h2>
                <p className="text-xs text-slate-500">Fully manageable courses displayed dynamically on public page.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseForm({
                    title: '',
                    slug: '',
                    shortBio: '',
                    grade: 'CLASS_10',
                    category: 'ACADEMIC_BOARDS',
                    description: '',
                    price: '24999',
                    durationMonths: '12',
                    features: 'Daily Live Classes, 24/7 AI Tutor, Bi-Weekly CBT Tests',
                    subjects: 'Mathematics, Physics, Chemistry, Biology',
                    thumbnail: '',
                    pdfUrl: '',
                    isPublished: true,
                  });
                  setShowCourseModal(true);
                }}
                className="px-4 py-2 bg-brand-gold-500 text-slate-950 font-black rounded-xl text-xs hover:bg-brand-gold-400 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map((course) => (
                <div key={course._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-brand-blue-800 text-white font-bold text-[10px] rounded-lg">
                        {course.targetClass || course.grade}
                      </span>
                      <button
                        onClick={() => handleTogglePublishCourse(course._id)}
                        className={`px-2.5 py-1 font-bold text-[10px] rounded-lg border transition ${course.isPublished
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                          }`}
                      >
                        {course.isPublished ? '✓ Published' : 'Draft / Hidden'}
                      </button>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    {course.pdfUrl && (
                      <a href={course.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-brand-blue-800 font-bold mt-2">
                        <FileText className="w-3.5 h-3.5" /> PDF Attached
                      </a>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-emerald-600">₹{(course.price || course.fee)?.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 block">{course.durationMonths || 12} Months</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCourseId(course._id);
                          setCourseForm({
                            title: course.title || '',
                            slug: course.slug || '',
                            shortBio: course.shortBio || '',
                            grade: course.grade || 'CLASS_10',
                            category: course.category || 'ACADEMIC_BOARDS',
                            description: course.description || '',
                            price: String(course.price || course.fee || 24999),
                            durationMonths: String(course.durationMonths || 12),
                            features: Array.isArray(course.features) ? course.features.join(', ') : '',
                            subjects: Array.isArray(course.subjects) ? course.subjects.join(', ') : '',
                            thumbnail: course.thumbnail || '',
                            pdfUrl: course.pdfUrl || '',
                            isPublished: course.isPublished ?? true,
                          });
                          setShowCourseModal(true);
                        }}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem({ id: course._id, type: 'COURSE', name: course.title })}
                        className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ACADEMIC PROGRAMS TAB */}
        {activeTab === 'PROGRAMS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-blue-800" /> Academic Programs (Footer & Dedicated Pages)
                </h2>
                <p className="text-xs text-slate-500">Manage programs appearing in public footer and individual detail pages.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProgramId(null);
                  setProgramForm({
                    title: '',
                    slug: '',
                    grade: 'CLASS_10',
                    category: 'Academic Board & Foundation',
                    bio: '',
                    content: '',
                    highlights: 'NCERT Board Curriculum, Weekly CBT Tests, Parent Progress Portal',
                    displayOrder: programsList.length + 1,
                    isPublished: true,
                  });
                  setShowProgramModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Program
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programsList.map((prog) => (
                <div key={prog._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-brand-blue-800 text-white font-bold text-[10px] rounded-lg">{prog.grade}</span>
                      <span className="text-xs text-slate-400 font-mono font-bold">Order: {prog.displayOrder}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-2">{prog.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prog.bio || prog.content}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <Link href={`/academic-programs/${prog.slug}`} target="_blank" className="text-xs font-bold text-brand-blue-800 hover:underline">
                      View Public Page →
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProgramId(prog._id);
                          setProgramForm({
                            title: prog.title || '',
                            slug: prog.slug || '',
                            grade: prog.grade || 'CLASS_10',
                            category: prog.category || 'Academic Board & Foundation',
                            bio: prog.bio || '',
                            content: prog.content || '',
                            highlights: Array.isArray(prog.highlights) ? prog.highlights.join(', ') : '',
                            displayOrder: prog.displayOrder || 1,
                            isPublished: prog.isPublished ?? true,
                          });
                          setShowProgramModal(true);
                        }}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem({ id: prog._id, type: 'PROGRAM', name: prog.title })}
                        className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. FREE MOCK TESTS TAB */}
        {activeTab === 'MOCKTESTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-blue-800" /> Free Mock Test Management (Google Sheets Aligned)
                </h2>
                <p className="text-xs text-slate-500">Manage public mock test papers and Google Sheets sync.</p>
              </div>
              <button
                onClick={() => {
                  setEditingMockTestId(null);
                  setMockTestForm({
                    title: '',
                    description: '',
                    grade: 'CLASS_10',
                    subjectName: 'Science',
                    category: 'Full Syllabus Board Pattern Test',
                    durationMinutes: 60,
                    totalMarks: 100,
                    pdfUrl: '',
                    testUrl: '',
                    isPublished: true,
                  });
                  setShowMockTestModal(true);
                }}
                className="px-4 py-2 bg-brand-gold-500 text-slate-950 font-black rounded-xl text-xs hover:bg-brand-gold-400 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Mock Test
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTestsList.map((test) => (
                <div key={test._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-brand-blue-800 text-white font-bold text-[10px] rounded-lg">{test.grade || 'CLASS_10'}</span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">PUBLISHED</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-2">{test.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{test.durationMinutes || 60} Mins | {test.totalMarks || 100} Marks</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMockTestId(test._id);
                          setMockTestForm({
                            title: test.title || '',
                            description: test.description || '',
                            grade: test.grade || 'CLASS_10',
                            subjectName: test.subjectName || test.subject || 'Science',
                            category: test.category || 'Board Pattern Test',
                            durationMinutes: test.durationMinutes || 60,
                            totalMarks: test.totalMarks || 100,
                            pdfUrl: test.pdfUrl || '',
                            testUrl: test.testUrl || '',
                            isPublished: test.status === 'PUBLISHED',
                          });
                          setShowMockTestModal(true);
                        }}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem({ id: test._id, type: 'MOCKTEST', name: test.title })}
                        className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. LEADS CRM FUNNEL TAB */}
        {activeTab === 'LEADS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Master Lead CRM Funnel</h2>
                <p className="text-xs text-slate-500">Filter and manage leads by stored inquiry types.</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-700">Filter Type:</span>
                <select
                  value={inquiryTypeFilter}
                  onChange={(e) => setInquiryTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-xs"
                >
                  <option value="ALL">ALL INQUIRIES</option>
                  <option value="ADMISSION">ADMISSION</option>
                  <option value="DEMO">DEMO</option>
                  <option value="SCHOLARSHIP">SCHOLARSHIP</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Target Grade</th>
                    <th className="p-3">Inquiry Type</th>
                    <th className="p-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {leadsList
                    .filter((l) => inquiryTypeFilter === 'ALL' || (l.inquiryType || 'ADMISSION') === inquiryTypeFilter)
                    .map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                        <td className="p-3">{lead.phone}</td>
                        <td className="p-3"><span className="px-2.5 py-1 bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg">{lead.grade || 'Class 10th'}</span></td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 font-extrabold rounded-lg ${lead.inquiryType === 'DEMO' ? 'bg-purple-100 text-purple-900' : 'bg-brand-blue-100 text-brand-blue-900'}`}>
                            {lead.inquiryType || 'ADMISSION'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={lead.status || 'NEW'}
                            onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-brand-blue-800 shadow-sm"
                          >
                            <option value="NEW">NEW INQUIRY</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="DEMO_SCHEDULED">DEMO SCHEDULED</option>
                            <option value="ADMITTED">ADMITTED (Auto-Create Student) 🎉</option>
                            <option value="REJECTED">CLOSED / REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. ADMISSIONS PORTAL TAB */}
        {activeTab === 'ADMISSIONS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-blue-800" /> Online Admission Applications Portal
                </h2>
                <p className="text-xs text-slate-500">Approve admissions to convert applicants into active students automatically.</p>
              </div>

              <input
                type="text"
                placeholder="Search admission applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue-800 w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Target Grade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {admissionsList
                    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.phone.includes(searchQuery))
                    .map((adm) => (
                      <tr key={adm._id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{adm.name}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{adm.phone}</div>
                          <div className="text-[11px] text-slate-400">{adm.email || 'No email'}</div>
                        </td>
                        <td className="p-3"><span className="px-2.5 py-1 bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg">{adm.grade || 'Class 10th'}</span></td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 font-bold rounded-lg ${adm.status === 'APPROVED' || adm.status === 'ADMITTED' ? 'bg-emerald-100 text-emerald-800' : adm.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                            {adm.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleUpdateLeadStatus(adm._id, 'APPROVED')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                          >
                            Approve (Auto-Convert)
                          </button>
                          <button
                            onClick={() => handleUpdateLeadStatus(adm._id, 'REJECTED')}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. DEMO BOOKINGS TAB */}
        {activeTab === 'DEMO' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-brand-blue-800" /> Trial Demo Class Bookings
                </h2>
                <p className="text-xs text-slate-500">Real-time trial demo class requests.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Target Class</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {demoList.map((demo) => (
                    <tr key={demo._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{demo.name}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{demo.phone}</div>
                        <div className="text-[11px] text-slate-400">{demo.email}</div>
                      </td>
                      <td className="p-3"><span className="px-2.5 py-1 bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg">{demo.grade || 'Class 10th'}</span></td>
                      <td className="p-3 text-slate-700">{demo.notes || 'Free Demo Trial'}</td>
                      <td className="p-3">
                        <select
                          value={demo.status || 'DEMO_SCHEDULED'}
                          onChange={(e) => handleUpdateLeadStatus(demo._id, e.target.value)}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-xl font-bold text-xs"
                        >
                          <option value="NEW">NEW</option>
                          <option value="DEMO_SCHEDULED">DEMO SCHEDULED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 11. MANUAL PAYMENTS & INVOICES TAB */}
        {activeTab === 'PAYMENTS' && (() => {
          // 1. Group payment records by studentId + courseId
          const groupedMap = new Map<string, {
            groupKey: string;
            studentId: string;
            courseId: string;
            studentName: string;
            courseTitle: string;
            payments: any[];
            totalPaid: number;
            totalCourseFee: number;
            discount: number;
            scholarship: number;
            remainingFee: number;
            latestPayment: any;
          }>();

          paymentsList.forEach((pay) => {
            const sId = typeof pay.studentId === 'object' ? pay.studentId?._id : pay.studentId;
            const cId = typeof pay.courseId === 'object' ? pay.courseId?._id : (pay.courseId || '');
            const key = `${sId || 'unknown'}_${cId || 'nocourse'}`;

            const stdName = pay.studentId?.userId?.name || pay.studentId?.name || pay.studentName || 'Student';
            const cTitle = pay.courseId?.title || pay.courseTitle || '';

            if (!groupedMap.has(key)) {
              groupedMap.set(key, {
                groupKey: key,
                studentId: sId || '',
                courseId: cId || '',
                studentName: stdName,
                courseTitle: cTitle,
                payments: [],
                totalPaid: 0,
                totalCourseFee: 0,
                discount: 0,
                scholarship: 0,
                remainingFee: 0,
                latestPayment: null,
              });
            }

            const group = groupedMap.get(key)!;
            group.payments.push(pay);
          });

          const groupedList = Array.from(groupedMap.values()).map((group) => {
            // Sort payments newest first by paymentDate or createdAt
            group.payments.sort((a, b) => {
              const dateA = new Date(a.paymentDate || a.createdAt).getTime();
              const dateB = new Date(b.paymentDate || b.createdAt).getTime();
              return dateB - dateA;
            });

            group.latestPayment = group.payments[0];

            // Sum up total paid across all successful / non-failed payments for this student & course
            group.totalPaid = group.payments
              .filter((p) => !p.status || p.status === 'SUCCESS' || p.status === 'COMPLETED')
              .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

            group.totalCourseFee = Number(group.latestPayment.totalCourseFee || 0);
            group.discount = Number(group.latestPayment.discount || 0);
            group.scholarship = Number(group.latestPayment.scholarship || 0);

            group.remainingFee = Math.max(
              0,
              group.totalCourseFee - group.discount - group.scholarship - group.totalPaid
            );

            return group;
          });

          // Filter grouped list by search query if any
          const filteredGroups = groupedList.filter((group) => {
            const q = searchQuery.toLowerCase();
            if (!q) return true;
            return (
              group.studentName.toLowerCase().includes(q) ||
              group.courseTitle.toLowerCase().includes(q) ||
              group.payments.some((p) => (p.invoiceNumber || '').toLowerCase().includes(q) || (p.paymentMethod || '').toLowerCase().includes(q))
            );
          });

          return (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" /> Fees & Manual Payments Ledger
                  </h2>
                  <p className="text-xs text-slate-500">Record cash, UPI, cheque, and bank transfer receipts connected to students.</p>
                </div>
                <button
                  onClick={() => {
                    setPaymentForm({
                      studentId: studentsList[0]?._id || '',
                      courseId: coursesList[0]?._id || '',
                      amount: '10000',
                      totalCourseFee: '25000',
                      discount: '0',
                      scholarship: '0',
                      paymentMethod: 'CASH',
                      transactionId: '',
                      notes: 'Manual Fee Payment',
                    });
                    setShowPaymentModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Record Payment
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Paid Amount</th>
                      <th className="p-3">Remaining Fee</th>
                      <th className="p-3">Payment Date</th>
                      <th className="p-3 text-right">Actions (Receipt / Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => {
                        const pay = group.latestPayment;
                        const isExpanded = expandedPaymentGroupKey === group.groupKey;
                        return (
                          <React.Fragment key={group.groupKey}>
                            <tr className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900 font-mono">{pay.invoiceNumber || '#INV-101'}</td>
                              <td className="p-3 font-bold text-slate-900">
                                <div>{group.studentName}</div>
                                {group.courseTitle && (
                                  <div className="text-[10px] text-brand-blue-700 font-semibold">{group.courseTitle}</div>
                                )}
                              </td>
                              <td className="p-3">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg">{pay.paymentMethod || 'CASH'}</span>
                              </td>
                              <td className="p-3 font-black text-emerald-600">
                                <div>₹{(pay.amount || 0).toLocaleString('en-IN')}</div>
                                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Recent</span>
                              </td>
                              <td className="p-3 font-black text-amber-700">₹{group.remainingFee.toLocaleString('en-IN')}</td>
                              <td className="p-3 text-slate-500">
                                <div>{new Date(pay.paymentDate || pay.createdAt).toLocaleDateString()}</div>
                                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Recent</span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => setReceiptItem(pay)}
                                  className="p-1.5 bg-brand-blue-50 text-brand-blue-800 font-bold rounded-lg hover:bg-brand-blue-100 transition inline-flex items-center gap-1 text-xs"
                                  title="Print Latest Receipt"
                                >
                                  <Printer className="w-3.5 h-3.5" /> Receipt
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPaymentId(pay._id);
                                    setPaymentForm({
                                      studentId: pay.studentId?._id || pay.studentId || '',
                                      courseId: pay.courseId?._id || pay.courseId || '',
                                      amount: String(pay.amount || 0),
                                      totalCourseFee: String(pay.totalCourseFee || 0),
                                      discount: String(pay.discount || 0),
                                      scholarship: String(pay.scholarship || 0),
                                      paymentMethod: pay.paymentMethod || 'CASH',
                                      transactionId: pay.transactionId || '',
                                      notes: pay.notes || '',
                                    });
                                    setShowPaymentModal(true);
                                  }}
                                  className="p-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition inline-flex items-center gap-1 text-xs"
                                  title="Edit Latest Payment"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmItem({ id: pay._id, type: 'PAYMENT', name: pay.invoiceNumber || 'Payment' })}
                                  className="p-1.5 bg-rose-50 text-rose-700 font-bold rounded-lg hover:bg-rose-100 transition"
                                  title="Delete Latest Payment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setExpandedPaymentGroupKey(isExpanded ? null : group.groupKey)}
                                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 border ${
                                    isExpanded
                                      ? 'bg-brand-blue-800 text-white border-brand-blue-800'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                  }`}
                                  title="View Complete Payment History"
                                >
                                  <History className="w-3.5 h-3.5" />
                                  <span>History ({group.payments.length})</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              </td>
                            </tr>

                            {/* EXPANDABLE PAYMENT HISTORY ROW */}
                            {isExpanded && (
                              <tr className="bg-slate-50/80">
                                <td colSpan={7} className="p-4 border-t border-b border-slate-200">
                                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-inner">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                      <div className="flex items-center gap-2">
                                        <History className="w-4 h-4 text-brand-blue-800" />
                                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                                          Payment History ({group.payments.length} Records) — {group.studentName}
                                        </h4>
                                      </div>
                                      <div className="text-xs text-slate-500 font-medium">
                                        Total Course Fee: <span className="font-bold text-slate-900">₹{group.totalCourseFee.toLocaleString('en-IN')}</span> | Total Paid: <span className="font-bold text-emerald-700">₹{group.totalPaid.toLocaleString('en-IN')}</span> | Remaining: <span className="font-bold text-amber-700">₹{group.remainingFee.toLocaleString('en-IN')}</span>
                                      </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-100/70 text-slate-700 font-bold">
                                          <tr>
                                            <th className="p-2.5">Invoice No</th>
                                            <th className="p-2.5">Paid Amount</th>
                                            <th className="p-2.5">Payment Method</th>
                                            <th className="p-2.5">Payment Date</th>
                                            <th className="p-2.5">Transaction Ref / Notes</th>
                                            <th className="p-2.5 text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                          {group.payments.map((item: any, idx: number) => (
                                            <tr key={item._id || idx} className="hover:bg-slate-50">
                                              <td className="p-2.5 font-bold font-mono text-slate-900">{item.invoiceNumber || '-'}</td>
                                              <td className="p-2.5 font-extrabold text-emerald-700">₹{(item.amount || 0).toLocaleString('en-IN')}</td>
                                              <td className="p-2.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[11px]">{item.paymentMethod || 'CASH'}</span></td>
                                              <td className="p-2.5 text-slate-600">{new Date(item.paymentDate || item.createdAt).toLocaleDateString()}</td>
                                              <td className="p-2.5 text-slate-500 italic">{item.transactionId || item.notes || '-'}</td>
                                              <td className="p-2.5 text-right space-x-1.5">
                                                <button
                                                  onClick={() => setReceiptItem(item)}
                                                  className="p-1 bg-brand-blue-50 text-brand-blue-800 font-bold rounded hover:bg-brand-blue-100 transition text-[11px]"
                                                  title="Print Receipt"
                                                >
                                                  <Printer className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setEditingPaymentId(item._id);
                                                    setPaymentForm({
                                                      studentId: item.studentId?._id || item.studentId || '',
                                                      courseId: item.courseId?._id || item.courseId || '',
                                                      amount: String(item.amount || 0),
                                                      totalCourseFee: String(item.totalCourseFee || 0),
                                                      discount: String(item.discount || 0),
                                                      scholarship: String(item.scholarship || 0),
                                                      paymentMethod: item.paymentMethod || 'CASH',
                                                      transactionId: item.transactionId || '',
                                                      notes: item.notes || '',
                                                    });
                                                    setShowPaymentModal(true);
                                                  }}
                                                  className="p-1 bg-white border border-slate-300 text-slate-700 font-bold rounded hover:bg-slate-100 transition text-[11px]"
                                                  title="Edit Record"
                                                >
                                                  <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => setDeleteConfirmItem({ id: item._id, type: 'PAYMENT', name: item.invoiceNumber || 'Payment' })}
                                                  className="p-1 bg-rose-50 text-rose-700 font-bold rounded hover:bg-rose-100 transition text-[11px]"
                                                  title="Delete Record"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                          No payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* 12. STUDY MATERIAL PDF MANAGEMENT TAB */}
        {activeTab === 'MATERIALS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue-800" /> Study Material & PDF Notes Hub
                </h2>
                <p className="text-xs text-slate-500">Upload and assign chapter PDF notes and formula sheets to courses.</p>
              </div>
              <button
                onClick={() => {
                  setEditingMaterialId(null);
                  setMaterialForm({
                    title: '',
                    description: '',
                    grade: 'CLASS_10',
                    courseId: '',
                    subjectName: 'Science',
                    fileUrl: '',
                    fileType: 'NOTES',
                    isFree: true,
                    isPublished: true,
                  });
                  setShowMaterialModal(true);
                }}
                className="px-4 py-2 bg-brand-blue-800 text-white font-bold rounded-xl text-xs hover:bg-brand-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Upload className="w-4 h-4" /> Upload Study PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {materialsList.map((m) => (
                <div key={m._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-brand-blue-100 text-brand-blue-800 font-bold rounded">{m.fileType || 'NOTES'}</span>
                      <span className="text-[10px] font-bold text-emerald-600">PDF Ready</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-2">{m.title}</h4>
                    <p className="text-slate-500 line-clamp-2">{m.description || m.grade}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-500">
                    <a href={m.fileUrl?.startsWith('http') ? m.fileUrl : `${API_ORIGIN}${m.fileUrl || ''}`} target="_blank" rel="noreferrer" className="text-brand-blue-800 font-bold hover:underline flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                    <button
                      onClick={() => {
                        setEditingMaterialId(m._id);
                        setMaterialForm({ title: m.title || '', description: m.description || '', grade: m.grade || 'CLASS_10', courseId: m.courseId?._id || m.courseId || '', subjectName: m.subjectName || 'Science', fileUrl: m.fileUrl || '', fileType: m.fileType || 'NOTES', isFree: m.isFree ?? true, isPublished: m.isPublished ?? true });
                        setMaterialFile(null);
                        setShowMaterialModal(true);
                      }}
                      className="text-slate-700 hover:text-brand-blue-800 font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmItem({ id: m._id, type: 'MATERIAL', name: m.title })}
                      className="text-rose-600 hover:text-rose-800 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. AI QUESTION GENERATOR TAB */}
        {activeTab === 'AI' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-brand-blue-800" /> AI Question Bank Generator
              </h2>
              <p className="text-xs text-slate-500">Draft CBSE & Olympiad pattern questions using AI.</p>
            </div>

            <form onSubmit={handleGenerateAIQuestions} className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={aiForm.subject}
                  onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                <select
                  value={aiForm.targetClass}
                  onChange={(e) => setAiForm({ ...aiForm, targetClass: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="Class 10th">Class 10th</option>
                  <option value="Class 9th">Class 9th</option>
                  <option value="Class 8th">Class 8th</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  required
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full py-2.5 bg-brand-blue-800 text-white font-bold rounded-xl hover:bg-brand-blue-900 transition flex items-center justify-center gap-1.5"
                >
                  {aiLoading ? 'Generating...' : <><Sparkles className="w-4 h-4 text-brand-gold-400" /> Generate AI Questions</>}
                </button>
              </div>
            </form>

            {generatedQs.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">Generated Question Drafts:</h3>
                {generatedQs.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <p className="font-bold text-slate-900">Q{idx + 1}: {q.questionText}</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>A) {q.optionA}</div>
                      <div>B) {q.optionB}</div>
                      <div>C) {q.optionC}</div>
                      <div>D) {q.optionD}</div>
                    </div>
                    <div className="text-emerald-700 font-bold pt-1">Correct Option: {q.correctOption}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 14. ANNOUNCEMENTS TAB */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-blue-800" /> Broadcast Notice Publisher
              </h2>
            </div>
            <form onSubmit={handleSaveAnnouncement} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-3xl">
              <input required placeholder="Announcement title" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} className="px-3.5 py-2.5 rounded-xl border border-slate-300" />
              <input required placeholder="Category" value={announcementForm.category} onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })} className="px-3.5 py-2.5 rounded-xl border border-slate-300" />
              <textarea required rows={3} placeholder="Announcement content" value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} className="md:col-span-2 px-3.5 py-2.5 rounded-xl border border-slate-300" />
              <select value={announcementForm.priority} onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })} className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"><option>LOW</option><option>NORMAL</option><option>HIGH</option><option>URGENT</option></select>
              <label className="flex items-center gap-2 font-bold text-slate-700"><input type="checkbox" checked={announcementForm.isPublished} onChange={(e) => setAnnouncementForm({ ...announcementForm, isPublished: e.target.checked })} /> Published for students</label>
              <button type="submit" className="md:col-span-2 py-2.5 px-6 bg-brand-blue-800 text-white font-bold rounded-xl text-xs">{editingAnnouncementId ? 'Update Announcement' : 'Publish Announcement'}</button>
            </form>
            <div className="space-y-2 text-xs">
              {announcementsList.map((item) => <div key={item._id} className="p-3 border border-slate-200 rounded-xl flex justify-between gap-3"><div><p className="font-extrabold text-slate-900">{item.title} <span className="text-[10px] text-brand-blue-800">{item.isPublished ? 'PUBLISHED' : 'DRAFT'}</span></p><p className="text-slate-600">{item.content}</p></div><div className="flex gap-2 shrink-0"><button className="text-brand-blue-800 font-bold" onClick={() => { setEditingAnnouncementId(item._id); setAnnouncementForm({ title: item.title, content: item.content, category: item.category, priority: item.priority, isPublished: item.isPublished }); }}>Edit</button><button className="text-rose-600 font-bold" onClick={() => handleDeleteAnnouncement(item._id)}>Delete</button></div></div>)}
            </div>
          </div>
        )}

        {/* 15. RESULTS PORTAL TAB */}
        {activeTab === 'RESULTS' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg">Results Portal</h2>
            </div>
            <form onSubmit={handleSaveResult} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <select required value={resultForm.category} onChange={(e) => setResultForm({ ...resultForm, category: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300 bg-white"><option value="STUDENT_RESULTS">Student Results</option><option value="HIGHEST_BOARD_SCORE">Highest Board Score</option><option value="STUDENTS_ABOVE_95">Students Above 95%</option><option value="PERFECT_MATHS_SCORES">Perfect Maths Scores</option><option value="OLYMPIAD_RANKS">Olympiad Ranks</option></select>
              <input required placeholder="Student name / statistic title" value={resultForm.studentName} onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300" />
              <select required value={resultForm.class} onChange={(e) => setResultForm({ ...resultForm, class: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300 bg-white">{['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'].map((grade) => <option key={grade}>{grade}</option>)}</select>
              {(['percentage', 'marks', 'cityRank', 'boardScore', 'subjectScore', 'mathsScore', 'olympiadName', 'olympiadRank', 'school', 'photo', 'badge', 'value', 'testimonial'] as const).map((field) => <input key={field} placeholder={field} value={(resultForm as any)[field]} onChange={(e) => setResultForm({ ...resultForm, [field]: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300" />)}
              <button type="submit" className="md:col-span-3 py-2.5 bg-brand-blue-800 text-white font-bold rounded-xl">{editingResultId ? 'Update Result' : 'Add Result'}</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">{resultsList.map((item) => <div key={item._id} className="p-4 border border-slate-200 rounded-xl"><div className="flex justify-between"><div><p className="font-extrabold text-slate-900">{item.studentName}</p><p className="text-slate-500">{item.class} · {item.category}</p><p className="text-brand-blue-800 font-bold">{item.percentage || item.value || item.marks}</p></div><div className="flex gap-2"><button className="text-brand-blue-800 font-bold" onClick={() => { setEditingResultId(item._id); setResultForm({ ...resultForm, ...item }); }}>Edit</button><button className="text-rose-600 font-bold" onClick={() => handleDeleteResult(item._id)}>Delete</button></div></div></div>)}</div>
          </div>
        )}

        {/* 16. PARENT'S INQUIRY LOGS TAB */}
        {activeTab === 'PARENT_INQUIRIES' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-blue-800" /> Parent&apos;s Inquiry Logs
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time database records of counselor inquiries submitted by parents through the Parent Monitoring Portal.
                </p>
              </div>
              <span className="px-3.5 py-1.5 bg-brand-blue-50 text-brand-blue-900 font-extrabold text-xs rounded-xl border border-brand-blue-100 shrink-0">
                Total Inquiries: {parentInquiriesList.length}
              </span>
            </div>

            {loading ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
                Loading parent inquiries from MongoDB...
              </div>
            ) : parentInquiriesList.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Parent Details</th>
                        <th className="p-4">Linked Student</th>
                        <th className="p-4">Inquiry / Message</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {parentInquiriesList
                        .filter((inq) => {
                          if (!searchQuery) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            inq.parentName?.toLowerCase().includes(q) ||
                            inq.studentName?.toLowerCase().includes(q) ||
                            inq.message?.toLowerCase().includes(q) ||
                            inq.parentEmail?.toLowerCase().includes(q)
                          );
                        })
                        .map((inq) => (
                          <tr key={inq._id} className="hover:bg-slate-50/80 transition">
                            <td className="p-4">
                              <div className="font-extrabold text-slate-900 text-sm">{inq.parentName}</div>
                              {inq.parentEmail && (
                                <div className="text-slate-400 text-[11px]">{inq.parentEmail}</div>
                              )}
                              {inq.parentPhone && (
                                <div className="text-slate-400 text-[11px]">{inq.parentPhone}</div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900">{inq.studentName}</div>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px]">
                                {inq.studentGrade}
                              </span>
                            </td>
                            <td className="p-4 max-w-md">
                              <p className="text-slate-800 text-xs italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                                &quot;{inq.message}&quot;
                              </p>
                            </td>
                            <td className="p-4 whitespace-nowrap text-slate-500 font-medium">
                              {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                                  inq.status === 'RESOLVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inq.status === 'CONTACTED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {inq.status || 'NEW'}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {inq.status !== 'CONTACTED' && (
                                  <button
                                    onClick={() => handleUpdateInquiryStatus(inq._id, 'CONTACTED')}
                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition border border-blue-200"
                                  >
                                    Mark Contacted
                                  </button>
                                )}
                                {inq.status !== 'RESOLVED' && (
                                  <button
                                    onClick={() => handleUpdateInquiryStatus(inq._id, 'RESOLVED')}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition border border-emerald-200"
                                  >
                                    Mark Resolved
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
                <p className="text-sm font-bold text-slate-700">No parent inquiries yet.</p>
                <p className="text-xs text-slate-400">
                  When parents submit messages via the Parent Monitoring Portal, they will appear here in real-time.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>

      {/* STUDENT MODAL */}
      {showStudentModal && (() => {
        const selectedStudentObj = studentsList.find((s) => s._id === editingStudentId);
        const hasAccount = Boolean(selectedStudentObj?.userId || selectedStudentObj?.accountStatus === 'Created');

        return (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">{editingStudentId ? 'Edit Student Profile' : 'Register New Student'}</h3>
                <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email / Gmail</label>
                    <input type="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input type="tel" required value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Grade</label>
                    <select value={studentForm.grade} onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold">
                      <option value="CLASS_6">Class 6th</option>
                      <option value="CLASS_7">Class 7th</option>
                      <option value="CLASS_8">Class 8th</option>
                      <option value="CLASS_9">Class 9th</option>
                      <option value="CLASS_10">Class 10th</option>
                      <option value="CLASS_11">Class 11th</option>
                      <option value="CLASS_12">Class 12th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Board</label>
                    <select value={studentForm.board} onChange={(e) => setStudentForm({ ...studentForm, board: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold">
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="STATE_BOARD">State Board</option>
                    </select>
                  </div>
                </div>

                {/* STUDENT LOGIN ACCOUNT SECTION */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex justify-between items-center">
                    <span>Student Login Account</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      editingStudentId && hasAccount
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {editingStudentId && hasAccount ? 'Account Status: Created' : 'Account Status: Not Created'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {editingStudentId && hasAccount ? 'New Password' : 'Password'}
                      </label>
                      <input
                        type="password"
                        required={!hasAccount && !editingStudentId}
                        placeholder={editingStudentId && hasAccount ? 'Leave blank to keep current' : 'Min 6 chars'}
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {editingStudentId && hasAccount ? 'Confirm New Password' : 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        required={!!studentForm.password}
                        placeholder={editingStudentId && hasAccount ? 'Re-enter new password' : 'Re-enter password'}
                        value={studentForm.confirmPassword}
                        onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    {editingStudentId && hasAccount
                      ? "Admin can edit or reset the student's password anytime. Leave blank to keep existing password."
                      : "Enter a password above to create the student's login account so they can sign in."}
                  </p>
                </div>

                <button type="submit" className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md">
                  {editingStudentId ? (hasAccount ? 'Update Student & Account' : 'Save & Create Student Account') : 'Register Student'}
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* TEACHER MODAL */}
      {showTeacherModal && (() => {
        const selectedTeacherObj = teachersList.find((t) => t._id === editingTeacherId);
        const hasAccount = Boolean(selectedTeacherObj?.userId || selectedTeacherObj?.accountStatus === 'Created');

        return (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">{editingTeacherId ? 'Edit Faculty Profile' : 'Add Faculty Member'}</h3>
                <button onClick={() => setShowTeacherModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email / Gmail</label>
                    <input type="email" required value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input type="tel" required value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teaching Subject</label>
                    <input type="text" required placeholder="e.g. Physics, Mathematics" value={teacherForm.teachingSubject} onChange={(e) => setTeacherForm({ ...teacherForm, teachingSubject: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Monthly Salary (₹)</label>
                    <input type="number" required min="0" value={teacherForm.monthlySalary} onChange={(e) => setTeacherForm({ ...teacherForm, monthlySalary: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualification</label>
                  <input type="text" required value={teacherForm.qualification} onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>

                {/* TEACHER LOGIN ACCOUNT SECTION */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex justify-between items-center">
                    <span>Teacher Login Account</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      editingTeacherId && hasAccount
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {editingTeacherId && hasAccount ? 'Account Status: Created' : 'Account Status: Not Created'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {editingTeacherId && hasAccount ? 'New Password' : 'Password'}
                      </label>
                      <input
                        type="password"
                        required={!hasAccount && !editingTeacherId}
                        placeholder={editingTeacherId && hasAccount ? 'Leave blank to keep current' : 'Min 6 chars'}
                        value={teacherForm.password}
                        onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {editingTeacherId && hasAccount ? 'Confirm New Password' : 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        required={!!teacherForm.password}
                        placeholder={editingTeacherId && hasAccount ? 'Re-enter new password' : 'Re-enter password'}
                        value={teacherForm.confirmPassword}
                        onChange={(e) => setTeacherForm({ ...teacherForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    {editingTeacherId && hasAccount
                      ? "Admin can edit or reset the faculty member's password anytime. Leave blank to keep existing password."
                      : "Enter a password above to create the faculty member's login account so they can sign in."}
                  </p>
                </div>

                <button type="submit" className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md">
                  {editingTeacherId ? (hasAccount ? 'Update Faculty & Account' : 'Save & Create Faculty Account') : 'Add Faculty Member'}
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* PARENT MODAL */}
      {showParentModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">{editingParentId ? 'Edit Parent Guardian' : 'Add Parent Guardian'}</h3>
              <button onClick={() => setShowParentModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveParent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Full Name</label>
                <input type="text" required value={parentForm.name} onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email / Gmail</label>
                  <input type="email" required value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input type="tel" required value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                  <input type="text" required placeholder="e.g. Business, Engineer" value={parentForm.occupation} onChange={(e) => setParentForm({ ...parentForm, occupation: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                  <select
                    value={parentForm.studentId}
                    onChange={(e) => setParentForm({ ...parentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="">-- Unlinked --</option>
                    {studentsList.map((std) => (
                      <option key={std._id} value={std._id}>
                        {std.userId?.name || std.name} ({std.grade})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex justify-between items-center">
                  <span>Parent Login Account Password</span>
                  {editingParentId && <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Optional on Edit</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {editingParentId ? 'New Password' : 'Password'}
                    </label>
                    <input
                      type="password"
                      required={!editingParentId}
                      placeholder={editingParentId ? 'Leave blank to keep current' : 'Min 6 chars'}
                      value={parentForm.password}
                      onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {editingParentId ? 'Confirm New Password' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      required={!!parentForm.password}
                      placeholder={editingParentId ? 'Re-enter new password' : 'Re-enter password'}
                      value={parentForm.confirmPassword}
                      onChange={(e) => setParentForm({ ...parentForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                {editingParentId && (
                  <p className="text-[10px] text-slate-500 italic">
                    Admin can edit or reset the parent's password anytime. Leave blank to keep existing password.
                  </p>
                )}
              </div>

              <button type="submit" className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md">
                {editingParentId ? 'Update Parent Details' : 'Create Parent Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER SALARY PAYMENT HISTORY MODAL */}
      {showTeacherSalaryModal && selectedTeacherForSalary && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Faculty Salary & Payment Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTeacherForSalary.userId?.name || selectedTeacherForSalary.name} | Subject: <span className="font-bold text-slate-800">{selectedTeacherForSalary.teachingSubject || 'General'}</span>
                </p>
              </div>
              <button onClick={() => setShowTeacherSalaryModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            {/* Current Salary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold">Monthly Configured Salary:</span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">
                  ₹{(selectedTeacherForSalary.monthlySalary || 0).toLocaleString('en-IN')} / month
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Current Month Status:</span>
                <span className={`px-3 py-1 font-extrabold rounded-full ${
                  selectedTeacherForSalary.currentMonthSalaryStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {selectedTeacherForSalary.currentMonthSalaryStatus === 'PAID' ? '✓ PAID' : '• UNPAID'}
                </span>
              </div>
            </div>

            {/* Record New Salary Payment Form */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Record Salary Payment
              </h4>
              <form onSubmit={handleRecordSalaryPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Salary Month</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. August 2026"
                    value={paymentRecordForm.month}
                    onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paid Date</label>
                  <input
                    type="date"
                    required
                    value={paymentRecordForm.paidDate}
                    onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, paidDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={paymentRecordForm.paidAmount}
                    onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-emerald-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Optional payment notes / reference"
                    value={paymentRecordForm.notes}
                    onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Record Payment
                </button>
              </form>
            </div>

            {/* Permanent Payment History Table */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Permanent Salary Payment History
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Paid Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedTeacherForSalary.salaryPaymentHistory && selectedTeacherForSalary.salaryPaymentHistory.length > 0 ? (
                      selectedTeacherForSalary.salaryPaymentHistory.map((historyItem: any, idx: number) => (
                        <tr key={historyItem._id || idx} className="hover:bg-slate-50">
                          <td className="p-3 font-extrabold text-slate-900">{historyItem.month}</td>
                          <td className="p-3 text-slate-600">{new Date(historyItem.paidDate).toLocaleDateString()}</td>
                          <td className="p-3 font-extrabold text-emerald-700">₹{(historyItem.paidAmount || 0).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-slate-400 italic">{historyItem.notes || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                          No salary payment history recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SALARY QUICK MODAL */}
      {showEditSalaryModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Faculty Monthly Salary</h3>
              <button onClick={() => setShowEditSalaryModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateSalary} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Monthly Salary (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newSalaryValue}
                  onChange={(e) => setNewSalaryValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-emerald-700 text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Updating salary will affect current & future unpaid salary calculations. Historical payment records remain untouched.
              </p>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs hover:bg-emerald-700 transition shadow-md">
                Update Salary
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">{editingCourseId ? 'Edit Course' : 'Create New Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input type="text" required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select value={courseForm.grade} onChange={(e) => setCourseForm({ ...courseForm, grade: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold">
                    <option value="CLASS_6">Class 6th</option>
                    <option value="CLASS_7">Class 7th</option>
                    <option value="CLASS_8">Class 8th</option>
                    <option value="CLASS_9">Class 9th</option>
                    <option value="CLASS_10">Class 10th</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Board / Category</label>
                  <select value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold">
                    <option value="ACADEMIC_BOARDS">CBSE / ICSE Boards</option>
                    <option value="FOUNDATION_JEE_NEET">Foundation JEE/NEET</option>
                    <option value="OLYMPIADS_NTSE">Olympiads & NTSE</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Fee (₹)</label>
                  <input type="number" required value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-emerald-700" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Months)</label>
                  <input type="number" required value={courseForm.durationMonths} onChange={(e) => setCourseForm({ ...courseForm, durationMonths: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Course Description</label>
                <textarea rows={3} required value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Features / Highlights (comma separated)</label>
                <input type="text" value={courseForm.features} onChange={(e) => setCourseForm({ ...courseForm, features: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjects Covered (comma separated)</label>
                <input type="text" value={courseForm.subjects} onChange={(e) => setCourseForm({ ...courseForm, subjects: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Brochure PDF URL</label>
                <input type="text" placeholder="https://... /pdf/course-syllabus.pdf" value={courseForm.pdfUrl} onChange={(e) => setCourseForm({ ...courseForm, pdfUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-gold-500 text-slate-950 font-black rounded-xl text-xs hover:bg-brand-gold-400 transition shadow-md">
                {editingCourseId ? 'Update Course' : 'Publish Course to Website'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FREE MOCK TEST MODAL */}
      {showMockTestModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">{editingMockTestId ? 'Edit Mock Test' : 'Add Free Mock Test'}</h3>
              <button onClick={() => setShowMockTestModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveMockTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Title</label>
                <input type="text" required value={mockTestForm.title} onChange={(e) => setMockTestForm({ ...mockTestForm, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade</label>
                  <select value={mockTestForm.grade} onChange={(e) => setMockTestForm({ ...mockTestForm, grade: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold">
                    <option value="CLASS_6">Class 6th</option>
                    <option value="CLASS_7">Class 7th</option>
                    <option value="CLASS_8">Class 8th</option>
                    <option value="CLASS_9">Class 9th</option>
                    <option value="CLASS_10">Class 10th</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input type="text" required value={mockTestForm.subjectName} onChange={(e) => setMockTestForm({ ...mockTestForm, subjectName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test PDF URL (Paper Upload)</label>
                <input type="text" placeholder="https://... /pdf/mock-test-paper.pdf" value={mockTestForm.pdfUrl} onChange={(e) => setMockTestForm({ ...mockTestForm, pdfUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-gold-500 text-slate-950 font-black rounded-xl text-xs hover:bg-brand-gold-400 transition shadow-md">
                {editingMockTestId ? 'Update Mock Test' : 'Publish Free Mock Test'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ACADEMIC PROGRAM MODAL */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">{editingProgramId ? 'Edit Academic Program' : 'Add Academic Program'}</h3>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Title</label>
                <input type="text" required value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Bio</label>
                <input type="text" value={programForm.bio} onChange={(e) => setProgramForm({ ...programForm, bio: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Content</label>
                <textarea rows={3} required value={programForm.content} onChange={(e) => setProgramForm({ ...programForm, content: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class</label>
                <select required value={programForm.grade} onChange={(e) => setProgramForm({ ...programForm, grade: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white">
                  {['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'].map((grade) => <option key={grade} value={grade}>{grade.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Highlights (comma separated)</label>
                <input type="text" value={programForm.highlights} onChange={(e) => setProgramForm({ ...programForm, highlights: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md">
                {editingProgramId ? 'Update Program' : 'Save Academic Program'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Record Manual Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Enrolled Student</label>
                <select
                  required
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  {studentsList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.userId?.name || s.name || 'Student'} ({s.enrollmentNo || 'ID'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-700 mb-1">Total Course Fee</label><input type="number" min="0" required value={paymentForm.totalCourseFee} onChange={(e) => setPaymentForm({ ...paymentForm, totalCourseFee: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" /></div>
                <div><label className="block font-bold text-slate-700 mb-1">Scholarship / Discount</label><input type="number" min="0" value={paymentForm.scholarship} onChange={(e) => setPaymentForm({ ...paymentForm, scholarship: e.target.value, discount: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                  <input type="number" required value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-emerald-600" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold">
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / Cheque No</label>
                <input type="text" placeholder="e.g. UPI/10293847 or CHQ-94820" value={paymentForm.transactionId} onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" />
              </div>
              <div><label className="block font-bold text-slate-700 mb-1">Payment Date</label><input type="date" value={(paymentForm as any).paymentDate || new Date().toISOString().slice(0, 10)} onChange={(e) => setPaymentForm({ ...(paymentForm as any), paymentDate: e.target.value } as any)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" /></div>
              <div><label className="block font-bold text-slate-700 mb-1">Notes</label><textarea rows={2} value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300" /></div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl text-xs hover:bg-emerald-700 transition shadow-md">
                Record Manual Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STUDY MATERIAL PDF MODAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">{editingMaterialId ? 'Edit Study PDF' : 'Upload Study Material PDF'}</h3>
              <button onClick={() => setShowMaterialModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Chapter Name</label>
                <input type="text" required placeholder="e.g. Light: Reflection & Refraction Notes" value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={materialForm.subjectName}
                    onChange={(e) => setMaterialForm({ ...materialForm, subjectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Mental Ability">Mental Ability</option>
                    <option value="General Science">General Science</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Class</label>
                  <select
                    value={materialForm.grade}
                    onChange={(e) => setMaterialForm({ ...materialForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'].map((g) => (
                      <option key={g} value={g}>{g.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material Category</label>
                  <select
                    value={materialForm.fileType}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="NOTES">NOTES (Chapter Notes)</option>
                    <option value="PREVIOUS_YEAR_PAPER">PREVIOUS YEAR PAPER</option>
                    <option value="PRACTICE_PAPER">PRACTICE PAPER / DPP</option>
                    <option value="FORMULA_SHEET">FORMULA SHEET</option>
                    <option value="IMPORTANT_QUESTIONS">IMPORTANT QUESTIONS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                  <input type="text" placeholder="Short summary..." value={materialForm.description} onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload PDF Document</label>
                <input type="file" accept="application/pdf,.pdf" required={!editingMaterialId} onChange={(e) => setMaterialFile(e.target.files?.[0] || null)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-blue-800 text-white font-black rounded-xl text-xs hover:bg-brand-blue-900 transition shadow-md">
                Upload & Publish Material
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {receiptItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-xl text-brand-blue-900">SADGYANAM COACHING CENTER</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fee Receipt & Payment Voucher</p>
              </div>
              <button onClick={() => setReceiptItem(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">{receiptItem.invoiceNumber || '#INV-101'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{receiptItem.studentId?.userId?.name || receiptItem.studentId?.name || 'Aarav Sharma'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Payment Date:</span>
                <span>{new Date(receiptItem.paymentDate || receiptItem.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Payment Method:</span>
                <span className="font-bold text-slate-800">{receiptItem.paymentMethod || 'CASH'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Transaction ID / Ref:</span>
                <span>{receiptItem.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">₹{(receiptItem.amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => window.print()} className="w-full py-3 bg-brand-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Print Fee Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Confirm Delete Operation</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>"{deleteConfirmItem.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteConfirmItem(null)} className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmItem.type === 'STUDENT') handleDeleteStudent(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'TEACHER') handleDeleteTeacher(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'PARENT') handleDeleteParent(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'COURSE') handleDeleteCourse(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'MOCKTEST') handleDeleteMockTest(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'PROGRAM') handleDeleteProgram(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'PAYMENT') handleDeletePayment(deleteConfirmItem.id);
                  else if (deleteConfirmItem.type === 'MATERIAL') handleDeleteMaterial(deleteConfirmItem.id);
                }}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
