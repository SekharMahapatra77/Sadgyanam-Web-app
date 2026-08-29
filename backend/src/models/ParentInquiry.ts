import mongoose, { Schema, Document } from 'mongoose';

export type ParentInquiryStatus = 'NEW' | 'CONTACTED' | 'RESOLVED';

export interface IParentInquiry extends Document {
  parentId?: mongoose.Types.ObjectId;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
  studentId?: mongoose.Types.ObjectId;
  studentName: string;
  studentGrade: string;
  message: string;
  status: ParentInquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ParentInquirySchema = new Schema<IParentInquiry>(
  {
    parentId: { type: Schema.Types.ObjectId, ref: 'Parent' },
    parentName: { type: String, required: true, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true, default: '' },
    parentPhone: { type: String, trim: true, default: '' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, required: true, trim: true },
    studentGrade: { type: String, required: true, default: 'Class 10th' },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'RESOLVED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);

export const ParentInquiry = mongoose.model<IParentInquiry>('ParentInquiry', ParentInquirySchema);
