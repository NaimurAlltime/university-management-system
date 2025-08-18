import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AdminServices } from "./admin.service"

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.getSingleAdminFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is retrieved successfully",
    data: result,
  })
})

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins are retrieved successfully",
    meta: result.meta,
    data: result.result,
  })
})

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const { admin } = req.body
  const result = await AdminServices.updateAdminIntoDB(id, admin)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  })
})

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.deleteAdminFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  })
})

const getAllEnrollments = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllEnrollmentsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollments retrieved successfully",
    meta: result.meta,
    data: result.result,
  })
})

const getEnrollmentStats = catchAsync(async (req, res) => {
  const result = await AdminServices.getEnrollmentStatsFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollment statistics retrieved successfully",
    data: result,
  })
})

const enrollStudent = catchAsync(async (req, res) => {
  const result = await AdminServices.enrollStudentIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student enrolled successfully",
    data: result,
  })
})

const unenrollStudent = catchAsync(async (req, res) => {
  const { enrollmentId } = req.params
  const result = await AdminServices.unenrollStudentFromDB(enrollmentId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student unenrolled successfully",
    data: result,
  })
})

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
  getAllEnrollments,
  getEnrollmentStats,
  enrollStudent,
  unenrollStudent,
}
