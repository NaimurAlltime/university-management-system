import { Request, Response } from "express";
import { UserService } from "./user.service";

const createController = async (req: Request, res: Response) => {
  try {
    //data validation using zod

    const { password, students: StudentData } = req.body;

    const result = await UserService.createStudentIntuDB(password, StudentData);

    //send response
    res.status(200).json({
      success: true,
      message: "Student is created successfully",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

export const UserControllers = {
  createController,
};
