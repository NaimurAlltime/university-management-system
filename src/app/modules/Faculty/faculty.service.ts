/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status"
import mongoose from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { User } from "../User/user.model"
import { FacultySearchableFields } from "./faculty.constant"
import type { TFaculty } from "./faculty.interface"
import { Faculty } from "./faculty.model"

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find().populate("academicDepartment academicFaculty"), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await facultyQuery.modelQuery
  const meta = await facultyQuery.countTotal()
  return {
    meta,
    result,
  }
}

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate("academicDepartment academicFaculty")

  return result
}

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedFaculty = await Faculty.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty")
    }

    // get user _id from deletedFaculty
    const userId = deletedFaculty.user

    const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user")
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getFacultyDashboardFromDB = async (userId: string) => {
  // Get faculty info
  const faculty = await Faculty.findOne({ user: userId }).populate("academicDepartment academicFaculty")

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found")
  }

  // Get total courses assigned
  const totalCourses = await mongoose.model("Course").countDocuments({
    faculties: faculty._id,
  })

  // Get ongoing semester registrations
  const ongoingSemester = await mongoose
    .model("SemesterRegistration")
    .findOne({
      status: "ONGOING",
    })
    .populate("academicSemester")

  // Get offered courses for current semester
  const offeredCourses = await mongoose.model("OfferedCourse").countDocuments({
    faculty: faculty._id,
    semesterRegistration: ongoingSemester?._id,
  })

  return {
    faculty,
    totalCourses,
    ongoingSemester,
    offeredCourses,
  }
}

const getMyCoursesFromDB = async (userId: string, query: Record<string, unknown>) => {
  const faculty = await Faculty.findOne({ user: userId })

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found")
  }

  const offeredCoursesQuery = new QueryBuilder(
    mongoose
      .model("OfferedCourse")
      .find({ faculty: faculty._id })
      .populate({
        path: "semesterRegistration",
        populate: {
          path: "academicSemester",
        },
      })
      .populate({
        path: "course",
      }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await offeredCoursesQuery.modelQuery
  const meta = await offeredCoursesQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getMyStudentsFromDB = async (
  userId: string,
  semesterRegistrationId: string,
  courseId: string,
  query: Record<string, unknown>,
) => {
  const faculty = await Faculty.findOne({ user: userId })

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found")
  }

  // Verify faculty teaches this course
  const offeredCourse = await mongoose.model("OfferedCourse").findOne({
    faculty: faculty._id,
    semesterRegistration: semesterRegistrationId,
    course: courseId,
  })

  if (!offeredCourse) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not assigned to this course")
  }

  // Get enrolled students
  const enrolledCoursesQuery = new QueryBuilder(
    mongoose
      .model("EnrolledCourse")
      .find({
        semesterRegistration: semesterRegistrationId,
        offeredCourse: offeredCourse._id,
      })
      .populate({
        path: "student",
        populate: {
          path: "academicDepartment academicFaculty",
        },
      }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await enrolledCoursesQuery.modelQuery
  const meta = await enrolledCoursesQuery.countTotal()

  return {
    meta,
    result,
  }
}

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
  getFacultyDashboardFromDB,
  getMyCoursesFromDB,
  getMyStudentsFromDB,
}
