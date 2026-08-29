import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherRemark extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  teacherName?: string;
  classGrade: string;
  remark: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherRemarkSchema = new Schema<ITeacherRemark>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherName: { type: String, trim: true },
    classGrade: { type: String, required: true, trim: true },
    remark: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TeacherRemark = mongoose.model<ITeacherRemark>('TeacherRemark', TeacherRemarkSchema);
