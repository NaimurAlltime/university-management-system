import { z } from 'zod';

export const createOfferedCourseZodSchema = z.object({
  body: z.object({
    course: z.string(),
    semesterRegistration: z.string(),
    section: z.number().int().positive(),
    maxCapacity: z.number().int().positive(),
    faculty: z.string(),
    classDays: z.array(z.enum(['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'])).nonempty(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:mm'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'endTime must be HH:mm'),
    room: z.string().optional(),
  }),
});
