import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  grade: 'CLASS_6' | 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10';
  courseId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  timing: string;
  mode: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  maxSeats: number;
  enrolledCount: number;
  teacherIds: mongoose.Types.ObjectId[];
  branchId?: mongoose.Types.ObjectId;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true, trim: true },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'],
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    timing: { type: String, required: true },
    mode: { type: String, enum: ['OFFLINE', 'ONLINE', 'HYBRID'], default: 'HYBRID' },
    maxSeats: { type: Number, default: 40 },
    enrolledCount: { type: Number, default: 0 },
    teacherIds: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
  },
  { timestamps: true }
);

export const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
