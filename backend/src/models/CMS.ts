import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: 'STUDENT' | 'PARENT';
  grade?: string;
  exam?: string;
  year?: string;
  review: string;
  avatar?: string;
  isPublished: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'PARENT'], default: 'STUDENT' },
    grade: { type: String, default: 'Class 10th CBSE' },
    exam: { type: String, default: '98% Board Score & NTSE Scholar' },
    year: { type: String, default: '2025-26 Batch' },
    review: { type: String, required: true },
    avatar: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  publishedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: { type: String, default: 'Exam Strategy' },
    tags: [{ type: String }],
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'SADGYANAM Faculty' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
