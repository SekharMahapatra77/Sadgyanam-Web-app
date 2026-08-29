import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Parent } from '../models/Parent';
import { Course } from '../models/Course';
import { Batch } from '../models/Batch';
import { Lead } from '../models/Lead';
import { Payment } from '../models/Payment';
import { Test } from '../models/Test';
import { StudyMaterial } from '../models/StudyMaterial';
import { Announcement } from '../models/Announcement';
import { Result } from '../models/Result';
import { Testimonial, BlogPost } from '../models/CMS';
import { ParentInquiry } from '../models/ParentInquiry';
import { ApiResponse } from '../utils/apiResponse';
import { GoogleSheetsService } from '../utils/googleSheetsService';

export class AdminController {
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const studentCount = await Student.countDocuments();
      const teacherCount = await Teacher.countDocuments();
      const courseCount = await Course.countDocuments({ isPublished: true });
      const batchCount = await Batch.countDocuments();
      const newLeadsCount = await Lead.countDocuments({ status: 'NEW' });
      const convertedAdmissions = await Lead.countDocuments({ status: 'ADMITTED' });
      const activeTestsCount = await Test.countDocuments({ isFreeMockTest: true, status: 'PUBLISHED' });

      // Calculate Total Fee Collection from confirmed manual payment records
      const confirmedPayments = await Payment.find({ status: 'SUCCESS' });
      const totalRevenue = confirmedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const feeByStudent = new Map<string, { fee: number; paid: number }>();
      confirmedPayments.forEach((payment) => {
        const key = payment.studentId.toString();
        const current = feeByStudent.get(key) || { fee: 0, paid: 0 };
        current.fee = Math.max(current.fee, (payment.totalCourseFee || 0) - (payment.discount || 0) - (payment.scholarship || 0));
        current.paid += payment.amount || 0;
        feeByStudent.set(key, current);
      });
      const pendingFees = Array.from(feeByStudent.values()).reduce((sum, entry) => sum + Math.max(0, entry.fee - entry.paid), 0);

