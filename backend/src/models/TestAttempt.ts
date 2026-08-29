import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedOptions: string[];
  numericalValue?: string;
  timeSpentSeconds: number;
  isMarkedForReview: boolean;
  status: 'ANSWERED' | 'UNANSWERED' | 'MARKED_FOR_REVIEW';
}

export interface ITestAttempt extends Document {
  testId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: IStudentAnswer[];
  startedAt: Date;
  submittedAt?: Date;
  score: number;
  totalMarks: number;
  accuracyPercentage: number;
  percentage: number;
  rank?: number;
  percentile?: number;
  isEvaluated: boolean;
}

const TestAttemptSchema = new Schema<ITestAttempt>(
  {
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedOptions: [{ type: String }],
        numericalValue: { type: String, default: '' },
        timeSpentSeconds: { type: Number, default: 0 },
        isMarkedForReview: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ['ANSWERED', 'UNANSWERED', 'MARKED_FOR_REVIEW'],
          default: 'UNANSWERED',
        },
      },
    ],
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    accuracyPercentage: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    rank: { type: Number },
    percentile: { type: Number },
    isEvaluated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TestAttempt = mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
