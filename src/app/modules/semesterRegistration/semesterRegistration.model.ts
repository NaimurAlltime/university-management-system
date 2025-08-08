import { Schema, model } from 'mongoose';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: [true, 'Academic semester is required'],
    },
    status: {
      type: String,
      enum: {
        values: SemesterRegistrationStatus,
        message: '{VALUE} is not a valid semester registration status',
      },
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    minCredit: {
      type: Number,
      required: [true, 'Minimum credit is required'],
      min: [1, 'Minimum credit must be at least 1'],
    },
    maxCredit: {
      type: Number,
      required: [true, 'Maximum credit is required'],
      min: [1, 'Maximum credit must be at least 1'],
    },
  },
  { timestamps: true }
);

// Basic sanity check: minCredit <= maxCredit
semesterRegistrationSchema.pre('save', function (next) {
  if (this.minCredit > this.maxCredit) {
    next(new Error('Minimum credit cannot be greater than maximum credit'));
  } else {
    next();
  }
});

semesterRegistrationSchema.pre('findOneAndUpdate', function (next) {
  const update: any = this.getUpdate() || {};
  const min = update.minCredit;
  const max = update.maxCredit;

  if (min !== undefined && max !== undefined && min > max) {
    return next(new Error('Minimum credit cannot be greater than maximum credit'));
  }
  next();
});

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
