import { Schema, model } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'ENDED'],
      required: true,
      default: 'UPCOMING',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, required: true },
    maxCredit: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Basic validation constraints
semesterRegistrationSchema.pre('save', function (next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('startDate must be before endDate'));
  }
  if (this.minCredit > this.maxCredit) {
    return next(new Error('minCredit cannot be greater than maxCredit'));
  }
  return next();
});

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema
);
