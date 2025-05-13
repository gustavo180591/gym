import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpException } from '../middleware/error.middleware';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        throw new HttpException(400, 'Email, password, and name are required');
      }

      const user = await authService.register({ email, password, name, role });

      return res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpException(400, 'Email and password are required');
      }

      const { accessToken, refreshToken, user } = await authService.login({
        email,
        password,
      });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth/refresh',
      });

      return res.status(200).json({
        status: 'success',
        data: { accessToken, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new HttpException(400, 'Refresh token is required');
      }

      const { accessToken } = await authService.refresh(refreshToken);

      return res.status(200).json({
        status: 'success',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(401, 'Unauthorized');
      }

      await authService.logout(userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        path: '/api/auth/refresh',
      });

      return res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
} 