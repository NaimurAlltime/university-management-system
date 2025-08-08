import { FilterQuery } from 'mongoose';
import { OfferedCourse } from './offeredCourse.model';
import { TOfferedCourse } from './offeredCourse.interface';

export const OfferedCourseService = {
  async create(payload: TOfferedCourse) {
    return OfferedCourse.create(payload);
  },

  async getAll(query: Record<string, unknown>) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<TOfferedCourse> = {};

    if (query.course) filter.course = query.course as any;
    if (query.semesterRegistration) filter.semesterRegistration = query.semesterRegistration as any;
    if (query.faculty) filter.faculty = query.faculty as any;
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

    const [data, total] = await Promise.all([
      OfferedCourse.find(filter)
        .populate([
          { path: 'course' },
          { path: 'faculty', select: 'name email' },
          {
            path: 'semesterRegistration',
            populate: { path: 'academicSemester' },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OfferedCourse.countDocuments(filter),
    ]);

    return { data, meta: { total, page, limit } };
  },
};
