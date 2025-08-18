import { z } from "zod"

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string({
      required_error: "Offered course is required",
    }),
  }),
})

const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      required_error: "Semester registration is required",
    }),
    offeredCourse: z.string({
      required_error: "Offered course is required",
    }),
    student: z.string({
      required_error: "Student is required",
    }),
    courseMarks: z.object({
      classTest1: z.number().min(0).max(10).optional(),
      midTerm: z.number().min(0).max(30).optional(),
      classTest2: z.number().min(0).max(10).optional(),
      finalTerm: z.number().min(0).max(50).optional(),
    }),
  }),
})

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
}
