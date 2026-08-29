import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Student } from '../models/Student';
import { Parent } from '../models/Parent';
import { Attendance } from '../models/Attendance';
import { TeacherRemark } from '../models/TeacherRemark';
import { TestAttempt } from '../models/TestAttempt';
import { Test } from '../models/Test';
import { Batch } from '../models/Batch';
import { Course } from '../models/Course';
import { AcademicProgram } from '../models/AcademicProgram';
import { ParentInquiry } from '../models/ParentInquiry';
import { User } from '../models/User';
import { ApiResponse } from '../utils/apiResponse';

export class StudentController {
  /**
   * Helper function to normalize student grade into standard Enum & display strings
   */
  private static parseGradeInfo(rawGrade?: string) {
    const str = (rawGrade || '').toString().toUpperCase();
    if (str.includes('6')) {
      return {
        enumGrade: 'CLASS_6',
        displayGrade: 'Class 6th',
        bannerText: 'Class 6th CBSE & Foundation',
        defaultCourseName: 'Class 6th Young Scholars Track',
      };
    }
    if (str.includes('7')) {
      return {
        enumGrade: 'CLASS_7',
        displayGrade: 'Class 7th',
        bannerText: 'Class 7th CBSE & Foundation',
        defaultCourseName: 'Class 7th Foundation Program',
      };
    }
    if (str.includes('8')) {
      return {
        enumGrade: 'CLASS_8',
        displayGrade: 'Class 8th',
        bannerText: 'Class 8th CBSE & Foundation',
        defaultCourseName: 'Class 8th Junior Foundation & Olympiad Track',
      };
    }
    if (str.includes('9')) {
      return {
        enumGrade: 'CLASS_9',
        displayGrade: 'Class 9th',
        bannerText: 'Class 9th CBSE & Foundation',
        defaultCourseName: 'Class 9th CBSE Board & Olympiad Success Batch',
      };
    }
    return {
      enumGrade: 'CLASS_10',
      displayGrade: 'Class 10th',
      bannerText: 'Class 10th CBSE & Foundation',
      defaultCourseName: 'Class 10th CBSE Board & Foundation Pinnacle Program',
    };
  }

  /**
   * Get dynamic student dashboard overview metrics for logged-in student.
   * Strictly uses req.user.userId from authenticated session JWT.
   */
  static async getDashboardOverview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      // 1. Resolve Student Record
      let student = await Student.findOne({ userId: req.user.userId }).populate({
        path: 'batchId',
        populate: { path: 'courseId' },
      });

      if (!student && req.user.email) {
        student = await Student.findOne({ email: req.user.email.toLowerCase() }).populate({
          path: 'batchId',
          populate: { path: 'courseId' },
        });
      }

      if (!student) {
        return ApiResponse.error(res, 'Student profile not found for authenticated user', 404);
      }

      // 2. Format Grade Information
      const gradeInfo = StudentController.parseGradeInfo(student.grade);

      // 3. Resolve Enrolled Course / Batch Info
      let enrolledCourse = {
        title: gradeInfo.defaultCourseName,
        timing: 'Timing: 04:30 PM - 07:30 PM (Mon - Sat) | Hybrid Mode',
        mode: 'Hybrid Mode',
        batchName: '',
      };

      if (student.batchId) {
        const batch: any = student.batchId;
        const courseTitle = batch.courseId?.title || batch.name || gradeInfo.defaultCourseName;
        enrolledCourse = {
          title: courseTitle,
          timing: batch.timing ? `Timing: ${batch.timing} | ${batch.mode || 'Hybrid'} Mode` : 'Timing: 04:30 PM - 07:30 PM (Mon - Sat) | Hybrid Mode',
          mode: batch.mode ? `${batch.mode} Mode` : 'Hybrid Mode',
          batchName: batch.name || '',
        };
      } else {
        const matchedCourse = await Course.findOne({ grade: gradeInfo.enumGrade, isPublished: true });
        if (matchedCourse) {
          enrolledCourse.title = matchedCourse.title;
        } else {
          const matchedProg = await AcademicProgram.findOne({ grade: gradeInfo.enumGrade, isPublished: true });
          if (matchedProg) {
            enrolledCourse.title = matchedProg.title;
          }
        }
      }

