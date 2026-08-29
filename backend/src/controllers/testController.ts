import { Request, Response } from 'express';
import { Test } from '../models/Test';
import { Question } from '../models/Question';
import { TestAttempt } from '../models/TestAttempt';
import { Student } from '../models/Student';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class TestController {
  static async getPublicFreeTests(req: Request, res: Response) {
    try {
      const tests = await Test.find({ isFreeMockTest: true, status: 'PUBLISHED' }).select('-questionIds');
      return ApiResponse.success(res, tests, 'Free mock tests retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getPublicScholarshipTests(req: Request, res: Response) {
    try {
      const tests = await Test.find({ isScholarshipTest: true, status: 'PUBLISHED' }).select('-questionIds');
      return ApiResponse.success(res, tests, 'Scholarship tests retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async startTest(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const test = await Test.findById(id);
      if (!test) return ApiResponse.error(res, 'Test not found', 404);

      if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);
      const student = await Student.findOne({ userId: req.user.userId });
      if (!student) return ApiResponse.error(res, 'Student profile not found', 404);

      // Fetch questions without exposing correctAnswers or explanations
      const questions = await Question.find({ _id: { $in: test.questionIds } }).select(
        '-correctAnswers -explanation'
      );

      const attempt = await TestAttempt.create({
        testId: test._id,
        studentId: student._id,
        startedAt: new Date(),
        totalMarks: test.totalMarks,
      });

      return ApiResponse.success(
        res,
        {
          attemptId: attempt._id,
          test: {
            id: test._id,
            title: test.title,
            durationMinutes: test.durationMinutes,
            totalMarks: test.totalMarks,
            questions,
          },
        },
        'Test started successfully'
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async submitTest(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { attemptId, answers } = req.body; // answers = [{ questionId, selectedOptions, numericalValue, timeSpentSeconds }]

      const test = await Test.findById(id);
      if (!test) return ApiResponse.error(res, 'Test not found', 404);

      const attempt = await TestAttempt.findById(attemptId);
      if (!attempt) return ApiResponse.error(res, 'Test attempt not found', 404);

      // Secure Backend Scoring Engine
      const questions = await Question.find({ _id: { $in: test.questionIds } });
      const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

      let earnedScore = 0;
      let correctCount = 0;
      let wrongCount = 0;

      const processedAnswers = answers.map((ans: any) => {
        const question = questionMap.get(ans.questionId);
        if (!question) return ans;

        let isCorrect = false;
        if (question.questionType === 'SINGLE_CHOICE' || question.questionType === 'TRUE_FALSE') {
          isCorrect =
            ans.selectedOptions &&
            ans.selectedOptions.length === 1 &&
            question.correctAnswers.includes(ans.selectedOptions[0]);
        } else if (question.questionType === 'MULTIPLE_CHOICE') {
          isCorrect =
            ans.selectedOptions &&
            ans.selectedOptions.length === question.correctAnswers.length &&
            ans.selectedOptions.every((opt: string) => question.correctAnswers.includes(opt));
        } else if (question.questionType === 'NUMERICAL') {
          isCorrect = ans.numericalValue && question.correctAnswers.includes(ans.numericalValue.trim());
        }

        if (isCorrect) {
          earnedScore += question.marks;
          correctCount++;
        } else if (ans.selectedOptions?.length > 0 || ans.numericalValue) {
          if (test.negativeMarking) {
            earnedScore -= question.negativeMarks;
          }
          wrongCount++;
        }

        return {
          ...ans,
          status: ans.selectedOptions?.length > 0 || ans.numericalValue ? 'ANSWERED' : 'UNANSWERED',
        };
      });

      attempt.answers = processedAnswers;
      attempt.score = Math.max(0, earnedScore);
      attempt.submittedAt = new Date();
      attempt.accuracyPercentage =
        correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
      attempt.percentage = Math.round((attempt.score / test.totalMarks) * 100);
      attempt.isEvaluated = true;
      attempt.rank = Math.floor(Math.random() * 15) + 1; // Demo rank evaluation
      attempt.percentile = 90 + Math.floor(Math.random() * 9);
      await attempt.save();

      return ApiResponse.success(res, attempt, 'Test evaluated and submitted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  static async getAttemptResult(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const attempt = await TestAttempt.findById(id).populate({
        path: 'testId',
        select: 'title durationMinutes totalMarks passingMarks',
      });
      if (!attempt) return ApiResponse.error(res, 'Attempt not found', 404);

      return ApiResponse.success(res, attempt, 'Test attempt result retrieved');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}
