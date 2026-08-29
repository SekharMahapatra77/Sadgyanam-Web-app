import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'NUMERICAL' | 'TRUE_FALSE';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface IQuestionOption {
  optionId: string;
  text: string;
  image?: string;
}

export interface IQuestion extends Document {
  subjectId: mongoose.Types.ObjectId;
  chapterId?: mongoose.Types.ObjectId;
  topic?: string;
  questionText: string;
  questionImage?: string;
  questionType: QuestionType;
  options: IQuestionOption[];
  correctAnswers: string[]; // optionIds or string number for NUMERICAL
  explanation: string;
  marks: number;
  negativeMarks: number;
  difficulty: QuestionDifficulty;
  isDraft: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    topic: { type: String, default: '' },
    questionText: { type: String, required: true },
    questionImage: { type: String, default: '' },
    questionType: {
      type: String,
      enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'NUMERICAL', 'TRUE_FALSE'],
      default: 'SINGLE_CHOICE',
    },
    options: [
      {
        optionId: { type: String, required: true },
        text: { type: String, required: true },
        image: { type: String, default: '' },
      },
    ],
    correctAnswers: [{ type: String, required: true }],
    explanation: { type: String, default: '' },
    marks: { type: Number, default: 4 },
    negativeMarks: { type: Number, default: 1 },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' },
    isDraft: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
