import { z } from 'zod';

export const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    academicSemester: z.string({ required_error: 'academicSemester is required' }),
    status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).optional(),
    startDate: z.string(),
    endDate: z.string(),
    minCredit: z.number().int().nonnegative(),
    maxCredit: z.number().int().positive(),
  }),
});

export const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z.number().int().nonnegative().optional(),
    maxCredit: z.number().int().positive().optional(),
  }),
});
