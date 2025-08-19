/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status"
import mongoose from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { User } from "../User/user.model"
import { AdminSearchableFields } from "./admin.constant"
import type { TAdmin } from "./admin.interface"
import { Admin } from "./admin.model"
import { EnrolledCourse } from "../EnrolledCourse/enrolledCourse.model"
import { OfferedCourse } from "../OfferedCourse/offeredCourse.model"
import { Student } from "../Student/student.model"

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await adminQuery.modelQuery
  const meta = await adminQuery.countTotal()
  return {
    result,
    meta,
  }
}

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id)
  return result
}

const getMyProfileFromDB = async (userId: string) => {
  const result = await Admin.findOne({ id: userId }).populate("user", "email")
  return result
}

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await Admin.findByIdAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedAdmin = await Admin.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student")
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.user

    const deletedUser = await User.findOneAndUpdate(userId, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user")
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedAdmin
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getAllEnrollmentsFromDB = async (query: Record<string, unknown>) => {
  const enrollmentQuery = new QueryBuilder(
    EnrolledCourse.find()
      .populate("student", "name id email")
      .populate("course", "code title credits")
      .populate("faculty", "name email")
      .populate("academicSemester", "name year")
      .populate("semesterRegistration", "status"),
    query,
  )
    .search(["student.name.firstName", "student.name.lastName", "course.code", "course.title"])
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await enrollmentQuery.modelQuery
  const meta = await enrollmentQuery.countTotal()

  return {
    result,
    meta,
  }
}

const getEnrollmentStatsFromDB = async () => {
  const totalEnrollments = await EnrolledCourse.countDocuments()
  const completedCourses = await EnrolledCourse.countDocuments({ isCompleted: true })
  const ongoingCourses = await EnrolledCourse.countDocuments({ isCompleted: false })
  const activeCourses = await OfferedCourse.countDocuments()

  const gradeDistribution = await EnrolledCourse.aggregate([
    {
      $group: {
        _id: "$grade",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        grade: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ])

  const topCourses = await EnrolledCourse.aggregate([
    {
      $group: {
        _id: "$course",
        enrollmentCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "offeredcourses",
        localField: "_id",
        foreignField: "course",
        as: "offeredCourse",
      },
    },
    {
      $unwind: "$offeredCourse",
    },
    {
      $project: {
        course: 1,
        enrollmentCount: 1,
        maxCapacity: "$offeredCourse.maxCapacity",
      },
    },
    {
      $sort: { enrollmentCount: -1 },
    },
    {
      $limit: 5,
    },
  ])

  return {
    totalEnrollments,
    completedCourses,
    ongoingCourses,
    activeCourses,
    gradeDistribution,
    topCourses,
  }
}

const enrollStudentIntoDB = async (payload: { studentId: string; offeredCourses: string[] }) => {
  const { studentId, offeredCourses } = payload

  if (!studentId || !offeredCourses || offeredCourses.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Student ID and offered courses are required")
  }

  const student = await Student.findById(studentId).populate("academicFaculty").populate("academicDepartment")
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found")
  }

  const session = await mongoose.startSession()
  const enrollmentResults = []

  try {
    session.startTransaction()

    for (const offeredCourseId of offeredCourses) {
      const offeredCourseData = await OfferedCourse.findById(offeredCourseId)
        .populate({
          path: "semesterRegistration",
          populate: [{ path: "academicSemester" }],
        })
        .session(session)

      if (!offeredCourseData) {
        throw new AppError(httpStatus.NOT_FOUND, `Offered course ${offeredCourseId} not found`)
      }

      const semesterReg = offeredCourseData.semesterRegistration as any
      if (!semesterReg || !semesterReg.academicSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, "Offered course is missing required academic semester information")
      }

      const existingEnrollment = await EnrolledCourse.findOne({
        student: studentId,
        offeredCourse: offeredCourseId,
      }).session(session)

      if (existingEnrollment) {
        throw new AppError(httpStatus.CONFLICT, `Student is already enrolled in course ${offeredCourseData.course}`)
      }

      try {
        const enrollment = await EnrolledCourse.create(
          [
            {
              semesterRegistration: offeredCourseData.semesterRegistration,
              academicSemester: semesterReg.academicSemester._id,
              academicFaculty: student.academicFaculty,
              academicDepartment: student.academicDepartment,
              offeredCourse: offeredCourseId,
              course: offeredCourseData.course,
              student: studentId,
              faculty: offeredCourseData.faculty,
              isEnrolled: true,
              grade: "NA", // Explicitly set grade to NA for new enrollments
              gradePoints: 0,
            },
          ],
          { session },
        )

        enrollmentResults.push(enrollment[0])
      } catch (validationError: any) {
        if (validationError.name === "ValidationError") {
          const errorMessages = Object.values(validationError.errors).map((err: any) => err.message)
          throw new AppError(httpStatus.BAD_REQUEST, `Enrollment validation failed: ${errorMessages.join(", ")}`)
        }
        throw validationError
      }
    }

    await session.commitTransaction()
    return enrollmentResults
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
  }
}

const unenrollStudentFromDB = async (enrollmentId: string) => {
  const enrollment = await EnrolledCourse.findById(enrollmentId)
  if (!enrollment) {
    throw new AppError(httpStatus.NOT_FOUND, "Enrollment not found")
  }

  const result = await EnrolledCourse.findByIdAndDelete(enrollmentId)
  return result
}

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  getMyProfileFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  getAllEnrollmentsFromDB,
  getEnrollmentStatsFromDB,
  enrollStudentIntoDB,
  unenrollStudentFromDB,
}
