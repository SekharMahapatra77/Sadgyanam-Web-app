import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import { Student } from '../models/Student';
import { Parent } from '../models/Parent';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password, role = 'STUDENT', grade = 'CLASS_10', board = 'CBSE' } = req.body;

      if (!name || !email || !phone || !password) {
        return ApiResponse.error(res, 'Name, email, phone, and password are required', 400);
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ApiResponse.error(res, 'Email address is already registered', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: role as UserRole,
      });

      if (user.role === 'STUDENT') {
        const count = await Student.countDocuments();
        const enrollmentNo = `SADG-2026-${String(count + 1).padStart(4, '0')}`;
        await Student.create({
          userId: user._id,
          enrollmentNo,
          grade,
          board,
        });
      } else if (user.role === 'PARENT') {
        await Parent.create({
          userId: user._id,
          children: [],
        });
      }

      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return ApiResponse.success(
        res,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          ...tokens,
        },
        'Registration successful',
        201
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.error(res, 'Email and password are required', 400);
      }

      const user = await User.findOne({ email });
      if (!user) {
        return ApiResponse.error(res, 'Invalid credentials', 401);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return ApiResponse.error(res, 'Invalid credentials', 401);
      }

      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return ApiResponse.success(res, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        ...tokens,
      }, 'Login successful');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token required', 400);
      }

      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return ApiResponse.error(res, 'Invalid refresh token', 401);
      }

      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return ApiResponse.success(res, tokens, 'Token refreshed successfully');
    } catch (error: any) {
      return ApiResponse.error(res, 'Invalid refresh token', 401);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);

      const user = await User.findById(req.user.userId).select('-passwordHash -refreshToken');
      if (!user) return ApiResponse.error(res, 'User not found', 404);

      let profileData: any = {};
      if (user.role === 'STUDENT') {
        profileData = await Student.findOne({ userId: user._id }).populate('batchId');
      } else if (user.role === 'PARENT') {
        profileData = await Parent.findOne({ userId: user._id }).populate({
          path: 'children',
          populate: { path: 'userId', select: 'name email phone' },
        });
      }

      return ApiResponse.success(res, { user, profile: profileData }, 'Profile fetched');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
