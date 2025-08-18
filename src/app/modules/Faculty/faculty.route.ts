import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../User/user.constant"
import { FacultyControllers } from "./faculty.controller"
import { updateFacultyValidationSchema } from "./faculty.validation"

const router = express.Router()

router.get("/dashboard", auth(USER_ROLE.faculty), FacultyControllers.getFacultyDashboard)
router.get("/my-courses", auth(USER_ROLE.faculty), FacultyControllers.getMyCourses)
router.get("/my-students/:semesterRegistrationId/:courseId", auth(USER_ROLE.faculty), FacultyControllers.getMyStudents)
router.get("/", auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getAllFaculties)

router.get("/:id", auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getSingleFaculty)

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
)

router.delete("/:id", auth(USER_ROLE.superAdmin, USER_ROLE.admin), FacultyControllers.deleteFaculty)

export const FacultyRoutes = router
