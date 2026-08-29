import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicProgram extends Document {
  title: string;
  slug: string;
  grade: string;
  category: string;
  bio?: string;
  content: string;
  highlights: string[];
  image?: string;
  displayOrder: number;
  isPublished: boolean;
}

const AcademicProgramSchema = new Schema<IAcademicProgram>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'],
      required: true,
      default: 'CLASS_10',
    },
    category: { type: String, default: 'Academic Board & Foundation' },
    bio: { type: String, default: '' },
    content: { type: String, required: true },
    highlights: [{ type: String, default: [] }],
    image: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AcademicProgram = mongoose.model<IAcademicProgram>('AcademicProgram', AcademicProgramSchema);
