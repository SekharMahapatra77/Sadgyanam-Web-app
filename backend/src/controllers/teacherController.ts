import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Batch } from '../models/Batch';
import { Attendance } from '../models/Attendance';
import { NeedsAttention } from '../models/NeedsAttention';
import { TeacherRemark } from '../models/TeacherRemark';
import { TimetableLecture } from '../models/TimetableLecture';
import { ApiResponse } from '../utils/apiResponse';

const normalizeGradeString = (gradeStr: string): string[] => {
  if (!gradeStr) return [];
  const clean = gradeStr.toUpperCase().replace(/\s+/g, '_');
  if (clean.includes('10')) return ['CLASS_10', 'Class 10th', 'Class 10', '10th'];
  if (clean.includes('9')) return ['CLASS_9', 'Class 9th', 'Class 9', '9th'];
  if (clean.includes('8')) return ['CLASS_8', 'Class 8th', 'Class 8', '8th'];
  if (clean.includes('7')) return ['CLASS_7', 'Class 7th', 'Class 7', '7th'];
  if (clean.includes('6')) return ['CLASS_6', 'Class 6th', 'Class 6', '6th'];
  return [gradeStr];
};

const getTodayISTString = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });
  return formatter.format(new Date());
};

export class TeacherController {
  /**
   * Get teacher profile & overview data
   */
  static async getTeacherOverview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const teacherProfile = await Teacher.findOne({ userId: req.user.userId });
      const todayStr = getTodayISTString();

      const teacherIdList: any[] = [new mongoose.Types.ObjectId(req.user.userId)];
      if (teacherProfile) {
        teacherIdList.push(teacherProfile._id);
      }

      // Fetch today's lectures for the logged-in teacher in Asia/Kolkata timezone
      const todayLectures = await TimetableLecture.find({
        teacherId: { $in: teacherIdList },
        date: todayStr,
      }).sort({ startTime: 1 });

      // Assigned batches/classes
      let assignedBatches: any[] = [];
      if (teacherProfile) {
        assignedBatches = await Batch.find({
          $or: [{ teacherIds: teacherProfile._id }, { teacherIds: req.user.userId }],
        });
      }

      // Needs Attention count & items
      const needsAttentionList = await NeedsAttention.find({ status: 'ACTIVE' })
        .populate({ path: 'studentId', select: 'name grade enrollmentNo attendancePercentage' })
        .sort({ updatedAt: -1 });