      const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
      const recentPayments = await Payment.find().populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      }).sort({ createdAt: -1 }).limit(5);

      return ApiResponse.success(
        res,
        {
          kpis: {
            students: studentCount || 0,
            teachers: teacherCount || 0,
            courses: courseCount || 0,
            batches: batchCount || 12,
            newLeads: newLeadsCount || 0,
            admissions: convertedAdmissions || 0,
            revenue: totalRevenue || 0,
            pendingFees,
            upcomingTests: activeTestsCount || 0,
          },
          charts: {
            studentGrowth: [
              { month: 'Jan', students: 45 },
              { month: 'Feb', students: 85 },
              { month: 'Mar', students: 140 },
              { month: 'Apr', students: 210 },
              { month: 'May', students: 310 },
              { month: 'Jun', students: studentCount || 420 },
            ],
            revenueDistribution: [
              { category: 'Class 10 CBSE Board & Foundation', value: 45 },
              { category: 'Class 9 Academic & Olympiads', value: 30 },
              { category: 'Classes 6-8 Foundation', value: 25 },
            ],
          },
          recentLeads,
          recentPayments,
        },
        'Admin dashboard metrics retrieved'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const { role } = req.query;
      const query: any = {};
      if (role) query.role = role;

      const users = await User.find(query).select('-passwordHash -refreshToken').sort({ createdAt: -1 });
      return ApiResponse.success(res, users, 'Users retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- ADMISSIONS & LEAD CRM AUTOMATION ---
  static async getAdmissions(req: Request, res: Response) {
    try {
      const { status, grade } = req.query;
      const query: any = {
        $or: [{ inquiryType: 'ADMISSION' }, { source: 'WEBSITE_FORM' }, { source: 'SCHOLARSHIP_TEST' }],
      };
      if (status) query.status = status;
      if (grade) query.grade = grade;

      const admissions = await Lead.find(query).sort({ createdAt: -1 });
      return ApiResponse.success(res, admissions, 'Admissions retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getDemoBookings(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const query: any = {
        $or: [{ inquiryType: 'DEMO' }, { source: 'DEMO_BOOKING' }],
      };
      if (status) query.status = status;

      const demos = await Lead.find(query).sort({ createdAt: -1 });
      return ApiResponse.success(res, demos, 'Demo bookings retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Updates Lead / Admission Status.
   * Automates Admission -> Student Account Creation when approved (status === 'ADMITTED').
   * Prevents duplicate student creations.
   */
  static async updateLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const lead = await Lead.findById(id);
      if (!lead) return ApiResponse.error(res, 'Admission inquiry lead not found', 404);

      if (!['APPROVED', 'ADMITTED', 'REJECTED', 'NEW', 'CONTACTED', 'DEMO_SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return ApiResponse.error(res, 'Invalid lead status', 400);
      }

      lead.status = status;
      await lead.save();

      let autoCreatedStudent: any = null;

      // Handle Admission Approval -> Auto Student Conversion (Profile only, no auto login account)
      if ((status === 'APPROVED' || status === 'ADMITTED') && lead.inquiryType === 'ADMISSION') {
        const studentEmail = lead.email || `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@sadgyanam-student.com`;

        let existingStudent = await Student.findOne({
          $or: [{ email: studentEmail }, { phone: lead.phone }],
        });

        if (!existingStudent) {
          const enrollmentNo = `SAD-STD-${Date.now().toString().slice(-6)}`;
          existingStudent = await Student.create({
            name: lead.name,
            email: studentEmail,
            phone: lead.phone,
            enrollmentNo,
            grade: lead.grade || 'CLASS_10',
            board: 'CBSE',
            targetExam: 'BOARD_EXAMS',
          });
        }

        autoCreatedStudent = await Student.findById(existingStudent._id).populate('userId', 'name email phone role');
      }

      return ApiResponse.success(
        res,
        { lead, autoCreatedStudent },
        `Status updated to ${status}${autoCreatedStudent ? ' and student profile created!' : ''}`
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- STUDENT CRUD ---
  static async getStudents(req: Request, res: Response) {
    try {
      const students = await Student.find().populate({ path: 'userId', select: 'name email phone role isActive' }).sort({ createdAt: -1 });
      const formatted = students.map((s) => {
        const obj = s.toObject();
        const u = obj.userId as any;
        return {
          ...obj,
          name: u?.name || obj.name || 'Unnamed Student',
          email: u?.email || obj.email || '',
          phone: u?.phone || obj.phone || '',
          accountStatus: u ? 'Created' : 'Not Created',
        };
      });
      return ApiResponse.success(res, formatted, 'Students retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createStudent(req: Request, res: Response) {
    try {
      const { name, email, phone, password, confirmPassword, grade = 'CLASS_10', board = 'CBSE', targetExam = 'BOARD_EXAMS' } = req.body;
      if (!name) {
        return ApiResponse.error(res, 'Student name is required', 400);
      }

      let userId: mongoose.Types.ObjectId | undefined = undefined;

      if (email && password) {
        if (confirmPassword && password !== confirmPassword) {
          return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
        }
        if (password.length < 6) {
          return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
          return ApiResponse.error(res, 'This email is already associated with another account.', 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone ? phone.trim() : '0000000000',
          passwordHash,
          role: 'STUDENT',
          isActive: true,
        });
        userId = user._id;
      }

      const enrollmentNo = `SAD-STD-${Date.now().toString().slice(-6)}`;
      const student = await Student.create({
        userId,
        name: name.trim(),
        email: email ? email.toLowerCase().trim() : '',
        phone: phone ? phone.trim() : '',
        enrollmentNo,
        grade,
        board,
        targetExam,
      });

      const populated = await Student.findById(student._id).populate('userId', 'name email phone role isActive');
      return ApiResponse.success(res, populated, 'Student created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, password, confirmPassword, grade, board, targetExam, isActive } = req.body;

      const student = await Student.findById(id);
      if (!student) return ApiResponse.error(res, 'Student not found', 404);

      if (name) student.name = name.trim();
      if (email) student.email = email.toLowerCase().trim();
      if (phone) student.phone = phone.trim();

      if (student.userId) {
        const user = await User.findById(student.userId);
        if (user) {
          if (name) user.name = name.trim();
          if (phone) user.phone = phone.trim();
          if (isActive !== undefined) user.isActive = isActive;

          if (email && email.toLowerCase().trim() !== user.email) {
            const cleanEmail = email.toLowerCase().trim();
            const existingUser = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
            if (existingUser) {
              return ApiResponse.error(res, 'This email is already associated with another account.', 400);
            }
            user.email = cleanEmail;
          }

          if (password) {
            if (confirmPassword && password !== confirmPassword) {
              return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
            }
            if (password.length < 6) {
              return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
            }
            user.passwordHash = await bcrypt.hash(password, 10);
          }

          await user.save();
        }
      } else if (password) {
        const cleanEmail = (email || student.email || '').toLowerCase().trim();
        if (!cleanEmail) {
          return ApiResponse.error(res, 'Email address is required to create a Student login account', 400);
        }
        if (confirmPassword && password !== confirmPassword) {
          return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
        }
        if (password.length < 6) {
          return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        }

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return ApiResponse.error(res, 'This email is already associated with another account.', 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: student.name || name || 'Student',
          email: cleanEmail,
          phone: student.phone || phone || '0000000000',
          passwordHash,
          role: 'STUDENT',
          isActive: true,
        });

        student.userId = user._id;
      }

      if (grade) student.grade = grade;
      if (board) student.board = board;
      if (targetExam) student.targetExam = targetExam;

      await student.save();

      const populated = await Student.findById(student._id).populate('userId', 'name email phone role isActive');
      return ApiResponse.success(res, populated, 'Student updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await Student.findByIdAndDelete(id);
      if (!student) return ApiResponse.error(res, 'Student not found', 404);

      if (student.userId) {
        await User.findByIdAndDelete(student.userId);
      }
      return ApiResponse.success(res, null, 'Student deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- TEACHER CRUD ---
  static async getTeachers(req: Request, res: Response) {
    try {
      const teachers = await Teacher.find()
        .populate({ path: 'userId', select: 'name email phone role isActive' })
        .sort({ createdAt: -1 });

      const currentDate = new Date();
      const currentMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonthName = currentMonthNames[currentDate.getMonth()].toLowerCase();
      const currentYear = currentDate.getFullYear().toString();

      const formatted = teachers.map((t) => {
        const obj = t.toObject();
        const u = obj.userId as any;
        const history = obj.salaryPaymentHistory || [];
        const isPaid = history.some((rec: any) => {
          if (!rec || !rec.month) return false;
          const m = rec.month.toLowerCase();
          return m.includes(currentMonthName) && m.includes(currentYear);
        });
        return {
          ...obj,
          name: u?.name || obj.name || 'Unnamed Faculty',
          email: u?.email || obj.email || '',
          phone: u?.phone || obj.phone || '',
          accountStatus: u ? 'Created' : 'Not Created',
          currentMonthSalaryStatus: isPaid ? 'PAID' : 'UNPAID',
        };
      });

      return ApiResponse.success(res, formatted, 'Teachers retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createTeacher(req: Request, res: Response) {
    try {
      const { name, email, phone, password, confirmPassword, qualification = 'M.Sc. Educator', teachingSubject = 'Physics', monthlySalary = 25000 } = req.body;
      if (!name) {
        return ApiResponse.error(res, 'Faculty name is required', 400);
      }

      let userId: mongoose.Types.ObjectId | undefined = undefined;

      if (email && password) {
        if (confirmPassword && password !== confirmPassword) {
          return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
        }
        if (password.length < 6) {
          return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
          return ApiResponse.error(res, 'This email is already associated with another account.', 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone ? phone.trim() : '0000000000',
          passwordHash,
          role: 'TEACHER',
          isActive: true,
        });
        userId = user._id;
      }

      const teacher = await Teacher.create({
        userId,
        name: name.trim(),
        email: email ? email.toLowerCase().trim() : '',
        phone: phone ? phone.trim() : '',
        qualification,
        teachingSubject: teachingSubject || 'General Educator',
        monthlySalary: Number(monthlySalary) || 0,
        salaryPaymentHistory: [],
        classesAssigned: ['Class 9th', 'Class 10th'],
      });

      const populated = await Teacher.findById(teacher._id).populate('userId', 'name email phone role isActive');
      return ApiResponse.success(res, populated, 'Teacher created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, password, confirmPassword, qualification, teachingSubject, monthlySalary, isActive } = req.body;

      const teacher = await Teacher.findById(id);
      if (!teacher) return ApiResponse.error(res, 'Teacher not found', 404);

      if (name) teacher.name = name.trim();
      if (email) teacher.email = email.toLowerCase().trim();
      if (phone) teacher.phone = phone.trim();
      if (qualification !== undefined) teacher.qualification = qualification;
      if (teachingSubject !== undefined) teacher.teachingSubject = teachingSubject;
      if (monthlySalary !== undefined) teacher.monthlySalary = Number(monthlySalary);

      if (teacher.userId) {
        const user = await User.findById(teacher.userId);
        if (user) {
          if (name) user.name = name.trim();
          if (phone) user.phone = phone.trim();
          if (isActive !== undefined) user.isActive = isActive;

          if (email && email.toLowerCase().trim() !== user.email) {
            const cleanEmail = email.toLowerCase().trim();
            const existingUser = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
            if (existingUser) {
              return ApiResponse.error(res, 'This email is already associated with another account.', 400);
            }
            user.email = cleanEmail;
          }

          if (password) {
            if (confirmPassword && password !== confirmPassword) {
              return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
            }
            if (password.length < 6) {
              return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
            }
            user.passwordHash = await bcrypt.hash(password, 10);
          }

          await user.save();
        }
      } else if (password) {
        const cleanEmail = (email || teacher.email || '').toLowerCase().trim();
        if (!cleanEmail) {
          return ApiResponse.error(res, 'Email address is required to create a Teacher login account', 400);
        }
        if (confirmPassword && password !== confirmPassword) {
          return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
        }
        if (password.length < 6) {
          return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        }

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return ApiResponse.error(res, 'This email is already associated with another account.', 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: teacher.name || name || 'Faculty Member',
          email: cleanEmail,
          phone: teacher.phone || phone || '0000000000',
          passwordHash,
          role: 'TEACHER',
          isActive: true,
        });

        teacher.userId = user._id;
      }

      await teacher.save();

      const populated = await Teacher.findById(teacher._id).populate('userId', 'name email phone role isActive');
      return ApiResponse.success(res, populated, 'Teacher updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateTeacherSalary(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { monthlySalary } = req.body;

      if (monthlySalary === undefined || isNaN(Number(monthlySalary)) || Number(monthlySalary) < 0) {
        return ApiResponse.error(res, 'Valid non-negative monthly salary is required', 400);
      }

      const teacher = await Teacher.findByIdAndUpdate(
        id,
        { monthlySalary: Number(monthlySalary) },
        { new: true }
      ).populate('userId', 'name email phone role isActive');

      if (!teacher) return ApiResponse.error(res, 'Teacher not found', 404);
      return ApiResponse.success(res, teacher, 'Teacher monthly salary updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async recordTeacherSalaryPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { month, paidDate, paidAmount, notes } = req.body;

      if (!month || paidAmount === undefined || isNaN(Number(paidAmount))) {
        return ApiResponse.error(res, 'Month and valid paid amount are required', 400);
      }

      const teacher = await Teacher.findById(id);
      if (!teacher) return ApiResponse.error(res, 'Teacher not found', 404);

      const cleanMonth = month.trim().toLowerCase();
      const duplicate = teacher.salaryPaymentHistory.find(
        (p) => p.month.trim().toLowerCase() === cleanMonth
      );

      if (duplicate) {
        return ApiResponse.error(
          res,
          `Salary payment for "${month}" has already been recorded for this teacher on ${new Date(duplicate.paidDate).toLocaleDateString()}.`,
          400
        );
      }

      const record = {
        month: month.trim(),
        paidDate: paidDate ? new Date(paidDate) : new Date(),
        paidAmount: Number(paidAmount),
        notes: notes || '',
      };

      teacher.salaryPaymentHistory.push(record as any);
      await teacher.save();

      const populated = await Teacher.findById(teacher._id).populate('userId', 'name email phone role isActive');
      return ApiResponse.success(res, populated, 'Salary payment recorded successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findByIdAndDelete(id);
      if (!teacher) return ApiResponse.error(res, 'Teacher not found', 404);

      await User.findByIdAndDelete(teacher.userId);
      return ApiResponse.success(res, null, 'Teacher deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- PARENT CRUD ---
  static async getParents(req: Request, res: Response) {
    try {
      const parents = await Parent.find()
        .populate({ path: 'userId', select: 'name email phone role isActive' })
        .populate({ path: 'children', populate: { path: 'userId', select: 'name grade enrollmentNo' } })
        .sort({ createdAt: -1 });
      return ApiResponse.success(res, parents, 'Parents retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createParent(req: Request, res: Response) {
    try {
      const { name, email, phone, password, confirmPassword, occupation = 'Professional', alternatePhone = '', studentId } = req.body;
      if (!name || !email || !phone) {
        return ApiResponse.error(res, 'Name, email, and phone are required', 400);
      }

      if (password && confirmPassword && password !== confirmPassword) {
        return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
      }

      const userPassword = password || 'Password@123';
      if (userPassword.length < 6) {
        return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
      }

      let user = await User.findOne({ email });
      if (user) {
        if (user.role !== 'PARENT') {
          return ApiResponse.error(res, 'An account with this email already exists under a different role', 400);
        }
      } else {
        const passwordHash = await bcrypt.hash(userPassword, 10);
        user = await User.create({
          name,
          email,
          phone,
          passwordHash,
          role: 'PARENT',
        });
      }

      const childrenIds: mongoose.Types.ObjectId[] = [];
      if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
        childrenIds.push(new mongoose.Types.ObjectId(studentId));
      }

      let parent = await Parent.findOne({ userId: user._id });
      if (parent) {
        parent.occupation = occupation || parent.occupation;
        parent.alternatePhone = alternatePhone || parent.alternatePhone;
        if (studentId && !parent.children.some((c: any) => c.toString() === studentId)) {
          parent.children.push(new mongoose.Types.ObjectId(studentId));
        }
        await parent.save();
      } else {
        parent = await Parent.create({
          userId: user._id,
          occupation,
          alternatePhone,
          children: childrenIds,
        });
      }

      if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
        await Student.findByIdAndUpdate(studentId, { parentId: parent._id });
      }

      const populated = await Parent.findById(parent._id)
        .populate('userId', 'name email phone role isActive')
        .populate({ path: 'children', populate: { path: 'userId', select: 'name grade enrollmentNo' } });

      return ApiResponse.success(res, populated, 'Parent account created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateParent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, password, confirmPassword, occupation, alternatePhone, studentId, isActive } = req.body;

      const parent = await Parent.findById(id);
      if (!parent) return ApiResponse.error(res, 'Parent not found', 404);

      const userUpdate: any = {};
      if (name) userUpdate.name = name;
      if (email) userUpdate.email = email;
      if (phone) userUpdate.phone = phone;
      if (isActive !== undefined) userUpdate.isActive = isActive;

      if (password) {
        if (confirmPassword && password !== confirmPassword) {
          return ApiResponse.error(res, 'Password and Confirm Password do not match', 400);
        }
        if (password.length < 6) {
          return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        }
        userUpdate.passwordHash = await bcrypt.hash(password, 10);
      }

      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(parent.userId, userUpdate);
      }

      const childrenIds: mongoose.Types.ObjectId[] = [];
      if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
        childrenIds.push(new mongoose.Types.ObjectId(studentId));
        await Student.findByIdAndUpdate(studentId, { parentId: parent._id });
      }

      const updateData: any = { occupation, alternatePhone };
      if (studentId) {
        updateData.children = childrenIds;
      }

      const updated = await Parent.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('userId', 'name email phone role isActive')
        .populate({ path: 'children', populate: { path: 'userId', select: 'name grade enrollmentNo' } });

      return ApiResponse.success(res, updated, 'Parent updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteParent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parent = await Parent.findByIdAndDelete(id);
      if (!parent) return ApiResponse.error(res, 'Parent not found', 404);

      await User.findByIdAndDelete(parent.userId);
      return ApiResponse.success(res, null, 'Parent deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- MANUAL PAYMENTS & INVOICE LEDGER CRUD ---
  static async getPayments(req: Request, res: Response) {
    try {
      const payments = await Payment.find()
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email phone' }
        })
        .populate('courseId', 'title price')
        .sort({ createdAt: -1 });

      return ApiResponse.success(res, payments, 'Payments retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createPayment(req: Request, res: Response) {
    try {
      const {
        studentId,
        courseId,
        amount,
        totalCourseFee = 25000,
        discount = 0,
        scholarship = 0,
        paymentMethod = 'CASH',
        transactionId = '',
        notes = '',
        paymentDate = new Date(),
      } = req.body;

      if (!studentId || amount === undefined || amount === null || Number(amount) <= 0) {
        return ApiResponse.error(res, 'Student ID and Payment Amount are required', 400);
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) return ApiResponse.error(res, 'Invalid student ID', 400);
      if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) return ApiResponse.error(res, 'Invalid course ID', 400);
      if (!await Student.exists({ _id: studentId })) return ApiResponse.error(res, 'Student not found', 404);

      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const payment = await Payment.create({
        invoiceNumber,
        studentId,
        ...(courseId ? { courseId } : {}),
        amount: Number(amount),
        totalCourseFee: Number(totalCourseFee),
        discount: Number(discount),
        scholarship: Number(scholarship),
        paymentMethod,
        transactionId,
        notes,
        paymentDate,
        status: 'SUCCESS',
      });

      const populated = await Payment.findById(payment._id)
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email phone' }
        })
        .populate('courseId', 'title price');

      return ApiResponse.success(res, populated, 'Manual payment recorded successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updatePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return ApiResponse.error(res, 'Invalid payment ID', 400);
      if (req.body.studentId && (!mongoose.Types.ObjectId.isValid(req.body.studentId) || !await Student.exists({ _id: req.body.studentId }))) {
        return ApiResponse.error(res, 'Invalid student ID', 400);
      }
      if (req.body.courseId === '') delete req.body.courseId;
      if (req.body.courseId && !mongoose.Types.ObjectId.isValid(req.body.courseId)) return ApiResponse.error(res, 'Invalid course ID', 400);
      const payment = await Payment.findByIdAndUpdate(id, req.body, { new: true })
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email phone' }
        })
        .populate('courseId', 'title price');

      if (!payment) return ApiResponse.error(res, 'Payment record not found', 404);
      return ApiResponse.success(res, payment, 'Payment record updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) return ApiResponse.error(res, 'Payment record not found', 404);

      return ApiResponse.success(res, null, 'Payment record deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- FREE MOCK TEST ADMIN CRUD ---
  static async getMockTestsAdmin(req: Request, res: Response) {
    try {
      const tests = await Test.find({ isFreeMockTest: true }).sort({ createdAt: -1 });
      return ApiResponse.success(res, tests, 'Free Mock Tests retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createMockTestAdmin(req: Request, res: Response) {
    try {
      const {
        title,
        description = '',
        grade = 'CLASS_10',
        subjectName = 'Science',
        category = 'Full Syllabus Mock Test',
        durationMinutes = 60,
        totalMarks = 100,
        pdfUrl = '',
        testUrl = '',
        testDate = new Date(),
        isPublished = true,
      } = req.body;

      const mockTest = await Test.create({
        title,
        description,
        grade,
        subjectName,
        category,
        durationMinutes: Number(durationMinutes) || 60,
        totalMarks: Number(totalMarks) || 100,
        passingMarks: Math.round((Number(totalMarks) || 100) * 0.4),
        pdfUrl,
        testUrl,
        testDate,
        isFreeMockTest: true,
        status: isPublished ? 'PUBLISHED' : 'DRAFT',
      });

      // Sync with Google Sheets if credentials configured
      GoogleSheetsService.syncMockTestRow({
        testName: title,
        grade,
        subject: subjectName,
        description,
        pdfUrl,
        testUrl,
        testDate: new Date(testDate).toLocaleDateString(),
        status: isPublished ? 'PUBLISHED' : 'DRAFT',
      });

      return ApiResponse.success(res, mockTest, 'Free Mock Test created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateMockTestAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const test = await Test.findByIdAndUpdate(id, req.body, { new: true });
      if (!test) return ApiResponse.error(res, 'Mock test not found', 404);

      return ApiResponse.success(res, test, 'Mock test updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteMockTestAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const test = await Test.findByIdAndDelete(id);
      if (!test) return ApiResponse.error(res, 'Mock test not found', 404);

      return ApiResponse.success(res, null, 'Mock test deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- STUDY MATERIAL CRUD ---
  static async getStudyMaterials(req: Request, res: Response) {
    try {
      const materials = await StudyMaterial.find()
        .populate('subjectId', 'name code grade')
        .populate('courseId', 'title grade')
        .sort({ createdAt: -1 });

      return ApiResponse.success(res, materials, 'Study materials retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getPublicStudyMaterials(req: Request, res: Response) {
    try {
      const { limit, grade, fileType } = req.query;
      const query: any = { isPublished: true };
      if (grade && typeof grade === 'string') query.grade = grade;
      if (fileType && typeof fileType === 'string') query.fileType = fileType;

      let dbQuery = StudyMaterial.find(query)
        .populate('subjectId', 'name code grade')
        .populate('courseId', 'title grade')
        .sort({ createdAt: -1 });

      if (limit && !isNaN(Number(limit))) {
        dbQuery = dbQuery.limit(Number(limit));
      }

      const materials = await dbQuery.exec();
      return ApiResponse.success(res, materials, 'Published study materials retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getStudentStudyMaterials(req: Request, res: Response) {
    try {
      const { limit, grade, fileType } = req.query;
      const query: any = { isPublished: true };
      if (grade && typeof grade === 'string') query.grade = grade;
      if (fileType && typeof fileType === 'string') query.fileType = fileType;

      let dbQuery = StudyMaterial.find(query)
        .populate('subjectId', 'name code grade')
        .populate('courseId', 'title grade')
        .sort({ createdAt: -1 });

      if (limit && !isNaN(Number(limit))) {
        dbQuery = dbQuery.limit(Number(limit));
      }

      const materials = await dbQuery.exec();
      return ApiResponse.success(res, materials, 'Student study materials retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createStudyMaterial(req: Request, res: Response) {
    try {
      const {
        title,
        description = '',
        grade = 'CLASS_10',
        courseId,
        subjectId,
        subjectName = 'Science / Mathematics',
        fileUrl = '',
        fileType = 'NOTES',
        isFree = true,
        isPublished = true,
      } = req.body;

      const storedFileUrl = (req as any).file ? `/uploads/materials/${(req as any).file.filename}` : fileUrl;
      if (!title || !storedFileUrl) {
        return ApiResponse.error(res, 'Title and a PDF file are required', 400);
      }

      const material = await StudyMaterial.create({
        title,
        description,
        grade,
        courseId: (courseId && mongoose.Types.ObjectId.isValid(courseId)) ? courseId : undefined,
        subjectId: (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) ? subjectId : undefined,
        subjectName,
        fileUrl: storedFileUrl,
        fileType,
        isFree: Boolean(isFree),
        isPublished: Boolean(isPublished),
        uploadedBy: (req as any).user?.userId,
      });

      const populated = await StudyMaterial.findById(material._id)
        .populate('subjectId', 'name code grade')
        .populate('courseId', 'title grade');

      return ApiResponse.success(res, populated, 'Study material uploaded successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateStudyMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      if ((req as any).file) updateData.fileUrl = `/uploads/materials/${(req as any).file.filename}`;
      if (updateData.courseId === '') delete updateData.courseId;
      if (updateData.subjectId === '') delete updateData.subjectId;

      const material = await StudyMaterial.findByIdAndUpdate(id, updateData, { new: true })
        .populate('subjectId', 'name code grade')
        .populate('courseId', 'title grade');

      if (!material) return ApiResponse.error(res, 'Study material not found', 404);

      return ApiResponse.success(res, material, 'Study material updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteStudyMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const material = await StudyMaterial.findByIdAndDelete(id);
      if (!material) return ApiResponse.error(res, 'Study material not found', 404);

      return ApiResponse.success(res, null, 'Study material deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(req: Request, res: Response) {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    return ApiResponse.success(res, announcements, 'Announcements retrieved successfully');
  }

  static async getPublicAnnouncements(req: Request, res: Response) {
    const announcements = await Announcement.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 });
    return ApiResponse.success(res, announcements, 'Published announcements retrieved successfully');
  }

  static async createAnnouncement(req: Request, res: Response) {
    const data = { ...req.body, createdBy: (req as any).user?.userId, publishedAt: req.body.isPublished ? new Date() : undefined };
    const announcement = await Announcement.create(data);
    return ApiResponse.success(res, announcement, 'Announcement created successfully', 201);
  }

  static async updateAnnouncement(req: Request, res: Response) {
    const data = { ...req.body };
    if (data.isPublished === true) data.publishedAt = new Date();
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!announcement) return ApiResponse.error(res, 'Announcement not found', 404);
    return ApiResponse.success(res, announcement, 'Announcement updated successfully');
  }

  static async deleteAnnouncement(req: Request, res: Response) {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return ApiResponse.error(res, 'Announcement not found', 404);
    return ApiResponse.success(res, null, 'Announcement deleted successfully');
  }

  // --- RESULTS ---
  static async getResults(req: Request, res: Response) {
    const results = await Result.find({}).sort({ class: 1, createdAt: -1 });
    return ApiResponse.success(res, results, 'Results retrieved successfully');
  }

  static async getPublicResults(req: Request, res: Response) {
    const results = await Result.find({ isPublished: true }).sort({ class: 1, createdAt: -1 });
    return ApiResponse.success(res, results, 'Published results retrieved successfully');
  }

  static async createResult(req: Request, res: Response) {
    const result = await Result.create(req.body);
    return ApiResponse.success(res, result, 'Result created successfully', 201);
  }

  static async updateResult(req: Request, res: Response) {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!result) return ApiResponse.error(res, 'Result not found', 404);
    return ApiResponse.success(res, result, 'Result updated successfully');
  }

  static async deleteResult(req: Request, res: Response) {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return ApiResponse.error(res, 'Result not found', 404);
    return ApiResponse.success(res, null, 'Result deleted successfully');
  }

  // --- CMS ---
  static async createTestimonial(req: Request, res: Response) {
    try {
      const { name, role, grade, exam, review, avatar } = req.body;
      const testimonial = await Testimonial.create({
        name,
        role: role || 'STUDENT',
        grade: grade || 'Class 10th CBSE',
        exam,
        review,
        avatar,
        isPublished: true,
      });
      return ApiResponse.success(res, testimonial, 'Testimonial created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createBlogPost(req: Request, res: Response) {
    try {
      const { title, content, excerpt, category, author } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const post = await BlogPost.create({
        title,
        slug: slug || `post-${Date.now()}`,
        content,
        excerpt: excerpt || title,
        category: category || 'Exam Strategy',
        author: author || 'SADGYANAM Faculty',
        isPublished: true,
      });
      return ApiResponse.success(res, post, 'Blog post published successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- PARENT INQUIRIES ADMIN LOGS ---
  static async getParentInquiriesAdmin(req: Request, res: Response) {
    try {
      const inquiries = await ParentInquiry.find().sort({ createdAt: -1 });
      return ApiResponse.success(res, inquiries, "Parent's inquiry logs retrieved successfully");
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateParentInquiryStatusAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['NEW', 'CONTACTED', 'RESOLVED'].includes(status)) {
        return ApiResponse.error(res, 'Invalid status value', 400);
      }

      const inquiry = await ParentInquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!inquiry) return ApiResponse.error(res, 'Parent inquiry record not found', 404);

      return ApiResponse.success(res, inquiry, 'Parent inquiry status updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

