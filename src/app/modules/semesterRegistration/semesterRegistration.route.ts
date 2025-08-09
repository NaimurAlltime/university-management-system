import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
} from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);
router.get('/:id', SemesterRegistrationController.getSingleSemesterRegistration);
router.post(
  '/create-semester-registration',
  validateRequest(createSemesterRegistrationZodSchema),
  SemesterRegistrationController.createSemesterRegistration
);
router.patch(
  '/:id',
  validateRequest(updateSemesterRegistrationZodSchema),
  SemesterRegistrationController.updateSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
