import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  AcademicDepartmentValidationSchema,
  UpdateAcademicDepartmentValidationSchema,
} from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const route = express.Router();

route.post(
  '/',
  auth(USER_ROLES.admin),
  validateRequest(AcademicDepartmentValidationSchema),
  AcademicDepartmentController.createAcademicDepartment,
);
route.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  AcademicDepartmentController.getAllAcademicDepartments,
);
route.get(
  '/:id',
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  AcademicDepartmentController.getSingleAcademicDepartment,
);
route.patch(
  '/:id',
  auth(USER_ROLES.admin),
  validateRequest(UpdateAcademicDepartmentValidationSchema),
  AcademicDepartmentController.updateAcademicDepartment,
);
route.delete(
  '/:id',
  auth(USER_ROLES.admin),
  AcademicDepartmentController.deleteAcademicDepartment,
);

export const AcademicDepartmentRoutes = route;
