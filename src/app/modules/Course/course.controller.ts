import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getAll(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    // meta: result?.meta,
    data: result.data,
  });
});

const assignFaculties = catchAsync(async (req, res) => {
  const result = await CourseService.assignFaculties(req.params.courseId, req.body.faculties);
  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Faculties assigned successfully' : 'Course not found',
    data: result,
  });
});

const getCourseFaculties = catchAsync(async (req, res) => {
  const course = await CourseService.getFaculties(req.params.id);
  sendResponse(res, {
    statusCode: course ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!course,
    message: course ? 'Course faculties retrieved successfully' : 'Course not found',
    data: course?.faculties ?? [],
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  assignFaculties,
  getCourseFaculties,
};
