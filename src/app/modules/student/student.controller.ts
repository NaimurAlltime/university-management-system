import { Request, Response } from "express";
import { StudentService } from "./student.service";
import studentValidationSchema from "./student.validation";

const createController = async (req: Request, res: Response) => {
  try {
    const { students: StudentData } = req.body;

    // joi validation
    const { error } = studentValidationSchema.validate(StudentData);

    // will call service function get data
    const result = await StudentService.createStudentIntuDB(StudentData);

    // joi validation error
    if (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.details,
      });
    }

    //send response
    res.status(200).json({
      success: true,
      message: "Student is created successfully",
      data: result,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentFromDB();

    //send response
    res.status(200).json({
      success: true,
      message: "Student is retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDB(studentId);

    //send response
    res.status(200).json({
      success: true,
      message: "Single Student is retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createController,
  getAllStudents,
  getSingleStudent,
};
