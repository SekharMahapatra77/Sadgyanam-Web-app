import mongoose, { Schema, Document } from 'mongoose';

export type ResultCategory =
  | 'STUDENT_RESULTS'
  | 'HIGHEST_BOARD_SCORE'
  | 'STUDENTS_ABOVE_95'
  | 'PERFECT_MATHS_SCORES'
  | 'OLYMPIAD_RANKS';

export interface IResult extends Document {
  category: ResultCategory;
  studentName: string;
  class: string;
  photo?: string;
  percentage?: string;
  marks?: string;
  cityRank?: string;
  boardScore?: string;
  subjectScore?: string;
  mathsScore?: string;
  olympiadName?: string;
  olympiadRank?: string;
  school?: string;
  testimonial?: string;
  badge?: string;
  label?: string;
  value?: string;
  isPublished: boolean;
}

const ResultSchema = new Schema<IResult>(
  {
    category: { type: String, enum: ['STUDENT_RESULTS', 'HIGHEST_BOARD_SCORE', 'STUDENTS_ABOVE_95', 'PERFECT_MATHS_SCORES', 'OLYMPIAD_RANKS'], required: true },
    studentName: { type: String, required: true, trim: true },
    class: { type: String, required: true },
    photo: { type: String, default: '' },
    percentage: { type: String, default: '' },
    marks: { type: String, default: '' },
    cityRank: { type: String, default: '' },
    boardScore: { type: String, default: '' },
    subjectScore: { type: String, default: '' },
    mathsScore: { type: String, default: '' },
    olympiadName: { type: String, default: '' },
    olympiadRank: { type: String, default: '' },
    school: { type: String, default: '' },
    testimonial: { type: String, default: '' },
    badge: { type: String, default: '' },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Result = mongoose.model<IResult>('Result', ResultSchema);
