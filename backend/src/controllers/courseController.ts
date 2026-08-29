import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { Subject } from '../models/Subject';
import { Chapter } from '../models/Chapter';
import { ApiResponse } from '../utils/apiResponse';

const gradeLabels: Record<string, string> = {
  CLASS_6: 'Class 6th',
  CLASS_7: 'Class 7th',
  CLASS_8: 'Class 8th',
  CLASS_9: 'Class 9th',
  CLASS_10: 'Class 10th',
};

const categoryLabels: Record<string, string> = {
  ACADEMIC_BOARDS: 'CBSE / ICSE Board',
  FOUNDATION_JEE_NEET: 'Foundation JEE/NEET',
  OLYMPIADS_NTSE: 'Olympiad & NTSE',
};

export class CourseController {
  static async getPublicCourses(req: Request, res: Response) {
    try {
      const { grade, category } = req.query;
      const query: any = { isPublished: true };
      if (grade) query.grade = grade;
      if (category) query.category = category;

      const courses = await Course.find(query).sort({ createdAt: -1 });

      const normalized = courses.map((c) => {
        const doc = c.toObject();
        return {
          ...doc,
          targetClass: gradeLabels[doc.grade] || doc.grade || 'Class 10th',
          boardType: categoryLabels[doc.category] || doc.category || 'CBSE / ICSE',
          fee: doc.price,
          duration: `${doc.durationMonths || 12} Months`,
          features: Array.isArray(doc.features) ? doc.features : [],
          subjects: Array.isArray(doc.subjects) ? doc.subjects : [],
        };
      });

      return ApiResponse.success(res, normalized, 'Courses retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug });
      if (!course) return ApiResponse.error(res, 'Course not found', 404);

      const subjects = await Subject.find({ courseId: course._id });
      const subjectIds = subjects.map((s) => s._id);
      const chapters = await Chapter.find({ subjectId: { $in: subjectIds } });

      const doc = course.toObject();
      const normalized = {
        ...doc,
        targetClass: gradeLabels[doc.grade] || doc.grade || 'Class 10th',
        boardType: categoryLabels[doc.category] || doc.category || 'CBSE / ICSE',
        fee: doc.price,
        duration: `${doc.durationMonths || 12} Months`,
        features: Array.isArray(doc.features) && doc.features.length > 0 ? doc.features : [
          'Daily Interactive Concept & Problem Solving Classes',
          '24/7 AI Doubt Resolution & Chapter Practice',
          'Previous 10-Year Board Paper Analysis',
          'Bi-Weekly CBT Pattern Mock Tests',
        ],
        subjects: Array.isArray(doc.subjects) && doc.subjects.length > 0 ? doc.subjects : subjects.map((s) => s.name).length > 0 ? subjects.map((s) => s.name) : ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
        chaptersList: chapters,
      };

      return ApiResponse.success(res, normalized, 'Course details retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createCourse(req: Request, res: Response) {
    try {
      const {
        title,
        slug,
        shortBio,
        grade = 'CLASS_10',
        category = 'ACADEMIC_BOARDS',
        description,
        price,
        discountedPrice,
        durationMonths = 12,
        features = [],
        subjects = [],
        thumbnail = '',
        pdfUrl = '',
        isPublished = true,
      } = req.body;

      const courseSlug = slug
        ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const course = await Course.create({
        title,
        slug: courseSlug,
        shortBio: shortBio || '',
        grade,
        category,
        description,
        price: Number(price) || 0,
        discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
        durationMonths: Number(durationMonths) || 12,
        features: Array.isArray(features) ? features : typeof features === 'string' ? features.split(',').map((s) => s.trim()) : [],
        subjects: Array.isArray(subjects) ? subjects : typeof subjects === 'string' ? subjects.split(',').map((s) => s.trim()) : [],
        thumbnail,
        pdfUrl,
        isPublished: Boolean(isPublished),
      });

      return ApiResponse.success(res, course, 'Course created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.price) updateData.price = Number(updateData.price);
      if (updateData.durationMonths) updateData.durationMonths = Number(updateData.durationMonths);
      if (typeof updateData.features === 'string') {
        updateData.features = updateData.features.split(',').map((s: string) => s.trim());
      }
      if (typeof updateData.subjects === 'string') {
        updateData.subjects = updateData.subjects.split(',').map((s: string) => s.trim());
      }

      const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
      if (!course) return ApiResponse.error(res, 'Course not found', 404);

      return ApiResponse.success(res, course, 'Course updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);
      if (!course) return ApiResponse.error(res, 'Course not found', 404);

      return ApiResponse.success(res, null, 'Course deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async togglePublishCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return ApiResponse.error(res, 'Course not found', 404);

      course.isPublished = !course.isPublished;
      await course.save();

      return ApiResponse.success(res, course, `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
