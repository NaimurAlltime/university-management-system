import express from "express"
import validateRequest from "../../middlewares/validateRequest"
import { OfferedCourseController } from "./offeredCourse.controller"
import { createOfferedCourseZodSchema } from "./offeredCourse.validation"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../User/user.constant"

const router = express.Router()

router.get("/", OfferedCourseController.getAllOfferedCourses)

router.get("/my-offered-courses", auth(USER_ROLE.student), OfferedCourseController.getMyOfferedCourses)

router.post(
  "/create-offered-course",
  validateRequest(createOfferedCourseZodSchema),
  OfferedCourseController.createOfferedCourse,
)

export const OfferedCourseRoutes = router
