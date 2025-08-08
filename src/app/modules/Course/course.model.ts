import { Schema, model } from 'mongoose';
import { TCourse } from './course.interface';

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, trim: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true },
    credits: { type: Number, required: true, min: 0 },
    preRequisiteCourses: [
      {
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        isDeleted: { type: Boolean, default: false },
      },
    ],
    faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseSchema.index({ prefix: 1, code: 1 }, { unique: true });

export const Course = model<TCourse>('Course', courseSchema);