      // 4. Calculate Mock Tests Taken & Stats (Attempted/Submitted/Completed ONLY)
      const completedAttempts = await TestAttempt.find({
        studentId: student._id,
        submittedAt: { $ne: null },
      })
        .populate('testId', 'title totalMarks')
        .sort({ submittedAt: -1 });

      const testsTakenCount = completedAttempts.length;

      let avgScorePercentage = 0;
      let lastTestInfo: { title: string; score: number; totalMarks: number } | null = null;

      if (testsTakenCount > 0) {
        const sumPercentages = completedAttempts.reduce((acc, attempt) => acc + (attempt.percentage || 0), 0);
        avgScorePercentage = Math.round((sumPercentages / testsTakenCount) * 10) / 10;

        const lastAttempt: any = completedAttempts[0];
        const testTitle = lastAttempt.testId?.title || 'Mock Test';
        const totalMarks = lastAttempt.totalMarks || lastAttempt.testId?.totalMarks || 100;
        lastTestInfo = {
          title: testTitle,
          score: lastAttempt.score || 0,
          totalMarks,
        };
      }

      // 5. Overall Score Calculation
      const overallScore = testsTakenCount > 0 ? `${avgScorePercentage}%` : 'N/A';
      const benchmarkLabel = `${gradeInfo.displayGrade} CBSE Benchmark`;

      // 6. Available Online Mock Tests for Student's Grade/Batch
      const availableMockTests = await Test.find({
        status: 'PUBLISHED',
        $or: [
          { grade: gradeInfo.enumGrade },
          { batchIds: student.batchId },
          { isFreeMockTest: true },
        ],
      })
        .select('-questionIds')
        .sort({ createdAt: -1 })
        .limit(5);

      const formattedMockTests = availableMockTests.map((t: any) => ({
        _id: t._id,
        title: t.title,
        description: t.description,
        durationMinutes: t.durationMinutes || 60,
        totalMarks: t.totalMarks || 100,
        category: t.category || (t.isFreeMockTest ? 'Free Board Pattern Mock' : 'Mock Test Series'),
        isFreeMockTest: t.isFreeMockTest,
        isScholarshipTest: t.isScholarshipTest,
      }));

