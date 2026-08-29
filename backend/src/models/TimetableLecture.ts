import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetableLecture extends Document {
  title: string;
  classGrade: string;
  batchId?: mongoose.Types.ObjectId;
  subject: string;
  teacherId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format string
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableLectureSchema = new Schema<ITimetableLecture>(
  {
    title: { type: String, required: true, trim: true },
    classGrade: { type: String, required: true, trim: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
    subject: { type: String, required: true, trim: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const TimetableLecture = mongoose.model<ITimetableLecture>('TimetableLecture', TimetableLectureSchema);
