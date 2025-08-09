import { FilterQuery } from 'mongoose';
import { SemesterRegistration } from './semesterRegistration.model';
import { TSemesterRegistration } from './semesterRegistration.interface';

export const SemesterRegistrationService = {
  async create(payload: TSemesterRegistration) {
    return SemesterRegistration.create(payload);
  },

  async getAll(query: Record<string, unknown>) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<TSemesterRegistration> = {};
    if (query.status) filter.status = query.status as any;
    if (query.academicSemester) filter.academicSemester = query.academicSemester as any;

    const [data, total] = await Promise.all([
      SemesterRegistration.find(filter)
        .populate('academicSemester')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SemesterRegistration.countDocuments(filter),
    ]);

    return {
      data,
      meta: { total, page, limit },
    };
  },

  async getById(id: string) {
    return SemesterRegistration.findById(id).populate('academicSemester');
  },

  async update(id: string, payload: Partial<TSemesterRegistration>) {
    return SemesterRegistration.findByIdAndUpdate(
      id,
      {
        ...payload,
        // convert date strings to Date if provided
        ...(payload.startDate ? { startDate: new Date(payload.startDate) } : {}),
        ...(payload.endDate ? { endDate: new Date(payload.endDate) } : {}),
      },
      { new: true }
    ).populate('academicSemester');
  },
};
