import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const payload = {
    academicSemester: req.body.academicSemester,
    status: req.body.status ?? 'UPCOMING',
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    minCredit: req.body.minCredit,
    maxCredit: req.body.maxCredit,
  };

  const result = await SemesterRegistrationService.create(payload as any);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Semester registration created successfully',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.getAll(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registrations retrieved successfully',
    data: result.data,
    // meta: result.meta,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.getById(req.params.id);
  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Semester registration retrieved successfully' : 'Semester registration not found',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.update(req.params.id, req.body);
  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Semester registration updated successfully' : 'Semester registration not found',
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
