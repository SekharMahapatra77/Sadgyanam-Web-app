import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortBio?: string;
  grade: 'CLASS_6' | 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10';
  category: 'ACADEMIC_BOARDS' | 'FOUNDATION_JEE_NEET' | 'OLYMPIADS_NTSE';
  description: string;
  durationMonths: number;
  price: number;
  discountedPrice?: number;
  thumbnail: string;
  pdfUrl?: string;
  isPublished: boolean;
  features: string[];
  subjects: string[];
  assignedTeachers: mongoose.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortBio: { type: String, default: '' },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'],
      required: true,
    },
    category: {
      type: String,
      enum: ['ACADEMIC_BOARDS', 'FOUNDATION_JEE_NEET', 'OLYMPIADS_NTSE'],
      default: 'ACADEMIC_BOARDS',
    },
    description: { type: String, required: true },
    durationMonths: { type: Number, required: true, default: 12 },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    thumbnail: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    features: [{ type: String, default: [] }],
    subjects: [{ type: String, default: [] }],
    assignedTeachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
