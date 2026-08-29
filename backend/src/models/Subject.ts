import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  grade: 'CLASS_6' | 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10';
  courseId?: mongoose.Types.ObjectId;
  icon?: string;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'],
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    icon: { type: String, default: 'book' },
  },
  { timestamps: true }
);

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
