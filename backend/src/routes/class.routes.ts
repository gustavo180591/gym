import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const classController = new ClassController();

// Public routes
router.get('/', (req, res, next) => classController.getAllClasses(req, res, next));
router.get('/:id', (req, res, next) => classController.getClassById(req, res, next));

// Protected routes - only authenticated users
router.post('/reserve', authenticate, (req, res, next) => classController.reserveClass(req, res, next));
router.delete('/reservation/:reservationId', authenticate, (req, res, next) => 
  classController.cancelReservation(req, res, next)
);

// Admin and Teacher only routes
router.post(
  '/', 
  authenticate, 
  authorize('ADMIN', 'TEACHER'), 
  (req, res, next) => classController.createClass(req, res, next)
);

router.put(
  '/:id', 
  authenticate, 
  authorize('ADMIN', 'TEACHER'), 
  (req, res, next) => classController.updateClass(req, res, next)
);

router.delete(
  '/:id', 
  authenticate, 
  authorize('ADMIN'), 
  (req, res, next) => classController.deleteClass(req, res, next)
);

export default router; 