 import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationControllers.getAllSemesterRegistrations,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
