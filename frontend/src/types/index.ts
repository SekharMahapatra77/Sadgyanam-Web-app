export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  grade: 'CLASS_6' | 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10';
  category: string;
  description: string;
  durationMonths: number;
  price: number;
  discountedPrice?: number;
  thumbnail?: string;
  features: string[];
}

export interface Test {
  _id: string;
  title: string;
  description?: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  questions?: Question[];
  isScholarshipTest: boolean;
  isFreeMockTest: boolean;
}

export interface Question {
  _id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'NUMERICAL' | 'TRUE_FALSE';
  options: { optionId: string; text: string }[];
  marks: number;
  negativeMarks: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface TestAttempt {
  _id: string;
  testId: string | Test;
  studentId: string;
  score: number;
  totalMarks: number;
  accuracyPercentage: number;
  percentage: number;
  rank?: number;
  percentile?: number;
  submittedAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  grade: string;
  source: string;
  status: string;
  createdAt: string;
}
