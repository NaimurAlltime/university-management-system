import type { FilterQuery } from "mongoose"
import { OfferedCourse } from "./offeredCourse.model"
import type { TOfferedCourse } from "./offeredCourse.interface"
import { Student } from "../Student/student.model"
import { EnrolledCourse } from "../EnrolledCourse/enrolledCourse.model"

export const OfferedCourseService = {
  async create(payload: TOfferedCourse) {
    return OfferedCourse.create(payload)
  },

  async getAll(query: Record<string, unknown>) {
    const page = Number(query.page ?? 1)
    const limit = Number(query.limit ?? 10)
    const skip = (page - 1) * limit

    const filter: FilterQuery<TOfferedCourse> = {}

    if (query.course) filter.course = query.course as any
    if (query.semesterRegistration) filter.semesterRegistration = query.semesterRegistration as any
    if (query.faculty) filter.faculty = query.faculty as any
    if (query.isActive !== undefined) filter.isActive = query.isActive === "true"

    const [data, total] = await Promise.all([
      OfferedCourse.find(filter)
        .populate([
          { path: "course" },
          { path: "faculty", select: "name email" },
          {
            path: "semesterRegistration",
            populate: { path: "academicSemester" },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OfferedCourse.countDocuments(filter),
    ])

    return { data, meta: { total, page, limit } }
  },

  async getMyOfferedCourses(userId: string, query: Record<string, unknown>) {
    const page = Number(query.page ?? 1)
    const limit = Number(query.limit ?? 10)
    const skip = (page - 1) * limit

    // Find the student
    const student = await Student.findOne({ id: userId })
    if (!student) {
      throw new Error("Student not found")
    }

    const filter: FilterQuery<TOfferedCourse> = {
      isActive: true, // Only show active offered courses
    }

    if (query.course) filter.course = query.course as any
    if (query.semesterRegistration) filter.semesterRegistration = query.semesterRegistration as any

    // Get all offered courses
    const [offeredCourses, total] = await Promise.all([
      OfferedCourse.find(filter)
        .populate([
          { path: "course" },
          { path: "faculty", select: "name email" },
          {
            path: "semesterRegistration",
            populate: { path: "academicSemester" },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OfferedCourse.countDocuments(filter),
    ])

    // Get student's enrolled courses
    const enrolledCourses = await EnrolledCourse.find({
      student: student._id,
      isEnrolled: true,
    }).populate("offeredCourse")

    // Get enrolled course IDs for quick lookup
    const enrolledOfferedCourseIds = new Set(
      enrolledCourses.map((ec: any) => ec.offeredCourse?._id?.toString()).filter(Boolean),
    )

    // Get enrollment counts for each offered course
    const enrollmentCounts = await EnrolledCourse.aggregate([
      { $match: { isEnrolled: true } },
      { $group: { _id: "$offeredCourse", count: { $sum: 1 } } },
    ])

    const enrollmentCountMap = new Map(enrollmentCounts.map((item: any) => [item._id.toString(), item.count]))

    // Enhance offered courses with student-specific data
    const enhancedCourses = offeredCourses.map((course: any) => {
      const courseObj = course.toObject()
      const courseId = course._id.toString()

      return {
        ...courseObj,
        isAlreadyEnrolled: enrolledOfferedCourseIds.has(courseId),
        enrolledCourses: Array(enrollmentCountMap.get(courseId) || 0).fill({}), // Mock enrolled courses array for count
        isPreRequisitesFulFilled: true, // TODO: Implement prerequisite checking logic
        academicDepartment: student.academicDepartment, // Add student's department
        days: courseObj.classDays || [], // Map classDays to days for frontend compatibility
      }
    })

    return {
      data: enhancedCourses,
      meta: { total, page, limit },
    }
  },
}
