import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Lead } from '../models/Lead';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { ApiResponse } from '../utils/apiResponse';

export class LeadController {
  static async submitLead(req: Request, res: Response) {
    try {
      const {
        name,
        phone,
        email,
        grade = 'Class 10th',
        targetExam,
        city,
        source,
        inquiryType = 'ADMISSION',
        notes,
      } = req.body;

      if (!name || !phone) {
        return ApiResponse.error(res, 'Name and phone number are required', 400);
      }

      // Automatically map source if not explicitly provided
      let leadSource = source;
      if (!leadSource) {
        if (inquiryType === 'DEMO') leadSource = 'DEMO_BOOKING';
        else if (inquiryType === 'SCHOLARSHIP') leadSource = 'SCHOLARSHIP_TEST';
        else leadSource = 'WEBSITE_FORM';
      }

      const lead = await Lead.create({
        name,
        phone,
        email,
        grade,
        targetExam,
        city,
        source: leadSource,
        inquiryType,
        notes,
        status: 'NEW',
      });

      return ApiResponse.success(res, lead, 'Thank you! Our academic counselor will contact you shortly.', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getLeads(req: Request, res: Response) {
    try {
      const { status, grade, source, inquiryType } = req.query;
      const query: any = {};
      if (status) query.status = status;
      if (grade) query.grade = grade;
      if (source) query.source = source;
      if (inquiryType) query.inquiryType = inquiryType;

      const leads = await Lead.find(query).sort({ createdAt: -1 });
      return ApiResponse.success(res, leads, 'Leads retrieved successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes, followUpDate } = req.body;

      const existingLead = await Lead.findById(id);
      if (!existingLead) return ApiResponse.error(res, 'Lead not found', 404);

      let isConvertedToStudent = existingLead.isConvertedToStudent || false;

      // Auto-convert applicant to active student upon APPROVE or ADMITTED
      if ((status === 'APPROVED' || status === 'ADMITTED') && !isConvertedToStudent) {
        const studentEmail = existingLead.email && existingLead.email.trim() !== ''
          ? existingLead.email
          : `student-${existingLead.phone.slice(-6)}@sadgyanam.edu.in`;

        let user = await User.findOne({ $or: [{ email: studentEmail }, { phone: existingLead.phone }] });
        if (!user) {
          const passwordHash = await bcrypt.hash('Student@123', 10);
          user = await User.create({
            name: existingLead.name,
            email: studentEmail,
            phone: existingLead.phone,
            passwordHash,
            role: 'STUDENT',
          });
        }

        const existingStudent = await Student.findOne({
          $or: [{ userId: user._id }, { enrollmentNo: `ADMISSION-${existingLead._id}` }],
        });
        if (!existingStudent) {
          await Student.create({
            userId: user._id,
            enrollmentNo: `ADMISSION-${existingLead._id}`,
            grade: existingLead.grade || 'Class 10th',
            board: 'CBSE',
            targetExam: 'BOARD_EXAMS',
          });
        }

        isConvertedToStudent = true;
      }

      const updateData: any = { status, isConvertedToStudent };
      if (notes !== undefined) updateData.notes = notes;
      if (followUpDate !== undefined) updateData.followUpDate = followUpDate;
      const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });

      return ApiResponse.success(res, lead, `Lead status successfully updated to ${status}`);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
