import { Router } from "express"
import { AdminRoutes } from "../modules/Admin/admin.route"
import { AuthRoutes } from "../modules/Auth/auth.route"
import { AcademicDepartmentRoutes } from "../modules/AcademicDepartment/academicDepartment.route"
import { AcademicFacultyRoutes } from "../modules/AcademicFaculty/academicFaculty.route"
import { AcademicSemesterRoutes } from "../modules/AcademicSemester/academicSemester.route"
import { FacultyRoutes } from "../modules/Faculty/faculty.route"
import { StudentRoutes } from "../modules/Student/student.route"
import { UserRoutes } from "../modules/User/user.route"
import { CourseRoutes } from "../modules/Course/course.route"
import { OfferedCourseRoutes } from "../modules/OfferedCourse/offeredCourse.route"
import { SemesterRegistrationRoutes } from "../modules/SemesterRegistration/semesterRegistration.route"
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/enrolledCourse.route"

const router = Router()

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoutes,
  },
  {
    path: "/semester-registrations",
    route: SemesterRegistrationRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
