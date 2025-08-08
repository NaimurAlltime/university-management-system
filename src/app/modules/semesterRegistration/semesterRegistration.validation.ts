import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

export const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string({ required_error: 'Academic semester is required' }),
    status: z.enum([...SemesterRegistrationStatus] as [string, ...string[]]).optional(),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string({ required_error: 'End date is required' }),
    minCredit: z.number({ invalid_type_error: 'minCredit must be a number' }),
    maxCredit: z.number({ invalid_type_error: 'maxCredit must be a number' }),
  }),
});

export const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z.enum([...SemesterRegistrationStatus] as [string, ...string[]]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
