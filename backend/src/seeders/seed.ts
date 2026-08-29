import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Parent } from '../models/Parent';
import { Course } from '../models/Course';
import { Subject } from '../models/Subject';
import { Chapter } from '../models/Chapter';
import { Batch } from '../models/Batch';
import { Question } from '../models/Question';
import { Test } from '../models/Test';
import { Testimonial, BlogPost } from '../models/CMS';
import { AcademicProgram } from '../models/AcademicProgram';
import { Lead } from '../models/Lead';

const seedData = async () => {
  console.log('🌱 Starting SADGYANAM Database Seeding (Classes 6th - 10th)...');
  await connectDB();

  // Clear existing collections
  await User.deleteMany({});
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await Parent.deleteMany({});
  await Course.deleteMany({});
  await AcademicProgram.deleteMany({});
  await Subject.deleteMany({});
  await Chapter.deleteMany({});
  await Batch.deleteMany({});
  await Question.deleteMany({});
  await Test.deleteMany({});
  await Testimonial.deleteMany({});
  await BlogPost.deleteMany({});
  await Lead.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('sadgyanam123', salt);

  // 1. Create Users
  const superAdmin = await User.create({
    name: 'Dr. R. K. Sharma (Director)',
    email: 'admin@sadgyanam.edu.in',
    phone: '9876543210',
    passwordHash,
    role: 'SUPER_ADMIN',
  });

  const teacherUser = await User.create({
    name: 'Prof. Ananya Verma',
    email: 'teacher@sadgyanam.edu.in',
    phone: '9876543211',
    passwordHash,
    role: 'TEACHER',
  });

  const studentUser = await User.create({
    name: 'Aarav Patel',
    email: 'student@sadgyanam.edu.in',
    phone: '9876543212',
    passwordHash,
    role: 'STUDENT',
  });

  const parentUser = await User.create({
    name: 'Sanjay Patel',
    email: 'parent@sadgyanam.edu.in',
    phone: '9876543213',
    passwordHash,
    role: 'PARENT',
  });

  // 2. Create Profiles
  const teacher = await Teacher.create({
    userId: teacherUser._id,
    qualification: 'M.Sc. Physics (Gold Medalist), B.Ed',
    experienceYears: 12,
    classesAssigned: ['Class 9th', 'Class 10th'],
    bio: 'Senior Physics & Science Educator with over 12 years of coaching Class 9 & 10 Board Rankers and Olympiad qualifiers.',
  });

  const parent = await Parent.create({
    userId: parentUser._id,
    children: [],
    occupation: 'Senior Software Engineer',
  });

  const student = await Student.create({
    userId: studentUser._id,
    enrollmentNo: 'SADG-2026-0001',
    grade: 'CLASS_10',
    board: 'CBSE',
    targetExam: 'BOARD_EXAMS',
    parentId: parent._id,
    schoolName: 'St. Xavier High School',
    attendancePercentage: 96,
    averageScore: 92,
  });

  // Link child to parent
  parent.children.push(student._id);
  await parent.save();

  // Seed Academic Programs
  await AcademicProgram.create([
    {
      title: 'Class 10th CBSE Board & Foundation',
      slug: 'class-10-cbse-board-foundation',
      grade: 'CLASS_10',
      category: 'Academic Board & Foundation',
      bio: 'Pinnacle 1-Year Board & Foundation Program for Class 10th.',
      content: 'Comprehensive 1-year mastery program covering Class 10th Board Exam syllabus in depth along with Foundation JEE/NEET problem-solving techniques.',
      highlights: ['Daily Live & Classroom Lectures', '24/7 AI Doubt Solver', '10-Year Board Paper Bank'],
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: 'Class 9th Board & Olympiad Batch',
      slug: 'class-9-board-olympiad-batch',
      grade: 'CLASS_9',
      category: 'Board & Olympiad Track',
      bio: 'Specialized foundation program preparing students for Class 9th school exams, IJSO, PRMO, and early JEE/NEET building blocks.',
      content: 'Specialized foundation program preparing students for Class 9th school exams, IJSO, PRMO, and early JEE/NEET building blocks.',
      highlights: ['Conceptual Physics & Chemistry Lab Modules', 'Advanced Mathematics for PRMO', 'Weekly Olympiad Quizzes'],
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: 'Class 8th Junior Science Olympiad',
      slug: 'class-8-junior-science-olympiad',
      grade: 'CLASS_8',
      category: 'Junior Olympiad Track',
      bio: 'Build robust analytical skills and scientific temper with our Class 8th foundation program.',
      content: 'Build robust analytical skills and scientific temper with our Class 8th foundation program designed for future top rankers.',
      highlights: ['Interactive 3D Visual Concepts', 'Mental Ability & Speed Calculation', 'Parent-Teacher Meetings'],
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: 'Class 7th Foundation Program',
      slug: 'class-7-foundation-program',
      grade: 'CLASS_7',
      category: 'Middle School Foundation',
      bio: 'Strengthen fundamental concepts in Science, Maths, and Logical Reasoning.',
      content: 'Strengthen fundamental concepts in Science, Maths, and Logical Reasoning for Class 7th students.',
      highlights: ['Core Science & Math Workshops', 'Logical Puzzle Solving', 'Regular Assessment Reports'],
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: 'Class 6th Young Scholars Track',
      slug: 'class-6-young-scholars-track',
      grade: 'CLASS_6',
      category: 'Early Learning Foundation',
      bio: 'Ignite curiosity and scientific thinking from Class 6th onwards.',
      content: 'Ignite curiosity and scientific thinking from Class 6th onwards with activity-based learning.',
      highlights: ['Activity-based Math & Science', 'Fun Logic Games', 'Holistic Academic Growth'],
      displayOrder: 5,
      isPublished: true,
    },
  ]);

  // 3. Create Courses for Classes 6 to 10
  const course10 = await Course.create({
    title: 'Class 10th CBSE Board & Foundation Pinnacle Program',
    slug: 'class-10-cbse-board-foundation',
    grade: 'CLASS_10',
    category: 'ACADEMIC_BOARDS',
    description: 'Complete 1-Year Academic & Foundation program for Class 10 CBSE Boards, NTSE, and Olympiads covering Maths, Science, Social Studies & Mental Ability.',
    durationMonths: 12,
    price: 28000,
    discountedPrice: 22500,
    features: [
      'Daily Live & Classroom Lectures',
      'Comprehensive Workbooks & NCERT Exemplar Solutions',
      'Weekly Offline/Online Mock Test Series',
      'Parent Progress Tracking Portal',
      'AI Doubt Solver Support',
    ],
    assignedTeachers: [teacher._id],
  });

  const course9 = await Course.create({
    title: 'Class 9th CBSE Board & Olympiad Success Batch',
    slug: 'class-9-cbse-board-olympiad',
    grade: 'CLASS_9',
    category: 'FOUNDATION_JEE_NEET',
    description: 'Comprehensive program building strong conceptual clarity in Science, Maths, and Reasoning for Class 9 students.',
    durationMonths: 12,
    price: 24000,
    discountedPrice: 19500,
    features: [
      'NCERT + Advanced Foundation Modules',
      'Regular Doubt Clearance Sessions',
      'Chapter-wise Practice Tests (DPPs)',
    ],
  });

  const course8 = await Course.create({
    title: 'Class 8th Junior Foundation & Olympiad Track',
    slug: 'class-8-junior-foundation',
    grade: 'CLASS_8',
    category: 'OLYMPIADS_NTSE',
    description: 'Early booster course for Class 8 students aiming for Homi Bhabha Science Exam, IMO, NSO, and strong board preparation.',
    durationMonths: 12,
    price: 20000,
    discountedPrice: 16000,
    features: ['Interactive Animated Classes', 'Olympiad Rank Booster Series'],
  });

  // 4. Create Subjects & Chapters for Class 10
  const mathsSubject = await Subject.create({
    name: 'Mathematics',
    code: 'MATH10',
    grade: 'CLASS_10',
    courseId: course10._id,
    icon: 'calculator',
  });

  const scienceSubject = await Subject.create({
    name: 'Science (Physics & Chemistry)',
    code: 'SCI10',
    grade: 'CLASS_10',
    courseId: course10._id,
    icon: 'atom',
  });

  const chapterLight = await Chapter.create({
    name: 'Light - Reflection and Refraction',
    chapterNumber: 10,
    subjectId: scienceSubject._id,
    description: 'Spherical mirrors, mirror formula, magnification, refraction laws, lenses, and lens formula.',
    topics: ['Reflection by Spherical Mirrors', 'Refraction through Glass Slab', 'Lens Formula & Power'],
  });

  // 5. Create Batch
  const batch10 = await Batch.create({
    name: 'Class 10th Alpha Batch (2026-27)',
    grade: 'CLASS_10',
    courseId: course10._id,
    startDate: new Date('2026-04-01'),
    endDate: new Date('2027-03-31'),
    timing: '04:30 PM - 07:30 PM (Mon-Sat)',
    mode: 'HYBRID',
    maxSeats: 40,
    enrolledCount: 28,
    teacherIds: [teacher._id],
  });

  student.batchId = batch10._id;
  await student.save();

  // 6. Create Questions in Question Bank
  const q1 = await Question.create({
    subjectId: scienceSubject._id,
    chapterId: chapterLight._id,
    topic: 'Lens Formula & Power',
    questionText: 'What is the SI unit of power of a lens?',
    questionType: 'SINGLE_CHOICE',
    options: [
      { optionId: 'A', text: 'Meter' },
      { optionId: 'B', text: 'Diopter (D)' },
      { optionId: 'C', text: 'Watt' },
      { optionId: 'D', text: 'Joule' },
    ],
    correctAnswers: ['B'],
    explanation: 'The power of a lens is defined as the reciprocal of its focal length in meters. Its SI unit is Diopter (D).',
    marks: 4,
    negativeMarks: 1,
    difficulty: 'EASY',
    createdBy: teacherUser._id,
  });

  const q2 = await Question.create({
    subjectId: scienceSubject._id,
    chapterId: chapterLight._id,
    topic: 'Reflection by Spherical Mirrors',
    questionText: 'An object is placed at the center of curvature of a concave mirror. Where is its image formed?',
    questionType: 'SINGLE_CHOICE',
    options: [
      { optionId: 'A', text: 'At Focus' },
      { optionId: 'B', text: 'Between Focus and Center of Curvature' },
      { optionId: 'C', text: 'At Center of Curvature' },
      { optionId: 'D', text: 'Beyond Center of Curvature' },
    ],
    correctAnswers: ['C'],
    explanation: 'When an object is placed at the center of curvature (C) of a concave mirror, a real, inverted image of the same size is formed at C.',
    marks: 4,
    negativeMarks: 1,
    difficulty: 'MEDIUM',
    createdBy: teacherUser._id,
  });

  // 7. Create Test
  const test10 = await Test.create({
    title: 'Class 10th Science Chapter Mock Test - Light & Optics',
    description: 'Weekly practice test for Class 10 Light Reflection and Refraction chapter.',
    courseId: course10._id,
    subjectId: scienceSubject._id,
    grade: 'CLASS_10',
    batchIds: [batch10._id],
    durationMinutes: 45,
    totalMarks: 8,
    passingMarks: 4,
    negativeMarking: true,
    questionIds: [q1._id, q2._id],
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(Date.now() + 86400000 * 30),
    status: 'PUBLISHED',
    isFreeMockTest: true,
    isScholarshipTest: true,
    createdBy: teacherUser._id,
  });

  // 8. Create Testimonials & CMS
  await Testimonial.create({
    name: 'Mrs. Sunita Sharma',
    role: 'PARENT',
    grade: 'Parent of Class 10 CBSE Student',
    exam: 'Scored 98.4% in Board Exams',
    review: 'SADGYANAM coaching transformed my daughter Aarushi\'s conceptual understanding in Maths and Science.',
  });

  await Testimonial.create({
    name: 'Rohan Deshmukh',
    role: 'STUDENT',
    grade: 'Class 10 Student',
    exam: 'State Rank 4 in Science Olympiad',
    review: 'The faculty at SADGYANAM makes complex Physics and Chemistry topics so intuitive.',
  });

  await BlogPost.create({
    title: 'How Class 9 & 10 Students Can Build a Strong Science & Maths Foundation',
    slug: 'class-9-10-science-maths-foundation-tips',
    content: 'Building a strong foundation in Class 9 and 10 is crucial for scoring top percentages in Board Exams...',
    excerpt: 'Key strategies for Class 9th & 10th students to master NCERT concepts.',
    category: 'Exam Strategy',
    tags: ['Class 10 CBSE', 'Board Preparation', 'Science Tips'],
    isPublished: true,
  });

  // 9. Create Leads
  await Lead.create({
    name: 'Siddharth Mehta',
    phone: '9876500001',
    email: 'siddharth@gmail.com',
    grade: 'CLASS_10',
    targetExam: 'CBSE Boards & Foundation',
    city: 'Main Branch',
    source: 'WEBSITE_FORM',
    status: 'NEW',
    notes: 'Interested in Class 10 Evening Batch.',
  });

  console.log('✅ SADGYANAM Seed Completed Successfully!');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
