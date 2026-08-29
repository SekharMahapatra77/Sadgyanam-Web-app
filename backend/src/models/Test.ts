import mongoose, { Schema, Document } from 'mongoose';

export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export interface ITest extends Document {
  title: string;
  description?: string;
  courseId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  subjectName?: string;
  category?: string;
  grade: 'CLASS_6' | 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10';
  batchIds: mongoose.Types.ObjectId[];
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  questionIds: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  testDate?: Date;
  pdfUrl?: string;
  testUrl?: string;
  status: TestStatus;
  isScholarshipTest: boolean;
  isFreeMockTest: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const TestSchema = new Schema<ITest>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    subjectName: { type: String, default: '' },
    category: { type: String, default: 'Mock Test' },
    grade: {
      type: String,
      enum: ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'],
      required: true,
    },
    batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    durationMinutes: { type: Number, required: true, default: 60 },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 40 },
    negativeMarking: { type: Boolean, default: true },
    questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    testDate: { type: Date, default: Date.now },
    pdfUrl: { type: String, default: '' },
    testUrl: { type: String, default: '' },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'], default: 'PUBLISHED' },
    isScholarshipTest: { type: Boolean, default: false },
    isFreeMockTest: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Test = mongoose.model<ITest>('Test', TestSchema);
