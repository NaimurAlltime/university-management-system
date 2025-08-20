/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status"
import mongoose from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { OfferedCourse } from "../OfferedCourse/offeredCourse.model"
import { Student } from "../Student/student.model"
import { GradePoints } from "./enrolledCourse.constant"
import { EnrolledCourse } from "./enrolledCourse.model"

const createEnrolledCourseIntoDB = async (userId: string, payload: { offeredCourse: string }) => {
  /**
   * Step1: Check if the offered courses is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const { offeredCourse } = payload

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found")
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room is full")
  }

  const student = await Student.findOne({ user: userId }, { _id: 1 })

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found")
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: student._id,
  })

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, "Student is already enrolled")
  }

  // check total credits exceeds maxCredit
  const course = await mongoose.model("Course").findById(isOfferedCourseExists.course)
  const currentCredit = course?.credits

  const semesterRegistration = await mongoose
    .model("SemesterRegistration")
    .findById(isOfferedCourseExists.semesterRegistration)
  const maxCredit = semesterRegistration?.maxCredit

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    {
      $unwind: "$enrolledCourseData",
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ])

  //  total enrolled credits + new enrolled course credit > maxCredit
  const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have exceeded maximum number of credits")
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to enroll in this course")
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    })

    await session.commitTransaction()
    await session.endSession()

    return result
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getMyEnrolledCoursesFromDB = async (studentId: string, query: Record<string, unknown>) => {
  let student

  // Check if studentId is a valid ObjectId (24 character hex string)
  if (mongoose.Types.ObjectId.isValid(studentId) && studentId.length === 24) {
    // If it's a valid ObjectId, it's likely a user ID
    student = await Student.findOne({ user: studentId })
  } else {
    // If it's not a valid ObjectId, it's likely a student ID string
    student = await Student.findOne({ id: studentId })
  }

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found")
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      "semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty",
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await enrolledCourseQuery.modelQuery
  const meta = await enrolledCourseQuery.countTotal()

  return {
    data: result,
    meta,
  }
}

const updateEnrolledCourseMarksIntoDB = async (facultyId: string, payload: any) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload

  console.log("[v0] Payload received:", JSON.stringify(payload, null, 2))
  console.log("[v0] OfferedCourse ID:", offeredCourse)
  console.log("[v0] OfferedCourse ID type:", typeof offeredCourse)

  const isSemesterRegistrationExists = await mongoose.model("SemesterRegistration").findById(semesterRegistration)

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found")
  }

  if (!mongoose.Types.ObjectId.isValid(offeredCourse)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid offered course ID format")
  }

  console.log("[v0] Searching for offered course with ID:", offeredCourse)
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
  console.log("[v0] Found offered course:", isOfferedCourseExists ? "YES" : "NO")

  if (!isOfferedCourseExists) {
    const allOfferedCourses = await OfferedCourse.find({}).select("_id course").limit(5)
    console.log("[v0] Sample offered courses in DB:", allOfferedCourses)
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found")
  }

  const isStudentExists = await Student.findById(student)

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found")
  }

  const faculty = await mongoose.model("Faculty").findOne({ id: facultyId }, { _id: 1 })

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found")
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  })

  if (!isCourseBelongToFaculty) {
    const courseExists = await EnrolledCourse.findOne({
      semesterRegistration,
      offeredCourse,
      student,
    })

    if (courseExists) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to grade this course")
    } else {
      throw new AppError(httpStatus.NOT_FOUND, "Enrolled course not found for this student")
    }
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const currentMarks = isCourseBelongToFaculty.courseMarks || {}

    // Merge current marks with new marks from payload
    const updatedMarks = {
      classTest1: courseMarks.classTest1 !== undefined ? courseMarks.classTest1 : currentMarks.classTest1 || 0,
      classTest2: courseMarks.classTest2 !== undefined ? courseMarks.classTest2 : currentMarks.classTest2 || 0,
      midTerm: courseMarks.midTerm !== undefined ? courseMarks.midTerm : currentMarks.midTerm || 0,
      attendance: courseMarks.attendance !== undefined ? courseMarks.attendance : currentMarks.attendance || 0,
      finalTerm: courseMarks.finalTerm !== undefined ? courseMarks.finalTerm : currentMarks.finalTerm || 0,
    }

    console.log("[v0] Updated marks for calculation:", updatedMarks)

    const totalMarks =
      Math.ceil(updatedMarks.classTest1) +
      Math.ceil(updatedMarks.classTest2) +
      Math.ceil(updatedMarks.midTerm) +
      Math.ceil(updatedMarks.attendance) +
      Math.ceil(updatedMarks.finalTerm)

    console.log("[v0] Total calculated marks:", totalMarks)

    if (totalMarks >= 80 && totalMarks <= 100) {
      modifiedData.grade = "A+"
      modifiedData.gradePoints = GradePoints["A+"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 75 && totalMarks <= 79) {
      modifiedData.grade = "A"
      modifiedData.gradePoints = GradePoints["A"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 70 && totalMarks <= 74) {
      modifiedData.grade = "A-"
      modifiedData.gradePoints = GradePoints["A-"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 65 && totalMarks <= 69) {
      modifiedData.grade = "B+"
      modifiedData.gradePoints = GradePoints["B+"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 60 && totalMarks <= 64) {
      modifiedData.grade = "B"
      modifiedData.gradePoints = GradePoints["B"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 55 && totalMarks <= 59) {
      modifiedData.grade = "B-"
      modifiedData.gradePoints = GradePoints["B-"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 50 && totalMarks <= 54) {
      modifiedData.grade = "C+"
      modifiedData.gradePoints = GradePoints["C+"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 45 && totalMarks <= 49) {
      modifiedData.grade = "C"
      modifiedData.gradePoints = GradePoints["C"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 40 && totalMarks <= 44) {
      modifiedData.grade = "D"
      modifiedData.gradePoints = GradePoints["D"]
      modifiedData.isCompleted = true
    } else if (totalMarks >= 0 && totalMarks <= 39) {
      modifiedData.grade = "F"
      modifiedData.gradePoints = GradePoints["F"]
      modifiedData.isCompleted = true
    }

    console.log("[v0] Calculated grade:", modifiedData.grade, "Points:", modifiedData.gradePoints)
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(isCourseBelongToFaculty._id, modifiedData, {
    new: true,
  })

  return result
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
}
