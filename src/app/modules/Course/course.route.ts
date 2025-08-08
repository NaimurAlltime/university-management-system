import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { assignFacultiesZodSchema, createCourseZodSchema } from './course.validation';

const router = express.Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id/get-faculties', CourseController.getCourseFaculties);
router.post('/create-course', validateRequest(createCourseZodSchema), CourseController.createCourse);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(assignFacultiesZodSchema),
  CourseController.assignFaculties
);

export const CourseRoutes = router;
