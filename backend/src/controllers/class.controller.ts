import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpException } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class ClassController {
  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, type, date, capacity, teacherId } = req.body;

      if (!name || !type || !date || !capacity || !teacherId) {
        throw new HttpException(400, 'Missing required fields');
      }

      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher || teacher.role !== 'TEACHER') {
        throw new HttpException(400, 'Invalid teacher ID');
      }

      const newClass = await prisma.class.create({
        data: {
          name,
          type,
          date: new Date(date),
          capacity,
          teacherId,
        },
      });

      return res.status(201).json({
        status: 'success',
        data: { class: newClass },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await prisma.class.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { classes },
      });
    } catch (error) {
      next(error);
    }
  }

  async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reservations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!classItem) {
        throw new HttpException(404, 'Class not found');
      }

      return res.status(200).json({
        status: 'success',
        data: { class: classItem },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, type, date, capacity, teacherId } = req.body;

      const classExists = await prisma.class.findUnique({
        where: { id },
      });

      if (!classExists) {
        throw new HttpException(404, 'Class not found');
      }

      if (teacherId) {
        const teacher = await prisma.user.findUnique({
          where: { id: teacherId },
        });

        if (!teacher || teacher.role !== 'TEACHER') {
          throw new HttpException(400, 'Invalid teacher ID');
        }
      }

      const updatedClass = await prisma.class.update({
        where: { id },
        data: {
          name,
          type,
          date: date ? new Date(date) : undefined,
          capacity,
          teacherId,
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { class: updatedClass },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const classExists = await prisma.class.findUnique({
        where: { id },
      });

      if (!classExists) {
        throw new HttpException(404, 'Class not found');
      }

      // Delete related reservations first
      await prisma.reservation.deleteMany({
        where: { classId: id },
      });

      // Delete the class
      await prisma.class.delete({
        where: { id },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Class deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async reserveClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(401, 'Unauthorized');
      }

      if (!classId) {
        throw new HttpException(400, 'Class ID is required');
      }

      // Check if class exists and has available capacity
      const classItem = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          reservations: true,
        },
      });

      if (!classItem) {
        throw new HttpException(404, 'Class not found');
      }

      if (classItem.reservations.length >= classItem.capacity) {
        throw new HttpException(400, 'Class is fully booked');
      }

      // Check if user already has a reservation
      const existingReservation = await prisma.reservation.findUnique({
        where: {
          userId_classId: {
            userId,
            classId,
          },
        },
      });

      if (existingReservation) {
        throw new HttpException(400, 'You already have a reservation for this class');
      }

      // Create reservation
      const reservation = await prisma.reservation.create({
        data: {
          userId,
          classId,
        },
      });

      return res.status(201).json({
        status: 'success',
        data: { reservation },
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { reservationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(401, 'Unauthorized');
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new HttpException(404, 'Reservation not found');
      }

      // Check if the reservation belongs to the user or if user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (reservation.userId !== userId && user?.role !== 'ADMIN') {
        throw new HttpException(403, 'You are not authorized to cancel this reservation');
      }

      // Delete reservation
      await prisma.reservation.delete({
        where: { id: reservationId },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Reservation cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
} 