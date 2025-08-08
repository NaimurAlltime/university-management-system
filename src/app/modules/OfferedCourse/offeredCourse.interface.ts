import { Types } from 'mongoose';

export type TClassDay = 'SAT' | 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';

export type TOfferedCourse = {
  course: Types.ObjectId;
  semesterRegistration: Types.ObjectId;
  section: number;
  maxCapacity: number;
  faculty: Types.ObjectId;
  classDays: TClassDay[];
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  room?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
