import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'SemesterRegistration',
      required: true,
    },
    section: { type: Number, required: true },
    maxCapacity: { type: Number, required: true, min: 1 },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    classDays: [
      {
        type: String,
        enum: ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'],
        required: true,
      },
    ],
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    room: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

offeredCourseSchema.index(
  { course: 1, semesterRegistration: 1, section: 1 },
  { unique: true, name: 'unique_offering_per_semester_section' }
);

export const OfferedCourse = model<TOfferedCourse>('OfferedCourse', offeredCourseSchema);
