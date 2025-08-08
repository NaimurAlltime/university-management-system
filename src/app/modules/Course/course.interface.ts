import { Types } from 'mongoose';

export type TCoursePreReq = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses?: TCoursePreReq[];
  faculties?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
