import QueryBuilder from '../../builder/QueryBuilder';
import { SemesterRegistration } from './semesterRegistration.model';
import { TSemesterRegistration } from './semesterRegistration.interface';

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .search(['status']) // optional: allow search by status
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await builder.modelQuery;
  const meta = await builder.countTotal();

  return { result, meta };
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const result = await SemesterRegistration.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findByIdAndDelete(id);
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