      return ApiResponse.success(
        res,
        {
          teacherProfile,
          todayLectures,
          assignedBatchesCount: assignedBatches.length || (teacherProfile?.classesAssigned?.length || 2),
          assignedBatches,
          needsAttentionCount: needsAttentionList.length,
          needsAttentionList,
        },
        'Teacher overview fetched successfully'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get list of real students from MongoDB organized by Class/Grade or Batch
   */
  static async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      const { classGrade, batchId, search } = req.query;

      const query: any = {};

      if (classGrade && classGrade !== 'ALL') {
        const gradeMatches = normalizeGradeString(classGrade as string);
        query.grade = { $in: gradeMatches };
      }

      if (batchId && batchId !== 'ALL') {
        query.batchId = batchId;
      }

      if (search) {
        const searchRegex = new RegExp(search as string, 'i');
        query.$or = [{ name: searchRegex }, { enrollmentNo: searchRegex }, { email: searchRegex }];
      }

      const students = await Student.find(query)
        .populate({ path: 'userId', select: 'name email phone role' })
        .populate('batchId', 'name grade timing')
        .sort({ name: 1 });

      // Calculate recent actual attendance per student from Attendance model if needed
      const formatted = students.map((s) => {
        const obj = s.toObject();
        const u = obj.userId as any;
        return {
          ...obj,
          name: u?.name || obj.name || 'Unnamed Student',
          email: u?.email || obj.email || '',
          phone: u?.phone || obj.phone || '',
          rollNo: obj.enrollmentNo || s._id.toString().slice(-4),
        };
      });

      return ApiResponse.success(res, formatted, 'Students retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Get attendance for a given class/batch and date
   */
  static async getAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const { classGrade, batchId, date } = req.query;
      if (!date) {
        return ApiResponse.error(res, 'Date is required (YYYY-MM-DD)', 400);
      }

      const targetDate = date as string;
      const studentQuery: any = {};

      if (classGrade && classGrade !== 'ALL') {
        const gradeMatches = normalizeGradeString(classGrade as string);
        studentQuery.grade = { $in: gradeMatches };
      }

      if (batchId && batchId !== 'ALL') {
        studentQuery.batchId = batchId;
      }

      // Fetch real admitted students matching class/batch
      const students = await Student.find(studentQuery)
        .populate({ path: 'userId', select: 'name email phone' })
        .sort({ name: 1 });

      const studentIds = students.map((s) => s._id);

      // Fetch existing attendance records for this date
      const attendanceRecords = await Attendance.find({
        studentId: { $in: studentIds },
        date: targetDate,
      });

      const attendanceMap = new Map<string, string>();
      attendanceRecords.forEach((rec) => {
        attendanceMap.set(rec.studentId.toString(), rec.status);
      });

      const list = students.map((s) => {
        const u = s.userId as any;
        const sIdStr = s._id.toString();
        return {
          id: sIdStr,
          studentId: sIdStr,
          name: u?.name || s.name || 'Unnamed Student',
          rollNo: s.enrollmentNo || sIdStr.slice(-4),
          grade: s.grade,
          status: attendanceMap.get(sIdStr) || 'PRESENT', // default to PRESENT if not marked yet
          isMarked: attendanceMap.has(sIdStr),
        };
      });

      return ApiResponse.success(
        res,
        {
          date: targetDate,
          students: list,
          totalStudents: list.length,
          presentCount: list.filter((item) => item.status === 'PRESENT').length,
          absentCount: list.filter((item) => item.status === 'ABSENT').length,
        },
        'Attendance data retrieved'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Save or update attendance records for a batch/class on a date
   */
  static async saveAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const { classGrade, batchId, date, records } = req.body;
      if (!date || !Array.isArray(records)) {
        return ApiResponse.error(res, 'Date and records array are required', 400);
      }

      const userId = new mongoose.Types.ObjectId(req.user.userId);
      const targetDate = date as string;

      // Upsert attendance for each student
      const bulkOps = records.map((r: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }) => ({
        updateOne: {
          filter: { studentId: new mongoose.Types.ObjectId(r.studentId), date: targetDate },
          update: {
            $set: {
              batchId: batchId ? new mongoose.Types.ObjectId(batchId) : undefined,
              classGrade: classGrade || 'Class 10th',
              status: r.status,
              markedBy: userId,
              remarks: r.remarks || '',
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await Attendance.bulkWrite(bulkOps);
      }

      // Recalculate each student's overall attendancePercentage on the Student model
      for (const r of records) {
        const total = await Attendance.countDocuments({ studentId: r.studentId });
        const present = await Attendance.countDocuments({ studentId: r.studentId, status: 'PRESENT' });
        const pct = total > 0 ? Math.round((present / total) * 100) : 100;
        await Student.findByIdAndUpdate(r.studentId, { attendancePercentage: pct });
      }

      return ApiResponse.success(res, { count: records.length, date: targetDate }, 'Attendance saved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- NEEDS ATTENTION MODULE ---
  static async getNeedsAttention(req: AuthenticatedRequest, res: Response) {
    try {
      const { classGrade } = req.query;
      const query: any = {};

      if (classGrade && classGrade !== 'ALL') {
        const gradeMatches = normalizeGradeString(classGrade as string);
        query.classGrade = { $in: gradeMatches };
      }

      const list = await NeedsAttention.find(query)
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email phone' },
        })
        .populate('addedBy', 'name email')
        .sort({ createdAt: -1 });

      const formatted = list.map((item) => {
        const s = item.studentId as any;
        const u = s?.userId;
        return {
          _id: item._id,
          id: item._id.toString(),
          studentId: s?._id,
          studentName: u?.name || s?.name || 'Unknown Student',
          enrollmentNo: s?.enrollmentNo || '',
          classGrade: item.classGrade || s?.grade || 'Class 10th',
          reason: item.reason,
          status: item.status,
          attendancePercentage: s?.attendancePercentage || 0,
          averageScore: s?.averageScore || 0,
          createdAt: item.createdAt,
        };
      });

      return ApiResponse.success(res, formatted, 'Needs Attention list retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async addNeedsAttention(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const { studentId, reason, classGrade } = req.body;
      if (!studentId || !reason) {
        return ApiResponse.error(res, 'Student ID and Reason are required', 400);
      }

      const student = await Student.findById(studentId);
      if (!student) return ApiResponse.error(res, 'Student not found', 404);

      // Check if already in active list
      let existing = await NeedsAttention.findOne({ studentId, status: 'ACTIVE' });
      if (existing) {
        existing.reason = reason;
        if (classGrade) existing.classGrade = classGrade;
        await existing.save();
      } else {
        existing = await NeedsAttention.create({
          studentId,
          classGrade: classGrade || student.grade || 'Class 10th',
          reason,
          addedBy: req.user.userId,
          status: 'ACTIVE',
        });
      }

      const populated = await NeedsAttention.findById(existing._id).populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' },
      });

      return ApiResponse.success(res, populated, 'Student added to Needs Attention list', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateNeedsAttention(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { reason, status } = req.body;

      const item = await NeedsAttention.findById(id);
      if (!item) return ApiResponse.error(res, 'Needs Attention record not found', 404);

      if (reason) item.reason = reason;
      if (status) item.status = status;

      await item.save();

      return ApiResponse.success(res, item, 'Needs Attention updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteNeedsAttention(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const item = await NeedsAttention.findByIdAndDelete(id);
      if (!item) return ApiResponse.error(res, 'Record not found', 404);

      return ApiResponse.success(res, null, 'Student removed from Needs Attention list');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- ACADEMIC TEACHER REMARKS MODULE ---
  static async getRemarks(req: AuthenticatedRequest, res: Response) {
    try {
      const { classGrade, studentId } = req.query;
      const query: any = {};

      if (classGrade && classGrade !== 'ALL') {
        const gradeMatches = normalizeGradeString(classGrade as string);
        query.classGrade = { $in: gradeMatches };
      }

      if (studentId) {
        query.studentId = studentId;
      }

      const remarks = await TeacherRemark.find(query)
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email phone' },
        })
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });

      const formatted = remarks.map((r) => {
        const s = r.studentId as any;
        const u = s?.userId;
        return {
          _id: r._id,
          id: r._id.toString(),
          studentId: s?._id,
          studentName: u?.name || s?.name || 'Unknown Student',
          classGrade: r.classGrade || s?.grade || 'Class 10th',
          remark: r.remark,
          teacherName: r.teacherName || (r.teacherId as any)?.name || 'Faculty Member',
          date: r.date || r.createdAt,
        };
      });

      return ApiResponse.success(res, formatted, 'Teacher remarks retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createRemark(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const { studentId, remark, classGrade } = req.body;
      if (!studentId || !remark) {
        return ApiResponse.error(res, 'Student ID and Remark text are required', 400);
      }

      const student = await Student.findById(studentId);
      if (!student) return ApiResponse.error(res, 'Student not found', 404);

      const teacherProfile = await Teacher.findOne({ userId: req.user.userId });
      const teacherName = teacherProfile?.name || req.user.email;

      const newRemark = await TeacherRemark.create({
        studentId,
        teacherId: req.user.userId,
        teacherName,
        classGrade: classGrade || student.grade || 'Class 10th',
        remark,
        date: new Date(),
      });

      const populated = await TeacherRemark.findById(newRemark._id).populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' },
      });

      return ApiResponse.success(res, populated, 'Academic remark saved successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateRemark(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { remark } = req.body;

      const r = await TeacherRemark.findById(id);
      if (!r) return ApiResponse.error(res, 'Remark not found', 404);

      if (remark) r.remark = remark;
      await r.save();

      return ApiResponse.success(res, r, 'Remark updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteRemark(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const r = await TeacherRemark.findByIdAndDelete(id);
      if (!r) return ApiResponse.error(res, 'Remark not found', 404);

      return ApiResponse.success(res, null, 'Remark deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // --- TIMETABLE & LECTURES MODULE ---
  static async getLectures(req: AuthenticatedRequest, res: Response) {
    try {
      const { date, classGrade } = req.query;
      const query: any = {};

      if (req.user?.role === 'TEACHER') {
        const teacherProfile = await Teacher.findOne({ userId: req.user.userId });
        const teacherIdList: any[] = [new mongoose.Types.ObjectId(req.user.userId)];
        if (teacherProfile) teacherIdList.push(teacherProfile._id);
        query.teacherId = { $in: teacherIdList };
      }

      if (date) {
        query.date = date as string;
      }

      if (classGrade && classGrade !== 'ALL') {
        const gradeMatches = normalizeGradeString(classGrade as string);
        query.classGrade = { $in: gradeMatches };
      }

      const lectures = await TimetableLecture.find(query).sort({ startTime: 1 });
      return ApiResponse.success(res, lectures, 'Timetable lectures retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createLecture(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const { title, classGrade, batchId, subject, date, startTime, endTime, notes } = req.body;

      if (!title || !classGrade || !subject || !date || !startTime || !endTime) {
        return ApiResponse.error(
          res,
          'Title, Class, Subject, Date, Start Time, and End Time are required',
          400
        );
      }

      const lecture = await TimetableLecture.create({
        title,
        classGrade,
        batchId: batchId || undefined,
        subject,
        teacherId: req.user.userId,
        date,
        startTime,
        endTime,
        notes: notes || '',
      });

      return ApiResponse.success(res, lecture, 'Lecture scheduled successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateLecture(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, classGrade, batchId, subject, date, startTime, endTime, notes } = req.body;

      const lecture = await TimetableLecture.findById(id);
      if (!lecture) return ApiResponse.error(res, 'Lecture not found', 404);

      if (title) lecture.title = title;
      if (classGrade) lecture.classGrade = classGrade;
      if (batchId) lecture.batchId = batchId;
      if (subject) lecture.subject = subject;
      if (date) lecture.date = date;
      if (startTime) lecture.startTime = startTime;
      if (endTime) lecture.endTime = endTime;
      if (notes !== undefined) lecture.notes = notes;

      await lecture.save();

      return ApiResponse.success(res, lecture, 'Lecture updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteLecture(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const lecture = await TimetableLecture.findByIdAndDelete(id);
      if (!lecture) return ApiResponse.error(res, 'Lecture not found', 404);

      return ApiResponse.success(res, null, 'Lecture deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
