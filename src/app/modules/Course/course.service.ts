import { FilterQuery } from 'mongoose';
import { Course } from './course.model';
import { TCourse } from './course.interface';

export const CourseService = {
  async create(payload: TCourse) {
    return Course.create(payload);
  },

  async getAll(query: Record<string, unknown>) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<TCourse> = { isDeleted: false };

    const searchTerm = (query.searchTerm as string) || '';
    if (searchTerm) {
      (filter as any)['$or'] = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { prefix: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter),
    ]);

    return { data, meta: { total, page, limit } };
  },

  async getById(id: string) {
    return Course.findById(id);
  },

  async assignFaculties(courseId: string, faculties: string[]) {
    const unique = Array.from(new Set(faculties));
    return Course.findByIdAndUpdate(
      courseId,
      { $set: { faculties: unique } },
      { new: true }
    ).populate('faculties');
  },

  async getFaculties(courseId: string) {
    return Course.findById(courseId).populate('faculties');
  },
};
