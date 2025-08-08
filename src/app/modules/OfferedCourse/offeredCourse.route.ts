import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { createOfferedCourseZodSchema } from './offeredCourse.validation';

const router = express.Router();

router.get('/', OfferedCourseController.getAllOfferedCourses);
router.post(
  '/create-offered-course',
  validateRequest(createOfferedCourseZodSchema),
  OfferedCourseController.createOfferedCourse
);

export const OfferedCourseRoutes = router;
