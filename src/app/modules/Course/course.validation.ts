import { z } from 'zod';

export const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    prefix: z.string().min(1),
    code: z.number().int().positive(),
    credits: z.number().positive(),
    preRequisiteCourses: z
      .array(
        z.object({
          course: z.string(),
          isDeleted: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

export const assignFacultiesZodSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()).nonempty(),
  }),
});
