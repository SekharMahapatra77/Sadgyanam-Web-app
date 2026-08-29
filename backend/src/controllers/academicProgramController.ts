import { Request, Response } from 'express';
import { AcademicProgram } from '../models/AcademicProgram';
import { ApiResponse } from '../utils/apiResponse';

export class AcademicProgramController {
  static async getPublicPrograms(req: Request, res: Response) {
    try {
      const programs = await AcademicProgram.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 });
      return ApiResponse.success(res, programs, 'Academic Programs retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getProgramBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const program = await AcademicProgram.findOne({ slug, isPublished: true });
      if (!program) return ApiResponse.error(res, 'Academic Program not found', 404);

      return ApiResponse.success(res, program, 'Academic Program details retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getAllProgramsAdmin(req: Request, res: Response) {
    try {
      const programs = await AcademicProgram.find({}).sort({ displayOrder: 1, createdAt: -1 });
      return ApiResponse.success(res, programs, 'All Academic Programs retrieved for admin');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async createProgram(req: Request, res: Response) {
    try {
      const {
        title,
        slug,
        grade = 'CLASS_10',
        category = 'Academic Board & Foundation',
        bio = '',
        content,
        highlights = [],
        image = '',
        displayOrder = 0,
        isPublished = true,
      } = req.body;

      const programSlug = slug
        ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const program = await AcademicProgram.create({
        title,
        slug: programSlug,
        grade,
        category,
        bio,
        content: content || bio || 'Comprehensive Academic Program designed for excellence.',
        highlights: Array.isArray(highlights) ? highlights : typeof highlights === 'string' ? highlights.split(',').map((h) => h.trim()) : [],
        image,
        displayOrder: Number(displayOrder) || 0,
        isPublished: Boolean(isPublished),
      });

      return ApiResponse.success(res, program, 'Academic Program created successfully', 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async updateProgram(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (typeof updateData.highlights === 'string') {
        updateData.highlights = updateData.highlights.split(',').map((h: string) => h.trim());
      }
      if (updateData.displayOrder) {
        updateData.displayOrder = Number(updateData.displayOrder);
      }

      const program = await AcademicProgram.findByIdAndUpdate(id, updateData, { new: true });
      if (!program) return ApiResponse.error(res, 'Academic Program not found', 404);

      return ApiResponse.success(res, program, 'Academic Program updated successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async deleteProgram(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const program = await AcademicProgram.findByIdAndDelete(id);
      if (!program) return ApiResponse.error(res, 'Academic Program not found', 404);

      return ApiResponse.success(res, null, 'Academic Program deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
