import mongoose, { Schema, Document } from 'mongoose';

export type MaterialType =
  | 'NOTES'
  | 'PREVIOUS_YEAR_PAPER'
  | 'PRACTICE_PAPER'
  | 'FORMULA_SHEET'
  | 'IMPORTANT_QUESTIONS'
  | 'IMAGE';

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  grade: string;
  courseId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  subjectName?: string;
  chapterId?: mongoose.Types.ObjectId;
  fileUrl: string;
  fileType: MaterialType;
  isFree: boolean;
  isPublished: boolean;
  downloadCount: number;
  uploadedBy?: mongoose.Types.ObjectId;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'],
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    subjectName: { type: String, default: 'General Science / Mathematics' },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    fileUrl: { type: String, required: true },
    fileType: {
      type: String,
      enum: ['NOTES', 'PREVIOUS_YEAR_PAPER', 'PRACTICE_PAPER', 'FORMULA_SHEET', 'IMPORTANT_QUESTIONS', 'IMAGE'],
      default: 'NOTES',
    },
    isFree: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
