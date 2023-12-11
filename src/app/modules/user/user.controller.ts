import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //data validation using zod

    const { password, students: StudentData } = req.body;

    const result = await UserService.createStudentIntuDB(password, StudentData);

    //send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student is created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createController,
};
