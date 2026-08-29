import mongoose, { Schema, Document } from 'mongoose';

export type StudentGrade = string;

export interface IStudent extends Document {
  userId?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  enrollmentNo: string;
  grade: string;
  board: 'CBSE' | 'ICSE' | 'STATE_BOARD';
  targetExam: 'BOARD_EXAMS' | 'FOUNDATION_JEE_NEET' | 'OLYMPIAD_NTSE' | 'ALL_ROUND';
  batchId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  address?: string;
  schoolName?: string;
  dob?: Date;
  attendancePercentage: number;
  averageScore: number;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    enrollmentNo: { type: String, required: true, unique: true },
    grade: {
      type: String,
      required: true,
      default: 'Class 10th',
    },
    board: {
      type: String,
      enum: ['CBSE', 'ICSE', 'STATE_BOARD'],
      default: 'CBSE',
    },
    targetExam: {
      type: String,
      enum: ['BOARD_EXAMS', 'FOUNDATION_JEE_NEET', 'OLYMPIAD_NTSE', 'ALL_ROUND'],
      default: 'BOARD_EXAMS',
    },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Parent' },
    address: { type: String, default: '' },
    schoolName: { type: String, default: '' },
    dob: { type: Date },
    attendancePercentage: { type: Number, default: 100 },
    averageScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
