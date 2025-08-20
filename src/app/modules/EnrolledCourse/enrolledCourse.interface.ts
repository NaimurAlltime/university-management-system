import type { Types } from "mongoose"

export type TEnrolledCourseMarks = {
  classTest1: number
  midTerm: number
  classTest2: number
  attendance: number
  finalTerm: number
}

export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId
  academicSemester: Types.ObjectId
  academicFaculty: Types.ObjectId
  academicDepartment: Types.ObjectId
  offeredCourse: Types.ObjectId
  course: Types.ObjectId
  student: Types.ObjectId
  faculty: Types.ObjectId
  isEnrolled: boolean
  courseMarks: TEnrolledCourseMarks
  grade: string
  gradePoints: number
  isCompleted: boolean
}
