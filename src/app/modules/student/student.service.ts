import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntuDB = async (studentData: TStudent) => {
  //custom static method
  if (await Student.isUserExists(studentData.id)) {
    throw new Error("User already exists!");
  }

  //build in static method
  const result = await Student.create(studentData);

  // // build in instance method
  // const student = new Student(studentData);

  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error("User already exists!");
  // }

  // const result = await student.save();
  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const StudentService = {
  createStudentIntuDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
};