      return ApiResponse.success(
        res,
        {
          student: {
            id: student._id,
            name: student.name,
            email: student.email,
            enrollmentNo: student.enrollmentNo,
            grade: student.grade,
            displayGrade: gradeInfo.displayGrade,
            bannerClassText: gradeInfo.bannerText,
            board: student.board,
          },
          overallScore: {
            value: overallScore,
            hasData: testsTakenCount > 0,
            label: benchmarkLabel,
          },
          mockTestsTaken: {
            count: testsTakenCount,
            avgPercentage: avgScorePercentage,
            lastTest: lastTestInfo,
          },
          enrolledCourse,
          availableMockTests: formattedMockTests,
        },
        'Student dashboard overview fetched successfully'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get dynamic attendance statistics for the logged-in student.
   * Identifies student strictly from authenticated session token (req.user.userId).
   */
  static async getMyAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      // Resolve student profile linked to authenticated user ID
      const student = await Student.findOne({ userId: req.user.userId });
      if (!student) {
        return ApiResponse.error(res, 'Student profile not found for this user account', 404);
      }

      // Query all recorded attendance entries for this student from MongoDB
      const records = await Attendance.find({ studentId: student._id }).sort({ date: -1 });

      const presentCount = records.filter((r) => r.status === 'PRESENT').length;
      const absentCount = records.filter((r) => r.status === 'ABSENT' || r.status === 'LATE').length;
      const totalClasses = records.length;

      let attendancePercentage = 0;
      let hasRecords = false;

      if (totalClasses > 0) {
        hasRecords = true;
        attendancePercentage = Math.round((presentCount / totalClasses) * 100);
      }

      return ApiResponse.success(
        res,
        {
          studentId: student._id,
          enrollmentNo: student.enrollmentNo,
          grade: student.grade,
          presentCount,
          absentCount,
          totalClasses,
          attendancePercentage,
          hasRecords,
          recentRecords: records.slice(0, 10).map((r) => ({
            date: r.date,
            status: r.status,
            remarks: r.remarks,
          })),
        },
        'Student attendance retrieved successfully'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get academic teacher remarks strictly for the authenticated student.
   */
  static async getMyRemarks(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      let student = await Student.findOne({ userId: req.user.userId });
      if (!student && req.user.email) {
        student = await Student.findOne({ email: req.user.email.toLowerCase() });
      }

      if (!student) {
        return ApiResponse.success(res, [], 'No student record found for this account');
      }

      const remarks = await TeacherRemark.find({ studentId: student._id })
        .populate('teacherId', 'name email')
        .sort({ date: -1, createdAt: -1 });

      const formatted = remarks.map((r) => {
        return {
          _id: r._id,
          id: r._id.toString(),
          teacherName: r.teacherName || (r.teacherId as any)?.name || 'Faculty Member',
          classGrade: r.classGrade,
          remark: r.remark,
          date: r.date || r.createdAt,
        };
      });

      return ApiResponse.success(res, formatted, 'Student remarks retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get academic teacher remarks for linked children of the authenticated parent.
   */
  static async getParentRemarks(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      const parent = await Parent.findOne({ userId: req.user.userId });

      let children: any[] = [];
      if (parent) {
        children = await Student.find({
          $or: [{ parentId: parent._id }, { _id: { $in: parent.children || [] } }],
        });
      }

      if (children.length === 0 && req.user.email) {
        const studentMatch = await Student.find({ email: req.user.email.toLowerCase() });
        if (studentMatch.length > 0) {
          children = studentMatch;
        }
      }

      if (children.length === 0) {
        return ApiResponse.success(res, [], 'No linked child records found');
      }

      const childIds = children.map((c) => c._id);

      const remarks = await TeacherRemark.find({ studentId: { $in: childIds } })
        .populate({ path: 'studentId', select: 'name grade enrollmentNo' })
        .populate('teacherId', 'name email')
        .sort({ date: -1, createdAt: -1 });

      const formatted = remarks.map((r) => {
        const s = r.studentId as any;
        return {
          _id: r._id,
          id: r._id.toString(),
          studentId: s?._id,
          studentName: s?.name || 'Child',
          classGrade: r.classGrade || s?.grade || 'Class 10th',
          teacherName: r.teacherName || (r.teacherId as any)?.name || 'Faculty Member',
          remark: r.remark,
          date: r.date || r.createdAt,
        };
      });

      return ApiResponse.success(res, formatted, 'Parent remarks retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get dynamic parent dashboard overview for the authenticated parent and their linked child/children.
   * Strictly verifies parent-child authorization on the backend using JWT req.user.userId.
   */
  static async getParentDashboardOverview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      // 1. Resolve Parent Record
      const parent = await Parent.findOne({ userId: req.user.userId });

      let children: any[] = [];
      if (parent) {
        children = await Student.find({
          $or: [{ parentId: parent._id }, { _id: { $in: parent.children || [] } }],
        }).populate({ path: 'batchId', populate: { path: 'courseId' } });
      }

      if (children.length === 0 && req.user.email) {
        const studentMatch = await Student.find({ email: req.user.email.toLowerCase() }).populate({
          path: 'batchId',
          populate: { path: 'courseId' },
        });
        if (studentMatch.length > 0) {
          children = studentMatch;
        }
      }

      if (children.length === 0) {
        return ApiResponse.success(
          res,
          {
            parentName: req.user.email,
            children: [],
            selectedChild: null,
            attendance: { hasRecords: false, attendancePercentage: 0, presentCount: 0, totalClasses: 0 },
            averageTestScore: { hasData: false, value: 'N/A', count: 0 },
            testHistory: [],
          },
          'No linked children found for parent account'
        );
      }

      // 2. Resolve Selected Linked Child (Security Enforced)
      const requestedChildId = req.query.studentId as string;
      let selectedChild = children[0];

      if (requestedChildId) {
        const matchedChild = children.find(
          (c) => c._id.toString() === requestedChildId || c.id === requestedChildId
        );
        if (matchedChild) {
          selectedChild = matchedChild;
        }
      }

      const gradeInfo = StudentController.parseGradeInfo(selectedChild.grade);

      // 3. Child Attendance Calculation
      const attendanceRecords = await Attendance.find({ studentId: selectedChild._id }).sort({ date: -1 });

      const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT').length;
      const absentCount = attendanceRecords.filter((r) => r.status === 'ABSENT' || r.status === 'LATE').length;
      const totalClasses = attendanceRecords.length;

      let attendancePercentage = 0;
      let hasAttendanceRecords = false;

      if (totalClasses > 0) {
        hasAttendanceRecords = true;
        attendancePercentage = Math.round((presentCount / totalClasses) * 100);
      }

      // 4. Child Average Test Score & Attempt History (Completed ONLY)
      const completedAttempts = await TestAttempt.find({
        studentId: selectedChild._id,
        submittedAt: { $ne: null },
      })
        .populate('testId', 'title totalMarks durationMinutes')
        .sort({ submittedAt: -1 });

      const testsTakenCount = completedAttempts.length;
      let avgScorePercentage = 0;

      if (testsTakenCount > 0) {
        const sumPercentages = completedAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
        avgScorePercentage = Math.round((sumPercentages / testsTakenCount) * 10) / 10;
      }

      const formattedHistory = completedAttempts.map((attempt: any) => ({
        _id: attempt._id,
        testTitle: attempt.testId?.title || 'Mock Test',
        date: attempt.submittedAt || attempt.createdAt,
        score: attempt.score,
        totalMarks: attempt.totalMarks || attempt.testId?.totalMarks || 100,
        percentage: attempt.percentage,
        accuracyPercentage: attempt.accuracyPercentage,
      }));

      // 5. Children Summary List
      const childrenSummary = children.map((c) => {
        const gInfo = StudentController.parseGradeInfo(c.grade);
        return {
          _id: c._id,
          id: c._id.toString(),
          name: c.name || 'Child',
          enrollmentNo: c.enrollmentNo,
          grade: c.grade,
          displayGrade: gInfo.displayGrade,
          bannerClassText: gInfo.bannerText,
        };
      });

      return ApiResponse.success(
        res,
        {
          parentName: req.user.email,
          children: childrenSummary,
          selectedChild: {
            _id: selectedChild._id,
            id: selectedChild._id.toString(),
            name: selectedChild.name || 'Child',
            enrollmentNo: selectedChild.enrollmentNo,
            grade: selectedChild.grade,
            displayGrade: gradeInfo.displayGrade,
            bannerClassText: gradeInfo.bannerText,
            board: selectedChild.board || 'CBSE',
          },
          attendance: {
            hasRecords: hasAttendanceRecords,
            attendancePercentage,
            presentCount,
            absentCount,
            totalClasses,
          },
          averageTestScore: {
            hasData: testsTakenCount > 0,
            value: testsTakenCount > 0 ? `${avgScorePercentage}%` : 'N/A',
            avgPercentage: avgScorePercentage,
            count: testsTakenCount,
          },
          testHistory: formattedHistory,
        },
        'Parent dashboard overview fetched successfully'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Submit an inquiry to the Institute Counselor from the authenticated parent.
   * Automatically derives parent identity & linked student from authenticated session.
   */
  static async submitParentInquiry(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
      }

      const { message, studentId } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        return ApiResponse.error(res, 'Inquiry message content is required', 400);
      }

      // 1. Fetch User and Parent profile
      const user = await User.findById(req.user.userId);
      const parent = await Parent.findOne({ userId: req.user.userId });

      // 2. Resolve Linked Student
      let children: any[] = [];
      if (parent) {
        children = await Student.find({
          $or: [{ parentId: parent._id }, { _id: { $in: parent.children || [] } }],
        });
      }

      if (children.length === 0 && req.user.email) {
        const studentMatch = await Student.find({ email: req.user.email.toLowerCase() });
        if (studentMatch.length > 0) children = studentMatch;
      }

      if (children.length === 0) {
        return ApiResponse.error(res, 'No linked child record found for this parent account', 404);
      }

      let selectedChild = children[0];
      if (studentId) {
        const matched = children.find((c) => c._id.toString() === studentId || c.id === studentId);
        if (matched) selectedChild = matched;
      }

      const gradeInfo = StudentController.parseGradeInfo(selectedChild.grade);

      // 3. Create ParentInquiry record in MongoDB
      const inquiry = await ParentInquiry.create({
        parentId: parent?._id,
        parentName: user?.name || selectedChild.name || 'Parent',
        parentEmail: user?.email || req.user.email || '',
        parentPhone: user?.phone || '',
        studentId: selectedChild._id,
        studentName: selectedChild.name || 'Child',
        studentGrade: gradeInfo.displayGrade,
        message: message.trim(),
        status: 'NEW',
      });

      return ApiResponse.success(res, inquiry, 'Parent inquiry submitted successfully to Institute Counselor', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
