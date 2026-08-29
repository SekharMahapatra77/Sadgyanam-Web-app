import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { CourseController } from '../controllers/courseController';
import { AcademicProgramController } from '../controllers/academicProgramController';
import { TestController } from '../controllers/testController';
import { LeadController } from '../controllers/leadController';
import { AdminController } from '../controllers/adminController';
import { AIController } from '../controllers/aiController';
import { TeacherController } from '../controllers/teacherController';
import { StudentController } from '../controllers/studentController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';
import { Testimonial, BlogPost } from '../models/CMS';
import { ApiResponse } from '../utils/apiResponse';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const materialUploadDir = path.resolve(__dirname, '../../uploads/materials');
fs.mkdirSync(materialUploadDir, { recursive: true });
const materialUpload = multer({
  storage: multer.diskStorage({
    destination: materialUploadDir,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-')}`),
  }),
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'application/pdf'),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const router = Router();

// --- Health Check ---
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'SADGYANAM Digital Coaching Platform',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.get('/auth/me', authenticateJWT, AuthController.getMe);

// --- Course Routes (Public & Admin) ---
router.get('/courses', CourseController.getPublicCourses);
router.get('/courses/:slug', CourseController.getCourseBySlug);
router.post('/courses', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), CourseController.createCourse);
router.put('/courses/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), CourseController.updateCourse);
router.delete('/courses/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), CourseController.deleteCourse);
router.patch('/courses/:id/publish', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), CourseController.togglePublishCourse);

// --- Academic Program Routes (Public & Admin) ---
router.get('/academic-programs/public', AcademicProgramController.getPublicPrograms);
router.get('/academic-programs/:slug', AcademicProgramController.getProgramBySlug);
router.get('/materials/public', AdminController.getPublicStudyMaterials);
router.get('/student/materials', authenticateJWT, AdminController.getStudentStudyMaterials);
router.get('/announcements/public', AdminController.getPublicAnnouncements);
router.get('/results/public', AdminController.getPublicResults);
router.get('/admin/academic-programs', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AcademicProgramController.getAllProgramsAdmin);
router.post('/admin/academic-programs', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AcademicProgramController.createProgram);
router.put('/admin/academic-programs/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AcademicProgramController.updateProgram);
router.delete('/admin/academic-programs/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AcademicProgramController.deleteProgram);

// --- Test Routes (Public & Student) ---
router.get('/tests/public/free', TestController.getPublicFreeTests);
router.get('/tests/public/scholarship', TestController.getPublicScholarshipTests);
router.post('/tests/:id/start', authenticateJWT, TestController.startTest);
router.post('/tests/:id/submit', authenticateJWT, TestController.submitTest);
router.get('/tests/attempt/:id/result', authenticateJWT, TestController.getAttemptResult);

// --- Free Mock Test Admin Management ---
router.get('/admin/mock-tests', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getMockTestsAdmin);
router.post('/admin/mock-tests', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createMockTestAdmin);
router.put('/admin/mock-tests/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateMockTestAdmin);
router.delete('/admin/mock-tests/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteMockTestAdmin);

// --- Lead & Admission Inquiry Routes ---
router.post('/leads/inquire', LeadController.submitLead);
router.get('/leads', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), LeadController.getLeads);
router.patch('/leads/:id/status', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), LeadController.updateLeadStatus);

// --- Admin Dashboard & Analytics ---
router.get('/admin/analytics', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getDashboardMetrics);
router.get('/admin/users', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getUsers);
router.get('/admin/admissions', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getAdmissions);
router.get('/admin/demo-bookings', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getDemoBookings);

// --- Admin Student Management CRUD ---
router.get('/admin/students', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getStudents);
router.post('/admin/students', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createStudent);
router.put('/admin/students/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateStudent);
router.delete('/admin/students/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteStudent);

// --- Admin Teacher Management CRUD ---
router.get('/admin/teachers', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getTeachers);
router.post('/admin/teachers', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createTeacher);
router.put('/admin/teachers/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateTeacher);
router.patch('/admin/teachers/:id/salary', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateTeacherSalary);
router.post('/admin/teachers/:id/salary-payment', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.recordTeacherSalaryPayment);
router.delete('/admin/teachers/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteTeacher);


// --- Admin Parent Management CRUD ---
router.get('/admin/parents', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getParents);
router.post('/admin/parents', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createParent);
router.put('/admin/parents/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateParent);
router.delete('/admin/parents/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteParent);

// --- Admin Manual Payments CRUD ---
router.get('/admin/payments', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getPayments);
router.post('/admin/payments', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createPayment);
router.put('/admin/payments/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updatePayment);
router.delete('/admin/payments/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deletePayment);

// --- Admin Study Material CRUD ---
router.get('/admin/materials', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getStudyMaterials);
router.post('/admin/materials', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), materialUpload.single('file'), AdminController.createStudyMaterial);
router.put('/admin/materials/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), materialUpload.single('file'), AdminController.updateStudyMaterial);
router.delete('/admin/materials/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteStudyMaterial);

// --- Admin Announcements ---
router.get('/admin/announcements', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getAnnouncements);
router.post('/admin/announcements', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createAnnouncement);
router.put('/admin/announcements/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateAnnouncement);
router.delete('/admin/announcements/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteAnnouncement);

// --- Admin Results ---
router.get('/admin/results', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getResults);
router.post('/admin/results', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createResult);
router.put('/admin/results/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateResult);
router.delete('/admin/results/:id', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.deleteResult);

// --- Admin CMS ---
router.post('/admin/cms/testimonials', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createTestimonial);
router.post('/admin/cms/blog', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.createBlogPost);

// --- AI Module Routes ---
router.post('/ai/assistant', authenticateJWT, AIController.studyAssistant);
router.post('/ai/solve-doubt', authenticateJWT, AIController.solveDoubt);
router.post('/ai/generate-questions', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), AIController.generateDraftQuestions);

// --- Student & Parent Portal Custom Routes ---
router.get('/student/dashboard-overview', authenticateJWT, requireRoles(['STUDENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.getDashboardOverview);
router.get('/student/attendance', authenticateJWT, requireRoles(['STUDENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.getMyAttendance);
router.get('/student/remarks', authenticateJWT, requireRoles(['STUDENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.getMyRemarks);
router.get('/parent/dashboard-overview', authenticateJWT, requireRoles(['PARENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.getParentDashboardOverview);
router.post('/parent/inquiries', authenticateJWT, requireRoles(['PARENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.submitParentInquiry);
router.get('/parent/remarks', authenticateJWT, requireRoles(['PARENT', 'ADMIN', 'SUPER_ADMIN']), StudentController.getParentRemarks);

// --- Admin Parent Inquiry Logs ---
router.get('/admin/parent-inquiries', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.getParentInquiriesAdmin);
router.patch('/admin/parent-inquiries/:id/status', authenticateJWT, requireRoles(['SUPER_ADMIN', 'ADMIN']), AdminController.updateParentInquiryStatusAdmin);

// --- Teacher Portal Routes ---
router.get('/teacher/overview', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getTeacherOverview);
router.get('/teacher/students', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getStudents);
router.get('/teacher/attendance', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getAttendance);
router.post('/teacher/attendance', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.saveAttendance);

router.get('/teacher/needs-attention', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getNeedsAttention);
router.post('/teacher/needs-attention', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.addNeedsAttention);
router.put('/teacher/needs-attention/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.updateNeedsAttention);
router.delete('/teacher/needs-attention/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.deleteNeedsAttention);

router.get('/teacher/remarks', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getRemarks);
router.post('/teacher/remarks', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.createRemark);
router.put('/teacher/remarks/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.updateRemark);
router.delete('/teacher/remarks/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.deleteRemark);

router.get('/teacher/lectures', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.getLectures);
router.post('/teacher/lectures', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.createLecture);
router.put('/teacher/lectures/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.updateLecture);
router.delete('/teacher/lectures/:id', authenticateJWT, requireRoles(['TEACHER', 'ADMIN', 'SUPER_ADMIN']), TeacherController.deleteLecture);

// --- CMS Public Content ---
router.get('/cms/testimonials', async (req, res) => {
  const testimonials = await Testimonial.find({ isPublished: true });
  return ApiResponse.success(res, testimonials, 'Testimonials retrieved');
});

router.get('/cms/blog', async (req, res) => {
  const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 });
  return ApiResponse.success(res, posts, 'Blog posts retrieved');
});

export default router;
