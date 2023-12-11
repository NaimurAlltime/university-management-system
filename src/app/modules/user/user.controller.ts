import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
  const { password, students: StudentData } = req.body;

  const result = await UserService.createStudentIntuDB(password, StudentData);

  //send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
