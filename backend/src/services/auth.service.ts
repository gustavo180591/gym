import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpException } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// Define User type without the password
type UserWithoutPassword = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
};

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<UserWithoutPassword> {
    const { email, password, name, role = 'STUDENT' } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(400, 'User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async login(input: LoginInput): Promise<TokenResponse> {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || '', { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' 
    });

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || ''
      ) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== token) {
        throw new HttpException(401, 'Invalid refresh token');
      }

      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET || '', { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
      });

      return { accessToken };
    } catch (error) {
      throw new HttpException(401, 'Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
} 