import mongoose, { Schema, Document } from 'mongoose';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  batchId?: mongoose.Types.ObjectId;
  classGrade: string;
  date: string; // YYYY-MM-DD format string for clean date matching
  status: AttendanceStatus;
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
    classGrade: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      default: 'PRESENT',
      required: true,
    },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate records for a student on a specific date
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
