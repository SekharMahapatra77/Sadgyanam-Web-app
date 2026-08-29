import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryPaymentRecord {
  _id?: mongoose.Types.ObjectId;
  month: string;
  paidDate: Date;
  paidAmount: number;
  notes?: string;
}

export interface ITeacher extends Document {
  userId?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  qualification: string;
  teachingSubject?: string;
  monthlySalary: number;
  salaryPaymentHistory: ISalaryPaymentRecord[];
  experienceYears?: number;
  subjectsAssigned: mongoose.Types.ObjectId[];
  classesAssigned: string[];
  bio?: string;
  rating: number;
}

const SalaryPaymentRecordSchema = new Schema<ISalaryPaymentRecord>({
  month: { type: String, required: true },
  paidDate: { type: Date, required: true, default: Date.now },
  paidAmount: { type: Number, required: true, min: 0 },
  notes: { type: String, default: '' },
});

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    qualification: { type: String, required: true },
    teachingSubject: { type: String, default: 'General Educator' },
    monthlySalary: { type: Number, default: 0, min: 0 },
    salaryPaymentHistory: [SalaryPaymentRecordSchema],
    experienceYears: { type: Number, default: 0 },
    subjectsAssigned: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    classesAssigned: [{ type: String }],
    bio: { type: String, default: '' },
    rating: { type: Number, default: 4.9 },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
